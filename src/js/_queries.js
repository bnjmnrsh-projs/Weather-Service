import { fClean } from './_helpers'
import { RequestWithRetry } from './_request'

/**
 * Browser based location API
 *
 * @returns {object} coordiantes object
 */
const fGeoLocApi = async function () {
  const oOptions = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  }

  const pResp = new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      function (pResp) {
        resolve(pResp.coords)
      },
      function (pResp) {
        reject(pResp)
      },
      oOptions
    )
  })
  return await pResp
}

/**
 * IP address based location API
 *
 * @returns {object} coordiantes object
 */
export const fIPapi = async function (sIpapiLocationApi, _oSettings) {
  return await RequestWithRetry(
    sIpapiLocationApi,
    {},
    _oSettings.api_retries
  ).then(function (pResp) {
    if (pResp.ok) {
      return pResp.json
    } else {
      throw pResp
    }
  })
}

/**
 * Gets the user location first using locationAPI, or if the user rejects, fall back to IP address lookup.
 *
 * @param {string} [section='home']
 */
export const fGetLocation = async function (sIpapiLocationApi, _oSettings) {
  if (navigator.geolocation) {
    try {
      if (_oSettings.debug) {
        console.log('fGetLocation: Checking geoLoccation API: fGeoLocApi.')
      }
      return await fGeoLocApi()
    } catch (oError) {
      if (_oSettings.debug) {
        console.warn(`fGetLocation: failed using fGeoLocApi: ${oError}`)
        console.warn('Falling back to IP address lookup instead.')
      }
      try {
        return await fIPapi(sIpapiLocationApi, _oSettings)
      } catch (oError) {
        if (_oSettings.debug) {
          console.warn(`fGetLocation: failed sIpapiLocationApi: ${oError}`)
        }
        throw new Error({ ...oError })
      }
    }
  }
}

/**
 * Assembles the formatted weather API URL & query string
 *
 * @param {string} urlBase
 * @param {obj} oLoc Response from oLocation API
 * @returns {string} Assembled url with query (cleaned)
 */
export const fAssembleWeatherQuery = function (urlBase, oLoc, _oSettings) {
  if (!oLoc) return

  let sApiQuery = `${urlBase}&lat=${oLoc.latitude}&lon=${oLoc.longitude}`

  if (!oLoc.latitude || !oLoc.longitude) {
    let sCity
    let sState
    let sCountry = ''

    if ('city' in oLoc && oLoc.city) {
      sCity = `&city=${oLoc.city}`
    }
    if ('state' in oLoc && oLoc.state) {
      sState = `&state=${oLoc.state}`
    }
    if ('country' in oLoc && oLoc.country_code) {
      sCountry = `&country=${oLoc.country_code}`
    }

    sApiQuery = `${urlBase}${sCity ?? ''}${sState ?? ''}${sCountry ?? ''}`
  }

  if (_oSettings.debug) {
    console.log('sApiQuery query:', fClean(sApiQuery))
  }

  return fClean(sApiQuery)
}

/**
 * Fetch the weather for a user's location.
 *
 * @param {object} oLoc
 * @returns {object} weather object
 */
export const fGetWeather = async function (oLoc, sWeatherApi, _oSettings) {
  const pResp = await RequestWithRetry(
    fAssembleWeatherQuery(sWeatherApi, oLoc, _oSettings),
    {},
    _oSettings.api_retries
  ).then(function (pResp) {
    if (pResp.ok) {
      return pResp.json
    } else {
      throw pResp
    }
  })
  return await pResp
}
