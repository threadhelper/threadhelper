'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = skeleton;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constants.
 */
var UNDESIRABLES = /[^A-Z]/g,
    VOWELS = new Set('AEIOU');

/**
 * Helpers.
 */
/**
 * Talisman keyers/skeleton
 * =========================
 *
 * Keyer taking a string and normalizing it into a "skeleton key".
 *
 * [Reference]:
 * http://dl.acm.org/citation.cfm?id=358048
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.12.385&rep=rep1&type=pdf
 *
 * [Article]:
 * Pollock, Joseph J. and Antonio Zamora. 1984. "Automatic Spelling Correction
 * in Scientific and Scholarly Text." Communications of the ACM, 27(4).
 * 358--368.
 */
function consume(set) {
  return Array.from(set).join('');
}

/**
 * Skeleton key function.
 *
 * @param  {string} string - Target string.
 * @return {string}        - The skeleton key.
 */
function skeleton(string) {

  // Deburring
  string = (0, _deburr2.default)(string);

  // Normalizing case
  string = string.toUpperCase();

  // Dropping useless characters
  string = string.replace(UNDESIRABLES, '');

  // Composing the key
  var firstLetter = string[0];

  if (!firstLetter) return '';

  var consonants = new Set(),
      vowels = new Set();

  for (var i = 1, l = string.length; i < l; i++) {
    var letter = string[i];

    if (letter === firstLetter) continue;

    if (VOWELS.has(letter)) vowels.add(letter);else consonants.add(letter);
  }

  return firstLetter + consume(consonants) + consume(vowels);
}
module.exports = exports['default'];