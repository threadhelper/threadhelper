'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = soundex;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

var _helpers = require('../../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Translations.
 */
/**
 * Talisman phonetics/french/soundex
 * ==================================
 *
 * A version of the Soundex algorithm targeting the French language.
 *
 * [Reference]:
 * http://www-info.univ-lemans.fr/~carlier/recherche/soundex.html
 * http://sqlpro.developpez.com/cours/soundex/
 */
var TRANSLATIONS = (0, _helpers.translation)('AEIOUYWHBPCKQDTLMNRGJSXZFV', '000000DD112223345567788899');

/**
 * Helpers.
 */
function pad(code) {
  return (code + '0000').slice(0, 4);
}

/**
 * Function taking a single name and computing its Soundex code.
 *
 * @param  {string}  name - The name to process.
 * @return {string}       - The Soundex code.
 *
 * @throws {Error} The function expects the name to be a string.
 */
function soundex(name) {
  if (typeof name !== 'string') throw Error('talisman/phonetics/french/soundex: the given name is not a string.');

  // Converting ç & œ
  name = name.toUpperCase().replace(/Ç/g, 'S').replace(/Œ/g, 'E');

  // Preparing the string
  name = (0, _deburr2.default)(name).replace(/[^A-Z]/g, '');

  var firstLetter = name.charAt(0);

  // Process the code for the name's tail
  var tail = '';

  for (var i = 1, l = name.length; i < l; i++) {
    if (TRANSLATIONS[name[i]] !== 'D') tail += TRANSLATIONS[name[i]];
  }

  // Dropping first code's letter if duplicate
  if (tail.charAt(0) === TRANSLATIONS[firstLetter]) tail = tail.slice(1);

  // Composing the code from the tail
  var code = (0, _helpers.squeeze)(tail).replace(/0/g, '');

  return pad(firstLetter + code);
}
module.exports = exports['default'];