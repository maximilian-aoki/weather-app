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

  static #renderListItem(locationObj, index) {
    const newItem = document.createElement('li');
    newItem.classList.add('location');
    newItem.setAttribute('data-index', index);
    newItem.innerText = locationObj.name;

    locationList.appendChild(newItem);
  }

  static changeLocation(e) {
    Events.emit('moveToLocation', Number(e.target.getAttribute('data-index')));
  }
}

// bind default events
locationList.addEventListener('click', Locations.changeLocation);

// bind custom events
Events.on('renderLocationList', Locations.renderLocationList);
