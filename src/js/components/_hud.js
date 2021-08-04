import { fGetWeatherIcon } from '../_icons'
import { fTempDataPt } from '../_scales'
import { fHUDstr } from '../_strings'
import { fClean } from '../_helpers'

/**
 * Renders the app's header
 *
 * @param {array} _oData
 * @returns {string}
 */
export const fRenderHUD = function (_oData, _oSettings) {
  if (_oSettings.log) {
    console.log('fRenderHUD: ', _oData)
  }

  const oCURRENT = _oData.CURRENT.data[0]
  const sIconName = fGetWeatherIcon(oCURRENT)

  const template = `<header
        id="hud" class="c-hud" data-temp="${fTempDataPt(
          fClean(oCURRENT.temp)
        )}">
            <h3>
                <img class="weather-icon" alt="" src="./svg/icons/weather/svg/${sIconName}.svg" />
                <span aria-hidden="true">{{temp}}</span>
                </h3>
                <ul class="unstyled">
                <li aria-hidden="true">{{now}} {{weather_description}}</li>
                <li hidden>{{aira_weather_description}}</li>
                <li>{{city}}, {{country}}</li>
            </ul>
        </header>
        `
  return fHUDstr(template, _oData, _oSettings)
}
