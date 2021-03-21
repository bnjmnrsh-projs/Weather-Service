/**
 * Cloudflare Worker middleman API
 * ex: https://YOURWORKER.YOURACCOUNT.workers.dev/?lat=55.139856&lon=-3.704262
 *
 * Environmental variable: WB_KEY
 *
 */

/* Run in console on one of your 'aAllowed origin' domains to test
fetch('https://YOURWORKER.YOURACCOUNT.workers.dev/?lat=55.139856&lon=-3.704262')
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

{
    // set to true when testing with Wrangler CLI or Workers Quick edit
    const bDEV = false

    const aToFetch = [
        ['CURRENT', `https://api.weatherbit.io/v2.0/current?key=${WB_KEY}&`],
        [
            'HOURLY',
            `https://api.weatherbit.io/v2.0/forecast/hourly?key=${WB_KEY}&hours=48&`,
        ],
        [
            'DAILY',
            `https://api.weatherbit.io/v2.0/forecast/daily?key=${WB_KEY}&days=16&`,
        ],
        ['ALERTS', `https://api.weatherbit.io/v2.0/alerts?key=${WB_KEY}&`],
    ]

    // Allowed origins whitelist
    const aAllowed = ['https://bnjmnrsh-projs.github.io']

    // Response headers
    const oInit = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': '*',
            'content-type': 'application/json;charset=UTF-8',
        },
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

        if (sContentType.includes('application/json')) {
            return JSON.stringify(await response.json())
        } else {
            const code = await response.status
            const text = await response.statusText
            const URL = await response.url.split('?')[0]

            return JSON.stringify({
                error: `HTTP status: ${code} ${text}: URL: ${URL}`,
            })
        }
    }

    /**
     * Fetch json from Weatherbit APIs
     *
     * @param {object} request
     * @returns {JSON string}
     */
    async function fHandleRequest(event) {
        const oRequest = event.request
        const oHeaders = new Headers(oInit.headers)
        const { searchParams } = new URL(oRequest.url)

        // If origin domain is not whitelisted, return 403
        if (bDEV === false) {
            if (!aAllowed.includes(oRequest.headers.get('origin'))) {
                return new Response(
                    'Requests are not allowed from this domain.',
                    {
                        status: 403.503,
                        statusText: 'Not a whitelisted domian.',
                    }
                )
            }
        }

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

        // Gather responses into a results array
        const aResults = await Promise.all(
            aResponses.map((resp) => fGatherResponse(resp))
        )

        /**
         * Collate results into new object
         *
         * return {object}
         */
        const fCollated = function () {
            let oColated = {}
            aResults.map((el, i) => {
                try {
                    JSON.parse(el)
                } catch (oError) {
                    console.error('fCollated error', oError)
                    return (oColated[aToFetch[i][0]] = {
                        error: `Error collating: ${oError}`,
                    })
                }
                oColated[aToFetch[i][0]] = JSON.parse(el)
            })
            return oColated
        }

        return new Response(JSON.stringify(fCollated()), oInit)
    }

    // Event listener
    addEventListener('fetch', (oEvent) => {
        return oEvent.respondWith(fHandleRequest(oEvent))
    })
}
