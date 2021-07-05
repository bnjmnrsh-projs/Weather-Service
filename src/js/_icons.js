import { fClean } from './_helpers'

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
 * @param {object} oData Either the current, daily, or iHourly forecast weather object
 * @param {string || int} [iHour]
 * @returns string
 */
export const fGetWeatherIcon = function (oData, iHour) {
    if (!oData) return

    let iCode, sPod
    if (!iHour && oData.hasOwnProperty('pod')) {
        // Current weather object
        sPod = fClean(oData.sPod) === 'd' ? 0 : 1
        iCode = parseInt(fClean(oData.weather.code))
    } else if ('hour' in oData) {
        // Forcast weather object (hourly)
        sPod = fClean(oData[iHour].sPod) === 'd' ? 0 : 1
        iCode = parseInt(fClean(oData[iHour].weather.code))
    } else {
        // Forcast weather object (days)
        sPod = 1
        iCode = parseInt(fClean(oData.weather.code))
    }
    return oWeather[iCode][sPod]
}

/**
 * Select the cloud iCoverage icon based on percentage value
 *
 * @param {int} iCoverage A percentage figure 0-100
 * @param {string} sPod Point of Day
 * @returns {string} the string name of the icon
 */
export const fGetCloudCoverIcon = function (iCoverage, sPod = 'd') {
    if (typeof iCoverage !== 'number') return

    // set day or night icon set
    sPod = sPod = 'd' ? 0 : 1

    const icons = oCloudCover

    iCoverage = parseInt(iCoverage)

    let aIconData = ''

    switch (iCoverage) {
        case iCoverage >= 0 && iCoverage < 16 ? iCoverage : null:
            aIconData = [icons[0][sPod], 0]
            break
        case iCoverage >= 16 && iCoverage < 32 ? iCoverage : null:
            aIconData = [icons[1][sPod], 1]
            break
        case iCoverage >= 32 && iCoverage < 48 ? iCoverage : null:
            aIconData = [icons[2][sPod], 2]
            break
        case iCoverage >= 48 && iCoverage < 65 ? iCoverage : null:
            aIconData = [icons[3][sPod], 3]
            break
        case iCoverage >= 65 && iCoverage < 83 ? iCoverage : null:
            aIconData = [icons[4][sPod], 4]
            break
        case iCoverage >= 83 && iCoverage <= 100 ? iCoverage : null:
            aIconData = [icons[5][sPod], 5]
            break
    }
    aIconData.push(
        document.querySelector(`#svgs .svg-${aIconData[0]}`).outerHTML
    )

    return aIconData
}

/**
 * Takes a string based representation of a DOM element, and adds inline style and/or data-* attributes to it.
 *
 * @param {string} sEl
 * @param {object} props
 * @returns {string}
 *
 * The props object may contain a top level `style` propery for inline css string
 * and or a `data` object which will be mapped to data-* attributes on the element.
 *
 *  `<span class="inline-icon">
 *    ${Icons.fSetStringElAttrs(oIcons.sWindDirection, {
 *        style: `transform: rotate(${sWindDeg}deg)`,
 *        class: 'some-class',
 *        data: { temp: '6' },
 *    })}
 *  </span>`
 */

export const fSetStringElAttrs = function (sEl, props = {}) {
    if ('content' in document.createElement('template')) {
        const nEl = document.createElement('div')
        nEl.innerHTML = sEl.trim()
        const nTarget = nEl.querySelector('div >:first-child')

        if (props.hasOwnProperty('style')) {
            nTarget.setAttribute('style', props.style)
        }
        if (props.hasOwnProperty('class')) {
            nTarget.classList.add(props.class)
        }
        if (
            props.hasOwnProperty('data') &&
            Object.keys(props.data).length > 0
        ) {
            Object.keys(props.data).map((key) => {
                nTarget.setAttribute(`data-${key}`, props.data[key])
            })
        }
        return nEl.innerHTML
    }
    return ''
}
