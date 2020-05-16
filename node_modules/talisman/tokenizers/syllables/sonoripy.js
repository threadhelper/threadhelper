'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.merge = merge;
exports.createTokenizer = createTokenizer;
/* eslint brace-style: 0 */
/* eslint no-multi-spaces: 0 */
/**
 * Talisman tokenizers/syllables/sonoripy
 * =======================================
 *
 * Language-independent syllabification algorithm following the sonority
 * sequencing principle. As opposed to LegaliPy, this algorithm doesn't need
 * to be trained on word tokens but must be provided with the target
 * language's sonority hierarchy.
 *
 * [Reference]:
 * https://github.com/henchc/SonoriPy
 *
 * [Authors]:
 * Christopher Hench (UC Berkeley)
 * Alex Estes
 */

/**
 * Constants.
 */
var DEFAULT_HIERARCHY = ['aeiouy', // Vowels      3pts
'lmnrw', // Nasals      2pts
'zvsf', // Fricatives  1pts
'bcdgtkpqxhj' // Stops       0pts
];

/**
 * Helpers.
 */

/**
 * Function dropping some useless leading & trailing characters in the given
 * string.
 *
 * @param  {string} string - Target string.
 * @return {string}        - The stripped string.
 */
function strip(string) {
  return string.replace(/(?:^[.:;?!()'"]+)|(?:[.:;?!()'"]+$)/g, '');
}

/**
 * Function used to retokenize syllables tokens by avoiding parts that would
 * not have vowels at all by merging them with the precedent token.
 *
 * @param  {RegExp} vowelsRegex - The regex used to test the presence of
 *                                vowels in the syllables.
 * @param  {array}  syllables   - The tokens.
 * @return {array}              - The merged tokens.
 */
function merge(vowelsRegex, syllables) {
  var safeSyllables = [],
      front = '';

  for (var i = 0, l = syllables.length; i < l; i++) {
    var syllable = syllables[i];

    if (!vowelsRegex.test(syllable)) {
      if (!safeSyllables.length) front += syllable;else safeSyllables = safeSyllables.slice(0, -1).concat(safeSyllables.slice(-1) + syllable);
    } else {
      if (!safeSyllables.length) safeSyllables.push(front + syllable);else safeSyllables.push(syllable);
    }
  }

  return safeSyllables;
}

/**
 * Tokenizer function factory aiming at building the required function.
 *
 * @param  {object}   options              - Possible options:
 * @param  {array}    [options.hierarchy]  - Target language's hierarchy.
 * @return {function}                      - The tokenizer function.
 */
function createTokenizer(options) {
  options = options || {};

  var hierarchy = options.hierarchy;

  if (!hierarchy) throw new Error('talisman/tokenizers/syllables/sonoripy: a hierachy must be provided.');

  var vowels = hierarchy[0],
      vowelsSet = new Set(vowels);

  // Creating the map of values
  var map = {};

  hierarchy.forEach(function (level, i) {
    var letters = level.split(''),
        value = hierarchy.length - i - 1;

    letters.forEach(function (letter) {
      return map[letter] = value;
    });
  });

  // Creating a vowel regex
  var vowelsRegex = new RegExp('[' + vowels + ']');

  /**
   * Created tokenizer function.
   *
   * @param  {string} word - The word to tokenize.
   * @return {array}       - The syllables as tokens.
   */
  return function (word) {

    // Normalizing the word
    var normalizedWord = strip(word);

    //-- 1) Tagging letters & counting vowels
    var vowelCount = 0;
    var taggedLetters = [];

    for (var i = 0, l = normalizedWord.length; i < l; i++) {
      var letter = normalizedWord[i],
          lowerLetter = letter.toLowerCase();

      if (vowelsSet.has(lowerLetter)) vowelCount++;

      taggedLetters.push([letter, map[letter] || 0]);
    }

    //-- 2) Dividing the syllables
    var syllables = [];

    // If the word is monosyllabic, we can stop right there
    if (vowelCount <= 1) return [word];

    var syllable = taggedLetters[0][0];

    for (var _i = 1, _l = taggedLetters.length; _i < _l; _i++) {
      var _taggedLetters$_i = taggedLetters[_i],
          _letter = _taggedLetters$_i[0],
          value = _taggedLetters$_i[1],
          valueBefore = (taggedLetters[_i - 1] || [])[1],
          valueAfter = (taggedLetters[_i + 1] || [])[1];

      // If we reached the end of the word

      if (_i === _l - 1) {
        syllable += _letter;
        syllables.push(syllable);
      }

      // Cases triggering syllable break
      else if (value === valueAfter && value === valueBefore || value === valueAfter && value < valueBefore) {
          syllable += _letter;
          syllables.push(syllable);
          syllable = '';
        } else if (value < valueAfter && value < valueBefore) {
          syllables.push(syllable);
          syllable = _letter;
        }

        // Cases that do not trigger syllable break
        // (I dropped the condition & placed it as else because it hurts
        // performance otherwise)
        else /* if (
             (value < valueAfter && value > valueBefore) ||
             (value > valueAfter && value < valueBefore) ||
             (value > valueAfter && value > valueBefore) ||
             (value > valueAfter && value === valueBefore) ||
             (value === valueAfter && value > valueBefore) ||
             (value < valueAfter && value === valueBefore)
             ) */{
            syllable += _letter;
          }
    }

    //-- 3) Ensuring we don't have a syllable without vowel
    var safeSyllables = merge(vowelsRegex, syllables);

    return safeSyllables;
  };
}

/**
 * Exporting a default version of the tokenizer.
 */
var defaultTokenizer = createTokenizer({ hierarchy: DEFAULT_HIERARCHY });
exports.default = defaultTokenizer;
module.exports = exports['default'];
exports['default'].merge = exports.merge;
exports['default'].createTokenizer = exports.createTokenizer;