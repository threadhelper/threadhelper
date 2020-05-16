"use strict";

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.default = damerauLevenshtein;
exports.limited = limited;
/**
 * Talisman metrics/damerau-levenshtein
 * =====================================
 *
 * Functions computing the Damerau-Levenshtein distance.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance
 *
 * [Original Code]:
 * http://blog.softwx.net/2015/01/optimizing-damerau-levenshtein_15.html
 *
 * [Tags]: metric, string metric.
 */

/**
 * Function returning the Damerau-Levenshtein distance between two sequences.
 *
 * @param  {mixed}  a  - The first sequence to process.
 * @param  {mixed}  b  - The second sequence to process.
 * @return {number}    - The Damerau-Levenshtein distance between a & b.
 */
function damerauLevenshtein(a, b) {
  if (a === b) return 0;

  var la = a.length,
      lb = b.length;

  if (!la) return lb;
  if (!lb) return la;

  // Swapping the strings so that the shorter string is the first one.
  if (la > lb) {
    var _ref = [b, a];
    a = _ref[0];
    b = _ref[1];
    var _ref2 = [lb, la];
    la = _ref2[0];
    lb = _ref2[1];
  }

  // Ignoring common suffix
  while (la > 0 && a[la - 1] === b[lb - 1]) {
    la--;
    lb--;
  }

  var start = 0;

  // If a common prefix exists of if a is a full b suffix
  if (a[0] === b[0] || !la) {

    // Common prefix can also be ignored
    while (start < la && a[start] === b[start]) {
      start++;
    }la -= start;
    lb -= start;

    if (!la) return lb;

    b = b.slice(start, start + lb);
  }

  var v0 = new Array(lb),
      v2 = new Array(lb);

  for (var i = 0; i < lb; i++) {
    v0[i] = i + 1;
  }var charA = a[0],
      current = 0;

  // Starting the nested loops
  for (var _i = 0; _i < la; _i++) {
    var previousCharA = charA;

    var nextTranspositionCost = 0,
        charB = b[0],
        left = _i;

    current = _i + 1;
    charA = a[start + _i];

    for (var j = 0; j < lb; j++) {
      var above = current,
          previousCharB = charB;

      var thisTranspositionCost = nextTranspositionCost;

      charB = b[j];
      nextTranspositionCost = v2[j];
      v2[j] = current = left;
      left = v0[j];

      if (charA !== charB) {

        // Insertion
        if (left < current) current = left;

        // Deletion
        if (above < current) current = above;

        current++;

        // Transposition
        if (_i !== 0 && j !== 0 && charA === previousCharB && charB === previousCharA) {
          thisTranspositionCost++;

          if (thisTranspositionCost < current) current = thisTranspositionCost;
        }
      }

      v0[j] = current;
    }
  }

  return current;
}

/**
 * Function returning the Damerau-Levenshtein distance between two sequences
 * but with a twist: this version will stop its computation if distance
 * exceed a given maximum and return Infinity.
 *
 * @param  {number} max - Maximum distance.
 * @param  {mixed}  a   - The first sequence to process.
 * @param  {mixed}  b   - The second sequence to process.
 * @return {number}     - The Damerau-Levenshtein distance between a & b or Infinity.
 */
function limited(max, a, b) {
  if (a === b) return 0;

  var la = a.length,
      lb = b.length;

  if (!la) return lb > max ? Infinity : lb;
  if (!lb) return la > max ? Infinity : la;

  // Swapping the strings so that the shorter string is the first one.
  if (la > lb) {
    var _ref3 = [b, a];
    a = _ref3[0];
    b = _ref3[1];
    var _ref4 = [lb, la];
    la = _ref4[0];
    lb = _ref4[1];
  }

  // Ignoring common suffix
  while (la > 0 && a[la - 1] === b[lb - 1]) {
    la--;
    lb--;
  }

  var start = 0;

  // If a common prefix exists of if a is a full b suffix
  if (a[0] === b[0] || !la) {

    // Common prefix can also be ignored
    while (start < la && a[start] === b[start]) {
      start++;
    }la -= start;
    lb -= start;

    if (!la) return lb > max ? Infinity : lb;

    b = b.slice(start, start + lb);
  }

  var diff = lb - la;

  if (max > lb) max = lb;else if (diff > max) return Infinity;

  var v0 = new Array(lb),
      v2 = new Array(lb);

  var i = void 0;
  for (i = 0; i < max; i++) {
    v0[i] = i + 1;
  }for (; i < lb; i++) {
    v0[i] = max + 1;
  }var offset = max - diff,
      haveMax = max < lb;

  var jStart = 0,
      jEnd = max;

  var charA = a[0],
      current = 0;

  // Starting the nested loops
  for (i = 0; i < la; i++) {
    var previousCharA = charA;

    var nextTranspositionCost = 0,
        charB = b[0],
        left = i;

    current = i + 1;
    charA = a[start + i];
    jStart += i > offset ? 1 : 0;
    jEnd += jEnd < lb ? 1 : 0;

    for (var j = jStart; j < jEnd; j++) {
      var above = current,
          previousCharB = charB;

      var thisTranspositionCost = nextTranspositionCost;

      charB = b[j];
      nextTranspositionCost = v2[j];
      v2[j] = current = left;
      left = v0[j];

      if (charA !== charB) {

        // Insertion
        if (left < current) current = left;

        // Deletion
        if (above < current) current = above;

        current++;

        // Transposition
        if (i !== 0 && j !== 0 && charA === previousCharB && charB === previousCharA) {
          thisTranspositionCost++;

          if (thisTranspositionCost < current) current = thisTranspositionCost;
        }
      }

      v0[j] = current;
    }

    if (haveMax && v0[i + diff] > max) return Infinity;
  }

  return current <= max ? current : Infinity;
}
module.exports = exports["default"];
exports["default"].limited = exports.limited;