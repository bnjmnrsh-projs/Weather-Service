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
 * @param {float} nTemp
 * @returns {string}   string
 */
export const fTempDataPt = function (nTemp) {
    if (typeof nTemp !== 'number') return 0

    nTemp = parseFloat(nTemp)

    let sTempScale = 'none'
    switch (nTemp) {
        case nTemp <= 0 ? nTemp : null:
            sTempScale = 0
            break
        case nTemp >= 0 && nTemp < 10 ? nTemp : null:
            sTempScale = 1
            break
        case nTemp >= 10 && nTemp < 22 ? nTemp : null:
            sTempScale = 2
            break
        case nTemp >= 22 && nTemp < 27 ? nTemp : null:
            sTempScale = 3
            break
        case nTemp >= 27 && nTemp < 34 ? nTemp : null:
            sTempScale = 4
            break
        case nTemp >= 34 ? nTemp : null:
            sTempScale = 5
            break
    }
    return sTempScale
}

/**
 * Assigns a uv scale value based uv reading
 *
 * @param {float} uv
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
