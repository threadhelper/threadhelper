'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lig2 = lig2;
exports.lig3 = lig3;

var _levenshtein = require('./levenshtein');

var _levenshtein2 = _interopRequireDefault(_levenshtein);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * LIG2 similarity metric.
 *
 * @param  {string|array} a - First sequence.
 * @param  {string|array} b - Second sequence.
 * @return {number}
 */
function lig2(a, b) {
  if (a === b) return 1;

  var tmp = void 0;

  // Swapping so that a is the shortest
  if (a.length > b.length) {
    tmp = a;
    a = b;
    b = tmp;
  }

  var C = (0, _levenshtein2.default)(a, b),
      I = b.length - C;

  return I / (I + C);
}

/**
 * LIG3 similarity metric.
 *
 * @param  {string|array} a - First sequence.
 * @param  {string|array} b - Second sequence.
 * @return {number}
 */
/**
 * Talisman metrics/lig
 * =====================
 *
 * LIG2 & LIG3 distances.
 *
 * Note that the LIG1 distance is not implemented here because it's deemed
 * less useful by the paper's authors and because they seem to use a different
 * definition of the Guth distance function that the widely accepted one (as
 * hinted in another paper).
 *
 * [Article]:
 * An Interface for Mining Genealogical Nominal Data Using the Concept of
 * linkage and a Hybrid Name Matching Algorithm.
 * Chakkrit Snae, Bernard Diaz
 * Department of Computer Science, The University of Liverpool
 * Peach Street, Liverpool, UK, L69 7ZF
 */
function lig3(a, b) {
  if (a === b) return 1;

  var tmp = void 0;

  // Swapping so that a is the shortest
  if (a.length > b.length) {
    tmp = a;
    a = b;
    b = tmp;
  }

  var C = (0, _levenshtein2.default)(a, b),
      I = b.length - C;

  return 2 * I / (2 * I + C);
}