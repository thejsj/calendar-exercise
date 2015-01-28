/*global describe:true, it:true */
/*jshint node:true */
'use strict';

var should = require('should');
var CalendarEventCollection = require('../src/js/calendar-event-collection');

describe('CalendarEventCollection', function () {

  describe('Event Collision', function () {

    describe('setWidth', function () {

      it('should set all widths to 1 when no conflicts are found', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 30, end: 150},
          {start: 540, end: 600},
          {start: 610, end: 670}
        ]);
        eventCollection.events.length.should.equal(3);
        eventCollection.events[0].width.should.equal(1);
        eventCollection.events[1].width.should.equal(1);
        eventCollection.events[2].width.should.equal(1);
      });

      it('should set all widths to 0.5 when one conflict is found', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 30, end: 150},
          {start: 540, end: 600},
          {start: 590, end: 620},
          {start: 610, end: 670}
        ]);
        eventCollection.events[0].width.should.equal(1);
        eventCollection.events[1].width.should.equal(0.5);
        eventCollection.events[2].width.should.equal(0.5);
        eventCollection.events[3].width.should.equal(0.5);
      });

      it('should set all widths to 0.33 when two conflicts are found', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 30, end: 150},
          {start: 540, end: 600},
          {start: 590, end: 620},
          {start: 570, end: 650},
          {start: 610, end: 670}
        ]);
        eventCollection.events[0].width.should.equal(1);
        eventCollection.events[1].width.should.equal(1 / 3);
        eventCollection.events[2].width.should.equal(1 / 3);
        eventCollection.events[3].width.should.equal(1 / 3);
        eventCollection.events[4].width.should.equal(1 / 3);
      });
    });

    describe('setX', function () {

      it('should set all x values to 0 when no conflicts are found', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 30, end: 150},
          {start: 540, end: 600},
          {start: 610, end: 670}
        ]);
        eventCollection.events[0].x.should.equal(0);
        eventCollection.events[1].x.should.equal(0);
        eventCollection.events[2].x.should.equal(0);
      });

      it('should set x to 0 and 0.5 when one conflict is found', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 30, end: 150},
          {start: 540, end: 600},
          {start: 590, end: 620},
          {start: 610, end: 670}
        ]);
        eventCollection.events[0].x.should.equal(0);
        eventCollection.events[1].x.should.equal(0);
        eventCollection.events[2].x.should.equal(0.5);
        eventCollection.events[3].x.should.equal(0);
      });

      it('should set x to 0, 0.33, and 0.66 when two conflicts are found', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 30, end: 150},
          {start: 540, end: 600},
          {start: 590, end: 620},
          {start: 570, end: 650},
          {start: 610, end: 670}
        ]);
        eventCollection.events[0].x.should.equal(0);
        eventCollection.events[1].x.should.equal(0);
        eventCollection.events[2].x.should.equal(1 / 3);
        eventCollection.events[3].x.should.equal(1 / 3 * 2);
        eventCollection.events[4].x.should.equal(0);
      });
    });

  });

});