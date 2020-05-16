'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.similarity = similarity;
exports.distance = distance;

var _suffixArray = require('mnemonist/suffix-array');

/**
 * LCS similarity.
 *
 * @param  {array|string} a - First sequence.
 * @param  {array|string} b - Second sequence.
 * @param  {number}         - Similarity between 0 & 1.
 */
function similarity(a, b) {
  if (a === b) return 1;

  var la = a.length,
      lb = b.length;

  if (!la || !lb) return 0;

  var gst = new _suffixArray.GeneralizedSuffixArray([a, b]),
      lcs = gst.longestCommonSubsequence().length;

  return lcs / Math.max(la, lb);
}

/**
 * LCS distance.
 *
 * @param  {array|string} a - First sequence.
 * @param  {array|string} b - Second sequence.
 * @param  {number}         - Distance between 0 & 1.
 */
/**
 * Talisman metrics/lcs
 * =====================
 *
 * Function computing the Longest Common Subsequence distance/similarity.
 *
 * [Tags]: metric, string metric.
 */
function distance(a, b) {
  return 1 - similarity(a, b);
}