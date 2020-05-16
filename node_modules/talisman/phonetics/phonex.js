'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = phonex;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constants.
 */
var INITIALS = [['AEIOUY', 'A'], ['BP', 'B'], ['VF', 'F'], ['KQC', 'C'], ['JG', 'G'], ['ZS', 'S']]; /**
                                                                                                     * Talisman phonetics/phonex
                                                                                                     * ==========================
                                                                                                     *
                                                                                                     * Implementation of the "Phonex" algorithm.
                                                                                                     *
                                                                                                     * [Reference]:
                                                                                                     * http://homepages.cs.ncl.ac.uk/brian.randell/Genealogy/NameMatching.pdf
                                                                                                     *
                                                                                                     * [Article]:
                                                                                                     * Lait, A. J. and B. Randell. "An Assessment of Name Matching Algorithms".
                                                                                                     */


INITIALS.forEach(function (rule) {
  return rule[0] = new Set(rule[0]);
});

var B_SET = new Set('BPFV'),
    C_SET = new Set('CSKGJQXZ'),
    VOWELS_SET = new Set('AEIOUY');

/**
 * Function taking a single name and computing its Phonex code.
 *
 * @param  {string}  name - The name to process.
 * @return {string}       - The Phonex code.
 *
 * @throws {Error} The function expects the name to be a string.
 */
function phonex(name) {
  if (typeof name !== 'string') throw Error('talisman/phonetics/phonex: the given name is not a string.');

  if (!name) return '';

  // Deburring the string & dropping any non-alphabetical character
  name = (0, _deburr2.default)(name).toUpperCase().replace(/[^A-Z]/g, '');

  // Removing trailing S
  name = name.replace(/S+$/, '');

  // Substitution of some initials
  var firstTwoLetter = name.slice(0, 2),
      rest = name.slice(2);

  if (firstTwoLetter === 'KN') name = 'N' + rest;else if (firstTwoLetter === 'PH') name = 'F' + rest;else if (firstTwoLetter === 'WR') name = 'R' + rest;

  // Ignoring first H if present
  if (name[0] === 'H') name = name.slice(1);

  // Encoding first character
  for (var i = 0, l = INITIALS.length; i < l; i++) {
    var _INITIALS$i = INITIALS[i],
        letters = _INITIALS$i[0],
        replacement = _INITIALS$i[1];


    if (letters.has(name[0])) {
      name = replacement + name.slice(1);
      break;
    }
  }

  var code = name[0],
      last = code;

  for (var _i = 1, _l = name.length; _i < _l; _i++) {
    var letter = name[_i],
        nextLetter = name[_i + 1];

    var encoding = '0';

    if (B_SET.has(letter)) {
      encoding = '1';
    } else if (C_SET.has(letter)) {
      encoding = '2';
    } else if (letter === 'D' || letter === 'T') {
      if (nextLetter !== 'C') encoding = '3';
    } else if (letter === 'L') {
      if (VOWELS_SET.has(nextLetter) || _i + 1 === _l) encoding = '4';
    } else if (letter === 'M' || letter === 'N') {
      if (nextLetter === 'D' || nextLetter === 'G') name = name.slice(0, _i + 1) + letter + name.slice(_i + 2);
      encoding = '5';
    } else if (letter === 'R') {
      if (VOWELS_SET.has(nextLetter) || _i + 1 === _l) encoding = '6';
    }

    if (encoding !== last && encoding !== '0') code += encoding;

    last = code.slice(-1);
  }

  return code;
}
module.exports = exports['default'];