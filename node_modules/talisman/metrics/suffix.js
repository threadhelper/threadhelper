"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.similarity = similarity;
exports.distance = distance;
/**
 * Talisman metrics/suffix
 * ========================
 *
 * Function computing the Suffix distance/similarity. This is basically the
 * ratio of the length of the common suffix to the length of the shortest
 * sequence.
 *
 * [Tags]: metric, string metric.
 */

/**
 * Suffix similarity.
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

  var la = a.length,
      lb = b.length;

  for (; i < la; i++) {
    if (a[la - i - 1] !== b[lb - i - 1]) break;
  }

  return i / la;
}

/**
 * Suffix distance.
 *
 * @param  {array|string} a - First sequence.
 * @param  {array|string} b - Second sequence.
 * @param  {number}         - Distance between 0 & 1.
 */
function distance(a, b) {
  return 1 - similarity(a, b);
}