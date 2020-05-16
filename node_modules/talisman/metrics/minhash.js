'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.similarity = similarity;
exports.distance = distance;
/**
 * Talisman metrics/minhash
 * =========================
 *
 * Function computing the similarity/distance between MinHash signatures.
 */

/**
 * Function returning the similarity between two MinHash signatures.
 *
 * @param  {mixed}  a - The first signature.
 * @param  {mixed}  b - The second signature.
 * @return {number}   - The similarity between a & b.
 *
 * @throws {Error} The function expects signatures of same length.
 */
function similarity(a, b) {
  if (a.length !== b.length) throw Error('talisman/metrics/distance/minhash: the given signatures are not of same length.');

  var L = a.length;

  var s = 0;

  for (var i = 0; i < L; i++) {
    if (a[i] === b[i]) s++;
  }

  return s / L;
}

/**
 * MinHash distance is simply 1 - similarity.
 */
function distance(a, b) {
  return 1 - similarity(a, b);
}