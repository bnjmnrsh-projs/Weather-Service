/**
 * Toggle user-color-scheme.
 *
 * @author bnjmnrsh@gmail.com
 */
export const ThemeToggle = function (oOptions = {}) {
    //
    // Settings & Defaults
    //

    const oDefaults = {
        buttonID: '#theme-toggler',
        debug: false,
    }

    // Merge user options into defaults
    const oSettings = Object.assign({}, oDefaults, oOptions)
    oSettings.STORAGE_KEY = 'user-color-scheme'
    oSettings.COLOR_MODE_KEY = '--color-mode'
    this.oSettings = oSettings

    //
    // Varriables
    //

    const nThemeToggel = document.querySelector(oSettings.buttonID)
    const nHTML = document.documentElement

    //
    // Private Methods
    //

    /**
     * Get the current value of the CSS '--color-mode' property.
     *
     * https://piccalil.li/tutorial/get-css-custom-property-value-with-javascript/
     *
     * @returns {string} dark || light
     */
    const fGetValUserColorSchemeAttr = function () {
        let sResponse = getComputedStyle(nHTML).getPropertyValue(
            oSettings.COLOR_MODE_KEY
        )
        if (sResponse.length) {
            sResponse = sResponse.replace(/"/g, '').trim()
        }

        if (oSettings.debug) {
            console.log(
                'ThemeToggle:fGetValUserColorSchemeAttr: sResponse:',
                sResponse
            )
        }

        return sResponse
    }

    /**
     * Get the last saved value from local storage, or System prefers-color-scheme
     *
     * @returns {string} light || dark
     */

    const fGetLocalStoredColorSchemeVal = function () {
        let sCurrentSetting = localStorage.getItem(oSettings.STORAGE_KEY)

        switch (sCurrentSetting) {
            case null:
                sCurrentSetting =
                    fGetValUserColorSchemeAttr() === 'dark' ? 'dark' : 'light'
                // Set to localStorage
                localStorage.setItem(oSettings.STORAGE_KEY, sCurrentSetting)
                break
            case 'light':
                sCurrentSetting = 'light'
                break
            case 'dark':
                sCurrentSetting = 'dark'
                break
        }

        if (oSettings.debug) {
            console.log(
                'ThemeToggle:fGetLocalStoredColorSchemeVal: sCurrentSetting:',
                sCurrentSetting
            )
        }

        return sCurrentSetting
    }

    /**
     * Apply data-user-color-scheme to document, update localStore
     *
     * @param {string} sColorSetting
     */
    const fSetGlobalColorScheme = function (sColorSetting) {
        const sCurrentSetting =
            sColorSetting || localStorage.getItem(oSettings.STORAGE_KEY)

        if (sCurrentSetting) {
            nHTML.setAttribute('data-user-color-scheme', sCurrentSetting)
            // Update localStorage
            localStorage.setItem(oSettings.STORAGE_KEY, sCurrentSetting)
        }

        if (oSettings.debug) {
            console.log('fSetGlobalColorScheme: sColorSetting:', sColorSetting)
        }
    }

    /**
     * Toggle the UI color scheme based on value saved in localStorage
     */
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

        if (oSettings.debug) {
            console.log(
                'ThemeToggle:fToggleColorScheme: sCurrentSetting:',
                sCurrentSetting
            )
        }
    }

    /**
     * Update the aria-pressed state of the button
     *
     * @param {string} sSetButtonState
     */
    const fApplyButtonState = function (sSetButtonState) {
        if (sSetButtonState === 'dark') {
            nThemeToggel.setAttribute('aria-pressed', 'true')
        } else if (sSetButtonState === 'light') {
            nThemeToggel.removeAttribute('aria-pressed')
        }
        if (oSettings.debug) {
            console.log(
                'ThemeToggle:fApplyButtonState: sCurrentSetting',
                sSetButtonState
            )
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

                if (oSettings.debug) {
                    console.log(
                        `ThemeToggle:fAddEventListeners: Window detected system color pref change: ${e.matches}`
                    )
                }
            })

        // Capture clicks on the toggle
        document.addEventListener('click', function (e) {
            if (e.target.id === nThemeToggel.id) {
                fToggleColorScheme()

                if (oSettings.debug) {
                    console.log(
                        `ThemeToggle:fAddEventListeners: button "${e.target.id}" clicked.`
                    )
                }
            }
        })

        // listen for changes to on html data-user-color-scheme attr if mutiple toggle-buttons
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (
                    mutation.attributeName === `data-${oSettings.STORAGE_KEY}`
                ) {
                    const sHTMLcolorMode = nHTML.getAttribute(
                        `data-${oSettings.STORAGE_KEY}`
                    )
                    // Update button state to reflect change
                    fApplyButtonState(sHTMLcolorMode)
                    // Update localStorage value to reflect change
                    localStorage.setItem(oSettings.STORAGE_KEY, sHTMLcolorMode)

                    if (oSettings.debug) {
                        console.log(
                            `ThemeToggle:fAddEventListeners: MutationObserver change: data-${oSettings.STORAGE_KEY}="${sHTMLcolorMode}"`
                        )
                    }
                }
            })
        })
        // MutationObserver options
        observer.observe(nHTML, {
            attributeFilter: [`data-${oSettings.STORAGE_KEY}`],
            attributeOldValue: true,
        })
    }

    /**
     * Public init method
     *
     * @returns public init method
     */
    this.init = function () {
        if (!nThemeToggel) {
            if (oSettings.debug) {
                console.warn(
                    "ThemeToggle: Couldn't find the theme toggel button with node selector:",
                    nThemeToggel
                )
            }
            return
        } else {
            // Enable the button
            nThemeToggel.removeAttribute('disabled')
        }

        // Add event listeners
        fAddEventListeners()

        // Establish toggle/theme state based on system and/or last pref saved in localStorage
        fSetGlobalColorScheme(fGetLocalStoredColorSchemeVal())
        fApplyButtonState(fGetLocalStoredColorSchemeVal())
        if (oSettings.debug) {
            console.log(
                'ThemeToggle:Init,  current localStore setting: ',
                localStorage.getItem(oSettings.STORAGE_KEY)
            )
        }
    }

    //
    // Return the Public API
    //
    return this
}
