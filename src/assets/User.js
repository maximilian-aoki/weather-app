export default class User {
  constructor(locationObjects = [], currentLocIndex = -1) {
    this.locations = locationObjects;
    this.currentLocIndex = currentLocIndex;
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

  getUserTime() {
    const appTimeRaw = new Date();
    this.userTime = appTimeRaw.toISOString().split(':')[0];
  }
}
