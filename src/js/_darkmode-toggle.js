/**
 * Toggle user-color-scheme.
 *
 * @author bnjmnrsh@gmail.com
 */
export const ThemeToggle = function (options = {}) {
    //
    // Settings & Defaults
    //
    const defaults = {
        buttonID: '#theme-toggler',
    }
    // Merge user options into defaults
    const settings = Object.assign({}, defaults, options)
    settings.STORAGE_KEY = 'user-color-scheme'
    settings.COLOR_MODE_KEY = '--color-mode'
    this.settings = settings

    //
    // Varriables
    //
    const nThemeToggel = document.querySelector(settings.buttonID)
    const nHTML = document.documentElement

    //
    // Private Methods
    //

    /**
     * Test if a document property value has been set.
     * https://piccalil.li/tutorial/get-css-custom-property-value-with-javascript/
     *
     * @param {string} propKey
     * @returns {string} dark || light
     */
    const fGetValUserColorSchemeAttr = function () {
        let response = getComputedStyle(nHTML).getPropertyValue(
            settings.COLOR_MODE_KEY
        )
        if (response.length) {
            response = response.replace(/"/g, '').trim()
        }
        return response
    }

    /**
     * Get the last saved value from local storage, or System prefers-color-scheme
     *
     * @param {string} STORAGE_KEY
     * @returns {string} light || dark
     */

    const fGetLocalStoredColorSchemeVal = function () {
        let sCurrentSetting = localStorage.getItem(settings.STORAGE_KEY)

        switch (sCurrentSetting) {
            case null:
                sCurrentSetting =
                    fGetValUserColorSchemeAttr() === 'dark' ? 'dark' : 'light'
                // Set to localStorage
                localStorage.setItem(settings.STORAGE_KEY, sCurrentSetting)
                break
            case 'light':
                sCurrentSetting = 'light'
                break
            case 'dark':
                sCurrentSetting = 'dark'
                break
        }

        return sCurrentSetting
    }

    /**
     * Apply data-user-color-scheme to document.
     *
     * @param {string} passedSetting
     */
    const fSetGlobalColorScheme = function (sColorSetting) {
        const sCurrentSetting =
            sColorSetting || localStorage.getItem(settings.STORAGE_KEY)

        if (sCurrentSetting) {
            nHTML.setAttribute('data-user-color-scheme', sCurrentSetting)
            // Set to localStorage
            localStorage.setItem(settings.STORAGE_KEY, sCurrentSetting)
        }
    }

    const fToggleColorScheme = function () {
        const sCurrentSetting = fGetLocalStoredColorSchemeVal()

        switch (sCurrentSetting) {
            case 'light':
                fSetGlobalColorScheme('dark')
                nThemeToggel.toggleAttribute('aria-pressed')
                break
            case 'dark':
                fSetGlobalColorScheme('light')
                nThemeToggel.toggleAttribute('aria-pressed')
                break
        }
    }

    /**
     * Update the aria-pressed state of the button
     *
     * @param {string} currentSetting
     */
    const fApplyButtonState = function (currentSetting) {
        if (currentSetting === 'dark') {
            nThemeToggel.setAttribute('aria-pressed', 'true')
        } else if (currentSetting === 'light') {
            nThemeToggel.removeAttribute('aria-pressed')
        }
    }

    /**
     * Add event listeners for clicks and system changes to prefers-color-scheme
     */
    const fAddEventListeners = function () {
        // Detect prefers-color-scheme system preference changes
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', function (e) {
                if (e.matches) {
                    fSetGlobalColorScheme('dark')
                    fApplyButtonState('dark')
                } else {
                    fSetGlobalColorScheme('light')
                    fApplyButtonState('light')
                }
            })

        // Capture clicks on the toggle
        document.addEventListener('click', function (e) {
            if (e.target.id === nThemeToggel.id) {
                fToggleColorScheme()
            }
        })
    }

    //
    // Public APIs
    //

    this.init = function () {
        if (!nThemeToggel) {
            console.warn('theme toggel button not found, node:', nThemeToggel)
            return
        } else {
            // Enable the button
            nThemeToggel.removeAttribute('disabled')
        }

        // Add event listeners
        fAddEventListeners()

        // Establish toggle/theme state based on system and last pref saved in localStorage
        fSetGlobalColorScheme(fGetLocalStoredColorSchemeVal())
        fApplyButtonState(fGetLocalStoredColorSchemeVal())

        console.log(
            'first run, curent setting: ',
            localStorage.getItem(settings.STORAGE_KEY)
        )
    }

    //
    // Return the Public APIs
    //
    return this
}
