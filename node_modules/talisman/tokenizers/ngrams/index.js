'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.default = ngrams;
/**
 * Talisman tokenizers/ngrams
 * ===========================
 *
 * Functions related to ngrams' computation.
 *
 * [Reference]: https://en.wikipedia.org/wiki/N-gram
 */

/**
 * Function taking a sequence and computing its ngrams.
 *
 * @param  {number}   n         - Nb of elements in the subsequence.
 * @param  {mixed}    sequence  - The sequence to process.
 * @return {array}              - The array of resulting ngrams.
 *
 * @throws {Error} The function expects a positive n > 0.
 */
function ngrams(n, sequence) {
  if (n < 1) throw Error('talisman/tokenizers/ngrams: first argument should be a positive integer > 0.');

  var isString = typeof sequence === 'string';

  var subsequences = [];

  for (var i = 0, l = sequence.length; i < l - n + 1; i++) {
    var subsequence = [];

    for (var j = 0; j < n; j++) {
      subsequence.push(sequence[i + j]);
    }subsequences.push(isString ? subsequence.join('') : subsequence);
  }

  return subsequences;
}

/**
 * Creating popular aliases.
 */
var bigrams = ngrams.bind(null, 2),
    trigrams = ngrams.bind(null, 3),
    quadrigrams = ngrams.bind(null, 4);

exports.bigrams = bigrams;
exports.trigrams = trigrams;
exports.quadrigrams = quadrigrams;
module.exports = exports['default'];
exports['default'].bigrams = exports.bigrams;
exports['default'].trigrams = exports.trigrams;
exports['default'].quadrigrams = exports.quadrigrams;