'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.ngramsFingerprint = undefined;
exports.createTokenizer = createTokenizer;

var _deburr = require('lodash/deburr');

var _deburr2 = _interopRequireDefault(_deburr);

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

var _ngrams = require('../ngrams');

var _ngrams2 = _interopRequireDefault(_ngrams);

var _regexp = require('../../regexp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constants.
 */
/* eslint no-control-regex: 0 */
/**
 * Talisman tokenizers/fingerprint
 * ================================
 *
 * Fingerprint tokenizer aiming at outputing meaningful sorted tokens for the
 * given string which can later be used for similarity measures.
 */
var WHITESPACE = /\s+/g,
    DIGITS = /\d/g,
    PUNCTUATION_CONTROL = new RegExp('[\\u2000-\\u206F\\u2E00-\\u2E7F\'!"#$%&()*+,\\-.\\/:;<=>?@\\[\\]^_`{|}~\\x00-\\x08\\x0A-\\x1F\\x7F]', 'g');

/**
 * Defaults.
 */
var DEFAULTS = {
  digits: true,
  minTokenSize: 1,
  ngrams: false,
  sort: true,
  split: null,
  stopwords: null
};

/**
 * Tokenizer function factory aiming at building the required function.
 *
 * @param  {object}   options        - Possible options:
 * @param  {boolean}    digits       - Whether to keep digits.
 * @param  {number}     minTokenSize - Minimum token size.
 * @param  {number}     ngrams       - Tokenize ngrams rather than words.
 * @param  {array}      split        - List of token-splitting characters.
 * @param  {array}      stopwords    - List of stopwords.
 * @return {function}                - The tokenizer function.
 */
function createTokenizer(options) {
  options = options || {};

  var ngramsTokenize = options.ngrams || DEFAULTS.ngrams,
      stripDigits = options.digits === false || !DEFAULTS.digits,
      minTokenSize = options.minTokenSize || DEFAULTS.minTokenSize,
      dontSort = options.sort === false;

  var stopwords = options.stopwords || DEFAULTS.stopwords;

  // Compiling stopwords
  if (stopwords) stopwords = new RegExp('(?:' + stopwords.map(function (word) {
    return '\\b' + (0, _regexp.escapeRegexp)(word) + '\\b';
  }).join('|') + ')', 'gi');

  var split = options.split || DEFAULTS.split;

  // Compiling split
  if (split) split = new RegExp('[' + (0, _regexp.escapeRegexp)(split.join('')) + ']', 'g');

  var sizeFilter = void 0;
  if (minTokenSize > 1) sizeFilter = new RegExp('\\b\\S{1,' + minTokenSize + '}\\b', 'g');

  // Returning the function
  return function (n, string) {

    if (!ngramsTokenize) string = n;

    //-- Splitting
    if (split) string = string.replace(split, ' ');

    //-- Stopwords
    if (stopwords) string = string.replace(stopwords, '');

    //-- Digits
    if (stripDigits) string = string.replace(DIGITS, '');

    //-- Case normalization
    string = string.toLowerCase();

    //-- Minimum token size
    if (sizeFilter) string = string.replace(sizeFilter, '');

    //-- Dropping punctuation & control characters
    string = string.replace(PUNCTUATION_CONTROL, '');

    //-- Deburring
    string = (0, _deburr2.default)(string);

    //-- Trimming
    string = string.trim();

    //-- Tokenizing
    var tokens = void 0;

    if (!ngramsTokenize) tokens = string.split(WHITESPACE);else tokens = (0, _ngrams2.default)(n, string.replace(WHITESPACE, ''));

    //-- Keeping only unique tokens
    tokens = (0, _uniq2.default)(tokens);

    //-- Sorting tokens
    if (!dontSort) tokens.sort();

    return tokens;
  };
}

exports.default = createTokenizer();
var ngramsFingerprint = exports.ngramsFingerprint = createTokenizer({ ngrams: true });
module.exports = exports['default'];
exports['default'].createTokenizer = exports.createTokenizer;
exports['default'].ngramsFingerprint = exports.ngramsFingerprint;