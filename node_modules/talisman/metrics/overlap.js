"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = overlap;
/**
 * Talisman metrics/overlap
 * =========================
 *
 * Function computing the overlap coefficient.
 *
 * [Reference]: https://en.wikipedia.org/wiki/Overlap_coefficient
 *
 * [Tags]: metric, string metric.
 */

/**
 * Global sets used by the overlap function. This way, we don't need to
 * create objects when computing the coefficient.
 */
var A = new Set(),
    B = new Set();

/**
 * Function returning the overlap coefficient between two sequences.
 *
 * @param  {mixed}  a     - The first sequence.
 * @param  {mixed}  b     - The second sequence.
 * @return {number}       - The overlap coefficient between a & b.
 */
function overlap(a, b) {
  if (a === b) return 1;

  if (!a || !b) return 0;

  A.clear();
  B.clear();

  for (var i = 0, l = a.length; i < l; i++) {
    A.add(a[i]);
  }for (var _i = 0, _l = b.length; _i < _l; _i++) {
    B.add(b[_i]);
  }var tmp = void 0;

  // Let's find the shortest set
  if (A.size > B.size) {
    tmp = A;
    A = B;
    B = tmp;
  }

  // Computing intersection of both sets
  var I = 0;

  A.forEach(function (item) {
    if (B.has(item)) I++;
  });

  return I / A.size;
}
module.exports = exports["default"];