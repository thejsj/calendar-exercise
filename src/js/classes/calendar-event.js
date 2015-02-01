'use strict';
var _ = require('lodash');

var getEventId = (function () {
  var count = 0;
  return function () {
    return count += 1;
  };
}());

var CalendarEvent = function (calendarEventObject) {
  // Data Properties
  this.id = getEventId();
  this.start = calendarEventObject.start;
  this.end = calendarEventObject.end;
  this.duration = this.end - this.start;
  // Display Properties
  this.width = null;
  this.x = null;
  this.xEnd = null;
  // Nodes
  this.intersectingEvents = [];
  this.cliques = [];
};

CalendarEvent.prototype.getIntersectingEvents = function (allEvents) {
  this.intersectingEvents = this._getIntersectingEvents(allEvents);
};

CalendarEvent.prototype.setMaxNumberOfIntersectingEvents = function (allCliques) {
  var allEventCliquesLengths = _.pluck(_.filter(allCliques, function (clique) {
    return _.contains(clique.nodes, this);
  }.bind(this)), 'length');
  this.maxNumberOfIntersectingEvents = Math.max.apply(null, allEventCliquesLengths);
};

CalendarEvent.prototype.setWidth = function () {
  var allWidthsFromIntersectingEvents = this._getAllIntersectingWidths();
  var maxNumberOfIntersectingEventsWithLowerOrSameIntersections = this._getNumberOfEventsWithSameOrLowerIntersections();
  this.width = (1 - allWidthsFromIntersectingEvents) / (maxNumberOfIntersectingEventsWithLowerOrSameIntersections);
};

CalendarEvent.prototype._getNumberOfEventsWithSameOrLowerIntersections = function () {
  var allEventCliquesLengths = _.map(this.cliques, function (clique) {
    return _.filter(clique, function (node) {
      return node.maxNumberOfIntersectingEvents <= this.maxNumberOfIntersectingEvents;
    }.bind(this));
  }.bind(this));
  allEventCliquesLengths = _.pluck(allEventCliquesLengths, 'length');
  return Math.max.apply(null, allEventCliquesLengths);
};

CalendarEvent.prototype._getAllIntersectingWidths = function () {
  return _.reduce(this.intersectingEvents, function (memo, calendarEvent) {
    if (
      (calendarEvent.width !== null) &&
      (calendarEvent.maxNumberOfIntersectingEvents !== this.maxNumberOfIntersectingEvents)
    ) {
      memo += calendarEvent.width;
    }
    return memo;
  }.bind(this), 0);
};

CalendarEvent.prototype._getIntersectingEvents = function (allEvents) {
  var intersectingEvents = [];
  var eventsIntersect = function (firstEvent, secondEvent) {
    if (
      (secondEvent.start <= firstEvent.start && firstEvent.start < secondEvent.end) ||
      (secondEvent.start < firstEvent.end && firstEvent.end <= secondEvent.end) ||
      (firstEvent.start <= secondEvent.start && secondEvent.end <= firstEvent.end)
    ) {
      return true;
    }
    return false;
  };
  allEvents.forEach(function (calendarEvent) {
    if (
      (calendarEvent !== this) &&
      (eventsIntersect(this, calendarEvent))
    ) {
      intersectingEvents.push(calendarEvent);
    }
  }.bind(this));
  return intersectingEvents;
};

module.exports = CalendarEvent;