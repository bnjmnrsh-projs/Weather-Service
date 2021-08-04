/**
 * https://gist.github.com/endel/dfe6bb2fbe679781948c#gistcomment-2811037
 *
 * @param {Date object || date string} Date Object or String with valid formatting to make date object from.
 * @returns {object} Moon phase object
 */
export const fPhase = function (date, _oSettings) {
  const Moon = {
    phases: [
      'new',
      'waxing-crescent',
      'first-quarter',
      'waxing-gibbous',
      'full',
      'waning-gibbous',
      'third-quarter',
      'waning-crescent'
    ],
    phase: function (year, month, day) {
      let c = 0
      let e = 0
      let jd = 0
      let b = 0

      if (month < 3) {
        year--
        month += 12
      }

      ++month
      c = 365.25 * year
      e = 30.6 * month
      jd = c + e + day - 694039.09 // jd is total days elapsed
      jd /= 29.5305882 // divide by the moon cycle
      b = parseInt(jd) // int(jd) -> b, take integer part of jd
      jd -= b // subtract integer part to leave fractional part of original jd
      b = Math.round(jd * this.phases.length) // scale fraction from 0-8 and round

      if (b >= 8) b = 0 // 0 and 8 are the same so turn 8 into 0
      return { phase: b, name: Moon.phases[b] }
    }
  }

  // if no date, create date based on current system date
  date = date || new Date()

  // if provided a date, try to make a new Date object
  date = date instanceof String ? new Date(date) : date

  // test our date object
  if (!date || typeof date.getMonth !== 'function') {
    if (_oSettings.debug) {
      console.error(
        `fMoonPhase provided invalid date strings: year: ${date.year}, month: ${date.month}, day: ${date.day}`
      )
    }
  }

  const yyyy = date.getFullYear()
  const mm = date.getMonth() + 1 // 0 indexed
  const dd = date.getDate()

  const oMoonPhase = Moon.phase(yyyy, mm, dd)

  if (_oSettings.debug) {
    console.log('fMoonPhase result: ', oMoonPhase)
  }

  return oMoonPhase
}
