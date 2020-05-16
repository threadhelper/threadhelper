'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.LegalipyTokenizer = undefined;
exports.default = defaultTokenizer;

var _frequencies = require('../../helpers/frequencies');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Talisman tokenizers/syllables/legalipy
                                                                                                                                                           * =======================================
                                                                                                                                                           *
                                                                                                                                                           * Language-independent syllabification from raw text based on the Onset
                                                                                                                                                           * Maximization Principle (principle of legality).
                                                                                                                                                           *
                                                                                                                                                           * [Reference]:
                                                                                                                                                           * https://github.com/henchc/LegaliPy
                                                                                                                                                           * http://syllabipy.com/index.php/legalipy-demo/
                                                                                                                                                           *
                                                                                                                                                           * [Author]:
                                                                                                                                                           * Christopher Hench (UC Berkeley)
                                                                                                                                                           */


/**
 * Constants.
 */
var VOWELS_STRING = 'aeiouyàáâäæãåāèéêëēėęîïíīįìôöòóœøōõûüùúūůÿ',
    VOWELS_RE = new RegExp('[' + VOWELS_STRING + ']', 'g'),
    VOWELS = new Set(VOWELS_STRING),
    PUNCTUATION_RE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g,
    THRESHOLD = 0.0002;

/**
 * Helpers.
 */

/**
 * Function used to clean the word and prepare it for the trainer.
 *
 * @param  {string} word - The target word.
 * @return {string}      - The cleaned word.
 */
function clean(word) {
  return word.toLowerCase().replace(PUNCTUATION_RE, '').replace(/\d/g, '');
}

/**
 * Class representing the Legalipy tokenizer. Must be trained before use by
 * providing text tokens in which we will search for relevant onsets.
 *
 * @constructor
 * @param {object} options - Possible options.
 */

var LegalipyTokenizer = exports.LegalipyTokenizer = function () {
  function LegalipyTokenizer() {
    _classCallCheck(this, LegalipyTokenizer);

    // Properties
    this.frequencies = {};
    this.onsets = new Set();
    this.finalized = false;
  }

  /**
   * Method used to train the onsets.
   *
   * @param  {array}             tokens - Word tokens.
   * @return {LegalipyTokenizer}        - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if the tokenizer has finalized its training.
   */


  LegalipyTokenizer.prototype.train = function train(tokens) {

    if (this.finalized) throw new Error('talisman/tokenizers/syllables/legalipy.train: the tokenizer has already finalized its training.');

    var onsets = [];

    // Iterating through the tokens
    for (var i = 0, l = tokens.length; i < l; i++) {
      var token = clean(tokens[i]);

      if (token) {
        var onset = '';

        for (var j = 0, m = token.length; j < m; j++) {
          var letter = token[j];

          if (!VOWELS.has(letter)) onset += letter;else break;
        }

        if (onset) onsets.push(onset);
      }
    }

    // Updating frequencies
    this.frequencies = (0, _frequencies.updateFrequencies)(this.frequencies, onsets);

    return this;
  };

  /**
   * Method used to finalize the training.
   *
   * @return {LegalipyTokenizer} - Returns itself for chaining.
   */


  LegalipyTokenizer.prototype.finalize = function finalize() {
    var _this = this;

    this.finalized = true;

    // Computing relative frequencies of the onsets
    this.frequencies = (0, _frequencies.relative)(this.frequencies);

    // Keeping onsets whose frequency is superior to threshold
    for (var k in this.frequencies) {
      if (this.frequencies[k] > THRESHOLD) this.onsets.add(k);
    }

    // Adding shorter subsets of onsets longer than 2 characters
    this.onsets.forEach(function (onset) {
      if (onset.length > 2) _this.onsets.add(onset.slice(-2));
      if (onset.length > 3) _this.onsets.add(onset.slice(-3));
    });

    // Releasing frequencies from memory
    this.frequencies = null;

    return this;
  };

  /**
   * Method used to tokenize words into syllables once trained.
   *
   * @param  {string} word - Target word.
   * @return {array}       - An array of syllables.
   *
   * @throws {Error} - Will throw if the tokenizer hasn't finalized its training.
   */


  LegalipyTokenizer.prototype.tokenize = function tokenize(word) {
    if (!this.finalized) throw new Error('talisman/tokenizers/syllables/legalipy.train: you should finalize the tokenizer\'s training before being able to tokenize.');

    var vowelCount = (word.match(VOWELS_RE) || []).length;

    var syllables = [];

    if (vowelCount <= 1) {
      syllables.push(word);
    } else {
      var currentSyllable = '',
          onsetBinary = false,
          newSyllableBinary = true;

      // Iterating on the letters in reverse
      for (var i = word.length - 1; i >= 0; i--) {
        var originalLetter = word[i],
            letter = originalLetter.toLowerCase();

        var syllable = currentSyllable.toLowerCase();

        if (newSyllableBinary) {

          currentSyllable = originalLetter + syllable;

          if (VOWELS.has(letter)) {
            newSyllableBinary = false;
            continue;
          }
        } else if (!newSyllableBinary) {

          if (!syllable) {
            currentSyllable = originalLetter + syllable;
          } else if (this.onsets.has(letter) && VOWELS.has(syllable[0]) || this.onsets.has(letter + syllable[0]) && VOWELS.has(syllable[1]) || this.onsets.has(letter + syllable.slice(0, 2)) && VOWELS.has(syllable[2]) || this.onsets.has(letter + syllable.slice(0, 3)) && VOWELS.has(syllable[3])) {
            currentSyllable = originalLetter + syllable;
            onsetBinary = true;
          } else if (VOWELS.has(letter) && !onsetBinary) {
            currentSyllable = originalLetter + syllable;
          } else if (VOWELS.has(letter) && onsetBinary) {
            syllables.unshift(syllable);
            currentSyllable = originalLetter;
          } else {
            syllables.unshift(syllable);
            currentSyllable = originalLetter;
            newSyllableBinary = true;
          }
        }
      }

      syllables.unshift(currentSyllable);
    }

    return syllables;
  };

  /**
   * Method used to export the tokenizer's onsets.
   *
   * @return {object} - An object containing the necessary metadata.
   */


  LegalipyTokenizer.prototype.export = function _export() {
    return {
      onsets: Array.from(this.onsets)
    };
  };

  /**
   * Method used to force JSON.stringify to format the tokenizer using the
   * #.export method.
   */


  LegalipyTokenizer.prototype.toJSON = function toJSON() {
    return this.export();
  };

  /**
   * Method used to import an existing model instead of having to train the
   * tokenizer.
   *
   * @param  {object}            model - The model to import.
   * @return {LegalipyTokenizer}       - Returns itself for chaining.
   */


  LegalipyTokenizer.prototype.import = function _import(model) {
    this.finalize();
    this.onsets = new Set(model.onsets);
  };

  return LegalipyTokenizer;
}();

/**
 * Function that can be used to tokenize a series of word tokens on the fly.
 *
 * @param  {array} tokens - Word tokens.
 * @return {array}        - A list of word tokenized as syllables.
 */


function defaultTokenizer(tokens) {
  var tokenizer = new LegalipyTokenizer();
  tokenizer.train(tokens);
  tokenizer.finalize();

  var newTokens = new Array(tokens.length);

  for (var i = 0, l = tokens.length; i < l; i++) {
    newTokens[i] = tokenizer.tokenize(tokens[i]);
  }return newTokens;
}
module.exports = exports['default'];
exports['default'].LegalipyTokenizer = exports.LegalipyTokenizer;