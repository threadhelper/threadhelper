webpackHotUpdate("content-script",{

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
              chrome.storage.sync.get([key], function (items) {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError.message);
                  reject(chrome.runtime.lastError.message);
                } else {
                  console.log('stg got', {
                    key: key
                  });
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
              chrome.storage.sync.remove(keys, function () {
                // chrome.storage.local.remove(keys, function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvZHV0aWxzLnRzeCJdLCJuYW1lcyI6WyJLZWZpciIsIlByb3BlcnR5IiwicHJvdG90eXBlIiwiY3VycmVudFZhbHVlIiwiREVWSU5HIiwicHJvY2VzcyIsImdsb2JhbCIsImNocm9tZSIsImNocm9tZU1vY2siLCJnZXRDaHJvbWVJbnN0YW5jZSIsImRlZmF1bHRTdG9yYWdlIiwiZGV2U3RvcmFnZSIsIl9kZWZhdWx0U3RvcmFnZSIsImNvbnNvbGUiLCJsb2ciLCJtb2NrIiwiZ2V0RGF0YSIsImtleSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RvcmFnZSIsInN5bmMiLCJnZXQiLCJpdGVtcyIsInJ1bnRpbWUiLCJsYXN0RXJyb3IiLCJlcnJvciIsIm1lc3NhZ2UiLCJzZXREYXRhIiwia2V5X3ZhbHMiLCJzZXQiLCJyZW1vdmVEYXRhIiwia2V5cyIsInJlbW92ZSIsInJlc2V0U3RvcmFnZSIsInNldFN0ZyIsImN1cnJ5IiwidmFsIiwiZ2V0U3RnIiwidGhlbiIsInBpcGUiLCJkZWZhdWx0VG8iLCJhZGROZXdEZWZhdWx0IiwidXBkYXRlU3RnIiwiZ2V0U3RnUGF0aCIsIl9wYXRoIiwiaGVhZCIsInBhdGgiLCJ0YWlsIiwib2xkSXRlbSIsIndoZW4iLCJpcyIsIk9iamVjdCIsIm1lcmdlRGVlcExlZnQiLCJfXyIsImFkZE5ld0RlZmF1bHRPcHRpb25zIiwib2xkT3B0aW9ucyIsImRlZmF1bHRPcHRpb25zIiwiZ2V0T3B0aW9ucyIsImdldE9wdGlvbiIsIm5hbWUiLCJwcm9wIiwidXBkYXRlU3RnUGF0aCIsImxlbnNQYXRoIiwidGFwIiwiaW5zcGVjdCIsInVwZGF0ZU9wdGlvblN0ZyIsImFwcGx5VG9PcHRpb25TdGciLCJmbiIsIm1zZ0JHIiwibXNnIiwic2VuZE1lc3NhZ2UiLCJtc2dDUyIsInRhYklkIiwidGFicyIsIm1ha2VPblN0b3JhZ2VDaGFuZ2VkIiwiYWN0IiwiY2hhbmdlcyIsImFyZWEiLCJpbmNsdWRlcyIsIm9sZFZhbCIsIm5ld1ZhbCIsImNoYW5nZWRJdGVtcyIsIml0ZW1OYW1lIiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsIm1ha2VFdmVudE9icyIsImV2ZW50IiwibWFrZUVtaXQiLCJpbml0VmFsIiwic3RyZWFtIiwiZW1pdHRlciIsImVtaXQiLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwiZW5kIiwibWFrZVN0b3JhZ2VDaGFuZ2VPYnMiLCJtYWtlRW1pdFN0Z0NIIiwic3RnQ2giLCJvbkNoYW5nZWQiLCJpc1N0Z0l0ZW1TYW1lIiwieCIsImlzTmlsIiwibWFrZVN0Z1BhdGhPYnMiLCJmaWx0ZXIiLCJwcm9wRXEiLCJtYXAiLCJzbGljZSIsIkluZmluaXR5IiwidG9Qcm9wZXJ0eSIsIm1ha2VTdGdJdGVtT2JzIiwibWFrZUdvdE1zZ09icyIsIm1ha2VFbWl0TXNnIiwic2VuZGVyIiwibSIsInMiLCJvbk1lc3NhZ2UiLCJ0eXBlIiwibWFrZU1zZ1N0cmVhbSIsIm1zZ1R5cGUiLCJpc09wdGlvblNhbWUiLCJtYWtlT3B0aW9uT2JzIiwib3B0aW9uc0NoYW5nZSQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUdBO0FBQ0E7Q0FFNkY7O0NBQytGOztDQUNYOztDQUNWOztBQUV0S0EsNkNBQUssQ0FBQ0MsUUFBTixDQUFlQyxTQUFoQixDQUFrQ0MsWUFBbEMsR0FBaURBLG9EQUFqRDtBQUNBO0FBR0EsSUFBTUMsTUFBTSxHQUFHQyxPQUFBLElBQXdCLE9BQXZDO0FBQ0FDLE1BQU0sQ0FBQ0MsTUFBUCxHQUFnQkgsTUFBTSxHQUFHSSxzREFBVSxDQUFDQyxpQkFBWCxFQUFILEdBQW9DSCxNQUFNLENBQUNDLE1BQWpFO0FBQ0EsSUFBTUcsY0FBYyxHQUFHTixNQUFNLEdBQUdPLHNEQUFILEdBQWdCQywwREFBN0M7QUFDQUMsT0FBTyxDQUFDQyxHQUFSLENBQVksdUJBQVosRUFBcUM7QUFBQ1YsUUFBTSxFQUFOQSxNQUFEO0FBQVNNLGdCQUFjLEVBQWRBLGNBQVQ7QUFBeUJILFFBQU0sRUFBRUQsTUFBTSxDQUFDQyxNQUF4QztBQUFnREMsWUFBVSxFQUFWQSxzREFBaEQ7QUFBNERPLE1BQUksRUFBRVAsc0RBQVUsQ0FBQ0MsaUJBQVg7QUFBbEUsQ0FBckMsRSxDQUVBOztBQUNPLFNBQWVPLE9BQXRCO0FBQUE7QUFBQSxDLENBZUE7OztxRUFmTyxrQkFBdUJDLEdBQXZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FDSSxJQUFJQyxPQUFKLENBQVksVUFBVUMsT0FBVixFQUFtQkMsTUFBbkIsRUFBMkI7QUFDMUM7QUFDQWIsb0JBQU0sQ0FBQ2MsT0FBUCxDQUFlQyxJQUFmLENBQW9CQyxHQUFwQixDQUF3QixDQUFDTixHQUFELENBQXhCLEVBQStCLFVBQVVPLEtBQVYsRUFBMEM7QUFDckUsb0JBQUlqQixNQUFNLENBQUNrQixPQUFQLENBQWVDLFNBQW5CLEVBQThCO0FBQzFCYix5QkFBTyxDQUFDYyxLQUFSLENBQWNwQixNQUFNLENBQUNrQixPQUFQLENBQWVDLFNBQWYsQ0FBeUJFLE9BQXZDO0FBQ0FSLHdCQUFNLENBQUNiLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZUMsU0FBZixDQUF5QkUsT0FBMUIsQ0FBTjtBQUNILGlCQUhELE1BSUs7QUFDRGYseUJBQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQVosRUFBdUI7QUFBQ0csdUJBQUcsRUFBSEE7QUFBRCxtQkFBdkI7QUFDQUUseUJBQU8sQ0FBQ0ssS0FBSyxDQUFDUCxHQUFELENBQU4sQ0FBUDtBQUNIO0FBQ0osZUFURDtBQVVILGFBWk0sQ0FESjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O0FBZ0JBLFNBQWVZLE9BQXRCO0FBQUE7QUFBQSxDLENBZUE7QUFDQTs7O3FFQWhCTyxrQkFBdUJDLFFBQXZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FDSSxJQUFJWixPQUFKLENBQVksVUFBVUMsT0FBVixFQUFtQkMsTUFBbkIsRUFBMkI7QUFDMUM7QUFDQWIsb0JBQU0sQ0FBQ2MsT0FBUCxDQUFlQyxJQUFmLENBQW9CUyxHQUFwQixDQUF3QkQsUUFBeEIsRUFBa0MsWUFBTTtBQUNwQyxvQkFBSXZCLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZUMsU0FBbkIsRUFBOEI7QUFDMUJiLHlCQUFPLENBQUNjLEtBQVIsQ0FBY3BCLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZUMsU0FBZixDQUF5QkUsT0FBdkM7QUFDQVIsd0JBQU0sQ0FBQ2IsTUFBTSxDQUFDa0IsT0FBUCxDQUFlQyxTQUFmLENBQXlCRSxPQUExQixDQUFOO0FBQ0gsaUJBSEQsTUFJSztBQUNEZix5QkFBTyxDQUFDQyxHQUFSLENBQVksaUJBQVosb0JBQW9DZ0IsUUFBcEM7QUFDQVgseUJBQU8sQ0FBQ1csUUFBRCxDQUFQO0FBQ0g7QUFDSixlQVREO0FBVUgsYUFaTSxDQURKOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7Ozs7QUFpQkEsU0FBZUUsVUFBdEI7QUFBQTtBQUFBOzs7d0VBQU8sa0JBQTBCQyxJQUExQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOENBQ0ksSUFBSWYsT0FBSixDQUFZLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQzFDYixvQkFBTSxDQUFDYyxPQUFQLENBQWVDLElBQWYsQ0FBb0JZLE1BQXBCLENBQTJCRCxJQUEzQixFQUFpQyxZQUFZO0FBQzdDO0FBQ0k7QUFDQSxvQkFBSTFCLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZUMsU0FBbkIsRUFBOEI7QUFDMUJiLHlCQUFPLENBQUNjLEtBQVIsQ0FBY3BCLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZUMsU0FBZixDQUF5QkUsT0FBdkM7QUFDQVIsd0JBQU0sQ0FBQ2IsTUFBTSxDQUFDa0IsT0FBUCxDQUFlQyxTQUFmLENBQXlCRSxPQUExQixDQUFOO0FBQ0gsaUJBSEQsTUFJSztBQUNEO0FBQ0FULHlCQUFPO0FBQ1Y7QUFDSixlQVhEO0FBWUgsYUFiTSxDQURKOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7Ozs7QUFnQkEsSUFBTWdCLFlBQVksR0FBRyxTQUFmQSxZQUFlO0FBQUEsU0FBTU4sT0FBTyxDQUFDbkIsY0FBYyxFQUFmLENBQWI7QUFBQSxDQUFyQjtBQUNBLElBQU0wQixNQUFNLEdBQUdDLG1EQUFLLENBQUMsVUFBQ3BCLEdBQUQsRUFBTXFCLEdBQU47QUFBQSxTQUFjVCxPQUFPLHFCQUFJWixHQUFKLEVBQVVxQixHQUFWLEVBQXJCO0FBQUEsQ0FBRCxDQUFwQjtBQUNBLElBQU1DLE1BQU0sR0FBRyxTQUFUQSxNQUFTLENBQUN0QixHQUFEO0FBQUEsU0FBaUJELE9BQU8sQ0FBQ0MsR0FBRCxDQUFQLENBQWF1QixJQUFiLENBQWtCQyxrREFBSSxDQUFDQyx1REFBUyxDQUFDaEMsY0FBYyxHQUFHTyxHQUFILENBQWYsQ0FBVixFQUFtQzBCLGFBQWEsQ0FBQzFCLEdBQUQsQ0FBaEQsQ0FBdEIsQ0FBakI7QUFBQSxDQUFmO0FBQ0EsSUFBTTJCLFNBQVMsR0FBR1AsbURBQUssQ0FBQyxVQUFDcEIsR0FBRCxFQUFNcUIsR0FBTjtBQUFBLFNBQWNULE9BQU8scUJBQUlaLEdBQUosRUFBVXFCLEdBQVYsRUFBckI7QUFBQSxDQUFELENBQXZCLEMsQ0FDUDtBQUNBOztBQUNPLElBQU1PLFVBQVUsR0FBR1IsbURBQUssQ0FBQyxVQUFDUyxLQUFEO0FBQUEsU0FBbUJQLE1BQU0sQ0FBQ1Esa0RBQUksQ0FBQ0QsS0FBRCxDQUFMLENBQU4sQ0FBb0JOLElBQXBCLENBQXlCUSxrREFBSSxDQUFDQyxrREFBSSxDQUFDSCxLQUFELENBQUwsQ0FBN0IsQ0FBbkI7QUFBQSxDQUFELENBQXhCLEMsQ0FDUDs7QUFDQSxJQUFNSCxhQUFhLEdBQUdOLG1EQUFLLENBQUMsVUFBQ3BCLEdBQUQsRUFBdUJpQyxPQUF2QjtBQUFBLFNBQW1DVCxrREFBSSxDQUFDVSxrREFBSSxDQUFDQyxnREFBRSxDQUFDQyxNQUFELENBQUgsRUFBYUMsMkRBQWEsQ0FBQ0Msd0NBQUQsRUFBSzdDLGNBQWMsR0FBR08sR0FBSCxDQUFuQixDQUExQixDQUFMLENBQUosQ0FBaUVpQyxPQUFqRSxDQUFuQztBQUFBLENBQUQsQ0FBM0I7O0FBQ0EsSUFBTU0sb0JBQW9CLEdBQUcsU0FBdkJBLG9CQUF1QixDQUFBQyxVQUFVO0FBQUEsU0FBSUgsMkRBQWEsQ0FBQ0csVUFBRCxFQUFhQyxrRUFBYyxFQUEzQixDQUFqQjtBQUFBLENBQXZDOztBQUNPLElBQU1DLFVBQVU7QUFBQSxxRUFBRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkNBQThCM0MsT0FBTyxDQUFDLFNBQUQsQ0FBUCxDQUFtQndCLElBQW5CLENBQXdCQyxrREFBSSxDQUFDQyx1REFBUyxDQUFDZ0Isa0VBQWMsRUFBZixDQUFWLEVBQThCRixvQkFBOUIsQ0FBNUIsQ0FBOUI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBSDs7QUFBQSxrQkFBVkcsVUFBVTtBQUFBO0FBQUE7QUFBQSxHQUFoQjtBQUNBLElBQU1DLFNBQVM7QUFBQSxzRUFBRyxrQkFBT0MsSUFBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOENBQXlDRixVQUFVLEdBQUduQixJQUFiLENBQWtCc0Isa0RBQUksQ0FBQ0QsSUFBRCxDQUF0QixDQUF6Qzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFIOztBQUFBLGtCQUFURCxTQUFTO0FBQUE7QUFBQTtBQUFBLEdBQWYsQyxDQUNQOztBQUNPLElBQU1HLGFBQWEsR0FBRzFCLG1EQUFLO0FBQUEsc0VBQUMsa0JBQU9TLEtBQVAsRUFBc0JSLEdBQXRCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FBOEJDLE1BQU0sQ0FBQ1Esa0RBQUksQ0FBQ0QsS0FBRCxDQUFMLENBQU4sQ0FBb0JOLElBQXBCLENBQXlCQyxrREFBSSxDQUFDVixpREFBRyxDQUFDaUMsc0RBQVEsQ0FBQ2Ysa0RBQUksQ0FBQ0gsS0FBRCxDQUFMLENBQVQsRUFBd0JSLEdBQXhCLENBQUosRUFBa0MyQixpREFBRyxDQUFDN0IsTUFBTSxDQUFDVyxrREFBSSxDQUFDRCxLQUFELENBQUwsQ0FBUCxDQUFyQyxFQUE0RG9CLHVEQUFPLDBCQUFtQnBCLEtBQW5CLEVBQW5FLENBQTdCLENBQTlCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUQ7O0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFBM0IsQyxDQUNQO0FBQ0E7O0FBQ08sSUFBTXFCLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0IsQ0FBQ04sSUFBRDtBQUFBLFNBQWtCRSxhQUFhLENBQUMsQ0FBQyxTQUFELEVBQVlGLElBQVosRUFBa0IsT0FBbEIsQ0FBRCxDQUEvQjtBQUFBLENBQXhCLEMsQ0FDUDtBQUNBO0FBQ0E7QUFDQTs7QUFDTyxJQUFNTyxnQkFBZ0IsR0FBRy9CLG1EQUFLO0FBQUEsc0VBQUMsa0JBQU93QixJQUFQLEVBQThCUSxFQUE5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOENBRTNCVixVQUFVLEdBQUduQixJQUFiLENBQWtCQyxrREFBSSxDQUFDTyxrREFBSSxDQUFDLENBQUNhLElBQUQsRUFBTyxPQUFQLENBQUQsQ0FBTCxFQUF3QlEsRUFBeEIsRUFBNEJGLGVBQWUsQ0FBQ04sSUFBRCxDQUEzQyxDQUF0QixDQUYyQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFEOztBQUFBO0FBQUE7QUFBQTtBQUFBLElBQTlCO0FBSUEsU0FBU1MsS0FBVCxDQUFlQyxHQUFmLEVBQXlCO0FBQzVCaEUsUUFBTSxDQUFDa0IsT0FBUCxDQUFlK0MsV0FBZixDQUEyQkQsR0FBM0I7QUFDQTFELFNBQU8sQ0FBQ0MsR0FBUixDQUFZLGNBQVosRUFBNEJ5RCxHQUE1QjtBQUNIO0FBQ00sU0FBU0UsS0FBVCxDQUFlQyxLQUFmLEVBQThCSCxHQUE5QixFQUF3QztBQUMzQ2hFLFFBQU0sQ0FBQ29FLElBQVAsQ0FBWUgsV0FBWixDQUF3QkUsS0FBeEIsRUFBK0JILEdBQS9CO0FBQ0gsQyxDQUNEOztBQUNPLFNBQVNLLG9CQUFULENBQStCQyxHQUEvQixFQUFpRTtBQUVwRSxTQUFPLFVBQUNDLE9BQUQsRUFBMkNDLElBQTNDLEVBQTREO0FBQy9ELFFBQUksQ0FBQyxDQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCQyxRQUFsQixDQUEyQkQsSUFBM0IsQ0FBTCxFQUNJLE9BQU8sSUFBUDtBQUNKLFFBQUlFLE1BQU0sR0FBRyxFQUFiO0FBQ0EsUUFBSUMsTUFBTSxHQUFHLEVBQWI7QUFDQSxRQUFJQyxZQUFZLEdBQUc5QixNQUFNLENBQUNwQixJQUFQLENBQVk2QyxPQUFaLENBQW5COztBQUNBLHFDQUFxQkssWUFBckIsbUNBQW1DO0FBQTlCLFVBQUlDLFFBQVEsb0JBQVo7QUFDREgsWUFBTSxHQUFJSCxPQUFPLENBQUNNLFFBQUQsQ0FBUixDQUEyQkMsUUFBcEM7QUFDQUgsWUFBTSxHQUFHSixPQUFPLENBQUNNLFFBQUQsQ0FBUCxDQUFrQkUsUUFBM0I7QUFDQSxVQUFJTCxNQUFNLElBQUlDLE1BQWQsRUFDSTtBQUNKTCxTQUFHLENBQUM7QUFBQ08sZ0JBQVEsRUFBUkEsUUFBRDtBQUFXSCxjQUFNLEVBQU5BLE1BQVg7QUFBbUJDLGNBQU0sRUFBTkE7QUFBbkIsT0FBRCxDQUFIO0FBQ0g7QUFDSixHQWJEO0FBY0gsQyxDQUNEOztBQUNBLElBQU1LLFlBQVksR0FBR2xELG1EQUFLLENBQUMsVUFBQ21ELEtBQUQsRUFBa0NDLFFBQWxDLEVBQTRDQyxPQUE1QyxFQUFnRjtBQUN2RyxTQUFPMUYsNkNBQUssQ0FBQzJGLE1BQU4sQ0FBYSxVQUFBQyxPQUFPLEVBQUk7QUFDM0I7QUFDQSxRQUFNQyxJQUFJLEdBQUdKLFFBQVEsQ0FBQ0csT0FBRCxDQUFyQjtBQUNBSixTQUFLLENBQUNNLFdBQU4sQ0FBa0JELElBQWxCO0FBQ0EsV0FBTyxZQUFNO0FBQ1RMLFdBQUssQ0FBQ08sY0FBTixDQUFxQkYsSUFBckI7QUFDQUQsYUFBTyxDQUFDSSxHQUFSO0FBQ0gsS0FIRDtBQUlILEdBUk0sQ0FBUDtBQVNILENBVnlCLENBQTFCO0FBV08sSUFBTUMsb0JBQW9CLEdBQUcsU0FBdkJBLG9CQUF1QixHQUF1QztBQUN2RSxNQUFNQyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQUNOLE9BQUQ7QUFBQSxXQUNqQmhCLG9CQUFvQixDQUFDLFVBQUN1QixLQUFEO0FBQUEsYUFBK0JQLE9BQU8sQ0FBQ0MsSUFBUixDQUFhTSxLQUFiLENBQS9CO0FBQUEsS0FBRCxDQURIO0FBQUEsR0FBdEI7O0FBRUEsU0FBT1osWUFBWSxDQUFDaEYsTUFBTSxDQUFDYyxPQUFQLENBQWUrRSxTQUFoQixFQUEyQkYsYUFBM0IsRUFBMEM7QUFBRWQsWUFBUSxFQUFFLElBQVo7QUFBa0JILFVBQU0sRUFBRSxJQUExQjtBQUFnQ0MsVUFBTSxFQUFFO0FBQXhDLEdBQTFDLENBQW5CO0FBQ0gsQ0FKTSxDLENBS1A7O0FBQ0EsSUFBTW1CLGFBQWEsR0FBRyxTQUFoQkEsYUFBZ0IsQ0FBQ0MsQ0FBRDtBQUFBLFNBQXVCQyxtREFBSyxDQUFDRCxDQUFDLENBQUNyQixNQUFILENBQUwsSUFBbUJzQixtREFBSyxDQUFDRCxDQUFDLENBQUNwQixNQUFILENBQXpCLElBQXdDb0IsQ0FBQyxDQUFDckIsTUFBRixLQUFhcUIsQ0FBQyxDQUFDcEIsTUFBN0U7QUFBQSxDQUF0Qjs7QUFDTyxJQUFNc0IsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixDQUFDMUQsS0FBRDtBQUFBLFNBQTZDbUQsb0JBQW9CLEdBQzFGUSxNQURzRSxDQUMvREMsb0RBQU0sQ0FBQyxVQUFELEVBQWE1RCxLQUFLLENBQUMsQ0FBRCxDQUFsQixDQUR5RCxFQUV0RTZELEdBRnNFLENBRWxFM0Qsa0RBQUksRUFBRSxRQUFGLDRCQUFlNEQsbURBQUssQ0FBQyxDQUFELEVBQUlDLFFBQUosRUFBYy9ELEtBQWQsQ0FBcEIsR0FGOEQsRUFHdEVnRSxVQUhzRSxFQUE3QztBQUFBLENBQXZCLEMsQ0FJUDs7QUFDTyxJQUFNQyxjQUFjLEdBQUcsU0FBakJBLGNBQWlCLENBQUEzQixRQUFRO0FBQUEsU0FBSW9CLGNBQWMsQ0FBQyxDQUFDcEIsUUFBRCxDQUFELENBQWxCO0FBQUEsQ0FBL0IsQyxDQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDTyxJQUFNNEIsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixHQUFvQztBQUM3RCxNQUFNQyxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFDckIsT0FBRDtBQUFBLFdBQXlDLFVBQUNoRSxPQUFELEVBQVVzRixNQUFWO0FBQUEsYUFBcUJ0QixPQUFPLENBQUNDLElBQVIsQ0FBYTtBQUFFc0IsU0FBQyxFQUFFdkYsT0FBTDtBQUFjd0YsU0FBQyxFQUFFRjtBQUFqQixPQUFiLENBQXJCO0FBQUEsS0FBekM7QUFBQSxHQUFwQjs7QUFDQSxTQUFPM0IsWUFBWSxDQUFDaEYsTUFBTSxDQUFDa0IsT0FBUCxDQUFlNEYsU0FBaEIsRUFBMkJKLFdBQTNCLEVBQXdDO0FBQUVFLEtBQUMsRUFBRTtBQUFFRyxVQUFJLEVBQUU7QUFBUixLQUFMO0FBQXFCRixLQUFDLEVBQUU7QUFBeEIsR0FBeEMsQ0FBbkI7QUFDSCxDQUhNO0FBSUEsSUFBTUcsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixDQUFDQyxPQUFEO0FBQUEsU0FBc0NSLGFBQWEsR0FBR0wsR0FBaEIsQ0FBb0I3QyxrREFBSSxDQUFDLEdBQUQsQ0FBeEIsRUFBK0IyQyxNQUEvQixDQUFzQ0Msb0RBQU0sQ0FBQyxNQUFELEVBQVNjLE9BQVQsQ0FBNUMsQ0FBdEM7QUFBQSxDQUF0QixDLENBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNQyxZQUFZLEdBQUdwRixtREFBSyxDQUFDLFVBQUN3QixJQUFELEVBQWV5QyxDQUFmO0FBQUEsU0FBNkNELGFBQWEsQ0FBQ0MsQ0FBRCxDQUFiLElBQXFCLENBQUNDLG1EQUFLLENBQUNELENBQUMsQ0FBQ3JCLE1BQUgsQ0FBTixJQUFvQixDQUFDc0IsbURBQUssQ0FBQ0QsQ0FBQyxDQUFDcEIsTUFBSCxDQUExQixJQUF5Q2xDLGtEQUFJLENBQUMsQ0FBQyxRQUFELEVBQVdhLElBQVgsRUFBaUIsT0FBakIsQ0FBRCxFQUE0QnlDLENBQTVCLENBQUosS0FBdUN0RCxrREFBSSxDQUFDLENBQUMsUUFBRCxFQUFXYSxJQUFYLEVBQWlCLE9BQWpCLENBQUQsRUFBNEJ5QyxDQUE1QixDQUF0SjtBQUFBLENBQUQsQ0FBMUIsQyxDQUNBO0FBQ0E7O0FBQ08sSUFBTW9CLGFBQWEsR0FBR3JGLG1EQUFLLENBQUMsVUFBQ3NGLGNBQUQsRUFBaUR2QyxRQUFqRDtBQUFBLFNBQStGdUMsY0FBYyxDQUMzSWxCLE1BRDZILENBQ3RILFVBQUFILENBQUM7QUFBQSxXQUFJLENBQUNtQixZQUFZLENBQUNyQyxRQUFELEVBQVdrQixDQUFYLENBQWpCO0FBQUEsR0FEcUgsRUFFN0hLLEdBRjZILENBRXpIM0Qsa0RBQUksQ0FBTSxDQUFDLFFBQUQsRUFBV29DLFFBQVgsQ0FBTixDQUZxSCxFQUc3SHVCLEdBSDZILENBR3pIakUsdURBQVMsQ0FBQ29CLGtEQUFJLENBQUNzQixRQUFELEVBQVcxQixrRUFBYyxFQUF6QixDQUFMLENBSGdILENBQS9GO0FBQUEsQ0FBRCxDQUEzQixDLENBSVA7QUFDQTtBQUNBIiwiZmlsZSI6ImNvbnRlbnQtc2NyaXB0LjVhMTRhNmUwYWY4MmUyNTZkODFjLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgS2VmaXIsIHsgRW1pdHRlciwgT2JzZXJ2YWJsZSwgU3RyZWFtIH0gZnJvbSAna2VmaXInO1xuaW1wb3J0IHtTdG9yYWdlQ2hhbmdlfSBmcm9tICcuLi90eXBlcy9zdGdUeXBlcydcbmltcG9ydCB7TXNnV3JhcHBlciwgTXNnLCBVcmxNc2d9IGZyb20gJy4uL3R5cGVzL21zZ1R5cGVzJ1xuaW1wb3J0IHsgZmxhdHRlbk1vZHVsZSwgY3VycmVudFZhbHVlLCBpbnNwZWN0IH0gZnJvbSAnLi9wdXRpbHMnO1xuaW1wb3J0IHsgZGVmYXVsdE9wdGlvbnMsIGRlZmF1bHRTdG9yYWdlIGFzIF9kZWZhdWx0U3RvcmFnZSwgZGV2U3RvcmFnZSB9IGZyb20gJy4vZGVmYXVsdFN0Zyc7XG5pbXBvcnQgKiBhcyBSIGZyb20gJ3JhbWRhJztcbmltcG9ydCB7IF9fLCBjdXJyeSwgcGlwZSwgYW5kVGhlbiwgbWFwLCBmaWx0ZXIsIHJlZHVjZSwgdGFwLCBhcHBseSwgdHJ5Q2F0Y2ggfSBmcm9tICdyYW1kYSc7IC8vIEZ1bmN0aW9uXG5pbXBvcnQgeyBwcm9wLCBwcm9wRXEsIHByb3BTYXRpc2ZpZXMsIHBhdGgsIHBhdGhFcSwgaGFzUGF0aCwgYXNzb2MsIGFzc29jUGF0aCwgdmFsdWVzLCBtZXJnZUxlZnQsIG1lcmdlRGVlcExlZnQsIGtleXMsIGxlbnMsIGxlbnNQcm9wLCBsZW5zUGF0aCwgcGljaywgcHJvamVjdCwgc2V0LCBsZW5ndGggfSBmcm9tICdyYW1kYSc7IC8vIE9iamVjdFxuaW1wb3J0IHsgaGVhZCwgdGFpbCwgdGFrZSwgaXNFbXB0eSwgYW55LCBhbGwsIGluY2x1ZGVzLCBsYXN0LCBkcm9wV2hpbGUsIGRyb3BMYXN0V2hpbGUsIGRpZmZlcmVuY2UsIGFwcGVuZCwgZnJvbVBhaXJzLCBmb3JFYWNoLCBudGgsIHBsdWNrLCByZXZlcnNlLCB1bmlxLCBzbGljZSB9IGZyb20gJ3JhbWRhJzsgLy8gTGlzdFxuaW1wb3J0IHsgZXF1YWxzLCBpZkVsc2UsIHdoZW4sIGJvdGgsIGVpdGhlciwgaXNOaWwsIGlzLCBkZWZhdWx0VG8sIGFuZCwgb3IsIG5vdCwgVCwgRiwgZ3QsIGx0LCBndGUsIGx0ZSwgbWF4LCBtaW4sIHNvcnQsIHNvcnRCeSwgc3BsaXQsIHRyaW0sIG11bHRpcGx5IH0gZnJvbSAncmFtZGEnOyAvLyBMb2dpYywgVHlwZSwgUmVsYXRpb24sIFN0cmluZywgTWF0aFxuaW1wb3J0IHsgT3B0aW9uLCBPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvc3RnVHlwZXMnO1xuKEtlZmlyLlByb3BlcnR5LnByb3RvdHlwZSBhcyBhbnkpLmN1cnJlbnRWYWx1ZSA9IGN1cnJlbnRWYWx1ZTtcbmltcG9ydCBjaHJvbWVNb2NrIGZyb20gJ2Nocm9tZS1hcGktbW9jayc7XG5cblxuY29uc3QgREVWSU5HID0gcHJvY2Vzcy5lbnYuREVWX01PREUgPT0gJ3NlcnZlJ1xuZ2xvYmFsLmNocm9tZSA9IERFVklORyA/IGNocm9tZU1vY2suZ2V0Q2hyb21lSW5zdGFuY2UoKSA6IGdsb2JhbC5jaHJvbWVcbmNvbnN0IGRlZmF1bHRTdG9yYWdlID0gREVWSU5HID8gZGV2U3RvcmFnZSA6IF9kZWZhdWx0U3RvcmFnZVxuY29uc29sZS5sb2coJ2R1dGlscyBkZWZhdWx0U3RvcmFnZScsIHtERVZJTkcsIGRlZmF1bHRTdG9yYWdlLCBjaHJvbWU6IGdsb2JhbC5jaHJvbWUsIGNocm9tZU1vY2ssIG1vY2s6IGNocm9tZU1vY2suZ2V0Q2hyb21lSW5zdGFuY2UoKSB9KVxuXG4vL3JldHVybnMgYSBwcm9taXNlIHRoYXQgZ2V0cyBhIHZhbHVlIGZyb20gY2hyb21lIGxvY2FsIHN0b3JhZ2UgXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YShrZXk6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIC8vIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChrZXksIGZ1bmN0aW9uIChpdGVtczoge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChba2V5XSwgZnVuY3Rpb24gKGl0ZW1zOiB7W3g6IHN0cmluZ106IHVua25vd247fSkge1xuICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3RnIGdvdCcsIHtrZXksfSlcbiAgICAgICAgICAgICAgICByZXNvbHZlKGl0ZW1zW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vcmV0dXJucyBhIHByb21pc2UgdGhhdCBzZXRzIGFuIG9iamVjdCB3aXRoIGtleSB2YWx1ZSBwYWlycyBpbnRvIGNocm9tZSBsb2NhbCBzdG9yYWdlIFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldERhdGEoa2V5X3ZhbHMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAvLyBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoa2V5X3ZhbHMsICgpID0+IHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoa2V5X3ZhbHMsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tERUJVR10gc2V0RGF0YScsIHsgLi4ua2V5X3ZhbHMgfSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShrZXlfdmFscyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuLy8gRGVsZXRlIGRhdGEgZnJvbSBzdG9yYWdlXG4vLyB0YWtlcyBhbiBhcnJheSBvZiBrZXlzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlRGF0YShrZXlzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5yZW1vdmUoa2V5cywgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoa2V5cywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInJlbW92ZWRcIiwga2V5cylcbiAgICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciB0cy1taWdyYXRlKDI3OTQpIEZJWE1FOiBFeHBlY3RlZCAxIGFyZ3VtZW50cywgYnV0IGdvdCAwLiBEaWQgeW91IGZvcmdldCB0by4uLiBSZW1vdmUgdGhpcyBjb21tZW50IHRvIHNlZSB0aGUgZnVsbCBlcnJvciBtZXNzYWdlXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCByZXNldFN0b3JhZ2UgPSAoKSA9PiBzZXREYXRhKGRlZmF1bHRTdG9yYWdlKCkpO1xuZXhwb3J0IGNvbnN0IHNldFN0ZyA9IGN1cnJ5KChrZXksIHZhbCkgPT4gc2V0RGF0YSh7IFtrZXldOiB2YWwgfSkpO1xuZXhwb3J0IGNvbnN0IGdldFN0ZyA9IChrZXk6IHN0cmluZykgPT4gZ2V0RGF0YShrZXkpLnRoZW4ocGlwZShkZWZhdWx0VG8oZGVmYXVsdFN0b3JhZ2UoKVtrZXldKSwgYWRkTmV3RGVmYXVsdChrZXkpKSk7XG5leHBvcnQgY29uc3QgdXBkYXRlU3RnID0gY3VycnkoKGtleSwgdmFsKSA9PiBzZXREYXRhKHsgW2tleV06IHZhbCB9KSk7XG4vLyBUT0RPOiBuZWVkIHRvIHJlbGlhYmx5IHJldHVybiB0aGUgZGVmYXVsdCBpZiBwYXRoIGRvZXNuJ3QgZXhpc3QsIHNlZSBhZGROZXdEZWZhdWx0T3B0aW9uc1xuLy8gQHRzLWV4cGVjdC1lcnJvciB0cy1taWdyYXRlKDIzNDUpIEZJWE1FOiBBcmd1bWVudCBvZiB0eXBlICdzdHJpbmcnIGlzIG5vdCBhc3NpZ25hYmxlIHRvIHBhci4uLiBSZW1vdmUgdGhpcyBjb21tZW50IHRvIHNlZSB0aGUgZnVsbCBlcnJvciBtZXNzYWdlXG5leHBvcnQgY29uc3QgZ2V0U3RnUGF0aCA9IGN1cnJ5KChfcGF0aDogc3RyaW5nKSA9PiBnZXRTdGcoaGVhZChfcGF0aCkpLnRoZW4ocGF0aCh0YWlsKF9wYXRoKSkpKTtcbi8vIEB0cy1leHBlY3QtZXJyb3IgdHMtbWlncmF0ZSgyMzQ1KSBGSVhNRTogQXJndW1lbnQgb2YgdHlwZSAnUGxhY2Vob2xkZXIgfCBfX01lcmdlRGVlcDxQbGFjZWguLi4gUmVtb3ZlIHRoaXMgY29tbWVudCB0byBzZWUgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZVxuY29uc3QgYWRkTmV3RGVmYXVsdCA9IGN1cnJ5KChrZXk6IHN0cmluZyB8IG51bWJlciwgb2xkSXRlbSkgPT4gcGlwZSh3aGVuKGlzKE9iamVjdCksIG1lcmdlRGVlcExlZnQoX18sIGRlZmF1bHRTdG9yYWdlKClba2V5XSkpKShvbGRJdGVtKSk7XG5jb25zdCBhZGROZXdEZWZhdWx0T3B0aW9ucyA9IG9sZE9wdGlvbnMgPT4gbWVyZ2VEZWVwTGVmdChvbGRPcHRpb25zLCBkZWZhdWx0T3B0aW9ucygpKTtcbmV4cG9ydCBjb25zdCBnZXRPcHRpb25zID0gYXN5bmMgKCk6IFByb21pc2U8T3B0aW9ucz4gPT4gZ2V0RGF0YSgnb3B0aW9ucycpLnRoZW4ocGlwZShkZWZhdWx0VG8oZGVmYXVsdE9wdGlvbnMoKSksIGFkZE5ld0RlZmF1bHRPcHRpb25zKSk7XG5leHBvcnQgY29uc3QgZ2V0T3B0aW9uID0gYXN5bmMgKG5hbWU6IHN0cmluZyk6IFByb21pc2U8T3B0aW9uPiA9PiBnZXRPcHRpb25zKCkudGhlbihwcm9wKG5hbWUpKTtcbi8vIEB0cy1leHBlY3QtZXJyb3IgdHMtbWlncmF0ZSgyMzQ1KSBGSVhNRTogQXJndW1lbnQgb2YgdHlwZSAnc3RyaW5nJyBpcyBub3QgYXNzaWduYWJsZSB0byBwYXIuLi4gUmVtb3ZlIHRoaXMgY29tbWVudCB0byBzZWUgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZVxuZXhwb3J0IGNvbnN0IHVwZGF0ZVN0Z1BhdGggPSBjdXJyeShhc3luYyAoX3BhdGg6IHN0cmluZywgdmFsKSA9PiBnZXRTdGcoaGVhZChfcGF0aCkpLnRoZW4ocGlwZShzZXQobGVuc1BhdGgodGFpbChfcGF0aCkpLCB2YWwpLCB0YXAoc2V0U3RnKGhlYWQoX3BhdGgpKSksIGluc3BlY3QoYHVwZGF0ZWRTdGdQYXRoICR7X3BhdGh9YCkpKSk7XG4vLyBUT0RPOiB0aGlzIGFmdGVyIHRoZSBhYm92byBUT0RPXG4vLyBAdHMtZXhwZWN0LWVycm9yIHRzLW1pZ3JhdGUoMjM0NSkgRklYTUU6IEFyZ3VtZW50IG9mIHR5cGUgJ3N0cmluZ1tdJyBpcyBub3QgYXNzaWduYWJsZSB0byBwLi4uIFJlbW92ZSB0aGlzIGNvbW1lbnQgdG8gc2VlIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2VcbmV4cG9ydCBjb25zdCB1cGRhdGVPcHRpb25TdGcgPSAobmFtZTogc3RyaW5nKSA9PiB1cGRhdGVTdGdQYXRoKFsnb3B0aW9ucycsIG5hbWUsICd2YWx1ZSddKTtcbi8vIGV4cG9ydCBjb25zdCB1cGRhdGVPcHRpb25TdGcgPSBjdXJyeShhc3luYyAobmFtZSwgdmFsKT0+IGdldE9wdGlvbnMoKS50aGVuKHBpcGUoXG4vLyAgICAgICBzZXQobGVuc1BhdGgoW25hbWUsJ3ZhbHVlJ10pLHZhbCksXG4vLyAgICAgICB0YXAoc2V0U3RnKCdvcHRpb25zJykpLFxuLy8gICAgICkpKVxuZXhwb3J0IGNvbnN0IGFwcGx5VG9PcHRpb25TdGcgPSBjdXJyeShhc3luYyAobmFtZTogc3RyaW5nIHwgbnVtYmVyLCBmbjogKHg6IHVua25vd24pID0+IGFueSkgPT4ge1xuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgdHMtbWlncmF0ZSgyMzQ1KSBGSVhNRTogQXJndW1lbnQgb2YgdHlwZSAnc3RyaW5nIHwgbnVtYmVyJyBpcyBub3QgYXNzaWduYWIuLi4gUmVtb3ZlIHRoaXMgY29tbWVudCB0byBzZWUgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZVxuICAgIHJldHVybiBnZXRPcHRpb25zKCkudGhlbihwaXBlKHBhdGgoW25hbWUsICd2YWx1ZSddKSwgZm4sIHVwZGF0ZU9wdGlvblN0ZyhuYW1lKSkpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gbXNnQkcobXNnOiBNc2cpIHtcbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtc2cpO1xuICAgIGNvbnNvbGUubG9nKFwibWVzc2FnaW5nIEJHXCIsIG1zZyk7XG59XG5leHBvcnQgZnVuY3Rpb24gbXNnQ1ModGFiSWQ6IG51bWJlciwgbXNnOiBNc2cpIHtcbiAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwgbXNnKTtcbn1cbi8vIG1ha2VzIGFuIG9uU3RvcmFnZUNoYW5nZSBmdW5jdGlvbiBnaXZlbiBhbiBhY3QgZnVuY3Rpb24gdGhhdCdzIHVzdWFsbHkgYSBzd2l0Y2ggb3ZlciBpdGVtIGtleXMgdGhhdCBoYXZlIGNoYW5nZWRcbmV4cG9ydCBmdW5jdGlvbiBtYWtlT25TdG9yYWdlQ2hhbmdlZCggYWN0OiAoc3RnQ2g6U3RvcmFnZUNoYW5nZSkgPT4gYW55KXtcblxuICAgIHJldHVybiAoY2hhbmdlczoge1t4OiBzdHJpbmddOiB7bmV3VmFsdWU6IHt9O307fSwgYXJlYTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmICghWydsb2NhbCcsICdzeW5jJ10uaW5jbHVkZXMoYXJlYSkpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgbGV0IG9sZFZhbCA9IHt9O1xuICAgICAgICBsZXQgbmV3VmFsID0ge307XG4gICAgICAgIGxldCBjaGFuZ2VkSXRlbXMgPSBPYmplY3Qua2V5cyhjaGFuZ2VzKTtcbiAgICAgICAgZm9yIChsZXQgaXRlbU5hbWUgb2YgY2hhbmdlZEl0ZW1zKSB7XG4gICAgICAgICAgICBvbGRWYWwgPSAoY2hhbmdlc1tpdGVtTmFtZV0gYXMgYW55KS5vbGRWYWx1ZTtcbiAgICAgICAgICAgIG5ld1ZhbCA9IGNoYW5nZXNbaXRlbU5hbWVdLm5ld1ZhbHVlO1xuICAgICAgICAgICAgaWYgKG9sZFZhbCA9PSBuZXdWYWwpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBhY3Qoe2l0ZW1OYW1lLCBvbGRWYWwsIG5ld1ZhbH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbi8vIGNvbnN0IG1ha2VFdmVudE9icyA9IGN1cnJ5KChldmVudDoge2FkZExpc3RlbmVyOiAoYXJnMDogYW55KSA9PiB2b2lkOyByZW1vdmVMaXN0ZW5lcjogKGFyZzA6IGFueSkgPT4gdm9pZDt9LCBtYWtlRW1pdCwgaW5pdFZhbCkgPT4ge1xuY29uc3QgbWFrZUV2ZW50T2JzID0gY3VycnkoKGV2ZW50OiBjaHJvbWUuZXZlbnRzLkV2ZW50PGFueT4sIG1ha2VFbWl0LCBpbml0VmFsOiBhbnkpOiBTdHJlYW08YW55LEVycm9yPiA9PiB7XG4gICAgcmV0dXJuIEtlZmlyLnN0cmVhbShlbWl0dGVyID0+IHtcbiAgICAgICAgLy8gZW1pdHRlci5lbWl0KGluaXRWYWwpO1xuICAgICAgICBjb25zdCBlbWl0ID0gbWFrZUVtaXQoZW1pdHRlcik7XG4gICAgICAgIGV2ZW50LmFkZExpc3RlbmVyKGVtaXQpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucmVtb3ZlTGlzdGVuZXIoZW1pdCk7XG4gICAgICAgICAgICBlbWl0dGVyLmVuZCgpO1xuICAgICAgICB9O1xuICAgIH0pO1xufSk7XG5leHBvcnQgY29uc3QgbWFrZVN0b3JhZ2VDaGFuZ2VPYnMgPSAoKTpPYnNlcnZhYmxlPFN0b3JhZ2VDaGFuZ2UsIEVycm9yPiA9PiB7XG4gICAgY29uc3QgbWFrZUVtaXRTdGdDSCA9IChlbWl0dGVyOiBFbWl0dGVyPFN0b3JhZ2VDaGFuZ2UsIEVycm9yPlxuICAgICkgPT4gbWFrZU9uU3RvcmFnZUNoYW5nZWQoKHN0Z0NoOiBTdG9yYWdlQ2hhbmdlKTogYW55ID0+IGVtaXR0ZXIuZW1pdChzdGdDaCkpO1xuICAgIHJldHVybiBtYWtlRXZlbnRPYnMoY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLCBtYWtlRW1pdFN0Z0NILCB7IGl0ZW1OYW1lOiBudWxsLCBvbGRWYWw6IG51bGwsIG5ld1ZhbDogbnVsbCB9KTtcbn07XG4vLyBzaGFsbG93XG5jb25zdCBpc1N0Z0l0ZW1TYW1lID0gKHg6IFN0b3JhZ2VDaGFuZ2UpID0+IChpc05pbCh4Lm9sZFZhbCkgJiYgaXNOaWwoeC5uZXdWYWwpKSB8fCB4Lm9sZFZhbCA9PT0geC5uZXdWYWw7XG5leHBvcnQgY29uc3QgbWFrZVN0Z1BhdGhPYnMgPSAoX3BhdGg6IHN0cmluZ1tdKTogT2JzZXJ2YWJsZTxhbnksIEVycm9yPiA9PiBtYWtlU3RvcmFnZUNoYW5nZU9icygpXG4gICAgLmZpbHRlcihwcm9wRXEoJ2l0ZW1OYW1lJywgX3BhdGhbMF0pKVxuICAgIC5tYXAocGF0aChbJ25ld1ZhbCcsIC4uLnNsaWNlKDEsIEluZmluaXR5LCBfcGF0aCldKSlcbiAgICAudG9Qcm9wZXJ0eSgpO1xuLy8gZXhwb3J0IGNvbnN0IG1ha2VTdGdJdGVtT2JzID0gaXRlbU5hbWUgPT4ge2NvbnNvbGUubG9nKCdtYWtpbmcgc3RnIGl0ZW0gb2JzIGZvciAnLCBpdGVtTmFtZSk7IHJldHVybiBtYWtlU3RvcmFnZU9icygpLmZpbHRlcihwcm9wRXEoJ2l0ZW1OYW1lJyxpdGVtTmFtZSkpLmZpbHRlcihwaXBlKGlzU3RnSXRlbVNhbWUsIG5vdCkpLm1hcChwcm9wKCduZXdWYWwnKSkuc2tpcER1cGxpY2F0ZXMoKX1cbmV4cG9ydCBjb25zdCBtYWtlU3RnSXRlbU9icyA9IGl0ZW1OYW1lID0+IG1ha2VTdGdQYXRoT2JzKFtpdGVtTmFtZV0pO1xuLy8gZXhwb3J0IGNvbnN0IG1ha2VTdGdJdGVtT2JzID0gaXRlbU5hbWUgPT4ge1xuLy8gICBjb25zb2xlLmxvZygnbWFraW5nIHN0ZyBpdGVtIG9icyBmb3IgJywgaXRlbU5hbWUpOyBcbi8vICAgcmV0dXJuIG1ha2VTdG9yYWdlT2JzKClcbi8vICAgLmZpbHRlcihwcm9wRXEoJ2l0ZW1OYW1lJyxpdGVtTmFtZSkpXG4vLyAgIC5tYXAocHJvcCgnbmV3VmFsJykpLnRvUHJvcGVydHkoKX1cbi8vIGV4cG9ydCBjb25zdCBtYWtlU3RvcmFnZVN0cmVhbSA9ICh0eXBlKSA9PiBtYWtlU3RvcmFnZWdPYnMoKS5maWx0ZXIocHJvcEVxKCd0eXBlJyx0eXBlKSlcbmV4cG9ydCBjb25zdCBtYWtlR290TXNnT2JzID0gKCk6IE9ic2VydmFibGU8TXNnV3JhcHBlcixFcnJvcj4gPT4ge1xuICAgIGNvbnN0IG1ha2VFbWl0TXNnID0gKGVtaXR0ZXI6IEVtaXR0ZXI8TXNnV3JhcHBlciwgRXJyb3I+KSA9PiAobWVzc2FnZSwgc2VuZGVyKSA9PiBlbWl0dGVyLmVtaXQoeyBtOiBtZXNzYWdlLCBzOiBzZW5kZXIgfSk7XG4gICAgcmV0dXJuIG1ha2VFdmVudE9icyhjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UsIG1ha2VFbWl0TXNnLCB7IG06IHsgdHlwZTogbnVsbCB9LCBzOiBudWxsIH0pO1xufTtcbmV4cG9ydCBjb25zdCBtYWtlTXNnU3RyZWFtID0gKG1zZ1R5cGUpOiBPYnNlcnZhYmxlPE1zZywgRXJyb3I+ID0+ICBtYWtlR290TXNnT2JzKCkubWFwKHByb3AoJ20nKSkuZmlsdGVyKHByb3BFcSgndHlwZScsIG1zZ1R5cGUpKTtcbi8vIC8vIG9wdGlvbnNDaGFuZ2UkIDo6IGNoYW5nZSAtPiBjaGFuZ2Vcbi8vIGV4cG9ydCBjb25zdCBtYWtlT3B0aW9uc0NoYW5nZU9icyA9IGFzeW5jIChzdG9yYWdlQ2hhbmdlJCkgPT4ge1xuLy8gICBjb25zdCBjYWNoZWRPcHRpb25zID0ge29sZFZhbDpudWxsLCBuZXdWYWw6YXdhaXQgZ2V0T3B0aW9ucygpfVxuLy8gICByZXR1cm4gc3RvcmFnZUNoYW5nZSQuZmlsdGVyKHg9PnguaXRlbU5hbWU9PSdvcHRpb25zJykudG9Qcm9wZXJ0eSgoKT0+Y2FjaGVkT3B0aW9ucylcbi8vIH1cbmNvbnN0IGlzT3B0aW9uU2FtZSA9IGN1cnJ5KChuYW1lOiBzdHJpbmcsIHg6IFN0b3JhZ2VDaGFuZ2UpOiBib29sZWFuID0+IGlzU3RnSXRlbVNhbWUoeCkgfHwgKCFpc05pbCh4Lm9sZFZhbCkgJiYgIWlzTmlsKHgubmV3VmFsKSAmJiAocGF0aChbJ29sZFZhbCcsIG5hbWUsICd2YWx1ZSddLCB4KSA9PT0gcGF0aChbJ25ld1ZhbCcsIG5hbWUsICd2YWx1ZSddLCB4KSkpKTtcbi8vIGNvbnN0IGlzT3B0aW9uU2FtZSA9IGN1cnJ5ICgobmFtZSwgeCk9PiAoaXNOaWwoeC5vbGRWYWwpICYmIGlzTmlsKHgubmV3VmFsKSkgfHwgKCFpc05pbCh4Lm9sZFZhbCkgJiYgIWlzTmlsKHgubmV3VmFsKSAmJiAocGF0aChbJ29sZFZhbCcsIG5hbWUsICd2YWx1ZSddLHgpID09PSBwYXRoKFsnbmV3VmFsJywgbmFtZSwgJ3ZhbHVlJ10seCkpKSApXG4vLyBtYWtlT3B0aW9uc09icyA6OiBTdHJpbmcgLT4gYVxuZXhwb3J0IGNvbnN0IG1ha2VPcHRpb25PYnMgPSBjdXJyeSgob3B0aW9uc0NoYW5nZSQ6IE9ic2VydmFibGU8U3RvcmFnZUNoYW5nZSwgYW55PiwgaXRlbU5hbWU6IHN0cmluZyk6IE9ic2VydmFibGU8T3B0aW9uLCBhbnk+ID0+IG9wdGlvbnNDaGFuZ2UkXG4gICAgLmZpbHRlcih4ID0+ICFpc09wdGlvblNhbWUoaXRlbU5hbWUsIHgpKVxuICAgIC5tYXAocGF0aDxhbnk+KFsnbmV3VmFsJywgaXRlbU5hbWVdKSlcbiAgICAubWFwKGRlZmF1bHRUbyhwcm9wKGl0ZW1OYW1lLCBkZWZhdWx0T3B0aW9ucygpKSkpKTtcbi8vIGNvbnN0IGxpc3RTZWFyY2hGaWx0ZXJzID0gcGlwZShwcm9wKCduZXdWYWwnKSwgdmFsdWVzLCBmaWx0ZXIocHJvcEVxKCd0eXBlJywgJ3NlYXJjaEZpbHRlcicpKSwgbWFwKHByb3AoJ25hbWUnKSksIFIubWFwKG1ha2VPcHRpb25PYnMpLCBpbnNwZWN0KCdsaXN0c2VhcmNoZmlsdGVycycpKTtcbi8vIGNvbnN0IGNvbWJpbmVPcHRpb25zID0gKC4uLmFyZ3MpID0+IHBpcGUoaW5zcGVjdCgnY29tYmluZW9wdCcpLCByZWR1Y2UoKGEsIGIpID0+IGFzc29jKGIubmFtZSwgYi52YWx1ZSwgYSksIHt9KSkoYXJncyk7XG4vLyBleHBvcnQgY29uc3QgbWFrZVNlYXJjaEZpbHRlcnNPYnMgPSAoKSA9PiBLZWZpci5jb21iaW5lKFtnZXRSVCQsIHVzZUJvb2ttYXJrcyQsIHVzZVJlcGxpZXMkXSwgY29tYmluZU9wdGlvbnMpLnRvUHJvcGVydHkoKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=