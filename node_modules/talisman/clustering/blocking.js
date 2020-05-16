'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlockingClusterer = undefined;
exports.default = blocking;

var _abstract = require('./abstract');

var _abstract2 = _interopRequireDefault(_abstract);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Talisman clustering/blocking
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * =============================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Clusterer dispatching documents to blocks which we will then cluster. A
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * document may be attached to more than one block since the algorithm uses
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * an inverted index. Time complexity is nb(b-1)/2 where n is the number
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * of blocks and b the average size of a block.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Blocking Clusterer class.
 *
 * @constructor
 */
var BlockingClusterer = exports.BlockingClusterer = function (_RecordLinkageCluster) {
  _inherits(BlockingClusterer, _RecordLinkageCluster);

  function BlockingClusterer(params, items) {
    _classCallCheck(this, BlockingClusterer);

    var _this = _possibleConstructorReturn(this, _RecordLinkageCluster.call(this, params, items));

    (0, _helpers.handleSimilarityPolymorphisms)(_this, params);

    var blocker = params.blocks || params.block;

    if (typeof blocker !== 'function') throw new Error('talisman/clustering/record-linkage/blocking: the given blocker is not a function.');

    _this.blocker = blocker;
    return _this;
  }

  BlockingClusterer.prototype.run = function run() {
    var graph = {},
        blocks = Object.create(null);

    for (var i = 0, l = this.items.length; i < l; i++) {
      var tokens = [].concat(this.blocker(this.items[i], i));

      for (var j = 0, m = tokens.length; j < m; j++) {
        var token = tokens[j];

        // We skip falsey tokens
        if (!token) continue;

        if (!blocks[token]) blocks[token] = [];

        blocks[token].push(i);
      }
    }

    for (var k in blocks) {
      var block = blocks[k];

      for (var _i = 0, _l = block.length; _i < _l; _i++) {
        var a = this.items[block[_i]];

        for (var _j = _i + 1; _j < _l; _j++) {
          var b = this.items[block[_j]];

          if (this.similarity(a, b)) {
            graph[block[_i]] = graph[block[_i]] || new Set();
            graph[block[_i]].add(block[_j]);

            graph[block[_j]] = graph[block[_j]] || new Set();
            graph[block[_j]].add(block[_i]);
          }
        }
      }
    }

    return (0, _helpers.clustersFromSetGraph)(this.items, graph, this.params.minClusterSize);
  };

  return BlockingClusterer;
}(_abstract2.default);

/**
 * Shortcut function for the blocking clusterer.
 *
 * @param {object} params - Clusterer parameters.
 * @param {array}  items  - Items to cluster.
 */


function blocking(params, items) {
  var clusterer = new BlockingClusterer(params, items);

  return clusterer.run();
}
module.exports = exports['default'];