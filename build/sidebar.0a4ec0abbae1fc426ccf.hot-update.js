webpackHotUpdate("sidebar",{

/***/ "./src/ts/components/Search.tsx":
/*!**************************************!*\
  !*** ./src/ts/components/Search.tsx ***!
  \**************************************/
/*! exports provided: Search */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__prefresh_utils__, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Search", function() { return Search; });
/* harmony import */ var preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact/jsx-runtime */ "./node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "./node_modules/preact/hooks/dist/hooks.module.js");
/* harmony import */ var _utils_dutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/dutils */ "./src/ts/utils/dutils.tsx");
/* harmony import */ var _Tweet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Tweet */ "./src/ts/components/Tweet.tsx");
/* harmony import */ var _hooks_useStorage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hooks/useStorage */ "./src/ts/hooks/useStorage.tsx");
/* harmony import */ var _utils_putils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/putils */ "./src/ts/utils/putils.tsx");
/* harmony import */ var ramda__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ramda */ "./node_modules/ramda/es/index.js");
/* harmony import */ var _utils_defaultStg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/defaultStg */ "./src/ts/utils/defaultStg.tsx");


var _s = $RefreshSig$(),
    _s2 = $RefreshSig$();

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






""; // flattenModule(global,R)

 // Function

 // Object

 // List

 // Logic, Type, Relation, String, Math


var DEVING = "serve" == 'serve';
var useStorage = DEVING ? _s(function (name, init) {
  _s();

  return Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useState"])(Object(_utils_defaultStg__WEBPACK_IMPORTED_MODULE_7__["devStorage"])()[name]);
}, "y/OQfi/ywzQYuE+pbpcYWn5FXFM=") : _hooks_useStorage__WEBPACK_IMPORTED_MODULE_4__["useStorage"]; // function reqSearch(query:string){
//   msgBG({type:'search', query:query})
// }

function Search(props) {
  _s2();

  var _useState = Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useState"])([]),
      _useState2 = _slicedToArray(_useState, 2),
      tweets = _useState2[0],
      setTweets = _useState2[1]; // const query = useStream(props.composeQuery, '')


  var myRef = Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useRef"])(null);

  var _setTweets = function _setTweets(t) {
    setTweets(t);
  };

  var _useStorage2 = useStorage('search_results', []),
      _useStorage3 = _slicedToArray(_useStorage2, 2),
      searchResults = _useStorage3[0],
      setSearchResults = _useStorage3[1];

  var _useStorage4 = useStorage('latest_tweets', []),
      _useStorage5 = _slicedToArray(_useStorage4, 2),
      latestTweets = _useStorage5[0],
      setLatestTweets = _useStorage5[1]; // const showSearchRes = (searchResults)=>!(isExist(searchResults) || R.isEmpty(query.trim()))


  var showSearchRes = function showSearchRes(searchResults) {
    return Object(_utils_putils__WEBPACK_IMPORTED_MODULE_5__["isExist"])(searchResults);
  };

  Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useEffect"])( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var initTweets;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_2__["getData"])('latest_tweets');

          case 2:
            initTweets = _context.sent;
            setTweets(Object(ramda__WEBPACK_IMPORTED_MODULE_6__["isNil"])(initTweets) ? [] : initTweets);
            return _context.abrupt("return", function () {});

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), []); // // 
  //   useEffect(()=>{
  //     R.pipe(
  //       defaultTo(''),
  //       // R.trim,
  //       reqSearch,
  //     )(query)
  //     return ()=>{  };
  //   },[query]);

  Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    console.log({
      searchResults: searchResults
    });
    return function () {};
  }, [searchResults]);
  Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    console.log({
      latestTweets: latestTweets
    });
    return function () {};
  }, [latestTweets]);
  return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("div", {
    "class": "searchWidget",
    ref: myRef,
    children: showSearchRes(searchResults) ? Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(SearchResults, {
      results: searchResults
    }) : Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(SearchResults, {
      results: latestTweets
    })
  });
}

_s2(Search, "Sy3+1EtSHmDBFk/DzmoYDCuaVqg=", false, function () {
  return [useStorage, useStorage];
});

_c = Search;

