'use strict';
var React = require('react');
var CalendarEventCollection = require('./classes/calendar-event-collection');
var CalendarView = require('./views/calendar-view');

(function () {
  window.layOutDay = function (events) {
    console.log(events);
    var eventCollection = new CalendarEventCollection(events);
    React.render(
      <CalendarView eventCollection={ eventCollection } />,
      document.getElementById('container')
    );
  };
}());

window.layouts = [
  [
    {start: 30, end: 150},
    {start: 540, end: 600},
    {start: 560, end: 620},
    {start: 610, end: 670}
  ],
  [
    {start: 30, end: 150},
    {start: 540, end: 600},
    {start: 590, end: 620},
    {start: 570, end: 650},
    {start: 610, end: 670}
  ],
  [
    {start: 30, end: 150},
    {start: 30, end: 100},
    {start: 0, end: 720},
    {start: 510, end: 720},
    {start: 540, end: 600},
    {start: 520, end: 640},
    {start: 570, end: 650},
    {start: 590, end: 620},
    {start: 610, end: 670},
    {start: 680, end: 720}
  ],
  [
    {start: 30, end: 150},
    {start: 540, end: 600},
    {start: 570, end: 650},
    {start: 590, end: 620},
    {start: 620, end: 670}
  ],
  [
    {start: 0, end: 720},
    {start: 100, end: 200},
    {start: 100, end: 200},
    {start: 100, end: 200},
    {start: 300, end: 350},
    {start: 300, end: 350}
  ]
];
window.layOutDay(layouts[0]);

window.layout = function (index) {
  index = (index === undefined ? Math.floor(Math.random() * layouts.length) : index);
  console.log('index', index);
  console.log(layouts[index]);
  window.layOutDay(layouts[index]);
};
