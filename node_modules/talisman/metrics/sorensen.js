'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.distance = exports.similarity = exports.coefficient = exports.index = undefined;

var _dice = require('./dice');

var _dice2 = _interopRequireDefault(_dice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Sorensen index is the same as the Dice one.
 */
exports.default = _dice2.default; /**
                                   * Talisman metrics/sorensen
                                   * ==========================
                                   *
                                   * Functions computing the Sorensen index. Note that Sorensen index is
                                   * actually the same as the Dice coefficient (metrics/dice).
                                   *
                                   * [Reference]:
                                   * https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
                                   *
                                   * [Article]:
                                   * Sørensen, T. (1948). "A method of establishing groups of equal amplitude in
                                   * plant sociology based on similarity of species and its application to
                                   * analyses of the vegetation on Danish commons".
                                   * Kongelige Danske Videnskabernes Selskab 5 (4): 1–34.
                                   *
                                   * [Tags]: semimetric, string metric.
                                   */

exports.index = _dice2.default;
exports.coefficient = _dice2.default;
exports.similarity = _dice2.default;
exports.distance = _dice.distance;
module.exports = exports['default'];
exports['default'].index = exports.index;
exports['default'].coefficient = exports.coefficient;
exports['default'].similarity = exports.similarity;
exports['default'].distance = exports.distance;