function prepResults(list) {
  var prepped = Object(ramda__WEBPACK_IMPORTED_MODULE_6__["defaultTo"])([], list);
  console.log('prepResults', {
    list: list,
    prepped: prepped
  });
  return Object(ramda__WEBPACK_IMPORTED_MODULE_6__["filter"])(Object(ramda__WEBPACK_IMPORTED_MODULE_6__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_6__["prop"])('tweet'), ramda__WEBPACK_IMPORTED_MODULE_6__["isNil"], ramda__WEBPACK_IMPORTED_MODULE_6__["not"]), prepped);
}

function SearchResults(props) {
  return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("div", {
    "class": "searchTweets",
    children: Object(ramda__WEBPACK_IMPORTED_MODULE_6__["isEmpty"])(prepResults(props.results)) ? "No search results." : prepResults(Object(ramda__WEBPACK_IMPORTED_MODULE_6__["prop"])('results', props)).map(function (res) {
      return (// Without a key, Preact has to guess which tweets have
        // changed when re-rendering.
        Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(_Tweet__WEBPACK_IMPORTED_MODULE_3__["Tweet"], {
          tweet: Object(ramda__WEBPACK_IMPORTED_MODULE_6__["prop"])('tweet', res),
          score: Object(ramda__WEBPACK_IMPORTED_MODULE_6__["prop"])('score', res)
        }, Object(ramda__WEBPACK_IMPORTED_MODULE_6__["path"])(['tweet', 'id']))
      );
    })
  });
}

_c2 = SearchResults;

var _c, _c2;

