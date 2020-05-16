'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.relative = exports.absolute = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Talisman helpers/frequencies
                                                                                                                                                                                                                                                                               * =============================
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * Functions related to sequences' frequencies.
                                                                                                                                                                                                                                                                               */


exports.updateFrequencies = updateFrequencies;

var _ = require('./');

/**
 * Function taking a sequence and computing its frequencies.
 *
 * @param  {mixed}  sequence - The sequence to process.
 * @return {object}          - A dict of the sequence's frequencies.
 *
 * @example
 *   // frequencies([1, 1, 2, 3, 3, 3]) => {1: 2, 2: 1, 3: 3}
 *   // frequencies('test') => {t: 2, e: 1, s: 1}
 */
function frequencies(sequence) {
  var index = {};

  // Handling strings
  sequence = (0, _.seq)(sequence);

  for (var i = 0, l = sequence.length; i < l; i++) {
    var element = sequence[i];

    if (!index[element]) index[element] = 0;
    index[element]++;
  }

  return index;
}

/**
 * Relative version of the `frequencies` function.
 *
 * @param  {mixed}  sequence - The sequence to process. If an object is passed
 *                             the function will assume it's representing
 *                             absolute frequencies.
 * @return {object}          - A dict of the sequence's relative frequencies.
 *
 * @example
 *   // frequencies([1, 1, 2, 3, 3, 3]) => {1: ~0.33, 2: ~0.16, 3: 0.5}
 *   // frequencies('test') => {t: 0.5, e: 0.25, s: 0.25}
 */
function relativeFrequencies(sequence) {
  var index = void 0,
      length = void 0;

  // Handling the object polymorphism
  if ((typeof sequence === 'undefined' ? 'undefined' : _typeof(sequence)) === 'object' && !Array.isArray(sequence)) {
    index = sequence;
    length = 0;

    for (var k in index) {
      length += index[k];
    }
  } else {
    length = sequence.length;
    index = frequencies(sequence);
  }

  var relativeIndex = {};

  for (var _k in index) {
    relativeIndex[_k] = index[_k] / length;
  }return relativeIndex;
}

/**
 * Function taking frequencies and updating them with a new sequence.
 *
 * @param  {object} previousFrequencies  - The frequencies to update.
 * @param  {mixed}  sequence             - The added sequence.
 * @return {object}                      - The updated frequencies.
 */
function updateFrequencies(previousFrequencies, sequence) {
  sequence = (0, _.seq)(sequence);

  var newFrequencies = frequencies(sequence);

  // Merging frequencies
  for (var k in previousFrequencies) {
    newFrequencies[k] = (newFrequencies[k] || 0) + previousFrequencies[k];
  }return newFrequencies;
}

/**
 * Exporting
 */
exports.default = frequencies;
exports.absolute = frequencies;
exports.relative = relativeFrequencies;
module.exports = exports['default'];
exports['default'].updateFrequencies = exports.updateFrequencies;
exports['default'].absolute = exports.absolute;
exports['default'].relative = exports.relative;