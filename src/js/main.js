'use strict';
var CalendarEventCollection = require('calendar-event-collection');

(function () {
  var eventCollection = new CalendarEventCollection([]);
  // [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
  window.layOutDay = function (events) {
    eventCollection.update(events);
  };
}());
