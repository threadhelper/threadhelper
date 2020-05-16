'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = canberra;
/**
 * Talisman metrics/canberra
 * ==========================
 *
 * Function computing the Canberra distance.
 *
 * [Reference]: https://en.wikipedia.org/wiki/Canberra_distance
 *
 * [Tags]: metric, vector space.
 */

/**
 * Function returning the Canberra distance between two vectors.
 *
 * @param  {mixed}  a     - The first vector.
 * @param  {mixed}  b     - The second vector.
 * @return {number}       - The Canberra distance between a & b.
 *
 * @throws {Error} The function expects vectors of same dimension.
 */
function canberra(a, b) {
  if (a.length !== b.length) throw Error('talisman/metrics/distance/canberra: the given vectors are not of the same dimension.');

  var distance = 0;

  for (var i = 0, l = a.length; i < l; i++) {
    distance += Math.abs(a[i] - b[i]) / (Math.abs(a[i]) + Math.abs(b[i]));
  }return distance;
}
module.exports = exports['default'];