'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = phonem;

var _helpers = require('../../helpers');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * Talisman phonetics/german/phonem
                                                                                                                                                                                                     * =================================
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * The phonem algorithm.
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * [Reference]:
                                                                                                                                                                                                     * http://web.archive.org/web/20070209153423/http://uni-koeln.de/phil-fak/phonetik/Lehre/MA-Arbeiten/magister_wilz.pdf
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * [Article]:
                                                                                                                                                                                                     * Wilde, Georg ; Meyer, Carsten: Doppelgänger gesucht - Ein Programm fur
                                                                                                                                                                                                     * kontext-sensitive phonetische Textumwandlung. In: ct Magazin fur
                                                                                                                                                                                                     * Computer & Technik 25 (1988)
                                                                                                                                                                                                     */


/**
 * Rules.
 */
var SUBSTITUTIONS = [[/(?:SC|SZ|CZ|TZ|TS)/g, 'C'], [/KS/g, 'X'], [/(?:PF|PH)/g, 'V'], [/QU/g, 'KW'], [/UE/g, 'Y'], [/AE/g, 'E'], [/OE/g, 'Ö'], [/E[IY]/g, 'AY'], [/EU/g, 'OY'], [/AU/g, 'A§'], [/OU/g, '§']];

var TRANSLATION = (0, _helpers.translation)('ZKGQÇÑßFWPTÁÀÂÃÅÄÆÉÈÊËIJÌÍÎÏÜÝ§ÚÙÛÔÒÓÕØ', 'CCCCCNSVVBDAAAAAEEEEEEYYYYYYYYUUUUOOOOÖ');

var ACCEPTABLE_LETTERS = new Set('ABCDLMNORSUVWXYÖ');

/**
 * Function taking a single name and computing its phonem code.
 *
 * @param  {string}  name - The name to process.
 * @return {string}       - The phonem code.
 *
 * @throws {Error} The function expects the name to be a string.
 */
function phonem(name) {
  if (typeof name !== 'string') throw Error('talisman/phonetics/german/phonem: the given name is not a string.');

  var code = name.toUpperCase();

  for (var i = 0, l = SUBSTITUTIONS.length; i < l; i++) {
    var _code;

    code = (_code = code).replace.apply(_code, _toConsumableArray(SUBSTITUTIONS[i]));
  }var translatedCode = '';
  for (var _i = 0, _l = code.length; _i < _l; _i++) {
    translatedCode += TRANSLATION[code[_i]] || code[_i];
  }translatedCode = (0, _helpers.squeeze)(translatedCode);

  code = '';
  for (var _i2 = 0, _l2 = translatedCode.length; _i2 < _l2; _i2++) {
    if (ACCEPTABLE_LETTERS.has(translatedCode[_i2])) code += translatedCode[_i2];
  }

  return code;
}
module.exports = exports['default'];