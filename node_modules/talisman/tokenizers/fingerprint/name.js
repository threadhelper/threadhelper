'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nameFingerprint;

var _ = require('./');

var _helpers = require('../../helpers');

// TODO: handle roman numerals
// TODO: O'
// TODO: sort stopwords by length then alphabet

/**
 * Talisman tokenizers/fingerprint/name
 * =====================================
 *
 * Variant of the fingerprint tokenizer but with opinionated options and
 * transformations known to work better with occidental names.
 */
var RULES = [

// McCallister / MacCallister
[/\bmc(?=\w)/g, 'mac'], [/\b(ma?c\s+)(?=\w)/g, 'mac'],

// Lee / Li
[/\blee\b/g, 'li'],

// Moussorgski / Moussorgsky
[/ski\b/g, 'sky'],

// Van Hoff / Von Hoff
[/\bvan\b/g, 'von'],

// Doerk / Dörk
[/ö/g, 'oe'],

// Düring / Duering
[/ü/g, 'ue']];

var OPTIONS = {
  digits: false,
  split: ['-'],
  stopwords: [

  // Articles etc.
  'the', 'le', 'la', 'da', 'di', 'of',

  // Title
  'doctor', 'dr', 'esq', 'mgr', 'professor', 'prof', 'md', 'phd', 'sir', 'lord',

  // Civility
  'mr', 'mrs', 'ms', 'mme', 'mlle', 'jr', 'junior', 'sr', 'senior']
};

var tokenizer = (0, _.createTokenizer)(OPTIONS);

/**
 * Function returning the fingerprint of the given name.
 *
 * @param  {string} name - Target name.
 * @param  {array}
 */
function nameFingerprint(name) {
  name = name.toLowerCase();

  // Applying rules
  for (var i = 0, l = RULES.length; i < l; i++) {
    name = name.replace(RULES[i][0], RULES[i][1]);
  }return tokenizer(name).map(_helpers.squeeze);
}
module.exports = exports['default'];