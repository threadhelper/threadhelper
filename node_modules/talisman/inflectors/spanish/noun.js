'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.singularize = singularize;

var _helpers = require('../../helpers');

/**
 * Constants.
 */
var ACCENT_MAP = (0, _helpers.translation)('AEIOUaeiou', 'ÁÉÍÓÚáéíóú'); /**
                                                                         * Talisman inflectors/spanish/noun
                                                                         * =================================
                                                                         *
                                                                         * A noun inflector for the Spanish language.
                                                                         *
                                                                         * [Reference]:
                                                                         * https://github.com/bermi/Python-Inflector
                                                                         *
                                                                         * [Auhors]:
                                                                         * Bermi Ferrer Martinez
                                                                         * Carles Sadurní Anguita
                                                                         */


var SINGULAR_RULES = [[/^([bcdfghjklmnñpqrstvwxyz]*)([aeiou])([ns])es$/i, '$1$2$3'], [/([aeiou])([ns])es$/i, '$1$2', true], [/shes$/i, 'sh'], [/oides$/i, 'oide'], [/(sis|tis|xis)$/i, '$1'], [/(é)s$/i, '$1'], [/(ces)$/i, 'z'], [/([^e])s$/i, '$1'], [/([bcdfghjklmnñprstvwxyz]{2,}e)s$/i, '$1'], [/([ghñptv]e)s$/i, '$1'], [/jes$/i, 'je'], [/ques$/i, 'que'], [/es$/i, '']];

var IMMUTABLE_WORDS = new Set(['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'paraguas', 'tijeras', 'gafas', 'vacaciones', 'víveres', 'cumpleaños', 'virus', 'atlas', 'sms', 'hummus']);

var IRREGULAR_SINGULAR_TO_PLURAL = {
  base: 'bases',
  carácter: 'caracteres',
  champú: 'champús',
  curriculum: 'currículos',
  espécimen: 'especímenes',
  jersey: 'jerséis',
  memorándum: 'memorandos',
  menú: 'menús',
  no: 'noes',
  país: 'países',
  referéndum: 'referendos',
  régimen: 'regímenes',
  sándwich: 'sándwiches',
  si: 'sis',
  taxi: 'taxis',
  ultimátum: 'ultimatos'
};

var IRREGULAR_PLURAL_TO_SINGULAR = {};

for (var singular in IRREGULAR_SINGULAR_TO_PLURAL) {
  IRREGULAR_PLURAL_TO_SINGULAR[IRREGULAR_SINGULAR_TO_PLURAL[singular]] = singular;
} /**
   * Function used to apply source word's case to target word.
   *
   * @param  {string} source - Source word.
   * @param  {string} target - Target word.
   * @return {string}
   */
function transferCase(source, target) {
  var cased = '';

  for (var i = 0, l = target.length; i < l; i++) {
    var c = source[i].toLowerCase() === source[i] ? 'toLowerCase' : 'toUpperCase';

    cased += target[i][c]();
  }

  return cased;
}

/**
 * Function used to inflect nouns to their singular form.
 *
 * @param  {string} noun - Noun to inflect.
 * @return {string}      - The singular version.
 */
function singularize(noun) {
  var lowerCaseNoun = noun.toLowerCase();

  // Checking immutable words
  if (IMMUTABLE_WORDS.has(lowerCaseNoun)) return noun;

  // Checking irregulars
  var irregular = IRREGULAR_PLURAL_TO_SINGULAR[noun];

  if (irregular) return transferCase(noun, irregular);

  // Applying rules
  for (var i = 0, l = SINGULAR_RULES.length; i < l; i++) {
    var _SINGULAR_RULES$i = SINGULAR_RULES[i],
        pattern = _SINGULAR_RULES$i[0],
        replacement = _SINGULAR_RULES$i[1],
        accent = _SINGULAR_RULES$i[2];


    var match = pattern.test(noun);

    if (match) {

      var _singular = void 0;

      // Watching out for accents
      if (accent) _singular = noun.replace(pattern, function (_, m1, m2) {
        return ACCENT_MAP[m1] + m2;
      });else _singular = noun.replace(pattern, replacement);

      return _singular;
    }
  }

  return noun;
}