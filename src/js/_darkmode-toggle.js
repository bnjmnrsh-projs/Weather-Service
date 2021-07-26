/**
 * Theme Toggle
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
    oSettings.COLOR_MODE_CSS_PROP = '--color-mode'
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
    const fGetColorModeCSSpropVal = function () {
        let sResponse = getComputedStyle(nHTML).getPropertyValue(
            oSettings.COLOR_MODE_CSS_PROP
        )
        if (sResponse.length) {
            sResponse = sResponse.replace(/"/g, '').trim()
        }

        if (oSettings.debug) {
            console.log(
                'ThemeToggle:fGetColorModeCSSpropVal: sResponse:',
                sResponse
            )
        }

        return sResponse
    }

    /**
     * Get the last saved value from local storage, falling back to System prefers-color-scheme via CSS prop.
     *
     * @returns {string} light || dark
     */

    const fGetLocalStoreColorSchemeVal = function () {
        let sCurrentSetting = localStorage.getItem(oSettings.STORAGE_KEY)

        // If nothing stored, check which style sheet is active
        if (sCurrentSetting === null) {
            sCurrentSetting =
                fGetColorModeCSSpropVal() === 'dark' ? 'dark' : 'light'
            // Set to localStorage
            localStorage.setItem(oSettings.STORAGE_KEY, sCurrentSetting)
        }
        if (oSettings.debug) {
            console.log(
                'ThemeToggle:fGetLocalStoreColorSchemeVal: sCurrentSetting:',
                sCurrentSetting
            )
        }

        return sCurrentSetting
    }

    /**
     * Save user perfered theme to localStorage
     *
     * @param {string} sCurrentSetting 'light' || 'dark'
     */
    const fSetLocalStoreColorSchemeVal = function (sCurrentSetting) {
        if (sCurrentSetting === 'light' || sCurrentSetting === 'dark') {
            localStorage.setItem(oSettings.STORAGE_KEY, sCurrentSetting)
        }

        if (oSettings.debug) {
            console.log(
                'ThemeToggle:fSetLocalStoreColorSchemeVal: sCurrentSetting:',
                sCurrentSetting
            )
        }
    }

    /**
     * Apply data-user-color-scheme to document, update localStore.
     *
     * @param {string} sColorSetting
     */
    const fSetHTMLdataAttr = function (sColorSetting) {
        const sCurrentSetting = sColorSetting || fGetLocalStoreColorSchemeVal()

        if (sCurrentSetting === 'light' || sCurrentSetting === 'dark') {
            // Set the data attr
            nHTML.setAttribute('data-user-color-scheme', sCurrentSetting)
        }

        if (oSettings.debug) {
            console.log(
                'ThemeToggle:fSetHTMLdataAttr: sColorSetting:',
                sColorSetting
            )
        }
    }

    /**
     * Update the aria-pressed state of toggle-button based on passed value.
     *
     * @param {string} sSetButtonState 'light' || 'dark'
     */
    const fSetButtonState = function (sSetButtonState) {
        switch (sSetButtonState) {
            case 'dark':
                nThemeToggel.setAttribute('aria-pressed', 'true')
                break
            case 'light':
                nThemeToggel.removeAttribute('aria-pressed')
                break
        }

        if (oSettings.debug) {
            console.log(
                'ThemeToggle:fSetButtonState: sSetButtonState:',
                sSetButtonState
            )
        }
    }

    /**
     * Set the UI color scheme, button state, and update localStore.
     *
     * @param {string} sColorSetting 'light' || 'dark'
     */
    const fSetGlobalColorScheme = function (sColorSetting) {
        const sCurrentSetting = sColorSetting || fGetLocalStoreColorSchemeVal()

        switch (sCurrentSetting) {
            case 'light':
                fSetHTMLdataAttr('light')
                fSetButtonState('light')
                fSetLocalStoreColorSchemeVal('light')
                break
            case 'dark':
                fSetHTMLdataAttr('dark')
                fSetButtonState('dark')
                fSetLocalStoreColorSchemeVal('dark')
                break
        }

        if (oSettings.debug) {
            console.log(
                'ThemeToggle:fSetGlobalColorScheme: sCurrentSetting:',
                sCurrentSetting
            )
        }
    }

    /**
     * Toggle the UI color scheme & button state based on value saved in localStorage.
     */
    const fToggleGlobalColorScheme = function () {
        const sCurrentSetting = fGetLocalStoreColorSchemeVal()

        switch (sCurrentSetting) {
            case 'light':
                fSetGlobalColorScheme('dark')
                break
            case 'dark':
                fSetGlobalColorScheme('light')
                break
        }

        if (oSettings.debug) {
            console.log(
                'ThemeToggle:fToggleGlobalColorScheme: sCurrentSetting:',
                sCurrentSetting
            )
        }
    }

    /**
     * Add listeners for button clicks, changes to prefers-color-scheme, and the html data-user-color-scheme attr
     */
    const fAddEventListeners = function () {
        // Detect prefers-color-scheme system preference changes
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', function (e) {
                if (e.matches) {
                    fSetGlobalColorScheme('dark')
                } else {
                    fSetGlobalColorScheme('light')
                }

                if (oSettings.debug && e.matches) {
                    console.log(
                        `ThemeToggle:fAddEventListeners: Window detected system color pref change: ${e.matches}`
                    )
                }
            })

        // Capture clicks on the toggle
        document.addEventListener('click', function (e) {
            if (e.target.id === nThemeToggel.id) {
                fToggleGlobalColorScheme()

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
                    fSetButtonState(sHTMLcolorMode)
                    // Update localStorage value to reflect change
                    fSetLocalStoreColorSchemeVal(sHTMLcolorMode)

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
            console.warn(
                "ThemeToggle: Couldn't find the theme toggel button with node selector:",
                nThemeToggel
            )
            return
        } else {
            // Enable the button
            nThemeToggel.removeAttribute('disabled')
        }

        // Add event listeners
        fAddEventListeners()

        // Establish toggle/theme state based on system and/or last pref saved in localStorage
        fSetGlobalColorScheme(fGetLocalStoreColorSchemeVal())

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
