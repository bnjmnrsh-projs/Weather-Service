/**
 * The Weather Service
 * @author bnjmnrsh@gmail.com
 *
 * @param {object} [_oSettings={}]
 */

const weatherApp = function (_oSettings = {}) {
    const _oDefaults = {
        target: '#app',
        KEY: '',
        units: 'M',
        forcast: `{{forcast}}`,
        airaForcast: `The weather is currently: {{forcast}} at {{temp}}.`,
        location: `{{city}}, {{country}}`,
        debug: false,
    }

    // Merge settings with defaults
    _oSettings = Object.assign(_oDefaults, _oSettings)

    if (!_oSettings.KEY) {
        console.warn('An API key from weatherbit.io is required.')
        return
    }

    // API urls
    const sIpapiLocationApi = 'https://ipapi.co/json/'
    const sWeatherApi = `https://api.weatherbit.io/v2.0/current?key=${_oSettings.KEY}`
    const sFocastApi = `https://api.weatherbit.io/v2.0/forecast/hourly?key=${_oSettings.KEY}&hours=48`

    // DOM Target
    const nApp = document.querySelector(_oSettings.target)

    // SVGs staged in HTML for details section,
    // the remainder inlined(except Cloudcover & Moon, loaded dynamically)
    const nIcons = document.querySelector('#svgs')
    // degrees/compass inline
    const nWind = nIcons.querySelector('.svg-wi-strong-wind').outerHTML
    const nSnow = nIcons.querySelector('.svg-wi-snow').outerHTML
    // cloud lodaded dynamically
    const nRaindrop = nIcons.querySelector('.svg-wi-raindrop').outerHTML
    const nBinoculars = nIcons.querySelector('.svg-binoculars').outerHTML
    const nSunrise = nIcons.querySelector('.svg-wi-sunrise').outerHTML
    const nSunset = nIcons.querySelector('.svg-wi-sunset').outerHTML
    // moon phases loaded as img

    const oWeatherIcons = {
        200: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
        201: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
        202: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
        230: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
        231: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
        232: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
        233: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
        300: ['wi-day-rain', 'wi-night-alt-rain'],
        301: ['wi-day-rain', 'wi-night-alt-rain'],
        302: ['wi-day-rain', 'wi-night-alt-rain'],
        500: ['wi-day-rain', 'wi-night-alt-rain'],
        501: ['wi-day-rain', 'wi-night-alt-rain'],
        502: ['wi-day-rain-wind', 'wi-night-alt-rain-wind'],
        511: ['wi-day-sleet', 'wi-night-alt-sleet'],
        520: ['wi-day-showers', 'wi-night-alt-showers'],
        521: ['wi-day-showers', 'wi-night-alt-showers'],
        522: ['wi-day-rain', 'wi-night-alt-rain'],
        600: ['wi-day-snow', 'wi-night-alt-snow'],
        602: ['wi-day-snow', 'wi-night-alt-snow'],
        610: ['wi-day-snow-thunderstorm', 'wi-night-alt-snow-thunderstorm'],
        611: ['wi-day-snow-wind', 'wi-night-alt-snow-wind'],
        612: ['wi-day-snow-wind', 'wi-night-alt-snow-wind'],
        622: ['wi-day-snow-thunderstorm', 'wi-night-alt-snow-thunderstorm'],
        623: ['wi-day-snow', 'wi-night-alt-snow'],
        700: ['wi-day-fog', 'wi-night-fog'],
        711: ['wi-day-fog', 'wi-night-fog'],
        721: ['wi-day-fog', 'wi-night-fog'],
        731: ['wi-day-fog', 'wi-night-fog'],
        741: ['wi-day-fog', 'wi-night-fog'],
        751: ['wi-day-fog', 'wi-night-fog'],
        800: ['wi-day-sunny', 'wi-night-clear'],
        801: ['wi-day-cloudy', 'wi-night-alt-cloudy'],
        802: ['wi-day-cloudy-high', 'wi-night-alt-cloudy-high'],
        803: ['wi-day-cloudy-high', 'wi-night-partly-cloudy'],
        804: ['wi-cloudy', 'wi-cloudy'],
        900: ['wi-rain-mix', 'wi-rain-mix'],
    }

    const oCloudCoverIcons = {
        0: ['wi-day-sunny', 'wi-night-clear'],
        1: ['wi-day-cloudy-high', 'wi-night-alt-cloudy-high'],
        2: ['wi-day-sunny-overcast', 'wi-night-partly-cloudy'],
        3: ['wi-cloud', 'wi-cloud'],
        4: ['wi-cloudy', 'wi-cloudy'],
        5: ['dark-cloudy', 'dark-cloudy'],
    }

    /**
     * Sanitise incoming API data
     *
     * @param {string} [dirty='']
     * @returns {string} sanitised text
     */
    const fClean = function (dirty = '') {
        if (typeof dirty === 'number') return dirty
        if (!dirty) return

        temp = document.createElement('div')
        temp.innerHTML = dirty
        return temp.innerText
    }

    /**
     * IP address based location API
     *
     * @returns {object} coordiantes object
     */
    const fIPapi = async function () {
        resp = await fetch(sIpapiLocationApi).then(function (resp) {
            if (resp.ok) {
                return resp.json()
            } else {
                return Promise.reject(resp)
            }
        })
        return await resp
    }

    /**
     * Browser based location API
     *
     * @returns {object} coordiantes object
     */
    const fGeoLocApi = async function () {
        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }

        resp = new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(
                function (resp) {
                    resolve(resp.coords)
                },
                function (resp) {
                    reject(resp)
                },
                options
            )
        })
        return await resp
    }

    /**
     * Gets the user location
     *
     * @param {string} [section='home']
     */
    const fGetLocation = async function () {
        if (navigator.geolocation) {
            try {
                _oSettings.debug
                    ? console.log('Checking geoLoccation API.')
                    : ''
                return await fGeoLocApi()
            } catch (e) {
                _oSettings.debug
                    ? console.warn('fGetLocation fGeoLocApi: ', e)
                    : ''
                try {
                    _oSettings.debug
                        ? console.warn('Falling back to IP lookup.')
                        : ''
                    return await fIPapi()
                } catch (e) {
                    _oSettings.debug
                        ? console.warn('fGetLocation IP API: ', e)
                        : ''
                }
            }
        }
    }

    /**
     *
     *
     * @param {string} urlBase [sWeatherApi || sFocastApi]
     * @param {obj} loc [response from location API]
     * @returns {string} Assembled url with query (cleaned)
     */
    const fAssembledQuery = function (urlBase, loc) {
        if (!loc) return

        let sApiQuery = `${urlBase}&lat=${loc.latitude}&lon=${loc.longitude}`

        if (!loc.latitude || !loc.longitude) {
            let sCity,
                sState,
                sCountry = ''

            if ('city' in loc && loc.city) {
                sCity = `&city=${loc.city}`
            }
            if ('state' in loc && loc.state) {
                sState = `&state=${loc.state}`
            }
            if ('country' in loc && loc.country_code) {
                sCountry = `&country=${loc.country_code}`
            }

            sApiQuery = `${urlBase}${sCity ?? ''}${sState ?? ''}${
                sCountry ?? ''
            }`
        }

        _oSettings.debug
            ? console.log('sApiQuery query:', fClean(sApiQuery))
            : ''

        return fClean(sApiQuery)
    }

    /**
     * Fetch the weather for a user's location.
     *
     * @param {object} loc
     * @returns {object} weather object
     */
    const fGetWeather = async function (loc) {
        const resp = await fetch(fAssembledQuery(sWeatherApi, loc)).then(
            function (resp) {
                if (resp.ok) {
                    return resp.json()
                } else {
                    return Promise.reject(resp)
                }
            }
        )
        return await resp
    }

    /**
     * Fetch the 48h forcast based on a user's location
     *
     * @param {object} loc coordiantes object
     * @returns {object} hourly forcast weather object
     */
    const fGetForcast = async function (loc) {
        const resp = await fetch(fAssembledQuery(sFocastApi, loc)).then(
            function (resp) {
                if (resp.ok) {
                    return resp.json()
                } else {
                    console.error(resp)
                    nApp.innerHTML = fErrorDisplay(resp)

                    return Promise.reject(resp)
                }
            }
        )
        return await resp
    }

    /**
     * Returns the string name of the weather icon
     *
     * @param {object} data Either the current or hourly forcast weather object
     * @param {string || int} [hour]
     * @returns string
     */
    const getWeatherIcon = function (data, hour) {
        if (!data) return

        let code, pod
        if (!hour) {
            // Current weather object
            pod = fClean(data.pod) === 'd' ? 0 : 1
            code = parseInt(fClean(data.weather.code))
        } else {
            // Forcast weather object
            pod = fClean(data[hour].pod) === 'd' ? 0 : 1
            code = parseInt(fClean(data[hour].weather.code))
        }
        return oWeatherIcons[code][pod]
    }

    /**
     * Select the cloud coverage icon based on percentage value
     *
     * @param {int} coverage A percentage figure 0-100
     * @param {string} pod Point of Day
     * @returns {string} the string name of the icon
     */
    const getCloudCoverIcon = function (coverage, pod = 'd') {
        if (typeof coverage !== 'number') return

        // set day or night icon set
        pod = pod = 'd' ? 0 : 1

        const icons = oCloudCoverIcons

        coverage = parseInt(coverage)

        let aIconData = ''

        switch (coverage) {
            case coverage >= 0 && coverage < 16 ? coverage : null:
                aIconData = [icons[0][pod], 0]
                break
            case coverage >= 16 && coverage < 32 ? coverage : null:
                aIconData = [icons[1][pod], 1]
                break
            case coverage >= 32 && coverage < 48 ? coverage : null:
                aIconData = [icons[2][pod], 2]
                break
            case coverage >= 48 && coverage < 65 ? coverage : null:
                aIconData = [icons[3][pod], 3]
                break
            case coverage >= 65 && coverage < 83 ? coverage : null:
                aIconData = [icons[4][pod], 4]
                break
            case coverage >= 83 && coverage <= 100 ? coverage : null:
                aIconData = [icons[5][pod], 5]
                break
        }
        aIconData.push(
            document.querySelector(`#svgs .svg-${aIconData[0]}`).outerHTML
        )

        return aIconData
    }

    /**
     * *NOTE: the API has parms for both imperial and metric units, however,
     * we do the conversion ourselves so that we can switch without additional api calls.
     */

    /**
     * mm/hr to inch/hr
     *
     * @param {float} measure
     * @returns {string} converted measurement as string with units
     */
    const fPercipConvert = function (measure) {
        if (typeof measure !== 'number') return 0

        if (measure === 0) {
            return measure
        }

        if (_oSettings.units === 'M') {
            return `${parseFloat(measure).toFixed(2)}&nbsp;mm/hr`
        } else {
            return `${(parseFloat(measure) * 0.0393701).toFixed(
                2
            )}&nbsp;inch/hr`
        }
    }

    /**
     * 24H to 12H conversion
     * https://stackoverflow.com/a/58878443/362445
     *
     * @param {string} time24
     * @returns {string} converted time as string with units
     */
    const fTimeConvert = function (time24) {
        if (!time24) return

        if (_oSettings.units === 'M') return time24

        const [sHours, minutes] = time24
            .match(/([0-9]{1,2}):([0-9]{2})/)
            .slice(1)
        const period = +sHours < 12 ? 'AM' : 'PM'
        const hours = +sHours % 12 || 12

        return `${hours}:${minutes}&nbsp;${period}`
    }

    /**
     * C to F conversion
     *
     * @param {float} measure
     * @returns {string || number} converted tepm as string with units, or as a Float
     */
    const fTempConvert = function (measure, withUnits = true) {
        if (typeof measure !== 'number') return 0
        if (_oSettings.units === 'M') {
            let converted = parseFloat(measure).toFixed(1)
            return withUnits ? `${converted}°&nbsp;C` : converted
        } else {
            let converted = ((parseFloat(measure) * 9) / 5 + 32).toFixed(1)
            return withUnits ? `${converted}°&nbsp;F` : converted
        }
    }

    /**
     * km/hr to mi/hr
     *
     * @param {float} measure
     * @returns {string} converted wind speed as string with units
     */
    const fKmPerHourConvert = function (measure) {
        if (typeof measure !== 'number') return 0

        if (_oSettings.units === 'M') {
            return `${(parseFloat(measure) * 3.6000059687997).toFixed(
                2
            )}&nbsp;km/hr`
        } else {
            return `${(parseFloat(measure) * 2.23694).toFixed(2)}&nbsp;mi/hr`
        }
    }

    /**
     * km to mi
     *
     * @param {float} measure
     * @returns {string} converted distance as string with units
     */
    const fKmConvert = function (measure) {
        if (typeof measure !== 'number') return 0
        if (_oSettings.units === 'M') {
            return `${parseFloat(measure).toFixed(2)}&nbsp;km`
        } else {
            return `${(parseFloat(measure) * 0.621371).toFixed(2)}&nbsp;mile`
        }
    }

    /**
     * Generate a visual scale based on 5km
     *
     * @param {float} vis
     */
    const fSetVisabilityScale = function (vis) {
        const distance = (parseFloat(vis) / 5) * 100

        const nGraph = app.querySelector('.distance')
        nGraph.style.setProperty('--distance', 100 - distance + '%')
    }

    /**
     * Assigns a named string based on temperature in C
     * 6 step scale for data-temp
     *
     * @param {float} temp
     * @returns {string}   string
     */
    const fTempDataPt = function (temp) {
        if (typeof temp !== 'number') return 0

        temp = parseFloat(temp)
        // temp = 100

        let sTempScale = ''
        switch (temp) {
            case temp <= 0 ? temp : null:
                sTempScale = 0
                break
            case temp >= 0 && temp < 10 ? temp : null:
                sTempScale = 1
                break
            case temp >= 10 && temp < 22 ? temp : null:
                sTempScale = 2
                break
            case temp >= 22 && temp < 27 ? temp : null:
                sTempScale = 3
                break
            case temp >= 27 && temp < 34 ? temp : null:
                sTempScale = 4
                break
            case temp >= 34 ? temp : null:
                sTempScale = 5
                break
        }
        return sTempScale
    }

    /**
     * Assigns a uv scale value based uv reading
     *
     * @param {float} temp
     * @returns {int}  whole int value on  6 step scale
     */
    const fUvDataPt = function (uv) {
        if (!temp) return
        uv = parseFloat(uv)

        let uvClass = 'none'
        switch (uv) {
            case uv < 10 ? uv : null:
                uvClass = 0
                break
            case uv >= 10 && uv < 30 ? uv : null:
                uvClass = 1
                break
            case uv >= 30 && uv < 50 ? uv : null:
                uvClass = 2
                break
            case uv >= 50 && uv < 70 ? uv : null:
                uvClass = 3
                break
            case uv >= 70 && uv < 90 ? uv : null:
                uvClass = 4
                break
            case uv >= 90 || uv <= 100 ? uv : null:
                uvClass = 5
                break
        }
        return uvClass
    }

    /**
     * https://gist.github.com/endel/dfe6bb2fbe679781948c#gistcomment-2811037
     *
     * TODO: Moon.phase requres the date values to be passed as strings. Update toaccept a date object.
     *
     * @param {Date Object || date string} Date Object or valid String to make date object from.
     * @returns {object} Moon phase object
     */
    const fMoonPhase = function (date) {
        const Moon = {
            phases: [
                'new',
                'waxing-crescent',
                'first-quarter',
                'waxing-gibbous',
                'full',
                'waning-gibbous',
                'third-quarter',
                'waning-crescent',
            ],
            phase: function (year, month, day) {
                let c = (e = jd = b = 0)

                if (month < 3) {
                    year--
                    month += 12
                }

                ++month
                c = 365.25 * year
                e = 30.6 * month
                jd = c + e + day - 694039.09 // jd is total days elapsed
                jd /= 29.5305882 // divide by the moon cycle
                b = parseInt(jd) // int(jd) -> b, take integer part of jd
                jd -= b // subtract integer part to leave fractional part of original jd
                b = Math.round(jd * 8) // scale fraction from 0-8 and round

                if (b >= 8) b = 0 // 0 and 8 are the same so turn 8 into 0
                return { phase: b, name: Moon.phases[b] }
            },
        }

        // if no date, create date based on current system date
        date = date || new Date()

        // if provided a string, try to make a new Date object
        date = date instanceof String ? new Date(date) : date

        // test our date object
        if (!date || typeof date.getMonth !== 'function') {
            throw new Error('fMoonPhase provided invalid date')
        }

        //https://stackoverflow.com/a/2998874/362445
        const zeroPad = (num, places) => String(num).padStart(places, '0')

        const yyyy = zeroPad(parseInt(date.getFullYear(), 10), 4)
        const mm = zeroPad(parseInt(date.getMonth() + 1, 10), 2)
        const dd = zeroPad(parseInt(date.getDate(), 10), 2)

        const oMoonPhase = Moon.phase(yyyy, mm, dd)

        _oSettings.debug
            ? console.log(
                  'fMoonPhase date (yyyy mm dd): ',
                  `  ${yyyy} ${mm} ${dd}`
              )
            : ''
        _oSettings.debug ? console.log('fMoonPhase result: ', oMoonPhase) : ''

        return oMoonPhase
    }

    /**
     * Perform string replacement for UI strings.
     *
     * @param {string} string
     * @param {object} data
     * @returns {string} Formatted string
     */
    const fFormatUIstr = function (string, data) {
        if (!string) return ''
        return string
            .replace('{{forcast}}', fClean(data.weather.description))
            .replace('{{temp}}', fTempConvert(fClean(data.temp)))
            .replace('{{city}}', fClean(data.city_name))
            .replace('{{country}}', fClean(data.country_code))
    }

    /**
     * Renders the app's header
     *
     * @param {array} data
     * @returns {string}
     */
    const fRenderHUD = function (data) {
        const sIcon = getWeatherIcon(data[0])
        return `
        <header id="hud" class="" data-temp="${fTempDataPt(data[0].temp)}">
            <h3><img class="weather-icon" alt="${fFormatUIstr(
                _oSettings.airaForcast,
                data[0]
            )}" src="./icons/weather/svg/${sIcon}.svg" /><span aria-hidden="true">${fTempConvert(
            fClean(data[0].temp)
        )}</span></h3>
            <ul class="unstyled">
                <li aria-hidden="true">
                    ${fFormatUIstr(_oSettings.forcast, data[0]).toLowerCase()}
                </li>
                <li>
                    ${fFormatUIstr(_oSettings.location, data[0])}
                </li>
            </ul>
        </header>
        `
    }

    /**
     * Renders the app's details secection
     *
     * @param {array} data
     * @returns {string}
     */
    const fRenderDetails = function (data) {
        const sWindDirection = fClean(data[0].wind_cdir_full)
        const sWindDeg = fClean(data[0].wind_dir)
        const iconCloud = getCloudCoverIcon(data[0].clouds)
        const oMoon = fMoonPhase(data[0].obj_time)

        return `
        <div id="details">
            <ul class="unstyled">
                <li class="feels-like">
                <span class="left-col">Feels like:
                    ${fTempConvert(fClean(data[0].app_temp))}
                </span>
                <svg alt="" height="25" width="25" class="inline-icon svg-wi-thermometer" data-temp="${fTempDataPt(
                    fClean(data[0].app_temp)
                )}" enable-background="new 0 0 30 30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="m9.91 19.56c0-.85.2-1.64.59-2.38s.94-1.35 1.65-1.84v-9.92c0-.8.27-1.48.82-2.03s1.23-.84 2.03-.84c.81 0 1.49.28 2.04.83.55.56.83 1.23.83 2.03v9.92c.71.49 1.25 1.11 1.64 1.84s.58 1.53.58 2.38c0 .92-.23 1.78-.68 2.56s-1.07 1.4-1.85 1.85-1.63.68-2.56.68c-.92 0-1.77-.23-2.55-.68s-1.4-1.07-1.86-1.85-.68-1.63-.68-2.55zm1.76 0c0 .93.33 1.73.98 2.39s1.44.99 2.36.99c.93 0 1.73-.33 2.4-1s1.01-1.46 1.01-2.37c0-.62-.16-1.2-.48-1.73s-.76-.94-1.32-1.23l-.28-.14c-.1-.04-.15-.14-.15-.29v-10.76c0-.32-.11-.59-.34-.81-.23-.21-.51-.32-.85-.32-.32 0-.6.11-.83.32s-.34.48-.34.81v10.74c0 .15-.05.25-.14.29l-.27.14c-.55.29-.98.7-1.29 1.23s-.46 1.1-.46 1.74zm.78 0c0 .71.24 1.32.73 1.82s1.07.75 1.76.75 1.28-.25 1.79-.75.76-1.11.76-1.81c0-.63-.22-1.19-.65-1.67s-.96-.77-1.58-.85v-7.36c0-.06-.03-.13-.1-.19-.07-.07-.14-.1-.22-.1-.09 0-.16.03-.21.08-.05.06-.08.12-.08.21v7.34c-.61.09-1.13.37-1.56.85-.43.49-.64 1.04-.64 1.68z"/></svg>
                ${
                    data[0].uv
                        ? '<li class="uv-index"><span class="left-col">UV Index: ' +
                          fClean(data[0].uv.toFixed(2)) +
                          '</span><svg alt="" height="25" width="25" class="inline-icon svg-wi-day-sunny" data-uv="' +
                          fUvDataPt(fClean(data[0].uv)) +
                          '" enable-background="new 0 0 30 30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="m4.4 14.9c0-.2.1-.4.2-.6.2-.2.4-.2.6-.2h2c.2 0 .4.1.6.2.2.2.2.4.2.6s0 .5-.2.6c-.2.2-.3.2-.6.2h-2c-.2 0-.4-.1-.6-.2-.1-.1-.2-.3-.2-.6zm2.8 6.9c0-.2.1-.4.2-.6l1.5-1.4c.1-.2.4-.2.6-.2s.4.1.6.2.2.3.2.6c0 .2-.1.5-.2.6l-1.4 1.4c-.4.3-.8.3-1.2 0-.2-.1-.3-.3-.3-.6zm0-13.8c0-.2.1-.4.2-.6.2-.2.4-.2.6-.2s.4.1.6.2l1.4 1.5c.2.1.2.4.2.6s-.1.4-.2.6-.4.2-.6.2-.4-.1-.6-.2l-1.3-1.5c-.2-.1-.3-.4-.3-.6zm2.6 6.9c0-.9.2-1.8.7-2.6s1.1-1.4 1.9-1.9 1.7-.7 2.6-.7c.7 0 1.4.1 2 .4s1.2.6 1.7 1.1.8 1 1.1 1.7c.3.6.4 1.3.4 2 0 .9-.2 1.8-.7 2.6s-1.1 1.4-1.9 1.9-1.7.7-2.6.7-1.8-.2-2.6-.7-1.4-1.1-1.9-1.9-.7-1.6-.7-2.6zm1.7 0c0 1 .3 1.8 1 2.5s1.5 1 2.5 1 1.8-.4 2.5-1 1-1.5 1-2.5-.4-1.8-1-2.5c-.7-.7-1.5-1-2.5-1s-1.8.3-2.5 1-1 1.6-1 2.5zm2.6 7.8c0-.2.1-.4.2-.6s.4-.2.6-.2.4.1.6.2.2.4.2.6v2c0 .2-.1.5-.2.6s-.4.2-.6.2-.4-.1-.6-.2c-.2-.2-.2-.4-.2-.6zm0-15.5v-2c0-.2.1-.4.2-.6s.4-.3.6-.3.4.1.6.2.2.4.2.6v2.1c0 .2-.1.4-.2.6s-.3.2-.5.2-.4-.1-.6-.2-.3-.4-.3-.6zm5.6 13.2c0-.2.1-.4.2-.6s.3-.2.6-.2c.2 0 .4.1.6.2l1.5 1.4c.2.2.2.4.2.6s-.1.4-.2.6c-.4.3-.8.3-1.2 0l-1.5-1.4c-.2-.2-.2-.4-.2-.6zm0-10.9c0-.2.1-.4.2-.6l1.4-1.5c.2-.2.4-.2.6-.2s.4.1.6.2c.2.2.2.4.2.6s-.1.5-.2.6l-1.5 1.5c-.2.2-.4.2-.6.2s-.4-.1-.6-.2-.1-.4-.1-.6zm2.2 5.4c0-.2.1-.4.2-.6.2-.2.4-.2.6-.2h2c.2 0 .4.1.6.3s.3.4.3.6-.1.4-.3.6-.4.2-.6.2h-2c-.2 0-.4-.1-.6-.2s-.2-.4-.2-.7z"/></svg>'
                        : ''
                }
                <li class="windspeed"><span class="left-col">
                    <span aria-description="Winds traveling from ${sWindDirection}">
                        Windspeed:
                        ${fKmPerHourConvert(
                            fClean(data[0].wind_spd)
                        )}&nbsp;|&nbsp;${fClean(data[0].wind_cdir)}
                    </span></span>
                    <span class="inline-icon">
                        <svg alt="" height="25" width="25" class="compass"  style="transform: rotate(${sWindDeg}deg)" enable-background="new 0 0 30 30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="m3.74 14.5c0-2.04.51-3.93 1.52-5.66s2.38-3.1 4.11-4.11 3.61-1.51 5.64-1.51c1.52 0 2.98.3 4.37.89s2.58 1.4 3.59 2.4 1.81 2.2 2.4 3.6.89 2.85.89 4.39c0 1.52-.3 2.98-.89 4.37s-1.4 2.59-2.4 3.59-2.2 1.8-3.59 2.39-2.84.89-4.37.89-3-.3-4.39-.89-2.59-1.4-3.6-2.4-1.8-2.2-2.4-3.58-.88-2.84-.88-4.37zm2.48 0c0 2.37.86 4.43 2.59 6.18 1.73 1.73 3.79 2.59 6.2 2.59 1.58 0 3.05-.39 4.39-1.18s2.42-1.85 3.21-3.2 1.19-2.81 1.19-4.39-.4-3.05-1.19-4.4-1.86-2.42-3.21-3.21-2.81-1.18-4.39-1.18-3.05.39-4.39 1.18-2.42 1.86-3.22 3.21-1.18 2.82-1.18 4.4zm4.89 5.85 3.75-13.11c.01-.1.06-.15.15-.15s.14.05.15.15l3.74 13.11c.04.11.03.19-.02.25s-.13.06-.24 0l-3.47-1.3c-.1-.04-.2-.04-.29 0l-3.5 1.3c-.1.06-.17.06-.21 0s-.08-.15-.06-.25z"/></svg>
                        ${nWind}
                    </span>
                </li>
                <li class="cloud-cover"><span class="left-col">Cloud:
                    ${fClean(data[0].clouds)}% </span>
                    ${iconCloud[2]}
                ${
                    data[0].snow
                        ? '<li><span class="left-col">Snow: ' +
                          fPercipConvert(fClean(data[0].snow)) +
                          '</span>' +
                          nSnow +
                          '</li>'
                        : ''
                }
                <li class="precipitation"><span class="left-col">Precip:
                          ${fPercipConvert(fClean(data[0].precip))}
                          </span>${nRaindrop}</li>

                <li class="visibility">
                    <div class="visibility-wrap">
                        <span class="left-col">Visibility:
                          ${fKmConvert(fClean(data[0].vis))}
                        </span>
                        ${nBinoculars}
                    </div>
                    <div class="visibility-graph" aria-hidden="true"><div class="distance"></div></div>
                </li>
                <li class="sun-up-down">
                    <span>
                        ${nSunrise}
                        ${fTimeConvert(fClean(data[0].sunrise))}
                    </span>
                    <span>
                        ${nSunset}
                        ${fTimeConvert(fClean(data[0].sunset))}
                    </span>
                    <span class="moonphase">
                        <img class="inline-icon moon"
                            alt="We currently have a ${oMoon.name} moon."
                            height="25" width="25"
                            src="./icons/moon/svg/${oMoon.phase}.svg"/>
                        ${oMoon.name}
                    </span>
                </li>
            </ul>
        </div>
        `
    }

    /**
     * Renders the app's upcoming forcast section
     *
     * @param {array} data
     * @returns {string}
     */
    const fRenderForcast = function (data) {
        const sIcon24 = getWeatherIcon(data[1], 23)
        const sIcon48 = getWeatherIcon(data[1], 47)
        return `
        <div id="forcast">
            <ul class="unstyled">
                <li class="" data-temp="${fTempDataPt(
                    fClean(data[1][47].temp)
                )}">
                    <header datetime="${
                        data[1][23].datetime
                    }" aria-description="The weather forcast in 24 hours."><h4>24h</h4></header>
                    <h5><img class="weather-icon" alt="${fClean(
                        data[1][23].weather.description
                    )}" src="./icons/weather/svg/${sIcon24}.svg" />
                    ${fTempConvert(fClean(data[1][23].temp))}</h5>
                <p class="forecast-description" aria-hidden="true">${fClean(
                    data[1][23].weather.description.toLowerCase()
                )}</p>
                </li>
                <li class="" data-temp="${fTempDataPt(
                    fClean(data[1][47].temp)
                )}">
                    <header datetime="${
                        data[1][47].datetime
                    }" aria-description="The weather forcast in 48 hours."><h4>48h</h4></header>
                    <h5><img class="weather-icon" alt="${fClean(
                        data[1][47].weather.description
                    )}" src="./icons/weather/svg/${sIcon48}.svg" />
                    ${fTempConvert(fClean(data[1][47].temp))}</h5>
                <p class="forecast-description" aria-hidden="true">${fClean(
                    data[1][47].weather.description.toLowerCase()
                )}</p>
                </li>
            </ul>
        </div>
        `
    }

    /**
     * Build the UI
     *
     * @param {array} data
     */
    const fBuildUI = function (data = []) {
        app.innerHTML =
            fRenderHUD(data) + fRenderDetails(data) + fRenderForcast(data)
    }

    /**
     * Render errors to the user
     *
     * @param {obj} err
     * @returns
     */
    const fErrorDisplay = function (err) {
        const markup = `<div id="hud">
                            <div id="ohnos">
                                <h3><span aria-hidden="true">⥀.⥀<br /></span>Oh Nooos!</h3>
                                <p class="sr-only">There has been a crittical error:</p>
                                    <div>
                                        ${
                                            err.stack
                                                ? '<pre>' + err.stack + '<pre>'
                                                : ''
                                        }
                                        ${
                                            err.status
                                                ? '<pre>' +
                                                  err.statusText +
                                                  ': ' +
                                                  err.status +
                                                  '<pre>'
                                                : ''
                                        }
                                    </div>
                                <img alt="" src="./icons/weather/svg/wi-alien.svg"/>
                            </div>
                        </div>`
        nApp.innerHTML = markup
    }

    /**
     * Init
     */
    const fInit = async function () {
        try {
            const loc = await fGetLocation()
            const weather = await fGetWeather(loc)
            const forcast = await fGetForcast(loc)

            _oSettings.debug ? console.log('fGetLocation response:', loc) : ''
            _oSettings.debug
                ? console.log('fGetWeather response:', weather)
                : ''
            _oSettings.debug
                ? console.log('fGetForcast response:', forcast)
                : ''

            // to test values
            // weather.data[0].temp = 60
            // weather.data[0].app_temp = 60
            // weather.data[0].uv = 100
            // weather.data[0].clouds = 85
            // weather.data[0].snow = 100
            // weather.data[0].precip = 100
            // weather.data[0].vis = 0.2
            // weather.data[0].ob_time = '1800-02-20 17:38'

            fBuildUI([weather.data[0], forcast.data])
            fSetVisabilityScale(weather.data[0].vis)
        } catch (e) {
            console.error('init error: ', e)
            fErrorDisplay(e)
        }
    }
    fInit()
}

// with debugging and Imperial Units
const settings = {
    forcast: `Currently: {{forcast}}`,
    KEY: 'a7c9d34c61974586aae2af81befd52f2',
    units: 'I',
    debug: true,
}

weatherApp(settings)
