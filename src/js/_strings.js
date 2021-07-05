import * as Convert from './_conversions'
import { fClean } from './_helpers'

const _oTextStrings = {
    en: {
        now: 'Currently: ',
        aira_now: 'The weather is currently: ',
        feels_like: 'Feels Like:',
        uv: 'UV:',
        cloud: 'Cloud:',
        snow: 'Snow:',
        percip: 'Rain:',
        wind: 'Wind:',
        aira_winds: 'Winds traveling from',
        vis: 'Visibility:',
        sun: 'Sun:',
        moon: 'Moon:',
    },
}

/**
 * Perform string replacement for UI strings.
 *
 * @param {string} string
 * @param {object} _oData
 * @param {object} _oSettings
 * @returns {string} Formatted string
 */
export const fUIstr = function (
    string,
    _oData,
    _oSettings,
    _oStrings = _oTextStrings
) {
    const CURRENT = _oData.CURRENT.data[0]
    const FORECAST = _oData.FORECAST

    if (!string) return ''
    return (
        string
            // HUD
            // Details
            .replace('{{feels_like}}', _oStrings.en.feels_like)
            .replace(
                '{{app_temp}}',
                Convert.fTemp(fClean(CURRENT.app_temp), _oSettings)
            )
            .replace('{{uv}}', _oStrings.en.uv)
            .replace('{{uv_index}}', _oStrings.en.uv)

            .replace('{{cloud}}', _oStrings.en.cloud)
            .replace('{{percip}}', _oStrings.en.percip)
            .replace('{{wind}}', _oStrings.en.wind)
            .replace('{{aira_winds}}', _oStrings.en.wind)
            .replace('{{vis}}', _oStrings.en.vis)
            .replace('{{sun_rise_set}}', _oStrings.en.sun)
            .replace('{{moon}}', _oStrings.en.moon)
    )
}

/**
 * Perform string replacement for UI strings.
 *
 * @param {string} string
 * @param {object} _oData
 * @param {object} _oSettings
 * @returns {string} Formatted string
 */
export const fHUDstr = function (
    string,
    _oData,
    _oSettings,
    _oStrings = _oTextStrings
) {
    const CURRENT = _oData.CURRENT.data[0]
    const FORECAST = _oData.FORECAST

    if (!string) return ''
    return (
        string
            // HUD
            .replace('{{now}}', _oStrings.en.now)
            .replace(
                '{{aira_weather_description}}',
                `${_oStrings.en.aira_now} ${fClean(
                    CURRENT.weather.description
                )}`
            )
            .replace(
                '{{weather_description}}',
                fClean(CURRENT.weather.description).toLowerCase()
            )
            .replace(
                '{{temp}}',
                Convert.fTemp(fClean(CURRENT.temp), _oSettings)
            )
            .replace('{{city}}', fClean(CURRENT.city_name))
            .replace('{{country}}', fClean(CURRENT.country_code))
    )
}
