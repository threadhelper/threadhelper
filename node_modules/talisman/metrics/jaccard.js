"use strict";

Object.defineProperty(exports, "__esModule", {
  value: false
});
/**
 * Talisman metrics/jaccard
 * =========================
 *
 * Functions computing the Jaccard distance/similarity.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Jaccard_index
 *
 * [Article]:
 * Jaccard, Paul (1912), "The distribution of the flora in the alpine zone",
 * New Phytologist 11: 37–50
 *
 * [Tags]: metric, string metric.
 */

/**
 * Function returning the Jaccard similarity score between two sequences.
 *
 * @param  {mixed}  a - The first sequence.
 * @param  {mixed}  b - The second sequence.
 * @return {number}   - The Jaccard similarity score between a & b.
 */
function jaccard(a, b) {
  if (a === b) return 1;

  var la = a.length,
      lb = b.length;

  if (!la || !lb) return 0;

  var setA = {},
      setB = {};

  var I = 0,
      sizeA = 0,
      sizeB = 0;

  for (var i = 0; i < la; i++) {
    if (!setA.hasOwnProperty(a[i])) {
      setA[a[i]] = true;
      sizeA++;
    }
  }

  for (var _i = 0; _i < lb; _i++) {
    if (!setB.hasOwnProperty(b[_i])) {
      setB[b[_i]] = true;
      sizeB++;

      if (setA.hasOwnProperty(b[_i])) I++;
    }
  }

  // Size of the union is sum of size of both sets minus intersection
  var U = sizeA + sizeB - I;

  return I / U;
}

/**
 * Jaccard distance is 1 - the Jaccard index.
 */
var distance = function distance(x, y) {
  return 1 - jaccard(x, y);
};

/**
 * Exporting.
 */
exports.default = jaccard;
exports.index = jaccard;
exports.similarity = jaccard;
exports.distance = distance;
module.exports = exports["default"];
exports["default"].index = exports.index;
exports["default"].similarity = exports.similarity;
exports["default"].distance = exports.distance;