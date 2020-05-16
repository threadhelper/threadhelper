'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.default = soundex;
exports.refined = refined;

var _helpers = require('../helpers');

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Translations.
 */
/**
 * Talisman phonetics/soundex
 * ===========================
 *
 * The Soundex algorithm.
 *
 * [Reference]: https://en.wikipedia.org/wiki/Soundex
 *
 * [Authors]:
 * Robert C. Russel
 * Margaret King Odell
 */
var TRANSLATIONS = (0, _helpers.translation)('AEIOUYWHBPFVCSKGJQXZDTLMNR', '000000DD111122222222334556');

var REFINED_TRANSLATIONS = (0, _helpers.translation)('AEIOUYWHBPFVCKSGJQXZDTLMNR', '000000DD112233344555667889');

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
  if (typeof name !== 'string') throw Error('talisman/phonetics/soundex: the given name is not a string.');

  name = (0, _deburr2.default)(name).toUpperCase().replace(/[^A-Z]/g, '');

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

/**
 * Function taking a single name and computing its refined Soundex code.
 *
 * @param  {string}  name - The name to process.
 * @return {string}       - The refined Soundex code.
 *
 * @throws {Error} The function expects the name to be a string.
 */
function refined(name) {
  if (typeof name !== 'string') throw Error('talisman/phonetics/soundex#refined: the given name is not a string.');

  name = (0, _deburr2.default)(name).toUpperCase().replace(/[^A-Z]/g, '');

  var firstLetter = name.charAt(0);

  // Process the code for the name's tail
  var tail = '';

  for (var i = 0, l = name.length; i < l; i++) {
    if (REFINED_TRANSLATIONS[name[i]] !== 'D') tail += REFINED_TRANSLATIONS[name[i]];
  }

  // Composing the code from the tail
  var code = (0, _helpers.squeeze)(tail);

  return firstLetter + code;
}
module.exports = exports['default'];
exports['default'].refined = exports.refined;