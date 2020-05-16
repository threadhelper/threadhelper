'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Talisman keyers/name-power-set
                                                                                                                                                                                                                                                                               * ===============================
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * Keyer returning an opinionated power set of what might be the ways to
                                                                                                                                                                                                                                                                               * write the given name so that one can try to perform fuzzy matching on
                                                                                                                                                                                                                                                                               * partial names such as "P. Henry" & "Philip Henry", for instance.
                                                                                                                                                                                                                                                                               */


exports.default = namePowerSet;

var _powerSet = require('obliterator/power-set');

var _powerSet2 = _interopRequireDefault(_powerSet);

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

var _words = require('../tokenizers/words');

var _words2 = _interopRequireDefault(_words);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: option for full initials? (else if solution involves only abbrev, we skip)
// TODO: disallow single token (on option)
// TODO: option to skip or not
// TODO: possibility to pass tokens rather than a string
// TODO: tweak power set token number threshold (heuristic function genre n or n - 1 etc.)
// TODO: option to convert to acronym or not
// TODO: predicate to know if we acronym or not (like do it only on firstName for instance)
// TODO: return sets as strings, not tokens

/**
 * Function expanding token by multiplexing tokens that are not initials.
 *
 * @param  {array} tokens - List of tokens.
 * @param  {array}
 */
function expand(tokens) {
  for (var i = 0, l = tokens.length; i < l; i++) {
    if (tokens[i].length > 1) tokens[i] = [tokens[i], tokens[i][0]];
  }

  return tokens;
}

/**
 * Permutation helper that will expand token possibilities.
 *
 * @param  {array} code - List of possibly expanded tokens.
 * @param  {array}
 */
function permutations(code) {
  var codes = [[]];

  for (var i = 0, l = code.length; i < l; i++) {
    var current = code[i];

    if ((typeof current === 'undefined' ? 'undefined' : _typeof(current)) === 'object') {

      // Doubling the codes
      for (var j = 0, m = codes.length * (current.length - 1); j < m; j++) {
        codes.push(codes[j].slice());
      } // Filling the codes
      var offset = codes.length / current.length;

      for (var _j = 0, k = 0, _m = current.length; _j < _m; _j++) {
        var encoding = current[_j];

        while (k < offset) {
          codes[k + _j * offset].push(encoding);
          k++;
        }

        k = 0;
      }
    } else {

      for (var _j2 = 0, _m2 = codes.length; _j2 < _m2; _j2++) {
        codes[_j2].push(current);
      }
    }
  }

  return codes;
}

/**
 * Function returning the name power set.
 *
 * @param  {string|array} name - Target name.
 * @param  {array}
 */
function namePowerSet(name) {

  // If the name is not yet tokenized, we do so
  if (typeof name === 'string') name = (0, _words2.default)(name);

  // Gathering items which are the sorted unique tokens of the name
  var tokens = (0, _uniq2.default)(name).sort();

  if (tokens.length < 2) return [tokens];

  var pset = [],
      step = void 0;

  var iterator = (0, _powerSet2.default)(tokens);

  while (step = iterator.next(), !step.done) {
    pset.push(step.value.slice());
  }pset = pset.filter(function (set) {
    return set.length > 1;
  }).map(expand).map(permutations);

  var possibilities = [];

  for (var i = 0, l = pset.length; i < l; i++) {
    var set = pset[i];

    for (var j = 0, m = set.length; j < m; j++) {
      if (!set[j].every(function (token) {
        return token.length < 2;
      })) possibilities.push(set[j]);
    }
  }

  return possibilities;
}
module.exports = exports['default'];