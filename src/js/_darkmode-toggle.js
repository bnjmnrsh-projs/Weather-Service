/**
 * Toggle user-color-scheme.
 *
 * @author bnjmnrsh@gmail.com
 */
export const ThemeToggle = (function () {
    /**
     * Constructor object
     *
     * @constructor
     * @param {*} options
     * @returns
     */
    const Constructor = function (options = {}) {
        //
        // Settings & Defaults
        //
        const defaults = {
            targetNode: '#theme-toggler',
            STORAGE_KEY: 'user-color-scheme',
            COLOR_MODE_KEY: '--color-mode',
        }
        // Merge user options into defaults
        const settings = Object.assign({}, defaults, options)

        //
        // Varriables
        //

        const nThemeToggel = document.querySelector(settings.targetNode)

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
        const fGetCSSCustomProp = function (propKey) {
            let response = getComputedStyle(
                document.documentElement
            ).getPropertyValue(propKey)
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

        const fRetreiveStoredColorScheme = function () {
            let sCurrentSetting = localStorage.getItem(settings.STORAGE_KEY)

            switch (sCurrentSetting) {
                case null:
                    sCurrentSetting =
                        fGetCSSCustomProp(settings.COLOR_MODE_KEY) === 'dark'
                            ? 'dark'
                            : 'light'
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
        const fApplyDocumentColorScheme = function (sColorSetting) {
            const sCurrentSetting =
                sColorSetting || localStorage.getItem(settings.STORAGE_KEY)

            if (sCurrentSetting) {
                document.documentElement.setAttribute(
                    'data-user-color-scheme',
                    sCurrentSetting
                )
                // Set to localStorage
                localStorage.setItem(settings.STORAGE_KEY, sCurrentSetting)
            }
        }

        const fToggleColorScheme = function () {
            const sCurrentSetting = fRetreiveStoredColorScheme()

            switch (sCurrentSetting) {
                case 'light':
                    fApplyDocumentColorScheme('dark')
                    nThemeToggel.toggleAttribute('aria-pressed')
                    break
                case 'dark':
                    fApplyDocumentColorScheme('light')
                    nThemeToggel.toggleAttribute('aria-pressed')
                    break
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
                    console.log('prefers-color-scheme test fired')
                    if (e.matches) {
                        console.log('dark')
                        fApplyDocumentColorScheme('dark')
                        fApplyButtonState('dark')
                    } else {
                        console.log('light')
                        fApplyDocumentColorScheme('light')
                        fApplyButtonState('light')
                    }
                })

            // Capture clicks on the toggle
            document.addEventListener('click', function (e) {
                if (e.target.id === nThemeToggel.id) {
                    console.log('click')
                    fToggleColorScheme()
                }
            })
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

        //
        // Public APIs
        //
        const publicAPIs = {}

        publicAPIs.init = function () {
            if (!nThemeToggel) {
                console.warn(
                    'theme toggel button not found, node:',
                    nThemeToggel
                )
                // Bail
                return
            } else {
                // Enable the button
                nThemeToggel.removeAttribute('disabled')
            }

            // Add event listeners
            fAddEventListeners()

            fApplyDocumentColorScheme(fRetreiveStoredColorScheme())
            fApplyButtonState(fRetreiveStoredColorScheme())

            console.log(
                'first run, curent setting: ',
                localStorage.getItem(settings.STORAGE_KEY)
            )
        }

        //
        // Return the Public APIs
        //
        return publicAPIs
    }

    //
    // Return the Constructor
    //

    return Constructor
})()
