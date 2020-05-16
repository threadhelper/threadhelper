'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.distance = exports.similarity = undefined;
exports.default = jaro;

var _vectors = require('../helpers/vectors');

/**
 * Function returning the Jaro score between two sequences.
 *
 * @param  {mixed}  a     - The first sequence.
 * @param  {mixed}  b     - The second sequence.
 * @return {number}       - The Jaro score between a & b.
 */
function jaro(a, b) {

  // Fast break
  if (a === b) return 1;

  var max = void 0,
      min = void 0;

  if (a.length > b.length) {
    max = a;
    min = b;
  } else {
    max = b;
    min = a;
  }

  // Finding matches
  var range = Math.max((max.length / 2 | 0) - 1, 0),
      indexes = (0, _vectors.vec)(min.length, -1),
      flags = (0, _vectors.vec)(max.length, false);

  var matches = 0;

  for (var i = 0, l = min.length; i < l; i++) {
    var character = min[i],
        xi = Math.max(i - range, 0),
        xn = Math.min(i + range + 1, max.length);

    for (var j = xi, _m = xn; j < _m; j++) {
      if (!flags[j] && character === max[j]) {
        indexes[i] = j;
        flags[j] = true;
        matches++;
        break;
      }
    }
  }

  var ms1 = new Array(matches),
      ms2 = new Array(matches);

  var si = void 0;

  si = 0;
  for (var _i = 0, _l = min.length; _i < _l; _i++) {
    if (indexes[_i] !== -1) {
      ms1[si] = min[_i];
      si++;
    }
  }

  si = 0;
  for (var _i2 = 0, _l2 = max.length; _i2 < _l2; _i2++) {
    if (flags[_i2]) {
      ms2[si] = max[_i2];
      si++;
    }
  }

  var transpositions = 0;
  for (var _i3 = 0, _l3 = ms1.length; _i3 < _l3; _i3++) {
    if (ms1[_i3] !== ms2[_i3]) transpositions++;
  }

  // Computing the distance
  if (!matches) return 0;

  var t = transpositions / 2 | 0,
      m = matches;

  return (m / a.length + m / b.length + (m - t) / m) / 3;
}

/**
 * Jaro distance is 1 - the Jaro score.
 */
/**
 * Talisman metrics/jaro
 * ======================
 *
 * Function computing the Jaro score.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance
 *
 * [Articles]:
 * Jaro, M. A. (1989). "Advances in record linkage methodology as applied to
 * the 1985 census of Tampa Florida".
 * Journal of the American Statistical Association 84 (406): 414–20
 *
 * Jaro, M. A. (1995). "Probabilistic linkage of large public health data file".
 * Statistics in Medicine 14 (5–7): 491–8.
 *
 * [Tags]: semimetric, string metric.
 */
var distance = function distance(a, b) {
  return 1 - jaro(a, b);
};

/**
 * Exporting.
 */
exports.similarity = jaro;
exports.distance = distance;
module.exports = exports['default'];
exports['default'].similarity = exports.similarity;
exports['default'].distance = exports.distance;