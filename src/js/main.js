'use strict';
var React = require('react');

var CalendarEventCollection = require('./classes/calendar-event-collection');
var CalendarView = require('./views/calendar-view');

(function () {
  window.layOutDay = function (events) {
    var eventCollection = new CalendarEventCollection(events);
    React.render(
      <CalendarView eventCollection={ eventCollection } />,
      document.getElementById('container')
    );
  };
}());

layOutDay([
  {start: 30, end: 150},
  {start: 540, end: 600},
  {start: 560, end: 620},
  {start: 560, end: 620},
  {start: 540, end: 610},
  {start: 140, end: 670},
  {start: 560, end: 620},
  {start: 610, end: 670},
  {start: 610, end: 670},
  {start: 610, end: 670},
  {start: 610, end: 670},
  {start: 610, end: 670},
]);