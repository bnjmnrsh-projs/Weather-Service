/* global DUMMYRESPONSE */

/**
 * Cloudflare Worker middleman API
 *
 * @author https://github.com/bnjmnrsh
 * (c) 2021 Benjamin Rush/bnjmnrsh | MIT License | https://github.com/bnjmnrsh/CloudflareWorker-middleman-API
 *
 * ex: https://YOURWORKER.YOURACCOUNT.workers.dev/?lat=28.385233&lon=-81.563873
 * Environmental variable: WB_KEY (weatherbit.io api key)
 *
 * KV Store WEATHERSERV_DUMMYRESPONSE as DUMMYRESPONSE.{5XX_FULL, 5XX_PARTIAL, DUMMY, NO_KEY, OVER_QUOTA, API_ERROR}
 *
 */

/*
  Run in console on one of your 'aAllowed origin' domains to test

  fetch('https://YOURWORKER.YOURACCOUNT.workers.dev/?lat=28.385233&lon=-81.563873')
      .then(function (response) {
          if (response.ok) {
              return response.json()
          }
          return Promise.reject(response)
      })
      .then(function (data) {
          console.log(data)
          data.json()
      })
      .catch(function (error) {
          console.warn(error)
      })
 */

//
// VARRIABLES
//

// Debugging: set to true to disable origin whitelist checks
const bDBG = true

// Caching settings:
// nTTL (Time To Live) the length of time for Cloudflare to perserve a cached value (Time To Live)
// nBrowserExpiry sets browser expirey headers
//
// https://developers.cloudflare.com/workers/learning/how-the-cache-works
const nTTL = 1800 // (seconds), 30 min
const nCacheCont = new Date(new Date().getTime() + 25 * 60000) // 25 min
const bCacheEverything = true

// Allowed origins whitelist
const aAllowed = ['https://bnjmnrsh-projs.github.io']

// Number of times to retry fetch on failure
const nFetchRetry = 3

// A named array of endpoints to fetch
// prettier-ignore
const aToFetch = [
        // [
        //     'USEAGE',
        //     `https://api.weatherbit.io/v2.0/subscription/usage?key=${WB_KEY}&`,
        // ],
        [
            'CURRENT',
            `https://api.weatherbit.io/v2.0/current?key=${WB_KEY}&`
        ],
        [
            'DAILY',
            `https://api.weatherbit.io/v2.0/forecast/daily?key=${WB_KEY}&days=16&`,
        ],
    ]

// Response headers
const oInit = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': '*',
    'Cache-Control': 'public',
    Expires: `${nCacheCont}`,
    'content-type': 'application/json;charset=UTF-8'
  },
  cf: { cacheTtl: `${nTTL}`, cacheEverything: `${bCacheEverything}` }
}

//
// METHODS
//

/**
 * Substitute request response with pre-made responses for development & debugging.
 * Uses Workers KV Global DUMMYRESPONSE
 *
 * @param {string} devFlag
 * @returns stringified JSON
 */
const fDummyResponse = async function (devFlag) {
  const value = await DUMMYRESPONSE.get(`${devFlag}`)
  return value
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object}         A a network request response
 *
 * @return {object}         The parsed JSON, status from the response
 */

/* eslint prefer-promise-reject-errors: "off"
  ----
  We want the error text to pass through at part of the JSON response to handel downstream within app */
const fParseJSONresponse = async function (response) {
  //   console.log('fParseJSONresponse', response)
  return new Promise((resolve, reject) => {
    try {
      if (response.ok) {
        response
          .json()
          .then((json) => {
            return resolve({
              status: response.status,
              ok: response.ok,
              json
            })
          })
          .catch((error) => {
            console.error('catch error 2 ', error)
            console.error('catch error 1 resp', response)
            return reject({ 'fParseJSONresponse error': error })
          })
      } else {
        return reject({
          error: response.status,
          error_text: `${response.statusText} ${response.ur}`
        })
      }
    } catch (error) {
      console.error('catch error 3 ', error)
      return reject({ 'fParseJSONresponse catch error': error })
    }
  })
}

// eslint prefer-promise-reject-errors: "error"
/**
 * Fetch replacement with better error handeling.
 *
 * @param {*} url
 * @param {*} options
 * @returns Promise
 */
const fRequest = async function (url, options) {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(fParseJSONresponse)
      .then((response) => {
        if (response.ok) {
          console.log('fRequest', 'ok')
          return resolve(response.json)
        }
        // extract the error from the server's json
        console.error('fRequest', 'JSON not ok')
        console.error(
          'fRequest response.json.meta.error',
          response.json.meta.error
        )
        return reject(response.json.meta.error)
      })
      .catch((error) => {
        console.error('fRequest catch', { ...error })
        return reject({ ...error })
      })
  })
}

/**
 * Fetch with retry n times on failure
 *
 * https://dev.to/ycmjason/javascript-fetch-retry-upon-failure-3p6g
 *
 * @param {string} url
 * @param {obj} options
 * @param {int} n
 * @returns Promise
 */
const fFetchWithRetry = async function (url, options, n) {
  try {
    return await fRequest(url, options)
  } catch (err) {
    if (n >= 1) throw err // pass error out to colated object
    return await fFetchWithRetry(url, options, n - 1)
  }
}

/**
 * Collate results objects into a new stringified Response
 * @param {*} obj
 * @returns {object}
 */
const fCollated = function (obj) {
  const oColated = {}
  obj.forEach(function (el, i) {
    try {
      JSON.parse(el)
    } catch (oError) {
      console.error('fCollated error', oError)
      return (oColated[aToFetch[i][0]] = {
        error: `Error collating: ${oError}`
      })
    }
    oColated[aToFetch[i][0]] = JSON.parse(el)
  })
  return oColated
}

/**
 * Fetch JSON from APIs
 *
 * @param {object} request
 * @returns {JSON string}
 */
const fHandleRequest = async function (event) {
  const oRequest = event.request

  // If we're not debugging, and origin domain is not whitelisted, return 403
  if (bDBG === false) {
    if (!aAllowed.includes(oRequest.headers.get('origin'))) {
      console.log(oRequest.headers.get('origin'))

      return new Response('Requests are not allowed from this domain.', {
        status_code: 403.503,
        status_message: 'Not a whitelisted domain.'
      })
    }
  }

  // const oHeaders = new Headers(oInit.headers)
  const { searchParams } = new URL(oRequest.url)

  // We've stored dummy responses in Workers KV for developing and testing
  const devFlag = searchParams.get('DEV')
  if (devFlag) {
    // Break out early
    return new Response(await fDummyResponse(devFlag), oInit) // returns Promise
  } else {
    // Fetch from all the APIs
    const aResponses = await Promise.all(
      aToFetch.map(function (aURL, i) {
        return fFetchWithRetry(
          aURL[1] + searchParams.toString(),
          oInit,
          nFetchRetry
        )
          .then((oResponse) => {
            return oResponse
          })
          .catch(function (oError) {
            console.error('aResponses error', { ...oError })
            return { ...oError }
          })
      })
    )

    // Gather responses into an array
    const aResults = await Promise.all(
      //   aResponses.map((resp) => fStringifyAPIresponse(resp))

      aResponses.map((resp) => JSON.stringify(resp))
    )

    return new Response(JSON.stringify(fCollated(aResults)), oInit)
  }
}

// Event listener
addEventListener('fetch', (oEvent) => {
  return oEvent.respondWith(fHandleRequest(oEvent))
})
