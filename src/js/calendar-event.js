'use strict';

var CalendarEvent = function (start, end) {
  this.start = start;
  this.end = end;
  this.width = null; // 0 - 1
};

module.exports = CalendarEvent;