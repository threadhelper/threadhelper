'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LeaderClusterer = undefined;
exports.default = leader;

var _abstract = require('./abstract');

var _abstract2 = _interopRequireDefault(_abstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Talisman clustering/leader
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ===========================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * The Leader clustering algorithm is a quite simple algorithm used to partition
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * arbitrary data and running in O(ln) time complexity, l being the number of
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * clusters.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * It's also important to note that the resulting partition might change with
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the order of given items.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Leader Clusterer class.
 *
 * @constructor
 */
var LeaderClusterer = exports.LeaderClusterer = function (_RecordLinkageCluster) {
  _inherits(LeaderClusterer, _RecordLinkageCluster);

  function LeaderClusterer(params, items) {
    _classCallCheck(this, LeaderClusterer);

    // Validating the distance function
    var _this = _possibleConstructorReturn(this, _RecordLinkageCluster.call(this, params, items));

    if (typeof params.distance !== 'function') throw new Error('talisman/clustering/record-linkage/leader: the given distance is not a function.');

    // Validating the thresholds
    if (typeof params.threshold !== 'number') throw new Error('talisman/clustering/record-linkage/leader: the given threshold is not a number.');

    _this.distance = params.distance;
    _this.params.threshold = params.threshold;
    return _this;
  }

  LeaderClusterer.prototype.run = function run() {
    var clusters = [];

    for (var i = 0, l = this.items.length; i < l; i++) {
      var item = this.items[i];

      var closestClusterIndex = null,
          closest = Infinity;

      for (var j = 0, m = clusters.length; j < m; j++) {
        var clusterLeader = clusters[j][0],
            distance = this.distance(clusterLeader, item);

        if (distance < closest) {
          closest = distance;
          closestClusterIndex = j;
        }
      }

      if (closest <= this.params.threshold) {
        clusters[closestClusterIndex].push(item);
      } else {
        clusters.push([item]);
      }
    }

    return clusters;
  };

  return LeaderClusterer;
}(_abstract2.default);

/**
 * Shortcut function for the leader clusterer.
 *
 * @param {object} params - Clusterer parameters.
 * @param {array}  items  - Items to cluster.
 */


function leader(params, items) {
  var clusterer = new LeaderClusterer(params, items);

  return clusterer.run();
}
module.exports = exports['default'];