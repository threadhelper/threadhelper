"use strict";

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.lipns = lipns;
exports.custom = custom;
/**
 * Talisman metrics/mlipns
 * ========================
 *
 * Function computing the Modified Language-Independent Product Name Search
 * similarity (MLIPNS).
 *
 * [Reference]:
 * http://www.sial.iias.spb.su/files/386-386-1-PB.pdf
 *
 * [Article]:
 * Shannaq, Boumedyen A. N. and Victor V. Alexandrov. 2010. "Using Product
 * Similarity for Adding Business." Global Journal of Computer Science and
 * Technology. 10(12). 2-8.
 *
 * [Tags]: metric.
 */

/**
 * Function returning the LIPNS distance between two sequences, which is
 * basically the Hamming distance tolerating strings of different lengths.
 *
 * @param  {mixed}  a - The first sequence to process.
 * @param  {mixed}  b - The second sequence to process.
 * @return {number}   - The LIPNS similarity between a & b.
 */
function lipns(a, b) {

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

  return distance;
}

/**
 * Function returning the MLIPNS similarity between two sequences.
 *
 * @param  {object} settings        - Settings:
 * @param  {number}   threshold     - maximum similarity score below which
 *                                    strings  are considered similar.
 * @param  {number}   maxMismatches - Maximum allowed mismatches.
 * @param  {mixed}  a               - The first sequence to process.
 * @param  {mixed}  b               - The second sequence to process.
 * @return {number}                 - The MLIPNS similarity between a & b.
 */
function custom(settings, a, b) {
  var threshold = settings.threshold,
      maxMismatches = settings.maxMismatches;

  if (a === b) return 1;

  if (!a.length || !b.length) return 0;

  var mismatches = 0,
      distance = lipns(a, b),
      maximumLength = Math.max(a.length, b.length);

  while (mismatches <= maxMismatches) {
    if (maximumLength < 1 || 1 - (maximumLength - distance) / maximumLength <= threshold) return 1;

    mismatches++;
    distance--;
    maximumLength--;
  }

  if (maximumLength < 1) return 1;

  return 0;
}

var mlipns = custom.bind(null, {
  threshold: 0.25,
  maxMismatches: 2
});

exports.default = mlipns;
module.exports = exports["default"];
exports["default"].lipns = exports.lipns;
exports["default"].custom = exports.custom;