/**
 * Possible Weatherbit.io date responses via our Cloudflare Worker:
 *
 * 1) CURRENT.data[0].ob_time: "2021-06-30 18:58" <- the space will throw an errror on safari
 * 2) CURRENT.data[0].datetime: "2021-06-30:19" <- will not convert to valid date object
 * 3) DAILY.data[x].datetime: "2021-06-30"
 * 4) DAILY.data[x].valid_date: "2021-06-30"
 */

/**
 * A helper to ensure that date strings from API are translated into the correct local time and not UTC
 * Dates without a time (as we have from the Weather.io API) may be converted to an invalid date by Chrome
 * https://css-tricks.com/everything-you-need-to-know-about-date-in-javascript/
 * API:
 *
 * TODO: A regex for different valid date patterns might be a more robust solution, however in this case we trust the API to be consistant.
 *
 * @param {string} sDate
 * @returns {string} date as string with time component
 */
function fAddTimeToDateString(sDate) {
    // If we have recieved ob_time, repalce the space with a 'T'
    if (sDate.length >= 16) return sDate.replace(' ', 'T')

    // Will produce a string that can be converted into a valid date object
    const sNewDate = `${sDate}T00:00`
    const oDate = new Date(sNewDate)

    // test to see if we now have string which creates a valid date
    if (typeof oDate.getMonth !== 'function') {
        throw new Error(
            `fAddTimeToDateString not provided a string that can be converted to a valid date: "${sDate}:`
        )
    }

    // return the new date string vaild for cases 2, 3, and 4)
    return sNewDate
}

/**
 * 24H to 12H conversion based on _oSettings.units = I or M
 * https://stackoverflow.com/a/58878443/362445
 *
 * @param {string} sTime24
 * @param {object} _oSettings
 * @returns {string} converted time as string with units
 */
export const fTime = function (sTime24, _oSettings) {
    if (!sTime24.includes(':') || !sTime24.length === '5') {
        throw new Error('fTime not given a valid time string: HH:MM')
    }

    if (_oSettings.units === 'M') return sTime24
    console.log('sTime24', sTime24)
    const [sHours, minutes] = sTime24.match(/([0-9]{1,2}):([0-9]{2})/).slice(1)
    const period = +sHours < 12 ? 'AM' : 'PM'
    const hours = +sHours % 12 || 12

    return `${hours}:${minutes}&nbsp;${period}`
}

/**
 * UTC time provided by API into the local time of the users system.
 * If no date or time are provided, then the current datetime is returned
 *
 * @param {string} sDate (optional)
 * @param {object} _oSettings
 * @param {string} sTime24 (optional)
 * @returns {string} Time as string
 */
export const fGetLocalTime = function (sDate = '', _oSettings, sTime24 = '') {
    let oDate, aTime
    console.log('sDate', sDate)
    if (sDate !== '') {
        oDate = new Date(fAddTimeToDateString(sDate))
    } else {
        oDate = new Date()
    }
    if (sTime24 !== '') {
        aTime = sTime24.split(':')
    } else {
        aTime = [oDate.getUTCHours(), oDate.getUTCMinutes()]
    }
    const aDate = [
        oDate.getUTCFullYear(),
        oDate.getUTCMonth(),
        oDate.getUTCDate(),
        aTime[0],
        aTime[1],
    ]

    const oDateUtc = new Date(Date.UTC(...aDate))

    if (_oSettings.debug === true) {
        console.log('fGetLocalTime provided sTime24: ', sTime24)
        console.log(
            'fGetLocalTime UTC converted time:',
            `${oDateUtc.getHours()}:${oDateUtc.getMinutes()}`
        )
    }
    console.log(oDate)
    return fTime(`${oDateUtc.getHours()}:${oDateUtc.getMinutes()}`, _oSettings)
}

/**
 * Format date string to abreviated weekday name
 *
 * @param {string} sDate, valid date string
 * @returns {string}
 */
export const fGetWeekday = function (sDate) {
    const oDate = new Date(fAddTimeToDateString(sDate))

    // test our oDate object
    if (!oDate || typeof oDate.getMonth !== 'function') {
        throw new Error('fGetWeekday provided invalid date')
    }

    return oDate.toLocaleString('default', { weekday: 'short' })
}

/**
 * Format date string to weekday ordinal number (string)
 *
 * @param {string} sDate
 * @returns string, weekday ordinal number
 */
export const fGetDayOrdinal = function (sDate) {
    const oDate = new Date(fAddTimeToDateString(sDate))

    // test our date object
    if (!oDate || typeof oDate.getMonth !== 'function') {
        throw new Error('fFormatDayOrdinal provided invalid date')
    }

    const sFormatedDate =
        oDate.getDate() +
        (oDate.getDate() % 10 === 1 && oDate.getDate() !== 11
            ? 'st'
            : oDate.getDate() % 10 === 2 && oDate.getDate() !== 12
            ? 'nd'
            : oDate.getDate() % 10 === 3 && oDate.getDate() !== 13
            ? 'rd'
            : 'th')
    return sFormatedDate
}
