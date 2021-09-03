import * as Queries from './_queries'
import * as Scales from './_scales'

import { fRenderHUD } from './components/_hud'
import { fRenderForecast } from './components/_forecast'
import { fRenderDetails } from './components/_details'
import { fRenderErrors } from './components/_errors'
import { ThemeToggle } from './_ThemeToggle'

/**
 * The Weather Service
 *
 * @author bnjmnrsh@gmail.com
 *
 * @param {object} [_oSettings={}]
 */

const weatherApp = function (_oSettings = {}) {
  document.documentElement.classList.remove('no-js')

  const _oDefaults = {
    target: '#app',
    units: 'M',
    debug: false,
    dev: false,
    api_retries: 3
  }

  // Merge settings with defaults
  _oSettings = Object.assign(_oDefaults, _oSettings)

  // API urls
  const sIpapiLocationApi = 'https://ipapi.co/json/'
  let sWeatherApi = 'https://weatherserv.bnjmnrsh.workers.dev/?'

  if (_oSettings.dev) {
    sWeatherApi = `${sWeatherApi}&DEV=${_oSettings.dev}`
  }

  // DOM Target
  const nApp = document.querySelector(_oSettings.target)

  // SVGs are staged in HTML for details section,
  // the remainder of images are inlined(except Cloudcover & Moon, loaded dynamically)
  const nIcons = document.querySelector('#svgs')

  _oSettings.icon = {
    // degrees/compass inline
    sWind: nIcons.querySelector('.svg-wi-strong-wind').outerHTML,
    sThermometer: nIcons.querySelector('.svg-wi-thermometer').outerHTML,
    sWindDirection: nIcons.querySelector('.svg-wi-wind-deg').outerHTML,
    sSnow: nIcons.querySelector('.svg-wi-snow').outerHTML,

    // cloud lodaded dynamically
    sRaindrop: nIcons.querySelector('.svg-wi-raindrop').outerHTML,
    sBinoculars: nIcons.querySelector('.svg-binoculars').outerHTML,
    sSunrise: nIcons.querySelector('.svg-wi-sunrise').outerHTML,
    sSunset: nIcons.querySelector('.svg-wi-sunset').outerHTML,
    sSunnyDay: nIcons.querySelector('.svg-wi-day-sunny').outerHTML
    // moon phases are loaded as img pathsL: <img src="./svg/icons/moon/svg/${oMoon.phase}.svg">
  }

  /**
   * Build the UI
   *
   * @param {array} data
   */
  const fBuildUI = function (_oData) {
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

  /**
   * Init
   */
  const fInit = async function () {
    try {
      if (!_oSettings.loc) {
        _oSettings.loc = await Queries.fGetLocation(
          sIpapiLocationApi,
          _oSettings
        )
      }
      const loc = await Queries.fGetLocation(sIpapiLocationApi, _oSettings)
      const _oWeather = await Queries.fGetWeather(loc, sWeatherApi, _oSettings)

      if (_oSettings.debug) {
        console.log('fGetLocation response:', loc)
        console.log('fGetWeather response:', _oWeather)
      }
      if (_oWeather) {
        fBuildUI(_oWeather)
      }
    } catch (e) {
      console.error('init error: ', e)
      nApp.innerHTML = fRenderErrors(e)
    }
  }
  fInit()

  // Enable ThemeToggle
  const themeToggle = new ThemeToggle({ debug: _oSettings.debug })
  themeToggle.init()

  // const themeToggle2 = new ThemeToggle({
  //   debug: true,
  //   buttonID: '#theme-toggler-2'
  // })
  // themeToggle2.init()
}

// with debugging and Imperial Units
const settings = {
  units: 'I',
  debug: false,
  dev: false // 5XX_FULL, 5XX_PARTIAL, DUMMY, NO_KEY, OVER_QUOTA, API_ERROR
}

weatherApp(settings)
