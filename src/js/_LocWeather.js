import * as Queries from './_queries'

/**
 * Get the current LocWeather object for a given location from localStorage.
 * - if none exsists, or stale fetch the data and save to localStorage before returning.
 *
 * @param {object} _oSettings
 * @param {string} sLocation
 */
export const fGetLocWeatherObj = async function (
  _oSettings = {},
  sLocName = 'current' // current, loc-1, loc-2, loc-3
) {
  // check to see if the called location-weather exsists in localStorage
  const oLocWeather = window.localStorage.getItem(
    _oSettings.key + '-' + sLocName
  )
  const nCurrentTime = Date.now()
  const nTimestamp = oLocWeather?.timestamp
  const nStale = _oSettings.stale

  // if there's not a weather object for this location, or it's stale, create a new one.
  if (!oLocWeather || nTimestamp - nCurrentTime > nStale)
    return fBuildLocWeatherObj(_oSettings, sLocName)

  return oLocWeather
}

export const fBuildLocWeatherObj = async function (
  _oSettings = {},
  location = ''
) {
  // Test if incoming location is a string or object.
  // if location is string, then see if there is a localStore record for that location and return it.
  // if location is an object, then use the params to run a lookup query

  const oLocWeather = {}

  // Get Loation
  oLocWeather.loc = {
    current: { name: '', loc: '', weather: {}, timestamp: '' }
  }

  oLocWeather.loc.current = await Queries.fGetLocation(
    _oSettings.locApi,
    _oSettings
  )

  // Get current weather for a location
  oLocWeather.loc.current.weather = await Queries.fGetWeather(
    oLocWeather.loc.current,
    _oSettings.fBuildBaseWeatherApiQuery(),
    _oSettings
  )

  // Add a top level timestamp
  oLocWeather.loc.current.timestamp = Date.now()

  // save to localStorage

  // return the object
  return oLocWeather
}

/**
 * Get the last saved value from local storage, falling back to System prefers-color-scheme via CSS prop.
 *
 * @param {obj} oSettings
 * @returns {string} light || dark
 */
export const fGetLocalStoreLocWeatherObj = function (
  _oSettings = {},
  sLocation = 'current'
) {
  const oLocalStoreLocWeather = window.localStorage.getItem(
    _oSettings.key + '-' + sLocation
  )

  if (_oSettings.debug) {
    console.log(
      'fGetLocalStoreLocWeatherObj: oLocalStoreLocWeather:',
      oLocalStoreLocWeather
    )
  }

  return oLocalStoreLocWeather
}

export const fCreateLocalStoreWeatherObj = function (
  sCurrentWEATHERLOC,
  _oSettings = {}
) {
  if (_oSettings.debug) {
    console.log(
      'fCreateLocalStoreWeatherObj:sCurrentWEATHERLOC',
      sCurrentWEATHERLOC
    )
  }
}

/**
 * Save current weather object to window.localStorage
 *
 * @param {string} sCurrentSetting 'light' || 'dark'
 * @param {obj} oSettings
 */
export const fSetLocalStoreLocWeatherObj = function (
  sCurrentWEATHERLOC,
  _oSettings = {}
) {
  if (_oSettings.debug) {
    console.log(
      'fSetLocalStoreLocWeatherObj: to sCurrentWEATHERLOC:',
      sCurrentWEATHERLOC
    )
  }
  if (sCurrentWEATHERLOC) {
    window.localStorage.setItem(_oSettings.key, sCurrentWEATHERLOC)
  }
}
