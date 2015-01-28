'use strict';

var CalendarEvent = function (start, end) {
  this.start = start;
  this.end = end;
  this.width = null;
  this.x = null;
};

CalendarEvent.prototype.setWidth = function (allBusyTimeSlots) {
  var maxNumberOfEvents = 0, maxNumberOfEventsIndex = null;
  for (var i = 0; i < allBusyTimeSlots.length; i += 1) {
    var timeSlot = allBusyTimeSlots[i];
    if (this.start <= timeSlot.start && timeSlot.end <= this.end) {
      if (timeSlot.events > maxNumberOfEvents) {
        maxNumberOfEvents = timeSlot.events;
        maxNumberOfEventsIndex = i + '';
      }
    }
  }
  this.width = 1 / maxNumberOfEvents;
  this.x = this.width * allBusyTimeSlots[maxNumberOfEventsIndex].queuedEvents;
  return maxNumberOfEventsIndex;
};

module.exports = CalendarEvent;