"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bag;
/**
 * Talisman metrics/bag
 * =====================
 *
 * Function computing the bag distance which works likewise which is the max
 * of the difference of multiset a & multiset b and the difference of
 * multiset b & multiset a.
 *
 * [Reference]:
 * http://www-db.disi.unibo.it/research/papers/SPIRE02.pdf
 *
 * [Article]:
 * String Matching with Metric Trees Using an Approximate Distance.
 * Ilaria Bartolini, Paolo Ciaccia, and Marco Patella.
 *
 * [Tags]: metric, string metric.
 */

/**
 * Function returning the bag distance.
 *
 * @param  {mixed}  a - The first sequence.
 * @param  {mixed}  b - The second sequence.
 * @return {number}   - The bag distance.
 */
function bag(a, b) {
  if (a === b) return 0;

  var ma = Object.create(null),
      mb = Object.create(null);

  var da = a.length,
      db = b.length;

  if (!da) return db;
  if (!db) return da;

  var longest = Math.max(da, db);

  for (var i = 0; i < longest; i++) {
    if (i < da) {
      var value = a[i];

      if (!ma[value]) ma[value] = 0;
      ma[value]++;
    }

    if (i < db) {
      var _value = b[i];

      if (!mb[_value]) mb[_value] = 0;
      mb[_value]++;
    }
  }

  for (var k in ma) {
    if (mb[k]) da -= Math.min(ma[k], mb[k]);
  }

  for (var _k in mb) {
    if (ma[_k]) db -= Math.min(mb[_k], ma[_k]);
  }

  return Math.max(da, db);
}
module.exports = exports["default"];