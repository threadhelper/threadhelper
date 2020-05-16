'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Talisman clustering/abstract
 * =============================
 *
 * Abstract class used by every record-linkage clusterer to expose a same
 * interface.
 */

/**
 * Defaults.
 */
var DEFAULTS = {
  minClusterSize: 2
};

/**
 * Record Linkage Clusterer class.
 *
 * @constructor
 * @param {object} params - Clusterer parameters.
 * @param {array}  items  - Items to cluster.
 */

var RecordLinkageClusterer = function RecordLinkageClusterer(params, items) {
  _classCallCheck(this, RecordLinkageClusterer);

  if (!params || (typeof params === 'undefined' ? 'undefined' : _typeof(params)) !== 'object') throw new Error('talisman/clustering/record-linkage: the given params should be an object.');

  if (!Array.isArray(items)) throw new Error('talisman/clustering/record-linkage: the given items should be an array.');

  // Properties
  this.items = items;
  this.params = {
    minClusterSize: params.minClusterSize || DEFAULTS.minClusterSize
  };
};

exports.default = RecordLinkageClusterer;
module.exports = exports['default'];