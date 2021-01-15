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
  defaultStorage: defaultStorage
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
              chrome.storage.local.get(key, function (items) {
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
              chrome.storage.local.set(key_vals, function () {
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
    if (area != 'local') return null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvZHV0aWxzLnRzeCJdLCJuYW1lcyI6WyJLZWZpciIsIlByb3BlcnR5IiwicHJvdG90eXBlIiwiY3VycmVudFZhbHVlIiwiREVWSU5HIiwicHJvY2VzcyIsImdsb2JhbCIsImNocm9tZSIsImNocm9tZU1vY2siLCJnZXRDaHJvbWVJbnN0YW5jZSIsImRlZmF1bHRTdG9yYWdlIiwiZGV2U3RvcmFnZSIsIl9kZWZhdWx0U3RvcmFnZSIsImNvbnNvbGUiLCJsb2ciLCJnZXREYXRhIiwia2V5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzdG9yYWdlIiwibG9jYWwiLCJnZXQiLCJpdGVtcyIsInJ1bnRpbWUiLCJsYXN0RXJyb3IiLCJlcnJvciIsIm1lc3NhZ2UiLCJzZXREYXRhIiwia2V5X3ZhbHMiLCJzZXQiLCJyZW1vdmVEYXRhIiwia2V5cyIsInJlbW92ZSIsInJlc2V0U3RvcmFnZSIsInNldFN0ZyIsImN1cnJ5IiwidmFsIiwiZ2V0U3RnIiwidGhlbiIsInBpcGUiLCJkZWZhdWx0VG8iLCJhZGROZXdEZWZhdWx0IiwidXBkYXRlU3RnIiwiZ2V0U3RnUGF0aCIsIl9wYXRoIiwiaGVhZCIsInBhdGgiLCJ0YWlsIiwib2xkSXRlbSIsIndoZW4iLCJpcyIsIk9iamVjdCIsIm1lcmdlRGVlcExlZnQiLCJfXyIsImFkZE5ld0RlZmF1bHRPcHRpb25zIiwib2xkT3B0aW9ucyIsImRlZmF1bHRPcHRpb25zIiwiZ2V0T3B0aW9ucyIsImdldE9wdGlvbiIsIm5hbWUiLCJwcm9wIiwidXBkYXRlU3RnUGF0aCIsImxlbnNQYXRoIiwidGFwIiwiaW5zcGVjdCIsInVwZGF0ZU9wdGlvblN0ZyIsImFwcGx5VG9PcHRpb25TdGciLCJmbiIsIm1zZ0JHIiwibXNnIiwic2VuZE1lc3NhZ2UiLCJtc2dDUyIsInRhYklkIiwidGFicyIsIm1ha2VPblN0b3JhZ2VDaGFuZ2VkIiwiYWN0IiwiY2hhbmdlcyIsImFyZWEiLCJvbGRWYWwiLCJuZXdWYWwiLCJjaGFuZ2VkSXRlbXMiLCJpdGVtTmFtZSIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJtYWtlRXZlbnRPYnMiLCJldmVudCIsIm1ha2VFbWl0IiwiaW5pdFZhbCIsInN0cmVhbSIsImVtaXR0ZXIiLCJlbWl0IiwiYWRkTGlzdGVuZXIiLCJyZW1vdmVMaXN0ZW5lciIsImVuZCIsIm1ha2VTdG9yYWdlQ2hhbmdlT2JzIiwibWFrZUVtaXRTdGdDSCIsInN0Z0NoIiwib25DaGFuZ2VkIiwiaXNTdGdJdGVtU2FtZSIsIngiLCJpc05pbCIsIm1ha2VTdGdQYXRoT2JzIiwiZmlsdGVyIiwicHJvcEVxIiwibWFwIiwic2xpY2UiLCJJbmZpbml0eSIsInRvUHJvcGVydHkiLCJtYWtlU3RnSXRlbU9icyIsIm1ha2VHb3RNc2dPYnMiLCJtYWtlRW1pdE1zZyIsInNlbmRlciIsIm0iLCJzIiwib25NZXNzYWdlIiwidHlwZSIsIm1ha2VNc2dTdHJlYW0iLCJtc2dUeXBlIiwiaXNPcHRpb25TYW1lIiwibWFrZU9wdGlvbk9icyIsIm9wdGlvbnNDaGFuZ2UkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFHQTtBQUNBO0NBRTZGOztDQUMrRjs7Q0FDWDs7Q0FDVjs7QUFFdEtBLDZDQUFLLENBQUNDLFFBQU4sQ0FBZUMsU0FBaEIsQ0FBa0NDLFlBQWxDLEdBQWlEQSxvREFBakQ7QUFDQTtBQUdBLElBQU1DLE1BQU0sR0FBR0MsT0FBQSxJQUF3QixPQUF2QztBQUNBQyxNQUFNLENBQUNDLE1BQVAsR0FBZ0JILE1BQU0sR0FBR0ksc0RBQVUsQ0FBQ0MsaUJBQVgsRUFBSCxHQUFvQ0gsTUFBTSxDQUFDQyxNQUFqRTtBQUNBLElBQU1HLGNBQWMsR0FBR04sTUFBTSxHQUFHTyxzREFBSCxHQUFnQkMsMERBQTdDO0FBQ0FDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHVCQUFaLEVBQXFDO0FBQUNKLGdCQUFjLEVBQWRBO0FBQUQsQ0FBckMsRSxDQUVBOztBQUNPLFNBQWVLLE9BQXRCO0FBQUE7QUFBQSxDLENBZUE7OztxRUFmTyxrQkFBdUJDLEdBQXZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FDSSxJQUFJQyxPQUFKLENBQVksVUFBVUMsT0FBVixFQUFtQkMsTUFBbkIsRUFBMkI7QUFDMUNaLG9CQUFNLENBQUNhLE9BQVAsQ0FBZUMsS0FBZixDQUFxQkMsR0FBckIsQ0FBeUJOLEdBQXpCLEVBQThCLFVBQVVPLEtBQVYsRUFFM0I7QUFDQyxvQkFBSWhCLE1BQU0sQ0FBQ2lCLE9BQVAsQ0FBZUMsU0FBbkIsRUFBOEI7QUFDMUJaLHlCQUFPLENBQUNhLEtBQVIsQ0FBY25CLE1BQU0sQ0FBQ2lCLE9BQVAsQ0FBZUMsU0FBZixDQUF5QkUsT0FBdkM7QUFDQVIsd0JBQU0sQ0FBQ1osTUFBTSxDQUFDaUIsT0FBUCxDQUFlQyxTQUFmLENBQXlCRSxPQUExQixDQUFOO0FBQ0gsaUJBSEQsTUFJSztBQUNEVCx5QkFBTyxDQUFDSyxLQUFLLENBQUNQLEdBQUQsQ0FBTixDQUFQO0FBQ0g7QUFDSixlQVZEO0FBV0gsYUFaTSxDQURKOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7Ozs7QUFnQkEsU0FBZVksT0FBdEI7QUFBQTtBQUFBLEMsQ0FjQTtBQUNBOzs7cUVBZk8sa0JBQXVCQyxRQUF2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOENBQ0ksSUFBSVosT0FBSixDQUFZLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQzFDWixvQkFBTSxDQUFDYSxPQUFQLENBQWVDLEtBQWYsQ0FBcUJTLEdBQXJCLENBQXlCRCxRQUF6QixFQUFtQyxZQUFNO0FBQ3JDLG9CQUFJdEIsTUFBTSxDQUFDaUIsT0FBUCxDQUFlQyxTQUFuQixFQUE4QjtBQUMxQloseUJBQU8sQ0FBQ2EsS0FBUixDQUFjbkIsTUFBTSxDQUFDaUIsT0FBUCxDQUFlQyxTQUFmLENBQXlCRSxPQUF2QztBQUNBUix3QkFBTSxDQUFDWixNQUFNLENBQUNpQixPQUFQLENBQWVDLFNBQWYsQ0FBeUJFLE9BQTFCLENBQU47QUFDSCxpQkFIRCxNQUlLO0FBQ0RkLHlCQUFPLENBQUNDLEdBQVIsQ0FBWSxpQkFBWixvQkFBb0NlLFFBQXBDO0FBQ0FYLHlCQUFPLENBQUNXLFFBQUQsQ0FBUDtBQUNIO0FBQ0osZUFURDtBQVVILGFBWE0sQ0FESjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O0FBZ0JBLFNBQWVFLFVBQXRCO0FBQUE7QUFBQTs7O3dFQUFPLGtCQUEwQkMsSUFBMUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQUNJLElBQUlmLE9BQUosQ0FBWSxVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUMxQ1osb0JBQU0sQ0FBQ2EsT0FBUCxDQUFlQyxLQUFmLENBQXFCWSxNQUFyQixDQUE0QkQsSUFBNUIsRUFBa0MsWUFBWTtBQUMxQztBQUNBLG9CQUFJekIsTUFBTSxDQUFDaUIsT0FBUCxDQUFlQyxTQUFuQixFQUE4QjtBQUMxQloseUJBQU8sQ0FBQ2EsS0FBUixDQUFjbkIsTUFBTSxDQUFDaUIsT0FBUCxDQUFlQyxTQUFmLENBQXlCRSxPQUF2QztBQUNBUix3QkFBTSxDQUFDWixNQUFNLENBQUNpQixPQUFQLENBQWVDLFNBQWYsQ0FBeUJFLE9BQTFCLENBQU47QUFDSCxpQkFIRCxNQUlLO0FBQ0Q7QUFDQVQseUJBQU87QUFDVjtBQUNKLGVBVkQ7QUFXSCxhQVpNLENBREo7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7OztBQWVBLElBQU1nQixZQUFZLEdBQUcsU0FBZkEsWUFBZTtBQUFBLFNBQU1OLE9BQU8sQ0FBQ2xCLGNBQWMsRUFBZixDQUFiO0FBQUEsQ0FBckI7QUFDQSxJQUFNeUIsTUFBTSxHQUFHQyxtREFBSyxDQUFDLFVBQUNwQixHQUFELEVBQU1xQixHQUFOO0FBQUEsU0FBY1QsT0FBTyxxQkFBSVosR0FBSixFQUFVcUIsR0FBVixFQUFyQjtBQUFBLENBQUQsQ0FBcEI7QUFDQSxJQUFNQyxNQUFNLEdBQUcsU0FBVEEsTUFBUyxDQUFDdEIsR0FBRDtBQUFBLFNBQWlCRCxPQUFPLENBQUNDLEdBQUQsQ0FBUCxDQUFhdUIsSUFBYixDQUFrQkMsa0RBQUksQ0FBQ0MsdURBQVMsQ0FBQy9CLGNBQWMsR0FBR00sR0FBSCxDQUFmLENBQVYsRUFBbUMwQixhQUFhLENBQUMxQixHQUFELENBQWhELENBQXRCLENBQWpCO0FBQUEsQ0FBZjtBQUNBLElBQU0yQixTQUFTLEdBQUdQLG1EQUFLLENBQUMsVUFBQ3BCLEdBQUQsRUFBTXFCLEdBQU47QUFBQSxTQUFjVCxPQUFPLHFCQUFJWixHQUFKLEVBQVVxQixHQUFWLEVBQXJCO0FBQUEsQ0FBRCxDQUF2QixDLENBQ1A7QUFDQTs7QUFDTyxJQUFNTyxVQUFVLEdBQUdSLG1EQUFLLENBQUMsVUFBQ1MsS0FBRDtBQUFBLFNBQW1CUCxNQUFNLENBQUNRLGtEQUFJLENBQUNELEtBQUQsQ0FBTCxDQUFOLENBQW9CTixJQUFwQixDQUF5QlEsa0RBQUksQ0FBQ0Msa0RBQUksQ0FBQ0gsS0FBRCxDQUFMLENBQTdCLENBQW5CO0FBQUEsQ0FBRCxDQUF4QixDLENBQ1A7O0FBQ0EsSUFBTUgsYUFBYSxHQUFHTixtREFBSyxDQUFDLFVBQUNwQixHQUFELEVBQXVCaUMsT0FBdkI7QUFBQSxTQUFtQ1Qsa0RBQUksQ0FBQ1Usa0RBQUksQ0FBQ0MsZ0RBQUUsQ0FBQ0MsTUFBRCxDQUFILEVBQWFDLDJEQUFhLENBQUNDLHdDQUFELEVBQUs1QyxjQUFjLEdBQUdNLEdBQUgsQ0FBbkIsQ0FBMUIsQ0FBTCxDQUFKLENBQWlFaUMsT0FBakUsQ0FBbkM7QUFBQSxDQUFELENBQTNCOztBQUNBLElBQU1NLG9CQUFvQixHQUFHLFNBQXZCQSxvQkFBdUIsQ0FBQUMsVUFBVTtBQUFBLFNBQUlILDJEQUFhLENBQUNHLFVBQUQsRUFBYUMsa0VBQWMsRUFBM0IsQ0FBakI7QUFBQSxDQUF2Qzs7QUFDTyxJQUFNQyxVQUFVO0FBQUEscUVBQUc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQUE4QjNDLE9BQU8sQ0FBQyxTQUFELENBQVAsQ0FBbUJ3QixJQUFuQixDQUF3QkMsa0RBQUksQ0FBQ0MsdURBQVMsQ0FBQ2dCLGtFQUFjLEVBQWYsQ0FBVixFQUE4QkYsb0JBQTlCLENBQTVCLENBQTlCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUg7O0FBQUEsa0JBQVZHLFVBQVU7QUFBQTtBQUFBO0FBQUEsR0FBaEI7QUFDQSxJQUFNQyxTQUFTO0FBQUEsc0VBQUcsa0JBQU9DLElBQVA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQUF5Q0YsVUFBVSxHQUFHbkIsSUFBYixDQUFrQnNCLGtEQUFJLENBQUNELElBQUQsQ0FBdEIsQ0FBekM7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBSDs7QUFBQSxrQkFBVEQsU0FBUztBQUFBO0FBQUE7QUFBQSxHQUFmLEMsQ0FDUDs7QUFDTyxJQUFNRyxhQUFhLEdBQUcxQixtREFBSztBQUFBLHNFQUFDLGtCQUFPUyxLQUFQLEVBQXNCUixHQUF0QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOENBQThCQyxNQUFNLENBQUNRLGtEQUFJLENBQUNELEtBQUQsQ0FBTCxDQUFOLENBQW9CTixJQUFwQixDQUF5QkMsa0RBQUksQ0FBQ1YsaURBQUcsQ0FBQ2lDLHNEQUFRLENBQUNmLGtEQUFJLENBQUNILEtBQUQsQ0FBTCxDQUFULEVBQXdCUixHQUF4QixDQUFKLEVBQWtDMkIsaURBQUcsQ0FBQzdCLE1BQU0sQ0FBQ1csa0RBQUksQ0FBQ0QsS0FBRCxDQUFMLENBQVAsQ0FBckMsRUFBNERvQix1REFBTywwQkFBbUJwQixLQUFuQixFQUFuRSxDQUE3QixDQUE5Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFEOztBQUFBO0FBQUE7QUFBQTtBQUFBLElBQTNCLEMsQ0FDUDtBQUNBOztBQUNPLElBQU1xQixlQUFlLEdBQUcsU0FBbEJBLGVBQWtCLENBQUNOLElBQUQ7QUFBQSxTQUFrQkUsYUFBYSxDQUFDLENBQUMsU0FBRCxFQUFZRixJQUFaLEVBQWtCLE9BQWxCLENBQUQsQ0FBL0I7QUFBQSxDQUF4QixDLENBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBQ08sSUFBTU8sZ0JBQWdCLEdBQUcvQixtREFBSztBQUFBLHNFQUFDLGtCQUFPd0IsSUFBUCxFQUE4QlEsRUFBOUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQUUzQlYsVUFBVSxHQUFHbkIsSUFBYixDQUFrQkMsa0RBQUksQ0FBQ08sa0RBQUksQ0FBQyxDQUFDYSxJQUFELEVBQU8sT0FBUCxDQUFELENBQUwsRUFBd0JRLEVBQXhCLEVBQTRCRixlQUFlLENBQUNOLElBQUQsQ0FBM0MsQ0FBdEIsQ0FGMkI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBRDs7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUE5QjtBQUlBLFNBQVNTLEtBQVQsQ0FBZUMsR0FBZixFQUF5QjtBQUM1Qi9ELFFBQU0sQ0FBQ2lCLE9BQVAsQ0FBZStDLFdBQWYsQ0FBMkJELEdBQTNCO0FBQ0F6RCxTQUFPLENBQUNDLEdBQVIsQ0FBWSxjQUFaLEVBQTRCd0QsR0FBNUI7QUFDSDtBQUNNLFNBQVNFLEtBQVQsQ0FBZUMsS0FBZixFQUE4QkgsR0FBOUIsRUFBd0M7QUFDM0MvRCxRQUFNLENBQUNtRSxJQUFQLENBQVlILFdBQVosQ0FBd0JFLEtBQXhCLEVBQStCSCxHQUEvQjtBQUNILEMsQ0FDRDs7QUFDTyxTQUFTSyxvQkFBVCxDQUErQkMsR0FBL0IsRUFBaUU7QUFFcEUsU0FBTyxVQUFDQyxPQUFELEVBQTJDQyxJQUEzQyxFQUE0RDtBQUMvRCxRQUFJQSxJQUFJLElBQUksT0FBWixFQUNJLE9BQU8sSUFBUDtBQUNKLFFBQUlDLE1BQU0sR0FBRyxFQUFiO0FBQ0EsUUFBSUMsTUFBTSxHQUFHLEVBQWI7QUFDQSxRQUFJQyxZQUFZLEdBQUc3QixNQUFNLENBQUNwQixJQUFQLENBQVk2QyxPQUFaLENBQW5COztBQUNBLHFDQUFxQkksWUFBckIsbUNBQW1DO0FBQTlCLFVBQUlDLFFBQVEsb0JBQVo7QUFDREgsWUFBTSxHQUFJRixPQUFPLENBQUNLLFFBQUQsQ0FBUixDQUEyQkMsUUFBcEM7QUFDQUgsWUFBTSxHQUFHSCxPQUFPLENBQUNLLFFBQUQsQ0FBUCxDQUFrQkUsUUFBM0I7QUFDQSxVQUFJTCxNQUFNLElBQUlDLE1BQWQsRUFDSTtBQUNKSixTQUFHLENBQUM7QUFBQ00sZ0JBQVEsRUFBUkEsUUFBRDtBQUFXSCxjQUFNLEVBQU5BLE1BQVg7QUFBbUJDLGNBQU0sRUFBTkE7QUFBbkIsT0FBRCxDQUFIO0FBQ0g7QUFDSixHQWJEO0FBY0gsQyxDQUNEOztBQUNBLElBQU1LLFlBQVksR0FBR2pELG1EQUFLLENBQUMsVUFBQ2tELEtBQUQsRUFBa0NDLFFBQWxDLEVBQTRDQyxPQUE1QyxFQUFnRjtBQUN2RyxTQUFPeEYsNkNBQUssQ0FBQ3lGLE1BQU4sQ0FBYSxVQUFBQyxPQUFPLEVBQUk7QUFDM0I7QUFDQSxRQUFNQyxJQUFJLEdBQUdKLFFBQVEsQ0FBQ0csT0FBRCxDQUFyQjtBQUNBSixTQUFLLENBQUNNLFdBQU4sQ0FBa0JELElBQWxCO0FBQ0EsV0FBTyxZQUFNO0FBQ1RMLFdBQUssQ0FBQ08sY0FBTixDQUFxQkYsSUFBckI7QUFDQUQsYUFBTyxDQUFDSSxHQUFSO0FBQ0gsS0FIRDtBQUlILEdBUk0sQ0FBUDtBQVNILENBVnlCLENBQTFCO0FBV08sSUFBTUMsb0JBQW9CLEdBQUcsU0FBdkJBLG9CQUF1QixHQUF1QztBQUN2RSxNQUFNQyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQUNOLE9BQUQ7QUFBQSxXQUNqQmYsb0JBQW9CLENBQUMsVUFBQ3NCLEtBQUQ7QUFBQSxhQUErQlAsT0FBTyxDQUFDQyxJQUFSLENBQWFNLEtBQWIsQ0FBL0I7QUFBQSxLQUFELENBREg7QUFBQSxHQUF0Qjs7QUFFQSxTQUFPWixZQUFZLENBQUM5RSxNQUFNLENBQUNhLE9BQVAsQ0FBZThFLFNBQWhCLEVBQTJCRixhQUEzQixFQUEwQztBQUFFZCxZQUFRLEVBQUUsSUFBWjtBQUFrQkgsVUFBTSxFQUFFLElBQTFCO0FBQWdDQyxVQUFNLEVBQUU7QUFBeEMsR0FBMUMsQ0FBbkI7QUFDSCxDQUpNLEMsQ0FLUDs7QUFDQSxJQUFNbUIsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixDQUFDQyxDQUFEO0FBQUEsU0FBdUJDLG1EQUFLLENBQUNELENBQUMsQ0FBQ3JCLE1BQUgsQ0FBTCxJQUFtQnNCLG1EQUFLLENBQUNELENBQUMsQ0FBQ3BCLE1BQUgsQ0FBekIsSUFBd0NvQixDQUFDLENBQUNyQixNQUFGLEtBQWFxQixDQUFDLENBQUNwQixNQUE3RTtBQUFBLENBQXRCOztBQUNPLElBQU1zQixjQUFjLEdBQUcsU0FBakJBLGNBQWlCLENBQUN6RCxLQUFEO0FBQUEsU0FBNkNrRCxvQkFBb0IsR0FDMUZRLE1BRHNFLENBQy9EQyxvREFBTSxDQUFDLFVBQUQsRUFBYTNELEtBQUssQ0FBQyxDQUFELENBQWxCLENBRHlELEVBRXRFNEQsR0FGc0UsQ0FFbEUxRCxrREFBSSxFQUFFLFFBQUYsNEJBQWUyRCxtREFBSyxDQUFDLENBQUQsRUFBSUMsUUFBSixFQUFjOUQsS0FBZCxDQUFwQixHQUY4RCxFQUd0RStELFVBSHNFLEVBQTdDO0FBQUEsQ0FBdkIsQyxDQUlQOztBQUNPLElBQU1DLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsQ0FBQTNCLFFBQVE7QUFBQSxTQUFJb0IsY0FBYyxDQUFDLENBQUNwQixRQUFELENBQUQsQ0FBbEI7QUFBQSxDQUEvQixDLENBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNPLElBQU00QixhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLEdBQW9DO0FBQzdELE1BQU1DLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUNyQixPQUFEO0FBQUEsV0FBeUMsVUFBQy9ELE9BQUQsRUFBVXFGLE1BQVY7QUFBQSxhQUFxQnRCLE9BQU8sQ0FBQ0MsSUFBUixDQUFhO0FBQUVzQixTQUFDLEVBQUV0RixPQUFMO0FBQWN1RixTQUFDLEVBQUVGO0FBQWpCLE9BQWIsQ0FBckI7QUFBQSxLQUF6QztBQUFBLEdBQXBCOztBQUNBLFNBQU8zQixZQUFZLENBQUM5RSxNQUFNLENBQUNpQixPQUFQLENBQWUyRixTQUFoQixFQUEyQkosV0FBM0IsRUFBd0M7QUFBRUUsS0FBQyxFQUFFO0FBQUVHLFVBQUksRUFBRTtBQUFSLEtBQUw7QUFBcUJGLEtBQUMsRUFBRTtBQUF4QixHQUF4QyxDQUFuQjtBQUNILENBSE07QUFJQSxJQUFNRyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQUNDLE9BQUQ7QUFBQSxTQUFzQ1IsYUFBYSxHQUFHTCxHQUFoQixDQUFvQjVDLGtEQUFJLENBQUMsR0FBRCxDQUF4QixFQUErQjBDLE1BQS9CLENBQXNDQyxvREFBTSxDQUFDLE1BQUQsRUFBU2MsT0FBVCxDQUE1QyxDQUF0QztBQUFBLENBQXRCLEMsQ0FDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU1DLFlBQVksR0FBR25GLG1EQUFLLENBQUMsVUFBQ3dCLElBQUQsRUFBZXdDLENBQWY7QUFBQSxTQUE2Q0QsYUFBYSxDQUFDQyxDQUFELENBQWIsSUFBcUIsQ0FBQ0MsbURBQUssQ0FBQ0QsQ0FBQyxDQUFDckIsTUFBSCxDQUFOLElBQW9CLENBQUNzQixtREFBSyxDQUFDRCxDQUFDLENBQUNwQixNQUFILENBQTFCLElBQXlDakMsa0RBQUksQ0FBQyxDQUFDLFFBQUQsRUFBV2EsSUFBWCxFQUFpQixPQUFqQixDQUFELEVBQTRCd0MsQ0FBNUIsQ0FBSixLQUF1Q3JELGtEQUFJLENBQUMsQ0FBQyxRQUFELEVBQVdhLElBQVgsRUFBaUIsT0FBakIsQ0FBRCxFQUE0QndDLENBQTVCLENBQXRKO0FBQUEsQ0FBRCxDQUExQixDLENBQ0E7QUFDQTs7QUFDTyxJQUFNb0IsYUFBYSxHQUFHcEYsbURBQUssQ0FBQyxVQUFDcUYsY0FBRCxFQUFpRHZDLFFBQWpEO0FBQUEsU0FBK0Z1QyxjQUFjLENBQzNJbEIsTUFENkgsQ0FDdEgsVUFBQUgsQ0FBQztBQUFBLFdBQUksQ0FBQ21CLFlBQVksQ0FBQ3JDLFFBQUQsRUFBV2tCLENBQVgsQ0FBakI7QUFBQSxHQURxSCxFQUU3SEssR0FGNkgsQ0FFekgxRCxrREFBSSxDQUFNLENBQUMsUUFBRCxFQUFXbUMsUUFBWCxDQUFOLENBRnFILEVBRzdIdUIsR0FINkgsQ0FHekhoRSx1REFBUyxDQUFDb0Isa0RBQUksQ0FBQ3FCLFFBQUQsRUFBV3pCLGtFQUFjLEVBQXpCLENBQUwsQ0FIZ0gsQ0FBL0Y7QUFBQSxDQUFELENBQTNCLEMsQ0FJUDtBQUNBO0FBQ0EiLCJmaWxlIjoiYmFja2dyb3VuZC42M2UxMDJhMGI3ZTRmMGVmMDhkZC5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEtlZmlyLCB7IEVtaXR0ZXIsIE9ic2VydmFibGUsIFN0cmVhbSB9IGZyb20gJ2tlZmlyJztcbmltcG9ydCB7U3RvcmFnZUNoYW5nZX0gZnJvbSAnLi4vdHlwZXMvc3RnVHlwZXMnXG5pbXBvcnQge01zZ1dyYXBwZXIsIE1zZywgVXJsTXNnfSBmcm9tICcuLi90eXBlcy9tc2dUeXBlcydcbmltcG9ydCB7IGZsYXR0ZW5Nb2R1bGUsIGN1cnJlbnRWYWx1ZSwgaW5zcGVjdCB9IGZyb20gJy4vcHV0aWxzJztcbmltcG9ydCB7IGRlZmF1bHRPcHRpb25zLCBkZWZhdWx0U3RvcmFnZSBhcyBfZGVmYXVsdFN0b3JhZ2UsIGRldlN0b3JhZ2UgfSBmcm9tICcuL2RlZmF1bHRTdGcnO1xuaW1wb3J0ICogYXMgUiBmcm9tICdyYW1kYSc7XG5pbXBvcnQgeyBfXywgY3VycnksIHBpcGUsIGFuZFRoZW4sIG1hcCwgZmlsdGVyLCByZWR1Y2UsIHRhcCwgYXBwbHksIHRyeUNhdGNoIH0gZnJvbSAncmFtZGEnOyAvLyBGdW5jdGlvblxuaW1wb3J0IHsgcHJvcCwgcHJvcEVxLCBwcm9wU2F0aXNmaWVzLCBwYXRoLCBwYXRoRXEsIGhhc1BhdGgsIGFzc29jLCBhc3NvY1BhdGgsIHZhbHVlcywgbWVyZ2VMZWZ0LCBtZXJnZURlZXBMZWZ0LCBrZXlzLCBsZW5zLCBsZW5zUHJvcCwgbGVuc1BhdGgsIHBpY2ssIHByb2plY3QsIHNldCwgbGVuZ3RoIH0gZnJvbSAncmFtZGEnOyAvLyBPYmplY3RcbmltcG9ydCB7IGhlYWQsIHRhaWwsIHRha2UsIGlzRW1wdHksIGFueSwgYWxsLCBpbmNsdWRlcywgbGFzdCwgZHJvcFdoaWxlLCBkcm9wTGFzdFdoaWxlLCBkaWZmZXJlbmNlLCBhcHBlbmQsIGZyb21QYWlycywgZm9yRWFjaCwgbnRoLCBwbHVjaywgcmV2ZXJzZSwgdW5pcSwgc2xpY2UgfSBmcm9tICdyYW1kYSc7IC8vIExpc3RcbmltcG9ydCB7IGVxdWFscywgaWZFbHNlLCB3aGVuLCBib3RoLCBlaXRoZXIsIGlzTmlsLCBpcywgZGVmYXVsdFRvLCBhbmQsIG9yLCBub3QsIFQsIEYsIGd0LCBsdCwgZ3RlLCBsdGUsIG1heCwgbWluLCBzb3J0LCBzb3J0QnksIHNwbGl0LCB0cmltLCBtdWx0aXBseSB9IGZyb20gJ3JhbWRhJzsgLy8gTG9naWMsIFR5cGUsIFJlbGF0aW9uLCBTdHJpbmcsIE1hdGhcbmltcG9ydCB7IE9wdGlvbiwgT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL3N0Z1R5cGVzJztcbihLZWZpci5Qcm9wZXJ0eS5wcm90b3R5cGUgYXMgYW55KS5jdXJyZW50VmFsdWUgPSBjdXJyZW50VmFsdWU7XG5pbXBvcnQgY2hyb21lTW9jayBmcm9tICdjaHJvbWUtYXBpLW1vY2snO1xuXG5cbmNvbnN0IERFVklORyA9IHByb2Nlc3MuZW52LkRFVl9NT0RFID09ICdzZXJ2ZSdcbmdsb2JhbC5jaHJvbWUgPSBERVZJTkcgPyBjaHJvbWVNb2NrLmdldENocm9tZUluc3RhbmNlKCkgOiBnbG9iYWwuY2hyb21lXG5jb25zdCBkZWZhdWx0U3RvcmFnZSA9IERFVklORyA/IGRldlN0b3JhZ2UgOiBfZGVmYXVsdFN0b3JhZ2VcbmNvbnNvbGUubG9nKCdkdXRpbHMgZGVmYXVsdFN0b3JhZ2UnLCB7ZGVmYXVsdFN0b3JhZ2V9KVxuXG4vL3JldHVybnMgYSBwcm9taXNlIHRoYXQgZ2V0cyBhIHZhbHVlIGZyb20gY2hyb21lIGxvY2FsIHN0b3JhZ2UgXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YShrZXk6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChrZXksIGZ1bmN0aW9uIChpdGVtczoge1xuICAgICAgICAgICAgW3g6IHN0cmluZ106IHVua25vd247XG4gICAgICAgIH0pIHtcbiAgICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShpdGVtc1trZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vL3JldHVybnMgYSBwcm9taXNlIHRoYXQgc2V0cyBhbiBvYmplY3Qgd2l0aCBrZXkgdmFsdWUgcGFpcnMgaW50byBjaHJvbWUgbG9jYWwgc3RvcmFnZSBcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXREYXRhKGtleV92YWxzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KGtleV92YWxzLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbREVCVUddIHNldERhdGEnLCB7IC4uLmtleV92YWxzIH0pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoa2V5X3ZhbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIERlbGV0ZSBkYXRhIGZyb20gc3RvcmFnZVxuLy8gdGFrZXMgYW4gYXJyYXkgb2Yga2V5c1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZURhdGEoa2V5cykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShrZXlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwicmVtb3ZlZFwiLCBrZXlzKVxuICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIHRzLW1pZ3JhdGUoMjc5NCkgRklYTUU6IEV4cGVjdGVkIDEgYXJndW1lbnRzLCBidXQgZ290IDAuIERpZCB5b3UgZm9yZ2V0IHRvLi4uIFJlbW92ZSB0aGlzIGNvbW1lbnQgdG8gc2VlIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IHJlc2V0U3RvcmFnZSA9ICgpID0+IHNldERhdGEoZGVmYXVsdFN0b3JhZ2UoKSk7XG5leHBvcnQgY29uc3Qgc2V0U3RnID0gY3VycnkoKGtleSwgdmFsKSA9PiBzZXREYXRhKHsgW2tleV06IHZhbCB9KSk7XG5leHBvcnQgY29uc3QgZ2V0U3RnID0gKGtleTogc3RyaW5nKSA9PiBnZXREYXRhKGtleSkudGhlbihwaXBlKGRlZmF1bHRUbyhkZWZhdWx0U3RvcmFnZSgpW2tleV0pLCBhZGROZXdEZWZhdWx0KGtleSkpKTtcbmV4cG9ydCBjb25zdCB1cGRhdGVTdGcgPSBjdXJyeSgoa2V5LCB2YWwpID0+IHNldERhdGEoeyBba2V5XTogdmFsIH0pKTtcbi8vIFRPRE86IG5lZWQgdG8gcmVsaWFibHkgcmV0dXJuIHRoZSBkZWZhdWx0IGlmIHBhdGggZG9lc24ndCBleGlzdCwgc2VlIGFkZE5ld0RlZmF1bHRPcHRpb25zXG4vLyBAdHMtZXhwZWN0LWVycm9yIHRzLW1pZ3JhdGUoMjM0NSkgRklYTUU6IEFyZ3VtZW50IG9mIHR5cGUgJ3N0cmluZycgaXMgbm90IGFzc2lnbmFibGUgdG8gcGFyLi4uIFJlbW92ZSB0aGlzIGNvbW1lbnQgdG8gc2VlIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2VcbmV4cG9ydCBjb25zdCBnZXRTdGdQYXRoID0gY3VycnkoKF9wYXRoOiBzdHJpbmcpID0+IGdldFN0ZyhoZWFkKF9wYXRoKSkudGhlbihwYXRoKHRhaWwoX3BhdGgpKSkpO1xuLy8gQHRzLWV4cGVjdC1lcnJvciB0cy1taWdyYXRlKDIzNDUpIEZJWE1FOiBBcmd1bWVudCBvZiB0eXBlICdQbGFjZWhvbGRlciB8IF9fTWVyZ2VEZWVwPFBsYWNlaC4uLiBSZW1vdmUgdGhpcyBjb21tZW50IHRvIHNlZSB0aGUgZnVsbCBlcnJvciBtZXNzYWdlXG5jb25zdCBhZGROZXdEZWZhdWx0ID0gY3VycnkoKGtleTogc3RyaW5nIHwgbnVtYmVyLCBvbGRJdGVtKSA9PiBwaXBlKHdoZW4oaXMoT2JqZWN0KSwgbWVyZ2VEZWVwTGVmdChfXywgZGVmYXVsdFN0b3JhZ2UoKVtrZXldKSkpKG9sZEl0ZW0pKTtcbmNvbnN0IGFkZE5ld0RlZmF1bHRPcHRpb25zID0gb2xkT3B0aW9ucyA9PiBtZXJnZURlZXBMZWZ0KG9sZE9wdGlvbnMsIGRlZmF1bHRPcHRpb25zKCkpO1xuZXhwb3J0IGNvbnN0IGdldE9wdGlvbnMgPSBhc3luYyAoKTogUHJvbWlzZTxPcHRpb25zPiA9PiBnZXREYXRhKCdvcHRpb25zJykudGhlbihwaXBlKGRlZmF1bHRUbyhkZWZhdWx0T3B0aW9ucygpKSwgYWRkTmV3RGVmYXVsdE9wdGlvbnMpKTtcbmV4cG9ydCBjb25zdCBnZXRPcHRpb24gPSBhc3luYyAobmFtZTogc3RyaW5nKTogUHJvbWlzZTxPcHRpb24+ID0+IGdldE9wdGlvbnMoKS50aGVuKHByb3AobmFtZSkpO1xuLy8gQHRzLWV4cGVjdC1lcnJvciB0cy1taWdyYXRlKDIzNDUpIEZJWE1FOiBBcmd1bWVudCBvZiB0eXBlICdzdHJpbmcnIGlzIG5vdCBhc3NpZ25hYmxlIHRvIHBhci4uLiBSZW1vdmUgdGhpcyBjb21tZW50IHRvIHNlZSB0aGUgZnVsbCBlcnJvciBtZXNzYWdlXG5leHBvcnQgY29uc3QgdXBkYXRlU3RnUGF0aCA9IGN1cnJ5KGFzeW5jIChfcGF0aDogc3RyaW5nLCB2YWwpID0+IGdldFN0ZyhoZWFkKF9wYXRoKSkudGhlbihwaXBlKHNldChsZW5zUGF0aCh0YWlsKF9wYXRoKSksIHZhbCksIHRhcChzZXRTdGcoaGVhZChfcGF0aCkpKSwgaW5zcGVjdChgdXBkYXRlZFN0Z1BhdGggJHtfcGF0aH1gKSkpKTtcbi8vIFRPRE86IHRoaXMgYWZ0ZXIgdGhlIGFib3ZvIFRPRE9cbi8vIEB0cy1leHBlY3QtZXJyb3IgdHMtbWlncmF0ZSgyMzQ1KSBGSVhNRTogQXJndW1lbnQgb2YgdHlwZSAnc3RyaW5nW10nIGlzIG5vdCBhc3NpZ25hYmxlIHRvIHAuLi4gUmVtb3ZlIHRoaXMgY29tbWVudCB0byBzZWUgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZVxuZXhwb3J0IGNvbnN0IHVwZGF0ZU9wdGlvblN0ZyA9IChuYW1lOiBzdHJpbmcpID0+IHVwZGF0ZVN0Z1BhdGgoWydvcHRpb25zJywgbmFtZSwgJ3ZhbHVlJ10pO1xuLy8gZXhwb3J0IGNvbnN0IHVwZGF0ZU9wdGlvblN0ZyA9IGN1cnJ5KGFzeW5jIChuYW1lLCB2YWwpPT4gZ2V0T3B0aW9ucygpLnRoZW4ocGlwZShcbi8vICAgICAgIHNldChsZW5zUGF0aChbbmFtZSwndmFsdWUnXSksdmFsKSxcbi8vICAgICAgIHRhcChzZXRTdGcoJ29wdGlvbnMnKSksXG4vLyAgICAgKSkpXG5leHBvcnQgY29uc3QgYXBwbHlUb09wdGlvblN0ZyA9IGN1cnJ5KGFzeW5jIChuYW1lOiBzdHJpbmcgfCBudW1iZXIsIGZuOiAoeDogdW5rbm93bikgPT4gYW55KSA9PiB7XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciB0cy1taWdyYXRlKDIzNDUpIEZJWE1FOiBBcmd1bWVudCBvZiB0eXBlICdzdHJpbmcgfCBudW1iZXInIGlzIG5vdCBhc3NpZ25hYi4uLiBSZW1vdmUgdGhpcyBjb21tZW50IHRvIHNlZSB0aGUgZnVsbCBlcnJvciBtZXNzYWdlXG4gICAgcmV0dXJuIGdldE9wdGlvbnMoKS50aGVuKHBpcGUocGF0aChbbmFtZSwgJ3ZhbHVlJ10pLCBmbiwgdXBkYXRlT3B0aW9uU3RnKG5hbWUpKSk7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBtc2dCRyhtc2c6IE1zZykge1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1zZyk7XG4gICAgY29uc29sZS5sb2coXCJtZXNzYWdpbmcgQkdcIiwgbXNnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBtc2dDUyh0YWJJZDogbnVtYmVyLCBtc2c6IE1zZykge1xuICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYklkLCBtc2cpO1xufVxuLy8gbWFrZXMgYW4gb25TdG9yYWdlQ2hhbmdlIGZ1bmN0aW9uIGdpdmVuIGFuIGFjdCBmdW5jdGlvbiB0aGF0J3MgdXN1YWxseSBhIHN3aXRjaCBvdmVyIGl0ZW0ga2V5cyB0aGF0IGhhdmUgY2hhbmdlZFxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VPblN0b3JhZ2VDaGFuZ2VkKCBhY3Q6IChzdGdDaDpTdG9yYWdlQ2hhbmdlKSA9PiBhbnkpe1xuXG4gICAgcmV0dXJuIChjaGFuZ2VzOiB7W3g6IHN0cmluZ106IHtuZXdWYWx1ZToge307fTt9LCBhcmVhOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKGFyZWEgIT0gJ2xvY2FsJylcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBsZXQgb2xkVmFsID0ge307XG4gICAgICAgIGxldCBuZXdWYWwgPSB7fTtcbiAgICAgICAgbGV0IGNoYW5nZWRJdGVtcyA9IE9iamVjdC5rZXlzKGNoYW5nZXMpO1xuICAgICAgICBmb3IgKGxldCBpdGVtTmFtZSBvZiBjaGFuZ2VkSXRlbXMpIHtcbiAgICAgICAgICAgIG9sZFZhbCA9IChjaGFuZ2VzW2l0ZW1OYW1lXSBhcyBhbnkpLm9sZFZhbHVlO1xuICAgICAgICAgICAgbmV3VmFsID0gY2hhbmdlc1tpdGVtTmFtZV0ubmV3VmFsdWU7XG4gICAgICAgICAgICBpZiAob2xkVmFsID09IG5ld1ZhbClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGFjdCh7aXRlbU5hbWUsIG9sZFZhbCwgbmV3VmFsfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuLy8gY29uc3QgbWFrZUV2ZW50T2JzID0gY3VycnkoKGV2ZW50OiB7YWRkTGlzdGVuZXI6IChhcmcwOiBhbnkpID0+IHZvaWQ7IHJlbW92ZUxpc3RlbmVyOiAoYXJnMDogYW55KSA9PiB2b2lkO30sIG1ha2VFbWl0LCBpbml0VmFsKSA9PiB7XG5jb25zdCBtYWtlRXZlbnRPYnMgPSBjdXJyeSgoZXZlbnQ6IGNocm9tZS5ldmVudHMuRXZlbnQ8YW55PiwgbWFrZUVtaXQsIGluaXRWYWw6IGFueSk6IFN0cmVhbTxhbnksRXJyb3I+ID0+IHtcbiAgICByZXR1cm4gS2VmaXIuc3RyZWFtKGVtaXR0ZXIgPT4ge1xuICAgICAgICAvLyBlbWl0dGVyLmVtaXQoaW5pdFZhbCk7XG4gICAgICAgIGNvbnN0IGVtaXQgPSBtYWtlRW1pdChlbWl0dGVyKTtcbiAgICAgICAgZXZlbnQuYWRkTGlzdGVuZXIoZW1pdCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBldmVudC5yZW1vdmVMaXN0ZW5lcihlbWl0KTtcbiAgICAgICAgICAgIGVtaXR0ZXIuZW5kKCk7XG4gICAgICAgIH07XG4gICAgfSk7XG59KTtcbmV4cG9ydCBjb25zdCBtYWtlU3RvcmFnZUNoYW5nZU9icyA9ICgpOk9ic2VydmFibGU8U3RvcmFnZUNoYW5nZSwgRXJyb3I+ID0+IHtcbiAgICBjb25zdCBtYWtlRW1pdFN0Z0NIID0gKGVtaXR0ZXI6IEVtaXR0ZXI8U3RvcmFnZUNoYW5nZSwgRXJyb3I+XG4gICAgKSA9PiBtYWtlT25TdG9yYWdlQ2hhbmdlZCgoc3RnQ2g6IFN0b3JhZ2VDaGFuZ2UpOiBhbnkgPT4gZW1pdHRlci5lbWl0KHN0Z0NoKSk7XG4gICAgcmV0dXJuIG1ha2VFdmVudE9icyhjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQsIG1ha2VFbWl0U3RnQ0gsIHsgaXRlbU5hbWU6IG51bGwsIG9sZFZhbDogbnVsbCwgbmV3VmFsOiBudWxsIH0pO1xufTtcbi8vIHNoYWxsb3dcbmNvbnN0IGlzU3RnSXRlbVNhbWUgPSAoeDogU3RvcmFnZUNoYW5nZSkgPT4gKGlzTmlsKHgub2xkVmFsKSAmJiBpc05pbCh4Lm5ld1ZhbCkpIHx8IHgub2xkVmFsID09PSB4Lm5ld1ZhbDtcbmV4cG9ydCBjb25zdCBtYWtlU3RnUGF0aE9icyA9IChfcGF0aDogc3RyaW5nW10pOiBPYnNlcnZhYmxlPGFueSwgRXJyb3I+ID0+IG1ha2VTdG9yYWdlQ2hhbmdlT2JzKClcbiAgICAuZmlsdGVyKHByb3BFcSgnaXRlbU5hbWUnLCBfcGF0aFswXSkpXG4gICAgLm1hcChwYXRoKFsnbmV3VmFsJywgLi4uc2xpY2UoMSwgSW5maW5pdHksIF9wYXRoKV0pKVxuICAgIC50b1Byb3BlcnR5KCk7XG4vLyBleHBvcnQgY29uc3QgbWFrZVN0Z0l0ZW1PYnMgPSBpdGVtTmFtZSA9PiB7Y29uc29sZS5sb2coJ21ha2luZyBzdGcgaXRlbSBvYnMgZm9yICcsIGl0ZW1OYW1lKTsgcmV0dXJuIG1ha2VTdG9yYWdlT2JzKCkuZmlsdGVyKHByb3BFcSgnaXRlbU5hbWUnLGl0ZW1OYW1lKSkuZmlsdGVyKHBpcGUoaXNTdGdJdGVtU2FtZSwgbm90KSkubWFwKHByb3AoJ25ld1ZhbCcpKS5za2lwRHVwbGljYXRlcygpfVxuZXhwb3J0IGNvbnN0IG1ha2VTdGdJdGVtT2JzID0gaXRlbU5hbWUgPT4gbWFrZVN0Z1BhdGhPYnMoW2l0ZW1OYW1lXSk7XG4vLyBleHBvcnQgY29uc3QgbWFrZVN0Z0l0ZW1PYnMgPSBpdGVtTmFtZSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKCdtYWtpbmcgc3RnIGl0ZW0gb2JzIGZvciAnLCBpdGVtTmFtZSk7IFxuLy8gICByZXR1cm4gbWFrZVN0b3JhZ2VPYnMoKVxuLy8gICAuZmlsdGVyKHByb3BFcSgnaXRlbU5hbWUnLGl0ZW1OYW1lKSlcbi8vICAgLm1hcChwcm9wKCduZXdWYWwnKSkudG9Qcm9wZXJ0eSgpfVxuLy8gZXhwb3J0IGNvbnN0IG1ha2VTdG9yYWdlU3RyZWFtID0gKHR5cGUpID0+IG1ha2VTdG9yYWdlZ09icygpLmZpbHRlcihwcm9wRXEoJ3R5cGUnLHR5cGUpKVxuZXhwb3J0IGNvbnN0IG1ha2VHb3RNc2dPYnMgPSAoKTogT2JzZXJ2YWJsZTxNc2dXcmFwcGVyLEVycm9yPiA9PiB7XG4gICAgY29uc3QgbWFrZUVtaXRNc2cgPSAoZW1pdHRlcjogRW1pdHRlcjxNc2dXcmFwcGVyLCBFcnJvcj4pID0+IChtZXNzYWdlLCBzZW5kZXIpID0+IGVtaXR0ZXIuZW1pdCh7IG06IG1lc3NhZ2UsIHM6IHNlbmRlciB9KTtcbiAgICByZXR1cm4gbWFrZUV2ZW50T2JzKGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZSwgbWFrZUVtaXRNc2csIHsgbTogeyB0eXBlOiBudWxsIH0sIHM6IG51bGwgfSk7XG59O1xuZXhwb3J0IGNvbnN0IG1ha2VNc2dTdHJlYW0gPSAobXNnVHlwZSk6IE9ic2VydmFibGU8TXNnLCBFcnJvcj4gPT4gIG1ha2VHb3RNc2dPYnMoKS5tYXAocHJvcCgnbScpKS5maWx0ZXIocHJvcEVxKCd0eXBlJywgbXNnVHlwZSkpO1xuLy8gLy8gb3B0aW9uc0NoYW5nZSQgOjogY2hhbmdlIC0+IGNoYW5nZVxuLy8gZXhwb3J0IGNvbnN0IG1ha2VPcHRpb25zQ2hhbmdlT2JzID0gYXN5bmMgKHN0b3JhZ2VDaGFuZ2UkKSA9PiB7XG4vLyAgIGNvbnN0IGNhY2hlZE9wdGlvbnMgPSB7b2xkVmFsOm51bGwsIG5ld1ZhbDphd2FpdCBnZXRPcHRpb25zKCl9XG4vLyAgIHJldHVybiBzdG9yYWdlQ2hhbmdlJC5maWx0ZXIoeD0+eC5pdGVtTmFtZT09J29wdGlvbnMnKS50b1Byb3BlcnR5KCgpPT5jYWNoZWRPcHRpb25zKVxuLy8gfVxuY29uc3QgaXNPcHRpb25TYW1lID0gY3VycnkoKG5hbWU6IHN0cmluZywgeDogU3RvcmFnZUNoYW5nZSk6IGJvb2xlYW4gPT4gaXNTdGdJdGVtU2FtZSh4KSB8fCAoIWlzTmlsKHgub2xkVmFsKSAmJiAhaXNOaWwoeC5uZXdWYWwpICYmIChwYXRoKFsnb2xkVmFsJywgbmFtZSwgJ3ZhbHVlJ10sIHgpID09PSBwYXRoKFsnbmV3VmFsJywgbmFtZSwgJ3ZhbHVlJ10sIHgpKSkpO1xuLy8gY29uc3QgaXNPcHRpb25TYW1lID0gY3VycnkgKChuYW1lLCB4KT0+IChpc05pbCh4Lm9sZFZhbCkgJiYgaXNOaWwoeC5uZXdWYWwpKSB8fCAoIWlzTmlsKHgub2xkVmFsKSAmJiAhaXNOaWwoeC5uZXdWYWwpICYmIChwYXRoKFsnb2xkVmFsJywgbmFtZSwgJ3ZhbHVlJ10seCkgPT09IHBhdGgoWyduZXdWYWwnLCBuYW1lLCAndmFsdWUnXSx4KSkpIClcbi8vIG1ha2VPcHRpb25zT2JzIDo6IFN0cmluZyAtPiBhXG5leHBvcnQgY29uc3QgbWFrZU9wdGlvbk9icyA9IGN1cnJ5KChvcHRpb25zQ2hhbmdlJDogT2JzZXJ2YWJsZTxTdG9yYWdlQ2hhbmdlLCBhbnk+LCBpdGVtTmFtZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxPcHRpb24sIGFueT4gPT4gb3B0aW9uc0NoYW5nZSRcbiAgICAuZmlsdGVyKHggPT4gIWlzT3B0aW9uU2FtZShpdGVtTmFtZSwgeCkpXG4gICAgLm1hcChwYXRoPGFueT4oWyduZXdWYWwnLCBpdGVtTmFtZV0pKVxuICAgIC5tYXAoZGVmYXVsdFRvKHByb3AoaXRlbU5hbWUsIGRlZmF1bHRPcHRpb25zKCkpKSkpO1xuLy8gY29uc3QgbGlzdFNlYXJjaEZpbHRlcnMgPSBwaXBlKHByb3AoJ25ld1ZhbCcpLCB2YWx1ZXMsIGZpbHRlcihwcm9wRXEoJ3R5cGUnLCAnc2VhcmNoRmlsdGVyJykpLCBtYXAocHJvcCgnbmFtZScpKSwgUi5tYXAobWFrZU9wdGlvbk9icyksIGluc3BlY3QoJ2xpc3RzZWFyY2hmaWx0ZXJzJykpO1xuLy8gY29uc3QgY29tYmluZU9wdGlvbnMgPSAoLi4uYXJncykgPT4gcGlwZShpbnNwZWN0KCdjb21iaW5lb3B0JyksIHJlZHVjZSgoYSwgYikgPT4gYXNzb2MoYi5uYW1lLCBiLnZhbHVlLCBhKSwge30pKShhcmdzKTtcbi8vIGV4cG9ydCBjb25zdCBtYWtlU2VhcmNoRmlsdGVyc09icyA9ICgpID0+IEtlZmlyLmNvbWJpbmUoW2dldFJUJCwgdXNlQm9va21hcmtzJCwgdXNlUmVwbGllcyRdLCBjb21iaW5lT3B0aW9ucykudG9Qcm9wZXJ0eSgpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==