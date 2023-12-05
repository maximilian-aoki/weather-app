export default class User {
  constructor(locationObjects = [], currentLocIndex = -1) {
    this.locations = locationObjects;
    this.currentLocIndex = currentLocIndex;

    this.getAppTime();
  }

  // PUBLIC METHODS //
  addLocation(processedLocObj) {
    this.locations.push(processedLocObj);
  }

  removeLocation(removalIndex) {
    this.locations.splice(removalIndex, 1);
  }

  refreshLocations(newLocationArr) {
    this.locations = newLocationArr;
  }

  getAppTime() {
    const appTimeRaw = new Date();
    this.currentAppTime = appTimeRaw.toISOString().split(':')[0];
  }
}
