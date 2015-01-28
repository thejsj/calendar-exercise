'use strict';
var _ = require('lodash');

var CalendarEvent = function (start, end) {
  this.start = start;
  this.end = end;
  this.width = null; // 0 - 1
};

CalendarEvent.prototype.setWidth = function (allBusyTimes) {
  var allBusyTimesInTimeRange = _.filter(allBusyTimes, function (timeSlot) {
    if (this.start <= timeSlot.start && timeSlot.end <= this.end) {
      return true;
    }
    return false;
  }.bind(this));
  var maxNumberOfEvents = _.reduce(allBusyTimesInTimeRange, function (memo, entry) {
    return Math.max(entry.events, memo);
  }, 0);
  this.width = 1 / maxNumberOfEvents;
  return this;
};

module.exports = CalendarEvent;