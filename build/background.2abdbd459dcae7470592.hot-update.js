webpackHotUpdate("background",{

/***/ "./src/ts/utils/dutils.tsx":
/*!*********************************!*\
  !*** ./src/ts/utils/dutils.tsx ***!
  \*********************************/
/*! exports provided: getData, setData, removeData, resetStorage, setStg, getStg, updateStg, getStgPath, getOptions, getOption, updateStgPath, updateOptionStg, applyToOptionStg, msgBG, msgCS, makeOnStorageChanged, makeStorageChangeObs, makeStgPathObs, makeStgItemObs, makeGotMsgObs, makeMsgStream, makeOptionObs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global, __prefresh_utils__, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getData", function() { return getData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setData", function() { return setData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeData", function() { return removeData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetStorage", function() { return resetStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setStg", function() { return setStg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStg", function() { return getStg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateStg", function() { return updateStg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStgPath", function() { return getStgPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOptions", function() { return getOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOption", function() { return getOption; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateStgPath", function() { return updateStgPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateOptionStg", function() { return updateOptionStg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyToOptionStg", function() { return applyToOptionStg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "msgBG", function() { return msgBG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "msgCS", function() { return msgCS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeOnStorageChanged", function() { return makeOnStorageChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeStorageChangeObs", function() { return makeStorageChangeObs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeStgPathObs", function() { return makeStgPathObs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeStgItemObs", function() { return makeStgItemObs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeGotMsgObs", function() { return makeGotMsgObs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeMsgStream", function() { return makeMsgStream; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeOptionObs", function() { return makeOptionObs; });
/* harmony import */ var kefir__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! kefir */ "./node_modules/kefir/dist/kefir.esm.js");
/* harmony import */ var _putils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./putils */ "./src/ts/utils/putils.tsx");
/* harmony import */ var _defaultStg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./defaultStg */ "./src/ts/utils/defaultStg.tsx");
/* harmony import */ var ramda__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ramda */ "./node_modules/ramda/es/index.js");
/* harmony import */ var chrome_api_mock__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! chrome-api-mock */ "./node_modules/chrome-api-mock/src/index.js");
/* harmony import */ var chrome_api_mock__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(chrome_api_mock__WEBPACK_IMPORTED_MODULE_4__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }




 // Function

 // Object

 // List

 // Logic, Type, Relation, String, Math

kefir__WEBPACK_IMPORTED_MODULE_0__["default"].Property.prototype.currentValue = _putils__WEBPACK_IMPORTED_MODULE_1__["currentValue"];

var DEVING = "serve" == 'serve';
global.chrome = DEVING ? chrome_api_mock__WEBPACK_IMPORTED_MODULE_4___default.a.getChromeInstance() : global.chrome;
var defaultStorage = DEVING ? _defaultStg__WEBPACK_IMPORTED_MODULE_2__["devStorage"] : _defaultStg__WEBPACK_IMPORTED_MODULE_2__["defaultStorage"];
console.log('dutils defaultStorage', {
  DEVING: DEVING,
  defaultStorage: defaultStorage,
  chrome: global.chrome,
  chromeMock: chrome_api_mock__WEBPACK_IMPORTED_MODULE_4___default.a,
  mock: chrome_api_mock__WEBPACK_IMPORTED_MODULE_4___default.a.getChromeInstance()
}); //returns a promise that gets a value from chrome local storage 

function getData(_x) {
  return _getData.apply(this, arguments);
} //returns a promise that sets an object with key value pairs into chrome local storage 

function _getData() {
  _getData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(key) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", new Promise(function (resolve, reject) {
              // chrome.storage.local.get(key, function (items: {
              chrome.storage.sync.get(key, function (items) {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError.message);
                  reject(chrome.runtime.lastError.message);
                } else {
                  resolve(items[key]);
                }
              });
            }));

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getData.apply(this, arguments);
}

function setData(_x2) {
  return _setData.apply(this, arguments);
} // Delete data from storage
// takes an array of keys

function _setData() {
  _setData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(key_vals) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt("return", new Promise(function (resolve, reject) {
              // chrome.storage.local.set(key_vals, () => {
              chrome.storage.sync.set(key_vals, function () {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError.message);
                  reject(chrome.runtime.lastError.message);
                } else {
                  console.log('[DEBUG] setData', _objectSpread({}, key_vals));
                  resolve(key_vals);
                }
              });
            }));

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _setData.apply(this, arguments);
}

function removeData(_x3) {
  return _removeData.apply(this, arguments);
}

function _removeData() {
  _removeData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(keys) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt("return", new Promise(function (resolve, reject) {
              chrome.storage.local.remove(keys, function () {
                //console.log("removed", keys)
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError.message);
                  reject(chrome.runtime.lastError.message);
                } else {
                  // @ts-expect-error ts-migrate(2794) FIXME: Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
                  resolve();
                }
              });
            }));

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _removeData.apply(this, arguments);
}

var resetStorage = function resetStorage() {
  return setData(defaultStorage());
};
var setStg = Object(ramda__WEBPACK_IMPORTED_MODULE_3__["curry"])(function (key, val) {
  return setData(_defineProperty({}, key, val));
});
var getStg = function getStg(key) {
  return getData(key).then(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["defaultTo"])(defaultStorage()[key]), addNewDefault(key)));
};
var updateStg = Object(ramda__WEBPACK_IMPORTED_MODULE_3__["curry"])(function (key, val) {
  return setData(_defineProperty({}, key, val));
}); // TODO: need to reliably return the default if path doesn't exist, see addNewDefaultOptions
// @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message

var getStgPath = Object(ramda__WEBPACK_IMPORTED_MODULE_3__["curry"])(function (_path) {
  return getStg(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["head"])(_path)).then(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["path"])(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["tail"])(_path)));
}); // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'Placeholder | __MergeDeep<Placeh... Remove this comment to see the full error message

var addNewDefault = Object(ramda__WEBPACK_IMPORTED_MODULE_3__["curry"])(function (key, oldItem) {
  return Object(ramda__WEBPACK_IMPORTED_MODULE_3__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["when"])(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["is"])(Object), Object(ramda__WEBPACK_IMPORTED_MODULE_3__["mergeDeepLeft"])(ramda__WEBPACK_IMPORTED_MODULE_3__["__"], defaultStorage()[key])))(oldItem);
});

var addNewDefaultOptions = function addNewDefaultOptions(oldOptions) {
  return Object(ramda__WEBPACK_IMPORTED_MODULE_3__["mergeDeepLeft"])(oldOptions, Object(_defaultStg__WEBPACK_IMPORTED_MODULE_2__["defaultOptions"])());
};

var getOptions = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", getData('options').then(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["defaultTo"])(Object(_defaultStg__WEBPACK_IMPORTED_MODULE_2__["defaultOptions"])()), addNewDefaultOptions)));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getOptions() {
    return _ref.apply(this, arguments);
  };
}();
var getOption = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(name) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", getOptions().then(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["prop"])(name)));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getOption(_x4) {
    return _ref2.apply(this, arguments);
  };
}(); // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message

var updateStgPath = Object(ramda__WEBPACK_IMPORTED_MODULE_3__["curry"])( /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_path, val) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", getStg(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["head"])(_path)).then(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["set"])(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["lensPath"])(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["tail"])(_path)), val), Object(ramda__WEBPACK_IMPORTED_MODULE_3__["tap"])(setStg(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["head"])(_path))), Object(_putils__WEBPACK_IMPORTED_MODULE_1__["inspect"])("updatedStgPath ".concat(_path)))));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}()); // TODO: this after the abovo TODO
// @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string[]' is not assignable to p... Remove this comment to see the full error message

var updateOptionStg = function updateOptionStg(name) {
  return updateStgPath(['options', name, 'value']);
}; // export const updateOptionStg = curry(async (name, val)=> getOptions().then(pipe(
//       set(lensPath([name,'value']),val),
//       tap(setStg('options')),
//     )))

