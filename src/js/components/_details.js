import * as Convert from '../_conversions'
import * as Helpers from '../_helpers'
import * as Icons from '../_icons'
import * as Moon from '../_moonPhases'
import * as Scales from '../_scales'

/**
 * Renders the app's details secection
 *
 * @param {array} data
 * @returns {string}
 */
export const fRenderDetails = function (data, _oSettings) {
    console.log('fRenderDetails: ', data)
    const sWindDirection = Helpers.fClean(data.wind_cdir_full)
    const sWindDeg = Helpers.fClean(data.wind_dir)
    const iconCloud = Icons.fGetCloudCoverIcon(data.clouds)
    const oMoon = Moon.fPhase(data.obj_time, _oSettings)

    return `
        <div id="details">
            <ul class="unstyled">
                <li class="feels-like">
                <span class="left-col">Feels like:
                    ${Convert.fTemp(Helpers.fClean(data.app_temp), _oSettings)}
                </span>
                <svg alt="" height="25" width="25" class="inline-icon svg-wi-thermometer" data-temp="${Scales.fTempDataPt(
                    Helpers.fClean(data.app_temp)
                )}" enable-background="new 0 0 30 30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="m9.91 19.56c0-.85.2-1.64.59-2.38s.94-1.35 1.65-1.84v-9.92c0-.8.27-1.48.82-2.03s1.23-.84 2.03-.84c.81 0 1.49.28 2.04.83.55.56.83 1.23.83 2.03v9.92c.71.49 1.25 1.11 1.64 1.84s.58 1.53.58 2.38c0 .92-.23 1.78-.68 2.56s-1.07 1.4-1.85 1.85-1.63.68-2.56.68c-.92 0-1.77-.23-2.55-.68s-1.4-1.07-1.86-1.85-.68-1.63-.68-2.55zm1.76 0c0 .93.33 1.73.98 2.39s1.44.99 2.36.99c.93 0 1.73-.33 2.4-1s1.01-1.46 1.01-2.37c0-.62-.16-1.2-.48-1.73s-.76-.94-1.32-1.23l-.28-.14c-.1-.04-.15-.14-.15-.29v-10.76c0-.32-.11-.59-.34-.81-.23-.21-.51-.32-.85-.32-.32 0-.6.11-.83.32s-.34.48-.34.81v10.74c0 .15-.05.25-.14.29l-.27.14c-.55.29-.98.7-1.29 1.23s-.46 1.1-.46 1.74zm.78 0c0 .71.24 1.32.73 1.82s1.07.75 1.76.75 1.28-.25 1.79-.75.76-1.11.76-1.81c0-.63-.22-1.19-.65-1.67s-.96-.77-1.58-.85v-7.36c0-.06-.03-.13-.1-.19-.07-.07-.14-.1-.22-.1-.09 0-.16.03-.21.08-.05.06-.08.12-.08.21v7.34c-.61.09-1.13.37-1.56.85-.43.49-.64 1.04-.64 1.68z"/></svg>
                ${
                    data.uv
                        ? '<li class="uv-index"><span class="left-col">UV Index: ' +
                          Helpers.fClean(data.uv.toFixed(2)) +
                          '</span><svg alt="" height="25" width="25" class="inline-icon svg-wi-day-sunny" data-uv="' +
                          Scales.fUvDataPt(Helpers.fClean(data.uv)) +
                          '" enable-background="new 0 0 30 30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="m4.4 14.9c0-.2.1-.4.2-.6.2-.2.4-.2.6-.2h2c.2 0 .4.1.6.2.2.2.2.4.2.6s0 .5-.2.6c-.2.2-.3.2-.6.2h-2c-.2 0-.4-.1-.6-.2-.1-.1-.2-.3-.2-.6zm2.8 6.9c0-.2.1-.4.2-.6l1.5-1.4c.1-.2.4-.2.6-.2s.4.1.6.2.2.3.2.6c0 .2-.1.5-.2.6l-1.4 1.4c-.4.3-.8.3-1.2 0-.2-.1-.3-.3-.3-.6zm0-13.8c0-.2.1-.4.2-.6.2-.2.4-.2.6-.2s.4.1.6.2l1.4 1.5c.2.1.2.4.2.6s-.1.4-.2.6-.4.2-.6.2-.4-.1-.6-.2l-1.3-1.5c-.2-.1-.3-.4-.3-.6zm2.6 6.9c0-.9.2-1.8.7-2.6s1.1-1.4 1.9-1.9 1.7-.7 2.6-.7c.7 0 1.4.1 2 .4s1.2.6 1.7 1.1.8 1 1.1 1.7c.3.6.4 1.3.4 2 0 .9-.2 1.8-.7 2.6s-1.1 1.4-1.9 1.9-1.7.7-2.6.7-1.8-.2-2.6-.7-1.4-1.1-1.9-1.9-.7-1.6-.7-2.6zm1.7 0c0 1 .3 1.8 1 2.5s1.5 1 2.5 1 1.8-.4 2.5-1 1-1.5 1-2.5-.4-1.8-1-2.5c-.7-.7-1.5-1-2.5-1s-1.8.3-2.5 1-1 1.6-1 2.5zm2.6 7.8c0-.2.1-.4.2-.6s.4-.2.6-.2.4.1.6.2.2.4.2.6v2c0 .2-.1.5-.2.6s-.4.2-.6.2-.4-.1-.6-.2c-.2-.2-.2-.4-.2-.6zm0-15.5v-2c0-.2.1-.4.2-.6s.4-.3.6-.3.4.1.6.2.2.4.2.6v2.1c0 .2-.1.4-.2.6s-.3.2-.5.2-.4-.1-.6-.2-.3-.4-.3-.6zm5.6 13.2c0-.2.1-.4.2-.6s.3-.2.6-.2c.2 0 .4.1.6.2l1.5 1.4c.2.2.2.4.2.6s-.1.4-.2.6c-.4.3-.8.3-1.2 0l-1.5-1.4c-.2-.2-.2-.4-.2-.6zm0-10.9c0-.2.1-.4.2-.6l1.4-1.5c.2-.2.4-.2.6-.2s.4.1.6.2c.2.2.2.4.2.6s-.1.5-.2.6l-1.5 1.5c-.2.2-.4.2-.6.2s-.4-.1-.6-.2-.1-.4-.1-.6zm2.2 5.4c0-.2.1-.4.2-.6.2-.2.4-.2.6-.2h2c.2 0 .4.1.6.3s.3.4.3.6-.1.4-.3.6-.4.2-.6.2h-2c-.2 0-.4-.1-.6-.2s-.2-.4-.2-.7z"/></svg>'
                        : ''
                }
                <li class="cloud-cover"><span class="left-col">Cloud:
                    ${Helpers.fClean(data.clouds)}% </span>
                    ${iconCloud[2]}
                ${
                    data.snow
                        ? '<li><span class="left-col">Snow: ' +
                          Convert.fPercip(Helpers.fClean(data.snow), _oS) +
                          '</span>' +
                          _oSettings.nSnow +
                          '</li>'
                        : ''
                }
                <li class="precipitation">
                    <span class="left-col">Precip:
                          ${Convert.fPercip(Helpers.fClean(data.precip))}
                          </span>${_oSettings.nRaindrop}
                </li>
                <li class="windspeed"><span class="left-col">
                    <span aria-description="Winds traveling from ${sWindDirection}">
                        Windspeed:
                        ${Convert.fKmPerHour(
                            Helpers.fClean(data.wind_spd),
                            _oSettings
                        )}&nbsp;|&nbsp;${Helpers.fClean(data.wind_cdir)}
                    </span></span>
                    <span class="inline-icon">
                        <svg alt="" height="25" width="25" class="compass"  style="transform: rotate(${sWindDeg}deg)" enable-background="new 0 0 30 30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="m3.74 14.5c0-2.04.51-3.93 1.52-5.66s2.38-3.1 4.11-4.11 3.61-1.51 5.64-1.51c1.52 0 2.98.3 4.37.89s2.58 1.4 3.59 2.4 1.81 2.2 2.4 3.6.89 2.85.89 4.39c0 1.52-.3 2.98-.89 4.37s-1.4 2.59-2.4 3.59-2.2 1.8-3.59 2.39-2.84.89-4.37.89-3-.3-4.39-.89-2.59-1.4-3.6-2.4-1.8-2.2-2.4-3.58-.88-2.84-.88-4.37zm2.48 0c0 2.37.86 4.43 2.59 6.18 1.73 1.73 3.79 2.59 6.2 2.59 1.58 0 3.05-.39 4.39-1.18s2.42-1.85 3.21-3.2 1.19-2.81 1.19-4.39-.4-3.05-1.19-4.4-1.86-2.42-3.21-3.21-2.81-1.18-4.39-1.18-3.05.39-4.39 1.18-2.42 1.86-3.22 3.21-1.18 2.82-1.18 4.4zm4.89 5.85 3.75-13.11c.01-.1.06-.15.15-.15s.14.05.15.15l3.74 13.11c.04.11.03.19-.02.25s-.13.06-.24 0l-3.47-1.3c-.1-.04-.2-.04-.29 0l-3.5 1.3c-.1.06-.17.06-.21 0s-.08-.15-.06-.25z"/></svg>
                        ${_oSettings.nWind}
                    </span>
                </li>
                <li class="visibility">
                    <div class="visibility-wrap">
                        <span class="left-col">Visibility:
                          ${Convert.fKm(Helpers.fClean(data.vis), _oSettings)}
                        </span>
                        ${_oSettings.nBinoculars}
                    </div>
                    <div class="visibility-graph" aria-hidden="true"><div class="distance"></div></div>
                </li>
                <li class="sun-up-down">
                    <span class="left-col">
                        ${Convert.fTime(
                            Helpers.fClean(data.sunrise),
                            _oSettings
                        )} | ${Convert.fTime(
        Helpers.fClean(data.sunset),
        _oSettings
    )}</span>
                    ${_oSettings.nSunrise}
                </li>
                <li class="moonphase">
                    <span class="left-col">Moon: ${oMoon.name}</span>
                    <img class="inline-icon moon"
                        alt=""
                        height="25" width="25"
                        src="./svg/icons/moon/svg/${oMoon.phase}.svg"/>
                </li>
            </ul>
        </div>
        `
}
