/**
 * Sanitise incoming API data
 *
 * @param {string} [sDirty='']
 * @returns {string} sanitised text
 */
export const fClean = function (sDirty = '') {
  if (typeof sDirty === 'number') return sDirty
  if (!sDirty) return

  const temp = document.createElement('div')
  temp.innerHTML = sDirty
  return temp.innerText
}
