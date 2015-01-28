'use strict';
var _ = require('lodash');
var CalenderEvent = require('./calendar-event');

var CalendarEventCollection = function (initalEvents) {
  this.events = [];
  this._addEvents(initalEvents);
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

CalendarEventCollection.prototype._setEventsWidth = function () {
  var allBusyTimes = this._getNumberOfEventForDay();
  this.events.forEach(function (calendarEvent) {
    calendarEvent.setWidth(allBusyTimes);
  });
};

CalendarEventCollection.prototype._getNumberOfEvents = function (allTimeOccupancies, property, closestTime) {
  for (var i = 0; i < allTimeOccupancies.length; i += 1) {
    if (allTimeOccupancies[i][property] === closestTime) {
      return allTimeOccupancies[i].numberOfEvents;
    }
  }
};

CalendarEventCollection.prototype._getNumberOfEventForDay = function () {
  var allTimeOccupanciesPerMinute = {};
  var allTimeOccupancies = [];
  _.forEach(_.range(720), function (val) {
    allTimeOccupanciesPerMinute[val] = 0;
  });
  // For every event
  this.events.forEach(function (calendarEvent) {
    for (var i = calendarEvent.start; i < calendarEvent.end; i += 1) {
      allTimeOccupanciesPerMinute[i] += 1;
    }
  }.bind(this));
  var _previousValue = null;
  _.forEach(allTimeOccupanciesPerMinute, function (val, i) {
    if (val !== _previousValue) {
      if (_previousValue !== null) {
        allTimeOccupancies[allTimeOccupancies.length - 1].end = i;
      }
      allTimeOccupancies.push({
        start: i,
        events: val,
      });
    }
    if (i === allTimeOccupanciesPerMinute.length - 1) {
      allTimeOccupancies[allTimeOccupancies.length - 1].end = i;
    }
    _previousValue = val;
  });
  return allTimeOccupancies;
};

CalendarEventCollection.prototype.update = function (eventList) {
  this._addEvents(eventList);
  return this;
};

module.exports = CalendarEventCollection;