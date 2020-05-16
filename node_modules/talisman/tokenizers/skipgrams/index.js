'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = skipgrams;

var _combinations = require('obliterator/combinations');

var _combinations2 = _interopRequireDefault(_combinations);

var _helpers = require('../../helpers');

var _vectors = require('../../helpers/vectors');

var _ngrams = require('../ngrams');

var _ngrams2 = _interopRequireDefault(_ngrams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sentinel object.
 */
/**
 * Talisman tokenizers/skipgrams
 * ==============================
 *
 * Functions related to skipgrams' computation.
 *
 * [Reference]: https://en.wikipedia.org/wiki/N-gram#Skip-gram
 */
var SENTINEL = {};

/**
 * Function taking a sequence and computing its skipgrams.
 *
 * @param  {number}   k      - Nb of elements to skip.
 * @param  {number}   n         - Nb of elements in the subsequence.
 * @param  {mixed}    sequence  - The sequence to process.
 * @return {array}              - The array of resulting skipgrams.
 *
 * @throws {Error} The function expects a positive k.
 * @throws {Error} The function expects a positive n > 0.
 * @throws {Error} n should be > k.
 */
function skipgrams(k, n, sequence) {
  if (k < 1) throw new Error('talisman/tokenizers/skipgrams: `k` should be a positive integer > 0.');

  if (n < 1) throw Error('talisman/tokenizers/skipgrams: `n` should be a positive integer > 0.');

  if (n < k) throw Error('talisman/tokenizers/skipgrams: `n` should be greater than `k`.');

  var isString = typeof sequence === 'string';

  sequence = (0, _helpers.seq)(sequence);

  // NOTE: should be n or k?
  var padding = (0, _vectors.vec)(n, SENTINEL);

  var subsequences = [],
      grams = (0, _ngrams2.default)(n + k, sequence.concat(padding));

  for (var i = 0, l = grams.length; i < l; i++) {
    var head = grams[i][0],
        tail = grams[i].slice(1);

    var iterator = (0, _combinations2.default)(tail, n - 1);

    var step = void 0;

    while (step = iterator.next(), !step.done) {
      var skipTail = step.value;

      if (skipTail[skipTail.length - 1] === SENTINEL) continue;

      if (isString) subsequences.push(head + skipTail.join(''));else subsequences.push([head].concat(skipTail));
    }
  }

  return subsequences;
}
module.exports = exports['default'];