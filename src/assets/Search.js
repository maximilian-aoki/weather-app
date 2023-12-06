// import modules
import WeatherAPI from './WeatherAPI';
import * as Events from './Events';

// cache dom
const searchInput = document.querySelector('.search-input');
const searchResults = document.querySelector('.search-results');

export default class Search {
  static async renderLocationNames() {
    if (searchInput.value.length >= 3) {
      // fetch search //
      const locationNameArr = await WeatherAPI.getLocationOptions(
        searchInput.value,
      );

      // delete and re-render elements //
      [...searchResults.children].forEach((child) =>
        searchResults.removeChild(child),
      );
      locationNameArr.forEach(Search.#renderListItem);
    } else {
      // delete elements //
      [...searchResults.children].forEach((child) =>
        searchResults.removeChild(child),
      );
    }
  }

  static #renderListItem(locationStr) {
    const newItem = document.createElement('li');
    newItem.classList.add('result');
    newItem.innerText = locationStr;

    searchResults.appendChild(newItem);
  }

  static selectLocation(e) {
    if (e.target.classList.contains('result')) {
      Events.emit('addLocation', e.target.innerText);
      Search.#removeSearchResults();
    }
  }

  static async #removeSearchResults() {
    searchInput.value = '';
    Search.renderLocationNames();
  }
}

// bind default events
searchInput.addEventListener('input', Search.renderLocationNames);
searchResults.addEventListener('click', Search.selectLocation);
