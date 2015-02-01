'use strict';
var _ = require('lodash');

var hashCode = function (str) {
  var hash = 0, i, _char;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    _char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + _char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

var memoizeHasher = function (potentialClique, remainingNodes, skipNodes, depth) {
  var potentialCliqueIds = _.pluck(potentialClique, 'id');
  var remainingNodesIds = _.pluck(remainingNodes, 'id');
  var skipNodesIds = _.pluck(skipNodes, 'id');
  var JSONString = JSON.stringify([
    potentialCliqueIds,
    remainingNodesIds,
    skipNodesIds,
    depth
  ]);
  return hashCode(JSONString);
};

module.exports = memoizeHasher;