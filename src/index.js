// import css
import './static/reset.css';
import './static/style.css';

// import modules
import * as Events from './assets/Events';
import WeatherAPI from './assets/WeatherAPI';
import Search from './assets/Search';
import Locations from './assets/Locations';
import Hourly from './assets/Hourly';
import User from './assets/User';

// import images
import LoadSpinner from './static/images/spinner.gif';

// cache loader
const loadSpinner = document.querySelector('.loader');
loadSpinner.src = LoadSpinner;

// ----------------------- INIT APP ----------------------- //

let user;

if (localStorage.getItem('user')) {
  console.log('getting user from localStorage with time'); // DEBUGGING

  const userInfo = JSON.parse(localStorage.getItem('user'));
  const userTime = localStorage.getItem('time');

  user = new User(
    userInfo.locations,
    userInfo.currentLocIndex,
    userInfo.currentDeg,
  );

  const timeNowRaw = new Date();
  const timeNow = timeNowRaw.toISOString().split(':')[0];

  console.log(`time now: ${timeNow}\nlast user time: ${userTime}`); // DEBUGGING

  if (timeNow !== userTime && user.locations.length) {
    try {
      refreshLocations();
    } catch (error) {
      console.log(`error on refresh: ${error}`);
      renderAll();
    }
  } else {
    renderAll();
    console.log(user); // DEBUGGING
  }
} else {
  console.log('creating new user'); // DEBUGGING

  user = new User();
  Events.emit('renderLocationList', user);
  Events.emit('renderDegrees', user.currentDeg);

  console.log(user); // DEBUGGING
}

// ------------------------- METHODS ------------------------- //

function pushStorage() {
  user.getUserTime();
  localStorage.setItem('time', user.userTime);
  localStorage.setItem('user', JSON.stringify(user));
}

function renderAll() {
  Events.emit('renderLocationList', user);
  Events.emit('showActiveLocation', user);
  Events.emit('renderLocationWeather', user);
  Events.emit('renderDegrees', user.currentDeg);
}

async function refreshLocations() {
  console.log('starting refresh'); // DEBUGGING

  // activate loader, send batch calls to WeatherAPI for refresh //
  loadSpinner.classList.add('active');
  const locationPromises = user.locations.map((location) =>
    WeatherAPI.getLocationData(location.name),
  );

  user.locations = await Promise.all(locationPromises);
  loadSpinner.classList.remove('active');

  pushStorage();
  renderAll();

  console.log('finished refresh'); // DEBUGGING
  console.log(user); // DEBUGGING
}

async function addLocation(locationStr) {
  // activate loader, send single call to WeatherAPI for adding location //
  loadSpinner.classList.add('active');
  const newLocation = await WeatherAPI.getLocationData(locationStr);
  loadSpinner.classList.remove('active');

  user.addLocation(newLocation);
  user.currentLocIndex = user.locations.length - 1;

  pushStorage();
  renderAll();

  console.log('adding location'); // DEBUGGING
  console.log(user); // DEBUGGING
}

function removeLocation(index) {
  user.removeLocation(index);
  user.currentLocIndex =
    index <= user.currentLocIndex
      ? (user.currentLocIndex -= 1)
      : user.currentLocIndex;

  // very roughly correcting current loc index if
  // user deletes first location while it is selected with others present
  if (user.currentLocIndex < 0 && Boolean(user.locations.length)) {
    user.currentLocIndex = 0;
  }

  pushStorage();
  renderAll();

  console.log('removing location'); // DEBUGGING
  console.log(user); // DEBUGGING
}

function moveToLocation(index) {
  if (index !== user.currentLocIndex) {
    user.currentLocIndex = index;

    pushStorage();
    Events.emit('showActiveLocation', user);
    Events.emit('renderLocationWeather', user);

    console.log(`switched location to index ${index}`); // DEBUGGING
    console.log(user); // DEBUGGING
  }
}

function toggleDegrees(deg) {
  user.currentDeg = deg;

  pushStorage();
  Events.emit('showActiveLocation', user);
  Events.emit('renderLocationWeather', user);

  console.log(`toggled degrees to ${deg}`); // DEBUGGING
  console.log(user); // DEBUGGING
}

// ---------------- bind custom events ---------------- //

Events.on('refreshLocations', refreshLocations);
Events.on('addLocation', addLocation);
Events.on('removeLocation', removeLocation);
Events.on('moveToLocation', moveToLocation);
Events.on('toggleDegrees', toggleDegrees);
