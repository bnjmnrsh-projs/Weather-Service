/**
 * Test if a document property value has been set.
 * https://piccalil.li/tutorial/get-css-custom-property-value-with-javascript/
 *
 * @param {*} propKey
 * @returns
 */
const fGetCSSCustomProp = function (propKey) {
    let response = getComputedStyle(document.documentElement).getPropertyValue(
        propKey
    )

    if (response.length) {
        response = response.replace(/"/g, '').trim()
    }

    return response
}

/**
 * Update the text in the toggle match current state of dark mode
 *
 * @param {string} currentSetting light || dark
 */
const fSetButtonLabelAndStatus = function (currentSetting) {
    // modeToggleText.innerText = `Enable ${
    //     currentSetting === 'dark' ? 'light' : 'dark'
    // } mode`
    // modeStatusElement.innerText = `Color mode is now "${currentSetting}"`
}

/**
 * Apply data-user-color-scheme to the document element.
 *
 * @param {string} passedSetting
 */
const fApplySetting = function (passedSetting, STORAGE_KEY, ITEM_KEY) {
    const currentSetting = passedSetting || localStorage.getItem(STORAGE_KEY)

    if (currentSetting) {
        document.documentElement.setAttribute(
            'data-user-color-scheme',
            currentSetting
        )
        fSetButtonLabelAndStatus(currentSetting)
    } else {
        fSetButtonLabelAndStatus(fGetCSSCustomProp(ITEM_KEY))
    }
}

/**
 * Set up dark mode toggel behavior
 */
export const fDkModeToggle = function () {
    const STORAGE_KEY = 'user-color-scheme'
    const COLOR_MODE_KEY = '--color-mode'
    const nDkMdToggle = document.querySelector('#theme-toggle')

    /**
     * Get the last saved value for the toggel from local storage
     *
     * @returns {string} light || dark
     */
    const fToggleSetting = function () {
        let currentSetting = localStorage.getItem(STORAGE_KEY)

        switch (currentSetting) {
            case null:
                currentSetting =
                    fGetCSSCustomProp(COLOR_MODE_KEY) === 'dark'
                        ? 'light'
                        : 'dark'
                break
            case 'light':
                currentSetting = 'dark'
                break
            case 'dark':
                currentSetting = 'light'
                break
        }

        localStorage.setItem(STORAGE_KEY, currentSetting)

        return currentSetting
    }

    // when the document is loaded
    document.addEventListener('DOMContentLoaded', function () {
        // if the stored color mode is dark, set the toggle
        if (fGetCSSCustomProp(COLOR_MODE_KEY) === 'dark') {
            console.log(nDkMdToggle)
            nDkMdToggle.setAttribute('checked', '')
        }

        // if the darkmode system preference changes
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', function (e) {
                fApplySetting(fToggleSetting())
            })
    })

    // on click, change the setting
    document.addEventListener('click', function (e) {
        if (e.target.id === 'theme-toggle') {
            fApplySetting(fToggleSetting())
        }
    })
}
