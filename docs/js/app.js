/*! weather-service v1.0.0 | (c) 2021 bnjmnrsh@gmail.com | MIT License | git+ssh://git@github.com/bnjmnrsh-projs/Weather-Service.git */
(function () {
    'use strict';

    /**
     * The Weather Service
     * @author bnjmnrsh@gmail.com
     *
     * @param {object} [_oSettings={}]
     */

    const weatherApp = function (_oSettings = {}) {
        const _oDefaults = {
            target: '#app',
            units: 'M',
            debug: false,
            dev: false,
        };

        // Merge settings with defaults
        _oSettings = Object.assign(_oDefaults, _oSettings);

        if (_oSettings.dev === true) ;

        // DOM Target
        document.querySelector(_oSettings.target);

        // SVGs are staged in HTML for details section,
        // the remainder of images are inlined(except Cloudcover & Moon, loaded dynamically)
        const nIcons = document.querySelector('#svgs');
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
            sSunnyDay: nIcons.querySelector('.svg-wi-day-sunny').outerHTML,
            // moon phases loaded as <img src="./svg/icons/moon/svg/${oMoon.phase}.svg">
        };
        // fInit()
    };

    // with debugging and Imperial Units
    const settings = {
        units: 'M',
        debug: true,
        dev: false,
    };

    weatherApp(settings);

}());
//# sourceMappingURL=app.js.map
