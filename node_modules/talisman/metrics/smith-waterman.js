"use strict";

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.score = score;
/**
 * Talisman metrics/smith-waterman
 * ================================
 *
 * Functions computing the Smith-Waterman distance.
 *
 * [Reference]: https://en.wikipedia.org/wiki/Smith%E2%80%93Waterman_algorithm
 *
 * [Article]:
 * Smith, Temple F. & Waterman, Michael S. (1981). "Identification of Common
 * Molecular Subsequences" (PDF). Journal of Molecular Biology. 147: 195–197.
 *
 * [Tags]: metric, string metric.
 */
var SIMILARITY = function SIMILARITY(a, b) {
  return a === b ? 1 : 0;
};

/**
 * Function returning the Smith-Waterman score between two sequences.
 *
 * @param  {object}   options      - Options:
 * @param  {number}     gap        - Gap cost.
 * @param  {function}   similarity - Similarity function.
 * @param  {mixed}    a            - The first sequence to process.
 * @param  {mixed}    b            - The second sequence to process.
 * @return {number}                - The Smith-Waterman score between a & b.
 */
function score(options, a, b) {
  var _options$gap = options.gap,
      gap = _options$gap === undefined ? 1 : _options$gap,
      _options$similarity = options.similarity,
      similarity = _options$similarity === undefined ? SIMILARITY : _options$similarity;

  // Early terminations

  if (a === b) return a.length;

  var m = a.length,
      n = b.length;

  if (!m || !n) return 0;

  // TODO: Possibility to optimize for common prefix, but need to know max substitution cost

  var d = new Array(m + 1);

  var D = 0;

  for (var i = 0; i <= m; i++) {
    d[i] = new Array(2);
    d[i][0] = 0;
  }

  for (var j = 1; j <= n; j++) {
    d[0][j % 2] = 0;

    for (var _i = 1; _i <= m; _i++) {
      var cost = similarity(a[_i - 1], b[j - 1]);

      d[_i][j % 2] = Math.max(0, // Start over
      d[_i - 1][(j - 1) % 2] + cost, // Substitution
      d[_i - 1][j % 2] - gap, // Insertion
      d[_i][(j - 1) % 2] - gap // Deletion
      );

      // Storing max
      if (d[_i][j % 2] > D) D = d[_i][j % 2];
    }
  }

  return D;
}

/**
 * Exporting standard distance.
 */
var smithWaterman = score.bind(null, {});

exports.default = smithWaterman;
module.exports = exports["default"];
exports["default"].score = exports.score;