'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mra;

var _mra = require('../phonetics/mra');

var _mra2 = _interopRequireDefault(_mra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helpers.
 */
function reverse(string) {
  return string.split('').reverse().join('');
}

/**
 * Function returning the result of the MRA comparison between two names.
 *
 * @param  {mixed}  a          - The first name.
 * @param  {mixed}  b          - The second name.
 * @return {object|null}       - The comparison result.
 */
/**
 * Talisman metrics/mra
 * =====================
 *
 * Functions applying the Match Rating Approach comparison.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Match_rating_approach
 *
 * [Article]:
 * Moore, G B.; Kuhns, J L.; Treffzs, J L.; Montgomery, C A. (Feb 1, 1977).
 * Accessing Individual Records from Personal Data Files Using Nonunique
 * Identifiers.
 * US National Institute of Standards and Technology. p. 17. NIST SP - 500-2.
 */
function mra(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') throw Error('talisman/metrics/distance/mra: given names should be strings.');

  var codexA = (0, _mra2.default)(a),
      codexB = (0, _mra2.default)(b);

  if (Math.abs(codexA.length - codexB.length) > 3) return null;

  // Finding the minimum rating value
  var sum = codexA.length + codexB.length;

  var minimum = 2;

  if (sum <= 4) minimum = 5;
  if (sum > 4 && sum <= 7) minimum = 4;
  if (sum > 7 && sum <= 11) minimum = 3;

  var codexALR = '',
      codexBLR = '';

  // Dropping duplicates from left to right
  for (var i = 0, l = Math.max(codexA.length, codexB.length); i < l; i++) {
    if (codexA[i] !== codexB[i]) {
      codexALR += codexA[i] ? codexA[i] : '';
      codexBLR += codexB[i] ? codexB[i] : '';
    }
  }

  codexALR = reverse(codexALR);
  codexBLR = reverse(codexBLR);

  var codexARL = '',
      codexBRL = '';

  // Dropping duplicates from right to left
  for (var _i = 0, _l = Math.max(codexALR.length, codexBLR.length); _i < _l; _i++) {
    if (codexALR[_i] !== codexBLR[_i]) {
      codexARL += codexALR[_i] ? codexALR[_i] : '';
      codexBRL += codexBLR[_i] ? codexBLR[_i] : '';
    }
  }

  var unmatched = Math.max(codexARL.length, codexBRL.length),
      similarity = 6 - unmatched,
      matching = similarity >= minimum;

  // Returning the result
  return {
    codex: [codexA, codexB],
    minimum: minimum,
    similarity: similarity,
    matching: matching
  };
}
module.exports = exports['default'];