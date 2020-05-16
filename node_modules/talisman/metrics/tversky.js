'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tversky;
/**
 * Talisman metrics/tversky
 * =========================
 *
 * Functions computing the Tversky index.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Tversky_index
 *
 * [Article]:
 * Tversky, Amos (1977). "Features of Similarity".
 * Psychological Reviews 84 (4): 327–352.
 *
 * [Tags]: metric, asymmetric, string metric.
 */

/**
 * Helpers
 */
function I(X, Y) {
  var intersection = new Set();

  X.forEach(function (item) {
    if (Y.has(item)) intersection.add(item);
  });

  return intersection.size;
}

function R(X, Y) {
  var difference = new Set();

  X.forEach(function (item) {
    if (!Y.has(item)) difference.add(item);
  });

  return difference.size;
}

/**
 * Function returning the asymmetric Tversky index between both sequences.
 *
 * @param  {mixed}  x     - The first sequence to process.
 * @param  {mixed}  y     - The second sequence to process.
 * @param  {number} alpha - The alpha parameter.
 * @param  {number} beta  - The beta parameter.
 * @return {number}       - The asymmetric Tversky index.
 */
function asymmetricTversky(x, y, alpha, beta) {
  var XIY = I(x, y);

  return XIY / (XIY + alpha * R(x, y) + beta * R(y, x));
}

/**
 * Function returning the symmetric Tversky index between both sequences.
 *
 * @param  {mixed}  x     - The first sequence to process.
 * @param  {mixed}  y     - The second sequence to process.
 * @param  {number} alpha - The alpha parameter.
 * @param  {number} beta  - The beta parameter.
 * @return {number}       - The symmetric Tversky index.
 */
function symmetricTversky(x, y, alpha, beta) {
  var XIY = I(x, y),
      XminusY = R(x, y),
      YminusX = R(y, x),
      a = Math.min(XminusY, YminusX),
      b = Math.max(XminusY, YminusX);

  return XIY / (XIY + beta * (alpha * a + Math.pow(alpha - 1, b)));
}

/**
 * Function returning the Tversky index according to given parameters between
 * both sequences.
 *
 * @param  {object} params - The index's parameters.
 * @param  {mixed}  x      - The first sequence to process.
 * @param  {mixed}  y      - The second sequence to process.
 * @return {number}        - The resulting Tversky index.
 *
 * @throws {Error} The function expects both alpha & beta to be >= 0.
 */
function tversky(params, x, y) {
  params = params || {};

  var _params = params,
      _params$alpha = _params.alpha,
      alpha = _params$alpha === undefined ? 1 : _params$alpha,
      _params$beta = _params.beta,
      beta = _params$beta === undefined ? 1 : _params$beta,
      _params$symmetric = _params.symmetric,
      symmetric = _params$symmetric === undefined ? false : _params$symmetric;


  if (alpha < 0 || beta < 0) throw Error('talisman/metrics/distance/tversky: alpha & beta parameters should be >= 0.');

  // Casting to sets
  x = new Set(x);
  y = new Set(y);

  return symmetric ? symmetricTversky(x, y, alpha, beta) : asymmetricTversky(x, y, alpha, beta);
}
module.exports = exports['default'];