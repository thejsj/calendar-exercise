'use strict';
var CalenderEvent = require('./calendar-event');

var CalendarEventCollection = function (initalEvents) {
  this.events = [];
  this._addEvents(initalEvents);
};

CalendarEventCollection.prototype._setEventsWidth = function () {
  this.events.forEach(function (event) {
    event.width = 1;
  });
};

CalendarEventCollection.prototype._addEvents = function (eventList) {
  for (var i = 0; i < eventList.length; i += 1) {
    this.events.push(new CalenderEvent(
      eventList[i].start,
      eventList[i].end
    ));
  }
  this._setEventsWidth();
};

CalendarEventCollection.prototype.update = function (eventList) {
  this._addEvents(eventList);
};

module.exports = CalendarEventCollection;