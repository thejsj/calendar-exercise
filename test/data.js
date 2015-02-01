'use strict';

var CalendarEventCollection = require('../src/js/classes/calendar-event-collection');

console.log('No Intersections');
var collection = new CalendarEventCollection([
  {start: 0, end: 350},
  {start: 350, end: 600},
  {start: 600, end: 720}
]);

console.log('Intersections');
var _collection = new CalendarEventCollection([
  {start: 0, end: 350},
  {start: 350, end: 610},
  {start: 600, end: 720}
]);
console.log(collection.events);
console.log(_collection.events);