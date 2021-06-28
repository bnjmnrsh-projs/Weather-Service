/**
 * Generate a visual scale based on 5km
 *
 * @param {float} vis
 */
export const fSetVisabilityScale = function (vis) {
    const distance = (parseFloat(vis) / 5) * 100

    const nGraph = app.querySelector('.distance')
    nGraph.style.setProperty('--distance', 100 - distance + '%')
}

/**
 * Assigns a named string based on temperature in C
 * 6 step scale for data-temp
 *
 * @param {float} temp
 * @returns {string}   string
 */
export const fTempDataPt = function (temp) {
    if (typeof temp !== 'number') return 0

    temp = parseFloat(temp)
    // temp = 100

    let sTempScale = ''
    switch (temp) {
        case temp <= 0 ? temp : null:
            sTempScale = 0
            break
        case temp >= 0 && temp < 10 ? temp : null:
            sTempScale = 1
            break
        case temp >= 10 && temp < 22 ? temp : null:
            sTempScale = 2
            break
        case temp >= 22 && temp < 27 ? temp : null:
            sTempScale = 3
            break
        case temp >= 27 && temp < 34 ? temp : null:
            sTempScale = 4
            break
        case temp >= 34 ? temp : null:
            sTempScale = 5
            break
    }
    return sTempScale
}

/**
 * Assigns a uv scale value based uv reading
 *
 * @param {float} temp
 * @returns {int}  whole int value on  6 step scale
 */
export const fUvDataPt = function (uv) {
    if (!uv) return
    uv = parseFloat(uv)

    let uvClass = 'none'
    switch (uv) {
        case uv < 10 ? uv : null:
            uvClass = 0
            break
        case uv >= 10 && uv < 30 ? uv : null:
            uvClass = 1
            break
        case uv >= 30 && uv < 50 ? uv : null:
            uvClass = 2
            break
        case uv >= 50 && uv < 70 ? uv : null:
            uvClass = 3
            break
        case uv >= 70 && uv < 90 ? uv : null:
            uvClass = 4
            break
        case uv >= 90 || uv <= 100 ? uv : null:
            uvClass = 5
            break
    }
    return uvClass
}
