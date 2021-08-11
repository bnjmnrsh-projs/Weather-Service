/*! weather-service v1.0.0 | (c) 2021 bnjmnrsh@gmail.com | MIT License | git+ssh://git@github.com/bnjmnrsh-projs/Weather-Service.git */
(function () {
  'use strict';

  /**
   * Sanitise incoming API data
   *
   * @param {string} [sDirty='']
   * @returns {string} sanitised text
   */
  const fClean = function (sDirty = '') {
    if (typeof sDirty === 'number') return sDirty
    if (!sDirty) return

    const temp = document.createElement('div');
    temp.innerHTML = sDirty;
    return temp.innerText
  };

  /**
   * IP address based location API
   *
   * @returns {object} coordiantes object
   */
  const fIPapi = async function (sIpapiLocationApi) {
    const pResp = await fetch(sIpapiLocationApi).then(function (pResp) {
      if (pResp.ok) {
        return pResp.json()
      } else {
        return Promise.reject(pResp)
      }
    });
    return await pResp
  };

  /**
   * Assembles the formatted query string for CF API requests
   *
   * @param {string} urlBase
   * @param {obj} oLoc Response from oLocation API
   * @returns {string} Assembled url with query (cleaned)
   */
  const fAssembledQuery = function (urlBase, oLoc, _oSettings) {
    if (!oLoc) return

    let sApiQuery = `${urlBase}&lat=${oLoc.latitude}&lon=${oLoc.longitude}`;

    if (!oLoc.latitude || !oLoc.longitude) {
      let sCity;
      let sState;
      let sCountry = '';

      if ('city' in oLoc && oLoc.city) {
        sCity = `&city=${oLoc.city}`;
      }
      if ('state' in oLoc && oLoc.state) {
        sState = `&state=${oLoc.state}`;
      }
      if ('country' in oLoc && oLoc.country_code) {
        sCountry = `&country=${oLoc.country_code}`;
      }

      sApiQuery = `${urlBase}${sCity ?? ''}${sState ?? ''}${sCountry ?? ''}`;
    }

    if (_oSettings.debug) {
      console.log('sApiQuery query:', fClean(sApiQuery));
    }

    return fClean(sApiQuery)
  };

  /**
   * Browser based location API
   *
   * @returns {object} coordiantes object
   */
  const fGeoLocApi = async function () {
    const oOptions = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };

    const pResp = new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        function (pResp) {
          resolve(pResp.coords);
        },
        function (pResp) {
          reject(pResp);
        },
        oOptions
      );
    });
    return await pResp
  };

  /**
   * Gets the user location
   *
   * @param {string} [section='home']
   */
  const fGetLocation = async function (sIpapiLocationApi, _oSettings) {
    if (navigator.geolocation) {
      try {
        if (_oSettings.debug) {
          console.log('fGetLocation: Checking geoLoccation API: fGeoLocApi.');
        }
        return await fGeoLocApi()
      } catch (e) {
        if (_oSettings.debug) {
          console.warn('fGetLocationL: failed using fGeoLocApi: ', e);
        }
        try {
          if (_oSettings.debug) {
            console.warn('Falling back to IP address lookup instead.');
          }
          return await fIPapi(sIpapiLocationApi)
        } catch (e) {
          if (_oSettings.debug) {
            console.warn('fGetLocation: failed sIpapiLocationApi: ', e);
          }
        }
      }
    }
  };

  /**
   * Fetch the weather for a user's location.
   *
   * @param {object} oLoc
   * @returns {object} weather object
   */
  const fGetWeather = async function (oLoc, sWeatherApi, _oSettings) {
    const pResp = await fetch(
      fAssembledQuery(sWeatherApi, oLoc, _oSettings)
    ).then(function (pResp) {
      if (pResp.ok) {
        return pResp.json()
      } else {
        return Promise.reject(pResp)
      }
    });
    return await pResp
  };

  /**
   * Generate a visual scale based on 5km
   *
  no * @param {float} vis (expects km units)
   *
   */
  const fSetVisabilityScale = function (vis) {
    const distance = (parseFloat(vis) / 5) * 100;
    const nGraph = document.querySelector('.distance');
    nGraph.style.setProperty('--distance', 100 - distance + '%');
  };

  /**
   * Assigns a named string based on temperature in C
   * 6 step scale for data-temp
   *
   * @param {float} nTemp
   * @returns {string}   string
   */
  const fTempDataPt = function (nTemp) {
    if (typeof nTemp !== 'number') return 0

    nTemp = parseFloat(nTemp);

    let sTempScale = 'none';
    switch (nTemp) {
      case nTemp <= 0 ? nTemp : null:
        sTempScale = 0;
        break
      case nTemp >= 0 && nTemp < 10 ? nTemp : null:
        sTempScale = 1;
        break
      case nTemp >= 10 && nTemp < 22 ? nTemp : null:
        sTempScale = 2;
        break
      case nTemp >= 22 && nTemp < 27 ? nTemp : null:
        sTempScale = 3;
        break
      case nTemp >= 27 && nTemp < 34 ? nTemp : null:
        sTempScale = 4;
        break
      case nTemp >= 34 ? nTemp : null:
        sTempScale = 5;
        break
    }
    return sTempScale
  };

  /**
   * Takes a UV float value and returns an int for CSS data-UV="*" selectors.
   *
   * @param {float} nUV
   * @returns {int}  whole int value on  6 step scale
   */
  const fUvDataPt = function (nUV) {
    if (!nUV) return
    nUV = parseFloat(nUV);

    let sUVclass = 'none';
    switch (nUV) {
      case nUV < 1 ? nUV : null:
        sUVclass = '0';
        break
      case nUV >= 1 && nUV < 3 ? nUV : null:
        sUVclass = '1';
        break
      case nUV >= 3 && nUV < 5 ? nUV : null:
        sUVclass = '2';
        break
      case nUV >= 5 && nUV < 7 ? nUV : null:
        sUVclass = '3';
        break
      case nUV >= 7 && nUV < 9 ? nUV : null:
        sUVclass = '4';
        break
      case nUV >= 9 || nUV <= 10 ? nUV : null:
        sUVclass = 5;
        break
    }
    return sUVclass
  };

  const oWeather = {
    200: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
    201: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
    202: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
    230: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
    231: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
    232: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
    233: ['wi-day-thunderstorm', 'wi-night-alt-thunderstorm'],
    300: ['wi-day-rain', 'wi-night-alt-rain'],
    301: ['wi-day-rain', 'wi-night-alt-rain'],
    302: ['wi-day-rain', 'wi-night-alt-rain'],
    500: ['wi-day-rain', 'wi-night-alt-rain'],
    501: ['wi-day-rain', 'wi-night-alt-rain'],
    502: ['wi-day-rain-wind', 'wi-night-alt-rain-wind'],
    511: ['wi-day-sleet', 'wi-night-alt-sleet'],
    520: ['wi-day-showers', 'wi-night-alt-showers'],
    521: ['wi-day-showers', 'wi-night-alt-showers'],
    522: ['wi-day-rain', 'wi-night-alt-rain'],
    600: ['wi-day-snow', 'wi-night-alt-snow'],
    602: ['wi-day-snow', 'wi-night-alt-snow'],
    610: ['wi-day-snow-thunderstorm', 'wi-night-alt-snow-thunderstorm'],
    611: ['wi-day-snow-wind', 'wi-night-alt-snow-wind'],
    612: ['wi-day-snow-wind', 'wi-night-alt-snow-wind'],
    622: ['wi-day-snow-thunderstorm', 'wi-night-alt-snow-thunderstorm'],
    623: ['wi-day-snow', 'wi-night-alt-snow'],
    700: ['wi-day-fog', 'wi-night-fog'],
    711: ['wi-day-fog', 'wi-night-fog'],
    721: ['wi-day-fog', 'wi-night-fog'],
    731: ['wi-day-fog', 'wi-night-fog'],
    741: ['wi-day-fog', 'wi-night-fog'],
    751: ['wi-day-fog', 'wi-night-fog'],
    800: ['wi-day-sunny', 'wi-night-clear'],
    801: ['wi-day-cloudy', 'wi-night-alt-cloudy'],
    802: ['wi-day-cloudy-high', 'wi-night-alt-cloudy-high'],
    803: ['wi-day-cloudy-high', 'wi-night-partly-cloudy'],
    804: ['wi-cloudy', 'wi-cloudy'],
    900: ['wi-rain-mix', 'wi-rain-mix']
  };

  const oCloudCover = {
    0: ['wi-day-sunny', 'wi-night-clear'],
    1: ['wi-day-cloudy-high', 'wi-night-alt-cloudy-high'],
    2: ['wi-day-sunny-overcast', 'wi-night-partly-cloudy'],
    3: ['wi-cloud', 'wi-cloud'],
    4: ['wi-cloudy', 'wi-cloudy'],
    5: ['dark-cloudy', 'dark-cloudy']
  };

  /**
   * Returns the string name of the weather icon
   *
   * @param {object} oData Either the current, daily, or iHourly forecast weather object
   * @param {string || int} [iHour]
   * @returns string
   */
  const fGetWeatherIcon = function (oData, iHour) {
    if (!oData) return

    let iCode, sPod;
    if (!iHour && Object.prototype.hasOwnProperty.call(oData, 'pod')) {
      // Current weather object
      sPod = fClean(oData.sPod) === 'd' ? 0 : 1;
      iCode = parseInt(fClean(oData.weather.code));
    } else if ('hour' in oData) {
      // Forcast weather object (hourly)
      sPod = fClean(oData[iHour].sPod) === 'd' ? 0 : 1;
      iCode = parseInt(fClean(oData[iHour].weather.code));
    } else {
      // Forcast weather object (days)
      sPod = 1;
      iCode = parseInt(fClean(oData.weather.code));
    }
    return oWeather[iCode][sPod]
  };

  /**
   * Select the cloud iCoverage icon based on percentage value
   *
   * @param {int} iCoverage A percentage figure 0-100
   * @param {string} sPod Point of Day
   * @returns {string} the string name of the icon
   */
  const fGetCloudCoverIcon = function (iCoverage, sPod = 'd') {
    if (typeof iCoverage !== 'number') return

    // set day or night icon set
    sPod = sPod === 'd' ? 0 : 1;

    const icons = oCloudCover;

    iCoverage = parseInt(iCoverage);

    let aIconData = '';

    switch (iCoverage) {
      case iCoverage >= 0 && iCoverage < 16 ? iCoverage : null:
        aIconData = [icons[0][sPod], 0];
        break
      case iCoverage >= 16 && iCoverage < 32 ? iCoverage : null:
        aIconData = [icons[1][sPod], 1];
        break
      case iCoverage >= 32 && iCoverage < 48 ? iCoverage : null:
        aIconData = [icons[2][sPod], 2];
        break
      case iCoverage >= 48 && iCoverage < 65 ? iCoverage : null:
        aIconData = [icons[3][sPod], 3];
        break
      case iCoverage >= 65 && iCoverage < 83 ? iCoverage : null:
        aIconData = [icons[4][sPod], 4];
        break
      case iCoverage >= 83 && iCoverage <= 100 ? iCoverage : null:
        aIconData = [icons[5][sPod], 5];
        break
    }
    aIconData.push(document.querySelector(`#svgs .svg-${aIconData[0]}`).outerHTML);

    return aIconData
  };

  /**
   * Takes a string based representation of a DOM element, and adds inline style and/or data-* attributes to it.
   *
   * @param {string} sEl
   * @param {object} props
   * @returns {string}
   *
   * The props object may contain a top level `style` propery for inline css string
   * and or a `data` object which will be mapped to data-* attributes on the element.
   *
   *  `<span class="inline-icon">
   *    ${Icons.fSetStringElAttrs(oIcons.sWindDirection, {
   *        style: `transform: rotate(${sWindDeg}deg)`,
   *        class: 'some-class',
   *        data: { temp: '6' },
   *    })}
   *  </span>`
   */

  const fSetStringElAttrs = function (sEl, props = {}) {
    if ('content' in document.createElement('template')) {
      const nEl = document.createElement('div');
      nEl.innerHTML = sEl.trim();
      const nTarget = nEl.querySelector('div >:first-child');

      if (Object.prototype.hasOwnProperty.call(props, 'style')) {
        nTarget.setAttribute('style', props.style);
      }
      if (Object.prototype.hasOwnProperty.call(props, 'class')) {
        nTarget.classList.add(props.class);
      }
      if (
        Object.prototype.hasOwnProperty.call(props, 'data') &&
        Object.keys(props.data).length > 0
      ) {
        Object.keys(props.data).map((key) =>
          nTarget.setAttribute(`data-${key}`, props.data[key])
        );
      }
      return nEl.innerHTML
    }
    return ''
  };

  /**
   * *NOTE: the API has params for both imperial and metric units, however,
   * we do the conversion ourselves so that we can switch without additional api calls.
   */

  /**
   * mm/hr to inch/hr
   *
   * @param {float} nMeasure
   * @returns {string} converted measurement as string with units
   */
  const fPercip = function (nMeasure, _oSettings) {
    if (typeof nMeasure !== 'number' && _oSettings.debug) {
      console.warn(
        `fPercip recieved a non numeric value: ${nMeasure} typeof: ${typeof nMeasure}`
      );
    }
    if (nMeasure === 0) {
      return nMeasure
    }

    if (_oSettings.units === 'M') {
      return `${parseFloat(nMeasure).toFixed(2)}&nbsp;mm/hr`
    } else {
      return `${(parseFloat(nMeasure) * 0.0393701).toFixed(2)}&nbsp;inch/hr`
    }
  };

  /**
   * C to F conversion
   *
   * @param {float} nMeasure
   * @returns {string || number} converted tepm as string with units, or as a Float
   */
  const fTemp = function (nMeasure, _oSettings, withUnits = true) {
    if (typeof nMeasure !== 'number' && _oSettings.debug) {
      console.warn(
        `fTemp recieved a non numeric value: ${nMeasure} typeof: ${typeof nMeasure}`
      );
    }
    if (typeof nMeasure !== 'number') return 0
    if (_oSettings.units === 'M') {
      const converted = parseFloat(nMeasure).toFixed(1);
      return withUnits ? `${converted}°&nbsp;C` : converted
    } else {
      const converted = ((parseFloat(nMeasure) * 9) / 5 + 32).toFixed(1);
      return withUnits ? `${converted}°&nbsp;F` : converted
    }
  };

  /**
   * km/hr to mi/hr
   *
   * @param {float} nMeasure
   * @returns {string} converted wind speed as string with units
   */
  const fKmPerHour = function (nMeasure, _oSettings) {
    if (typeof nMeasure !== 'number' && _oSettings.debug) {
      console.warn(
        `fKmPerHour recieved a non numeric value: ${nMeasure} typeof: ${typeof nMeasure}`
      );
    }
    if (typeof nMeasure !== 'number') return 0

    if (_oSettings.units === 'M') {
      return `${(parseFloat(nMeasure) * 3.6000059687997).toFixed(2)}&nbsp;km/hr`
    } else {
      return `${(parseFloat(nMeasure) * 2.23694).toFixed(2)}&nbsp;mi/hr`
    }
  };

  /**
   * km to mi
   *
   * @param {float} nMeasure
   * @returns {string} converted distance as string with units
   */
  const fKm = function (nMeasure, _oSettings) {
    if (typeof nMeasure !== 'number' && _oSettings.debug) {
      console.warn(
        `fKm recieved a non numeric value: ${nMeasure} typeof: ${typeof nMeasure}`
      );
    }

    if (typeof nMeasure !== 'number') return 0
    if (_oSettings.units === 'M') {
      return `${parseFloat(nMeasure).toFixed(2)}&nbsp;km`
    } else {
      return `${(parseFloat(nMeasure) * 0.621371).toFixed(2)}&nbsp;miles`
    }
  };

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
    const sNewDate = `${sDate}T00:00`;
    const oDate = new Date(sNewDate);

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
  const fTime = function (sTime24, _oSettings) {
    if (!sTime24.includes(':') || !sTime24.length === '5') {
      throw new Error('fTime not given a valid time string: HH:MM')
    }

    if (_oSettings.units === 'M') return sTime24
    console.log('sTime24', `${sTime24}`);
    console.log('sTime24 length', `${sTime24.length}`);

    const [sHours, minutes] = sTime24.match(/([0-9]{1,2}):([0-9]{2})/).slice(1);
    const period = +sHours < 12 ? 'AM' : 'PM';
    const hours = +sHours % 12 || 12;

    return `${hours}:${minutes}&nbsp;${period}`
  };

  /**
   * UTC time provided by API into the local time of the users system.
   * If no date or time are provided, then the current datetime is returned
   *
   * @param {string} sDate (optional)
   * @param {object} _oSettings
   * @param {string} sTime24 (optional)
   * @returns {string} Time as string
   */
  const fGetLocalTime = function (sDate = '', _oSettings, sTime24 = '') {
    let oDate, aTime;
    console.log('sDate', sDate);
    if (sDate !== '') {
      oDate = new Date(fAddTimeToDateString(sDate));
    } else {
      oDate = new Date();
    }
    if (sTime24 !== '') {
      aTime = sTime24.split(':');
    } else {
      aTime = [oDate.getUTCHours(), oDate.getUTCMinutes()];
    }
    const aDate = [
      oDate.getUTCFullYear(),
      oDate.getUTCMonth(),
      oDate.getUTCDate(),
      aTime[0],
      aTime[1]
    ];

    const oDateUtc = new Date(Date.UTC(...aDate));

    if (_oSettings.debug === true) {
      console.log('fGetLocalTime provided sTime24: ', sTime24);
      console.log(
        'fGetLocalTime UTC converted time:',
        `${oDateUtc.getHours()}:${oDateUtc.getMinutes()}`
      );
    }
    console.log(oDate);
    return fTime(
      `${oDateUtc.getHours()}`.padStart(2, '0') +
        ':' +
        `${oDateUtc.getMinutes()}`.padStart(2, '0'),
      _oSettings
    )
  };

  /**
   * Format date string to abreviated weekday name
   *
   * @param {string} sDate, valid date string
   * @returns {string}
   */
  const fGetWeekday = function (sDate) {
    const oDate = new Date(fAddTimeToDateString(sDate));

    // test our oDate object
    if (!oDate || typeof oDate.getMonth !== 'function') {
      throw new Error('fGetWeekday provided invalid date')
    }

    return oDate.toLocaleString('default', { weekday: 'short' })
  };

  /**
   * Format date string to weekday ordinal number (string)
   *
   * @param {string} sDate
   * @returns string, weekday ordinal number
   */
  const fGetDayOrdinal = function (sDate) {
    const oDate = new Date(fAddTimeToDateString(sDate));

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
        : 'th');
    return sFormatedDate
  };

  const _oTextStrings = {
    en: {
      now: 'Currently: ',
      aira_now: 'The weather is currently: ',
      feels_like: 'Feels Like:',
      uv: 'UV:',
      cloud: 'Cloud:',
      snow: 'Snow:',
      percip: 'Rain:',
      wind: 'Wind:',
      aira_winds: 'Winds traveling at',
      aira_winds_join: 'from the',
      vis: 'Visibility:',
      sun: 'Sun:',
      moon: 'Moon:'
    }
  };

  /**
   * Perform string replacement for strings in the HUD component.
   *
   * @param {string} string
   * @param {object} _oData
   * @param {object} _oSettings
   * @returns {string} Formatted string
   */
  const fHUDstr = function (
    string,
    _oData,
    _oSettings,
    _oStrings = _oTextStrings
  ) {
    const oCURRENT = _oData.CURRENT.data[0];

    if (!string) return ''
    return (
      string
        // HUD
        .replace('{{now}}', _oStrings.en.now)
        .replace(
          '{{aira_weather_description}}',
          `${_oStrings.en.aira_now} ${fClean(oCURRENT.weather.description)}`
        )
        .replace(
          '{{weather_description}}',
          fClean(oCURRENT.weather.description).toLowerCase()
        )
        .replace('{{temp}}', fTemp(fClean(oCURRENT.temp), _oSettings))
        .replace('{{city}}', fClean(oCURRENT.city_name))
        .replace('{{country}}', fClean(oCURRENT.country_code))
    )
  };

  /**
   * Perform string replacement for strings in the details component.
   *
   * @param {string} string
   * @param {object} _oData
   * @param {object} _oSettings
   * @returns {string} Formatted string
   */
  const fDetsStr = function (
    string,
    _oData,
    _oSettings,
    _oStrings = _oTextStrings
  ) {
    const oCURRENT = _oData.CURRENT.data[0];

    if (!string) return ''
    return (
      string
        // Details
        .replace('{{feels_like}}', _oStrings.en.feels_like)
        .replace(
          '{{app_temp}}',
          fTemp(fClean(oCURRENT.app_temp), _oSettings)
        )
        .replace('{{uv}}', _oStrings.en.uv)
        .replace('{{uv_index}}', fClean(oCURRENT.uv.toFixed(2)))

        .replace('{{cloud}}', _oStrings.en.cloud)
        .replace('{{cloud_percent}}', `${fClean(oCURRENT.clouds)}%`)
        .replace('{{snow}}', _oStrings.en.snow)
        .replace(
          '{{snow_percip}}',
          fPercip(fClean(oCURRENT.snow), _oSettings)
        )
        .replace('{{rain}}', _oStrings.en.percip)
        .replace(
          '{{rain_percip}}',
          fPercip(fClean(oCURRENT.precip), _oSettings)
        )
        .replace('{{aira_winds}}', _oStrings.en.aira_winds)
        .replace('{{aira_winds_join}}', _oStrings.en.aira_winds_join)

        .replace('{{wind}}', _oStrings.en.wind)
        .replace(
          '{{wind_speed}}',
          fKmPerHour(fClean(oCURRENT.wind_spd), _oSettings)
        )
        .replace('{{wind_direction}}', fClean(oCURRENT.wind_cdir))
        .replace('{{vis}}', _oStrings.en.vis)
        .replace(
          '{{vis_distance}}',
          fKm(fClean(oCURRENT.vis), _oSettings)
        )
        .replace('{{sun_rise_set}}', _oStrings.en.sun)
        .replace(
          '{{sun_rise}}',
          fGetLocalTime(
            fClean(oCURRENT.ob_time),
            _oSettings,
            fClean(oCURRENT.sunrise)
          )
        )
        .replace(
          '{{sun_set}}',
          fGetLocalTime(
            fClean(oCURRENT.ob_time),
            _oSettings,
            fClean(oCURRENT.sunset)
          )
        )
        .replace('{{moon}}', _oStrings.en.moon)
    )
  };

  /**
   * Renders the app's header
   *
   * @param {array} _oData
   * @returns {string}
   */
  const fRenderHUD = function (_oData, _oSettings) {
    if (_oSettings.log) {
      console.log('fRenderHUD: ', _oData);
    }

    const oCURRENT = _oData.CURRENT.data[0];
    const sIconName = fGetWeatherIcon(oCURRENT);

    const template = `<header
        id="hud" class="c-hud" data-temp="${fTempDataPt(
          fClean(oCURRENT.temp)
        )}">
            <h3>
                <img class="weather-icon" alt="" src="./svg/icons/weather/svg/${sIconName}.svg" />
                <span aria-hidden="true">{{temp}}</span>
                </h3>
                <ul class="unstyled">
                <li aria-hidden="true">{{now}} {{weather_description}}</li>
                <li hidden>{{aira_weather_description}}</li>
                <li>{{city}}, {{country}}</li>
            </ul>
        </header>
        `;
    return fHUDstr(template, _oData, _oSettings)
  };

  /**
   * Renders individual upcoming forecast li elements
   *
   * @param {object} _oForecast
   * @param {object} _oSettings
   * @returns {string}
   */
  const fRenderForecastList = function (_oForecast, _oSettings) {
    console.log('fRenderForcast: ', _oForecast);
    console.log('_oSettings: ', _oSettings);

    const days = Object.keys(_oForecast);
    return days
      .map(function (el) {
        return `<li data-temp="${fTempDataPt(
        fClean(_oForecast[el].temp))}">
                        <header datetime="${fClean(
                          _oForecast[el].datetime
                        )}" aria-description="The forecast for">${fGetWeekday(fClean(_oForecast[el].datetime))} ${fGetDayOrdinal(fClean(_oForecast[el].datetime))}</header>
                        <img class="weather-icon" alt="${fClean(
                          _oForecast[el].weather.description
                        )}" src="./svg/icons/weather/svg/${fGetWeatherIcon(_oForecast[el])}.svg" />
                        <p class="forecast-description" aria-hidden="true">${fClean(
                          _oForecast[el].weather.description.toLowerCase()
                        )}</p>
                         <span><stong>${fTemp(
                           fClean(_oForecast[el].high_temp),
                           _oSettings
                         )}</stong></span>
                          <span>${fTemp(
                            fClean(_oForecast[el].low_temp),
                            _oSettings
                          )}</span>

                    </li>`
      })
      .join('')
  };

  /**
   * Renders the app's upcoming forecast section
   *
   * @param {object} _oForecast
   * @returns {string}
   */
  const fRenderForecast = function (_oForecast, _oSettings) {
    return `
        <div id="forecast" class="c-forecast" aria-description="The weather forecast for the next 16 days.">
            <ul class="unstyled">
                ${fRenderForecastList(_oForecast, _oSettings)}
            </ul>
        </div>
        `
  };

  /**
   * https://gist.github.com/endel/dfe6bb2fbe679781948c#gistcomment-2811037
   *
   * @param {Date object || date string} Date Object or String with valid formatting to make date object from.
   * @returns {object} Moon phase object
   */
  const fPhase = function (date, _oSettings) {
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
        let c = 0;
        let e = 0;
        let jd = 0;
        let b = 0;

        if (month < 3) {
          year--;
          month += 12;
        }

        ++month;
        c = 365.25 * year;
        e = 30.6 * month;
        jd = c + e + day - 694039.09; // jd is total days elapsed
        jd /= 29.5305882; // divide by the moon cycle
        b = parseInt(jd); // int(jd) -> b, take integer part of jd
        jd -= b; // subtract integer part to leave fractional part of original jd
        b = Math.round(jd * this.phases.length); // scale fraction from 0-8 and round

        if (b >= 8) b = 0; // 0 and 8 are the same so turn 8 into 0
        return { phase: b, name: Moon.phases[b] }
      }
    };

    // if no date, create date based on current system date
    date = date || new Date();

    // if provided a date, try to make a new Date object
    date = date instanceof String ? new Date(date) : date;

    // test our date object
    if (!date || typeof date.getMonth !== 'function') {
      if (_oSettings.debug) {
        console.error(
          `fMoonPhase provided invalid date strings: year: ${date.year}, month: ${date.month}, day: ${date.day}`
        );
      }
    }

    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1; // 0 indexed
    const dd = date.getDate();

    const oMoonPhase = Moon.phase(yyyy, mm, dd);

    if (_oSettings.debug) {
      console.log('fMoonPhase result: ', oMoonPhase);
    }

    return oMoonPhase
  };

  /**
   * Renders the app's details secection
   *
   * @param {object} _oData
   * @param {object} _oSettings
   * @returns {string}
   */
  const fRenderDetails = function (_oData, _oSettings) {
    const oCURRENT = _oData.CURRENT.data[0];
    const iconCloud = fGetCloudCoverIcon(oCURRENT.clouds);
    const oMoon = fPhase(oCURRENT.obj_time, _oSettings);
    const oIcons = _oSettings.icon;

    const template = `
        <div id="details" class="c-details">
            <ul class="unstyled">
                <li class="c-feels-like">
                    <span class="left-col">{{feels_like}} {{app_temp}}</span>
                    ${fSetStringElAttrs(_oSettings.icon.sThermometer, {
                      class: 'inline-icon',
                      data: {
                        temp: fTempDataPt(fClean(oCURRENT.app_temp))
                      }
                    })}
                </li>
                ${
                  oCURRENT.uv
                    ? `<li class="c-uv-index">
                            <span class="left-col">{{uv}} {{uv_index}}</span>
                            ${fSetStringElAttrs(
                              _oSettings.icon.sSunnyDay,
                              {
                                class: 'inline-icon',
                                data: {
                                  uv: fUvDataPt(
                                    fClean(oCURRENT.uv))
                                }
                              }
                            )}
                          </li>`
                    : ''
                }
                <li class="c-cloud-cover">
                    <span class="left-col">{{cloud}} {{cloud_percent}}</span>
                    ${iconCloud[2]}
                </li>
                ${
                  oCURRENT.snow
                    ? `<li>
                            <span class="left-col">{{snow}} {{snow_percip}}</span>
                            ${oIcons.sSnow}
                          </li>`
                    : ''
                }
                <li class="c-precipitation">
                    <span class="left-col">{{rain}} {{rain_percip}}</span>
                    ${oIcons.sRaindrop}
                </li>
                <li class="c-windspeed" aria-description="{{aira_winds}} ">
                    <span class="left-col">
                        {{wind}} {{wind_speed}}<span aira-hidden>&nbsp;|&nbsp;</span><span hidden>{{aira_winds_join}}</span>{{wind_direction}}
                    </span>
                    <span class="inline-icon">
                        ${fSetStringElAttrs(oIcons.sWindDirection, {
                          style: `transform: rotate(${fClean(
                            oCURRENT.wind_dir + 180
                          )}deg)`
                        })}
                        ${oIcons.sWind}
                    </span>
                </li>
                <li class="c-visibility">
                    <div class="visibility-wrap">
                        <span class="left-col">{{vis}} {{vis_distance}}</span>
                        ${oIcons.sBinoculars}
                    </div>
                    <div class="scale" aria-hidden="true"><div class="distance"></div></div>
                </li>
                <li class="c-sun-rise-set">
                    <span class="left-col">{{sun_rise_set}} {{sun_rise}} | {{sun_set}}</span>
                    ${oIcons.sSunrise}
                </li>
                <li class="c-moonphase">
                    <span class="left-col">{{moon}} ${oMoon.name}</span>
                    <img class="inline-icon moon"
                        alt=""
                        height="25" width="25"
                        src="./svg/icons/moon/svg/${oMoon.phase}.svg"/>
                </li>
            </ul>
        </div>`;
    return fDetsStr(template, _oData, _oSettings)
  };

  /**
   * Render errors to the user
   *
   * @param {obj} err
   * @returns
   */
  const fRenderErrors = function (err) {
    return `<div id="ohnos" class="c-screen errors">
                <h3><span aria-hidden="true">⥀.⥀</span><br>Oh Nooos!</h3>
                <p class="sr-only">There has been a crittical error:</p>
                    <div class="errors-wrap">
                        ${err.stack ? '<code>' + err.stack + '</code>' : ''}
                        ${
                          err.status
                            ? '<code>' +
                              err.statusText +
                              ': ' +
                              err.status +
                              '</code>'
                            : ''
                        }
                    </div>
                <img alt="" class="screen-icon errors-icon" src="./svg/icons/weather/svg/wi-alien.svg"/>
            </div>`
  };

  /**
   * Darkmode Theme Toggle
   *
   * @author bnjmnrsh@gmail.com
   */

  //
  // Private methods
  //

  /**
   * Get the current value of the CSS '--color-mode' property.
   * https://piccalil.li/tutorial/get-css-custom-property-value-with-javascript/
   *
   * @returns {string} dark || light
   */
  const fGetColorModeCSSpropVal = function (oSettings = {}) {
    let sResponse = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(oSettings.COLOR_MODE_CSS_PROP);
    if (sResponse.length) {
      sResponse = sResponse.replace(/"/g, '').trim();
    }

    if (oSettings.debug) {
      console.log('ThemeToggle:fGetColorModeCSSpropVal: sResponse:', sResponse);
    }

    return sResponse
  };

  /**
   * Get the last saved value from local storage, falling back to System prefers-color-scheme via CSS prop.
   *
   * @param {obj} oSettings
   * @returns {string} light || dark
   */
  const fGetLocalStoreColorSchemeVal = function (oSettings = {}) {
    let sCurrentSetting = window.localStorage.getItem(oSettings.STORAGE_KEY);

    // If nothing stored, check which style sheet is active
    if (sCurrentSetting === null) {
      sCurrentSetting =
        fGetColorModeCSSpropVal(oSettings) === 'dark' ? 'dark' : 'light';
      // Set to localStorage
      window.localStorage.setItem(oSettings.STORAGE_KEY, sCurrentSetting);
    }
    if (oSettings.debug) {
      console.log(
        'ThemeToggle:fGetLocalStoreColorSchemeVal: sCurrentSetting:',
        sCurrentSetting
      );
    }

    return sCurrentSetting
  };

  /**
   * Save user perfered theme to localStorage
   *
   * @param {string} sCurrentSetting 'light' || 'dark'
   * @param {obj} oSettings
   */
  const fSetLocalStoreColorSchemeVal = function (
    sCurrentSetting,
    oSettings = {}
  ) {
    if (sCurrentSetting === 'light' || sCurrentSetting === 'dark') {
      window.localStorage.setItem(oSettings.STORAGE_KEY, sCurrentSetting);
    }

    if (oSettings.debug) {
      console.log(
        'ThemeToggle:fSetLocalStoreColorSchemeVal: sCurrentSetting:',
        sCurrentSetting
      );
    }
  };

  /**
   * Apply data-user-color-scheme to document, update localStore.
   *
   * @param {string} sColorSetting
   * @param {obj} oSettings
   */
  const fSetHTMLdataAttr = function (sColorSetting, oSettings = {}) {
    const sCurrentSetting =
      sColorSetting || fGetLocalStoreColorSchemeVal(oSettings);

    if (sCurrentSetting === 'light' || sCurrentSetting === 'dark') {
      // Set the data attr
      document.documentElement.setAttribute(
        'data-user-color-scheme',
        sCurrentSetting
      );
    }

    if (oSettings.debug) {
      console.log('ThemeToggle:fSetHTMLdataAttr: sColorSetting:', sColorSetting);
    }
  };

  /**
   * Update the aria-pressed state of toggle-button based on passed value.
   *
   * @param {string} sSetButtonState 'light' || 'dark'
   * @param {obj} oSettings
   */
  const fSetButtonState = function (
    sSetButtonState,
    nThemeToggel,
    oSettings = {}
  ) {
    switch (sSetButtonState) {
      case 'dark':
        nThemeToggel.setAttribute('aria-pressed', 'true');
        break
      case 'light':
        nThemeToggel.removeAttribute('aria-pressed');
        break
    }

    if (oSettings.debug) {
      console.log(
        'ThemeToggle:fSetButtonState: sSetButtonState:',
        sSetButtonState
      );
    }
  };

  /**
   * Set the UI color scheme, button state, and update localStore.
   *
   * @param {string} sColorSetting 'light' || 'dark'
   * @param {obj} oSettings
   */
  const fSetGlobalColorScheme = function (
    sColorSetting,
    nThemeToggel,
    oSettings
  ) {
    const sCurrentSetting =
      sColorSetting || fGetLocalStoreColorSchemeVal(oSettings);

    switch (sCurrentSetting) {
      case 'light':
        fSetHTMLdataAttr('light', oSettings);
        fSetButtonState('light', nThemeToggel, oSettings);
        fSetLocalStoreColorSchemeVal('light', oSettings);
        break
      case 'dark':
        fSetHTMLdataAttr('dark', oSettings);
        fSetButtonState('dark', nThemeToggel, oSettings);
        fSetLocalStoreColorSchemeVal('dark', oSettings);
        break
    }

    if (oSettings.debug) {
      console.log(
        'ThemeToggle:fSetGlobalColorScheme: sCurrentSetting:',
        sCurrentSetting
      );
    }
  };

  /**
   * Toggle the UI color scheme & button state based on value saved in window.localStorage.
   *
   * @param {obj} oSettings
   */
  const fToggleGlobalColorScheme = function (nThemeToggel, oSettings = {}) {
    const sCurrentSetting = fGetLocalStoreColorSchemeVal(oSettings);

    switch (sCurrentSetting) {
      case 'light':
        fSetGlobalColorScheme('dark', nThemeToggel, oSettings);
        break
      case 'dark':
        fSetGlobalColorScheme('light', nThemeToggel, oSettings);
        break
    }

    if (oSettings.debug) {
      console.log(
        'ThemeToggle:fToggleGlobalColorScheme: sCurrentSetting:',
        sCurrentSetting
      );
    }
  };

  /**
   * Add listeners for button clicks, changes to prefers-color-scheme, and the html data-user-color-scheme attr.
   *
   * @param {obj} oSettings
   */
  const fAddEventListeners = function (nThemeToggel, oSettings = {}) {
    // Detect prefers-color-scheme system preference changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', function (e) {
        if (e.matches) {
          fSetGlobalColorScheme('dark', nThemeToggel, oSettings);
        } else {
          fSetGlobalColorScheme('light', nThemeToggel, oSettings);
        }

        if (oSettings.debug && e.matches) {
          console.log(
            `ThemeToggle:fAddEventListeners: Window detected system color pref change: ${e.matches}`
          );
        }
      });

    // Capture clicks on the toggle
    document.addEventListener('click', function (e) {
      if (e.target.id === nThemeToggel.id) {
        fToggleGlobalColorScheme(nThemeToggel, oSettings);

        if (oSettings.debug) {
          console.log(
            `ThemeToggle:fAddEventListeners: button "${e.target.id}" clicked.`
          );
        }
      }
    });

    // listen for changes to on html data-user-color-scheme attr if mutiple toggle-buttons
    const observer = new window.MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === `data-${oSettings.STORAGE_KEY}`) {
          const sHTMLcolorMode = document.documentElement.getAttribute(
            `data-${oSettings.STORAGE_KEY}`
          );
          // Update button state to reflect change
          fSetButtonState(sHTMLcolorMode, nThemeToggel, oSettings);
          // Update localStorage value to reflect change
          fSetLocalStoreColorSchemeVal(sHTMLcolorMode, oSettings);

          if (oSettings.debug) {
            console.log(
              `ThemeToggle:fAddEventListeners: MutationObserver change: data-${oSettings.STORAGE_KEY}="${sHTMLcolorMode}"`
            );
          }
        }
      });
    });
    // MutationObserver options
    observer.observe(document.documentElement, {
      attributeFilter: [`data-${oSettings.STORAGE_KEY}`],
      attributeOldValue: true
    });
  };

  const ThemeToggle = function (oOptions = {}) {
    //
    // Settings & Defaults
    //

    const oDefaults = {
      buttonID: '#theme-toggler',
      debug: false
    };

    // Merge user options into defaults
    const oSettings = Object.assign({}, oDefaults, oOptions);
    oSettings.STORAGE_KEY = 'user-color-scheme';
    oSettings.COLOR_MODE_CSS_PROP = '--color-mode';
    this.oSettings = oSettings;

    //
    // Varriables
    //

    const nThemeToggel = document.querySelector(oSettings.buttonID);

    /**
     * Public init method
     *
     * @returns public init method
     */
    this.init = function () {
      if (!nThemeToggel) {
        console.warn(
          "ThemeToggle: Couldn't find the theme toggel button with selector:",
          nThemeToggel
        );
        return
      } else {
        // Enable the button
        nThemeToggel.removeAttribute('disabled');
      }

      // Add event listeners
      fAddEventListeners(nThemeToggel, oSettings);

      // Establish toggle/theme state based on system and/or last pref saved in localStorage
      fSetGlobalColorScheme(
        fGetLocalStoreColorSchemeVal(oSettings),
        nThemeToggel,
        oSettings
      );

      if (oSettings.debug) {
        console.log(
          'ThemeToggle:Init,  current localStore setting: ',
          window.localStorage.getItem(oSettings.STORAGE_KEY)
        );
      }
    };
  };

  /**
   * The Weather Service
   *
   * @author bnjmnrsh@gmail.com
   *
   * @param {object} [_oSettings={}]
   */

  const weatherApp = function (_oSettings = {}) {
    document.documentElement.classList.remove('no-js');

    const _oDefaults = {
      target: '#app',
      units: 'M',
      debug: false,
      dev: false
    };

    // Merge settings with defaults
    _oSettings = Object.assign(_oDefaults, _oSettings);

    // API urls
    const sIpapiLocationApi = 'https://ipapi.co/json/';
    let sWeatherApi = 'https://weatherserv.bnjmnrsh.workers.dev/?';

    if (_oSettings.dev === true) {
      sWeatherApi = `${sWeatherApi}&DEV=true`;
    }

    // DOM Target
    const nApp = document.querySelector(_oSettings.target);

    // SVGs are staged in HTML for details section,
    // the remainder of images are inlined(except Cloudcover & Moon, loaded dynamically)
    const nIcons = document.querySelector('#svgs');

    _oSettings.icon = {
      // degrees/compass inline
      sWind: nIcons.querySelector('.svg-wi-strong-wind').outerHTML,
      sThermometer: nIcons.querySelector('.svg-wi-thermometer').outerHTML,
      sWindDirection: nIcons.querySelector('.svg-wi-wind-deg').outerHTML,
      sSnow: nIcons.querySelector('.svg-wi-snow').outerHTML,

      // cloud lodaded dynamically
      sRaindrop: nIcons.querySelector('.svg-wi-raindrop').outerHTML,
      sBinoculars: nIcons.querySelector('.svg-binoculars').outerHTML,
      sSunrise: nIcons.querySelector('.svg-wi-sunrise').outerHTML,
      sSunset: nIcons.querySelector('.svg-wi-sunset').outerHTML,
      sSunnyDay: nIcons.querySelector('.svg-wi-day-sunny').outerHTML
      // moon phases are loaded as img pathsL: <img src="./svg/icons/moon/svg/${oMoon.phase}.svg">
    };

    /**
     * Build the UI
     *
     * @param {array} data
     */
    const fBuildUI = function (_oData) {
      nApp.classList.remove('loading');
      nApp.innerHTML =
        fRenderHUD(_oData, _oSettings) +
        fRenderDetails(_oData, _oSettings) +
        fRenderForecast(_oData.DAILY.data, _oSettings);

      // Adjust the visibility 'fogg' bar in the details section
      fSetVisabilityScale(_oData.CURRENT.data[0].vis);
    };

    /**
     * Init
     */
    const fInit = async function () {
      try {
        const loc = await fGetLocation(sIpapiLocationApi, _oSettings);
        const _oWeather = await fGetWeather(loc, sWeatherApi, _oSettings);

        if (_oSettings.debug) {
          console.log('fGetLocation response:', loc);
          console.log('fGetWeather response:', _oWeather);
        }

        fBuildUI(_oWeather);
      } catch (e) {
        console.error('init error: ', e);
        nApp.innerHTML = fRenderErrors(e);
      }
    };
    fInit();

    // Enable ThemeToggle
    const themeToggle = new ThemeToggle({ debug: _oSettings.debug });
    themeToggle.init();

    // const themeToggle2 = new ThemeToggle({
    //   debug: true,
    //   buttonID: '#theme-toggler-2'
    // })
    // themeToggle2.init()
  };

  // with debugging and Imperial Units
  const settings = {
    units: 'I',
    debug: false,
    dev: false // 5XX_FULL, 5XX_PARTIAL, DUMMY, NO_KEY, OVER_QUOTA, API_ERROR
  };

  weatherApp(settings);

}());
//# sourceMappingURL=app.js.map
