import * as Helpers from './_helpers'

export const oWeather = {
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

export const oCloudCover = {
    0: ['wi-day-sunny', 'wi-night-clear'],
    1: ['wi-day-cloudy-high', 'wi-night-alt-cloudy-high'],
    2: ['wi-day-sunny-overcast', 'wi-night-partly-cloudy'],
    3: ['wi-cloud', 'wi-cloud'],
    4: ['wi-cloudy', 'wi-cloudy'],
    5: ['dark-cloudy', 'dark-cloudy'],
}

/**
 * Returns the string name of the weather icon
 *
 * @param {object} data Either the current, daily, or hourly forcast weather object
 * @param {string || int} [hour]
 * @returns string
 */
export const getWeatherIcon = function (data, hour) {
    if (!data) return

    let code, pod
    if (!hour && data.hasOwnProperty('pod')) {
        // Current weather object
        pod = Helpers.fClean(data.pod) === 'd' ? 0 : 1
        code = parseInt(Helpers.fClean(data.weather.code))
    } else if ('hour' in data) {
        // Forcast weather object (hourly)
        pod = Helpers.fClean(data[hour].pod) === 'd' ? 0 : 1
        code = parseInt(Helpers.fClean(data[hour].weather.code))
    } else {
        // Forcast weather object (days)
        pod = 1
        code = parseInt(Helpers.fClean(data.weather.code))
    }
    return oWeather[code][pod]
}

/**
 * Select the cloud coverage icon based on percentage value
 *
 * @param {int} coverage A percentage figure 0-100
 * @param {string} pod Point of Day
 * @returns {string} the string name of the icon
 */
export const getCloudCoverIcon = function (coverage, pod = 'd') {
    if (typeof coverage !== 'number') return

    // set day or night icon set
    pod = pod = 'd' ? 0 : 1

    const icons = oCloudCover

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
