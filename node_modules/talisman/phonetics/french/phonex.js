'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = phonex;

var _helpers = require('../../helpers');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * Talisman phonetics/french/phonex
                                                                                                                                                                                                     * =================================
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * Implementation of the French phonetic algorithm "Phonex".
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * [Author]: Frédéric Brouard
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * [Reference]:
                                                                                                                                                                                                     * http://www-info.univ-lemans.fr/~carlier/recherche/soundex.html
                                                                                                                                                                                                     * http://sqlpro.developpez.com/cours/soundex/
                                                                                                                                                                                                     */


/**
 * Translations.
 */
var ACCENTUATED = (0, _helpers.translation)('ÀÂÄÃÉÈÊËÌÎÏÒÔÖÕÙÛÜÑ', 'AAAAYYYYIIIOOOOUUUN'),
    SINGLE_LETTERS = (0, _helpers.translation)('ADPJBVM', 'OTTGFFN');

/**
 * Rules.
 */
var RULES = [[/Y/g, 'I'], [/([^PCS])H/g, '$1'], [/PH/g, 'F'], [/G(AI?[NM])/g, 'K$1'], [/[AE]I[NM]([AEIOU])/g, 'YN$1'], [/EAU/, 'O'], [/OUA/, '2'], [/[EA]I[NM]/g, '4'], [/[EA]I/g, 'Y'], [/E([RTZ])/g, 'Y$1'], [/ESS/g, 'YS'], [/[AOE]N([^AEIOU1234])/g, '1$1'], [/[AE]M([^AEIOU1234])/g, '1$1'], [/IN([^AEIOU1234])/g, '4$1'], [/([AEIOUY1234])S([AEIOUY1234])/g, '$1Z$2'], [/(?:OE|EU)/g, 'E'], [/AU/g, 'O'], [/O[IY]/g, '2'], [/OU/g, '3'], [/(?:SCH|CH|SH)/g, '5'], [/S[CS]/g, 'S'], [/C([EI])/, 'S$1'], [/(?:GU|QU|Q|C)/g, 'K'], [/G([AOY])/g, 'K$1']];

// [/SC?([EIY])/g, 'S$1'] unified rule

/**
 * Function taking a single word and computing its Phonex code.
 *
 * @param  {string}  word - The word to process.
 * @return {string}       - The Phonex code.
 *
 * @throws {Error} The function expects the word to be a string.
 */
function phonex(word) {
  if (typeof word !== 'string') throw Error('talisman/phonetics/french/phonex: the given word is not a string.');

  word = word.toUpperCase();

  // Replacing accentuated letters
  var code = '';

  for (var i = 0, l = word.length; i < l; i++) {
    var letter = word.charAt(i);
    code += ACCENTUATED[letter] || letter;
  }

  // Dropping shenanigans
  code = code.replace(/[^A-Z]/g, '');

  // Applying rules
  for (var _i = 0, _l = RULES.length; _i < _l; _i++) {
    var _code;

    code = (_code = code).replace.apply(_code, _toConsumableArray(RULES[_i]));
  } // Translating single letters
  var previousCode = code;
  code = '';

  for (var _i2 = 0, _l2 = previousCode.length; _i2 < _l2; _i2++) {
    var _letter = previousCode.charAt(_i2);
    code += SINGLE_LETTERS[_letter] || _letter;
  }

  // Dropping consecutive duplicates
  code = (0, _helpers.squeeze)(code);

  // Dropping trailing T and X
  code = code.replace(/[TX]$/, '');

  return code;
}
module.exports = exports['default'];