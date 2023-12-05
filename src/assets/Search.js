// import modules
import WeatherAPI from './WeatherAPI';

// cache dom
const searchInput = document.querySelector('.search-input');
const searchResults = document.querySelector('.search-results');

export default class Search {
  // methods
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
    newItem.classList.add('location');
    newItem.innerText = locationStr;

    searchResults.appendChild(newItem);
  }

  static selectLocation(e) {
    if (e.target.classList.contains('location')) {
      console.log(e.target.innerText);
    } else if (e.key === 'Enter' && searchResults.firstElementChild) {
      console.log(searchResults.firstElementChild.innerText);
    }
  }
}

// bind default events
searchInput.addEventListener('input', Search.renderLocationNames);
searchInput.addEventListener('keypress', Search.selectLocation);
searchResults.addEventListener('click', Search.selectLocation);
