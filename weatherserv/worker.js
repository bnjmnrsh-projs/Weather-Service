/**
 * Cloudflare webWorker serverless function
 * to proxy API requests without revealing API key.
 *
 * ex: https://weatherserv.bnjmnrsh.workers.dev/?lat=55.139856&lon=-3.704262
 *
 * Environmantal varriable WB_KEY
 *
 * https://developers.cloudflare.com/workers/examples/read-post
 * https://developers.cloudflare.com/workers/examples/fetch-json
 * https://gomakethings.com/how-to-create-a-middleman-api-with-cloudflare-workers-and-vanilla-js/
 * https://gomakethings.com/securing-serverless-functions-with-cloudflare-workers/
 * https://gomakethings.com/how-to-use-environment-variables-with-cloudflare-workers-and-vanilla-js/
 */

/* Run in console to test
fetch('https://weatherserv.bnjmnrsh.workers.dev/?lat=55.139856&lon=-3.704262')
    .then(function (response) {
        if (response.ok) {
            return response.json()
        }
        return Promise.reject(response)
    })
    .then(function (data) {
        console.log(data)
    })
    .catch(function (error) {
        console.warn(error)
    })
 */

{
    const CURRENT = `https://api.weatherbit.io/v2.0/current?key=${WB_KEY}&`
    const HOURLY = `https://api.weatherbit.io/v2.0/forecast/hourly?key=${WB_KEY}&hours=48&`
    const DAILY = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WB_KEY}&days=16&`
    const ALERTS = `https://api.weatherbit.io/v2.0/alerts?key=${WB_KEY}&`

    const toFetch = [CURRENT, DAILY, HOURLY, ALERTS]

    // Allowed origins
    const allowed = [
        'https://orionrush.com',
        'https://bnjmnrsh.com',
        'https://bnjmnrsh-projs.github.io',
        'https://bnjmnrsh-projs.github.io/Weather-Service',
        'http://127.0.0.1:5500',
    ]

    // Response headers
    const init = {
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
     * @param {*} response
     * @returns
     */
    async function gatherResponse(response) {
        const { headers } = response
        const contentType = headers.get('content-type') || ''

        if (contentType.includes('application/json')) {
            return JSON.stringify(await response.json())
        } else {
            return await response.text()
        }
    }

    /**
     * Fetch json from Weatherbit APIs
     *
     * @param {object} request
     * @returns {json}
     */
    async function handleRequest(event) {
        const request = event.request
        // set headers for fetch
        const headers = new Headers(init.headers)
        const { searchParams } = new URL(request.url)

        // If domain is not allowed, return error code
        if (!allowed.includes(request.headers.get('origin'))) {
            return new Response('Not an allowed domian.', {
                status: 403.503,
                statusText: 'Requests not allowed from this domain.',
                headers: headers,
            })
        }

        // Fetch the data
        const weatherResp = await fetch(CURRENT + searchParams.toString())
        const hourlyResp = await fetch(HOURLY + searchParams.toString())
        const dailyResp = await fetch(DAILY + searchParams.toString())
        const alertsResp = await fetch(ALERTS + searchParams.toString())
        // Gather the responses
        const weatherResults = await gatherResponse(weatherResp, headers)
        const hourlyResults = await gatherResponse(hourlyResp, headers)
        const dailyResults = await gatherResponse(dailyResp, headers)
        const alertsResults = await gatherResponse(alertsResp, headers)

        // Collect reslts into one response
        const response = {
            current: JSON.parse(weatherResults),
            hourly: JSON.parse(hourlyResults),
            daily: JSON.parse(dailyResults),
            alerts: JSON.parse(alertsResults),
        }

        return new Response(JSON.stringify(response), init)
    }

    // Event listener
    addEventListener('fetch', (event) => {
        return event.respondWith(handleRequest(event))
    })
}
