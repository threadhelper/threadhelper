'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = conll;
/**
 * Talisman parsers/conll
 * =======================
 *
 * A parser for the CONLL corpus files.
 */

/**
 * Function taking a CONLL corpus' text and returning an array of sentences
 * being arrays of (word, brill_tag, wsj_tag).
 *
 * @param  {string} text - The text to parse.
 * @return {array}       - The tokens.
 */
function conll(text) {
  var sentences = [],
      lines = text.split('\n');

  var sentence = [];
  for (var i = 0, l = lines.length; i < l; i++) {
    var line = lines[i];

    if (!line) {
      if (sentence.length) {
        sentences.push(sentence);
        sentence = [];
      }
    } else {
      sentence.push(line.split(' '));
    }
  }

  if (sentence.length) sentences.push(sentence);

  return sentences;
}
module.exports = exports['default'];