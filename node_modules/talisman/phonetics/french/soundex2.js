'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = soundex2;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

var _helpers = require('../../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * Talisman phonetics/french/soundex2
                                                                                                                                                                                                     * ===================================
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * French phonetic algorithm loosely based upon the classifcal Soundex.
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * [Reference]:
                                                                                                                                                                                                     * http://www-info.univ-lemans.fr/~carlier/recherche/soundex.html
                                                                                                                                                                                                     * http://sqlpro.developpez.com/cours/soundex/
                                                                                                                                                                                                     */


/**
 * Rules.
 */
var GROUPS = [[/GU([IE])/g, 'K$1'], [/G([AO])/g, 'K$1'], [/GU/g, 'K'], [/C([AOU])/g, 'K$1'], [/(?:Q|CC|CK)/g, 'K']];

var PREFIXES = [

// Note: the way the algorithm is described, it is highly probable that
// the 'MAC' rule cannot work because of precendent modifications
['MAC', 'MCC'], ['SCH', 'SSS'], ['ASA', 'AZA'], ['KN', 'NN'], ['PH', 'FF'], ['PF', 'FF']];

/**
 * Helpers.
 */
function pad(code) {
  return code.slice(0, 4);
}

/**
 * Function taking a single name and computing its Soundex2 code.
 *
 * Note: the description of the algorithm says to pad the code using spaces, but
 * as I cannot see why one would do that (plus it is quite error-prone when
 * debugging), I decided to drop it.
 *
 * @param  {string}  name - The name to process.
 * @return {string}       - The Soundex2 code.
 *
 * @throws {Error} The function expects the name to be a string.
 */
function soundex2(name) {
  if (typeof name !== 'string') throw Error('talisman/phonetics/french/soundex2: the given name is not a string.');

  var code = (0, _deburr2.default)(name.trim()).toUpperCase().replace(/[^A-Z]/, '');

  // Replacing some letter groups
  for (var i = 0, l = GROUPS.length; i < l; i++) {
    var _code;

    code = (_code = code).replace.apply(_code, _toConsumableArray(GROUPS[i]));
  } // Replacing vowels
  code = code.charAt(0) + code.slice(1).replace(/[AEIOU]/g, 'A');

  // Replacing prefixes
  for (var _i = 0, _l = PREFIXES.length; _i < _l; _i++) {
    var _PREFIXES$_i = PREFIXES[_i],
        prefix = _PREFIXES$_i[0],
        replacement = _PREFIXES$_i[1],
        length = prefix.length;


    if (code.slice(0, length) === prefix) code = replacement + code.slice(length);
  }

  // Handling the letter H
  code = code.replace(/([^CS])H/g, '$1');

  // Handling the letter Y
  code = code.replace(/([^A])Y/g, '$1');

  // Removing some endings
  code = code.replace(/[ADTS]$/, '');

  // Removing non-leading vowels
  code = code.charAt(0) + code.slice(1).replace(/A/g, '');

  return pad((0, _helpers.squeeze)(code));
}
module.exports = exports['default'];