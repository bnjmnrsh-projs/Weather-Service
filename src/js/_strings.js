import * as Helpers from './_helpers'
import * as Convert from './_conversions'
/**
 * Perform string replacement for UI strings.
 *
 * @param {string} string
 * @param {object} data
 * @returns {string} Formatted string
 */
export const fFormatUIstr = function (string, data, _oSettings) {
    if (!string) return ''
    return string
        .replace('{{forcast}}', Helpers.fClean(data.weather.description))
        .replace(
            '{{temp}}',
            Convert.fTemp(Helpers.fClean(data.temp), _oSettings)
        )
        .replace('{{city}}', Helpers.fClean(data.city_name))
        .replace('{{country}}', Helpers.fClean(data.country_code))
}
