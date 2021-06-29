import * as Convert from '../_conversions'
import * as Helpers from '../_helpers'
import * as Icons from '../_icons'
import * as Scales from '../_scales'
import * as StrReplace from '../_strings'

/**
 * Renders the app's header
 *
 * @param {array} data
 * @returns {string}
 */
export const fRenderHUD = function (data, _oSettings) {
    console.log('fRenderHUD: ', data)
    const sIcon = Icons.fGetWeatherIcon(data)
    return `
        <header id="hud" class="" data-temp="${Scales.fTempDataPt(data.temp)}">
            <h3>
                    <img class="weather-icon" alt="${StrReplace.fFormatUIstr(
                        _oSettings.airaForcast,
                        data,
                        _oSettings
                    )}" src="./svg/icons/weather/svg/${sIcon}.svg" />
                <span aria-hidden="true">${Convert.fTemp(
                    Helpers.fClean(data.temp),
                    _oSettings
                )}</span>
            </h3>
            <ul class="unstyled">
                <li aria-hidden="true">
                    ${StrReplace.fFormatUIstr(
                        _oSettings.forcast,
                        data,
                        _oSettings
                    ).toLowerCase()}
                </li>
                <li>
                    ${StrReplace.fFormatUIstr(
                        _oSettings.location,
                        data,
                        _oSettings
                    )}
                </li>
            </ul>
        </header>
        `
}
