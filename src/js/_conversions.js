/**
 * *NOTE: the API has params for both imperial and metric units, however,
 * we do the conversion ourselves so that we can switch without additional api calls.
 */

/**
 * mm/hr to inch/hr
 *
 * @param {float} nMeasure
 * @returns {string} converted measurement as string with units
 */
export const fPercip = function (nMeasure, _oSettings) {
    if (typeof nMeasure !== 'number' && _oSettings.debug) {
        console.warn(
            `fPercip recieved a non numeric value: ${nMeasure} typeof: ${typeof nMeasure}`
        )
    }
    if (nMeasure === 0) {
        return nMeasure
    }

    if (_oSettings.units === 'M') {
        return `${parseFloat(nMeasure).toFixed(2)}&nbsp;mm/hr`
    } else {
        return `${(parseFloat(nMeasure) * 0.0393701).toFixed(2)}&nbsp;inch/hr`
    }
}

/**
 * C to F conversion
 *
 * @param {float} nMeasure
 * @returns {string || number} converted tepm as string with units, or as a Float
 */
export const fTemp = function (nMeasure, _oSettings, withUnits = true) {
    if (typeof nMeasure !== 'number' && _oSettings.debug) {
        console.warn(
            `fTemp recieved a non numeric value: ${nMeasure} typeof: ${typeof nMeasure}`
        )
    }
    if (typeof nMeasure !== 'number') return 0
    if (_oSettings.units === 'M') {
        let converted = parseFloat(nMeasure).toFixed(1)
        return withUnits ? `${converted}°&nbsp;C` : converted
    } else {
        let converted = ((parseFloat(nMeasure) * 9) / 5 + 32).toFixed(1)
        return withUnits ? `${converted}°&nbsp;F` : converted
    }
}

/**
 * km/hr to mi/hr
 *
 * @param {float} nMeasure
 * @returns {string} converted wind speed as string with units
 */
export const fKmPerHour = function (nMeasure, _oSettings) {
    if (typeof nMeasure !== 'number' && _oSettings.debug) {
        console.warn(
            `fKmPerHour recieved a non numeric value: ${nMeasure} typeof: ${typeof nMeasure}`
        )
    }
    if (typeof nMeasure !== 'number') return 0

    if (_oSettings.units === 'M') {
        return `${(parseFloat(nMeasure) * 3.6000059687997).toFixed(
            2
        )}&nbsp;km/hr`
    } else {
        return `${(parseFloat(nMeasure) * 2.23694).toFixed(2)}&nbsp;mi/hr`
    }
}

/**
 * km to mi
 *
 * @param {float} nMeasure
 * @returns {string} converted distance as string with units
 */
export const fKm = function (nMeasure, _oSettings) {
    if (typeof nMeasure !== 'number' && _oSettings.debug) {
        console.warn(
            `fKm recieved a non numeric value: ${nMeasure} typeof: ${typeof nMeasure}`
        )
    }

    if (typeof nMeasure !== 'number') return 0
    if (_oSettings.units === 'M') {
        return `${parseFloat(nMeasure).toFixed(2)}&nbsp;km`
    } else {
        return `${(parseFloat(nMeasure) * 0.621371).toFixed(2)}&nbsp;miles`
    }
}
