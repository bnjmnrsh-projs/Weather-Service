import * as Scales from './_scales'
import { fRenderHUD } from './components/_hud'
import { fRenderForecast } from './components/_forecast'
import { fRenderDetails } from './components/_details'

/**
 * Render the complete UI
 *
 * @param {array} data
 */
export const fRenderFullUI = function (_oData, _oSettings) {
  const nApp = document.querySelector(_oSettings.target)
  nApp.querySelector('#hud').outerHTML = fRenderHUD(_oData, _oSettings)

  if (_oData.CURRENT.error || _oData.CURRENT.status) {
    nApp.querySelector('#details').classList.remove('loading')
    nApp.querySelector('#details').classList.add('error')
  } else {
    nApp.querySelector('#details').outerHTML = fRenderDetails(
      _oData.CURRENT.data[0],
      _oData,
      _oSettings
    )
  }

  nApp.querySelector('#forecast').outerHTML = fRenderForecast(
    _oData.DAILY,
    _oSettings
  )
  if (!_oData.CURRENT.error && !_oData.CURRENT.status) {
    // Adjust the visibility 'fogg' bar in the details section
    Scales.fSetVisabilityScale(_oData.CURRENT.data[0].vis)
  }
  nApp.classList.remove('loading')
}
