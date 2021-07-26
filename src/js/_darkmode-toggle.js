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
        debug: false,
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
        let sResponse = getComputedStyle(nHTML).getPropertyValue(
            settings.COLOR_MODE_KEY
        )
        if (sResponse.length) {
            sResponse = sResponse.replace(/"/g, '').trim()
        }

        if (settings.debug) {
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

        if (settings.debug) {
            console.log(
                'ThemeToggle:fGetLocalStoredColorSchemeVal: sCurrentSetting:',
                sCurrentSetting
            )
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

        if (settings.debug) {
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

        if (settings.debug) {
            console.log(
                'ThemeToggle:fToggleColorScheme: sCurrentSetting:',
                sCurrentSetting
            )
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
        if (settings.debug) {
            console.log(
                'ThemeToggle:fApplyButtonState: sCurrentSetting',
                currentSetting
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

                if (settings.debug) {
                    console.log(
                        `ThemeToggle:fAddEventListeners: Window detected system color pref change: ${e.matches}`
                    )
                }
            })

        // Capture clicks on the toggle
        document.addEventListener('click', function (e) {
            if (e.target.id === nThemeToggel.id) {
                fToggleColorScheme()

                if (settings.debug) {
                    console.log(
                        `ThemeToggle:fAddEventListeners: button "${e.target.id}" clicked.`
                    )
                }
            }
        })

        // listen for changes to on html data-user-color-scheme attr if mutiple toggle-buttons
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === `data-${settings.STORAGE_KEY}`) {
                    const sHTMLcolorMode = nHTML.getAttribute(
                        `data-${settings.STORAGE_KEY}`
                    )
                    // Update button state to reflect change
                    fApplyButtonState(sHTMLcolorMode)
                    // Update localStorage value to reflect change
                    localStorage.setItem(settings.STORAGE_KEY, sHTMLcolorMode)

                    if (settings.debug) {
                        console.log(
                            `ThemeToggle:fAddEventListeners: MutationObserver change: data-${settings.STORAGE_KEY}="${sHTMLcolorMode}"`
                        )
                    }
                }
            })
        })
        // MutationObserver options
        observer.observe(nHTML, {
            attributeFilter: [`data-${settings.STORAGE_KEY}`],
            attributeOldValue: true,
        })
    }

    //
    // Public init method
    //
    this.init = function () {
        if (!nThemeToggel) {
            if (settings.debug) {
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
        if (settings.debug) {
            console.log(
                'ThemeToggle:Init,  current localStore setting: ',
                localStorage.getItem(settings.STORAGE_KEY)
            )
        }
    }

    //
    // Return the Public APIs
    //
    return this
}
