webpackHotUpdate("content-script",{

/***/ "./src/ts/components/Console.tsx":
/*!***************************************!*\
  !*** ./src/ts/components/Console.tsx ***!
  \***************************************/
/*! exports provided: FilterButton, Console */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__prefresh_utils__, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FilterButton", function() { return FilterButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Console", function() { return Console; });
/* harmony import */ var preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact/jsx-runtime */ "./node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "./node_modules/preact/hooks/dist/hooks.module.js");
/* harmony import */ var _hooks_useStorage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks/useStorage */ "./src/ts/hooks/useStorage.tsx");
/* harmony import */ var ramda__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ramda */ "./node_modules/ramda/es/index.js");
/* harmony import */ var _images_bookmark_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../images/bookmark.svg */ "./src/images/bookmark.svg");
/* harmony import */ var _images_reply_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../images/reply.svg */ "./src/images/reply.svg");
/* harmony import */ var _images_retweet_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../images/retweet.svg */ "./src/images/retweet.svg");
/* harmony import */ var _images_shuffle_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../images/shuffle.svg */ "./src/images/shuffle.svg");
/* harmony import */ var _images_lightning_svg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../images/lightning.svg */ "./src/images/lightning.svg");
/* harmony import */ var _utils_ga__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/ga */ "./src/ts/utils/ga.tsx");



var _s = $RefreshSig$(),
    _s2 = $RefreshSig$();

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



 // Function

 // Object

// Logic, Type, Relation, String, Math






var DEVING = Object({"NODE_ENV":"development"}).DEV_MODE == 'serve';
console.log('Console DEVING', {
  DEVING: DEVING
});
var useOption = DEVING ? _s(function (name) {
  _s();

  return Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useState"])(name);
}, "GTRNsdnKKfbdeG+zDCn86gfjco4=") : _hooks_useStorage__WEBPACK_IMPORTED_MODULE_2__["useOption"];
function FilterButton(props) {
  var Icon = props.Icon; // console.log('FilterButton', {Icon})
  // useEffect(()=>console.log('FilterButton', {props, Icon}), []);

  return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("span", {
    "class": props.name,
    children: [Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("input", {
      id: props.name,
      name: props.name,
      "class": "filter-checkbox",
      type: "checkbox",
      checked: props.useFilter,
      onChange: function onChange(event) {
        return handleInputChange(props.setFilter, event);
      }
    }), Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("label", {
      "for": props.name,
      children: [Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(Icon, {
        "class": "filter-icon hoverHighlight",
        onClick: function onClick(_) {
          return _;
        }
      }), " "]
    })]
  });
} // 

_c = FilterButton;
function Console() {
  _s2();

  // const [text, setText] = useState('[console text]');
  var _useState = Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useState"])('[console text]'),
      _useState2 = _slicedToArray(_useState, 2),
      text = _useState2[0],
      setText = _useState2[1]; // TODO make these generate themselves


  var _useOption2 = useOption('getRTs'),
      _useOption3 = _slicedToArray(_useOption2, 2),
      getRTs = _useOption3[0],
      setGetRTs = _useOption3[1];

  var _useOption4 = useOption('useBookmarks'),
      _useOption5 = _slicedToArray(_useOption4, 2),
      useBookmarks = _useOption5[0],
      setUseBookmarks = _useOption5[1];

  var _useOption6 = useOption('useReplies'),
      _useOption7 = _slicedToArray(_useOption6, 2),
      useReplies = _useOption7[0],
      setUseReplies = _useOption7[1];

  var _useOption8 = useOption('idleMode'),
      _useOption9 = _slicedToArray(_useOption8, 2),
      idleMode = _useOption9[0],
      setIdleMode = _useOption9[1];

  var _useOption10 = useOption('searchMode'),
      _useOption11 = _slicedToArray(_useOption10, 2),
      searchMode = _useOption11[0],
      setSearchMode = _useOption11[1];

  var idle2Bool = function idle2Bool(idleMode) {
    return idleMode === 'random' ? true : false;
  }; // String -> Bool


  var bool2Idle = function bool2Idle(val) {
    return val ? 'random' : 'timeline';
  }; // Bool -> String


  var searchMode2Bool = function searchMode2Bool(idleMode) {
    return idleMode === 'semantic' ? true : false;
  }; // String -> Bool


  var bool2SearchMode = function bool2SearchMode(val) {
    return val ? 'semantic' : 'fulltext';
  }; // Bool -> String


  return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("div", {
    "class": "console",
    children: Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("div", {
      id: "filters",
      children: [Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(FilterButton, {
        name: "useShuffle",
        useFilter: idle2Bool(idleMode),
        setFilter: Object(ramda__WEBPACK_IMPORTED_MODULE_3__["pipe"])(bool2Idle, setIdleMode),
        Icon: _images_shuffle_svg__WEBPACK_IMPORTED_MODULE_7__["default"]
      }), Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(FilterButton, {
        name: "searchMode",
        useFilter: searchMode2Bool(searchMode),
        setFilter: Object(ramda__WEBPACK_IMPORTED_MODULE_3__["pipe"])(bool2SearchMode, setSearchMode),
        Icon: _images_lightning_svg__WEBPACK_IMPORTED_MODULE_8__["default"]
      }), Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("span", {}), Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(FilterButton, {
        name: "getRTs",
        useFilter: getRTs,
        setFilter: setGetRTs,
        Icon: _images_retweet_svg__WEBPACK_IMPORTED_MODULE_6__["default"]
      }), Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(FilterButton, {
        name: "useBookmarks",
        useFilter: useBookmarks,
        setFilter: setUseBookmarks,
        Icon: _images_bookmark_svg__WEBPACK_IMPORTED_MODULE_4__["default"]
      }), Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(FilterButton, {
        name: "useReplies",
        useFilter: useReplies,
        setFilter: setUseReplies,
        Icon: _images_reply_svg__WEBPACK_IMPORTED_MODULE_5__["default"]
      })]
    })
  });
}

