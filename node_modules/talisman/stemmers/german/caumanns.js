'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = caumanns;
/**
 * Talisman stemmers/german/caumanns
 * ==================================
 *
 * The Caumanns stemmer for the German language.
 *
 * [Reference]:
 * http://edocs.fu-berlin.de/docs/servlets/MCRFileNodeServlet/FUDOCS_derivate_000000000350/tr-b-99-16.pdf
 *
 * [Article]:
 * Jörg Caumanns (1999) A Fast and Simple Stemming Algorithm for German Words.
 */

/**
 * Function stemming the given world using the Caumanns algorithm.
 *
 * @param  {string} word - The word to stem.
 * @return {string}      - The resulting stem.
 */
function caumanns(word) {
  if (!word) return '';

  // Note: this test would break on non-alpha characters
  var upperInitial = word[0] === word.toUpperCase();

  // Basic substitutions
  word = word.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss');

  // Special squeezing
  var stem = word[0];
  for (var i = 1, l = word.length; i < l; i++) {
    stem += word[i] !== word[i - 1] ? word[i] : '*';
  } // Replacing some combinations of letters
  stem = stem.replace(/sch/g, '$').replace(/ch/g, '§').replace(/ei/g, '%').replace(/ie/g, '&').replace(/ig/g, '#').replace(/st/g, '!');

  // Recursive context-free stripping
  while (stem.length > 3) {
    var lastTwoLetters = stem.slice(-2),
        lastLetter = stem[stem.length - 1];

    if (stem.length > 4 && (lastTwoLetters === 'em' || lastTwoLetters === 'er') || stem.length > 5 && lastTwoLetters === 'nd') {
      stem = stem.slice(0, -2);
    } else if (lastLetter === 'e' || lastLetter === 's' || lastLetter === 'n' || !upperInitial && (lastLetter === 't' || lastLetter === '!')) {
      stem = stem.slice(0, -1);
    } else {
      break;
    }
  }

  // Optimizations
  if (stem.length > 5 && stem.slice(-5) === 'erin*') stem = stem.slice(0, -1);

  if (stem[stem.length - 1] === 'z') stem = stem.slice(0, -1) + 'x';

  // Reverse substitutions
  stem = stem.replace(/\$/g, 'sch').replace(/§/g, 'ch').replace(/%/g, 'ei').replace(/&/g, 'ie').replace(/#/g, 'ig').replace(/!/g, 'st');

  // Expand doubled
  var finalStem = stem[0];
  for (var _i = 1, _l = stem.length; _i < _l; _i++) {
    finalStem += stem[_i] === '*' ? finalStem[_i - 1] : stem[_i];
  }if (finalStem.length < 4) finalStem = finalStem.replace('gege', 'ge');

  return finalStem;
}
module.exports = exports['default'];