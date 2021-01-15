webpackHotUpdate("content-script",{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9TZWFyY2gudHN4Il0sIm5hbWVzIjpbIkRFVklORyIsInByb2Nlc3MiLCJTZWFyY2giLCJwcm9wcyIsInVzZVN0YXRlIiwidHdlZXRzIiwic2V0VHdlZXRzIiwibXlSZWYiLCJ1c2VSZWYiLCJfc2V0VHdlZXRzIiwidCIsInVzZVN0b3JhZ2UiLCJzZWFyY2hSZXN1bHRzIiwic2V0U2VhcmNoUmVzdWx0cyIsImxhdGVzdFR3ZWV0cyIsInNldExhdGVzdFR3ZWV0cyIsInNob3dTZWFyY2hSZXMiLCJpc0V4aXN0IiwidXNlRWZmZWN0IiwiZ2V0RGF0YSIsImluaXRUd2VldHMiLCJpc05pbCIsImNvbnNvbGUiLCJsb2ciLCJwcmVwUmVzdWx0cyIsImxpc3QiLCJwcmVwcGVkIiwiZGVmYXVsdFRvIiwiZmlsdGVyIiwicGlwZSIsInByb3AiLCJub3QiLCJTZWFyY2hSZXN1bHRzIiwiaXNFbXB0eSIsInJlc3VsdHMiLCJtYXAiLCJyZXMiLCJwYXRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBQzJCLEcsQ0FDM0I7O0NBQzJGOztDQUNnRzs7Q0FDWDs7Q0FDVjs7QUFPdEssSUFBTUEsTUFBTSxHQUFHQyxPQUFBLElBQXdCLE9BQXZDLEMsQ0FDQTtBQUdBO0FBQ0E7QUFDQTs7QUFFTyxTQUFTQyxNQUFULENBQWdCQyxLQUFoQixFQUEwQjtBQUFBOztBQUFBLGtCQUNIQyw2REFBUSxDQUFDLEVBQUQsQ0FETDtBQUFBO0FBQUEsTUFDeEJDLE1BRHdCO0FBQUEsTUFDaEJDLFNBRGdCLGtCQUUvQjs7O0FBQ0EsTUFBTUMsS0FBSyxHQUFHQywyREFBTSxDQUFDLElBQUQsQ0FBcEI7O0FBQ0EsTUFBTUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBQ0MsQ0FBRCxFQUE0QztBQUFDSixhQUFTLENBQUNJLENBQUQsQ0FBVDtBQUFjLEdB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aWxlIjoiY29udGVudC1zY3JpcHQuYzEzN2QyNGQ1YzJkMmRkMmJlZGIuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiAgaW1wb3J0IHsgaCwgcmVuZGVyLCBDb21wb25lbnQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZVJlZiwgdXNlRWZmZWN0LCB1c2VDb250ZXh0LCB1c2VDYWxsYmFjayB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBnZXREYXRhLCBzZXRTdGcsIG1zZ0JHLCBtYWtlT25TdG9yYWdlQ2hhbmdlZCB9IGZyb20gJy4uL3V0aWxzL2R1dGlscyc7XG5pbXBvcnQgeyBDb25zb2xlIH0gZnJvbSAnLi9Db25zb2xlJztcbmltcG9ydCB7IFR3ZWV0IGFzIFR3ZWV0Q2FyZCB9IGZyb20gJy4vVHdlZXQnO1xuaW1wb3J0IHsgdXNlU3RvcmFnZSBhcyBfdXNlU3RvcmFnZSB9IGZyb20gJy4uL2hvb2tzL3VzZVN0b3JhZ2UnO1xuaW1wb3J0IHsgdXNlU3RyZWFtIH0gZnJvbSAnLi4vaG9va3MvdXNlU3RyZWFtJztcbmltcG9ydCB7IGZsYXR0ZW5Nb2R1bGUsIGlzRXhpc3QsIGluc3BlY3QgfSBmcm9tICcuLi91dGlscy9wdXRpbHMnXG5pbXBvcnQgKiBhcyBSIGZyb20gJ3JhbWRhJztgYFxuLy8gZmxhdHRlbk1vZHVsZShnbG9iYWwsUilcbmltcG9ydCB7IF9fLCBjdXJyeSwgcGlwZSwgYW5kVGhlbiwgbWFwLCBmaWx0ZXIsIHJlZHVjZSwgdGFwLCBhcHBseSwgdHJ5Q2F0Y2h9IGZyb20gJ3JhbWRhJyAvLyBGdW5jdGlvblxuaW1wb3J0IHsgcHJvcCwgcHJvcEVxLCBwcm9wU2F0aXNmaWVzLCBwYXRoLCBwYXRoRXEsIGhhc1BhdGgsIGFzc29jLCBhc3NvY1BhdGgsIHZhbHVlcywgbWVyZ2VMZWZ0LCBtZXJnZURlZXBMZWZ0LCBrZXlzLCBsZW5zLCBsZW5zUHJvcCwgbGVuc1BhdGgsIHBpY2ssIHByb2plY3QsIHNldCwgbGVuZ3RoIH0gZnJvbSAncmFtZGEnIC8vIE9iamVjdFxuaW1wb3J0IHsgaGVhZCwgdGFpbCwgdGFrZSwgaXNFbXB0eSwgYW55LCBhbGwsICBpbmNsdWRlcywgbGFzdCwgZHJvcFdoaWxlLCBkcm9wTGFzdFdoaWxlLCBkaWZmZXJlbmNlLCBhcHBlbmQsIGZyb21QYWlycywgZm9yRWFjaCwgbnRoLCBwbHVjaywgcmV2ZXJzZSwgdW5pcSwgc2xpY2V9IGZyb20gJ3JhbWRhJyAvLyBMaXN0XG5pbXBvcnQgeyBlcXVhbHMsIGlmRWxzZSwgd2hlbiwgYm90aCwgZWl0aGVyLCBpc05pbCwgaXMsIGRlZmF1bHRUbywgYW5kLCBvciwgbm90LCBULCBGLCBndCwgbHQsIGd0ZSwgbHRlLCBtYXgsIG1pbiwgc29ydCwgc29ydEJ5LCBzcGxpdCwgdHJpbSwgbXVsdGlwbHkgfSBmcm9tICdyYW1kYScgLy8gTG9naWMsIFR5cGUsIFJlbGF0aW9uLCBTdHJpbmcsIE1hdGhcbmltcG9ydCB7IFN0YXR1cyBhcyBUd2VldCB9IGZyb20gJ3R3aXR0ZXItZCc7XG5pbXBvcnQgeyB0aFR3ZWV0IH0gZnJvbSAnLi4vdHlwZXMvdHdlZXRUeXBlcyc7XG5pbXBvcnQgeyBTZWFyY2hSZXN1bHQgfSBmcm9tICcuLi90eXBlcy9tc2dUeXBlcyc7XG5pbXBvcnQgeyBkZWZhdWx0T3B0aW9ucywgZGVmYXVsdFN0b3JhZ2UgYXMgZGVmYXVsdFN0b3JhZ2UsIGRldlN0b3JhZ2UgfSBmcm9tICcuLi91dGlscy9kZWZhdWx0U3RnJztcblxuXG5jb25zdCBERVZJTkcgPSBwcm9jZXNzLmVudi5ERVZfTU9ERSA9PSAnc2VydmUnXG4vLyBjb25zdCB1c2VTdG9yYWdlID0gREVWSU5HID8gKG5hbWU6IHN0cmluZywgaW5pdDphbnkpID0+IHVzZVN0YXRlKGRldlN0b3JhZ2UoKVtuYW1lXSkgOiBfdXNlU3RvcmFnZVxuXG5cbi8vIGZ1bmN0aW9uIHJlcVNlYXJjaChxdWVyeTpzdHJpbmcpe1xuLy8gICBtc2dCRyh7dHlwZTonc2VhcmNoJywgcXVlcnk6cXVlcnl9KVxuLy8gfVxuXG5leHBvcnQgZnVuY3Rpb24gU2VhcmNoKHByb3BzOmFueSl7XG4gIGNvbnN0IFt0d2VldHMsIHNldFR3ZWV0c10gPSB1c2VTdGF0ZShbXSk7XG4gIC8vIGNvbnN0IHF1ZXJ5ID0gdXNlU3RyZWFtKHByb3BzLmNvbXBvc2VRdWVyeSwgJycpXG4gIGNvbnN0IG15UmVmID0gdXNlUmVmKG51bGwpO1xuICBjb25zdCBfc2V0VHdlZXRzID0gKHQ6IGFueVtdIHwgKChwcmV2U3RhdGU6IGFueVtdKSA9PiBhbnlbXSkpPT57c2V0VHdlZXRzKHQpO31cbiAgXG4gIGNvbnN0IFtzZWFyY2hSZXN1bHRzLCBzZXRTZWFyY2hSZXN1bHRzXSA9IHVzZVN0b3JhZ2UoJ3NlYXJjaF9yZXN1bHRzJyxbXSk7XG4gIGNvbnN0IFtsYXRlc3RUd2VldHMsIHNldExhdGVzdFR3ZWV0c10gPSB1c2VTdG9yYWdlKCdsYXRlc3RfdHdlZXRzJyxbXSk7XG4gIFxuICAvLyBjb25zdCBzaG93U2VhcmNoUmVzID0gKHNlYXJjaFJlc3VsdHMpPT4hKGlzRXhpc3Qoc2VhcmNoUmVzdWx0cykgfHwgUi5pc0VtcHR5KHF1ZXJ5LnRyaW0oKSkpXG4gIGNvbnN0IHNob3dTZWFyY2hSZXMgPSAoc2VhcmNoUmVzdWx0czphbnlbXSk9PmlzRXhpc3Qoc2VhcmNoUmVzdWx0cylcblxuXG4gIHVzZUVmZmVjdChhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5pdFR3ZWV0cyA6IGFueSA9IGF3YWl0IGdldERhdGEoJ2xhdGVzdF90d2VldHMnKSBcbiAgICBzZXRUd2VldHMoaXNOaWwoaW5pdFR3ZWV0cykgPyBbXSA6IGluaXRUd2VldHMpXG4gICAgcmV0dXJuICgpPT57fVxuICB9LCBbXSk7XG5cbi8vIC8vIFxuLy8gICB1c2VFZmZlY3QoKCk9Pntcbi8vICAgICBSLnBpcGUoXG4vLyAgICAgICBkZWZhdWx0VG8oJycpLFxuLy8gICAgICAgLy8gUi50cmltLFxuLy8gICAgICAgcmVxU2VhcmNoLFxuLy8gICAgICkocXVlcnkpXG4vLyAgICAgcmV0dXJuICgpPT57ICB9O1xuLy8gICB9LFtxdWVyeV0pO1xuXG4gIHVzZUVmZmVjdCgoKT0+e1xuICAgIGNvbnNvbGUubG9nKHtzZWFyY2hSZXN1bHRzfSlcbiAgICByZXR1cm4gKCk9PnsgIH07XG4gIH0sW3NlYXJjaFJlc3VsdHNdKTtcblxuICB1c2VFZmZlY3QoKCk9PntcbiAgICBjb25zb2xlLmxvZyh7bGF0ZXN0VHdlZXRzfSlcbiAgICByZXR1cm4gKCk9PnsgIH07XG4gIH0sW2xhdGVzdFR3ZWV0c10pO1xuXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzPVwic2VhcmNoV2lkZ2V0XCIgcmVmPXtteVJlZn0+XG4gICAgICB7LyogPENvbnNvbGUvPiAqL31cbiAgICAgIHtzaG93U2VhcmNoUmVzKHNlYXJjaFJlc3VsdHMpIFxuICAgICAgPyA8U2VhcmNoUmVzdWx0cyByZXN1bHRzPXtzZWFyY2hSZXN1bHRzfSAvPiBcbiAgICAgIDogPFNlYXJjaFJlc3VsdHMgcmVzdWx0cz17bGF0ZXN0VHdlZXRzfSAvPiB9XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmZ1bmN0aW9uIHByZXBSZXN1bHRzKGxpc3Q6IFNlYXJjaFJlc3VsdFtdKTogU2VhcmNoUmVzdWx0W117XG4gIGNvbnN0IHByZXBwZWQgPSBkZWZhdWx0VG8oW10sbGlzdClcbiAgY29uc29sZS5sb2coJ3ByZXBSZXN1bHRzJywge2xpc3QsIHByZXBwZWR9KVxuICByZXR1cm4gZmlsdGVyKHBpcGUocHJvcCgndHdlZXQnKSwgaXNOaWwsIG5vdCksIHByZXBwZWQpXG59XG5cbmZ1bmN0aW9uIFNlYXJjaFJlc3VsdHMocHJvcHM6IHsgcmVzdWx0czogU2VhcmNoUmVzdWx0W107IH0pe1xuICByZXR1cm4oXG4gIDxkaXYgY2xhc3M9XCJzZWFyY2hUd2VldHNcIj4gXG4gICAgICAgIHtpc0VtcHR5KHByZXBSZXN1bHRzKHByb3BzLnJlc3VsdHMpKSBcbiAgICAgICAgPyBcIk5vIHNlYXJjaCByZXN1bHRzLlwiXG4gICAgICAgIDogcHJlcFJlc3VsdHMocHJvcCgncmVzdWx0cycsIHByb3BzKSkubWFwKChyZXM6IFNlYXJjaFJlc3VsdCkgPT4gKFxuICAgICAgICAgIC8vIFdpdGhvdXQgYSBrZXksIFByZWFjdCBoYXMgdG8gZ3Vlc3Mgd2hpY2ggdHdlZXRzIGhhdmVcbiAgICAgICAgICAvLyBjaGFuZ2VkIHdoZW4gcmUtcmVuZGVyaW5nLlxuICAgICAgICAgIDxUd2VldENhcmQga2V5PXtwYXRoKFsndHdlZXQnLCAnaWQnXSl9IHR3ZWV0PXtwcm9wKCd0d2VldCcsIHJlcyl9IHNjb3JlPXtwcm9wKCdzY29yZScsIHJlcyl9IC8+XG4gICAgICAgICkpfVxuICA8L2Rpdj4pXG59XG5cbiJdLCJzb3VyY2VSb290IjoiIn0=