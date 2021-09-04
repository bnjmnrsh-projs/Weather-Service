/**
 * Render errors to the user
 *
 * @param {obj} err
 * @returns
 */
export const fRenderErrors = function (err, _oSettings) {
  const nApp = document.querySelector(_oSettings.target)
  nApp.innerHTML = `<div id="ohnos" class="c-screen errors">
                <h3><span aria-hidden="true">⥀.⥀</span><br>Oh Nooos!</h3>
                <p class="sr-only">There has been a crittical error:</p>
                    <div class="errors-wrap">
                        ${err.stack ? '<code>' + err.stack + '</code>' : ''}
                        ${
                          err.status
                            ? `<code>${err.status}: ${
                                err.statusText ?? err.status_message
                              }</code>`
                            : ''
                        }
                    </div>
                <img alt="" class="screen-icon errors-icon" src="./svg/icons/weather/svg/wi-alien.svg"/>
            </div>`
}