var applyToOptionStg = Object(ramda__WEBPACK_IMPORTED_MODULE_3__["curry"])( /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(name, fn) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", getOptions().then(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["path"])([name, 'value']), fn, updateOptionStg(name))));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
function msgBG(msg) {
  chrome.runtime.sendMessage(msg);
  console.log("messaging BG", msg);
}
function msgCS(tabId, msg) {
  chrome.tabs.sendMessage(tabId, msg);
} // makes an onStorageChange function given an act function that's usually a switch over item keys that have changed

function makeOnStorageChanged(act) {
  return function (changes, area) {
    if (!['local', 'sync'].includes(area)) return null;
    var oldVal = {};
    var newVal = {};
    var changedItems = Object.keys(changes);

    for (var _i = 0, _changedItems = changedItems; _i < _changedItems.length; _i++) {
      var itemName = _changedItems[_i];
      oldVal = changes[itemName].oldValue;
      newVal = changes[itemName].newValue;
      if (oldVal == newVal) break;
      act({
        itemName: itemName,
        oldVal: oldVal,
        newVal: newVal
      });
    }
  };
} // const makeEventObs = curry((event: {addListener: (arg0: any) => void; removeListener: (arg0: any) => void;}, makeEmit, initVal) => {

var makeEventObs = Object(ramda__WEBPACK_IMPORTED_MODULE_3__["curry"])(function (event, makeEmit, initVal) {
  return kefir__WEBPACK_IMPORTED_MODULE_0__["default"].stream(function (emitter) {
    // emitter.emit(initVal);
    var emit = makeEmit(emitter);
    event.addListener(emit);
    return function () {
      event.removeListener(emit);
      emitter.end();
    };
  });
});
var makeStorageChangeObs = function makeStorageChangeObs() {
  var makeEmitStgCH = function makeEmitStgCH(emitter) {
    return makeOnStorageChanged(function (stgCh) {
      return emitter.emit(stgCh);
    });
  };

  return makeEventObs(chrome.storage.onChanged, makeEmitStgCH, {
    itemName: null,
    oldVal: null,
    newVal: null
  });
}; // shallow

var isStgItemSame = function isStgItemSame(x) {
  return Object(ramda__WEBPACK_IMPORTED_MODULE_3__["isNil"])(x.oldVal) && Object(ramda__WEBPACK_IMPORTED_MODULE_3__["isNil"])(x.newVal) || x.oldVal === x.newVal;
};

var makeStgPathObs = function makeStgPathObs(_path) {
  return makeStorageChangeObs().filter(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["propEq"])('itemName', _path[0])).map(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["path"])(['newVal'].concat(_toConsumableArray(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["slice"])(1, Infinity, _path))))).toProperty();
}; // export const makeStgItemObs = itemName => {console.log('making stg item obs for ', itemName); return makeStorageObs().filter(propEq('itemName',itemName)).filter(pipe(isStgItemSame, not)).map(prop('newVal')).skipDuplicates()}

var makeStgItemObs = function makeStgItemObs(itemName) {
  return makeStgPathObs([itemName]);
}; // export const makeStgItemObs = itemName => {
//   console.log('making stg item obs for ', itemName); 
//   return makeStorageObs()
//   .filter(propEq('itemName',itemName))
//   .map(prop('newVal')).toProperty()}
// export const makeStorageStream = (type) => makeStoragegObs().filter(propEq('type',type))

var makeGotMsgObs = function makeGotMsgObs() {
  var makeEmitMsg = function makeEmitMsg(emitter) {
    return function (message, sender) {
      return emitter.emit({
        m: message,
        s: sender
      });
    };
  };

  return makeEventObs(chrome.runtime.onMessage, makeEmitMsg, {
    m: {
      type: null
    },
    s: null
  });
};
var makeMsgStream = function makeMsgStream(msgType) {
  return makeGotMsgObs().map(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["prop"])('m')).filter(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["propEq"])('type', msgType));
}; // // optionsChange$ :: change -> change
// export const makeOptionsChangeObs = async (storageChange$) => {
//   const cachedOptions = {oldVal:null, newVal:await getOptions()}
//   return storageChange$.filter(x=>x.itemName=='options').toProperty(()=>cachedOptions)
// }

var isOptionSame = Object(ramda__WEBPACK_IMPORTED_MODULE_3__["curry"])(function (name, x) {
  return isStgItemSame(x) || !Object(ramda__WEBPACK_IMPORTED_MODULE_3__["isNil"])(x.oldVal) && !Object(ramda__WEBPACK_IMPORTED_MODULE_3__["isNil"])(x.newVal) && Object(ramda__WEBPACK_IMPORTED_MODULE_3__["path"])(['oldVal', name, 'value'], x) === Object(ramda__WEBPACK_IMPORTED_MODULE_3__["path"])(['newVal', name, 'value'], x);
}); // const isOptionSame = curry ((name, x)=> (isNil(x.oldVal) && isNil(x.newVal)) || (!isNil(x.oldVal) && !isNil(x.newVal) && (path(['oldVal', name, 'value'],x) === path(['newVal', name, 'value'],x))) )
// makeOptionsObs :: String -> a

var makeOptionObs = Object(ramda__WEBPACK_IMPORTED_MODULE_3__["curry"])(function (optionsChange$, itemName) {
  return optionsChange$.filter(function (x) {
    return !isOptionSame(itemName, x);
  }).map(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["path"])(['newVal', itemName])).map(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["defaultTo"])(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["prop"])(itemName, Object(_defaultStg__WEBPACK_IMPORTED_MODULE_2__["defaultOptions"])())));
}); // const listSearchFilters = pipe(prop('newVal'), values, filter(propEq('type', 'searchFilter')), map(prop('name')), R.map(makeOptionObs), inspect('listsearchfilters'));
// const combineOptions = (...args) => pipe(inspect('combineopt'), reduce((a, b) => assoc(b.name, b.value, a), {}))(args);
// export const makeSearchFiltersObs = () => Kefir.combine([getRT$, useBookmarks$, useReplies$], combineOptions).toProperty();

