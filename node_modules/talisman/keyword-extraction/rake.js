'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createExtractor;

var _heap = require('mnemonist/heap');

var _heap2 = _interopRequireDefault(_heap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: mitigation strategy to implement
// TODO: tokenizer option, stemmer option
// TODO: option for keyword merging
// TODO: configure T
// TODO: handle numbers

/**
 * Constants.
 */
var PUNCTUATION = /^[^\w\s]+$/,
    HASH_DELIMITER = '\x01';

/**
 * Helpers.
 */
/**
 * Talisman keyword-extraction/rake
 * =================================
 *
 * JavaScript implementation of the "Rapid Automatic Keyword Extraction" (RAKE).
 *
 * [Article]:
 * Rose, S., Engel, D., Cramer, N., & Cowley, W. (2010). Automatic Keyword
 * Extraction from Individual Documents. In M. W. Berry & J. Kogan (Eds.),
 * Text Mining: Theory and Applications: John Wiley & Sons.
 *
 * [Notes]:
 * The article use the term "degree" in a somewhat incorrect way. It's more
 * of the propension of a given word to find itself in a long keyword.
 */
function comparator(a, b) {
  if (a.score < b.score) return -1;
  if (a.score > b.score) return 1;
  return 0;
}

/**
 * Factory function taking some options & returning a custom RAKE function.
 *
 * @param  {object} options     - Options:
 * @param  {array}    stopwords - List of stopwords to use.
 */
function createExtractor(options) {
  options = options || {};

  var stopwords = options.stopwords;

  if (!Array.isArray(stopwords)) throw new Error('talisman/keyword-extraction/rake: expecting a list of stopwords.');

  var stopwordsSet = new Set(stopwords);

  /**
   * RAKE function taking an array of sentences being tokenized as words.
   * Note that the tokenization must keep punctuation in order to be able
   * to extract keywords.
   *
   * Alternatively, one can also stem the given tokens beforehand to minimize
   * the number of distinct keyword words.
   *
   * @param  {array}  doc - Target document.
   * @return {array}      - Resulting keywords.
   */
  return function (doc) {

    // First we need to find candidate keywords & score individual words
    var candidateKeywords = new Set(),
        wordFrequencies = {},
        wordDegrees = {};

    for (var i = 0, l = doc.length; i < l; i++) {
      var sentence = doc[i];

      var keyword = [];

      for (var j = 0, m = sentence.length; j < m; j++) {
        var word = sentence[j];

        if (stopwordsSet.has(word) || PUNCTUATION.test(word)) {
          if (keyword.length) {

            // Storing the hashed keyword for later
            candidateKeywords.add(keyword.join(HASH_DELIMITER));

            // Updating the degrees
            var degree = keyword.length - 1;

            for (var k = 0, n = keyword.length; k < n; k++) {
              wordDegrees[keyword[k]] = wordDegrees[keyword[k]] || 0;
              wordDegrees[keyword[k]] += degree;
            }

            keyword = [];
          }
        } else {

          // Updating word frequency
          wordFrequencies[word] = wordFrequencies[word] || 0;
          wordFrequencies[word]++;

          // Adding the word to the current keyword
          keyword.push(word);
        }
      }
    }

    // Now we need to score the keywords and retrieve the best one
    var heap = new _heap2.default(comparator),
        T = candidateKeywords.size / 3 | 0;

    candidateKeywords.forEach(function (keyword) {
      var words = keyword.split(HASH_DELIMITER);
      var score = 0;

      for (var _i = 0, _l = words.length; _i < _l; _i++) {
        var _word = words[_i];
        score += wordDegrees[_word] / wordFrequencies[_word];
      }

      heap.push({ score: score, keyword: words });

      if (heap.size > T) heap.pop();
    });

    // Returning the results
    var result = new Array(T);

    for (var _i2 = heap.size - 1; _i2 >= 0; _i2--) {
      result[_i2] = heap.pop().keyword;
    }return result;
  };
}
module.exports = exports['default'];