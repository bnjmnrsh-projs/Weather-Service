/**
 * *NOTE: the API has params for both imperial and metric units, however,
 * we do the conversion ourselves so that we can switch without additional api calls.
 */

/**
 * mm/hr to inch/hr
 *
 * @param {float} measure
 * @returns {string} converted measurement as string with units
 */
export const fPercip = function (measure, _oSettings) {
    if (typeof measure !== 'number') return 0

    if (measure === 0) {
        return measure
    }

    if (_oSettings.units === 'M') {
        return `${parseFloat(measure).toFixed(2)}&nbsp;mm/hr`
    } else {
        return `${(parseFloat(measure) * 0.0393701).toFixed(2)}&nbsp;inch/hr`
    }
}

/**
 * C to F conversion
 *
 * @param {float} measure
 * @returns {string || number} converted tepm as string with units, or as a Float
 */
export const fTemp = function (measure, _oSettings, withUnits = true) {
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
export const fKmPerHour = function (measure, _oSettings) {
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
export const fKm = function (measure, _oSettings) {
    if (typeof measure !== 'number') return 0
    if (_oSettings.units === 'M') {
        return `${parseFloat(measure).toFixed(2)}&nbsp;km`
    } else {
        return `${(parseFloat(measure) * 0.621371).toFixed(2)}&nbsp;mile`
    }
}