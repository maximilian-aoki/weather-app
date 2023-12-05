// import css
import './static/reset.css';
import './static/style.css';

// import modules
import * as Events from './assets/Events';
import WeatherAPI from './assets/WeatherAPI';
import Search from './assets/Search';
import Locations from './assets/Locations';
import User from './assets/User';

// ----------------------- INIT APP ----------------------- //

let user;

if (localStorage.getItem('user')) {
  console.log('getting user from localStorage with time'); // DEBUGGING

  const userInfo = JSON.parse(localStorage.getItem('user'));
  const userTime = localStorage.getItem('time');

  user = new User(userInfo.locations, userInfo.currentLocIndex);

  const timeNowRaw = new Date();
  const timeNow = timeNowRaw.toISOString().split(':')[0];

  console.log(`time now: ${timeNow}\nlast user time: ${userTime}`); // DEBUGGING

  if (timeNow !== userTime && user.locations.length) {
    try {
      refreshLocations();
    } catch (error) {
      console.log(`error on refresh: ${error}`);
    }
  }

  Events.emit('renderLocationList', user);
} else {
  console.log('creating new user'); // DEBUGGING

  user = new User();
  console.log(user); // DEBUGGING
}

// ------------------------- METHODS ------------------------- //

function pushStorage() {
  user.getUserTime();
  localStorage.setItem('time', user.userTime);
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
  Events.emit('renderLocationList', user);

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

// ---------------- bind custom events ---------------- //

Events.on('addLocation', addLocation);
Events.on('removeLocation', removeLocation);
Events.on('refreshLocations', refreshLocations);
