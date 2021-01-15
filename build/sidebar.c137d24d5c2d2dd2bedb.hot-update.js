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
/* harmony import */ var _utils_putils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/putils */ "./src/ts/utils/putils.tsx");
/* harmony import */ var ramda__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ramda */ "./node_modules/ramda/es/index.js");


var _s2 = $RefreshSig$();

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

var DEVING = "serve" == 'serve'; // const useStorage = DEVING ? (name: string, init:any) => useState(devStorage()[name]) : _useStorage
// function reqSearch(query:string){
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
    return Object(_utils_putils__WEBPACK_IMPORTED_MODULE_4__["isExist"])(searchResults);
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
            setTweets(Object(ramda__WEBPACK_IMPORTED_MODULE_5__["isNil"])(initTweets) ? [] : initTweets);
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

_s2(Search, "Sy3+1EtSHmDBFk/DzmoYDCuaVqg=", true);

_c = Search;

function prepResults(list) {
  var prepped = Object(ramda__WEBPACK_IMPORTED_MODULE_5__["defaultTo"])([], list);
  console.log('prepResults', {
    list: list,
    prepped: prepped
  });
  return Object(ramda__WEBPACK_IMPORTED_MODULE_5__["filter"])(Object(ramda__WEBPACK_IMPORTED_MODULE_5__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_5__["prop"])('tweet'), ramda__WEBPACK_IMPORTED_MODULE_5__["isNil"], ramda__WEBPACK_IMPORTED_MODULE_5__["not"]), prepped);
}

