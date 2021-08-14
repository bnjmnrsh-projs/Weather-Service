/**
 * Darkmode Theme Toggle
 *
 * @author bnjmnrsh@gmail.com
 */

//
// Private methods
//

/**
 * Get the current value of the CSS '--color-mode' property.
 * https://piccalil.li/tutorial/get-css-custom-property-value-with-javascript/
 *
 * @returns {string} dark || light
 */
const fGetColorModeCSSpropVal = function (oSettings = {}) {
  let sResponse = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(oSettings.COLOR_MODE_CSS_PROP)
  if (sResponse.length) {
    sResponse = sResponse.replace(/"/g, '').trim()
  }

  if (oSettings.debug) {
    console.log('ThemeToggle:fGetColorModeCSSpropVal: sResponse:', sResponse)
  }

  return sResponse
}

/**
 * Get the last saved value from local storage, falling back to System prefers-color-scheme via CSS prop.
 *
 * @param {obj} oSettings
 * @returns {string} light || dark
 */
const fGetLocalStoreColorSchemeVal = function (oSettings = {}) {
  let sCurrentSetting = window.localStorage.getItem(oSettings.STORAGE_KEY)

  // If nothing stored, check which style sheet is active
  if (sCurrentSetting === null) {
    sCurrentSetting =
      fGetColorModeCSSpropVal(oSettings) === 'dark' ? 'dark' : 'light'
    // Set to localStorage
    window.localStorage.setItem(oSettings.STORAGE_KEY, sCurrentSetting)
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
 * @param {obj} oSettings
 */
const fSetLocalStoreColorSchemeVal = function (
  sCurrentSetting,
  oSettings = {}
) {
  if (sCurrentSetting === 'light' || sCurrentSetting === 'dark') {
    window.localStorage.setItem(oSettings.STORAGE_KEY, sCurrentSetting)
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
 * @param {obj} oSettings
 */
const fSetHTMLdataAttr = function (sColorSetting, oSettings = {}) {
  const sCurrentSetting =
    sColorSetting || fGetLocalStoreColorSchemeVal(oSettings)

  if (sCurrentSetting === 'light' || sCurrentSetting === 'dark') {
    // Set the data attr
    document.documentElement.setAttribute(
      'data-user-color-scheme',
      sCurrentSetting
    )
  }

  if (oSettings.debug) {
    console.log('ThemeToggle:fSetHTMLdataAttr: sColorSetting:', sColorSetting)
  }
}

/**
 * Update the aria-pressed state of toggle-button based on passed value.
 *
 * @param {string} sSetButtonState 'light' || 'dark'
 * @param {obj} oSettings
 */
const fSetButtonState = function (
  sSetButtonState,
  nThemeToggel,
  oSettings = {}
) {
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
 * @param {obj} oSettings
 */
const fSetGlobalColorScheme = function (
  sColorSetting,
  nThemeToggel,
  oSettings
) {
  const sCurrentSetting =
    sColorSetting || fGetLocalStoreColorSchemeVal(oSettings)

  switch (sCurrentSetting) {
    case 'light':
      fSetHTMLdataAttr('light', oSettings)
      fSetButtonState('light', nThemeToggel, oSettings)
      fSetLocalStoreColorSchemeVal('light', oSettings)
      break
    case 'dark':
      fSetHTMLdataAttr('dark', oSettings)
      fSetButtonState('dark', nThemeToggel, oSettings)
      fSetLocalStoreColorSchemeVal('dark', oSettings)
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
 * Toggle the UI color scheme & button state based on value saved in window.localStorage.
 *
 * @param {obj} oSettings
 */
const fToggleGlobalColorScheme = function (nThemeToggel, oSettings = {}) {
  const sCurrentSetting = fGetLocalStoreColorSchemeVal(oSettings)

  switch (sCurrentSetting) {
    case 'light':
      fSetGlobalColorScheme('dark', nThemeToggel, oSettings)
      break
    case 'dark':
      fSetGlobalColorScheme('light', nThemeToggel, oSettings)
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
 * Add listeners for button clicks, changes to ststem prefers-color-scheme, and the html attr data-user-color-scheme .
 * @TODO: Listen for changes to our data store
 *
 * @param {obj} oSettings
 */
const fAddEventListeners = function (nThemeToggel, oSettings = {}) {
  // Detect prefers-color-scheme system preference changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', function (e) {
      if (e.matches) {
        fSetGlobalColorScheme('dark', nThemeToggel, oSettings)
      } else {
        fSetGlobalColorScheme('light', nThemeToggel, oSettings)
      }

      if (oSettings.debug && e.matches) {
        console.log(
          `ThemeToggle:fAddEventListeners: Window detected system color pref change: ${e.matches}`
        )
      }
    })

  // Capture clicks on our toggle
  document.addEventListener('click', function (e) {
    if (e.target.id === nThemeToggel.id) {
      fToggleGlobalColorScheme(nThemeToggel, oSettings)

      if (oSettings.debug) {
        console.log(
          `ThemeToggle:fAddEventListeners: button "${e.target.id}" clicked.`
        )
      }
    }
  })

  // Listen for changes to on the html attr data-user-color-scheme attr using MutationObserver, in the case of mutiple toggle-buttons
  const observer = new window.MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === `data-${oSettings.STORAGE_KEY}`) {
        const sHTMLcolorMode = document.documentElement.getAttribute(
          `data-${oSettings.STORAGE_KEY}`
        )
        // Update button state to reflect change
        fSetButtonState(sHTMLcolorMode, nThemeToggel, oSettings)
        // Update localStorage value to reflect change
        fSetLocalStoreColorSchemeVal(sHTMLcolorMode, oSettings)

        if (oSettings.debug) {
          console.log(
            `ThemeToggle:fAddEventListeners: MutationObserver change: data-${oSettings.STORAGE_KEY}="${sHTMLcolorMode}"`
          )
        }
      }
    })
  })
  // MutationObserver options
  observer.observe(document.documentElement, {
    attributeFilter: [`data-${oSettings.STORAGE_KEY}`],
    attributeOldValue: true
  })
}

export const ThemeToggle = function (oOptions = {}) {
  //
  // Settings & Defaults
  //

  const oDefaults = {
    buttonID: '#theme-toggler',
    debug: false
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

  /**
   * Public init method
   *
   * @returns public init method
   */
  this.init = function () {
    if (!nThemeToggel) {
      console.warn(
        "ThemeToggle: Couldn't find the theme toggel button with selector:",
        nThemeToggel
      )
      return
    } else {
      // Enable the button
      nThemeToggel.removeAttribute('disabled')
    }

    // Add event listeners
    fAddEventListeners(nThemeToggel, oSettings)

    // Establish toggle/theme state based on system and/or last pref saved in localStorage
    fSetGlobalColorScheme(
      fGetLocalStoreColorSchemeVal(oSettings),
      nThemeToggel,
      oSettings
    )

    if (oSettings.debug) {
      console.log(
        'ThemeToggle:Init,  current localStore setting: ',
        window.localStorage.getItem(oSettings.STORAGE_KEY)
      )
    }
  }
}
