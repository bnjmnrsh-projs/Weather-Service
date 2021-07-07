/**
 * Render errors to the user
 *
 * @param {obj} err
 * @returns
 */
export const fRenderErrors = function (err) {
    return `<div id="hud">
                <div id="ohnos">
                    <h3><span aria-hidden="true">⥀.⥀<br /></span>Oh Nooos!</h3>
                    <p class="sr-only">There has been a crittical error:</p>
                        <div>
                            ${err.stack ? '<pre>' + err.stack + '<pre>' : ''}
                            ${
                                err.status
                                    ? '<pre>' +
                                      err.statusText +
                                      ': ' +
                                      err.status +
                                      '<pre>'
                                    : ''
                            }
                        </div>
                    <img alt="" src="./svg/icons/weather/svg/wi-alien.svg"/>
                </div>
            </div>`
}
