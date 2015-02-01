'use strict';
var _ = require('lodash');
var CalenderEvent = require('./calendar-event');

var CalendarEventCollection = function (initalEvents) {
  this.events = initalEvents.map(function (calendarEventObject) {
    return new CalenderEvent(calendarEventObject);
  });
  // 1. Generate Graph
  this.generateGraph();
  // 2. Get unique number of intersections
  this.uniqueNumberOfIntersections = this.getUniqueNumberOfIntersections();
  // 3. Find all cliques in graph (in order to get max number of intersections)
  this.cliques = this.getAllCliques();
  this.setMaxNumberOfIntersectingEvents();
  // 4. Assign width, based on (1 - allWidths) maxNumberOfIntersections
  this.setWidth();
  // 5. Recursively Assign `x`
};

CalendarEventCollection.prototype.setMaxNumberOfIntersectingEvents = function () {
  _.invoke(this.events, 'setMaxNumberOfIntersectingEvents', this.cliques);
};

CalendarEventCollection.prototype.generateGraph = function () {
  _.invoke(this.events, 'getIntersectingEvents', this.events);
};

CalendarEventCollection.prototype.getUniqueNumberOfIntersections = function () {
  return _.unique(_.pluck(this.events), 'intersectingEvents.length');
};

CalendarEventCollection.prototype.getAllCliques = function () {
  var cliques = [];
  // http://stackoverflow.com/questions/143140/bron-kerbosch-algorithm-for-clique-finding
  var findCliques = function (potentialClique, remainingNodes, skipNodes, depth) {
    potentialClique = potentialClique || [];
    remainingNodes = remainingNodes || [];
    skipNodes = skipNodes || [];
    depth = depth || 0;
    if (remainingNodes.length === 0 && skipNodes.length === 0) {
      cliques.push({
        nodes: potentialClique,
        length: potentialClique.length
      });
      potentialClique.forEach(function (node) {
        node.cliques.push(potentialClique);
      });
      return;
    }
    _.forEach(remainingNodes, function (node) {
      var newPotentialClique = potentialClique.slice();
      newPotentialClique.push(node);
      var newRemainingNodes = _.filter(skipNodes, function (neighorNode) {
        return _.contains(node.intersectingEvents, neighorNode);
      });
      var newSkipList = _.filter(skipNodes, function (neighorNode) {
        return _.contains(node.intersectingEvents, neighorNode);
      });
      findCliques(newPotentialClique, newRemainingNodes, newSkipList, depth + 1);
      // Done considering this node
      remainingNodes = _.without(node);
      skipNodes.push(node);
    });
  };
  findCliques([], this.events);
  return cliques;
};

CalendarEventCollection.prototype.setWidth = function () {
  var eventsGroupedBy = _.groupBy(this.events, 'maxNumberOfIntersectingEvents');
  var eventGroupKeys = Object.keys(eventsGroupedBy);
  for (var i = (eventGroupKeys.length - 1); i >= 0; i -= 1) {
    var key = eventGroupKeys[i];
    _.invoke(eventsGroupedBy[key], 'setWidth', this.cliques);
  }
};

module.exports = CalendarEventCollection;