'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = omission;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constants.
 */
var UNDESIRABLES = /[^A-Z]/g,
    CONSONANTS = 'JKQXZVWYBFMGPDHCLNTSR',
    CONSONANTS_SET = new Set(CONSONANTS);

/**
 * omission key function.
 *
 * @param  {string} string - Target string.
 * @return {string}        - The omission key.
 */
/**
 * Talisman keyers/omission
 * =========================
 *
 * Keyer taking a string and normalizing it into a "omission key".
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
function omission(string) {

  // Deburring
  string = (0, _deburr2.default)(string);

  // Normalizing case
  string = string.toUpperCase();

  // Dropping useless characters
  string = string.replace(UNDESIRABLES, '');

  // Composing the key
  var key = '';
  var vowels = new Set();

  // Add consonants in order
  var letters = new Set(string);

  for (var i = 0, l = CONSONANTS.length; i < l; i++) {
    var consonant = CONSONANTS[i];

    if (letters.has(consonant)) key += consonant;
  }

  // Add vowels in order they appeared in the word
  for (var _i = 0, _l = string.length; _i < _l; _i++) {
    var letter = string[_i];

    if (!CONSONANTS_SET.has(letter) && !vowels.has(letter)) {
      vowels.add(letter);
      key += letter;
    }
  }

  return key;
}
module.exports = exports['default'];