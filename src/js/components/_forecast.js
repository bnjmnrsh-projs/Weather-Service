import * as Convert from '../_conversions'
import * as Dates from '../_datetime'
import * as Icons from '../_icons'
import * as Scales from '../_scales'
import { fClean } from '../_helpers'

/**
 * Renders individual upcoming forcast li elements
 *
 * @param {object} _oForecast
 * @returns {string}
 */
const fRenderForecastList = function (_oForecast, _oSettings) {
    console.log('fRenderForcast: ', _oForecast)
    console.log('_oSettings: ', _oSettings)

    const days = Object.keys(_oForecast)
    return days
        .map(function (el) {
            return `<li data-temp="${Scales.fTempDataPt(
                fClean(_oForecast[el].temp),
                _oSettings
            )}">
                        <header datetime="${fClean(
                            _oForecast[el].datetime
                        )}" aria-description="The forcast for">${Dates.fGetWeekday(fClean(_oForecast[el].datetime))} ${Dates.fGetDayOrdinal(fClean(_oForecast[el].datetime))}</header>
                        <img class="weather-icon" alt="${fClean(
                            _oForecast[el].weather.description
                        )}" src="./svg/icons/weather/svg/${Icons.fGetWeatherIcon(_oForecast[el])}.svg" />
                        <p class="forecast-description" aria-hidden="true">${fClean(
                            _oForecast[el].weather.description.toLowerCase()
                        )}</p>
                         <span><stong>${Convert.fTemp(
                             fClean(_oForecast[el].high_temp),
                             _oSettings
                         )}</stong></span>
                          <span>${Convert.fTemp(
                              fClean(_oForecast[el].low_temp),
                              _oSettings
                          )}</span>

                    </li>`
        })
        .join('')
}

/**
 * Renders the app's upcoming forcast section
 *
 * @param {object} _oForecast
 * @returns {string}
 */
export const fRenderForecast = function (_oForecast, _oSettings) {
    return `
        <div id="forcast" aria-description="The weather forcast for the next 16 days.">
            <ul class="unstyled">
                ${fRenderForecastList(_oForecast, _oSettings)}
            </ul>
        </div>
        `
}
