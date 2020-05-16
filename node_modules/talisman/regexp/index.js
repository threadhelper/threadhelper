'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeRegexp = escapeRegexp;
exports.createFuzzyPattern = createFuzzyPattern;
/**
 * Talisman regexp
 * ================
 *
 * Some RegExp-related helpers.
 */

/**
 * Function escaping a string for insertion in a regular expression.
 *
 * @param  {string} string - The string to escape.
 * @return {string}        - The escaped string.
 */
var RE = /([|\\{}()[\]^$+*?.\-])/g;

function escapeRegexp(string) {
  return string.replace(RE, '\\$1');
}

/**
 * Function creating a fuzzy matching pattern from the given query.
 *
 * @param  {string} string - The string to escape.
 * @return {string}        - The created pattern.
 */
function createFuzzyPattern(query) {
  return query.split('').map(function (character) {
    return '(' + escapeRegexp(character) + ')';
  }).join('.*?');
}