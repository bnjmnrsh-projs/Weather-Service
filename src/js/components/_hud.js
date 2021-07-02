import * as Convert from '../_conversions'
import * as Icons from '../_icons'
import * as Scales from '../_scales'
import * as StrReplace from '../_strings'
import { fClean } from '../_helpers'

/**
 * Renders the app's header
 *
 * @param {array} _oData
 * @returns {string}
 */
export const fRenderHUD = function (_oData, _oSettings) {
    console.log('fRenderHUD: ', _oData)
    const sIcon = Icons.fGetWeatherIcon(_oData)
    return `
        <header id="hud" class="" data-temp="${Scales.fTempDataPt(
            _oData.temp
        )}">
            <h3>
                    <img class="weather-icon" alt="${StrReplace.fFormatUIstr(
                        _oSettings.airaForcast,
                        _oData,
                        _oSettings
                    )}" src="./svg/icons/weather/svg/${sIcon}.svg" />
                <span aria-hidden="true">${Convert.fTemp(
                    fClean(_oData.temp),
                    _oSettings
                )}</span>
            </h3>
            <ul class="unstyled">
                <li aria-hidden="true">
                    ${StrReplace.fFormatUIstr(
                        _oSettings.forcast,
                        _oData,
                        _oSettings
                    ).toLowerCase()}
                </li>
                <li>
                    ${StrReplace.fFormatUIstr(
                        _oSettings.location,
                        _oData,
                        _oSettings
                    )}
                </li>
            </ul>
        </header>
        `
}
