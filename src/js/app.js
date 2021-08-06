import * as Queries from './_queries'
import * as Scales from './_scales'

import { fRenderHUD } from './components/_hud'
import { fRenderForecast } from './components/_forecast'
import { fRenderDetails } from './components/_details'
import { fRenderErrors } from './components/_errors'
import { ThemeToggle } from './_darkmode-toggle'

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
    dev: false
  }

  // Merge settings with defaults
  _oSettings = Object.assign(_oDefaults, _oSettings)

  // API urls
  const sIpapiLocationApi = 'https://ipapi.co/json/'
  let sWeatherApi = `https://weatherserv.bnjmnrsh.workers.dev/?`

  if (_oSettings.dev === true) {
    sWeatherApi = `${sWeatherApi}&DEV=true`
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
    nApp.classList.remove('loading')
    nApp.innerHTML =
      fRenderHUD(_oData, _oSettings) +
      fRenderDetails(_oData, _oSettings) +
      fRenderForecast(_oData.DAILY.data, _oSettings)

    // Adjust the visibility 'fogg' bar in the details section
    Scales.fSetVisabilityScale(_oData.CURRENT.data[0].vis)
  }

  /**
   * Init
   */
  const fInit = async function () {
    try {
      const loc = await Queries.fGetLocation(sIpapiLocationApi, _oSettings)
      const _oWeather = await Queries.fGetWeather(loc, sWeatherApi, _oSettings)

      if (_oSettings.debug) {
        console.log('fGetLocation response:', loc)
        console.log('fGetWeather response:', _oWeather)
      }

      fBuildUI(_oWeather)
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
  debug: 'DUMMY', // DUMMY, OVER_QUOTA, 5XX_FULL, 5XX_PARTIAL, NO_KEY
  dev: false
}

weatherApp(settings)
