// import modules
import * as Events from './Events';

// cache dom
const locationList = document.querySelector('.locations-list');
const deleteButtonsList = document.querySelector('.delete-buttons-list');

export default class Locations {
  static renderLocationList(userObj) {
    [...locationList.children].forEach((child) =>
      locationList.removeChild(child),
    );
    [...deleteButtonsList.children].forEach((child) =>
      deleteButtonsList.removeChild(child),
    );

    userObj.locations.forEach(Locations.#renderListItem);
  }

  static #renderListItem(locationObj, index) {
    const newItem = document.createElement('li');
    newItem.classList.add('location');
    newItem.setAttribute('data-index', index);
    newItem.innerText = locationObj.name;

    const newDeleteButton = document.createElement('li');
    newDeleteButton.classList.add('delete-button');
    newDeleteButton.setAttribute('data-index', index);
    newDeleteButton.innerText = 'x';

    locationList.appendChild(newItem);
    deleteButtonsList.appendChild(newDeleteButton);
  }

  static changeLocation(e) {
    if (e.target.getAttribute('class') === 'location') {
      Events.emit(
        'moveToLocation',
        Number(e.target.getAttribute('data-index')),
      );
    }
  }

  static showActiveLocation(userObj) {
    for (const location of [...locationList.children]) {
      if (
        Number(location.getAttribute('data-index')) === userObj.currentLocIndex
      ) {
        location.classList.add('active');
      } else {
        location.classList.remove('active');
      }
    }
  }

  static deleteLocation(e) {
    if (e.target.getAttribute('class') === 'delete-button') {
      Events.emit(
        'removeLocation',
        Number(e.target.getAttribute('data-index')),
      );
    }
  }
}

// bind default events
locationList.addEventListener('click', Locations.changeLocation);
deleteButtonsList.addEventListener('click', Locations.deleteLocation);

// bind custom events
Events.on('renderLocationList', Locations.renderLocationList);
Events.on('showActiveLocation', Locations.showActiveLocation);
