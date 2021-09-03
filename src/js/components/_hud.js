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
  if (_oSettings.debug) {
    console.log('fRenderHUD: ', _oData)
  }
  const sErrorResponse = `<header id="hud" class="c-hud error">
            <h3>
              <img class="weather-icon icon-spin" alt="" src="./svg/icons/weather/svg/wi-wind-deg.svg" />
              Whoops!
            </h3>
            <ul class="unstyled">
              <li class="">There was an error loading the current weather:
                ${
                  _oData.CURRENT.error
                    ? `<code>${_oData.CURRENT.error}</code>`
                    : ''
                }
                ${
                  _oData.CURRENT.status
                    ? `<code>${_oData.CURRENT.status}</code>`
                    : ''
                }
              </li>
              <li class=""><button class="rounded">${
                _oSettings.icon.sRefresh
              } reload</button></li>
            </ul>
        </header>
        `
  if (_oData.CURRENT.error || _oData.CURRENT.status) {
    return sErrorResponse
  }

  const oCURRENT = _oData.CURRENT.data[0]
  const sIconName = fGetWeatherIcon(oCURRENT)

  const sTemplate = `<header
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

  return fHUDstr(sTemplate, _oData, _oSettings)
}
