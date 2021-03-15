/**
 * Cloudflare webWorker serverless function
 * to proxy API requests without revealing API key.
 *
 * ex: https://weatherbit.bnjmnrsh.workers.dev/?lat=55.139856&lon=-3.704262
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
fetch('https://weatherbit.bnjmnrsh.workers.dev/?lat=55.139856&lon=-3.704262')
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
    const WEATHER = `https://api.weatherbit.io/v2.0/current?key=${WB_KEY}&`
    const FORCAST = `https://api.weatherbit.io/v2.0/forecast/hourly?key=${WB_KEY}&hours=48&`

    // Allowed origins
    const allowed = [
        'https://orionrush.com',
        'https://bnjmnrsh.com',
        'https://bnjmnrsh-projs.github.io',
        'http://127.0.0.1:5500',
    ]

    let url

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
        } else if (contentType.includes('application/text')) {
            return await response.text()
        } else if (contentType.includes('text/html')) {
            return await response.text()
        } else {
            return await response.text()
        }
    }

    /**
     * Fetch json from Weatherbit APIs
     *
     * Api url is selected from api=FORECAST || WEATHER
     * Defaults to WEATHER
     *
     * @param {object} request
     * @returns {json}
     */
    async function handleRequest(event) {
        const request = event.request

        // Get incoming URL params
        const { searchParams } = new URL(request.url)
        console.log(searchParams.hostname)
        // Get the api flag from params
        let api = searchParams.get('api')

        // set which api to fetch (defaults to WEATHER)
        let url = api === 'FORCAST' ? FORECAST : WEATHER
        // Tidy up
        searchParams.delete('api')
        // Assemble the url params
        url += searchParams.toString()

        // Response headers
        const init = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': '*',
                'content-type': 'application/json;charset=UTF-8',
            },
        }

        const headers = new Headers(init.headers)

        // If domain is not allowed, return error code
        if (!allowed.includes(request.headers.get('origin'))) {
            return new Response('Not allowed', {
                status: 403,
                statusText: 'Requests not allowed from this domain.',
                headers: headers,
            })
        }

        // fetch & return the response
        const response = await fetch(url)
        const results = await gatherResponse(response, headers)
        return new Response(results, init)
    }

    // Event listener
    addEventListener('fetch', (event) => {
        return event.respondWith(handleRequest(event))
    })
}
