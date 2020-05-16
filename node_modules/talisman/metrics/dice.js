'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.distance = exports.similarity = exports.coefficient = exports.index = undefined;

var _tversky = require('./tversky');

var _tversky2 = _interopRequireDefault(_tversky);

var _ngrams = require('../tokenizers/ngrams');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Dice coefficient is just Tversky index with alpha = beta = 1 over the
 * sequences' bigrams.
 */
/**
 * Talisman metrics/dice
 * ======================
 *
 * Functions computing the Dice coefficient.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
 *
 * [Article]:
 * Dice, Lee R. (1945). "Measures of the Amount of Ecologic Association
 * Between Species". Ecology 26 (3): 297–302.
 *
 * [Tags]: semimetric, string metric.
 */
var dice = function dice(x, y) {

  // Shortcuts
  if (x === y) return 1;

  if (x.length === 1 && y.length === 1 && x !== y) return 0;

  // Computing the sequences' bigrams
  x = (0, _ngrams.bigrams)(x);
  y = (0, _ngrams.bigrams)(y);

  return (0, _tversky2.default)({ alpha: 0.5, beta: 0.5 }, x, y);
};

/**
 * Dice distance is 1 - the Dice index.
 */
var distance = function distance(x, y) {
  return 1 - dice(x, y);
};

/**
 * Exporting.
 */
exports.default = dice;
exports.index = dice;
exports.coefficient = dice;
exports.similarity = dice;
exports.distance = distance;
module.exports = exports['default'];
exports['default'].index = exports.index;
exports['default'].coefficient = exports.coefficient;
exports['default'].similarity = exports.similarity;
exports['default'].distance = exports.distance;