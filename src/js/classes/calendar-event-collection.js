'use strict';
var _ = require('lodash');
var CalenderEvent = require('./calendar-event');
var memoizeHash = require('./memoize-hash');

var CalendarEventCollection = function (initalEvents) {
  this.events = initalEvents.map(function (calendarEventObject) {
    return new CalenderEvent(calendarEventObject);
  });
  this.generateGraph();
  this.uniqueNumberOfIntersections = this.getUniqueNumberOfIntersections();
  this.cliques = this.getAllCliques();
  this.setMaxNumberOfIntersectingEvents();
  this.setWidth();
  this.setX();
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
  var cliquesObject = {};
  var findCliquesCount = 0;
  // http://stackoverflow.com/questions/143140/bron-kerbosch-algorithm-for-clique-finding
  var findCliques = _.memoize(function (potentialClique, remainingNodes, skipNodes, depth) {
    findCliquesCount += 1;
    potentialClique = potentialClique || [];
    remainingNodes = remainingNodes || [];
    skipNodes = skipNodes || [];
    depth = depth || 0;
    if (_.size(remainingNodes) === 0 && _.size(skipNodes) === 0) {
      var index = _.sortBy(_.pluck(potentialClique, 'id')).join('-');
      cliquesObject[index] = {
        nodes: potentialClique,
        length: potentialClique.length
      };
      return;
    }
    _.forEach(remainingNodes, function (node) {
      var newPotentialClique = potentialClique.slice();
      newPotentialClique.push(node);
      var newRemainingNodes = _.unique(_.filter(skipNodes, function (neighorNode) {
        return _.contains(node.intersectingEvents, neighorNode);
      }));
      var newSkipList = _.unique(_.filter(skipNodes, function (neighorNode) {
        return _.contains(node.intersectingEvents, neighorNode);
      }));
      findCliques(newPotentialClique, newRemainingNodes, newSkipList, depth + 1);
      // Done considering this node
      remainingNodes = _.without(node);
      skipNodes.push(node);
    });
  }, memoizeHash);
  findCliques([], this.events);
  // Add reference to cliques in all nodes
  var cliques = _.values(cliquesObject);
  _.forEach(cliques, function (clique) {
    _.forEach(clique.nodes, function (node) {
      node.cliques.push(clique.nodes);
    });
  });
  return cliques;
};

CalendarEventCollection.prototype.setWidth = function () {
  this._loopThroughEventsOrderedByNumberOfIntersections(function (calendarEventGroup) {
    _.invoke(calendarEventGroup, 'setWidth', this.cliques);
  }.bind(this));
};

CalendarEventCollection.prototype.setX = function () {
  this._loopThroughEventsOrderedByNumberOfIntersections(function (calendarEventGroup) {
    _.invoke(calendarEventGroup, 'setX', this.cliques);
  }.bind(this));
};

CalendarEventCollection.prototype._loopThroughEventsOrderedByNumberOfIntersections = function (cb) {
  var eventsGroupedBy = _.groupBy(this.events, 'maxNumberOfIntersectingEvents');
  var eventGroupKeys = Object.keys(eventsGroupedBy);
  for (var i = (eventGroupKeys.length - 1); i >= 0; i -= 1) {
    var key = eventGroupKeys[i];
    cb(eventsGroupedBy[key].sort(function (a, b) {
      // Sort by duration
      return b.duration - a.duration;
    }));
  }
};

module.exports = CalendarEventCollection;