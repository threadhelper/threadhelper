'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.default = hamming;
exports.normalizedDistance = normalizedDistance;
exports.normalizedSimilarity = normalizedSimilarity;
exports.bitwise = bitwise;
/**
 * Talisman metrics/hamming
 * =========================
 *
 * Function computing the Hamming distance.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Hamming_distance
 *
 * [Article]:
 * Hamming, Richard W. (1950), "Error detecting and error correcting codes",
 * Bell System Technical Journal 29 (2): 147–160
 *
 * [Tags]: metric, vector space, string metric.
 */

/**
 * Function returning the Hamming distance between two sequences.
 *
 * @param  {mixed}  a - The first sequence to process.
 * @param  {mixed}  b - The second sequence to process.
 * @return {number}   - The Hamming distance between a & b.
 *
 * @throws {Error} The function expects sequences of equal length.
 */
function hamming(a, b) {

  if (a === b) return 0;

  if (a.length !== b.length) throw Error('talisman/metrics/distance/hamming: given sequences are not of equal length.');

  var distance = 0;

  for (var i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) distance++;
  }

  return distance;
}

/**
 * Function returning the normalized Hamming distance between two sequences.
 *
 * @param  {mixed}  a - The first sequence to process.
 * @param  {mixed}  b - The second sequence to process.
 * @return {number}   - The normalized Hamming distance between a & b.
 */
function normalizedDistance(a, b) {

  if (a === b) return 0;

  if (a.length > b.length) {
    ;

    var _ref = [b, a];
    a = _ref[0];
    b = _ref[1];
  }var distance = b.length - a.length;

  for (var i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) distance++;
  }

  return distance / b.length;
}

/**
 * Function returning the normalized Hamming similarity between two sequences.
 *
 * @param  {mixed}  a - The first sequence to process.
 * @param  {mixed}  b - The second sequence to process.
 * @return {number}   - The normalized Hamming similarity between a & b.
 */
function normalizedSimilarity(a, b) {
  return 1 - normalizedDistance(a, b);
}

/**
 * Function returning the Hamming distance between two numbers using only
 * bitwise operators.
 *
 * Note that this implementation uses a loop in O(k) time, k being the number
 * of bits set. There are other implementations possible using arithmetics but
 * litterature seems to agree that this does not speedup the computation and
 * since JavaScript does not have a direct access to processor low-level ops
 * such as popcount, this should be the most performant we can do now.
 *
 * @param  {mixed}  a - The first number to process.
 * @param  {mixed}  b - The second number to process.
 * @return {number}   - The Hamming distance between a & b.
 */
function bitwise(a, b) {
  var d = 0,
      xor = a ^ b;

  while (xor) {
    d++;
    xor &= xor - 1;
  }

  return d;
}
module.exports = exports['default'];
exports['default'].normalizedDistance = exports.normalizedDistance;
exports['default'].normalizedSimilarity = exports.normalizedSimilarity;
exports['default'].bitwise = exports.bitwise;