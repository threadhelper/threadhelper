'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeyCollisionClusterer = undefined;
exports.default = keyCollision;

var _abstract = require('./abstract');

var _abstract2 = _interopRequireDefault(_abstract);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Talisman clustering/key-collision
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ==================================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Simple clustering algorithm running in linear time just applying a
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * keying function to each data point and grouping them when the resulting
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * keys collide.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Key Collision Clusterer class.
 *
 * @constructor
 */
var KeyCollisionClusterer = exports.KeyCollisionClusterer = function (_RecordLinkageCluster) {
  _inherits(KeyCollisionClusterer, _RecordLinkageCluster);

  function KeyCollisionClusterer(params, items) {
    _classCallCheck(this, KeyCollisionClusterer);

    // Validating keyer
    var _this = _possibleConstructorReturn(this, _RecordLinkageCluster.call(this, params, items));

    _this.keyer = params.keys || params.key;
    _this.merge = params.merge || false;

    if (typeof _this.keyer !== 'function') throw new Error('talisman/clustering/record-linkage/key-collision: the given keyer is not a function.');
    return _this;
  }

  KeyCollisionClusterer.prototype.runWithMerge = function runWithMerge() {
    var map = Object.create(null);

    // Computing buckets map
    for (var i = 0, l = this.items.length; i < l; i++) {
      var item = this.items[i],
          keys = [].concat(this.keyer(item, i));

      for (var j = 0, m = keys.length; j < m; j++) {
        var key = keys[j];

        // If the key is falsy, we continue
        if (!key) continue;

        if (!map[key]) map[key] = new Set();
        map[key].add(i);
      }
    }

    // Computing graph
    // TODO: I sense that we can do better & faster
    var graph = Object.create(null);

    for (var _key in map) {
      var bucket = Array.from(map[_key]);

      for (var _i = 0, _l = bucket.length; _i < _l; _i++) {
        for (var _j = _i + 1; _j < _l; _j++) {
          graph[bucket[_i]] = graph[bucket[_i]] || new Set();
          graph[bucket[_i]].add(bucket[_j]);

          graph[bucket[_j]] = graph[bucket[_j]] || new Set();
          graph[bucket[_j]].add(bucket[_i]);
        }
      }
    }

    return (0, _helpers.clustersFromSetGraph)(this.items, graph, this.params.minClusterSize);
  };

  KeyCollisionClusterer.prototype.runWithoutMerge = function runWithoutMerge() {
    var map = Object.create(null);

    // Computing buckets map
    for (var i = 0, l = this.items.length; i < l; i++) {
      var item = this.items[i],
          keys = [].concat(this.keyer(item, i));

      for (var j = 0, m = keys.length; j < m; j++) {
        var key = keys[j];

        // If the key is falsy, we continue
        if (!key) continue;

        if (!map[key]) map[key] = new Set();
        map[key].add(item);
      }
    }

    // Retrieving clusters
    var clusters = [];

    for (var _key2 in map) {
      if (map[_key2].size >= this.params.minClusterSize) clusters.push(Array.from(map[_key2]));
    }

    return clusters;
  };

  KeyCollisionClusterer.prototype.run = function run() {
    if (this.merge) return this.runWithMerge();else return this.runWithoutMerge();
  };

  return KeyCollisionClusterer;
}(_abstract2.default);

/**
 * Shortcut function for the key collision clusterer.
 *
 * @param {object} params - Clusterer parameters.
 * @param {array}  items  - Items to cluster.
 */


function keyCollision(params, items) {
  var clusterer = new KeyCollisionClusterer(params, items);

  return clusterer.run();
}
module.exports = exports['default'];