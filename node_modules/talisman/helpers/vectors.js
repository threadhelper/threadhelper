"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vec = vec;
exports.add = add;
exports.scale = scale;
exports.mean = mean;
exports.dot = dot;
/**
 * Talisman helpers/vectors
 * =========================
 *
 * Compilation of various helpers to deal with vectors.
 */

/**
 * Function creating a vector of n dimensions and filling it with a single
 * value if required.
 *
 * @param  {number} n    - Dimensions of the vector to create.
 * @param  {mixed}  fill - Value to be used to fill the vector.
 * @return {array}       - The resulting vector.
 */
function vec(n, fill) {
  var vector = new Array(n);

  if (arguments.length > 1) {
    for (var i = 0; i < n; i++) {
      vector[i] = fill;
    }
  }

  return vector;
}

/**
 * Function adding two vectors.
 *
 * @param  {array} a - The first vector.
 * @param  {array} b - The second vector.
 * @return {array}   - The resulting vector.
 */
function add(a, b) {
  var dimensions = a.length,
      vector = vec(dimensions);

  for (var i = 0; i < dimensions; i++) {
    vector[i] = a[i] + b[i];
  }return vector;
}

/**
 * Function multiplying a vector & a scalar.
 *
 * @param  {array} v - The first vector.
 * @param  {array} s - The scalar.
 * @return {array}   - The resulting vector.
 */
function scale(v, s) {
  var dimensions = v.length,
      vector = vec(dimensions);

  for (var i = 0; i < dimensions; i++) {
    vector[i] = v[i] * s;
  }return vector;
}

/**
 * Function returning the mean of a list of vectors.
 *
 * @param  {array} vectors - The list of vectors to process.
 * @return {array}         - A mean vector.
 */
function mean(vectors) {
  var sum = vec(vectors[0].length, 0);

  for (var i = 0, l = vectors.length; i < l; i++) {
    var vector = vectors[i];

    for (var j = 0, m = vector.length; j < m; j++) {
      sum[j] += vector[j];
    }
  }

  for (var _i = 0, _l = sum.length; _i < _l; _i++) {
    sum[_i] /= vectors.length;
  }return sum;
}

/**
 * Function returning the scalar product of two vectors.
 *
 * @param  {array}  a - The first vector.
 * @param  {array}  b - The second vector.
 * @return {number}   - The scalar product.
 */
function dot(a, b) {
  var product = 0;

  for (var i = 0, l = a.length; i < l; i++) {
    product += a[i] * b[i];
  }return product;
}