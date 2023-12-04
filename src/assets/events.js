const events = {};

// create a new function for a new or existing event name (doesn’t check duplicates)
function on(eventName, fn) {
  events[eventName] = events[eventName] || [];
  events[eventName].push(fn);
}

// remove an event name’s associated function (one instance in this e.g.)
function off(eventName, fn) {
  if (events[eventName]) {
    for (let i = 0; i < events[eventName].length; i += 1) {
      if (events[eventName][i] === fn) {
        events[eventName].splice(i, 1);
        break;
      }
    }
  }
}

// emit a piece of data to all functions on one event name
function emit(eventName, data) {
  if (events[eventName]) {
    events[eventName].forEach((fn) => {
      fn(data);
    });
  }
}

export { on, off, emit };
