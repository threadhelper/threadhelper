"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = crc32;
/**
 * Talisman hash/crc32
 * ====================
 *
 * JavaScript implementation of the CRC32 hash for UTF-8 strings.
 *
 * [Reference]: https://en.wikipedia.org/wiki/Cyclic_redundancy_check
 */

/**
 * Constants.
 */
var TABLE = new Int32Array(256);

for (var c = 0, n = 0; n !== 256; n++) {
  c = n;
  c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
  c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
  c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
  c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
  c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
  c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
  c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
  c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
  TABLE[n] = c;
}

/**
 * Computes the CRC32 hash for the given UTF-8 string.
 *
 * @param  {string} string - The string to hash.
 * @return {number}        - The signed CRC32 hash.
 */
function crc32(string) {
  var C = -1;

  for (var i = 0, l = string.length, _c, d; i < l;) {
    _c = string.charCodeAt(i++);

    if (_c < 0x80) {
      C = C >>> 8 ^ TABLE[(C ^ _c) & 0xFF];
    } else if (_c < 0x800) {
      C = C >>> 8 ^ TABLE[(C ^ (192 | _c >> 6 & 31)) & 0xFF];
      C = C >>> 8 ^ TABLE[(C ^ (128 | _c & 63)) & 0xFF];
    } else if (_c >= 0xD800 && _c < 0xE000) {
      _c = (_c & 1023) + 64;
      d = string.charCodeAt(i++) & 1023;
      C = C >>> 8 ^ TABLE[(C ^ (240 | _c >> 8 & 7)) & 0xFF];
      C = C >>> 8 ^ TABLE[(C ^ (128 | _c >> 2 & 63)) & 0xFF];
      C = C >>> 8 ^ TABLE[(C ^ (128 | d >> 6 & 15 | (_c & 3) << 4)) & 0xFF];
      C = C >>> 8 ^ TABLE[(C ^ (128 | d & 63)) & 0xFF];
    } else {
      C = C >>> 8 ^ TABLE[(C ^ (224 | _c >> 12 & 15)) & 0xFF];
      C = C >>> 8 ^ TABLE[(C ^ (128 | _c >> 6 & 63)) & 0xFF];
      C = C >>> 8 ^ TABLE[(C ^ (128 | _c & 63)) & 0xFF];
    }
  }

  return C ^ -1;
}
module.exports = exports["default"];