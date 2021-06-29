import * as Helpers from './_helpers'

/**
 * IP address based location API
 *
 * @returns {object} coordiantes object
 */
export const fIPapi = async function (sIpapiLocationApi) {
    const resp = await fetch(sIpapiLocationApi).then(function (resp) {
        if (resp.ok) {
            return resp.json()
        } else {
            return Promise.reject(resp)
        }
    })
    return await resp
}

/**
 * Assembles the formatted query string for CF API requests
 *
 * @param {string} urlBase
 * @param {obj} loc Response from location API
 * @returns {string} Assembled url with query (cleaned)
 */
export const fAssembledQuery = function (urlBase, loc, _oSettings) {
    if (!loc) return

    let sApiQuery = `${urlBase}&lat=${loc.latitude}&lon=${loc.longitude}`

    if (!loc.latitude || !loc.longitude) {
        let sCity,
            sState,
            sCountry = ''

        if ('city' in loc && loc.city) {
            sCity = `&city=${loc.city}`
        }
        if ('state' in loc && loc.state) {
            sState = `&state=${loc.state}`
        }
        if ('country' in loc && loc.country_code) {
            sCountry = `&country=${loc.country_code}`
        }

        sApiQuery = `${urlBase}${sCity ?? ''}${sState ?? ''}${sCountry ?? ''}`
    }

    _oSettings.debug
        ? console.log('sApiQuery query:', Helpers.fClean(sApiQuery))
        : ''

    return Helpers.fClean(sApiQuery)
}

/**
 * Browser based location API
 *
 * @returns {object} coordiantes object
 */
const fGeoLocApi = async function () {
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    }

    const resp = new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(
            function (resp) {
                resolve(resp.coords)
            },
            function (resp) {
                reject(resp)
            },
            options
        )
    })
    return await resp
}

/**
 * Gets the user location
 *
 * @param {string} [section='home']
 */
export const fGetLocation = async function (sIpapiLocationApi, _oSettings) {
    console.log('1')
    if (navigator.geolocation) {
        try {
            _oSettings.debug ? console.log('2 Checking geoLoccation API.') : ''
            return await fGeoLocApi()
        } catch (e) {
            _oSettings.debug
                ? console.warn('3 fGetLocation fGeoLocApi: ', e)
                : ''
            try {
                console.log('5')
                _oSettings.debug
                    ? console.warn('5 Falling back to IP lookup.')
                    : ''
                return await fIPapi(sIpapiLocationApi)
            } catch (e) {
                _oSettings.debug ? console.warn('fGetLocation IP API: ', e) : ''
            }
        }
    }
}

/**
 * Fetch the weather for a user's location.
 *
 * @param {object} loc
 * @returns {object} weather object
 */
export const fGetWeather = async function (loc, sWeatherApi, _oSettings) {
    const resp = await fetch(
        fAssembledQuery(sWeatherApi, loc, _oSettings)
    ).then(function (resp) {
        if (resp.ok) {
            return resp.json()
        } else {
            return Promise.reject(resp)
        }
    })
    return await resp
}
