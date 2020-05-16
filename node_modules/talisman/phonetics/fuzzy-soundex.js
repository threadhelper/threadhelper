'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fuzzySoundex;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * Talisman phonetics/fuzzy-soundex
                                                                                                                                                                                                     * =================================
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * Implementation of the "Fuzzy Soundex" algorithm.
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * [Reference]:
                                                                                                                                                                                                     * http://wayback.archive.org/web/20100629121128/http://www.ir.iit.edu/publications/downloads/IEEESoundexV5.pdf
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * [Article]:
                                                                                                                                                                                                     * Holmes, David and M. Catherine McCabe. "Improving Precision and Recall for
                                                                                                                                                                                                     * Soundex Retrieval."
                                                                                                                                                                                                     */


/**
 * Constants.
 */
var TRANSLATION = (0, _helpers.translation)('ABCDEFGHIJKLMNOPQRSTUVWXYZ', '0193017-07745501769301-7-9');

var SET1 = new Set(['CS', 'CZ', 'TS', 'TZ']),
    SET2 = new Set(['HR', 'WR']),
    SET3 = new Set(['KN', 'NG']),
    SET4 = new Set('HWY');

var RULES = [[/CA/g, 'KA'], [/CC/g, 'KK'], [/CK/g, 'KK'], [/CE/g, 'SE'], [/CHL/g, 'KL'], [/CL/g, 'KL'], [/CHR/g, 'KR'], [/CR/g, 'KR'], [/CI/g, 'SI'], [/CO/g, 'KO'], [/CU/g, 'KU'], [/CY/g, 'SY'], [/DG/g, 'GG'], [/GH/g, 'HH'], [/MAC/g, 'MK'], [/MC/g, 'MK'], [/NST/g, 'NSS'], [/PF/g, 'FF'], [/PH/g, 'FF'], [/SCH/g, 'SSS'], [/TIO/g, 'SIO'], [/TIA/g, 'SIO'], [/TCH/g, 'CHH']];

/**
 * Function taking a single name and computing its fuzzy Soundex code.
 *
 * @param  {string}  name - The name to process.
 * @return {string}       - The fuzzy Soundex code.
 *
 * @throws {Error} The function expects the name to be a string.
 */
function fuzzySoundex(name) {
  if (typeof name !== 'string') throw Error('talisman/phonetics/fuzzy-soundex: the given name is not a string.');

  if (!name) return '';

  // Deburring the string & dropping any non-alphabetical character
  name = (0, _deburr2.default)(name).toUpperCase().replace(/[^A-Z]/g, '');

  // Applying some substitutions for beginnings
  var firstTwoLetters = name.slice(0, 2),
      rest = name.slice(2);

  if (SET1.has(firstTwoLetters)) name = 'SS' + rest;else if (firstTwoLetters === 'GN') name = 'NN' + rest;else if (SET2.has(firstTwoLetters)) name = 'RR' + rest;else if (firstTwoLetters === 'HW') name = 'WW' + rest;else if (SET3.has(firstTwoLetters)) name = 'NN' + rest;

  // Applying some substitutions for endings
  var lastTwoLetters = name.slice(-2),
      initial = name.slice(0, -2);

  if (lastTwoLetters === 'CH') name = initial + 'KK';else if (lastTwoLetters === 'NT') name = initial + 'TT';else if (lastTwoLetters === 'RT') name = initial + 'RR';else if (name.slice(-3) === 'RDT') name = name.slice(0, -3) + 'RR';

  // Applying the rules
  for (var i = 0, l = RULES.length; i < l; i++) {
    var _name;

    name = (_name = name).replace.apply(_name, _toConsumableArray(RULES[i]));
  } // Caching the first letter
  var firstLetter = name[0];

  // Translating
  var code = '';
  for (var _i = 0, _l = name.length; _i < _l; _i++) {
    code += TRANSLATION[name[_i]] || name[_i];
  } // Removing hyphens
  code = code.replace(/-/g, '');

  // Squeezing the code
  code = (0, _helpers.squeeze)(code);

  // Dealing with some initials
  if (SET4.has(code[0])) code = firstLetter + code;else code = firstLetter + code.slice(1);

  // Dropping vowels
  code = code.replace(/0/g, '');

  return code;
}
module.exports = exports['default'];