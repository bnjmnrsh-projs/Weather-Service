/**
 * Sanitise incoming API data
 *
 * @param {string} [dirty='']
 * @returns {string} sanitised text
 */
export const fClean = function (dirty = '') {
    if (typeof dirty === 'number') return dirty
    if (!dirty) return

    const temp = document.createElement('div')
    temp.innerHTML = dirty
    return temp.innerText
}

/**
 * To help ensure that date strings from API are translated into the correct local time and not UTC
 * TODO: A regex would be a more robust solution, however in this case we trust the API to be consistant.
 *
 * @param {string} date
 * @returns date as string with time component
 */
function fAddTimeToDateString(sDate) {
    // bail
    if (!sDate || typeof sDate !== 'string') return
    // not the best check, but length is better then nothing
    if (sDate.length >= 16) return sDate

    // otherwise add the time component
    return `${sDate}T00:00`
}

/**
 * Format date string to weekday name
 *
 * @param {string} sDate, valid date string
 * @returns string, abreviated weekday name
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
        (oDate.getDate() % 10 == 1 && oDate.getDate() != 11
            ? 'st'
            : oDate.getDate() % 10 == 2 && oDate.getDate() != 12
            ? 'nd'
            : oDate.getDate() % 10 == 3 && oDate.getDate() != 13
            ? 'rd'
            : 'th')
    return sFormatedDate
}
