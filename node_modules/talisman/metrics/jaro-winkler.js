'use strict';

Object.defineProperty(exports, "__esModule", {
  value: false
});
exports.distance = exports.similarity = exports.custom = undefined;

var _jaro = require('./jaro');

var _jaro2 = _interopRequireDefault(_jaro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Function returning the Jaro-Winkler score between two sequences.
 *
 * @param  {object} options - Custom options.
 * @param  {mixed}  a       - The first sequence.
 * @param  {mixed}  b       - The second sequence.
 * @return {number}         - The Jaro-Winkler score between a & b.
 */
function customJaroWinkler(options, a, b) {
  options = options || {};

  var _options = options,
      _options$boostThresho = _options.boostThreshold,
      boostThreshold = _options$boostThresho === undefined ? 0.7 : _options$boostThresho,
      _options$scalingFacto = _options.scalingFactor,
      scalingFactor = _options$scalingFacto === undefined ? 0.1 : _options$scalingFacto;


  if (scalingFactor > 0.25) throw Error('talisman/metrics/distance/jaro-winkler: the scaling factor should not exceed 0.25.');

  if (boostThreshold < 0 || boostThreshold > 1) throw Error('talisman/metrics/distance/jaro-winkler: the boost threshold should be comprised between 0 and 1.');

  // Fast break
  if (a === b) return 1;

  // Computing Jaro-Winkler score
  var dj = (0, _jaro2.default)(a, b);

  if (dj < boostThreshold) return dj;

  var p = scalingFactor;
  var l = 0;

  var prefixLimit = Math.min(a.length, b.length, 4);

  // Common prefix (up to 4 characters)
  for (var i = 0; i < prefixLimit; i++) {
    if (a[i] === b[i]) l++;else break;
  }

  return dj + l * p * (1 - dj);
}

/**
 * Jaro-Winkler standard function.
 */
/**
 * Talisman metrics/jaro-winkler
 * ==============================
 *
 * Function computing the Jaro-Winkler score.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance
 *
 * [Article]:
 * Winkler, W. E. (1990). "String Comparator Metrics and Enhanced Decision Rules
 * in the Fellegi-Sunter Model of Record Linkage".
 * Proceedings of the Section on Survey Research Methods
 * (American Statistical Association): 354–359.
 *
 * [Tags]: semimetric, string metric.
 */
var jaroWinkler = customJaroWinkler.bind(null, null);

/**
 * Jaro-Winkler distance is 1 - the Jaro-Winkler score.
 */
var distance = function distance(a, b) {
  return 1 - jaroWinkler(a, b);
};

/**
 * Exporting.
 */
exports.default = jaroWinkler;
exports.custom = customJaroWinkler;
exports.similarity = jaroWinkler;
exports.distance = distance;
module.exports = exports['default'];
exports['default'].custom = exports.custom;
exports['default'].similarity = exports.similarity;
exports['default'].distance = exports.distance;