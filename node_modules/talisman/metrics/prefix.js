"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.similarity = similarity;
exports.distance = distance;
/**
 * Talisman metrics/prefix
 * ========================
 *
 * Function computing the Prefix distance/similarity. This is basically the
 * ratio of the length of the common prefix to the length of the shortest
 * sequence.
 *
 * [Tags]: metric, string metric.
 */

/**
 * Prefix similarity.
 *
 * @param  {array|string} a - First sequence.
 * @param  {array|string} b - Second sequence.
 * @param  {number}         - Similarity between 0 & 1.
 */
function similarity(a, b) {
  if (a === b) return 1;

  if (!a.length || !b.length) return 0;

  if (a.length > b.length) {
    ;

    var _ref = [b, a];
    a = _ref[0];
    b = _ref[1];
  }var i = 0;

  var l = a.length;

  for (; i < l; i++) {
    if (a[i] !== b[i]) break;
  }

  return i / l;
}

/**
 * Prefix distance.
 *
 * @param  {array|string} a - First sequence.
 * @param  {array|string} b - Second sequence.
 * @param  {number}         - Distance between 0 & 1.
 */
function distance(a, b) {
  return 1 - similarity(a, b);
}