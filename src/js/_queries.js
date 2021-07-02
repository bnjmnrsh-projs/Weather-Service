import { fClean } from './_helpers'

/**
 * IP address based location API
 *
 * @returns {object} coordiantes object
 */
export const fIPapi = async function (sIpapiLocationApi) {
    const pResp = await fetch(sIpapiLocationApi).then(function (pResp) {
        if (pResp.ok) {
            return pResp.json()
        } else {
            return Promise.reject(pResp)
        }
    })
    return await pResp
}

/**
 * Assembles the formatted query string for CF API requests
 *
 * @param {string} urlBase
 * @param {obj} oLoc Response from oLocation API
 * @returns {string} Assembled url with query (cleaned)
 */
export const fAssembledQuery = function (urlBase, oLoc, _oSettings) {
    if (!oLoc) return

    let sApiQuery = `${urlBase}&lat=${oLoc.latitude}&lon=${oLoc.longitude}`

    if (!oLoc.latitude || !oLoc.longitude) {
        let sCity,
            sState,
            sCountry = ''

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

    _oSettings.debug ? console.log('sApiQuery query:', fClean(sApiQuery)) : ''

    return fClean(sApiQuery)
}

/**
 * Browser based location API
 *
 * @returns {object} coordiantes object
 */
const fGeoLocApi = async function () {
    const oOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
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
 * Gets the user location
 *
 * @param {string} [section='home']
 */
export const fGetLocation = async function (sIpapiLocationApi, _oSettings) {
    if (navigator.geolocation) {
        try {
            _oSettings.debug
                ? console.log(
                      'fGetLocation: Checking geoLoccation API: fGeoLocApi.'
                  )
                : ''
            return await fGeoLocApi()
        } catch (e) {
            _oSettings.debug
                ? console.warn('fGetLocationL: failed using fGeoLocApi: ', e)
                : ''
            try {
                console.log('5')
                _oSettings.debug
                    ? console.warn('Falling back to IP address lookup instead.')
                    : ''
                return await fIPapi(sIpapiLocationApi)
            } catch (e) {
                _oSettings.debug
                    ? console.warn(
                          'fGetLocation: failed sIpapiLocationApi: ',
                          e
                      )
                    : ''
            }
        }
    }
}

/**
 * Fetch the weather for a user's location.
 *
 * @param {object} oLoc
 * @returns {object} weather object
 */
export const fGetWeather = async function (oLoc, sWeatherApi, _oSettings) {
    const pResp = await fetch(
        fAssembledQuery(sWeatherApi, oLoc, _oSettings)
    ).then(function (pResp) {
        if (pResp.ok) {
            return pResp.json()
        } else {
            return Promise.reject(pResp)
        }
    })
    return await pResp
}
