'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NaiveClusterer = undefined;
exports.default = naive;

var _abstract = require('./abstract');

var _abstract2 = _interopRequireDefault(_abstract);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Talisman clustering/naive
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ==========================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Naive clustering working by performing the n(n-1)/2 distance calculations
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * between all relevant pairs. Time complexity of such a clustering is therefore
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * O(n^2), which is quite bad.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Note that the produced clusters are fuzzy.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Naive Clusterer class.
 *
 * @constructor
 */
var NaiveClusterer = exports.NaiveClusterer = function (_RecordLinkageCluster) {
  _inherits(NaiveClusterer, _RecordLinkageCluster);

  function NaiveClusterer(params, items) {
    _classCallCheck(this, NaiveClusterer);

    var _this = _possibleConstructorReturn(this, _RecordLinkageCluster.call(this, params, items));

    (0, _helpers.handleSimilarityPolymorphisms)(_this, params);
    return _this;
  }

  NaiveClusterer.prototype.run = function run() {
    var graph = {};

    // Iterating over the needed pairs
    for (var i = 0, l = this.items.length; i < l; i++) {
      var a = this.items[i];

      for (var j = i + 1; j < l; j++) {
        var b = this.items[j];

        if (this.similarity(a, b)) {
          graph[i] = graph[i] || [];
          graph[i].push(j);

          // NOTE: undirected link seems to be mandatory for it to work
          graph[j] = graph[j] || [];
          graph[j].push(i);
        }
      }
    }

    // Computing clusters
    return (0, _helpers.clustersFromArrayGraph)(this.items, graph, this.params.minClusterSize);
  };

  return NaiveClusterer;
}(_abstract2.default);

/**
 * Shortcut function for the naive clusterer.
 *
 * @param {object} params - Clusterer parameters.
 * @param {array}  items  - Items to cluster.
 */


function naive(params, items) {
  var clusterer = new NaiveClusterer(params, items);

  return clusterer.run();
}
module.exports = exports['default'];