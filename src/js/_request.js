/**
 * Parses the JSON returned by a network request.
 * inspired by: https://github.com/github/fetch/issues/203#issuecomment-266034180
 *
 * @param  {object}         A a network request response
 *
 * @return {object}         The parsed JSON, status from the response
 */

/* eslint-disable prefer-promise-reject-errors
  ----
  We want to return error object with our API response rather then thowing a new Error?
*/
const fParseJSONresponse = async function (oResponse, bDebug = false) {
  if (bDebug) {
    console.log('fParseJSONresponse', oResponse)
  }
  return new Promise((resolve) => {
    oResponse
      .json()
      .then((json) => {
        return resolve({
          status: oResponse.status,
          ok: oResponse.ok,
          json
        })
      })
      .catch((oError) => {
        resolve({
          ok: false,
          status: 'Request()::fParseJSONresponse()',
          status_message: oError
        })
      })
  })
}

export const Request = async function (sUrl, oOptions, bDebug = false) {
  try {
    if (sUrl) {
      return new Promise((resolve, reject) => {
        window
          .fetch(sUrl, oOptions)
          .then((oResponse) => fParseJSONresponse(oResponse, bDebug))
          .then((oResponse) => {
            if (oResponse.ok) {
              if (bDebug) {
                console.log('fRequest', 'ok')
                console.log('fRequest response', oResponse.json)
              }
              return resolve(oResponse)
            }
            // extract the error from the server's json

            if (bDebug) {
              console.error('fRequest not ok')
              console.error('oResponse', oResponse)
            }
            if (Object.prototype.hasOwnProperty.call(oResponse, 'json.error')) {
              return resolve({
                status: oResponse.status,
                status_message: oResponse.json.error
              })
            }
            return resolve(oResponse)
          })
          .catch((oError) => {
            if (bDebug) {
              console.error('fRequest catch', { ...oError })
              console.warn('oError', oError)
            }
            if (Object.keys(oError).length === 0) {
              resolve({
                ok: false,
                status: 'Request() fetch error',
                status_message: oError
              })
            }
            throw new Error(oError)
          })
      })
    } else {
      return {
        ok: false,
        status: 'Request() fetch error',
        status_message: `Invalid fetch URL: ${sUrl}`
      }
    }
  } catch (oError) {
    if (bDebug) {
      console.warn('Request() error', oError)
    }
    throw new Error({ ...oError })
  }
}

export const RequestWithRetry = async function (
  sUrl,
  oOptions = {},
  n = 1,
  bDebug = false
) {
  try {
    return await Request(sUrl, oOptions, bDebug)
  } catch (oError) {
    if (bDebug) {
      console.error('fRequestWithRetry() error', oError)
    }
    if (oError.status) throw oError // recieved a reply from server, pass it on
    if (n <= 1) throw oError // out of trys
    if (bDebug) {
      console.warn(`Request::fRequestWithRetry(): Retrying fetch request: ${n}`)
    }
    return await RequestWithRetry(sUrl, oOptions, n - 1, bDebug)
  }
}
