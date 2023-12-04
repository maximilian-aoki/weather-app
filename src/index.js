// import css
import './static/reset.css';
import './static/style.css';

// import modules (events optional)
// import * as Events from './assets/events';
import WeatherAPI from './assets/WeatherAPI';

// test
console.log(await WeatherAPI.getLocationData('Iqaluit'));
