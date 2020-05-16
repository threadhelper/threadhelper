'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = statcan;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constants.
 */
/**
 * Talisman phonetics/statcan
 * ===========================
 *
 * The statistics Canada name coding technique.
 *
 * [Reference]:
 * http://naldc.nal.usda.gov/download/27833/PDF
 */
var DROPPED = /[AEIOUY]/g;

/**
 * Function taking a single name and computing its statcan code.
 *
 * @param  {string}  name - The name to process.
 * @return {string}       - The statcan code.
 *
 * @throws {Error} The function expects the name to be a string.
 */
function statcan(name) {

  if (typeof name !== 'string') throw Error('talisman/phonetics/statcan: the given name is not a string.');

  var code = (0, _deburr2.default)(name).toUpperCase().replace(/[^A-Z\s]/g, '');

  // 1-- Keeping the first letter
  var first = code[0];
  code = code.slice(1);

  // 2-- Dropping vowels and Y
  code = code.replace(DROPPED, '');

  // 3-- Dropping consecutive duplicates
  code = (0, _helpers.squeeze)(code);

  // 4-- Dropping blanks
  code = code.replace(/\s/g, '');

  // 5-- Limiting code size to 4
  return (first + code).slice(0, 4);
}
module.exports = exports['default'];