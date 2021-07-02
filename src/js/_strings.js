import * as Convert from './_conversions'
import { fClean } from './_helpers'
/**
 * Perform string replacement for UI strings.
 *
 * @param {string} string
 * @param {object} _oData
 * @param {object} _oSettings
 * @returns {string} Formatted string
 */
export const fFormatUIstr = function (string, _oData, _oSettings) {
    if (!string) return ''
    return string
        .replace('{{forcast}}', fClean(_oData.weather.description))
        .replace('{{temp}}', Convert.fTemp(fClean(_oData.temp), _oSettings))
        .replace('{{city}}', fClean(_oData.city_name))
        .replace('{{country}}', fClean(_oData.country_code))
}
