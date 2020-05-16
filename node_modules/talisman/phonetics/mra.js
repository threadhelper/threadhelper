'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mra;

var _helpers = require('../helpers');

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Function taking a single name and computing its MRA codex.
 *
 * @param  {string}  name - The name to process.
 * @return {string}       - The MRA codex.
 *
 * @throws {Error} The function expects the name to be a string.
 */
/**
 * Talisman phonetics/mra
 * =======================
 *
 * Functions related to the computation of the Match Rating Approach codex.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Match_rating_approach
 *
 * [Article]:
 * Moore, G B.; Kuhns, J L.; Treffzs, J L.; Montgomery, C A. (Feb 1, 1977).
 * Accessing Individual Records from Personal Data Files Using Nonunique
 * Identifiers.
 * US National Institute of Standards and Technology. p. 17. NIST SP - 500-2.
 */
function mra(name) {
  if (typeof name !== 'string') throw Error('talisman/phonetics/mra: the given name is not a string.');

  // Preparing the name
  var codex = (0, _deburr2.default)(name).toUpperCase().replace(/[^A-Z]/g, '');

  // Dropping non-leading vowels
  codex = codex.charAt(0) + codex.slice(1).replace(/[AEIOU]/g, '');

  // Dropping consecutive consonants
  codex = (0, _helpers.squeeze)(codex);

  // Returning the codex
  var offset = Math.min(3, codex.length - 3);

  return codex.slice(0, 3) + codex.substr(codex.length - offset, offset);
}
module.exports = exports['default'];