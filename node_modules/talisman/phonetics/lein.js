'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lein;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constants.
 */
/**
 * Talisman phonetics/lein
 * ========================
 *
 * The Lein name coding procedure.
 *
 * [Reference]:
 * http://naldc.nal.usda.gov/download/27833/PDF
 */
var DROPPED = /[AEIOUYWH]/g;

var TRANSLATION = (0, _helpers.translation)('DTMNLRBFPVCJKGQSXZ', '112233444455555555');

/**
 * Helpers.
 */
function pad(code) {
  return (code + '0000').slice(0, 4);
}

/**
 * Function taking a single name and computing its lein code.
 *
 * @param  {string}  name - The name to process.
 * @return {string}       - The lein code.
 *
 * @throws {Error} The function expects the name to be a string.
 */
function lein(name) {
  if (typeof name !== 'string') throw Error('talisman/phonetics/lein: the given name is not a string.');

  var code = (0, _deburr2.default)(name).toUpperCase().replace(/[^A-Z\s]/g, '');

  // 1-- Keeping the first letter
  var first = code[0];
  code = code.slice(1);

  // 2-- Dropping vowels and Y, W & H
  code = code.replace(DROPPED, '');

  // 3-- Dropping consecutive duplicates and truncating to 4 characters
  code = (0, _helpers.squeeze)(code).slice(0, 4);

  // 4-- Translations
  var backup = code;
  code = '';

  for (var i = 0, l = backup.length; i < l; i++) {
    code += TRANSLATION[backup[i]] || backup[i];
  }return pad(first + code);
}
module.exports = exports['default'];