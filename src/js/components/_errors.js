/**
 * Render errors to the user
 *
 * @param {obj} err
 * @returns
 */
export const fRenderErrors = function (err) {
    return `<div id="ohnos" class="screen errors">
                <h3><span aria-hidden="true">⥀.⥀</span><br>Oh Nooos!</h3>
                <p class="sr-only">There has been a crittical error:</p>
                    <div class="errors-wrap">
                        ${err.stack ? '<code>' + err.stack + '</code>' : ''}
                        ${
                            err.status
                                ? '<code>' +
                                  err.statusText +
                                  ': ' +
                                  err.status +
                                  '</code>'
                                : ''
                        }
                    </div>
                <img alt="" class="screen-icon errors-icon" src="./svg/icons/weather/svg/wi-alien.svg"/>
            </div>`
}
