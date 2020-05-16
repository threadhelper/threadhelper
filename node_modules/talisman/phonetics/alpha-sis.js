'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Talisman phonetics/alpha-sis
                                                                                                                                                                                                                                                                               * =============================
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * IBM Alpha Search Inquiry System.
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * [Reference]:
                                                                                                                                                                                                                                                                               * https://archive.org/stream/accessingindivid00moor#page/15/mode/1up
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * [Article]:
                                                                                                                                                                                                                                                                               * Accessing individual records from personal data files using non-unique
                                                                                                                                                                                                                                                                               * identifiers" / Gwendolyn B. Moore, et al.; prepared for the Institute for
                                                                                                                                                                                                                                                                               * Computer Sciences and Technology, National Bureau of Standards,
                                                                                                                                                                                                                                                                               * Washington, D.C (1977)
                                                                                                                                                                                                                                                                               */


exports.default = alphaSis;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constants.
 */
var INITIALS = [['GF', '08'], ['GM', '03'], ['GN', '02'], ['KN', '02'], ['PF', '08'], ['PN', '02'], ['PS', '00'], ['WR', '04'], ['A', '1'], ['E', '1'], ['H', '2'], ['I', '1'], ['J', '3'], ['O', '1'], ['U', '1'], ['W', '4'], ['Y', '5']];

var BASICS = [['SCH', '6'], ['CZ', ['70', '6', '0']], ['CH', ['6', '70', '0']], ['CK', ['7', '6']], ['DS', ['0', '10']], ['DZ', ['0', '10']], ['TS', ['0', '10']], ['TZ', ['0', '10']], ['CI', '0'], ['CY', '0'], ['CE', '0'], ['SH', '6'], ['DG', '7'], ['PH', '8'], ['C', ['7', '6']], ['K', ['7', '6']], ['Z', '0'], ['S', '0'], ['D', '1'], ['T', '1'], ['N', '2'], ['M', '3'], ['R', '4'], ['L', '5'], ['J', '6'], ['G', '7'], ['Q', '7'], ['X', '7'], ['F', '8'], ['V', '8'], ['B', '9'], ['P', '9']];

/**
 * Helpers.
 */
function pad(code) {
  return (code + '00000000000000').slice(0, 14);
}

function permutations(code) {
  var codes = [''];

  for (var i = 0, l = code.length; i < l; i++) {
    var current = code[i];

    if ((typeof current === 'undefined' ? 'undefined' : _typeof(current)) === 'object') {

      // Doubling the codes
      for (var j = 0, m = codes.length * (current.length - 1); j < m; j++) {
        codes.push(codes[j]);
      } // Filling the codes
      var offset = codes.length / current.length;

      for (var _j = 0, k = 0, _m = current.length; _j < _m; _j++) {
        var encoding = current[_j];

        while (k < offset) {
          codes[k + _j * offset] += encoding;
          k++;
        }

        k = 0;
      }
    } else {

      for (var _j2 = 0, _m2 = codes.length; _j2 < _m2; _j2++) {
        codes[_j2] += current;
      }
    }
  }

  return codes;
}

/**
 * Function taking a single name and computing its Alpha SIS value.
 *
 * @param  {string}  name - The name to process.
 * @return {array}        - List of the possible Alpha SIS values.
 *
 * @throws {Error} The function expects the name to be a string.
 */
function alphaSis(name) {
  if (typeof name !== 'string') throw Error('talisman/phonetics/alpha-sis: the given name is not a string.');

  name = (0, _deburr2.default)(name).toUpperCase().replace(/[^A-Z]/g, '');

  var code = [];

  var position = 0;

  // Handling inital substring
  for (var i = 0, l = INITIALS.length; i < l; i++) {
    var _INITIALS$i = INITIALS[i],
        substring = _INITIALS$i[0],
        encoding = _INITIALS$i[1];


    if (name.startsWith(substring)) {
      code.push(encoding);
      position += substring.length;
      break;
    }
  }

  // If the beginning of the string is not present in initial, we put '0'
  if (!code[0]) code.push('0');

  // Encoding the remaining
  var length = name.length;

  main: while (position < length) {

    for (var _i = 0, _l = BASICS.length; _i < _l; _i++) {
      var _BASICS$_i = BASICS[_i],
          substring = _BASICS$_i[0],
          encoding = _BASICS$_i[1];


      if (name.slice(position).startsWith(substring)) {
        code.push(encoding);
        position += substring.length;
        continue main;
      }
    }

    code.push('_');
    position++;
  }

  return permutations(code).map(function (c) {
    return pad((0, _helpers.squeeze)(c).replace(/_/g, ''));
  });
}
module.exports = exports['default'];