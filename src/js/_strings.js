import * as Convert from './_conversions'
import * as Dates from './_datetime'
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
        aira_winds: 'Winds traveling at',
        aira_winds_join: 'from the',
        vis: 'Visibility:',
        sun: 'Sun:',
        moon: 'Moon:',
    },
}

/**
 * Perform string replacement for strings in the HUD component.
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
    const oCURRENT = _oData.CURRENT.data[0]

    if (!string) return ''
    return (
        string
            // HUD
            .replace('{{now}}', _oStrings.en.now)
            .replace(
                '{{aira_weather_description}}',
                `${_oStrings.en.aira_now} ${fClean(
                    oCURRENT.weather.description
                )}`
            )
            .replace(
                '{{weather_description}}',
                fClean(oCURRENT.weather.description).toLowerCase()
            )
            .replace(
                '{{temp}}',
                Convert.fTemp(fClean(oCURRENT.temp), _oSettings)
            )
            .replace('{{city}}', fClean(oCURRENT.city_name))
            .replace('{{country}}', fClean(oCURRENT.country_code))
    )
}

/**
 * Perform string replacement for strings in the details component.
 *
 * @param {string} string
 * @param {object} _oData
 * @param {object} _oSettings
 * @returns {string} Formatted string
 */
export const fDetsStr = function (
    string,
    _oData,
    _oSettings,
    _oStrings = _oTextStrings
) {
    const oCURRENT = _oData.CURRENT.data[0]

    if (!string) return ''
    return (
        string
            // HUD
            // Details
            .replace('{{feels_like}}', _oStrings.en.feels_like)
            .replace(
                '{{app_temp}}',
                Convert.fTemp(fClean(oCURRENT.app_temp), _oSettings)
            )
            .replace('{{uv}}', _oStrings.en.uv)
            .replace('{{uv_index}}', fClean(oCURRENT.uv.toFixed(2)))

            .replace('{{cloud}}', _oStrings.en.cloud)
            .replace('{{cloud_percent}}', `${fClean(oCURRENT.clouds)}%`)
            .replace('{{snow}}', _oStrings.en.snow)
            .replace(
                '{{snow_percip}}',
                Convert.fPercip(fClean(oCURRENT.snow), _oSettings)
            )
            .replace('{{rain}}', _oStrings.en.percip)
            .replace(
                '{{rain_percip}}',
                Convert.fPercip(fClean(oCURRENT.precip), _oSettings)
            )
            .replace('{{aira_winds}}', _oStrings.en.aira_winds)
            .replace('{{aira_winds_join}}', _oStrings.en.aira_winds_join)

            .replace('{{wind}}', _oStrings.en.wind)
            .replace(
                '{{wind_speed}}',
                Convert.fKmPerHour(fClean(oCURRENT.wind_spd), _oSettings)
            )
            .replace('{{wind_direction}}', fClean(oCURRENT.wind_cdir))
            .replace('{{vis}}', _oStrings.en.vis)
            .replace(
                '{{vis_distance}}',
                Convert.fKm(fClean(oCURRENT.vis), _oSettings)
            )
            .replace('{{sun_rise_set}}', _oStrings.en.sun)
            .replace(
                '{{sun_rise}}',
                Dates.fGetLocalTime(
                    fClean(oCURRENT.ob_time),
                    _oSettings,
                    fClean(oCURRENT.sunrise)
                )
            )
            .replace(
                '{{sun_set}}',
                Dates.fGetLocalTime(
                    fClean(oCURRENT.ob_time),
                    _oSettings,
                    fClean(oCURRENT.sunset)
                )
            )
            .replace('{{moon}}', _oStrings.en.moon)
    )
}
