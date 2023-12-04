const weatherForecastEndpoint = 'http://api.weatherapi.com/v1/forecast.json?';
const weatherSearchEndpoint = 'http://api.weatherapi.com/v1/search.json?';
const weatherApiKey = 'f59714b9ced048d6b83171709230312';

export default class WeatherAPI {
  // PUBLIC - use clean location to get all location weather data //
  static async getLocationData(polishedLocation) {
    const weatherForecastParams = new URLSearchParams({
      key: weatherApiKey,
      days: 2,
      q: polishedLocation,
    });
    const myRequest = new Request(
      weatherForecastEndpoint + weatherForecastParams,
      {
        mode: 'cors',
      },
    );

    // fetch forecast //
    try {
      const response = await fetch(myRequest);
      const rawData = await response.json();

      return this.#cleanLocationForecast(rawData);
    } catch (error) {
      return `Error in getLocationData: ${error}`;
    }
  }

  // PRIVATE - clean the raw monolith of data to useable custom properties //
  static #cleanLocationForecast(rawData) {
    const cleanLocData = {};

    cleanLocData.name = `${rawData.location.name}, ${rawData.location.country}`;
    cleanLocData.isDay = Boolean(rawData.current.is_day);
    cleanLocData.currentTimeIndex = Number(
      rawData.location.localtime.split(':')[0].split(' ')[1],
    );
    cleanLocData.currentCondition = rawData.current.condition.text;
    cleanLocData.currentConditionIcon = rawData.current.condition.icon;
    cleanLocData.currentTempC = Math.round(rawData.current.temp_c);
    cleanLocData.currentTempF = Math.round(rawData.current.temp_f);

    // pass in private hour array function //
    cleanLocData.hours = this.#getLocHours(
      rawData,
      cleanLocData.currentTimeIndex,
    );

    return cleanLocData;
  }

  // PRIVATE - get an array of 24 hours starting at the current hour //
  static #getLocHours(data, timeIndex) {
    const hoursFirstDayRaw = data.forecast.forecastday[0].hour.slice(timeIndex);
    const hoursSecondDayRaw = data.forecast.forecastday[1].hour.slice(
      0,
      timeIndex,
    );
    const hoursArrRaw = [...hoursFirstDayRaw, ...hoursSecondDayRaw];

    // convert the raw array of hours to a custom array of obj //
    const hoursArr = hoursArrRaw.map((item) => {
      const hourObj = {};

      hourObj.timeIndex = Number(item.time.split(':')[0].split(' ')[1]);
      hourObj.isDay = Boolean(item.is_day);
      hourObj.condition = item.condition.text;
      hourObj.conditionIcon = item.condition.icon;
      hourObj.tempC = Math.round(item.temp_c);
      hourObj.tempF = Math.round(item.temp_f);

      return hourObj;
    });

    return hoursArr;
  }

  // PUBLIC - use user location input to get array of potential matches in API //
  static async getLocationOptions(rawLocationInput) {
    const weatherSearchParams = new URLSearchParams({
      key: weatherApiKey,
      q: rawLocationInput,
    });
    const myRequest = new Request(weatherSearchEndpoint + weatherSearchParams, {
      mode: 'cors',
    });

    // fetch forecast //
    try {
      const response = await fetch(myRequest);
      const rawData = await response.json();

      return this.#cleanLocationOptions(rawData);
    } catch (error) {
      return `Error in getLocationOptions: ${error}`;
    }
  }

  static #cleanLocationOptions(rawData) {
    return [...new Set(rawData.map((item) => `${item.name}, ${item.country}`))];
  }
}
