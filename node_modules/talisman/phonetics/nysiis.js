'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.refined = exports.original = undefined;

var _helpers = require('../helpers');

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Patterns.
 */
/**
 * Talisman phonetics/nysiis
 * ==========================
 *
 * The nysiis algorithm, original & refined.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/New_York_State_Identification_and_Intelligence_System
 */
var PATTERNS = {
  original: {
    first: [[/JR$/g, ''], [/SR$/g, ''], [/^MAC/g, 'MCC'], [/^KN/g, 'NN'], [/^K/g, 'C'], [/^(PH|PF)/g, 'FF'], [/^SCH/g, 'SSS'], [/(EE|IE)$/g, 'Y'], [/(DT|RT|RD|NT|ND)$/g, 'D']],
    second: [[/EV/g, 'AF'], [/[EIOU]/g, 'A'], [/Q/g, 'G'], [/Z/g, 'S'], [/(M|KN)/g, 'N'], [/K/g, 'C'], [/SCH/g, 'SSS'], [/PH/g, 'FF'], [/([^A])H/g, '$1'], [/(.)H[^A]/g, '$1'], [/AW/g, 'A'], [/S$/g, ''], [/AY$/g, 'Y'], [/A$/g, '']]
  },
  refined: {
    first: [[/JR$/g, ''], [/SR$/g, ''], [/(S|Z)$/g, ''], [/MAC/g, 'MC'], [/PH/g, 'F'], [/IX$/g, 'IC'], [/EX$/g, 'EC'], [/(YE|EE|IE)/g, 'Y'], [/(DT|RT|RD|NT|ND)$/g, 'D'], [/(.+)EV/g, '$1EF']],
    second: [[/([AEIOU]+)W/g, '$1'], [/[EIOU]/g, 'A'], [/AA+/g, 'A'], [/GHT/g, 'GT'], [/DG/g, 'G'], [/PH/g, 'F'], [/(.+)HA/g, '$1A'], [/A+H/g, 'A'], [/KN/g, 'N'], [/K/g, 'C'], [/(.+)M/g, '$1N'], [/(.+)Q/g, '$1G'], [/(SH|SCH)/g, 'S'], [/YW/g, 'Y'], [/(.+)Y(.+)/g, '$1A$2'], [/WR/g, 'R'], [/(.+)Z/g, '$1S'], [/AY$/g, 'Y'], [/A+$/g, ''], [/^\w/g, '']]
  }
};

/**
 * Function taking a single name and computing its NYSIIS code.
 *
 * @param  {string}  name - The name to process.
 * @return {string}       - The NYSIIS code.
 *
 * @throws {Error} The function expects the name to be a string.
 */
function nysiis(type, name) {
  if (typeof name !== 'string') throw Error('talisman/phonetics/nysiis: the given name is not a string.');

  // Preparing the string
  name = (0, _deburr2.default)(name).toUpperCase().trim().replace(/[^A-Z]/g, '');

  // Getting the proper patterns
  var patterns = PATTERNS[type];

  // Applying the first substitutions
  for (var i = 0, l = patterns.first.length; i < l; i++) {
    var _patterns$first$i = patterns.first[i],
        match = _patterns$first$i[0],
        replacement = _patterns$first$i[1];


    name = name.replace(match, replacement);
  }

  // Storing the first letter
  var firstLetter = name.charAt(0);

  // Eating the first letter if applying the original algorithm
  if (type === 'original') name = name.slice(1);

  // Applying the second substitutions
  for (var _i = 0, _l = patterns.second.length; _i < _l; _i++) {
    var _patterns$second$_i = patterns.second[_i],
        match = _patterns$second$_i[0],
        replacement = _patterns$second$_i[1];


    name = name.replace(match, replacement);
  }

  // Returning the squeezed code
  return firstLetter + (0, _helpers.squeeze)(name);
}

/**
 * Exporting functions.
 */
var original = nysiis.bind(null, 'original'),
    refined = nysiis.bind(null, 'refined');

exports.default = original;
exports.original = original;
exports.refined = refined;
module.exports = exports['default'];
exports['default'].original = exports.original;
exports['default'].refined = exports.refined;