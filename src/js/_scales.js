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
 * Takes a UV float value and returns an int for CSS data-UV="*" selectors.
 *
 * @param {float} nUV
 * @returns {int}  whole int value on  6 step scale
 */
export const fUvDataPt = function (nUV) {
    if (!nUV) return
    nUV = parseFloat(nUV)

    let sUVclass = 'none'
    switch (nUV) {
        case nUV < 1 ? nUV : null:
            sUVclass = '0'
            break
        case nUV >= 1 && nUV < 3 ? nUV : null:
            sUVclass = '1'
            break
        case nUV >= 3 && nUV < 5 ? nUV : null:
            sUVclass = '2'
            break
        case nUV >= 5 && nUV < 7 ? nUV : null:
            sUVclass = '3'
            break
        case nUV >= 7 && nUV < 9 ? nUV : null:
            sUVclass = '4'
            break
        case nUV >= 9 || nUV <= 10 ? nUV : null:
            uvClass = 5
            break
    }
    return sUVclass
}
