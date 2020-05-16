'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.createNormalizer = createNormalizer;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

var _classes = require('../regexp/classes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Regular expressions.
 */
/* eslint no-control-regex: 0 */
/**
 * Talisman keyers/normalize
 * ==========================
 *
 * Generic function used to normalize strings to make them a good basis for
 * fuzzy comparisons.
 */
var CONTROL_CHARACTERS = new RegExp('[\\x00-\\x08\\x0A-\\x1F\\x7F]', 'g'),
    SINGLE_QUOTES = new RegExp('[' + _classes.SINGLE_QUOTES + ']', 'g'),
    DOUBLE_QUOTES = new RegExp('[' + _classes.DOUBLE_QUOTES + ']', 'g'),
    HYPHENS = new RegExp('[' + _classes.HYPHENS + ']', 'g'),
    COMMAS = new RegExp('[' + _classes.COMMAS + ']', 'g'),
    WHITESPACE_COMPRESSION = /\s+/g;

var CONVERSIONS = [[/…/g, '...'], [/æ/g, 'ae'], [/œ/g, 'oe'], [/ß/g, 'ss']];

/**
 * Function creating a normalizer function.
 *
 * @param  {object}  params        - Options:
 * @param  {boolean}   keepAccents - Whether to keep accents.
 * @param  {boolean}   keepCase    - Whether to keep the case.
 * @return {function}
 */
function createNormalizer(params) {
  params = params || {};

  var keepAccents = params.keepAccents === true,
      keepCase = params.keepCase === true;

  /**
   * Function returning a normalized string.
   *
   * @param  {string} string - String to normalize.
   * @return {string}
   */
  return function normalizer(string) {
    if (!keepCase) string = string.toLowerCase();

    string = string.trim().replace(WHITESPACE_COMPRESSION, ' ').replace(CONTROL_CHARACTERS, '').replace(SINGLE_QUOTES, '\'').replace(DOUBLE_QUOTES, '"').replace(HYPHENS, '-').replace(COMMAS, ',');

    for (var i = 0, l = CONVERSIONS.length; i < l; i++) {
      var pattern = CONVERSIONS[i][0],
          replacement = CONVERSIONS[i][1];

      string = string.replace(pattern, replacement);
    }

    if (!keepAccents) string = (0, _deburr2.default)(string);

    return string;
  };
}

exports.default = createNormalizer();
module.exports = exports['default'];
exports['default'].createNormalizer = exports.createNormalizer;