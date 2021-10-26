import { fLoadIconObject } from './_icons'

export const fBuildAppSettingsObj = function (
  _oDefaults = {},
  _oSettings = {}
) {
  // Merge settings with defaults
  _oSettings = Object.assign(_oDefaults, _oSettings)

  // Set debugging & dev flags via URL
  const { searchParams } = new URL(document.URL)
  _oSettings.debug = searchParams.has('DEBUG')
  if (searchParams.has('DEV')) {
    _oSettings.dev = searchParams.get('DEV')
  }

  // Set location lat lon flags via URL
  if (searchParams.has('lat') && searchParams.has('lon')) {
    _oSettings.loc = {
      longitude: searchParams.has('lat'),
      latitude: searchParams.has('lon')
    }
  }

  /**
   * SVG icons staged in index.html
   * TODO: Moon phases currently loaded as img paths: <img src="./svg/icons/moon/svg/${oMoon.phase}.svg">
   */
  _oSettings.icon = fLoadIconObject()

  return _oSettings
}
