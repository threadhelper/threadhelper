"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lines;
/**
 * Talisman tokenizers/lines/naive
 * ================================
 *
 * A very simple line splitter.
 *
 * [Author]: Guillaume PLIQUE
 */

/**
 * Regex.
 */
var LINES = /(?:\r\n|\n\r|\n|\r)/;

/**
 * Function tokenizing raw text into a sequence of lines.
 *
 * @param  {string} text - The text to tokenize.
 * @return {array}       - The tokens.
 */
function lines(text) {
  return text.split(LINES);
}
module.exports = exports["default"];