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

// Debugging: set to true to disable origin whitelist checks
const bDBG = true

/*
 * Caching settings:
 *
 * nTTL (Time To Live) the length of time for Cloudflare to perserve a cached value (Time To Live)
 * nBrowserExpiry sets browser expirey headers
 *
 * https://developers.cloudflare.com/workers/learning/how-the-cache-works
 */

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

/**
 * Gather returning response from Weatherbit API fetch request
 *
 * @param {Response object} response
 * @returns {JSON string}
 */
async function fGatherResponse(response) {
  const { headers } = response
  const sContentType = headers.get('content-type') || ''
  const code = await response.status
  const text = await response.statusText
  const URL = await response.url.split('?')[0]

  // We're checking for JSON header as our api will return usefull details for , 2**, 4**
  if (sContentType.includes('application/json')) {
    return JSON.stringify(await response.json())
  } else {
    return JSON.stringify(
      {
        error: `HTTP status: ${code} ${text}: URL: ${URL}`,
        error_code: `${code}`
      },
      oInit
    )
  }
}

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
    return await fetch(url, options)
  } catch (err) {
    if (n === 1) throw err // pass error out to colated object
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

  // If origin domain is not whitelisted, return 403
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

  // Capture and process any custom flags
  // const foo = searchParams.get('foo')
  // if (foo){
  //     console.log(foo)
  // }

  /**
   * We've stored a dummy response in Workers KV
   * When developing and testing, we can use these responses so we dont tap out our quota
   *
   */
  const devFlag = searchParams.get('DEV')
  console.log('devFlag:', `DUMMY.${devFlag}`)
  if (devFlag) {
    // Break out early
    return new Response(await dummyResponse(devFlag), oInit) // returns promise
  } else {
    // Fetch from all the APIs
    const aResponses = await Promise.all(
      aToFetch.map(function (aURL, i) {
        return fetch(aURL[1] + searchParams.toString(), oInit)
          .then((oResponse) => {
            return oResponse
          })
          .catch(function (oError) {
            console.error('aResponses error', oError)
          })
      })
    )

    // Gather responses into an array
    const aResults = await Promise.all(
      aResponses.map((resp) => fGatherResponse(resp))
    )

    /**
     * Collate results into new object
     *
     * return {object}
     */
    const fCollated = function () {
      const oColated = {}
      aResults.forEach(function (el, i) {
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
    return new Response(JSON.stringify(fCollated()), oInit)
  }
}

// Event listener
addEventListener('fetch', (oEvent) => {
  return oEvent.respondWith(fHandleRequest(oEvent))
})