$RefreshReg$(_c, "Search");
$RefreshReg$(_c2, "SearchResults");

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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@prefresh/webpack/src/utils/prefresh.js */ "./node_modules/@prefresh/webpack/src/utils/prefresh.js"), __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9TZWFyY2gudHN4Il0sIm5hbWVzIjpbIkRFVklORyIsInByb2Nlc3MiLCJ1c2VTdG9yYWdlIiwibmFtZSIsImluaXQiLCJ1c2VTdGF0ZSIsImRldlN0b3JhZ2UiLCJfdXNlU3RvcmFnZSIsIlNlYXJjaCIsInByb3BzIiwidHdlZXRzIiwic2V0VHdlZXRzIiwibXlSZWYiLCJ1c2VSZWYiLCJfc2V0VHdlZXRzIiwidCIsInNlYXJjaFJlc3VsdHMiLCJzZXRTZWFyY2hSZXN1bHRzIiwibGF0ZXN0VHdlZXRzIiwic2V0TGF0ZXN0VHdlZXRzIiwic2hvd1NlYXJjaFJlcyIsImlzRXhpc3QiLCJ1c2VFZmZlY3QiLCJnZXREYXRhIiwiaW5pdFR3ZWV0cyIsImlzTmlsIiwiY29uc29sZSIsImxvZyIsInByZXBSZXN1bHRzIiwibGlzdCIsInByZXBwZWQiLCJkZWZhdWx0VG8iLCJmaWx0ZXIiLCJwaXBlIiwicHJvcCIsIm5vdCIsIlNlYXJjaFJlc3VsdHMiLCJpc0VtcHR5IiwicmVzdWx0cyIsIm1hcCIsInJlcyIsInBhdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUMyQixHLENBQzNCOztDQUMyRjs7Q0FDZ0c7O0NBQ1g7O0NBQ1Y7O0FBSXRLO0FBR0EsSUFBTUEsTUFBTSxHQUFHQyxPQUFBLElBQXdCLE9BQXZDO0FBQ0EsSUFBTUMsVUFBVSxHQUFHRixNQUFNLE1BQUcsVUFBQ0csSUFBRCxFQUFlQyxJQUFmO0FBQUE7O0FBQUEsU0FBNEJDLDZEQUFRLENBQUNDLG9FQUFVLEdBQUdILElBQUgsQ0FBWCxDQUFwQztBQUFBLENBQUgsb0NBQThESSw0REFBdkYsQyxDQUdBO0FBQ0E7QUFDQTs7QUFFTyxTQUFTQyxNQUFULENBQWdCQyxLQUFoQixFQUEwQjtBQUFBOztBQUFBLGtCQUNISiw2REFBUSxDQUFDLEVBQUQsQ0FETDtBQUFBO0FBQUEsTUFDeEJLLE1BRHdCO0FBQUEsTUFDaEJDLFNBRGdCLGtCQUUvQjs7O0FBQ0EsTUFBTUMsS0FBSyxHQUFHQywyREFBTSxDQUFDLElBQUQsQ0FBcEI7O0FBQ0EsTUFBTUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBQ0MsQ0FBRCxFQUE0QztBQUFDSixhQUFTLENBQUNJLENBQUQsQ0FBVDtBQUFjLEdBQTlFOztBQUorQixxQkFNV2IsVUFBVSxDQUFDLGdCQUFELEVBQWtCLEVBQWxCLENBTnJCO0FBQUE7QUFBQSxNQU14QmMsYUFOd0I7QUFBQSxNQU1UQyxnQkFOUzs7QUFBQSxxQkFPU2YsVUFBVSxDQUFDLGVBQUQsRUFBaUIsRUFBakIsQ0FQbkI7QUFBQTtBQUFBLE1BT3hCZ0IsWUFQd0I7QUFBQSxNQU9WQyxlQVBVLG9CQVMvQjs7O0FBQ0EsTUFBTUMsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixDQUFDSixhQUFEO0FBQUEsV0FBdUJLLDZEQUFPLENBQUNMLGFBQUQsQ0FBOUI7QUFBQSxHQUF0Qjs7QUFHQU0sZ0VBQVMsdUVBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFDdUJDLDZEQUFPLENBQUMsZUFBRCxDQUQ5Qjs7QUFBQTtBQUNGQyxzQkFERTtBQUVSYixxQkFBUyxDQUFDYyxtREFBSyxDQUFDRCxVQUFELENBQUwsR0FBb0IsRUFBcEIsR0FBeUJBLFVBQTFCLENBQVQ7QUFGUSw2Q0FHRCxZQUFJLENBQUUsQ0FITDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFELElBSU4sRUFKTSxDQUFULENBYitCLENBbUJqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUVGLGdFQUFTLENBQUMsWUFBSTtBQUNaSSxXQUFPLENBQUNDLEdBQVIsQ0FBWTtBQUFDWCxtQkFBYSxFQUFiQTtBQUFELEtBQVo7QUFDQSxXQUFPLFlBQUksQ0FBSSxDQUFmO0FBQ0QsR0FIUSxFQUdQLENBQUNBLGFBQUQsQ0FITyxDQUFUO0FBS0FNLGdFQUFTLENBQUMsWUFBSTtBQUNaSSxXQUFPLENBQUNDLEdBQVIsQ0FBWTtBQUFDVCxrQkFBWSxFQUFaQTtBQUFELEtBQVo7QUFDQSxXQUFPLFlBQUksQ0FBSSxDQUFmO0FBQ0QsR0FIUSxFQUdQLENBQUNBLFlBQUQsQ0FITyxDQUFUO0FBTUEsU0FDRTtBQUFLLGFBQU0sY0FBWDtBQUEwQixPQUFHLEVBQUVOLEtBQS9CO0FBQUEsY0FFR1EsYUFBYSxDQUFDSixhQUFELENBQWIsR0FDQywrREFBQyxhQUFEO0FBQWUsYUFBTyxFQUFFQTtBQUF4QixNQURELEdBRUMsK0RBQUMsYUFBRDtBQUFlLGFBQU8sRUFBRUU7QUFBeEI7QUFKSixJQURGO0FBUUQ7O0lBaERlVixNO1VBTTRCTixVLEVBQ0ZBLFU7OztLQVAxQk0sTTs7QUFrRGhCLFNBQVNvQixXQUFULENBQXFCQyxJQUFyQixFQUEwRDtBQUN4RCxNQUFNQyxPQUFPLEdBQUdDLHVEQUFTLENBQUMsRUFBRCxFQUFJRixJQUFKLENBQXpCO0FBQ0FILFNBQU8sQ0FBQ0MsR0FBUixDQUFZLGFBQVosRUFBMkI7QUFBQ0UsUUFBSSxFQUFKQSxJQUFEO0FBQU9DLFdBQU8sRUFBUEE7QUFBUCxHQUEzQjtBQUNBLFNBQU9FLG9EQUFNLENBQUNDLGtEQUFJLENBQUNDLGtEQUFJLENBQUMsT0FBRCxDQUFMLEVBQWdCVCwyQ0FBaEIsRUFBdUJVLHlDQUF2QixDQUFMLEVBQWtDTCxPQUFsQyxDQUFiO0FBQ0Q7O0FBRUQsU0FBU00sYUFBVCxDQUF1QjNCLEtBQXZCLEVBQTJEO0FBQ3pELFNBQ0E7QUFBSyxhQUFNLGNBQVg7QUFBQSxjQUNPNEIscURBQU8sQ0FBQ1QsV0FBVyxDQUFDbkIsS0FBSyxDQUFDNkIsT0FBUCxDQUFaLENBQVAsR0FDQyxvQkFERCxHQUVDVixXQUFXLENBQUNNLGtEQUFJLENBQUMsU0FBRCxFQUFZekIsS0FBWixDQUFMLENBQVgsQ0FBb0M4QixHQUFwQyxDQUF3QyxVQUFDQyxHQUFEO0FBQUEsYUFDeEM7QUFDQTtBQUNBLHVFQUFDLDRDQUFEO0FBQXVDLGVBQUssRUFBRU4sa0RBQUksQ0FBQyxPQUFELEVBQVVNLEdBQVYsQ0FBbEQ7QUFBa0UsZUFBSyxFQUFFTixrREFBSSxDQUFDLE9BQUQsRUFBVU0sR0FBVjtBQUE3RSxXQUFnQkMsa0RBQUksQ0FBQyxDQUFDLE9BQUQsRUFBVSxJQUFWLENBQUQsQ0FBcEI7QUFId0M7QUFBQSxLQUF4QztBQUhSLElBREE7QUFVRDs7TUFYUUwsYSIsImZpbGUiOiJzaWRlYmFyLjBhNGVjMGFiYmFlMWZjNDI2Y2NmLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgIGltcG9ydCB7IGgsIHJlbmRlciwgQ29tcG9uZW50IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VSZWYsIHVzZUVmZmVjdCwgdXNlQ29udGV4dCwgdXNlQ2FsbGJhY2sgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgZ2V0RGF0YSwgc2V0U3RnLCBtc2dCRywgbWFrZU9uU3RvcmFnZUNoYW5nZWQgfSBmcm9tICcuLi91dGlscy9kdXRpbHMnO1xuaW1wb3J0IHsgQ29uc29sZSB9IGZyb20gJy4vQ29uc29sZSc7XG5pbXBvcnQgeyBUd2VldCBhcyBUd2VldENhcmQgfSBmcm9tICcuL1R3ZWV0JztcbmltcG9ydCB7IHVzZVN0b3JhZ2UgYXMgX3VzZVN0b3JhZ2UgfSBmcm9tICcuLi9ob29rcy91c2VTdG9yYWdlJztcbmltcG9ydCB7IHVzZVN0cmVhbSB9IGZyb20gJy4uL2hvb2tzL3VzZVN0cmVhbSc7XG5pbXBvcnQgeyBmbGF0dGVuTW9kdWxlLCBpc0V4aXN0LCBpbnNwZWN0IH0gZnJvbSAnLi4vdXRpbHMvcHV0aWxzJ1xuaW1wb3J0ICogYXMgUiBmcm9tICdyYW1kYSc7YGBcbi8vIGZsYXR0ZW5Nb2R1bGUoZ2xvYmFsLFIpXG5pbXBvcnQgeyBfXywgY3VycnksIHBpcGUsIGFuZFRoZW4sIG1hcCwgZmlsdGVyLCByZWR1Y2UsIHRhcCwgYXBwbHksIHRyeUNhdGNofSBmcm9tICdyYW1kYScgLy8gRnVuY3Rpb25cbmltcG9ydCB7IHByb3AsIHByb3BFcSwgcHJvcFNhdGlzZmllcywgcGF0aCwgcGF0aEVxLCBoYXNQYXRoLCBhc3NvYywgYXNzb2NQYXRoLCB2YWx1ZXMsIG1lcmdlTGVmdCwgbWVyZ2VEZWVwTGVmdCwga2V5cywgbGVucywgbGVuc1Byb3AsIGxlbnNQYXRoLCBwaWNrLCBwcm9qZWN0LCBzZXQsIGxlbmd0aCB9IGZyb20gJ3JhbWRhJyAvLyBPYmplY3RcbmltcG9ydCB7IGhlYWQsIHRhaWwsIHRha2UsIGlzRW1wdHksIGFueSwgYWxsLCAgaW5jbHVkZXMsIGxhc3QsIGRyb3BXaGlsZSwgZHJvcExhc3RXaGlsZSwgZGlmZmVyZW5jZSwgYXBwZW5kLCBmcm9tUGFpcnMsIGZvckVhY2gsIG50aCwgcGx1Y2ssIHJldmVyc2UsIHVuaXEsIHNsaWNlfSBmcm9tICdyYW1kYScgLy8gTGlzdFxuaW1wb3J0IHsgZXF1YWxzLCBpZkVsc2UsIHdoZW4sIGJvdGgsIGVpdGhlciwgaXNOaWwsIGlzLCBkZWZhdWx0VG8sIGFuZCwgb3IsIG5vdCwgVCwgRiwgZ3QsIGx0LCBndGUsIGx0ZSwgbWF4LCBtaW4sIHNvcnQsIHNvcnRCeSwgc3BsaXQsIHRyaW0sIG11bHRpcGx5IH0gZnJvbSAncmFtZGEnIC8vIExvZ2ljLCBUeXBlLCBSZWxhdGlvbiwgU3RyaW5nLCBNYXRoXG5pbXBvcnQgeyBTdGF0dXMgYXMgVHdlZXQgfSBmcm9tICd0d2l0dGVyLWQnO1xuaW1wb3J0IHsgdGhUd2VldCB9IGZyb20gJy4uL3R5cGVzL3R3ZWV0VHlwZXMnO1xuaW1wb3J0IHsgU2VhcmNoUmVzdWx0IH0gZnJvbSAnLi4vdHlwZXMvbXNnVHlwZXMnO1xuaW1wb3J0IHsgZGVmYXVsdE9wdGlvbnMsIGRlZmF1bHRTdG9yYWdlIGFzIGRlZmF1bHRTdG9yYWdlLCBkZXZTdG9yYWdlIH0gZnJvbSAnLi4vdXRpbHMvZGVmYXVsdFN0Zyc7XG5cblxuY29uc3QgREVWSU5HID0gcHJvY2Vzcy5lbnYuREVWX01PREUgPT0gJ3NlcnZlJ1xuY29uc3QgdXNlU3RvcmFnZSA9IERFVklORyA/IChuYW1lOiBzdHJpbmcsIGluaXQ6YW55KSA9PiB1c2VTdGF0ZShkZXZTdG9yYWdlKClbbmFtZV0pIDogX3VzZVN0b3JhZ2VcblxuXG4vLyBmdW5jdGlvbiByZXFTZWFyY2gocXVlcnk6c3RyaW5nKXtcbi8vICAgbXNnQkcoe3R5cGU6J3NlYXJjaCcsIHF1ZXJ5OnF1ZXJ5fSlcbi8vIH1cblxuZXhwb3J0IGZ1bmN0aW9uIFNlYXJjaChwcm9wczphbnkpe1xuICBjb25zdCBbdHdlZXRzLCBzZXRUd2VldHNdID0gdXNlU3RhdGUoW10pO1xuICAvLyBjb25zdCBxdWVyeSA9IHVzZVN0cmVhbShwcm9wcy5jb21wb3NlUXVlcnksICcnKVxuICBjb25zdCBteVJlZiA9IHVzZVJlZihudWxsKTtcbiAgY29uc3QgX3NldFR3ZWV0cyA9ICh0OiBhbnlbXSB8ICgocHJldlN0YXRlOiBhbnlbXSkgPT4gYW55W10pKT0+e3NldFR3ZWV0cyh0KTt9XG4gIFxuICBjb25zdCBbc2VhcmNoUmVzdWx0cywgc2V0U2VhcmNoUmVzdWx0c10gPSB1c2VTdG9yYWdlKCdzZWFyY2hfcmVzdWx0cycsW10pO1xuICBjb25zdCBbbGF0ZXN0VHdlZXRzLCBzZXRMYXRlc3RUd2VldHNdID0gdXNlU3RvcmFnZSgnbGF0ZXN0X3R3ZWV0cycsW10pO1xuICBcbiAgLy8gY29uc3Qgc2hvd1NlYXJjaFJlcyA9IChzZWFyY2hSZXN1bHRzKT0+IShpc0V4aXN0KHNlYXJjaFJlc3VsdHMpIHx8IFIuaXNFbXB0eShxdWVyeS50cmltKCkpKVxuICBjb25zdCBzaG93U2VhcmNoUmVzID0gKHNlYXJjaFJlc3VsdHM6YW55W10pPT5pc0V4aXN0KHNlYXJjaFJlc3VsdHMpXG5cblxuICB1c2VFZmZlY3QoYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGluaXRUd2VldHMgOiBhbnkgPSBhd2FpdCBnZXREYXRhKCdsYXRlc3RfdHdlZXRzJykgXG4gICAgc2V0VHdlZXRzKGlzTmlsKGluaXRUd2VldHMpID8gW10gOiBpbml0VHdlZXRzKVxuICAgIHJldHVybiAoKT0+e31cbiAgfSwgW10pO1xuXG4vLyAvLyBcbi8vICAgdXNlRWZmZWN0KCgpPT57XG4vLyAgICAgUi5waXBlKFxuLy8gICAgICAgZGVmYXVsdFRvKCcnKSxcbi8vICAgICAgIC8vIFIudHJpbSxcbi8vICAgICAgIHJlcVNlYXJjaCxcbi8vICAgICApKHF1ZXJ5KVxuLy8gICAgIHJldHVybiAoKT0+eyAgfTtcbi8vICAgfSxbcXVlcnldKTtcblxuICB1c2VFZmZlY3QoKCk9PntcbiAgICBjb25zb2xlLmxvZyh7c2VhcmNoUmVzdWx0c30pXG4gICAgcmV0dXJuICgpPT57ICB9O1xuICB9LFtzZWFyY2hSZXN1bHRzXSk7XG5cbiAgdXNlRWZmZWN0KCgpPT57XG4gICAgY29uc29sZS5sb2coe2xhdGVzdFR3ZWV0c30pXG4gICAgcmV0dXJuICgpPT57ICB9O1xuICB9LFtsYXRlc3RUd2VldHNdKTtcblxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzcz1cInNlYXJjaFdpZGdldFwiIHJlZj17bXlSZWZ9PlxuICAgICAgey8qIDxDb25zb2xlLz4gKi99XG4gICAgICB7c2hvd1NlYXJjaFJlcyhzZWFyY2hSZXN1bHRzKSBcbiAgICAgID8gPFNlYXJjaFJlc3VsdHMgcmVzdWx0cz17c2VhcmNoUmVzdWx0c30gLz4gXG4gICAgICA6IDxTZWFyY2hSZXN1bHRzIHJlc3VsdHM9e2xhdGVzdFR3ZWV0c30gLz4gfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5mdW5jdGlvbiBwcmVwUmVzdWx0cyhsaXN0OiBTZWFyY2hSZXN1bHRbXSk6IFNlYXJjaFJlc3VsdFtde1xuICBjb25zdCBwcmVwcGVkID0gZGVmYXVsdFRvKFtdLGxpc3QpXG4gIGNvbnNvbGUubG9nKCdwcmVwUmVzdWx0cycsIHtsaXN0LCBwcmVwcGVkfSlcbiAgcmV0dXJuIGZpbHRlcihwaXBlKHByb3AoJ3R3ZWV0JyksIGlzTmlsLCBub3QpLCBwcmVwcGVkKVxufVxuXG5mdW5jdGlvbiBTZWFyY2hSZXN1bHRzKHByb3BzOiB7IHJlc3VsdHM6IFNlYXJjaFJlc3VsdFtdOyB9KXtcbiAgcmV0dXJuKFxuICA8ZGl2IGNsYXNzPVwic2VhcmNoVHdlZXRzXCI+IFxuICAgICAgICB7aXNFbXB0eShwcmVwUmVzdWx0cyhwcm9wcy5yZXN1bHRzKSkgXG4gICAgICAgID8gXCJObyBzZWFyY2ggcmVzdWx0cy5cIlxuICAgICAgICA6IHByZXBSZXN1bHRzKHByb3AoJ3Jlc3VsdHMnLCBwcm9wcykpLm1hcCgocmVzOiBTZWFyY2hSZXN1bHQpID0+IChcbiAgICAgICAgICAvLyBXaXRob3V0IGEga2V5LCBQcmVhY3QgaGFzIHRvIGd1ZXNzIHdoaWNoIHR3ZWV0cyBoYXZlXG4gICAgICAgICAgLy8gY2hhbmdlZCB3aGVuIHJlLXJlbmRlcmluZy5cbiAgICAgICAgICA8VHdlZXRDYXJkIGtleT17cGF0aChbJ3R3ZWV0JywgJ2lkJ10pfSB0d2VldD17cHJvcCgndHdlZXQnLCByZXMpfSBzY29yZT17cHJvcCgnc2NvcmUnLCByZXMpfSAvPlxuICAgICAgICApKX1cbiAgPC9kaXY+KVxufVxuXG4iXSwic291cmNlUm9vdCI6IiJ9