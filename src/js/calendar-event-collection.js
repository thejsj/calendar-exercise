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
  var allBusyTimeSlots = this._getNumberOfEventForDay();
  // Sort according to duration
  var _events = this.events.slice();
  _events.sort(function (a, b) {
    if (b.duration === a.duration) {
      // Ascending order
      return a.start - b.start;
    }
    // Descending order
    return b.duration - a.duration;
  });
  // Calculate Max Number of Events
  _events.forEach(function (calendarEvent) {
    calendarEvent.getMaxNumberOfEvents(allBusyTimeSlots);
  });
  var _groupedEvents = _.groupBy(_events, 'maxNumberOfEvents');
  var _sortedKeys = Object.keys(_groupedEvents).sort(function (a, b) {
    return b - a;
  });
  // Go through each group...
  _sortedKeys.forEach(function (eventGroupKey) {
    // Sort all events in this group
    _groupedEvents[eventGroupKey].forEach(function (calendarEvent) {
      var intersectingEvents = calendarEvent._getAllIntersectingSlots(allBusyTimeSlots);
      intersectingEvents.forEach(function (timeSlot) {
        timeSlot.eventsToBeQueueInGroup += 1;
      });
    });
    _groupedEvents[eventGroupKey].forEach(function (calendarEvent) {
      var timeSlot = allBusyTimeSlots[calendarEvent.maxNumberOfEventsIndex];
      var queuedEvents = timeSlot.queuedEvents;
      if (timeSlot.spaceAvailable !== 1) {
        var numberOfEventsInRoud = timeSlot.eventsToBeQueueInGroup;
        calendarEvent.width = (timeSlot.spaceAvailable / numberOfEventsInRoud);
        calendarEvent.x = (1 - timeSlot.spaceAvailable) + (calendarEvent.width * timeSlot.queuedEventsInThisGroup);
      }
      else {
        calendarEvent.width = (timeSlot.spaceAvailable / calendarEvent.maxNumberOfEvents);
        calendarEvent.x = calendarEvent.width * queuedEvents;
      }
      var intersectingEvents = calendarEvent._getAllIntersectingSlots(allBusyTimeSlots);
      intersectingEvents.forEach(function (timeSlot) {
        timeSlot.queuedEvents += 1;
      });
      timeSlot.queuedEventsInThisGroup += 1;
    });
    // Re-set available space for next round
    allBusyTimeSlots.forEach(function (timeSlot) {
      if (timeSlot.queuedEvents > 0) {
        timeSlot.spaceAvailable = timeSlot.spaceAvailable - ((1 / eventGroupKey) * timeSlot.eventsToBeQueueInGroup);
        timeSlot.eventsToBeQueueInGroup = 0;
        timeSlot.queuedEventsInThisGroup = 0;
      }
    });
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
        queuedEvents: 0,
        spaceAvailable: 1,
        queuedEventsInThisGroup: 0,
        eventsToBeQueueInGroup: 0,
        index: allTimeOccupancies.length
      });
    }
    _previousValue = val;
  });
  allTimeOccupancies[allTimeOccupancies.length - 1].end = 720;
  return allTimeOccupancies;
};

module.exports = CalendarEventCollection;