const isPrefreshComponent = __prefresh_utils__.shouldBind(module);

  if ( true && isPrefreshComponent) {
    const previousHotModuleExports =
      module.hot.data && module.hot.data.moduleExports;

    if (previousHotModuleExports) {
      try {
        __prefresh_utils__.flush();
      } catch (e) {
        // Only available in newer webpack versions.
        if (module.hot.invalidate) {
          module.hot.invalidate();
        } else {
          self.location.reload();
        }
      }
    }

    module.hot.dispose(function (data) {
      data.moduleExports = __prefresh_utils__.getExports(module);
    });

    module.hot.accept(function errorRecovery() {
      __webpack_require__.c[module.i].hot.accept(errorRecovery);
    });
  }
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./node_modules/@prefresh/webpack/src/utils/prefresh.js */ "./node_modules/@prefresh/webpack/src/utils/prefresh.js"), __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvZHV0aWxzLnRzeCJdLCJuYW1lcyI6WyJLZWZpciIsIlByb3BlcnR5IiwicHJvdG90eXBlIiwiY3VycmVudFZhbHVlIiwiREVWSU5HIiwicHJvY2VzcyIsImdsb2JhbCIsImNocm9tZSIsImNocm9tZU1vY2siLCJnZXRDaHJvbWVJbnN0YW5jZSIsImRlZmF1bHRTdG9yYWdlIiwiZGV2U3RvcmFnZSIsIl9kZWZhdWx0U3RvcmFnZSIsImNvbnNvbGUiLCJsb2ciLCJtb2NrIiwiZ2V0RGF0YSIsImtleSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RvcmFnZSIsInN5bmMiLCJnZXQiLCJpdGVtcyIsInJ1bnRpbWUiLCJsYXN0RXJyb3IiLCJlcnJvciIsIm1lc3NhZ2UiLCJzZXREYXRhIiwia2V5X3ZhbHMiLCJzZXQiLCJyZW1vdmVEYXRhIiwia2V5cyIsImxvY2FsIiwicmVtb3ZlIiwicmVzZXRTdG9yYWdlIiwic2V0U3RnIiwiY3VycnkiLCJ2YWwiLCJnZXRTdGciLCJ0aGVuIiwicGlwZSIsImRlZmF1bHRUbyIsImFkZE5ld0RlZmF1bHQiLCJ1cGRhdGVTdGciLCJnZXRTdGdQYXRoIiwiX3BhdGgiLCJoZWFkIiwicGF0aCIsInRhaWwiLCJvbGRJdGVtIiwid2hlbiIsImlzIiwiT2JqZWN0IiwibWVyZ2VEZWVwTGVmdCIsIl9fIiwiYWRkTmV3RGVmYXVsdE9wdGlvbnMiLCJvbGRPcHRpb25zIiwiZGVmYXVsdE9wdGlvbnMiLCJnZXRPcHRpb25zIiwiZ2V0T3B0aW9uIiwibmFtZSIsInByb3AiLCJ1cGRhdGVTdGdQYXRoIiwibGVuc1BhdGgiLCJ0YXAiLCJpbnNwZWN0IiwidXBkYXRlT3B0aW9uU3RnIiwiYXBwbHlUb09wdGlvblN0ZyIsImZuIiwibXNnQkciLCJtc2ciLCJzZW5kTWVzc2FnZSIsIm1zZ0NTIiwidGFiSWQiLCJ0YWJzIiwibWFrZU9uU3RvcmFnZUNoYW5nZWQiLCJhY3QiLCJjaGFuZ2VzIiwiYXJlYSIsImluY2x1ZGVzIiwib2xkVmFsIiwibmV3VmFsIiwiY2hhbmdlZEl0ZW1zIiwiaXRlbU5hbWUiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwibWFrZUV2ZW50T2JzIiwiZXZlbnQiLCJtYWtlRW1pdCIsImluaXRWYWwiLCJzdHJlYW0iLCJlbWl0dGVyIiwiZW1pdCIsImFkZExpc3RlbmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJlbmQiLCJtYWtlU3RvcmFnZUNoYW5nZU9icyIsIm1ha2VFbWl0U3RnQ0giLCJzdGdDaCIsIm9uQ2hhbmdlZCIsImlzU3RnSXRlbVNhbWUiLCJ4IiwiaXNOaWwiLCJtYWtlU3RnUGF0aE9icyIsImZpbHRlciIsInByb3BFcSIsIm1hcCIsInNsaWNlIiwiSW5maW5pdHkiLCJ0b1Byb3BlcnR5IiwibWFrZVN0Z0l0ZW1PYnMiLCJtYWtlR290TXNnT2JzIiwibWFrZUVtaXRNc2ciLCJzZW5kZXIiLCJtIiwicyIsIm9uTWVzc2FnZSIsInR5cGUiLCJtYWtlTXNnU3RyZWFtIiwibXNnVHlwZSIsImlzT3B0aW9uU2FtZSIsIm1ha2VPcHRpb25PYnMiLCJvcHRpb25zQ2hhbmdlJCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBR0E7QUFDQTtDQUU2Rjs7Q0FDK0Y7O0NBQ1g7O0NBQ1Y7O0FBRXRLQSw2Q0FBSyxDQUFDQyxRQUFOLENBQWVDLFNBQWhCLENBQWtDQyxZQUFsQyxHQUFpREEsb0RBQWpEO0FBQ0E7QUFHQSxJQUFNQyxNQUFNLEdBQUdDLE9BQUEsSUFBd0IsT0FBdkM7QUFDQUMsTUFBTSxDQUFDQyxNQUFQLEdBQWdCSCxNQUFNLEdBQUdJLHNEQUFVLENBQUNDLGlCQUFYLEVBQUgsR0FBb0NILE1BQU0sQ0FBQ0MsTUFBakU7QUFDQSxJQUFNRyxjQUFjLEdBQUdOLE1BQU0sR0FBR08sc0RBQUgsR0FBZ0JDLDBEQUE3QztBQUNBQyxPQUFPLENBQUNDLEdBQVIsQ0FBWSx1QkFBWixFQUFxQztBQUFDVixRQUFNLEVBQU5BLE1BQUQ7QUFBU00sZ0JBQWMsRUFBZEEsY0FBVDtBQUF5QkgsUUFBTSxFQUFFRCxNQUFNLENBQUNDLE1BQXhDO0FBQWdEQyxZQUFVLEVBQVZBLHNEQUFoRDtBQUE0RE8sTUFBSSxFQUFFUCxzREFBVSxDQUFDQyxpQkFBWDtBQUFsRSxDQUFyQyxFLENBRUE7O0FBQ08sU0FBZU8sT0FBdEI7QUFBQTtBQUFBLEMsQ0FnQkE7OztxRUFoQk8sa0JBQXVCQyxHQUF2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOENBQ0ksSUFBSUMsT0FBSixDQUFZLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQzFDO0FBQ0FiLG9CQUFNLENBQUNjLE9BQVAsQ0FBZUMsSUFBZixDQUFvQkMsR0FBcEIsQ0FBd0JOLEdBQXhCLEVBQTZCLFVBQVVPLEtBQVYsRUFFMUI7QUFDQyxvQkFBSWpCLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZUMsU0FBbkIsRUFBOEI7QUFDMUJiLHlCQUFPLENBQUNjLEtBQVIsQ0FBY3BCLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZUMsU0FBZixDQUF5QkUsT0FBdkM7QUFDQVIsd0JBQU0sQ0FBQ2IsTUFBTSxDQUFDa0IsT0FBUCxDQUFlQyxTQUFmLENBQXlCRSxPQUExQixDQUFOO0FBQ0gsaUJBSEQsTUFJSztBQUNEVCx5QkFBTyxDQUFDSyxLQUFLLENBQUNQLEdBQUQsQ0FBTixDQUFQO0FBQ0g7QUFDSixlQVZEO0FBV0gsYUFiTSxDQURKOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7Ozs7QUFpQkEsU0FBZVksT0FBdEI7QUFBQTtBQUFBLEMsQ0FlQTtBQUNBOzs7cUVBaEJPLGtCQUF1QkMsUUFBdkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQUNJLElBQUlaLE9BQUosQ0FBWSxVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUMxQztBQUNBYixvQkFBTSxDQUFDYyxPQUFQLENBQWVDLElBQWYsQ0FBb0JTLEdBQXBCLENBQXdCRCxRQUF4QixFQUFrQyxZQUFNO0FBQ3BDLG9CQUFJdkIsTUFBTSxDQUFDa0IsT0FBUCxDQUFlQyxTQUFuQixFQUE4QjtBQUMxQmIseUJBQU8sQ0FBQ2MsS0FBUixDQUFjcEIsTUFBTSxDQUFDa0IsT0FBUCxDQUFlQyxTQUFmLENBQXlCRSxPQUF2QztBQUNBUix3QkFBTSxDQUFDYixNQUFNLENBQUNrQixPQUFQLENBQWVDLFNBQWYsQ0FBeUJFLE9BQTFCLENBQU47QUFDSCxpQkFIRCxNQUlLO0FBQ0RmLHlCQUFPLENBQUNDLEdBQVIsQ0FBWSxpQkFBWixvQkFBb0NnQixRQUFwQztBQUNBWCx5QkFBTyxDQUFDVyxRQUFELENBQVA7QUFDSDtBQUNKLGVBVEQ7QUFVSCxhQVpNLENBREo7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7OztBQWlCQSxTQUFlRSxVQUF0QjtBQUFBO0FBQUE7Ozt3RUFBTyxrQkFBMEJDLElBQTFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FDSSxJQUFJZixPQUFKLENBQVksVUFBVUMsT0FBVixFQUFtQkMsTUFBbkIsRUFBMkI7QUFDMUNiLG9CQUFNLENBQUNjLE9BQVAsQ0FBZWEsS0FBZixDQUFxQkMsTUFBckIsQ0FBNEJGLElBQTVCLEVBQWtDLFlBQVk7QUFDMUM7QUFDQSxvQkFBSTFCLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZUMsU0FBbkIsRUFBOEI7QUFDMUJiLHlCQUFPLENBQUNjLEtBQVIsQ0FBY3BCLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZUMsU0FBZixDQUF5QkUsT0FBdkM7QUFDQVIsd0JBQU0sQ0FBQ2IsTUFBTSxDQUFDa0IsT0FBUCxDQUFlQyxTQUFmLENBQXlCRSxPQUExQixDQUFOO0FBQ0gsaUJBSEQsTUFJSztBQUNEO0FBQ0FULHlCQUFPO0FBQ1Y7QUFDSixlQVZEO0FBV0gsYUFaTSxDQURKOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7Ozs7QUFlQSxJQUFNaUIsWUFBWSxHQUFHLFNBQWZBLFlBQWU7QUFBQSxTQUFNUCxPQUFPLENBQUNuQixjQUFjLEVBQWYsQ0FBYjtBQUFBLENBQXJCO0FBQ0EsSUFBTTJCLE1BQU0sR0FBR0MsbURBQUssQ0FBQyxVQUFDckIsR0FBRCxFQUFNc0IsR0FBTjtBQUFBLFNBQWNWLE9BQU8scUJBQUlaLEdBQUosRUFBVXNCLEdBQVYsRUFBckI7QUFBQSxDQUFELENBQXBCO0FBQ0EsSUFBTUMsTUFBTSxHQUFHLFNBQVRBLE1BQVMsQ0FBQ3ZCLEdBQUQ7QUFBQSxTQUFpQkQsT0FBTyxDQUFDQyxHQUFELENBQVAsQ0FBYXdCLElBQWIsQ0FBa0JDLGtEQUFJLENBQUNDLHVEQUFTLENBQUNqQyxjQUFjLEdBQUdPLEdBQUgsQ0FBZixDQUFWLEVBQW1DMkIsYUFBYSxDQUFDM0IsR0FBRCxDQUFoRCxDQUF0QixDQUFqQjtBQUFBLENBQWY7QUFDQSxJQUFNNEIsU0FBUyxHQUFHUCxtREFBSyxDQUFDLFVBQUNyQixHQUFELEVBQU1zQixHQUFOO0FBQUEsU0FBY1YsT0FBTyxxQkFBSVosR0FBSixFQUFVc0IsR0FBVixFQUFyQjtBQUFBLENBQUQsQ0FBdkIsQyxDQUNQO0FBQ0E7O0FBQ08sSUFBTU8sVUFBVSxHQUFHUixtREFBSyxDQUFDLFVBQUNTLEtBQUQ7QUFBQSxTQUFtQlAsTUFBTSxDQUFDUSxrREFBSSxDQUFDRCxLQUFELENBQUwsQ0FBTixDQUFvQk4sSUFBcEIsQ0FBeUJRLGtEQUFJLENBQUNDLGtEQUFJLENBQUNILEtBQUQsQ0FBTCxDQUE3QixDQUFuQjtBQUFBLENBQUQsQ0FBeEIsQyxDQUNQOztBQUNBLElBQU1ILGFBQWEsR0FBR04sbURBQUssQ0FBQyxVQUFDckIsR0FBRCxFQUF1QmtDLE9BQXZCO0FBQUEsU0FBbUNULGtEQUFJLENBQUNVLGtEQUFJLENBQUNDLGdEQUFFLENBQUNDLE1BQUQsQ0FBSCxFQUFhQywyREFBYSxDQUFDQyx3Q0FBRCxFQUFLOUMsY0FBYyxHQUFHTyxHQUFILENBQW5CLENBQTFCLENBQUwsQ0FBSixDQUFpRWtDLE9BQWpFLENBQW5DO0FBQUEsQ0FBRCxDQUEzQjs7QUFDQSxJQUFNTSxvQkFBb0IsR0FBRyxTQUF2QkEsb0JBQXVCLENBQUFDLFVBQVU7QUFBQSxTQUFJSCwyREFBYSxDQUFDRyxVQUFELEVBQWFDLGtFQUFjLEVBQTNCLENBQWpCO0FBQUEsQ0FBdkM7O0FBQ08sSUFBTUMsVUFBVTtBQUFBLHFFQUFHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw2Q0FBOEI1QyxPQUFPLENBQUMsU0FBRCxDQUFQLENBQW1CeUIsSUFBbkIsQ0FBd0JDLGtEQUFJLENBQUNDLHVEQUFTLENBQUNnQixrRUFBYyxFQUFmLENBQVYsRUFBOEJGLG9CQUE5QixDQUE1QixDQUE5Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFIOztBQUFBLGtCQUFWRyxVQUFVO0FBQUE7QUFBQTtBQUFBLEdBQWhCO0FBQ0EsSUFBTUMsU0FBUztBQUFBLHNFQUFHLGtCQUFPQyxJQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FBeUNGLFVBQVUsR0FBR25CLElBQWIsQ0FBa0JzQixrREFBSSxDQUFDRCxJQUFELENBQXRCLENBQXpDOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUg7O0FBQUEsa0JBQVRELFNBQVM7QUFBQTtBQUFBO0FBQUEsR0FBZixDLENBQ1A7O0FBQ08sSUFBTUcsYUFBYSxHQUFHMUIsbURBQUs7QUFBQSxzRUFBQyxrQkFBT1MsS0FBUCxFQUFzQlIsR0FBdEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQUE4QkMsTUFBTSxDQUFDUSxrREFBSSxDQUFDRCxLQUFELENBQUwsQ0FBTixDQUFvQk4sSUFBcEIsQ0FBeUJDLGtEQUFJLENBQUNYLGlEQUFHLENBQUNrQyxzREFBUSxDQUFDZixrREFBSSxDQUFDSCxLQUFELENBQUwsQ0FBVCxFQUF3QlIsR0FBeEIsQ0FBSixFQUFrQzJCLGlEQUFHLENBQUM3QixNQUFNLENBQUNXLGtEQUFJLENBQUNELEtBQUQsQ0FBTCxDQUFQLENBQXJDLEVBQTREb0IsdURBQU8sMEJBQW1CcEIsS0FBbkIsRUFBbkUsQ0FBN0IsQ0FBOUI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBRDs7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUEzQixDLENBQ1A7QUFDQTs7QUFDTyxJQUFNcUIsZUFBZSxHQUFHLFNBQWxCQSxlQUFrQixDQUFDTixJQUFEO0FBQUEsU0FBa0JFLGFBQWEsQ0FBQyxDQUFDLFNBQUQsRUFBWUYsSUFBWixFQUFrQixPQUFsQixDQUFELENBQS9CO0FBQUEsQ0FBeEIsQyxDQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUNPLElBQU1PLGdCQUFnQixHQUFHL0IsbURBQUs7QUFBQSxzRUFBQyxrQkFBT3dCLElBQVAsRUFBOEJRLEVBQTlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FFM0JWLFVBQVUsR0FBR25CLElBQWIsQ0FBa0JDLGtEQUFJLENBQUNPLGtEQUFJLENBQUMsQ0FBQ2EsSUFBRCxFQUFPLE9BQVAsQ0FBRCxDQUFMLEVBQXdCUSxFQUF4QixFQUE0QkYsZUFBZSxDQUFDTixJQUFELENBQTNDLENBQXRCLENBRjJCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUQ7O0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFBOUI7QUFJQSxTQUFTUyxLQUFULENBQWVDLEdBQWYsRUFBeUI7QUFDNUJqRSxRQUFNLENBQUNrQixPQUFQLENBQWVnRCxXQUFmLENBQTJCRCxHQUEzQjtBQUNBM0QsU0FBTyxDQUFDQyxHQUFSLENBQVksY0FBWixFQUE0QjBELEdBQTVCO0FBQ0g7QUFDTSxTQUFTRSxLQUFULENBQWVDLEtBQWYsRUFBOEJILEdBQTlCLEVBQXdDO0FBQzNDakUsUUFBTSxDQUFDcUUsSUFBUCxDQUFZSCxXQUFaLENBQXdCRSxLQUF4QixFQUErQkgsR0FBL0I7QUFDSCxDLENBQ0Q7O0FBQ08sU0FBU0ssb0JBQVQsQ0FBK0JDLEdBQS9CLEVBQWlFO0FBRXBFLFNBQU8sVUFBQ0MsT0FBRCxFQUEyQ0MsSUFBM0MsRUFBNEQ7QUFDL0QsUUFBSSxDQUFDLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0JDLFFBQWxCLENBQTJCRCxJQUEzQixDQUFMLEVBQ0ksT0FBTyxJQUFQO0FBQ0osUUFBSUUsTUFBTSxHQUFHLEVBQWI7QUFDQSxRQUFJQyxNQUFNLEdBQUcsRUFBYjtBQUNBLFFBQUlDLFlBQVksR0FBRzlCLE1BQU0sQ0FBQ3JCLElBQVAsQ0FBWThDLE9BQVosQ0FBbkI7O0FBQ0EscUNBQXFCSyxZQUFyQixtQ0FBbUM7QUFBOUIsVUFBSUMsUUFBUSxvQkFBWjtBQUNESCxZQUFNLEdBQUlILE9BQU8sQ0FBQ00sUUFBRCxDQUFSLENBQTJCQyxRQUFwQztBQUNBSCxZQUFNLEdBQUdKLE9BQU8sQ0FBQ00sUUFBRCxDQUFQLENBQWtCRSxRQUEzQjtBQUNBLFVBQUlMLE1BQU0sSUFBSUMsTUFBZCxFQUNJO0FBQ0pMLFNBQUcsQ0FBQztBQUFDTyxnQkFBUSxFQUFSQSxRQUFEO0FBQVdILGNBQU0sRUFBTkEsTUFBWDtBQUFtQkMsY0FBTSxFQUFOQTtBQUFuQixPQUFELENBQUg7QUFDSDtBQUNKLEdBYkQ7QUFjSCxDLENBQ0Q7O0FBQ0EsSUFBTUssWUFBWSxHQUFHbEQsbURBQUssQ0FBQyxVQUFDbUQsS0FBRCxFQUFrQ0MsUUFBbEMsRUFBNENDLE9BQTVDLEVBQWdGO0FBQ3ZHLFNBQU8zRiw2Q0FBSyxDQUFDNEYsTUFBTixDQUFhLFVBQUFDLE9BQU8sRUFBSTtBQUMzQjtBQUNBLFFBQU1DLElBQUksR0FBR0osUUFBUSxDQUFDRyxPQUFELENBQXJCO0FBQ0FKLFNBQUssQ0FBQ00sV0FBTixDQUFrQkQsSUFBbEI7QUFDQSxXQUFPLFlBQU07QUFDVEwsV0FBSyxDQUFDTyxjQUFOLENBQXFCRixJQUFyQjtBQUNBRCxhQUFPLENBQUNJLEdBQVI7QUFDSCxLQUhEO0FBSUgsR0FSTSxDQUFQO0FBU0gsQ0FWeUIsQ0FBMUI7QUFXTyxJQUFNQyxvQkFBb0IsR0FBRyxTQUF2QkEsb0JBQXVCLEdBQXVDO0FBQ3ZFLE1BQU1DLGFBQWEsR0FBRyxTQUFoQkEsYUFBZ0IsQ0FBQ04sT0FBRDtBQUFBLFdBQ2pCaEIsb0JBQW9CLENBQUMsVUFBQ3VCLEtBQUQ7QUFBQSxhQUErQlAsT0FBTyxDQUFDQyxJQUFSLENBQWFNLEtBQWIsQ0FBL0I7QUFBQSxLQUFELENBREg7QUFBQSxHQUF0Qjs7QUFFQSxTQUFPWixZQUFZLENBQUNqRixNQUFNLENBQUNjLE9BQVAsQ0FBZWdGLFNBQWhCLEVBQTJCRixhQUEzQixFQUEwQztBQUFFZCxZQUFRLEVBQUUsSUFBWjtBQUFrQkgsVUFBTSxFQUFFLElBQTFCO0FBQWdDQyxVQUFNLEVBQUU7QUFBeEMsR0FBMUMsQ0FBbkI7QUFDSCxDQUpNLEMsQ0FLUDs7QUFDQSxJQUFNbUIsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixDQUFDQyxDQUFEO0FBQUEsU0FBdUJDLG1EQUFLLENBQUNELENBQUMsQ0FBQ3JCLE1BQUgsQ0FBTCxJQUFtQnNCLG1EQUFLLENBQUNELENBQUMsQ0FBQ3BCLE1BQUgsQ0FBekIsSUFBd0NvQixDQUFDLENBQUNyQixNQUFGLEtBQWFxQixDQUFDLENBQUNwQixNQUE3RTtBQUFBLENBQXRCOztBQUNPLElBQU1zQixjQUFjLEdBQUcsU0FBakJBLGNBQWlCLENBQUMxRCxLQUFEO0FBQUEsU0FBNkNtRCxvQkFBb0IsR0FDMUZRLE1BRHNFLENBQy9EQyxvREFBTSxDQUFDLFVBQUQsRUFBYTVELEtBQUssQ0FBQyxDQUFELENBQWxCLENBRHlELEVBRXRFNkQsR0FGc0UsQ0FFbEUzRCxrREFBSSxFQUFFLFFBQUYsNEJBQWU0RCxtREFBSyxDQUFDLENBQUQsRUFBSUMsUUFBSixFQUFjL0QsS0FBZCxDQUFwQixHQUY4RCxFQUd0RWdFLFVBSHNFLEVBQTdDO0FBQUEsQ0FBdkIsQyxDQUlQOztBQUNPLElBQU1DLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsQ0FBQTNCLFFBQVE7QUFBQSxTQUFJb0IsY0FBYyxDQUFDLENBQUNwQixRQUFELENBQUQsQ0FBbEI7QUFBQSxDQUEvQixDLENBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNPLElBQU00QixhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLEdBQW9DO0FBQzdELE1BQU1DLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUNyQixPQUFEO0FBQUEsV0FBeUMsVUFBQ2pFLE9BQUQsRUFBVXVGLE1BQVY7QUFBQSxhQUFxQnRCLE9BQU8sQ0FBQ0MsSUFBUixDQUFhO0FBQUVzQixTQUFDLEVBQUV4RixPQUFMO0FBQWN5RixTQUFDLEVBQUVGO0FBQWpCLE9BQWIsQ0FBckI7QUFBQSxLQUF6QztBQUFBLEdBQXBCOztBQUNBLFNBQU8zQixZQUFZLENBQUNqRixNQUFNLENBQUNrQixPQUFQLENBQWU2RixTQUFoQixFQUEyQkosV0FBM0IsRUFBd0M7QUFBRUUsS0FBQyxFQUFFO0FBQUVHLFVBQUksRUFBRTtBQUFSLEtBQUw7QUFBcUJGLEtBQUMsRUFBRTtBQUF4QixHQUF4QyxDQUFuQjtBQUNILENBSE07QUFJQSxJQUFNRyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQUNDLE9BQUQ7QUFBQSxTQUFzQ1IsYUFBYSxHQUFHTCxHQUFoQixDQUFvQjdDLGtEQUFJLENBQUMsR0FBRCxDQUF4QixFQUErQjJDLE1BQS9CLENBQXNDQyxvREFBTSxDQUFDLE1BQUQsRUFBU2MsT0FBVCxDQUE1QyxDQUF0QztBQUFBLENBQXRCLEMsQ0FDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU1DLFlBQVksR0FBR3BGLG1EQUFLLENBQUMsVUFBQ3dCLElBQUQsRUFBZXlDLENBQWY7QUFBQSxTQUE2Q0QsYUFBYSxDQUFDQyxDQUFELENBQWIsSUFBcUIsQ0FBQ0MsbURBQUssQ0FBQ0QsQ0FBQyxDQUFDckIsTUFBSCxDQUFOLElBQW9CLENBQUNzQixtREFBSyxDQUFDRCxDQUFDLENBQUNwQixNQUFILENBQTFCLElBQXlDbEMsa0RBQUksQ0FBQyxDQUFDLFFBQUQsRUFBV2EsSUFBWCxFQUFpQixPQUFqQixDQUFELEVBQTRCeUMsQ0FBNUIsQ0FBSixLQUF1Q3RELGtEQUFJLENBQUMsQ0FBQyxRQUFELEVBQVdhLElBQVgsRUFBaUIsT0FBakIsQ0FBRCxFQUE0QnlDLENBQTVCLENBQXRKO0FBQUEsQ0FBRCxDQUExQixDLENBQ0E7QUFDQTs7QUFDTyxJQUFNb0IsYUFBYSxHQUFHckYsbURBQUssQ0FBQyxVQUFDc0YsY0FBRCxFQUFpRHZDLFFBQWpEO0FBQUEsU0FBK0Z1QyxjQUFjLENBQzNJbEIsTUFENkgsQ0FDdEgsVUFBQUgsQ0FBQztBQUFBLFdBQUksQ0FBQ21CLFlBQVksQ0FBQ3JDLFFBQUQsRUFBV2tCLENBQVgsQ0FBakI7QUFBQSxHQURxSCxFQUU3SEssR0FGNkgsQ0FFekgzRCxrREFBSSxDQUFNLENBQUMsUUFBRCxFQUFXb0MsUUFBWCxDQUFOLENBRnFILEVBRzdIdUIsR0FINkgsQ0FHekhqRSx1REFBUyxDQUFDb0Isa0RBQUksQ0FBQ3NCLFFBQUQsRUFBVzFCLGtFQUFjLEVBQXpCLENBQUwsQ0FIZ0gsQ0FBL0Y7QUFBQSxDQUFELENBQTNCLEMsQ0FJUDtBQUNBO0FBQ0EiLCJmaWxlIjoiYmFja2dyb3VuZC4yYWJkYmQ0NTlkY2FlNzQ3MDU5Mi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEtlZmlyLCB7IEVtaXR0ZXIsIE9ic2VydmFibGUsIFN0cmVhbSB9IGZyb20gJ2tlZmlyJztcbmltcG9ydCB7U3RvcmFnZUNoYW5nZX0gZnJvbSAnLi4vdHlwZXMvc3RnVHlwZXMnXG5pbXBvcnQge01zZ1dyYXBwZXIsIE1zZywgVXJsTXNnfSBmcm9tICcuLi90eXBlcy9tc2dUeXBlcydcbmltcG9ydCB7IGZsYXR0ZW5Nb2R1bGUsIGN1cnJlbnRWYWx1ZSwgaW5zcGVjdCB9IGZyb20gJy4vcHV0aWxzJztcbmltcG9ydCB7IGRlZmF1bHRPcHRpb25zLCBkZWZhdWx0U3RvcmFnZSBhcyBfZGVmYXVsdFN0b3JhZ2UsIGRldlN0b3JhZ2UgfSBmcm9tICcuL2RlZmF1bHRTdGcnO1xuaW1wb3J0ICogYXMgUiBmcm9tICdyYW1kYSc7XG5pbXBvcnQgeyBfXywgY3VycnksIHBpcGUsIGFuZFRoZW4sIG1hcCwgZmlsdGVyLCByZWR1Y2UsIHRhcCwgYXBwbHksIHRyeUNhdGNoIH0gZnJvbSAncmFtZGEnOyAvLyBGdW5jdGlvblxuaW1wb3J0IHsgcHJvcCwgcHJvcEVxLCBwcm9wU2F0aXNmaWVzLCBwYXRoLCBwYXRoRXEsIGhhc1BhdGgsIGFzc29jLCBhc3NvY1BhdGgsIHZhbHVlcywgbWVyZ2VMZWZ0LCBtZXJnZURlZXBMZWZ0LCBrZXlzLCBsZW5zLCBsZW5zUHJvcCwgbGVuc1BhdGgsIHBpY2ssIHByb2plY3QsIHNldCwgbGVuZ3RoIH0gZnJvbSAncmFtZGEnOyAvLyBPYmplY3RcbmltcG9ydCB7IGhlYWQsIHRhaWwsIHRha2UsIGlzRW1wdHksIGFueSwgYWxsLCBpbmNsdWRlcywgbGFzdCwgZHJvcFdoaWxlLCBkcm9wTGFzdFdoaWxlLCBkaWZmZXJlbmNlLCBhcHBlbmQsIGZyb21QYWlycywgZm9yRWFjaCwgbnRoLCBwbHVjaywgcmV2ZXJzZSwgdW5pcSwgc2xpY2UgfSBmcm9tICdyYW1kYSc7IC8vIExpc3RcbmltcG9ydCB7IGVxdWFscywgaWZFbHNlLCB3aGVuLCBib3RoLCBlaXRoZXIsIGlzTmlsLCBpcywgZGVmYXVsdFRvLCBhbmQsIG9yLCBub3QsIFQsIEYsIGd0LCBsdCwgZ3RlLCBsdGUsIG1heCwgbWluLCBzb3J0LCBzb3J0QnksIHNwbGl0LCB0cmltLCBtdWx0aXBseSB9IGZyb20gJ3JhbWRhJzsgLy8gTG9naWMsIFR5cGUsIFJlbGF0aW9uLCBTdHJpbmcsIE1hdGhcbmltcG9ydCB7IE9wdGlvbiwgT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL3N0Z1R5cGVzJztcbihLZWZpci5Qcm9wZXJ0eS5wcm90b3R5cGUgYXMgYW55KS5jdXJyZW50VmFsdWUgPSBjdXJyZW50VmFsdWU7XG5pbXBvcnQgY2hyb21lTW9jayBmcm9tICdjaHJvbWUtYXBpLW1vY2snO1xuXG5cbmNvbnN0IERFVklORyA9IHByb2Nlc3MuZW52LkRFVl9NT0RFID09ICdzZXJ2ZSdcbmdsb2JhbC5jaHJvbWUgPSBERVZJTkcgPyBjaHJvbWVNb2NrLmdldENocm9tZUluc3RhbmNlKCkgOiBnbG9iYWwuY2hyb21lXG5jb25zdCBkZWZhdWx0U3RvcmFnZSA9IERFVklORyA/IGRldlN0b3JhZ2UgOiBfZGVmYXVsdFN0b3JhZ2VcbmNvbnNvbGUubG9nKCdkdXRpbHMgZGVmYXVsdFN0b3JhZ2UnLCB7REVWSU5HLCBkZWZhdWx0U3RvcmFnZSwgY2hyb21lOiBnbG9iYWwuY2hyb21lLCBjaHJvbWVNb2NrLCBtb2NrOiBjaHJvbWVNb2NrLmdldENocm9tZUluc3RhbmNlKCkgfSlcblxuLy9yZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGdldHMgYSB2YWx1ZSBmcm9tIGNocm9tZSBsb2NhbCBzdG9yYWdlIFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhdGEoa2V5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAvLyBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoa2V5LCBmdW5jdGlvbiAoaXRlbXM6IHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoa2V5LCBmdW5jdGlvbiAoaXRlbXM6IHtcbiAgICAgICAgICAgIFt4OiBzdHJpbmddOiB1bmtub3duO1xuICAgICAgICB9KSB7XG4gICAgICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoaXRlbXNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuLy9yZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHNldHMgYW4gb2JqZWN0IHdpdGgga2V5IHZhbHVlIHBhaXJzIGludG8gY2hyb21lIGxvY2FsIHN0b3JhZ2UgXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0RGF0YShrZXlfdmFscykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIC8vIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChrZXlfdmFscywgKCkgPT4ge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldChrZXlfdmFscywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW0RFQlVHXSBzZXREYXRhJywgeyAuLi5rZXlfdmFscyB9KTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGtleV92YWxzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyBEZWxldGUgZGF0YSBmcm9tIHN0b3JhZ2Vcbi8vIHRha2VzIGFuIGFycmF5IG9mIGtleXNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVEYXRhKGtleXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoa2V5cywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInJlbW92ZWRcIiwga2V5cylcbiAgICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciB0cy1taWdyYXRlKDI3OTQpIEZJWE1FOiBFeHBlY3RlZCAxIGFyZ3VtZW50cywgYnV0IGdvdCAwLiBEaWQgeW91IGZvcmdldCB0by4uLiBSZW1vdmUgdGhpcyBjb21tZW50IHRvIHNlZSB0aGUgZnVsbCBlcnJvciBtZXNzYWdlXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCByZXNldFN0b3JhZ2UgPSAoKSA9PiBzZXREYXRhKGRlZmF1bHRTdG9yYWdlKCkpO1xuZXhwb3J0IGNvbnN0IHNldFN0ZyA9IGN1cnJ5KChrZXksIHZhbCkgPT4gc2V0RGF0YSh7IFtrZXldOiB2YWwgfSkpO1xuZXhwb3J0IGNvbnN0IGdldFN0ZyA9IChrZXk6IHN0cmluZykgPT4gZ2V0RGF0YShrZXkpLnRoZW4ocGlwZShkZWZhdWx0VG8oZGVmYXVsdFN0b3JhZ2UoKVtrZXldKSwgYWRkTmV3RGVmYXVsdChrZXkpKSk7XG5leHBvcnQgY29uc3QgdXBkYXRlU3RnID0gY3VycnkoKGtleSwgdmFsKSA9PiBzZXREYXRhKHsgW2tleV06IHZhbCB9KSk7XG4vLyBUT0RPOiBuZWVkIHRvIHJlbGlhYmx5IHJldHVybiB0aGUgZGVmYXVsdCBpZiBwYXRoIGRvZXNuJ3QgZXhpc3QsIHNlZSBhZGROZXdEZWZhdWx0T3B0aW9uc1xuLy8gQHRzLWV4cGVjdC1lcnJvciB0cy1taWdyYXRlKDIzNDUpIEZJWE1FOiBBcmd1bWVudCBvZiB0eXBlICdzdHJpbmcnIGlzIG5vdCBhc3NpZ25hYmxlIHRvIHBhci4uLiBSZW1vdmUgdGhpcyBjb21tZW50IHRvIHNlZSB0aGUgZnVsbCBlcnJvciBtZXNzYWdlXG5leHBvcnQgY29uc3QgZ2V0U3RnUGF0aCA9IGN1cnJ5KChfcGF0aDogc3RyaW5nKSA9PiBnZXRTdGcoaGVhZChfcGF0aCkpLnRoZW4ocGF0aCh0YWlsKF9wYXRoKSkpKTtcbi8vIEB0cy1leHBlY3QtZXJyb3IgdHMtbWlncmF0ZSgyMzQ1KSBGSVhNRTogQXJndW1lbnQgb2YgdHlwZSAnUGxhY2Vob2xkZXIgfCBfX01lcmdlRGVlcDxQbGFjZWguLi4gUmVtb3ZlIHRoaXMgY29tbWVudCB0byBzZWUgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZVxuY29uc3QgYWRkTmV3RGVmYXVsdCA9IGN1cnJ5KChrZXk6IHN0cmluZyB8IG51bWJlciwgb2xkSXRlbSkgPT4gcGlwZSh3aGVuKGlzKE9iamVjdCksIG1lcmdlRGVlcExlZnQoX18sIGRlZmF1bHRTdG9yYWdlKClba2V5XSkpKShvbGRJdGVtKSk7XG5jb25zdCBhZGROZXdEZWZhdWx0T3B0aW9ucyA9IG9sZE9wdGlvbnMgPT4gbWVyZ2VEZWVwTGVmdChvbGRPcHRpb25zLCBkZWZhdWx0T3B0aW9ucygpKTtcbmV4cG9ydCBjb25zdCBnZXRPcHRpb25zID0gYXN5bmMgKCk6IFByb21pc2U8T3B0aW9ucz4gPT4gZ2V0RGF0YSgnb3B0aW9ucycpLnRoZW4ocGlwZShkZWZhdWx0VG8oZGVmYXVsdE9wdGlvbnMoKSksIGFkZE5ld0RlZmF1bHRPcHRpb25zKSk7XG5leHBvcnQgY29uc3QgZ2V0T3B0aW9uID0gYXN5bmMgKG5hbWU6IHN0cmluZyk6IFByb21pc2U8T3B0aW9uPiA9PiBnZXRPcHRpb25zKCkudGhlbihwcm9wKG5hbWUpKTtcbi8vIEB0cy1leHBlY3QtZXJyb3IgdHMtbWlncmF0ZSgyMzQ1KSBGSVhNRTogQXJndW1lbnQgb2YgdHlwZSAnc3RyaW5nJyBpcyBub3QgYXNzaWduYWJsZSB0byBwYXIuLi4gUmVtb3ZlIHRoaXMgY29tbWVudCB0byBzZWUgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZVxuZXhwb3J0IGNvbnN0IHVwZGF0ZVN0Z1BhdGggPSBjdXJyeShhc3luYyAoX3BhdGg6IHN0cmluZywgdmFsKSA9PiBnZXRTdGcoaGVhZChfcGF0aCkpLnRoZW4ocGlwZShzZXQobGVuc1BhdGgodGFpbChfcGF0aCkpLCB2YWwpLCB0YXAoc2V0U3RnKGhlYWQoX3BhdGgpKSksIGluc3BlY3QoYHVwZGF0ZWRTdGdQYXRoICR7X3BhdGh9YCkpKSk7XG4vLyBUT0RPOiB0aGlzIGFmdGVyIHRoZSBhYm92byBUT0RPXG4vLyBAdHMtZXhwZWN0LWVycm9yIHRzLW1pZ3JhdGUoMjM0NSkgRklYTUU6IEFyZ3VtZW50IG9mIHR5cGUgJ3N0cmluZ1tdJyBpcyBub3QgYXNzaWduYWJsZSB0byBwLi4uIFJlbW92ZSB0aGlzIGNvbW1lbnQgdG8gc2VlIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2VcbmV4cG9ydCBjb25zdCB1cGRhdGVPcHRpb25TdGcgPSAobmFtZTogc3RyaW5nKSA9PiB1cGRhdGVTdGdQYXRoKFsnb3B0aW9ucycsIG5hbWUsICd2YWx1ZSddKTtcbi8vIGV4cG9ydCBjb25zdCB1cGRhdGVPcHRpb25TdGcgPSBjdXJyeShhc3luYyAobmFtZSwgdmFsKT0+IGdldE9wdGlvbnMoKS50aGVuKHBpcGUoXG4vLyAgICAgICBzZXQobGVuc1BhdGgoW25hbWUsJ3ZhbHVlJ10pLHZhbCksXG4vLyAgICAgICB0YXAoc2V0U3RnKCdvcHRpb25zJykpLFxuLy8gICAgICkpKVxuZXhwb3J0IGNvbnN0IGFwcGx5VG9PcHRpb25TdGcgPSBjdXJyeShhc3luYyAobmFtZTogc3RyaW5nIHwgbnVtYmVyLCBmbjogKHg6IHVua25vd24pID0+IGFueSkgPT4ge1xuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgdHMtbWlncmF0ZSgyMzQ1KSBGSVhNRTogQXJndW1lbnQgb2YgdHlwZSAnc3RyaW5nIHwgbnVtYmVyJyBpcyBub3QgYXNzaWduYWIuLi4gUmVtb3ZlIHRoaXMgY29tbWVudCB0byBzZWUgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZVxuICAgIHJldHVybiBnZXRPcHRpb25zKCkudGhlbihwaXBlKHBhdGgoW25hbWUsICd2YWx1ZSddKSwgZm4sIHVwZGF0ZU9wdGlvblN0ZyhuYW1lKSkpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gbXNnQkcobXNnOiBNc2cpIHtcbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtc2cpO1xuICAgIGNvbnNvbGUubG9nKFwibWVzc2FnaW5nIEJHXCIsIG1zZyk7XG59XG5leHBvcnQgZnVuY3Rpb24gbXNnQ1ModGFiSWQ6IG51bWJlciwgbXNnOiBNc2cpIHtcbiAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwgbXNnKTtcbn1cbi8vIG1ha2VzIGFuIG9uU3RvcmFnZUNoYW5nZSBmdW5jdGlvbiBnaXZlbiBhbiBhY3QgZnVuY3Rpb24gdGhhdCdzIHVzdWFsbHkgYSBzd2l0Y2ggb3ZlciBpdGVtIGtleXMgdGhhdCBoYXZlIGNoYW5nZWRcbmV4cG9ydCBmdW5jdGlvbiBtYWtlT25TdG9yYWdlQ2hhbmdlZCggYWN0OiAoc3RnQ2g6U3RvcmFnZUNoYW5nZSkgPT4gYW55KXtcblxuICAgIHJldHVybiAoY2hhbmdlczoge1t4OiBzdHJpbmddOiB7bmV3VmFsdWU6IHt9O307fSwgYXJlYTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmICghWydsb2NhbCcsICdzeW5jJ10uaW5jbHVkZXMoYXJlYSkpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgbGV0IG9sZFZhbCA9IHt9O1xuICAgICAgICBsZXQgbmV3VmFsID0ge307XG4gICAgICAgIGxldCBjaGFuZ2VkSXRlbXMgPSBPYmplY3Qua2V5cyhjaGFuZ2VzKTtcbiAgICAgICAgZm9yIChsZXQgaXRlbU5hbWUgb2YgY2hhbmdlZEl0ZW1zKSB7XG4gICAgICAgICAgICBvbGRWYWwgPSAoY2hhbmdlc1tpdGVtTmFtZV0gYXMgYW55KS5vbGRWYWx1ZTtcbiAgICAgICAgICAgIG5ld1ZhbCA9IGNoYW5nZXNbaXRlbU5hbWVdLm5ld1ZhbHVlO1xuICAgICAgICAgICAgaWYgKG9sZFZhbCA9PSBuZXdWYWwpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBhY3Qoe2l0ZW1OYW1lLCBvbGRWYWwsIG5ld1ZhbH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbi8vIGNvbnN0IG1ha2VFdmVudE9icyA9IGN1cnJ5KChldmVudDoge2FkZExpc3RlbmVyOiAoYXJnMDogYW55KSA9PiB2b2lkOyByZW1vdmVMaXN0ZW5lcjogKGFyZzA6IGFueSkgPT4gdm9pZDt9LCBtYWtlRW1pdCwgaW5pdFZhbCkgPT4ge1xuY29uc3QgbWFrZUV2ZW50T2JzID0gY3VycnkoKGV2ZW50OiBjaHJvbWUuZXZlbnRzLkV2ZW50PGFueT4sIG1ha2VFbWl0LCBpbml0VmFsOiBhbnkpOiBTdHJlYW08YW55LEVycm9yPiA9PiB7XG4gICAgcmV0dXJuIEtlZmlyLnN0cmVhbShlbWl0dGVyID0+IHtcbiAgICAgICAgLy8gZW1pdHRlci5lbWl0KGluaXRWYWwpO1xuICAgICAgICBjb25zdCBlbWl0ID0gbWFrZUVtaXQoZW1pdHRlcik7XG4gICAgICAgIGV2ZW50LmFkZExpc3RlbmVyKGVtaXQpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucmVtb3ZlTGlzdGVuZXIoZW1pdCk7XG4gICAgICAgICAgICBlbWl0dGVyLmVuZCgpO1xuICAgICAgICB9O1xuICAgIH0pO1xufSk7XG5leHBvcnQgY29uc3QgbWFrZVN0b3JhZ2VDaGFuZ2VPYnMgPSAoKTpPYnNlcnZhYmxlPFN0b3JhZ2VDaGFuZ2UsIEVycm9yPiA9PiB7XG4gICAgY29uc3QgbWFrZUVtaXRTdGdDSCA9IChlbWl0dGVyOiBFbWl0dGVyPFN0b3JhZ2VDaGFuZ2UsIEVycm9yPlxuICAgICkgPT4gbWFrZU9uU3RvcmFnZUNoYW5nZWQoKHN0Z0NoOiBTdG9yYWdlQ2hhbmdlKTogYW55ID0+IGVtaXR0ZXIuZW1pdChzdGdDaCkpO1xuICAgIHJldHVybiBtYWtlRXZlbnRPYnMoY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLCBtYWtlRW1pdFN0Z0NILCB7IGl0ZW1OYW1lOiBudWxsLCBvbGRWYWw6IG51bGwsIG5ld1ZhbDogbnVsbCB9KTtcbn07XG4vLyBzaGFsbG93XG5jb25zdCBpc1N0Z0l0ZW1TYW1lID0gKHg6IFN0b3JhZ2VDaGFuZ2UpID0+IChpc05pbCh4Lm9sZFZhbCkgJiYgaXNOaWwoeC5uZXdWYWwpKSB8fCB4Lm9sZFZhbCA9PT0geC5uZXdWYWw7XG5leHBvcnQgY29uc3QgbWFrZVN0Z1BhdGhPYnMgPSAoX3BhdGg6IHN0cmluZ1tdKTogT2JzZXJ2YWJsZTxhbnksIEVycm9yPiA9PiBtYWtlU3RvcmFnZUNoYW5nZU9icygpXG4gICAgLmZpbHRlcihwcm9wRXEoJ2l0ZW1OYW1lJywgX3BhdGhbMF0pKVxuICAgIC5tYXAocGF0aChbJ25ld1ZhbCcsIC4uLnNsaWNlKDEsIEluZmluaXR5LCBfcGF0aCldKSlcbiAgICAudG9Qcm9wZXJ0eSgpO1xuLy8gZXhwb3J0IGNvbnN0IG1ha2VTdGdJdGVtT2JzID0gaXRlbU5hbWUgPT4ge2NvbnNvbGUubG9nKCdtYWtpbmcgc3RnIGl0ZW0gb2JzIGZvciAnLCBpdGVtTmFtZSk7IHJldHVybiBtYWtlU3RvcmFnZU9icygpLmZpbHRlcihwcm9wRXEoJ2l0ZW1OYW1lJyxpdGVtTmFtZSkpLmZpbHRlcihwaXBlKGlzU3RnSXRlbVNhbWUsIG5vdCkpLm1hcChwcm9wKCduZXdWYWwnKSkuc2tpcER1cGxpY2F0ZXMoKX1cbmV4cG9ydCBjb25zdCBtYWtlU3RnSXRlbU9icyA9IGl0ZW1OYW1lID0+IG1ha2VTdGdQYXRoT2JzKFtpdGVtTmFtZV0pO1xuLy8gZXhwb3J0IGNvbnN0IG1ha2VTdGdJdGVtT2JzID0gaXRlbU5hbWUgPT4ge1xuLy8gICBjb25zb2xlLmxvZygnbWFraW5nIHN0ZyBpdGVtIG9icyBmb3IgJywgaXRlbU5hbWUpOyBcbi8vICAgcmV0dXJuIG1ha2VTdG9yYWdlT2JzKClcbi8vICAgLmZpbHRlcihwcm9wRXEoJ2l0ZW1OYW1lJyxpdGVtTmFtZSkpXG4vLyAgIC5tYXAocHJvcCgnbmV3VmFsJykpLnRvUHJvcGVydHkoKX1cbi8vIGV4cG9ydCBjb25zdCBtYWtlU3RvcmFnZVN0cmVhbSA9ICh0eXBlKSA9PiBtYWtlU3RvcmFnZWdPYnMoKS5maWx0ZXIocHJvcEVxKCd0eXBlJyx0eXBlKSlcbmV4cG9ydCBjb25zdCBtYWtlR290TXNnT2JzID0gKCk6IE9ic2VydmFibGU8TXNnV3JhcHBlcixFcnJvcj4gPT4ge1xuICAgIGNvbnN0IG1ha2VFbWl0TXNnID0gKGVtaXR0ZXI6IEVtaXR0ZXI8TXNnV3JhcHBlciwgRXJyb3I+KSA9PiAobWVzc2FnZSwgc2VuZGVyKSA9PiBlbWl0dGVyLmVtaXQoeyBtOiBtZXNzYWdlLCBzOiBzZW5kZXIgfSk7XG4gICAgcmV0dXJuIG1ha2VFdmVudE9icyhjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UsIG1ha2VFbWl0TXNnLCB7IG06IHsgdHlwZTogbnVsbCB9LCBzOiBudWxsIH0pO1xufTtcbmV4cG9ydCBjb25zdCBtYWtlTXNnU3RyZWFtID0gKG1zZ1R5cGUpOiBPYnNlcnZhYmxlPE1zZywgRXJyb3I+ID0+ICBtYWtlR290TXNnT2JzKCkubWFwKHByb3AoJ20nKSkuZmlsdGVyKHByb3BFcSgndHlwZScsIG1zZ1R5cGUpKTtcbi8vIC8vIG9wdGlvbnNDaGFuZ2UkIDo6IGNoYW5nZSAtPiBjaGFuZ2Vcbi8vIGV4cG9ydCBjb25zdCBtYWtlT3B0aW9uc0NoYW5nZU9icyA9IGFzeW5jIChzdG9yYWdlQ2hhbmdlJCkgPT4ge1xuLy8gICBjb25zdCBjYWNoZWRPcHRpb25zID0ge29sZFZhbDpudWxsLCBuZXdWYWw6YXdhaXQgZ2V0T3B0aW9ucygpfVxuLy8gICByZXR1cm4gc3RvcmFnZUNoYW5nZSQuZmlsdGVyKHg9PnguaXRlbU5hbWU9PSdvcHRpb25zJykudG9Qcm9wZXJ0eSgoKT0+Y2FjaGVkT3B0aW9ucylcbi8vIH1cbmNvbnN0IGlzT3B0aW9uU2FtZSA9IGN1cnJ5KChuYW1lOiBzdHJpbmcsIHg6IFN0b3JhZ2VDaGFuZ2UpOiBib29sZWFuID0+IGlzU3RnSXRlbVNhbWUoeCkgfHwgKCFpc05pbCh4Lm9sZFZhbCkgJiYgIWlzTmlsKHgubmV3VmFsKSAmJiAocGF0aChbJ29sZFZhbCcsIG5hbWUsICd2YWx1ZSddLCB4KSA9PT0gcGF0aChbJ25ld1ZhbCcsIG5hbWUsICd2YWx1ZSddLCB4KSkpKTtcbi8vIGNvbnN0IGlzT3B0aW9uU2FtZSA9IGN1cnJ5ICgobmFtZSwgeCk9PiAoaXNOaWwoeC5vbGRWYWwpICYmIGlzTmlsKHgubmV3VmFsKSkgfHwgKCFpc05pbCh4Lm9sZFZhbCkgJiYgIWlzTmlsKHgubmV3VmFsKSAmJiAocGF0aChbJ29sZFZhbCcsIG5hbWUsICd2YWx1ZSddLHgpID09PSBwYXRoKFsnbmV3VmFsJywgbmFtZSwgJ3ZhbHVlJ10seCkpKSApXG4vLyBtYWtlT3B0aW9uc09icyA6OiBTdHJpbmcgLT4gYVxuZXhwb3J0IGNvbnN0IG1ha2VPcHRpb25PYnMgPSBjdXJyeSgob3B0aW9uc0NoYW5nZSQ6IE9ic2VydmFibGU8U3RvcmFnZUNoYW5nZSwgYW55PiwgaXRlbU5hbWU6IHN0cmluZyk6IE9ic2VydmFibGU8T3B0aW9uLCBhbnk+ID0+IG9wdGlvbnNDaGFuZ2UkXG4gICAgLmZpbHRlcih4ID0+ICFpc09wdGlvblNhbWUoaXRlbU5hbWUsIHgpKVxuICAgIC5tYXAocGF0aDxhbnk+KFsnbmV3VmFsJywgaXRlbU5hbWVdKSlcbiAgICAubWFwKGRlZmF1bHRUbyhwcm9wKGl0ZW1OYW1lLCBkZWZhdWx0T3B0aW9ucygpKSkpKTtcbi8vIGNvbnN0IGxpc3RTZWFyY2hGaWx0ZXJzID0gcGlwZShwcm9wKCduZXdWYWwnKSwgdmFsdWVzLCBmaWx0ZXIocHJvcEVxKCd0eXBlJywgJ3NlYXJjaEZpbHRlcicpKSwgbWFwKHByb3AoJ25hbWUnKSksIFIubWFwKG1ha2VPcHRpb25PYnMpLCBpbnNwZWN0KCdsaXN0c2VhcmNoZmlsdGVycycpKTtcbi8vIGNvbnN0IGNvbWJpbmVPcHRpb25zID0gKC4uLmFyZ3MpID0+IHBpcGUoaW5zcGVjdCgnY29tYmluZW9wdCcpLCByZWR1Y2UoKGEsIGIpID0+IGFzc29jKGIubmFtZSwgYi52YWx1ZSwgYSksIHt9KSkoYXJncyk7XG4vLyBleHBvcnQgY29uc3QgbWFrZVNlYXJjaEZpbHRlcnNPYnMgPSAoKSA9PiBLZWZpci5jb21iaW5lKFtnZXRSVCQsIHVzZUJvb2ttYXJrcyQsIHVzZVJlcGxpZXMkXSwgY29tYmluZU9wdGlvbnMpLnRvUHJvcGVydHkoKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=