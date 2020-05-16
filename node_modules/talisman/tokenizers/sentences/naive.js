'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.createTokenizer = createTokenizer;

var _classes = require('../../regexp/classes');

/**
 * Notable exceptions.
 */
var EXCEPTIONS = ['Dr', 'etc', 'Jr', 'M', 'Mgr', 'Mr', 'Mrs', 'Ms', 'Mme', 'Mlle', 'Prof', 'Sr', 'St', 'p', 'pp'];

/**
 * Building the splitting regex.
 */
/**
 * Talisman tokenizers/sentences/naive
 * ====================================
 *
 * Naive rule-based sentence tokenizer.
 *
 * [Author]: Guillaume PLIQUE
 */
var REGEX = new RegExp(['([.?!…]+)', '([' + _classes.DOUBLE_QUOTES + '*_]?[*_]?)', '[\\s\\r\\n]+', '(?=[' + _classes.DOUBLE_QUOTES + _classes.SINGLE_QUOTES + ']?[_*\\[]*[A-Z0-9\\u00C0-\\u00DC])'].join(''), 'g');

/**
 * Building additional regexes.
 */
var DOUBLE_QUOTES_REGEX = new RegExp('[' + _classes.DOUBLE_QUOTES + ']', 'g'),
    PAREN_REGEX = /[(){}\[\]]/g,
    LIST_REGEX = /^[A-Z0-9]\s?[.]\s*$/,
    PITFALL_REGEX = /^[A-Za-z0-9]\s*\)/;

/**
 * Tokenizer function factory aiming at building the required function.
 *
 * @param  {object}   options              - Possible options:
 * @param  {object}   [options.exceptions] - List of exceptions to handle.
 * @return {function}                      - The tokenizer function.
 */
function createTokenizer(options) {
  options = options || {};

  var exceptions = options.exceptions || [];

  // Building the exception regex once and for all
  var exceptionsRegex = new RegExp('(' + exceptions.map(function (e) {
    return e + '\\.';
  }).join('|') + ')');

  /**
   * Created tokenizer function.
   *
   * @param  {string} text - The text to tokenize.
   * @return {array}       - The sentences as tokens.
   */
  return function (text) {
    var initialTokens = text.replace(REGEX, '$1$2\x1E').split('\x1E'),
        correctTokens = [];

    var memo = '',
        c = void 0;

    for (var i = 0, l = initialTokens.length; i < l; i++) {
      c = initialTokens[i];

      // Searching for exceptions
      if (i !== l - 1 && (exceptionsRegex.test(c) || LIST_REGEX.test(c) || !PITFALL_REGEX.test(c) && (((memo + c).match(DOUBLE_QUOTES_REGEX) || []).length % 2 !== 0 || ((memo + c).match(PAREN_REGEX) || []).length % 2 !== 0))) {
        memo += (memo ? ' ' : '') + c;
        continue;
      }

      correctTokens.push(memo + (c && memo ? ' ' : '') + c);
      memo = '';
    }

    return correctTokens;
  };
}

/**
 * Exporting a default version of the tokenizer.
 */
var defaultTokenizer = createTokenizer({ exceptions: EXCEPTIONS });
exports.default = defaultTokenizer;
module.exports = exports['default'];
exports['default'].createTokenizer = exports.createTokenizer;