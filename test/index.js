/*global describe:true, it:true */
/*jshint node:true */
'use strict';

var should = require('should');
var CalendarEventCollection = require('../src/js/classes/calendar-event-collection');

describe('CalendarEventCollection', function () {

  describe('Event Collision', function () {

    describe('setWidth', function () {

      it('should set all widths to 1 when events border each other', function () {
         var eventCollection = new CalendarEventCollection([
          {start: 0, end: 350},
          {start: 350, end: 600},
          {start: 600, end: 720}
        ]);
        eventCollection.events.length.should.equal(3);
        eventCollection.events[0].width.should.equal(1);
        eventCollection.events[1].width.should.equal(1);
        eventCollection.events[2].width.should.equal(1);
      });

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
        eventCollection.events[1].width.should.approximately(1 / 3, 0.001);
        eventCollection.events[2].width.should.approximately(1 / 3, 0.001);
        eventCollection.events[3].width.should.approximately(1 / 3, 0.001);
        eventCollection.events[4].width.should.approximately(1 / 3, 0.001);
      });

      it('should set width to 2/3 if there is only one collision', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 0, end: 720},
            {start: 100, end: 200},
            {start: 100, end: 200},
          {start: 300, end: 350}
        ]);
        // console.log(eventCollection.events);
        eventCollection.events[0].width.should.approximately(1 /3, 0.001);
        eventCollection.events[1].width.should.approximately(1 / 3, 0.001);
        eventCollection.events[2].width.should.approximately(1 / 3, 0.001);
        eventCollection.events[3].width.should.approximately(2 / 3, 0.1);
      });

      it('should set width to 1/3 if there is only one collision', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 0, end: 720},
            {start: 100, end: 200},
            {start: 100, end: 200},
            {start: 100, end: 200},
          {start: 300, end: 350},
          {start: 300, end: 350}
        ]);
        eventCollection.events[0].width.should.equal(0.25);
        eventCollection.events[1].width.should.equal(0.25);
        eventCollection.events[2].width.should.equal(0.25);
        eventCollection.events[3].width.should.equal(0.25);
        eventCollection.events[4].width.should.approximately(0.375, 0.1);
        eventCollection.events[5].width.should.approximately(0.375, 0.1);
      });

      it('should allocate width based on previous collisions', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 0, end: 720},
          {start: 30, end: 150},
          {start: 30, end: 150},
          {start: 680, end: 720},
          {start: 680, end: 720},
          {start: 680, end: 720},
          {start: 680, end: 720},
        ]);
        eventCollection.events[0].width.should.equal(0.2);
        eventCollection.events[1].width.should.equal(0.4);
        eventCollection.events[2].width.should.equal(0.4);
        eventCollection.events[3].width.should.equal(0.2);
        eventCollection.events[4].width.should.equal(0.2);
        eventCollection.events[5].width.should.equal(0.2);
        eventCollection.events[6].width.should.equal(0.2);
      });

      it('should allocate width based on previous collisions', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 30, end: 150}, // 100%
          {start: 540, end: 600}, // 33%
          {start: 570, end: 620}, // 33%
          {start: 590, end: 650}, // 33%
          {start: 620, end: 670} // 66%
        ]);
        eventCollection.events[0].width.should.equal(1);
        eventCollection.events[1].width.should.approximately(1 / 3, 0.0001);
        eventCollection.events[2].width.should.approximately(1 / 3, 0.0001);
        eventCollection.events[3].width.should.approximately(1 / 3, 0.0001);
        eventCollection.events[4].width.should.approximately(2 / 3, 0.000001);
      });
    });

    xdescribe('setX', function () {

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
          {start: 30, end: 150}, // 0
            {start: 540, end: 600},
            {start: 570, end: 650},
            {start: 590, end: 620},
          {start: 620, end: 670}
        ]);
        eventCollection.events[0].x.should.equal(0);
        eventCollection.events[1].x.should.equal(1 / 3);
        eventCollection.events[2].x.should.equal(0);
        eventCollection.events[3].x.should.equal(2 / 3);
        eventCollection.events[4].x.should.approximately(1 / 3, 0.00001);
      });

      it('should set width to 2/3 if there is only one collision', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 0, end: 720},
            {start: 100, end: 200},
            {start: 100, end: 200},
          {start: 300, end: 350}
        ]);
        eventCollection.events[0].x.should.equal(0);
        eventCollection.events[1].x.should.approximately(1 / 3, 0.001);
        eventCollection.events[2].x.should.equal(2 / 3);
        eventCollection.events[3].x.should.approximately(1 / 3, 0.001);
      });

      it('should set width to 1/3 if there is only one collision', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 0, end: 720},
            {start: 100, end: 200},
            {start: 100, end: 200},
            {start: 100, end: 200},
          {start: 300, end: 350},
          {start: 300, end: 350}
        ]);
        eventCollection.events[0].x.should.equal(0);
        eventCollection.events[1].x.should.equal(0.25);
        eventCollection.events[2].x.should.equal(0.5);
        eventCollection.events[3].x.should.equal(0.75);
        eventCollection.events[4].x.should.approximately(0.25, 0.001);
        eventCollection.events[5].x.should.approximately(0.625, 0.001);
      });

      it('should assign the x values correctly with 3 events', function () {
        var eventCollection = new CalendarEventCollection([
          {start: 30, end: 150},
          {start: 540, end: 600},
          {start: 560, end: 620},
          {start: 610, end: 670}
        ]);
        eventCollection.events[0].x.should.equal(0);
        eventCollection.events[1].x.should.equal(0);
        eventCollection.events[2].x.should.equal(0.5);
        eventCollection.events[3].x.should.equal(0);
      });
    });
  });
});