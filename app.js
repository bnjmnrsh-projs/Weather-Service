/**
 * The Weather Service
 * @author bnjmnrsh@gmail.com
 *
 * @param {string} [target='#app']
 * @param {string} [units='M'] [M] Metric [I] Imperial (default is metric)
 * @param {boolean} [debug=false]
 */
const weatherApp = function (target = '#app', units = 'M', debug = false) {
    const nApp = document.querySelector('#app')
    const sIpapiLocationApi = 'https://ipapi.co/json/'
    const sWeatherKEY = 'a7c9d34c61974586aae2af81befd52f2'
    const sWeatherApi = `https://api.weatherbit.io/v2.0/current?key=${sWeatherKEY}`
    const sFocastApi = `https://api.weatherbit.io/v2.0/forecast/hourly?key=${sWeatherKEY}&hours=48`

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
        700: ['wi-day-fog', 'wi-night-alt-fog'],
        711: ['wi-day-fog', 'wi-night-alt-fog'],
        721: ['wi-day-fog', 'wi-night-alt-fog'],
        731: ['wi-day-fog', 'wi-night-alt-fog'],
        741: ['wi-day-fog', 'wi-night-alt-fog'],
        751: ['wi-day-fog', 'wi-night-alt-fog'],
        800: ['wi-day-sunny', 'wi-night-clear'],
        801: ['wi-day-cloudy', 'wi-night-alt-cloudy'],
        802: ['wi-day-cloudy-high', 'wi-night-alt-cloudy-high'],
        803: ['wi-day-cloudy-high', 'wi-night-partly-cloudy'],
        804: ['wi-cloudy', 'wi-cloudy'],
        900: ['wi-rain-mix', 'wi-rain-mix'],
    }

    const oCloudCoverIcons = {
        heavy: ['wi-cloudy', 'wi-cloudy'],
        moderate: ['wi-cloud', 'wi-cloud'],
        light: ['wi-day-sunny-overcast', 'wi-night-alt-cloudy'],
        clear: ['wi-day-sunny', 'wi-night-clear'],
    }

    /**
     * Sanitise incoming API data
     *
     * @param {string} [dirty='']
     * @returns {string} sanitised text
     */
    const fClean = function (dirty = '') {
        if (!dirty) return
        temp = document.createElement('div')
        temp.innerHTML = dirty
        return temp.innerText
    }

    /**
     * mm/hr to inch/hr
     *
     * @param {float} measure
     * @returns
     */
    const fPercipConvert = function (measure) {
        if (units === 'M') {
            return `${parseFloat(measure).toFixed(2)} mm/hr`
        } else {
            return `${(parseFloat(measure) * 0.0393701).toFixed(2)} inch/hr`
        }
    }

    /**
     * 24H to 12H conversion
     * https://stackoverflow.com/a/58878443/362445
     *
     * @param {string} time24
     * @returns string
     */
    const fTimeConvert = function (time24) {
        if (units === 'M') return

        const [sHours, minutes] = time24
            .match(/([0-9]{1,2}):([0-9]{2})/)
            .slice(1)
        const period = +sHours < 12 ? 'AM' : 'PM'
        const hours = +sHours % 12 || 12

        return `${hours}:${minutes} ${period}`
    }

    /**
     * C to F conversion
     *
     * @param {float} measure
     * @returns
     */
    const fTempConvert = function (measure) {
        if (units === 'M') {
            return `${parseFloat(measure).toFixed(1)}° C`
        } else {
            return `${(parseFloat(measure) + 32).toFixed(1)}° F`
        }
    }

    /**
     * km/hr to mi/hr
     *
     * @param {float} measure
     * @returns
     */
    const fWindConvert = function (measure) {
        if (units === 'M') {
            return `${(parseFloat(measure) * 3.6000059687997).toFixed(2)} km/hr`
        } else {
            return `${(parseFloat(measure) * 2.23694).toFixed(2)} mi/hr`
        }
    }

    /**
     * km to mi
     *
     * @param {float} measure
     * @returns
     */
    const fVisConvert = function (measure) {
        if (units === 'M') {
            return `${parseFloat(measure).toFixed(2)} km`
        } else {
            return `${(parseFloat(measure) * 2.23694).toFixed(2)} mile`
        }
    }

    /**
     * Assigns a class string based on given temperature
     *
     * @param {float} temp
     * @returns string
     */
    const fTempClass = function (temp) {
        if (!temp) return

        let base = units !== 'M' ? 0 : 32

        temp = parseFloat(temp)
        // temp = 100
        let tempClass = 'none'
        switch (temp) {
            case temp < base + 0 ? temp : null:
                tempClass = 'temp-0'
                break
            case temp > base + 0 && temp < base + 10 ? temp : null:
                tempClass = 'temp-1'
                break
            case temp > base + 10 && temp < base + 22 ? temp : null:
                tempClass = 'temp-2'
                break
            case temp > base + 22 && temp < base + 27 ? temp : null:
                tempClass = 'temp-3'
                break
            case temp > base + 27 && temp < base + 34 ? temp : null:
                tempClass = 'temp-4'
                break
            case temp > base + 34 ? temp : null:
                tempClass = 'temp-5'
                break
        }
        return tempClass
    }

    /**
     * Assigns a class string based on given uv
     *
     * @param {int} temp
     * @returns string
     */
    const fUvClass = function (uv) {
        if (!temp) return
        uv = parseInt(uv)
        // uv = 100
        let uvClass = 'none'
        switch (uv) {
            case uv < 10 ? uv : null:
                uvClass = 'uv-0'
                break
            case uv >= 10 && uv < 30 ? uv : null:
                uvClass = 'uv-1'
                break
            case uv >= 30 && uv < 50 ? uv : null:
                uvClass = 'uv-2'
                break
            case uv >= 50 && uv < 70 ? uv : null:
                uvClass = 'uv-3'
                break
            case uv >= 70 && uv < 90 ? uv : null:
                uvClass = 'uv-4'
                break
            case uv >= 90 || uv <= 100 ? uv : null:
                uvClass = 'uv-5'
                break
        }
        return uvClass
    }

    /**
     * https://gist.github.com/endel/dfe6bb2fbe679781948c#gistcomment-2811037
     *
     * @param {Date Object || date string} Date Object or valid String to make date object from.
     *
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

        const yyyy = parseInt(date.getFullYear(), 10)
        const mm = parseInt(date.getMonth() + 1, 10)
        const dd = parseInt(date.getDate(), 10)
        const oMoonPhase = Moon.phase(yyyy, mm, dd)

        debug ? console.log('fMoonPhase d m y: ', `${dd} ${mm} ${yyyy}`) : ''
        debug ? console.log('fMoonPhase resp: ', oMoonPhase) : ''
        return oMoonPhase
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
                debug ? console.log('Checking geoLoccation API.') : ''
                return await fGeoLocApi()
            } catch (e) {
                debug ? console.warn('fGetLocation fGeoLocApi: ', e) : ''
                try {
                    debug ? console.log('Falling back to IP lookup.') : ''
                    return await fIPapi()
                } catch (e) {
                    debug ? console.warn('fGetLocation IP API: ', e) : ''
                }
            }
        }
    }

    /**
     * Fetch the weather for a user's location.
     *
     * @param {object} loc
     * @returns {object} weather object
     */
    const fGetWeather = async function (loc) {
        const resp = await fetch(
            `${sWeatherApi}&lat=${fClean(loc.latitude)}&lon=${fClean(
                loc.longitude
            )}`
        ).then(function (resp) {
            if (resp.ok) {
                return resp.json()
            } else {
                return Promise.reject(resp)
            }
        })
        return await resp
    }

    /**
     * Fetch the 48h forcast based on a user's location
     *
     * @param {object} loc coordiantes object
     * @returns {object} hourly forcast weather object
     */
    const fGetForcast = async function (loc) {
        const resp = await fetch(
            `${sFocastApi}&lat=${fClean(loc.latitude)}&lon=${fClean(
                loc.longitude
            )}`
        ).then(function (resp) {
            if (resp.ok) {
                return resp.json()
            } else {
                console.error(resp)
                nApp.innerHTML = fErrorDisplay(resp)

                return Promise.reject(resp)
            }
        })
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

    const getCloudCoverIcon = function (coverage) {}

    /**
     * Renders the app's header
     *
     * @param {array} data
     * @returns {string}
     */
    const renderHeader = function (data) {
        const sIcon = getWeatherIcon(data[0])
        return `
        <header id="hud" class="${fTempClass(data[0].temp)}">
            <h3><img class="weather-icon" alt="${fClean(
                data[0].weather.description.toLowerCase()
            )}" src="./icons/weather/svg/${sIcon}.svg" />${fTempConvert(
            fClean(data[0].temp)
        )}</h3>
            <ul class="unstyled">
                <li aria-hidden="true">
                    ${fClean(data[0].weather.description.toLowerCase())}
                </li>
                <li>
                    ${fClean(data[0].city_name)},
                    ${fClean(data[0].state_code)}
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
    const renderDetails = function (data) {
        const iconCloud = getCloudCoverIcon(data[0])
        const sWindDirection = fClean(data[0].wind_cdir_full)
        const oMoon = fMoonPhase(data[0].obj_time)

        return `
        <div id="details">
            <ul class="unstyled">
                <li>
                <span class="left-col">Feels like:
                    ${fTempConvert(fClean(data[0].app_temp))}
                </span>
                <img
                class="inline-icon ${fTempClass(fClean(data[0].app_temp))}"
                alt="" height="25" width="25" src="./icons/weather/svg/wi-thermometer.svg"></li>
                ${
                    data[0].uv
                        ? '<li><span class="left-col">UV Index: ' +
                          fClean(data[0].uv.toFixed(2)) +
                          '</span><img class="inline-icon ' +
                          fUvClass(fClean(data[0].uv)) +
                          '" alt="" height="25" width="25" src="./icons/weather/svg/wi-day-sunny.svg"></li>'
                        : ''
                }
                <li><span class="left-col">Windspeed:
                    ${fWindConvert(fClean(data[0].wind_spd.toFixed(2)))}
                    | <span aria-description="Winds traveling from ${sWindDirection}">
                    ${fClean(data[0].wind_cdir)}
                </span></span>
                <span class="inline-icon"><img class="compass ${sWindDirection}" alt="" height="25" width="25" src="./icons/extras/svg/compass.svg"><img class="" alt="" height="25" width="25" src="./icons/weather/svg/wi-strong-wind.svg"></span></li>
                <li><span class="left-col">Cloud:
                    ${fClean(data[0].clouds)}% </span>
                <img class="inline-icon" alt="" height="25" width="25" src="./icons/weather/svg/wi-cloudy.svg"></li>
                ${
                    data[0].snow
                        ? '<li><span class="left-col">Snow:' +
                          fPercipConvert(fClean(data[0].snow)) +
                          '</span><img class="inline-icon" alt="" height="25" width="25" src="./icons/weather/svg/wi-snowflake-cold.svg"></li>'
                        : ''
                }
                ${
                    data[0].precip
                        ? '<li><span class="left-col">Precip: ' +
                          fPercipConvert(fClean(data[0].precip)) +
                          '</span><img class="inline-icon" alt="" height="25" width="25" src="./icons/weather/svg/wi-raindrop.svg"></li>'
                        : ''
                }
                ${
                    data[0].vis
                        ? '<li><span class="left-col">Visibility: ' +
                          fVisConvert(fClean(data[0].vis)) +
                          '</span><img class="inline-icon" alt="" height="25" width="25" src="./icons/extras/svg/binoculars.svg"></li>'
                        : ''
                }
                <li class="sun-up-down">
                    <span>
                        <img class="inline-icon sunrise" alt="sunrise" height="25" width="25" src="./icons/weather/svg/wi-sunrise.svg"/>
                        ${fTimeConvert(fClean(data[0].sunrise))}
                    </span>
                    <span>
                        <img class="inline-icon sunset" alt="sunset" height="25" width="25" src="./icons/weather/svg/wi-sunset.svg"/>
                        ${fTimeConvert(fClean(data[0].sunset))}
                    </span>
                    <span class="moonphase">
                        <img class="inline-icon moon"
                            alt="We are currently at a ${oMoon.name}"
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
    const renderForcast = function (data) {
        const sIcon24 = getWeatherIcon(data[1], 23)
        const sIcon48 = getWeatherIcon(data[1], 47)
        return `
        <div id="forcast">
            <ul class="unstyled">
                <li class="${fTempClass(fClean(data[0].temp))}">
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
                <li class="${fTempClass(fClean(data[1][47].temp))}">
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
            renderHeader(data) + renderDetails(data) + renderForcast(data)
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
    const init = async function () {
        try {
            const loc = await fGetLocation()
            const weather = await fGetWeather(loc)
            const forcast = await fGetForcast(loc)
            debug ? console.log('weather', weather.data[0]) : ''
            debug ? console.log('forcast', forcast.data[0]) : ''

            fBuildUI([weather.data[0], forcast.data])
        } catch (e) {
            console.error('init error: ', e)
            fErrorDisplay(e)
        }
    }
    init()
}

// For demonstration with debugging
weatherApp('#app', 'I', true)
