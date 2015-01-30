'use strict';

var CalendarEvent = function (start, end) {
  this.start = start;
  this.end = end;
  this.duration = this.end - this.start;
  this.width = null;
  this.x = null;
};

CalendarEvent.prototype.getMaxNumberOfEvents = function (allBusyTimeSlots) {
  this.maxNumberOfEvents = 0;
  this.maxNumberOfEventsIndex = null;
  var allIntersectingSlots = this._getAllIntersectingSlots(allBusyTimeSlots);
  allIntersectingSlots.forEach(function (timeSlot) {
    if (timeSlot.events > this.maxNumberOfEvents) {
      this.maxNumberOfEvents = timeSlot.events;
      this.maxNumberOfEventsIndex = timeSlot.index;
    }
  }.bind(this));
};

CalendarEvent.prototype._getAllIntersectingSlots = function (allBusyTimeSlots) {
  var slots = [];
  for (var i = 0; i < allBusyTimeSlots.length; i += 1) {
    var timeSlot = allBusyTimeSlots[i];
    // (timeSlot.start <= this.start) && (this.start <= timeSlot.end) ||
    // (timeSlot.start <= this.end) && (this.end <= timeSlot.end)
    if ((this.start <= timeSlot.start) && (timeSlot.end <= this.end)) {
      slots.push(timeSlot);
    }
  }
  return slots;
};

CalendarEvent.prototype.setWidth = function (allBusyTimeSlots) {
  this.width = (1 / this.maxNumberOfEvents);
  if (allBusyTimeSlots[this.maxNumberOfEventsIndex] !== undefined) {
    this.x = this.width * allBusyTimeSlots[this.maxNumberOfEventsIndex].queuedEvents;
  }
};

module.exports = CalendarEvent;