import * as Queries from './_queries'
import * as Scales from './_scales'

import { fRenderHUD } from './components/_hud'
import { fRenderForcast } from './components/_forcast'
import { fRenderDetails } from './components/_details'
import { fErrorDisplay } from './components/_errors'

/**
 * The Weather Service
 * @author bnjmnrsh@gmail.com
 *
 * @param {object} [_oSettings={}]
 */

const weatherApp = function (_oSettings = {}) {
    const _oDefaults = {
        target: '#app',
        KEY: '',
        units: 'M',
        forcast: `{{forcast}}`,
        airaForcast: `The weather is currently: {{forcast}} at {{temp}}.`,
        location: `{{city}}, {{country}}`,
        debug: false,
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

    // degrees/compass inline
    _oSettings.nWind = nIcons.querySelector('.svg-wi-strong-wind').outerHTML
    _oSettings.nSnow = nIcons.querySelector('.svg-wi-snow').outerHTML

    // cloud lodaded dynamically
    _oSettings.nRaindrop = nIcons.querySelector('.svg-wi-raindrop').outerHTML
    _oSettings.nBinoculars = nIcons.querySelector('.svg-binoculars').outerHTML
    _oSettings.nSunrise = nIcons.querySelector('.svg-wi-sunrise').outerHTML
    _oSettings.nSunset = nIcons.querySelector('.svg-wi-sunset').outerHTML
    // moon phases loaded as <img>

    /**
     * Build the UI
     *
     * @param {array} data
     */
    const fBuildUI = function (_oWeather) {
        app.innerHTML =
            fRenderHUD(_oWeather.CURRENT.data[0], _oSettings) +
            fRenderDetails(_oWeather.CURRENT.data[0], _oSettings) +
            fRenderForcast(_oWeather.DAILY.data, _oSettings)

        // Adjust the visibility 'fogg' bar in the details section
        Scales.fSetVisabilityScale(_oWeather.CURRENT.data[0].vis)
    }

    /**
     * Init
     */
    const fInit = async function () {
        try {
            const loc = await Queries.fGetLocation(
                sIpapiLocationApi,
                _oSettings
            )
            const _oWeather = await Queries.fGetWeather(
                loc,
                sWeatherApi,
                _oSettings
            )

            _oSettings.debug ? console.log('fGetLocation response:', loc) : ''
            _oSettings.debug
                ? console.log('fGetWeather response:', _oWeather)
                : ''

            fBuildUI(_oWeather)
        } catch (e) {
            console.error('init error: ', e)
            nApp.innerHTML = fErrorDisplay(e)
        }
    }
    fInit()
}

// with debugging and Imperial Units
const settings = {
    forcast: `Currently: {{forcast}}`,
    units: 'I',
    debug: true,
    dev: false,
}

weatherApp(settings)
