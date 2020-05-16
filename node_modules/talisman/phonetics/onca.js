'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = onca;

var _soundex = require('./soundex');

var _soundex2 = _interopRequireDefault(_soundex);

var _nysiis = require('./nysiis');

var _nysiis2 = _interopRequireDefault(_nysiis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Function taking a single name and computing its ONCA code.
 *
 * @param  {string}  name - The name to process.
 * @return {string}       - The ONCA code.
 */
/**
 * Talisman phonetics/onca
 * ========================
 *
 * The Oxford Name Compression Algorithm. This is basically a glorified
 * NYSIIS + Soundex combination.
 */
function onca(name) {
  return (0, _soundex2.default)((0, _nysiis2.default)(name));
}
module.exports = exports['default'];