'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nameSig;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constants.
 */
var TITLES = ['Dr', 'Jr', 'Md', 'Mgr', 'Mr', 'Mrs', 'Ms', 'Mme', 'Mlle', 'M', 'Prof', 'Phd', 'St', 'Sree', 'Sr']; /**
                                                                                                                   * Talisman keyers/name-sig
                                                                                                                   * =========================
                                                                                                                   *
                                                                                                                   * The Name Significance "NameSig" similarity key. The algorithm is slightly
                                                                                                                   * modified to align itself with the string fingerprint.
                                                                                                                   *
                                                                                                                   * [Article]:
                                                                                                                   * Similarity Analysis of Patients’ Data: Bangladesh Perspective.
                                                                                                                   * Shahidul Islam Khan, Abu Sayed Md. Latiful Hoque.
                                                                                                                   * December 17, 2016
                                                                                                                   */


var TITLE_REGEX = new RegExp('(?:' + TITLES.join('|') + ')\\.?\\s+', 'gi'),
    UNDESIRABLES_REGEX = /[^a-z]/g,
    VOWELS_REGEX = /(\S)[aeiou]+/g,
    WHITESPACE_REGEX = /\s/g;

var CONVERSIONS = [[/[jz]/g, 'g'], [/[qc]/g, 'k']];

/**
 * Function taking a name string and returning its NameSig key.
 *
 * @param  {string} name - Target name string.
 * @return {string}      - The NameSig key.
 */
function nameSig(name) {

  // Deburring
  name = (0, _deburr2.default)(name);

  // Lowercasing
  name = name.toLowerCase();

  // Dropping titles
  name = name.replace(TITLE_REGEX, '');

  // Stripping undesirables
  name = name.replace(UNDESIRABLES_REGEX, '');

  // Stripping ambiguous vowels
  name = name.replace(VOWELS_REGEX, '$1');

  // Dropping whitespace
  name = name.replace(WHITESPACE_REGEX, '');

  // Conversions
  name = name.replace(CONVERSIONS[0][0], CONVERSIONS[0][1]);
  name = name.replace(CONVERSIONS[1][0], CONVERSIONS[1][1]);

  return name;
}
module.exports = exports['default'];