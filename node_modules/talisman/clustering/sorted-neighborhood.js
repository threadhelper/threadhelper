'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortedNeighborhoodClusterer = undefined;
exports.default = sortedNeighborhood;

var _abstract = require('./abstract');

var _abstract2 = _interopRequireDefault(_abstract);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Talisman clustering/sorted-neighborhood
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ========================================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Clustering method first sorting the dataset before applying pairwise
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * comparisons only within the given window. Time complexity is quite
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * better than the naive approach: O(n(w+log n)).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Sorted Neighborhood Clusterer class.
 *
 * @constructor
 */
var SortedNeighborhoodClusterer = exports.SortedNeighborhoodClusterer = function (_RecordLinkageCluster) {
  _inherits(SortedNeighborhoodClusterer, _RecordLinkageCluster);

  function SortedNeighborhoodClusterer(params, items) {
    _classCallCheck(this, SortedNeighborhoodClusterer);

    var _this = _possibleConstructorReturn(this, _RecordLinkageCluster.call(this, params, items));

    (0, _helpers.handleSimilarityPolymorphisms)(_this, params);

    if (typeof params.window !== 'number' || params.window < 1) throw new Error('talisman/clustering/record-linkage/sorted-neighborhood: the given window should be a number > 0.');

    _this.window = params.window;

    var comparators = [].concat(params.comparator || params.comparators);

    if (comparators.some(function (comparator) {
      return typeof comparator !== 'function';
    })) throw new Error('talisman/clustering/record-linkage/sorted-neighborhood: the given comparators should all be functions.');

    _this.comparators = comparators;

    // Cloning items because we are going to mutate the array
    _this.sorted = new Array(_this.items.length);

    for (var i = 0, l = _this.items.length; i < l; i++) {
      _this.sorted[i] = i;
    }
    return _this;
  }

  SortedNeighborhoodClusterer.prototype.run = function run() {
    var _this2 = this;

    var graph = {},
        w = this.window;

    // Applying comparators

    var _loop = function _loop(c, d) {
      var comparator = _this2.comparators[c];

      // Sorting items
      _this2.sorted.sort(function (a, b) {
        return comparator(_this2.items[a], _this2.items[b]);
      });

      // Performing pairwise comparisons within allowed window
      for (var i = 0, l = _this2.sorted.length; i < l; i++) {
        var aIndex = _this2.sorted[i],
            a = _this2.items[aIndex];

        for (var j = i + 1, m = Math.min(l, 1 + i + w); j < m; j++) {
          var bIndex = _this2.sorted[j],
              b = _this2.items[bIndex];

          if (_this2.similarity(a, b)) {
            graph[aIndex] = graph[aIndex] || new Set();
            graph[aIndex].add(bIndex);

            // NOTE: undirected link seems to be mandatory for it to work
            graph[bIndex] = graph[bIndex] || new Set();
            graph[bIndex].add(aIndex);
          }
        }
      }
    };

    for (var c = 0, d = this.comparators.length; c < d; c++) {
      _loop(c, d);
    }

    return (0, _helpers.clustersFromSetGraph)(this.items, graph, this.params.minClusterSize);
  };

  return SortedNeighborhoodClusterer;
}(_abstract2.default);

/**
 * Shortcut function for the sorted neighborhood clusterer.
 *
 * @param {object} params - Clusterer parameters.
 * @param {array}  items  - Items to cluster.
 */


function sortedNeighborhood(params, items) {
  var clusterer = new SortedNeighborhoodClusterer(params, items);

  return clusterer.run();
}
module.exports = exports['default'];