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
  this.events.forEach(function (event) {
    // Create an object with the number of events at any point in time
    event.width = 1;
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
  var allTimeOccupancies = [{
    start: 0, // 9:00 a.m.
    end: 720, // 9:00 p.m.
    numberOfEvents: 0
  }];
  // For every event
  this.events.forEach(function (calendarEvent) {
    var allStartTimes = _.pluck(allTimeOccupancies, 'start');
    var allEndTimes = _.pluck(allTimeOccupancies, 'end');
    /**
     * Find the start time that is less than && closes to start time
     * Find the end time that is more than && closes to end time
     */
    var closestPastStartTime = Math.max(allStartTimes.filter(function (timeInMinutes) {
      return timeInMinutes < calendarEvent.start;
    }));
    var closestFutureEndTime = Math.min(allEndTimes.filter(function (timeInMinutes) {
      return timeInMinutes > calendarEvent.end;
    }));
    // Get # of events at that start/end time
    var numberOfEventsAtStart = this._getNumberOfEvents(allTimeOccupancies, 'start', closestPastStartTime);
    var numberOfEventsAtEnd = this._getNumberOfEvents(allTimeOccupancies, 'end', closestFutureEndTime);
    // Add new start time at event start time and increase number of events by 1
    // Add a new end time at event end and increase number of events by 1
    console.log('closestPastStartTime', closestPastStartTime);
    console.log('closestFutureEndTime', closestFutureEndTime);
    console.log(calendarEvent);
  }.bind(this));
  return allTimeOccupancies;
};

CalendarEventCollection.prototype.update = function (eventList) {
  this._addEvents(eventList);
};

module.exports = CalendarEventCollection;