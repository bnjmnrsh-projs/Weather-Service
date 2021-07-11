import * as Icons from '../_icons'
import * as Moon from '../_moonPhases'
import * as Scales from '../_scales'
import { fDetsStr } from '../_strings'
import { fClean } from '../_helpers'

/**
 * Renders the app's details secection
 *
 * @param {object} _oData
 * @param {object} _oSettings
 * @returns {string}
 */
export const fRenderDetails = function (_oData, _oSettings) {
    const oCURRENT = _oData.CURRENT.data[0]
    const iconCloud = Icons.fGetCloudCoverIcon(oCURRENT.clouds)
    const oMoon = Moon.fPhase(oCURRENT.obj_time, _oSettings)
    const oIcons = _oSettings.icon

    const template = `
        <div id="details">
            <ul class="unstyled">
                <li class="feels-like">
                    <span class="left-col">{{feels_like}} {{app_temp}}</span>
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
                            <span class="left-col">{{uv}} {{uv_index}}</span>
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
                    <span class="left-col">{{cloud}} {{cloud_percent}}</span>
                    ${iconCloud[2]}
                </li>
                ${
                    oCURRENT.snow
                        ? `<li>
                            <span class="left-col">{{snow}} {{snow_percip}}</span>
                            ${oIcons.sSnow}
                          </li>`
                        : ''
                }
                <li class="precipitation">
                    <span class="left-col">{{rain}} {{rain_percip}}</span>
                    ${oIcons.sRaindrop}
                </li>
                <li class="windspeed" aria-description="{{aira_winds}} ">
                    <span class="left-col">
                        {{wind}} {{wind_speed}}<span aira-hidden>&nbsp;|&nbsp;</span><span hidden>{{aira_winds_join}}</span>{{wind_direction}}
                    </span>
                    <span class="inline-icon">
                        ${Icons.fSetStringElAttrs(oIcons.sWindDirection, {
                            style: `transform: rotate(${fClean(
                                oCURRENT.wind_dir + 180
                            )}deg)`,
                        })}
                        ${oIcons.sWind}
                    </span>
                </li>
                <li class="visibility">
                    <div class="visibility-wrap">
                        <span class="left-col">{{vis}} {{vis_distance}}</span>
                        ${oIcons.sBinoculars}
                    </div>
                    <div class="visibility-graph" aria-hidden="true"><div class="distance"></div></div>
                </li>
                <li class="sun-rise-set">
                    <span class="left-col">{{sun_rise_set}} {{sun_rise}} | {{sun_set}}</span>
                    ${oIcons.sSunrise}
                </li>
                <li class="moonphase">
                    <span class="left-col">{{moon}} ${oMoon.name}</span>
                    <img class="inline-icon moon"
                        alt=""
                        height="25" width="25"
                        src="./svg/icons/moon/svg/${oMoon.phase}.svg"/>
                </li>
            </ul>
        </div>`
    return fDetsStr(template, _oData, _oSettings)
}
