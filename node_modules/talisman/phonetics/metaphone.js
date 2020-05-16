'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = metaphone;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Series of rules to apply.
 */
var RULES = [[/([bcdfhjklmnpqrstvwxyz])\1+/g, '$1'], [/^ae/g, 'E'], [/^[gkp]n/g, 'N'], [/^wr/g, 'R'], [/^x/g, 'S'], [/^wh/g, 'W'], [/mb$/g, 'M'], [/(?!^)sch/g, 'SK'], [/th/g, '0'], [/t?ch|sh/g, 'X'], [/c(?=ia)/g, 'X'], [/[st](?=i[ao])/g, 'X'], [/s?c(?=[iey])/g, 'S'], [/[cq]/g, 'K'], [/dg(?=[iey])/g, 'J'], [/d/g, 'T'], [/g(?=h[^aeiou])/g, ''], [/gn(ed)?/g, 'N'], [/([^g]|^)g(?=[iey])/g, '$1J'], [/g+/g, 'K'], [/ph/g, 'F'], [/([aeiou])h(?=\b|[^aeiou])/g, '$1'], [/[wy](?![aeiou])/g, ''], [/z/g, 'S'], [/v/g, 'F'], [/(?!^)[aeiou]+/g, '']];

/**
 * Function taking a single word and computing its metaphone code.
 *
 * @param  {string}  word - The word to process.
 * @return {string}       - The metaphone code.
 *
 * @throws {Error} The function expects the word to be a string.
 */
/**
 * Talisman phonetics/metaphone
 * =============================
 *
 * The metaphone algorithm.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Metaphone
 *
 * [Author]:
 * Lawrence Philips, 1990
 */
function metaphone(word) {
  if (typeof word !== 'string') throw Error('talisman/phonetics/metaphone: the given word is not a string.');

  // Deburring the string & dropping any non-alphabetical character
  var code = (0, _deburr2.default)(word).toLowerCase().replace(/[^a-z]/g, '');

  // Applying the rules
  for (var i = 0, l = RULES.length; i < l; i++) {
    code = code.replace(RULES[i][0], RULES[i][1]);
  }return code.toUpperCase();
}
module.exports = exports['default'];