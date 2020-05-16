'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VPTreeClusterer = undefined;
exports.default = vpTree;

var _vpTree = require('mnemonist/vp-tree');

var _vpTree2 = _interopRequireDefault(_vpTree);

var _abstract = require('./abstract');

var _abstract2 = _interopRequireDefault(_abstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Talisman clustering/vp-tree
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ============================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Clustering method using a Vantage Point Tree (VPTree) to find the clusters
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * more efficiently.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Vantage Point Tree Clusterer class.
 *
 * @constructor
 */
var VPTreeClusterer = exports.VPTreeClusterer = function (_RecordLinkageCluster) {
  _inherits(VPTreeClusterer, _RecordLinkageCluster);

  function VPTreeClusterer(params, items) {
    _classCallCheck(this, VPTreeClusterer);

    // Validating radius
    var _this = _possibleConstructorReturn(this, _RecordLinkageCluster.call(this, params, items));

    if (typeof params.radius !== 'number') throw new Error('talisman/clustering/record-linkage/vp-tree: the given radius is not a number.');

    // Validating the distance function
    if (typeof params.distance !== 'function') throw new Error('talisman/clustering/record-linkage/vp-tree: the given distance is not a function.');

    // Properties
    _this.radius = params.radius;
    _this.distance = params.distance;
    return _this;
  }

  VPTreeClusterer.prototype.run = function run() {

    // Building the tree
    var tree = new _vpTree2.default(this.distance, this.items);

    // Retrieving the clusters
    var clusters = [],
        visited = new Set();

    for (var i = 0, l = this.items.length; i < l; i++) {
      var item = this.items[i];

      if (visited.has(item)) continue;

      var neighbors = tree.neighbors(this.radius, item);

      var cluster = new Array(neighbors.length);

      for (var j = 0, m = neighbors.length; j < m; j++) {
        visited.add(neighbors[j].item);
        cluster[j] = neighbors[j].item;
      }

      if (cluster.length >= this.params.minClusterSize) clusters.push(cluster);
    }

    return clusters;
  };

  return VPTreeClusterer;
}(_abstract2.default);

/**
 * Shortcut function for the vantage point tree clusterer.
 *
 * @param {object} params - Clusterer parameters.
 * @param {array}  items  - Items to cluster.
 */


function vpTree(params, items) {
  var clusterer = new VPTreeClusterer(params, items);

  return clusterer.run();
}
module.exports = exports['default'];