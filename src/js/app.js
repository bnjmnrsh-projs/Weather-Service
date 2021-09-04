import * as Queries from './_queries'
import * as Scales from './_scales'
import { floadIconObject } from './_icons'
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

  // Enable debugging & dev API responses via URL
  const { searchParams } = new URL(document.URL)
  _oSettings.debug = searchParams.has('DEBUG')
  if (searchParams.has('DEV')) {
    _oSettings.dev = searchParams.get('DEV')
  }

  // Set location lat lon via URL
  if (searchParams.has('lat') && searchParams.has('lon')) {
    _oSettings.loc = {
      longitude: searchParams.has('lat'),
      latitude: searchParams.has('lon')
    }
  }

  // API urls
  const sIpapiLocationApi = 'https://ipapi.co/json/'
  let sWeatherApi = 'https://weatherserv.bnjmnrsh.workers.dev/?'

  if (_oSettings.dev) {
    sWeatherApi = `${sWeatherApi}&DEV=${_oSettings.dev}`
  }

  /**
   * SVG icons staged in index.html
   * TODO: Moon phases loaded as img paths: <img src="./svg/icons/moon/svg/${oMoon.phase}.svg">
   */
  _oSettings.icon = floadIconObject()

  /**
   * Build the UI
   *
   * @param {array} data
   */
  const fBuildUI = function (_oData) {
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
      fRenderErrors(e, _oSettings)
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
  units: 'I', // I, M
  debug: false,
  dev: false // true (malformed json), '5XX_FULL', '5XX_PARTIAL', 'DUMMY', 'NO_KEY', 'OVER_QUOTA', 'API_ERROR'
}

weatherApp(settings)
