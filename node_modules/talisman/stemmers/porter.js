'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = porter;
/* eslint no-cond-assign: 0 */
/**
 * Talisman stemmers/porter
 * =========================
 *
 * The classical Porter stemmer.
 *
 * [Reference]:
 * http://tartarus.org/martin/PorterStemmer/
 *
 * [Article]:
 * C.J. van Rijsbergen, S.E. Robertson and M.F. Porter, 1980. New models in
 * probabilistic information retrieval. London: British Library.
 * (British Library Research and Development Report, no. 5587).
 */

/**
 * Suffixes.
 */
var STEP2_SUFFIXES = ['ational', 'tional', 'enci', 'anci', 'izer', 'bli', 'alli', 'entli', 'eli', 'ousli', 'ization', 'ation', 'ator', 'alism', 'iveness', 'fulness', 'ousness', 'aliti', 'iviti', 'biliti', 'logi'];

var STEP3_SUFFIXES = ['icate', 'ative', 'alize', 'iciti', 'ical', 'ful', 'ness'];

var STEP4_SUFFIXES = ['al', 'ance', 'ence', 'er', 'ic', 'able', 'ible', 'ant', 'ement', 'ment', 'ent', 'ou', 'ism', 'ate', 'iti', 'ous', 'ive', 'ize'];

var STEP2_SUFFIXES_REGEX = new RegExp('^(.+?)(' + STEP2_SUFFIXES.join('|') + ')$'),
    STEP3_SUFFIXES_REGEX = new RegExp('^(.+?)(' + STEP3_SUFFIXES.join('|') + ')$'),
    STEP4_SUFFIXES_REGEX = new RegExp('^(.+?)(' + STEP4_SUFFIXES.join('|') + ')$');

/**
 * Steps maps.
 */
var STEP2_MAP = {
  ational: 'ate',
  tional: 'tion',
  enci: 'ence',
  anci: 'ance',
  izer: 'ize',
  bli: 'ble',
  alli: 'al',
  entli: 'ent',
  eli: 'e',
  ousli: 'ous',
  ization: 'ize',
  ation: 'ate',
  ator: 'ate',
  alism: 'al',
  iveness: 'ive',
  fulness: 'ful',
  ousness: 'ous',
  aliti: 'al',
  iviti: 'ive',
  biliti: 'ble',
  logi: 'log'
};

var STEP3_MAP = {
  icate: 'ic',
  ative: '',
  alize: 'al',
  iciti: 'ic',
  ical: 'ic',
  ful: '',
  ness: ''
};

/**
 * Patterns.
 */
var C = '[^aeiou]',
    V = '[aeiouy]',
    CC = '' + C + C + '*',
    VV = '' + V + V + '*';

var MGR0 = new RegExp('^(' + CC + ')?' + VV + CC),
    MEQ1 = new RegExp('^(' + CC + ')?' + VV + CC + '(' + VV + ')?$'),
    MGR1 = new RegExp('^(' + CC + ')?' + VV + CC + VV + CC),
    VOWEL_IN_STEM = new RegExp('^(' + CC + ')?' + V);

var STEP1a1 = /^(.+?)(ss|i)es$/,
    STEP1a2 = /^(.+?)([^s])s$/;

var STEP1b1 = /^(.+?)eed$/,
    STEP1b2 = /^(.+?)(ed|ing)$/,
    STEP1b3 = /(at|bl|iz)$/,
    STEP1b4 = /([^aeiouylsz])\1$/,
    STEP1b5 = new RegExp('^' + CC + V + '[^aeiouwxy]$');

var STEP1c = new RegExp('^(.*' + V + '.*)y$');

var STEP4 = /^(.+?)(s|t)(ion)$/;

var STEP51 = /^(.+?)e$/,
    STEP52 = new RegExp('^' + CC + V + '[^aeiouwxy]$');

/**
 * Helpers.
 */
function chop(string) {
  return string.slice(0, -1);
}

function match(regex, string) {
  var m = regex.exec(string);
  regex.lastIndex = 0;
  return m;
}

/**
 * Function stemming the given world using the Porter algorithm.
 *
 * @param  {string} word - The word to stem.
 * @return {string}      - The resulting stem.
 */
function porter(word) {
  word = word.toLowerCase();

  // If the word is too short, we return it unscathed
  if (word.length < 3) return word;

  var m = null;

  // If the first letter is a Y, we uppercase it so it's not treated as vowel
  if (word[0] === 'y') word = 'Y' + word.slice(1);

  //-- Step 1a
  word = word.replace(STEP1a1, '$1$2');
  word = word.replace(STEP1a2, '$1$2');

  //-- Step 1b
  if (m = match(STEP1b1, word)) {
    var _m = m,
        stem = _m[1];


    if (MGR0.test(stem)) word = chop(word);
  } else if (m = match(STEP1b2, word)) {
    var _m2 = m,
        _stem = _m2[1];


    if (VOWEL_IN_STEM.test(_stem)) {
      word = _stem;

      if (STEP1b3.test(word)) word = word + 'e';else if (STEP1b4.test(word)) word = chop(word);else if (STEP1b5.test(word)) word = word + 'e';
    }
  }

  //-- Step 1c
  if (m = match(STEP1c, word)) {
    var _m3 = m,
        _stem2 = _m3[1];


    word = _stem2 + 'i';
  }

  //-- Step 2
  if (m = match(STEP2_SUFFIXES_REGEX, word)) {
    var _m4 = m,
        _stem3 = _m4[1],
        suffix = _m4[2];


    if (MGR0.test(_stem3)) word = _stem3 + STEP2_MAP[suffix];
  }

  //-- Step 3
  if (m = match(STEP3_SUFFIXES_REGEX, word)) {
    var _m5 = m,
        _stem4 = _m5[1],
        _suffix = _m5[2];


    if (MGR0.test(_stem4)) word = _stem4 + STEP3_MAP[_suffix];
  }

  //-- Step 4
  if (m = match(STEP4_SUFFIXES_REGEX, word)) {
    var _m6 = m,
        _stem5 = _m6[1];


    if (MGR1.test(_stem5)) word = _stem5;
  } else if (m = match(STEP4, word)) {
    var _m7 = m,
        first = _m7[1],
        second = _m7[2],
        _stem6 = first + second;

    if (MGR1.test(_stem6)) word = _stem6;
  }

  //-- Step 5
  if (m = match(STEP51, word)) {
    var _m8 = m,
        _stem7 = _m8[1];


    if (MGR1.test(_stem7) || MEQ1.test(_stem7) && !STEP52.test(_stem7)) word = _stem7;
  }

  if (/ll$/.test(word) && MGR1.test(word)) word = chop(word);

  return word.toLowerCase();
}
module.exports = exports['default'];