_s2(Console, "JXkbGSvm8NBkIntI3kzXJuFH2oQ=", false, function () {
  return [useOption, useOption, useOption, useOption, useOption];
});

_c2 = Console;

var getTargetVal = function getTargetVal(target) {
  return target.type === 'checkbox' ? target.checked : target.value;
};

var handleInputChange = Object(ramda__WEBPACK_IMPORTED_MODULE_3__["curry"])(function (_set, event) {
  Object(_utils_ga__WEBPACK_IMPORTED_MODULE_9__["csEvent"])('User', "Toggled filter ".concat(event.target.id, " to ").concat(getTargetVal(event.target)), event.target.id, getTargetVal(event.target) ? 1 : 0);
  Object(ramda__WEBPACK_IMPORTED_MODULE_3__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["prop"])('target'), getTargetVal, _set)(event);
});

var _c, _c2;

$RefreshReg$(_c, "FilterButton");
$RefreshReg$(_c2, "Console");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9Db25zb2xlLnRzeCJdLCJuYW1lcyI6WyJERVZJTkciLCJwcm9jZXNzIiwiREVWX01PREUiLCJjb25zb2xlIiwibG9nIiwidXNlT3B0aW9uIiwibmFtZSIsInVzZVN0YXRlIiwiX3VzZU9wdGlvbiIsIkZpbHRlckJ1dHRvbiIsInByb3BzIiwiSWNvbiIsInVzZUZpbHRlciIsImV2ZW50IiwiaGFuZGxlSW5wdXRDaGFuZ2UiLCJzZXRGaWx0ZXIiLCJfIiwiQ29uc29sZSIsInRleHQiLCJzZXRUZXh0IiwiZ2V0UlRzIiwic2V0R2V0UlRzIiwidXNlQm9va21hcmtzIiwic2V0VXNlQm9va21hcmtzIiwidXNlUmVwbGllcyIsInNldFVzZVJlcGxpZXMiLCJpZGxlTW9kZSIsInNldElkbGVNb2RlIiwic2VhcmNoTW9kZSIsInNldFNlYXJjaE1vZGUiLCJpZGxlMkJvb2wiLCJib29sMklkbGUiLCJ2YWwiLCJzZWFyY2hNb2RlMkJvb2wiLCJib29sMlNlYXJjaE1vZGUiLCJwaXBlIiwiU2h1ZmZsZUljb24iLCJMaWdodG5pbmdJY29uIiwiUmV0d2VldEljb24iLCJCb29rbWFya0ljb24iLCJSZXBseUljb24iLCJnZXRUYXJnZXRWYWwiLCJ0YXJnZXQiLCJ0eXBlIiwiY2hlY2tlZCIsInZhbHVlIiwiY3VycnkiLCJfc2V0IiwiY3NFdmVudCIsImlkIiwicHJvcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUNBO0NBQzJGOztDQUNnRzs7QUFFckI7QUFFdEs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsTUFBTSxHQUFHQyxrQ0FBQSxDQUFZQyxRQUFaLElBQXdCLE9BQXZDO0FBQ0FDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGdCQUFaLEVBQThCO0FBQUNKLFFBQU0sRUFBTkE7QUFBRCxDQUE5QjtBQUNBLElBQU1LLFNBQVMsR0FB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SyxDQUFDNkIsTUFBTixDQUFhTyxFQUF4QyxpQkFBaURSLFlBQVksQ0FBQzVCLEtBQUssQ0FBQzZCLE1BQVAsQ0FBN0QsR0FBK0U3QixLQUFLLENBQUM2QixNQUFOLENBQWFPLEVBQTVGLEVBQWdHUixZQUFZLENBQUM1QixLQUFLLENBQUM2QixNQUFQLENBQVosR0FBNkIsQ0FBN0IsR0FBaUMsQ0FBakksQ0FBUDtBQUNBUCxvREFBSSxDQUFDZSxrREFBSSxDQUFDLFFBQUQsQ0FBTCxFQUFpQlQsWUFBakIsRUFBK0JNLElBQS9CLENBQUosQ0FBeUNsQyxLQUF6QztBQUNELENBSDhCLENBQS9CIiwiZmlsZSI6ImNvbnRlbnQtc2NyaXB0LjEyOTA3ODNkMjhlZDI3ZGVkNWM2LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoLCByZW5kZXIsIENvbXBvbmVudCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VDb250ZXh0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHVzZU9wdGlvbiBhcyBfdXNlT3B0aW9uIH0gZnJvbSAnLi4vaG9va3MvdXNlU3RvcmFnZSc7XG5pbXBvcnQgeyBfXywgY3VycnksIHBpcGUsIGFuZFRoZW4sIG1hcCwgZmlsdGVyLCByZWR1Y2UsIHRhcCwgYXBwbHksIHRyeUNhdGNofSBmcm9tICdyYW1kYScgLy8gRnVuY3Rpb25cbmltcG9ydCB7IHByb3AsIHByb3BFcSwgcHJvcFNhdGlzZmllcywgcGF0aCwgcGF0aEVxLCBoYXNQYXRoLCBhc3NvYywgYXNzb2NQYXRoLCB2YWx1ZXMsIG1lcmdlTGVmdCwgbWVyZ2VEZWVwTGVmdCwga2V5cywgbGVucywgbGVuc1Byb3AsIGxlbnNQYXRoLCBwaWNrLCBwcm9qZWN0LCBzZXQsIGxlbmd0aCB9IGZyb20gJ3JhbWRhJyAvLyBPYmplY3RcbmltcG9ydCB7IGhlYWQsIHRhaWwsIHRha2UsIGlzRW1wdHksIGFueSwgYWxsLCAgaW5jbHVkZXMsIGxhc3QsIGRyb3BXaGlsZSwgZHJvcExhc3RXaGlsZSwgZGlmZmVyZW5jZSwgYXBwZW5kLCBmcm9tUGFpcnMsIGZvckVhY2gsIG50aCwgcGx1Y2ssIHJldmVyc2UsIHVuaXEsIHNsaWNlfSBmcm9tICdyYW1kYScgLy8gTGlzdFxuaW1wb3J0IHsgZXF1YWxzLCBpZkVsc2UsIHdoZW4sIGJvdGgsIGVpdGhlciwgaXNOaWwsIGlzLCBkZWZhdWx0VG8sIGFuZCwgb3IsIG5vdCwgVCwgRiwgZ3QsIGx0LCBndGUsIGx0ZSwgbWF4LCBtaW4sIHNvcnQsIHNvcnRCeSwgc3BsaXQsIHRyaW0sIG11bHRpcGx5IH0gZnJvbSAncmFtZGEnIC8vIExvZ2ljLCBUeXBlLCBSZWxhdGlvbiwgU3RyaW5nLCBNYXRoXG5cbmltcG9ydCBCb29rbWFya0ljb24gZnJvbSAnLi4vLi4vaW1hZ2VzL2Jvb2ttYXJrLnN2Zyc7XG5pbXBvcnQgUmVwbHlJY29uIGZyb20gJy4uLy4uL2ltYWdlcy9yZXBseS5zdmcnO1xuaW1wb3J0IFJldHdlZXRJY29uIGZyb20gJy4uLy4uL2ltYWdlcy9yZXR3ZWV0LnN2Zyc7XG5pbXBvcnQgU2h1ZmZsZUljb24gZnJvbSAnLi4vLi4vaW1hZ2VzL3NodWZmbGUuc3ZnJztcbmltcG9ydCBMaWdodG5pbmdJY29uIGZyb20gJy4uLy4uL2ltYWdlcy9saWdodG5pbmcuc3ZnJztcbmltcG9ydCB7IGluaXRHQSwgY3NFdmVudCwgUGFnZVZpZXcsIFVBX0NPREUgfSBmcm9tICcuLi91dGlscy9nYSdcblxuY29uc3QgREVWSU5HID0gcHJvY2Vzcy5lbnYuREVWX01PREUgPT0gJ3NlcnZlJ1xuY29uc29sZS5sb2coJ0NvbnNvbGUgREVWSU5HJywge0RFVklOR30pXG5jb25zdCB1c2VPcHRpb24gPSBERVZJTkcgPyAobmFtZTogc3RyaW5nKSA9PiB1c2VTdGF0ZShuYW1lKSA6IF91c2VPcHRpb25cblxuXG5leHBvcnQgZnVuY3Rpb24gRmlsdGVyQnV0dG9uKHByb3BzOiB7IEljb246IGFueTsgbmFtZTogc3RyaW5nOyB1c2VGaWx0ZXI6IGJvb2xlYW47IHNldEZpbHRlcjogYW55OyB9KXtcbiAgY29uc3QgSWNvbiA9IHByb3BzLkljb25cbiAgLy8gY29uc29sZS5sb2coJ0ZpbHRlckJ1dHRvbicsIHtJY29ufSlcbiAgLy8gdXNlRWZmZWN0KCgpPT5jb25zb2xlLmxvZygnRmlsdGVyQnV0dG9uJywge3Byb3BzLCBJY29ufSksIFtdKTtcbiAgcmV0dXJuIChcbiAgICA8c3BhbiBjbGFzcz17cHJvcHMubmFtZX0+IFxuICAgICAgICA8aW5wdXQgaWQ9e3Byb3BzLm5hbWV9IG5hbWU9e3Byb3BzLm5hbWV9IGNsYXNzPSdmaWx0ZXItY2hlY2tib3gnIHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3Byb3BzLnVzZUZpbHRlcn0gb25DaGFuZ2U9eyhldmVudCk9PmhhbmRsZUlucHV0Q2hhbmdlKHByb3BzLnNldEZpbHRlciwgZXZlbnQpfT48L2lucHV0PiBcbiAgICAgICAgPGxhYmVsIGZvcj17cHJvcHMubmFtZX0gPjwgSWNvbiBjbGFzcz0nZmlsdGVyLWljb24gaG92ZXJIaWdobGlnaHQnIG9uQ2xpY2s9e18gPT4gX30gLz4gPC9sYWJlbD5cbiAgICAgICAgey8qIDxsYWJlbCBmb3I9e3Byb3BzLm5hbWV9ID48IFJldHdlZXRJY29uIGNsYXNzPSdmaWx0ZXItaWNvbicgb25DbGljaz17XyA9PiBffSAvPiA8L2xhYmVsPiAqL31cbiAgICAgICAgXG4gICAgPC9zcGFuPlxuICApXG59XG4vLyBcbmV4cG9ydCBmdW5jdGlvbiBDb25zb2xlKCl7XG4gIC8vIGNvbnN0IFt0ZXh0LCBzZXRUZXh0XSA9IHVzZVN0YXRlKCdbY29uc29sZSB0ZXh0XScpO1xuICBjb25zdCBbdGV4dCwgc2V0VGV4dF0gPSB1c2VTdGF0ZSgnW2NvbnNvbGUgdGV4dF0nKTtcbiAgLy8gVE9ETyBtYWtlIHRoZXNlIGdlbmVyYXRlIHRoZW1zZWx2ZXNcbiAgY29uc3QgW2dldFJUcywgc2V0R2V0UlRzXSA9IHVzZU9wdGlvbignZ2V0UlRzJylcbiAgY29uc3QgW3VzZUJvb2ttYXJrcywgc2V0VXNlQm9va21hcmtzXSA9IHVzZU9wdGlvbigndXNlQm9va21hcmtzJylcbiAgY29uc3QgW3VzZVJlcGxpZXMsIHNldFVzZVJlcGxpZXNdID0gdXNlT3B0aW9uKCd1c2VSZXBsaWVzJylcbiAgY29uc3QgW2lkbGVNb2RlLCBzZXRJZGxlTW9kZV0gPSB1c2VPcHRpb24oJ2lkbGVNb2RlJylcbiAgY29uc3QgW3NlYXJjaE1vZGUsIHNldFNlYXJjaE1vZGVdID0gdXNlT3B0aW9uKCdzZWFyY2hNb2RlJylcbiAgXG4gIGNvbnN0IGlkbGUyQm9vbCA9IChpZGxlTW9kZTogc3RyaW5nKSA9PiBpZGxlTW9kZSA9PT0gJ3JhbmRvbScgPyB0cnVlIDogZmFsc2UgLy8gU3RyaW5nIC0+IEJvb2xcbiAgY29uc3QgYm9vbDJJZGxlID0gdmFsID0+IHZhbCA/ICdyYW5kb20nIDogJ3RpbWVsaW5lJyAvLyBCb29sIC0+IFN0cmluZ1xuXG4gIGNvbnN0IHNlYXJjaE1vZGUyQm9vbCA9IChpZGxlTW9kZTogc3RyaW5nKSA9PiBpZGxlTW9kZSA9PT0gJ3NlbWFudGljJyA/IHRydWUgOiBmYWxzZSAvLyBTdHJpbmcgLT4gQm9vbFxuICBjb25zdCBib29sMlNlYXJjaE1vZGUgPSB2YWwgPT4gdmFsID8gJ3NlbWFudGljJyA6ICdmdWxsdGV4dCcgLy8gQm9vbCAtPiBTdHJpbmdcblxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzcz1cImNvbnNvbGVcIj5cbiAgICAgIDxkaXYgaWQ9J2ZpbHRlcnMnPlxuICAgICAgICA8IEZpbHRlckJ1dHRvbiBuYW1lPXtcInVzZVNodWZmbGVcIn0gdXNlRmlsdGVyPXtpZGxlMkJvb2woaWRsZU1vZGUpfSBzZXRGaWx0ZXI9e3BpcGUoYm9vbDJJZGxlLCBzZXRJZGxlTW9kZSl9IEljb249e1NodWZmbGVJY29ufS8+XG4gICAgICAgIDwgRmlsdGVyQnV0dG9uIG5hbWU9e1wic2VhcmNoTW9kZVwifSB1c2VGaWx0ZXI9e3NlYXJjaE1vZGUyQm9vbChzZWFyY2hNb2RlKX0gc2V0RmlsdGVyPXtwaXBlKGJvb2wyU2VhcmNoTW9kZSwgc2V0U2VhcmNoTW9kZSl9IEljb249e0xpZ2h0bmluZ0ljb259Lz5cbiAgICAgICAgPHNwYW4+PC9zcGFuPlxuICAgICAgICA8IEZpbHRlckJ1dHRvbiBuYW1lPXtcImdldFJUc1wifSB1c2VGaWx0ZXI9e2dldFJUc30gc2V0RmlsdGVyPXtzZXRHZXRSVHN9IEljb249e1JldHdlZXRJY29ufS8+XG4gICAgICAgIDwgRmlsdGVyQnV0dG9uIG5hbWU9e1widXNlQm9va21hcmtzXCJ9IHVzZUZpbHRlcj17dXNlQm9va21hcmtzfSBzZXRGaWx0ZXI9e3NldFVzZUJvb2ttYXJrc30gSWNvbj17Qm9va21hcmtJY29ufS8+XG4gICAgICAgIDwgRmlsdGVyQnV0dG9uIG5hbWU9e1widXNlUmVwbGllc1wifSB1c2VGaWx0ZXI9e3VzZVJlcGxpZXN9IHNldEZpbHRlcj17c2V0VXNlUmVwbGllc30gSWNvbj17UmVwbHlJY29ufS8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj4gXG4gICk7XG59XG5cbmNvbnN0IGdldFRhcmdldFZhbCA9ICh0YXJnZXQ6IHsgdHlwZTogc3RyaW5nOyBjaGVja2VkOiBhbnk7IHZhbHVlOiBhbnk7IH0pPT4odGFyZ2V0LnR5cGUgPT09ICdjaGVja2JveCcgPyB0YXJnZXQuY2hlY2tlZCA6IHRhcmdldC52YWx1ZSlcbmNvbnN0IGhhbmRsZUlucHV0Q2hhbmdlID0gY3VycnkoKF9zZXQ6ICh4OiBhbnkpID0+IHVua25vd24sIGV2ZW50KSA9PiB7XG4gIGNzRXZlbnQoJ1VzZXInLCBgVG9nZ2xlZCBmaWx0ZXIgJHtldmVudC50YXJnZXQuaWR9IHRvICR7Z2V0VGFyZ2V0VmFsKGV2ZW50LnRhcmdldCl9YCwgZXZlbnQudGFyZ2V0LmlkLCBnZXRUYXJnZXRWYWwoZXZlbnQudGFyZ2V0KSA/IDEgOiAwLCk7XG4gIHBpcGUocHJvcCgndGFyZ2V0JyksIGdldFRhcmdldFZhbCwgX3NldCkoZXZlbnQpXG59KVxuIl0sInNvdXJjZVJvb3QiOiIifQ==