function SearchResults(props) {
  return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("div", {
    "class": "searchTweets",
    children: Object(ramda__WEBPACK_IMPORTED_MODULE_5__["isEmpty"])(prepResults(props.results)) ? "No search results." : prepResults(Object(ramda__WEBPACK_IMPORTED_MODULE_5__["prop"])('results', props)).map(function (res) {
      return (// Without a key, Preact has to guess which tweets have
        // changed when re-rendering.
        Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(_Tweet__WEBPACK_IMPORTED_MODULE_3__["Tweet"], {
          tweet: Object(ramda__WEBPACK_IMPORTED_MODULE_5__["prop"])('tweet', res),
          score: Object(ramda__WEBPACK_IMPORTED_MODULE_5__["prop"])('score', res)
        }, Object(ramda__WEBPACK_IMPORTED_MODULE_5__["path"])(['tweet', 'id']))
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9TZWFyY2gudHN4Il0sIm5hbWVzIjpbIkRFVklORyIsInByb2Nlc3MiLCJTZWFyY2giLCJwcm9wcyIsInVzZVN0YXRlIiwidHdlZXRzIiwic2V0VHdlZXRzIiwibXlSZWYiLCJ1c2VSZWYiLCJfc2V0VHdlZXRzIiwidCIsInVzZVN0b3JhZ2UiLCJzZWFyY2hSZXN1bHRzIiwic2V0U2VhcmNoUmVzdWx0cyIsImxhdGVzdFR3ZWV0cyIsInNldExhdGVzdFR3ZWV0cyIsInNob3dTZWFyY2hSZXMiLCJpc0V4aXN0IiwidXNlRWZmZWN0IiwiZ2V0RGF0YSIsImluaXRUd2VldHMiLCJpc05pbCIsImNvbnNvbGUiLCJsb2ciLCJwcmVwUmVzdWx0cyIsImxpc3QiLCJwcmVwcGVkIiwiZGVmYXVsdFRvIiwiZmlsdGVyIiwicGlwZSIsInByb3AiLCJub3QiLCJTZWFyY2hSZXN1bHRzIiwiaXNFbXB0eSIsInJlc3VsdHMiLCJtYXAiLCJyZXMiLCJwYXRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBQzJCLEcsQ0FDM0I7O0NBQzJGOztDQUNnRzs7Q0FDWDs7Q0FDVjs7QUFPdEssSUFBTUEsTUFBTSxHQUFHQyxPQUFBLElBQXdCLE9BQXZDLEMsQ0FDQTtBQUdBO0FBQ0E7QUFDQTs7QUFFTyxTQUFTQyxNQUFULENBQWdCQyxLQUFoQixFQUEwQjtBQUFBOztBQUFBLGtCQUNIQyw2REFBUSxDQUFDLEVBQUQsQ0FETDtBQUFBO0FBQUEsTUFDeEJDLE1BRHdCO0FBQUEsTUFDaEJDLFNBRGdCLGtCQUUvQjs7O0FBQ0EsTUFBTUMsS0FBSyxHQUFHQywyREFBTSxDQUFDLElBQUQsQ0FBcEI7O0FBQ0EsTUFBTUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBQ0MsQ0FBRCxFQUE0QztBQUFDSixhQUFTLENBQUNJLENBQUQsQ0FBVDtBQUFjLEdB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aWxlIjoic2lkZWJhci5jMTM3ZDI0ZDVjMmQyZGQyYmVkYi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiICBpbXBvcnQgeyBoLCByZW5kZXIsIENvbXBvbmVudCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlUmVmLCB1c2VFZmZlY3QsIHVzZUNvbnRleHQsIHVzZUNhbGxiYWNrIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGdldERhdGEsIHNldFN0ZywgbXNnQkcsIG1ha2VPblN0b3JhZ2VDaGFuZ2VkIH0gZnJvbSAnLi4vdXRpbHMvZHV0aWxzJztcbmltcG9ydCB7IENvbnNvbGUgfSBmcm9tICcuL0NvbnNvbGUnO1xuaW1wb3J0IHsgVHdlZXQgYXMgVHdlZXRDYXJkIH0gZnJvbSAnLi9Ud2VldCc7XG5pbXBvcnQgeyB1c2VTdG9yYWdlIGFzIF91c2VTdG9yYWdlIH0gZnJvbSAnLi4vaG9va3MvdXNlU3RvcmFnZSc7XG5pbXBvcnQgeyB1c2VTdHJlYW0gfSBmcm9tICcuLi9ob29rcy91c2VTdHJlYW0nO1xuaW1wb3J0IHsgZmxhdHRlbk1vZHVsZSwgaXNFeGlzdCwgaW5zcGVjdCB9IGZyb20gJy4uL3V0aWxzL3B1dGlscydcbmltcG9ydCAqIGFzIFIgZnJvbSAncmFtZGEnO2BgXG4vLyBmbGF0dGVuTW9kdWxlKGdsb2JhbCxSKVxuaW1wb3J0IHsgX18sIGN1cnJ5LCBwaXBlLCBhbmRUaGVuLCBtYXAsIGZpbHRlciwgcmVkdWNlLCB0YXAsIGFwcGx5LCB0cnlDYXRjaH0gZnJvbSAncmFtZGEnIC8vIEZ1bmN0aW9uXG5pbXBvcnQgeyBwcm9wLCBwcm9wRXEsIHByb3BTYXRpc2ZpZXMsIHBhdGgsIHBhdGhFcSwgaGFzUGF0aCwgYXNzb2MsIGFzc29jUGF0aCwgdmFsdWVzLCBtZXJnZUxlZnQsIG1lcmdlRGVlcExlZnQsIGtleXMsIGxlbnMsIGxlbnNQcm9wLCBsZW5zUGF0aCwgcGljaywgcHJvamVjdCwgc2V0LCBsZW5ndGggfSBmcm9tICdyYW1kYScgLy8gT2JqZWN0XG5pbXBvcnQgeyBoZWFkLCB0YWlsLCB0YWtlLCBpc0VtcHR5LCBhbnksIGFsbCwgIGluY2x1ZGVzLCBsYXN0LCBkcm9wV2hpbGUsIGRyb3BMYXN0V2hpbGUsIGRpZmZlcmVuY2UsIGFwcGVuZCwgZnJvbVBhaXJzLCBmb3JFYWNoLCBudGgsIHBsdWNrLCByZXZlcnNlLCB1bmlxLCBzbGljZX0gZnJvbSAncmFtZGEnIC8vIExpc3RcbmltcG9ydCB7IGVxdWFscywgaWZFbHNlLCB3aGVuLCBib3RoLCBlaXRoZXIsIGlzTmlsLCBpcywgZGVmYXVsdFRvLCBhbmQsIG9yLCBub3QsIFQsIEYsIGd0LCBsdCwgZ3RlLCBsdGUsIG1heCwgbWluLCBzb3J0LCBzb3J0QnksIHNwbGl0LCB0cmltLCBtdWx0aXBseSB9IGZyb20gJ3JhbWRhJyAvLyBMb2dpYywgVHlwZSwgUmVsYXRpb24sIFN0cmluZywgTWF0aFxuaW1wb3J0IHsgU3RhdHVzIGFzIFR3ZWV0IH0gZnJvbSAndHdpdHRlci1kJztcbmltcG9ydCB7IHRoVHdlZXQgfSBmcm9tICcuLi90eXBlcy90d2VldFR5cGVzJztcbmltcG9ydCB7IFNlYXJjaFJlc3VsdCB9IGZyb20gJy4uL3R5cGVzL21zZ1R5cGVzJztcbmltcG9ydCB7IGRlZmF1bHRPcHRpb25zLCBkZWZhdWx0U3RvcmFnZSBhcyBkZWZhdWx0U3RvcmFnZSwgZGV2U3RvcmFnZSB9IGZyb20gJy4uL3V0aWxzL2RlZmF1bHRTdGcnO1xuXG5cbmNvbnN0IERFVklORyA9IHByb2Nlc3MuZW52LkRFVl9NT0RFID09ICdzZXJ2ZSdcbi8vIGNvbnN0IHVzZVN0b3JhZ2UgPSBERVZJTkcgPyAobmFtZTogc3RyaW5nLCBpbml0OmFueSkgPT4gdXNlU3RhdGUoZGV2U3RvcmFnZSgpW25hbWVdKSA6IF91c2VTdG9yYWdlXG5cblxuLy8gZnVuY3Rpb24gcmVxU2VhcmNoKHF1ZXJ5OnN0cmluZyl7XG4vLyAgIG1zZ0JHKHt0eXBlOidzZWFyY2gnLCBxdWVyeTpxdWVyeX0pXG4vLyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBTZWFyY2gocHJvcHM6YW55KXtcbiAgY29uc3QgW3R3ZWV0cywgc2V0VHdlZXRzXSA9IHVzZVN0YXRlKFtdKTtcbiAgLy8gY29uc3QgcXVlcnkgPSB1c2VTdHJlYW0ocHJvcHMuY29tcG9zZVF1ZXJ5LCAnJylcbiAgY29uc3QgbXlSZWYgPSB1c2VSZWYobnVsbCk7XG4gIGNvbnN0IF9zZXRUd2VldHMgPSAodDogYW55W10gfCAoKHByZXZTdGF0ZTogYW55W10pID0+IGFueVtdKSk9PntzZXRUd2VldHModCk7fVxuICBcbiAgY29uc3QgW3NlYXJjaFJlc3VsdHMsIHNldFNlYXJjaFJlc3VsdHNdID0gdXNlU3RvcmFnZSgnc2VhcmNoX3Jlc3VsdHMnLFtdKTtcbiAgY29uc3QgW2xhdGVzdFR3ZWV0cywgc2V0TGF0ZXN0VHdlZXRzXSA9IHVzZVN0b3JhZ2UoJ2xhdGVzdF90d2VldHMnLFtdKTtcbiAgXG4gIC8vIGNvbnN0IHNob3dTZWFyY2hSZXMgPSAoc2VhcmNoUmVzdWx0cyk9PiEoaXNFeGlzdChzZWFyY2hSZXN1bHRzKSB8fCBSLmlzRW1wdHkocXVlcnkudHJpbSgpKSlcbiAgY29uc3Qgc2hvd1NlYXJjaFJlcyA9IChzZWFyY2hSZXN1bHRzOmFueVtdKT0+aXNFeGlzdChzZWFyY2hSZXN1bHRzKVxuXG5cbiAgdXNlRWZmZWN0KGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbml0VHdlZXRzIDogYW55ID0gYXdhaXQgZ2V0RGF0YSgnbGF0ZXN0X3R3ZWV0cycpIFxuICAgIHNldFR3ZWV0cyhpc05pbChpbml0VHdlZXRzKSA/IFtdIDogaW5pdFR3ZWV0cylcbiAgICByZXR1cm4gKCk9Pnt9XG4gIH0sIFtdKTtcblxuLy8gLy8gXG4vLyAgIHVzZUVmZmVjdCgoKT0+e1xuLy8gICAgIFIucGlwZShcbi8vICAgICAgIGRlZmF1bHRUbygnJyksXG4vLyAgICAgICAvLyBSLnRyaW0sXG4vLyAgICAgICByZXFTZWFyY2gsXG4vLyAgICAgKShxdWVyeSlcbi8vICAgICByZXR1cm4gKCk9PnsgIH07XG4vLyAgIH0sW3F1ZXJ5XSk7XG5cbiAgdXNlRWZmZWN0KCgpPT57XG4gICAgY29uc29sZS5sb2coe3NlYXJjaFJlc3VsdHN9KVxuICAgIHJldHVybiAoKT0+eyAgfTtcbiAgfSxbc2VhcmNoUmVzdWx0c10pO1xuXG4gIHVzZUVmZmVjdCgoKT0+e1xuICAgIGNvbnNvbGUubG9nKHtsYXRlc3RUd2VldHN9KVxuICAgIHJldHVybiAoKT0+eyAgfTtcbiAgfSxbbGF0ZXN0VHdlZXRzXSk7XG5cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3M9XCJzZWFyY2hXaWRnZXRcIiByZWY9e215UmVmfT5cbiAgICAgIHsvKiA8Q29uc29sZS8+ICovfVxuICAgICAge3Nob3dTZWFyY2hSZXMoc2VhcmNoUmVzdWx0cykgXG4gICAgICA/IDxTZWFyY2hSZXN1bHRzIHJlc3VsdHM9e3NlYXJjaFJlc3VsdHN9IC8+IFxuICAgICAgOiA8U2VhcmNoUmVzdWx0cyByZXN1bHRzPXtsYXRlc3RUd2VldHN9IC8+IH1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZnVuY3Rpb24gcHJlcFJlc3VsdHMobGlzdDogU2VhcmNoUmVzdWx0W10pOiBTZWFyY2hSZXN1bHRbXXtcbiAgY29uc3QgcHJlcHBlZCA9IGRlZmF1bHRUbyhbXSxsaXN0KVxuICBjb25zb2xlLmxvZygncHJlcFJlc3VsdHMnLCB7bGlzdCwgcHJlcHBlZH0pXG4gIHJldHVybiBmaWx0ZXIocGlwZShwcm9wKCd0d2VldCcpLCBpc05pbCwgbm90KSwgcHJlcHBlZClcbn1cblxuZnVuY3Rpb24gU2VhcmNoUmVzdWx0cyhwcm9wczogeyByZXN1bHRzOiBTZWFyY2hSZXN1bHRbXTsgfSl7XG4gIHJldHVybihcbiAgPGRpdiBjbGFzcz1cInNlYXJjaFR3ZWV0c1wiPiBcbiAgICAgICAge2lzRW1wdHkocHJlcFJlc3VsdHMocHJvcHMucmVzdWx0cykpIFxuICAgICAgICA/IFwiTm8gc2VhcmNoIHJlc3VsdHMuXCJcbiAgICAgICAgOiBwcmVwUmVzdWx0cyhwcm9wKCdyZXN1bHRzJywgcHJvcHMpKS5tYXAoKHJlczogU2VhcmNoUmVzdWx0KSA9PiAoXG4gICAgICAgICAgLy8gV2l0aG91dCBhIGtleSwgUHJlYWN0IGhhcyB0byBndWVzcyB3aGljaCB0d2VldHMgaGF2ZVxuICAgICAgICAgIC8vIGNoYW5nZWQgd2hlbiByZS1yZW5kZXJpbmcuXG4gICAgICAgICAgPFR3ZWV0Q2FyZCBrZXk9e3BhdGgoWyd0d2VldCcsICdpZCddKX0gdHdlZXQ9e3Byb3AoJ3R3ZWV0JywgcmVzKX0gc2NvcmU9e3Byb3AoJ3Njb3JlJywgcmVzKX0gLz5cbiAgICAgICAgKSl9XG4gIDwvZGl2Pilcbn1cblxuIl0sInNvdXJjZVJvb3QiOiIifQ==