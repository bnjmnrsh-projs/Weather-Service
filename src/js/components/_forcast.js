import * as Convert from '../_conversions'
import * as Helpers from '../_helpers'
import * as Icons from '../_icons'
import * as Scales from '../_scales'

/**
 * Renders individual upcoming forcast li elements
 *
 * @param {object} forecast
 * @returns {string}
 */
const fRenderForcastList = function (forecast, _oSettings) {
    console.log('fRenderForcast: ', forecast)
    console.log('_oSettings: ', _oSettings)

    const days = Object.keys(forecast)
    return days
        .map(function (el) {
            return `<li data-temp="${Scales.fTempDataPt(
                Helpers.fClean(forecast[el].temp),
                _oSettings
            )}">
                        <header datetime="${Helpers.fClean(
                            forecast[el].datetime
                        )}" aria-description="">${Helpers.getWeekday(forecast[el].datetime)}</header>
                        <img class="weather-icon" alt="${Helpers.fClean(
                            forecast[el].weather.description
                        )}" src="./svg/icons/weather/svg/${Icons.getWeatherIcon(forecast[el])}.svg" />
                         <span><stong>${Convert.fTemp(
                             Helpers.fClean(forecast[el].high_temp),
                             _oSettings
                         )}</stong></span>
                          <span>${Convert.fTemp(
                              Helpers.fClean(forecast[el].low_temp),
                              _oSettings
                          )}</span>
                        <p class="forecast-description" aria-hidden="true">${Helpers.fClean(
                            forecast[el].weather.description.toLowerCase()
                        )}</p>
                    </li>`
        })
        .join('')
}

/**
 * Renders the app's upcoming forcast section
 *
 * @param {object} forecast
 * @returns {string}
 */
export const fRenderForcast = function (forecast, _oSettings) {
    return `
        <div id="forcast" aria-description="The weather forcast for the next 16 days.">
            <ul class="unstyled">
                ${fRenderForcastList(forecast, _oSettings)}
            </ul>
        </div>
        `
}
