"use strict";

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.default = mongeElkan;
exports.symmetric = symmetric;
/**
 * Talisman metrics/monge-elkan
 * =============================
 *
 * Implementation of the Monge-Elkan distance.
 *
 * [Reference]: http://www.aaai.org/Papers/KDD/1996/KDD96-044.pdf
 *
 * [Article]:
 * Monge, Alvaro E. and Charles P. Elkan. 1996. "The field matching problem:
 * Algorithms and applications." KDD-9 Proceedings.
 *
 * [Tags]: metric, asymmetric, string metric.
 */

/**
 * Function computing the Monge-Elkan similarity.
 *
 * @param  {function}     similarity - Similarity function to use.
 * @param  {array|string} source     - Source sequence.
 * @param  {array|string} target     - Target sequence.
 * @return {number}                  - Monge-Elkan similarity.
 */
function mongeElkan(similarity, source, target) {
  if (source === target) return 1;
  if (!source.length && !target.length) return 1;
  if (!source.length || !target.length) return 0;

  var sum = 0;

  for (var i = 0, l = source.length; i < l; i++) {
    var max = -Infinity;

    for (var j = 0, m = target.length; j < m; j++) {
      var score = similarity(source[i], target[j]);

      if (score > max) max = score;
    }

    sum += max;
  }

  return sum / source.length;
}

/**
 * Function computing the symmetric Monge-Elkan similarity.
 * This is achieved by computing the mean of me(a, b) & me(b, a).
 */
function symmetric(similarity, source, target) {
  var a = mongeElkan(similarity, source, target),
      b = mongeElkan(similarity, target, source);

  return (a + b) / 2;
}

/**
 * Aliases.
 */
var similarity = mongeElkan;

exports.similarity = similarity;
module.exports = exports["default"];
exports["default"].symmetric = exports.symmetric;
exports["default"].similarity = exports.similarity;