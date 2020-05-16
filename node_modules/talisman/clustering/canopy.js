'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanopyClusterer = undefined;
exports.default = canopy;

var _abstract = require('./abstract');

var _abstract2 = _interopRequireDefault(_abstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Talisman clustering/canopy
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ===========================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Canopy clustering implementation.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Canopy Clusterer class.
 *
 * @constructor
 */
var CanopyClusterer = exports.CanopyClusterer = function (_RecordLinkageCluster) {
  _inherits(CanopyClusterer, _RecordLinkageCluster);

  function CanopyClusterer(params, items) {
    _classCallCheck(this, CanopyClusterer);

    // Validating the distance function
    var _this = _possibleConstructorReturn(this, _RecordLinkageCluster.call(this, params, items));

    if (typeof params.distance !== 'function') throw new Error('talisman/clustering/record-linkage/canopy: the given distance is not a function.');

    // Validating the thresholds
    if (typeof params.loose !== 'number') throw new Error('talisman/clustering/record-linkage/canopy: the given loose distance is not a number.');
    if (typeof params.tight !== 'number') throw new Error('talisman/clustering/record-linkage/canopy: the given tight distance is not a number.');

    if (params.loose < params.tight) throw new Error('talisman/clustering/record-linkage/canopy: loose distance should be greater than tight distance.');

    _this.distance = params.distance;
    _this.params.loose = params.loose;
    _this.params.tight = params.tight;
    return _this;
  }

  CanopyClusterer.prototype.run = function run() {
    var itemsIndex = {},
        clusters = [];

    for (var i = 0, l = this.items.length; i < l; i++) {
      itemsIndex[i] = true;
    }for (var k in itemsIndex) {
      var a = this.items[k];

      // Starting a new canopy
      delete itemsIndex[k];
      var cluster = [a];

      // Comparing to other elements in the set
      for (var k2 in itemsIndex) {
        var b = this.items[k2],
            d = this.distance(a, b);

        if (d <= this.params.loose) cluster.push(b);

        if (d <= this.params.tight) delete itemsIndex[k2];
      }

      clusters.push(cluster);
    }

    return clusters;
  };

  return CanopyClusterer;
}(_abstract2.default);

/**
 * Shortcut function for the canopy clusterer.
 *
 * @param {object} params - Clusterer parameters.
 * @param {array}  items  - Items to cluster.
 */


function canopy(params, items) {
  var clusterer = new CanopyClusterer(params, items);

  return clusterer.run();
}
module.exports = exports['default'];