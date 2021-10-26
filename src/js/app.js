import * as Queries from './_queries'
import { fBuildAppSettingsObj } from './_buildAppSettingsObj'
import { fGetLocWeatherObj } from './_LocWeather'
import { fRenderFullUI } from './_buildUI'
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
  // We have JS so remove the flag from the css class from the document element
  document.documentElement.classList.remove('no-js')

  /**
   * Default params
   *
   * fBuildBaseWeatherApiQuery() returns the base url with def flags only.
   * Location information is assembeled in Queries.fAssembleWeatherQuery()
   */
  const _oDefaults = {
    target: '#app',
    units: 'M',
    debug: false,
    devFlags: false,
    loc: {
      longitude: '',
      latitude: ''
    },
    stale: 20 * 60000, // minutes to milliseconds, localSorage stale value
    key: 'WEATHERLOC', // localSorage for localSorage
    api_retries: 3,
    locApi: 'https://ipapi.co/json/',
    weatherApi: 'https://weatherserv.bnjmnrsh.workers.dev/?',
    fBuildBaseWeatherApiQuery() {
      return this.devFlags
        ? `${this.weatherApi}&DEV=${this.devFlags}`
        : `${this.weatherApi}`
    }
  }

  // Build _oSettings object
  _oSettings = fBuildAppSettingsObj(_oDefaults, _oSettings)

  // Prep for saving to localstore or WebDB for PWA
  // const _oLocWeather = fGetLocWeatherObj(_oSettings)

  /**
   * Init
   */
  const fInit = async function () {
    try {
      if (!_oSettings.loc) {
        _oSettings.loc = await Queries.fGetLocation(
          _oSettings.locApi,
          _oSettings
        )
      }
      const loc = await Queries.fGetLocation(_oSettings.locApi, _oSettings)
      const _oWeather = await Queries.fGetWeather(
        loc,
        _oSettings.fBuildBaseWeatherApiQuery(),
        _oSettings
      )

      if (_oSettings.debug) {
        console.log('fGetLocation response:', loc)
        console.log('fGetWeather response:', _oWeather)
      }
      if (_oWeather) {
        fRenderFullUI(_oWeather, _oSettings)
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

  // Example of multiple toggles
  // const themeToggle2 = new ThemeToggle({
  //   debug: true,
  //   buttonID: '#theme-toggler-2'
  // })
  // themeToggle2.init()
}

// With debugging and Imperial Units
const settings = {
  units: 'I', // I, M
  debug: false,
  devFlags: false // true (error screen, malformed json), '5XX_FULL', '5XX_PARTIAL', 'DUMMY', 'NO_KEY', 'OVER_QUOTA', 'API_ERROR'
}

// Kick off our application
weatherApp(settings)
