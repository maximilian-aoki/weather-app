// import modules
import * as Events from './Events';

// cache dom
const locationList = document.querySelector('.locations-list');

export default class Locations {
  static renderLocationList(userObj) {
    [...locationList.children].forEach((child) =>
      locationList.removeChild(child),
    );

    userObj.locations.forEach(Locations.#renderListItem);
  }

  static #renderListItem(locationObj) {
    const newItem = document.createElement('li');
    newItem.classList.add('location');
    newItem.innerText = locationObj.name;

    locationList.appendChild(newItem);
  }
}

// bind default events

// bind custom events
Events.on('renderLocationList', Locations.renderLocationList);
