"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = paragraphs;
/**
 * Talisman tokenizers/paragraphs/naive
 * =====================================
 *
 * A very simple paragraph tokenizer.
 *
 * [Author]: Guillaume PLIQUE
 */

/**
 * Regex.
 */
var PARAGRAPHS = /(?:\n\r|\r\n|\r|\n)[\t\s]*(?:\n\r|\r\n|\r|\n)+/;

/**
 * Function tokenizing raw text into a sequence of paragraphs.
 *
 * @param  {string} text - The text to tokenize.
 * @return {array}       - The tokens.
 */
function paragraphs(text) {
  return text.split(PARAGRAPHS);
}
module.exports = exports["default"];