// import modules
import * as Events from './Events';

// cache dom
const weatherMetaContainer = document.querySelector('.weather-meta-container');
const hourlyFrame = document.querySelector('.hourly-frame');
const hourlyList = document.querySelector('.hourly-list');

export default class Hourly {
  static renderLocationWeather(userObj) {
    if (userObj.currentLocIndex >= 0) {
      const currentLocObj = userObj.locations[userObj.currentLocIndex];

      weatherMetaContainer.innerHTML = `
        <div class="meta-text grid">
          <div class="text-name">
            <h3>${currentLocObj.name.split(',')[0]}</h3>
            <h4>${currentLocObj.name.split(',')[1].trim()}</h4>
          </div>
          <div class="text-condition">
            <h3>Current Condition:</h3>
            <p>${currentLocObj.currentCondition}</p>
          </div>
        </div>
        <div class="meta-data grid">
          <div class="data-icon grid">
            <img
              src="https://${currentLocObj.currentConditionIcon}"
            />
          </div>
          <div class="data-temp grid">
            <p>
              <span class="data-temp-num">${currentLocObj.currentTempC}</span>
              <sup>o</sup>
              <span class="data-temp-system">C</span>
            </p>
          </div>
        </div>
        `;

      // remove all li from ul, re-render all new li, and then scroll left to start of hours //
      [...hourlyList.children].forEach((child) =>
        hourlyList.removeChild(child),
      );
      currentLocObj.hours.forEach(Hourly.#addHourDisplay);
      hourlyFrame.scrollLeft = 0;
    } else {
      weatherMetaContainer.innerHTML = '';
      [...hourlyList.children].forEach((child) =>
        hourlyList.removeChild(child),
      );
    }
  }

  static #addHourDisplay(hourObj, index) {
    const newHour = document.createElement('li');
    const timeDisplay = Hourly.#getDisplayTime(hourObj.timeIndex, index);

    newHour.innerHTML = `
    <div class="hourly-temp grid">
      <p>
        <span class="hour-temp-num">${hourObj.tempC}</span>
        <sup>o</sup>
        <span class="hour-temp-system">C</span>
      </p>
    </div>
    <div class="hourly-condition grid">
      <img
        src="https://${hourObj.conditionIcon}"
      />
    </div>
    <div class="hourly-time grid">
      <p>${timeDisplay}</p>
    </div>
    `;

    hourlyList.appendChild(newHour);
  }

  static #getDisplayTime(timeIndex, itemIndex) {
    if (itemIndex === 0) {
      return 'Now';
    } else if (timeIndex === 0) {
      return '12 AM';
    } else if (timeIndex < 12) {
      return `${timeIndex} AM`;
    } else if (timeIndex === 12) {
      return '12 PM';
    } else {
      return `${timeIndex - 12} PM`;
    }
  }
}

// bind custom events
Events.on('renderLocationWeather', Hourly.renderLocationWeather);
