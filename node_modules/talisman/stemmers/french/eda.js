'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = eda;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

var _helpers = require('../../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constants.
 */
/**
 * Talisman stemmers/french/eda
 * =============================
 *
 * The EDA stemmer for the French language. Note that this stemmers orignally
 * targets words from the medical world.
 *
 * [Reference]:
 * https://cedric.cnam.fr/fichiers/RC1314.pdf
 *
 * [Author]:
 * Didier Nakache
 *
 * [Article]:
 * Extraction automatique des diagnostics à partir des comptes rendus médicaux
 * textuels. Didier Nakache, 2007.
 */
var PHONETIC_RULES = [[/(?:cqu|qu|ck?)/g, 'k'], [/y/g, 'i']];

var SUFFIXES = ['s', 'e', 'x', 'ant', 'al', 'au', 'tion', 'sion', 'er', 'iv', 'if', 'abl', 'ibl', 'ment', 'tele', 'tel', 'tos', 'ik', 'ton', 'tos', 'ent', 'en', 'tik', 'toid', 'o', 'i', 's', 'dien', 'u', 'e', 'era', 'ank', 'enk', 'teur', 'trice', 'i'];

/**
 * Function stemming the given world using the EDA algorithm for the French
 * language.
 *
 * @param  {string} word - The word to stem.
 * @return {string}      - The resulting stem.
 */
function eda(word) {
  var stem = (0, _helpers.squeeze)((0, _deburr2.default)(word.toLowerCase()));

  // Early termination
  if (stem.length <= 5) {
    if (stem.slice(-1) === 'e') stem = stem.slice(0, -1);
    if (stem.slice(-1) === 's') stem = stem.slice(0, -1);

    return stem;
  }

  // Applying phonetic rules
  for (var i = 0, l = PHONETIC_RULES.length; i < l; i++) {
    var _PHONETIC_RULES$i = PHONETIC_RULES[i],
        pattern = _PHONETIC_RULES$i[0],
        replacement = _PHONETIC_RULES$i[1];


    stem = stem.replace(pattern, replacement);
  }

  // Removing suffixes
  for (var _i = 0, _l = SUFFIXES.length; _i < _l; _i++) {
    var suffix = SUFFIXES[_i];

    if (stem.slice(-suffix.length) === suffix) {
      stem = stem.slice(0, -suffix.length);

      if (stem.length <= 5) {
        if (stem.slice(-1) === 'e') stem = stem.slice(0, -1);
        if (stem.slice(-1) === 's') stem = stem.slice(0, -1);

        return stem;
      }
    }
  }

  return stem;
}
module.exports = exports['default'];