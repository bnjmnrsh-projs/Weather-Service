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
