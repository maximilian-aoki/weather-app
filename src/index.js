// import css
import './static/reset.css';
import './static/style.css';

// import modules
import * as Events from './assets/events';
import WeatherAPI from './assets/WeatherAPI';
import User from './assets/User';

// INIT //
let user;

if (localStorage.getItem('user')) {
  console.log('getting user from localStorage with time'); // DEBUGGING

  const timeNowRaw = new Date();
  const timeNow = timeNowRaw.toISOString().split(':')[0];
  user = JSON.parse(localStorage.getItem('user'));

  if (user.currentAppTime !== timeNow && user.locations.length) {
    refreshLocations();
  }
} else {
  console.log('creating new user'); // DEBUGGING

  user = new User();
}

// METHODS //
function pushStorage() {
  user.getAppTime();
  localStorage.setItem('user', JSON.stringify(user));
}

async function refreshLocations() {
  console.log('starting refresh'); // DEBUGGING

  const locationPromises = user.locations.map((location) =>
    WeatherAPI.getLocationData(location.name),
  );
  user.locations = await Promise.all(locationPromises);

  pushStorage();

  console.log('finished refresh'); // DEBUGGING
  console.log(user); // DEBUGGING
}

async function addLocation(locationStr) {
  const newLocation = await WeatherAPI.getLocationData(locationStr);

  user.addLocation(newLocation);
  user.currentLocIndex = user.locations.length - 1;

  pushStorage();

  console.log('adding location'); // DEBUGGING
  console.log(user); // DEBUGGING
}

function removeLocation(index) {
  user.removeLocation(index);
  user.currentLocIndex =
    index <= user.currentLocIndex
      ? (user.currentLocIndex -= 1)
      : user.currentLocIndex;

  pushStorage();

  console.log('removing location'); // DEBUGGING
  console.log(user); // DEBUGGING
}

// bind custom events //
Events.on('addLocation', addLocation);
Events.on('removeLocation', removeLocation);
Events.on('refreshLocations', refreshLocations);