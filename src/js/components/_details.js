import * as Convert from '../_conversions'
import * as Dates from '../_datetime'
import * as Icons from '../_icons'
import * as Moon from '../_moonPhases'
import * as Scales from '../_scales'
import { fUIstr } from '../_strings'
import { fClean } from '../_helpers'

/**
 * Renders the app's details secection
 *
 * @param {array} data
 * @returns {string}
 */
export const fRenderDetails = function (_oData, _oSettings) {
    const oCURRENT = _oData.CURRENT.data[0]
    const sWindDirection = fClean(oCURRENT.wind_cdir_full)
    const sWindDeg = fClean(oCURRENT.wind_dir)
    const iconCloud = Icons.fGetCloudCoverIcon(oCURRENT.clouds)
    const oMoon = Moon.fPhase(oCURRENT.obj_time, _oSettings)
    const oIcons = _oSettings.icon

    const template = `
        <div id="details">
            <ul class="unstyled">
                <li class="feels-like">
                    <span class="left-col"> {{feels_like}} {{app_temp}}</span>
                    ${Icons.fSetStringElAttrs(_oSettings.icon.sThermometer, {
                        class: 'inline-icon',
                        data: {
                            temp: Scales.fTempDataPt(fClean(oCURRENT.app_temp)),
                        },
                    })}
                </li>
                ${
                    oCURRENT.uv
                        ? `<li class="uv-index">
                            <span class="left-col">{{uv}} ${fClean(
                                oCURRENT.uv.toFixed(2)
                            )}</span>
                            ${Icons.fSetStringElAttrs(
                                _oSettings.icon.sSunnyDay,
                                {
                                    class: 'inline-icon',
                                    data: {
                                        uv: Scales.fUvDataPt(
                                            fClean(oCURRENT.uv),
                                            _oSettings
                                        ),
                                    },
                                }
                            )}
                          </li>`
                        : ''
                }
                <li class="cloud-cover">
                    <span class="left-col">
                    {{cloud}}
                    ${fClean(oCURRENT.clouds)}% </span>
                    ${iconCloud[2]}
                </li>
                ${
                    oCURRENT.snow
                        ? `<li>
                            {{snow}}
                            <span class="left-col">{{snow}}${Convert.fPercip(
                                fClean(oCURRENT.snow),
                                _oSettings
                            )}</span>
                            ${oIcons.sSnow}
                          </li>`
                        : ''
                }
                <li class="precipitation">
                    <span class="left-col">{{percip}}
                          ${Convert.fPercip(
                              fClean(oCURRENT.precip),
                              _oSettings
                          )}
                          </span>${oIcons.sRaindrop}
                </li>
                <li class="windspeed"><span class="left-col">
                    <span aria-description="{{aira_winds}} ${sWindDirection}">
                        {{wind}}
                        ${Convert.fKmPerHour(
                            fClean(oCURRENT.wind_spd),
                            _oSettings
                        )}&nbsp;|&nbsp;${fClean(oCURRENT.wind_cdir)}
                    </span></span>
                    <span class="inline-icon">
                        ${Icons.fSetStringElAttrs(oIcons.sWindDirection, {
                            style: `transform: rotate(${fClean(
                                oCURRENT.wind_dir
                            )}deg)`,
                        })}
                        ${oIcons.sWind}
                    </span>

                </li>
                <li class="visibility">
                    <div class="visibility-wrap">
                        <span class="left-col">
                        {{vis}}
                        ${Convert.fKm(fClean(oCURRENT.vis), _oSettings)}
                        </span>
                        ${oIcons.sBinoculars}
                    </div>
                    <div class="visibility-graph" aria-hidden="true"><div class="distance"></div></div>
                </li>
                <li class="sun-rise-set">
                    <span class="left-col">
                        {{sun_rise_set}}
                        ${Dates.fGetLocalTime(
                            fClean(oCURRENT.ob_time),
                            _oSettings,
                            fClean(oCURRENT.sunrise)
                        )}
                        |
                        ${Dates.fGetLocalTime(
                            fClean(oCURRENT.ob_time),
                            _oSettings,
                            fClean(oCURRENT.sunset)
                        )}
                    </span>
                    ${oIcons.sSunrise}
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
    return fUIstr(template, _oData, _oSettings)
}
