'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.nameFingerprint = exports.ngramsFingerprint = undefined;
exports.createKeyer = createKeyer;

var _fingerprint = require('../tokenizers/fingerprint');

var _name = require('../tokenizers/fingerprint/name');

var _name2 = _interopRequireDefault(_name);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Talisman keyers/fingerprint
 * ============================
 *
 * Keyer based on the fingerprint tokenizer.
 */
function createKeyer(options) {
  options = options || {};

  var tokenizer = (0, _fingerprint.createTokenizer)(options);

  if (options.ngrams) return function (n, string) {
    return tokenizer(n, string).join('');
  };

  return function (string) {
    return tokenizer(string).join(' ');
  };
}

exports.default = createKeyer();


var ngramsFingerprint = createKeyer({ ngrams: true });

var nameFingerprint = function nameFingerprint(name) {
  return (0, _name2.default)(name).join(' ');
};

exports.ngramsFingerprint = ngramsFingerprint;
exports.nameFingerprint = nameFingerprint;
module.exports = exports['default'];
exports['default'].createKeyer = exports.createKeyer;
exports['default'].ngramsFingerprint = exports.ngramsFingerprint;
exports['default'].nameFingerprint = exports.nameFingerprint;