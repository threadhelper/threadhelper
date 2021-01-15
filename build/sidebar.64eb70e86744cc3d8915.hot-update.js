webpackHotUpdate("sidebar",{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9Db25zb2xlLnRzeCJdLCJuYW1lcyI6WyJERVZJTkciLCJwcm9jZXNzIiwiREVWX01PREUiLCJ1c2VPcHRpb24iLCJuYW1lIiwidXNlU3RhdGUiLCJfdXNlT3B0aW9uIiwiRmlsdGVyQnV0dG9uIiwicHJvcHMiLCJJY29uIiwidXNlRmlsdGVyIiwiZXZlbnQiLCJoYW5kbGVJbnB1dENoYW5nZSIsInNldEZpbHRlciIsIl8iLCJDb25zb2xlIiwidGV4dCIsInNldFRleHQiLCJnZXRSVHMiLCJzZXRHZXRSVHMiLCJ1c2VCb29rbWFya3MiLCJzZXRVc2VCb29rbWFya3MiLCJ1c2VSZXBsaWVzIiwic2V0VXNlUmVwbGllcyIsImlkbGVNb2RlIiwic2V0SWRsZU1vZGUiLCJzZWFyY2hNb2RlIiwic2V0U2VhcmNoTW9kZSIsImlkbGUyQm9vbCIsImJvb2wySWRsZSIsInZhbCIsInNlYXJjaE1vZGUyQm9vbCIsImJvb2wyU2VhcmNoTW9kZSIsInBpcGUiLCJTaHVmZmxlSWNvbiIsIkxpZ2h0bmluZ0ljb24iLCJSZXR3ZWV0SWNvbiIsIkJvb2ttYXJrSWNvbiIsIlJlcGx5SWNvbiIsImdldFRhcmdldFZhbCIsInRhcmdldCIsInR5cGUiLCJjaGVja2VkIiwidmFsdWUiLCJjdXJyeSIsIl9zZXQiLCJjc0V2ZW50IiwiaWQiLCJwcm9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7Q0FDMkY7O0NBQ2dHOztBQUVyQjtBQUV0SztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxNQUFNLEdBQUdDLGtDQUFBLENBQVlDLFFBQVosSUFBd0IsT0FBdkM7QUFDQSxJQUFNQyxTQUFTLEdBQUdILE1BQU0sTUFBRyxVQUFDSSxJQUFEO0FBQUE7O0FBQUEsU0FBa0JDLDZEQUFRLENBQUNELElBQUQsQ0FBMUI7QUFBQSxDQUFILG9DQUFzQ0Us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QUFDNkIsTUFBTixDQUFhTyxFQUE1RixFQUFnR1IsWUFBWSxDQUFDNUIsS0FBSyxDQUFDNkIsTUFBUCxDQUFaLEdBQTZCLENBQTdCLEdBQWlDLENBQWpJLENBQVA7QUFDQVAsb0RBQUksQ0FBQ2Usa0RBQUksQ0FBQyxRQUFELENBQUwsRUFBaUJULFlBQWpCLEVBQStCTSxJQUEvQixDQUFKLENBQXlDbEMsS0FBekM7QUFDRCxDQUg4QixDQUEvQiIsImZpbGUiOiJzaWRlYmFyLjY0ZWI3MGU4Njc0NGNjM2Q4OTE1LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoLCByZW5kZXIsIENvbXBvbmVudCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VDb250ZXh0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHVzZU9wdGlvbiBhcyBfdXNlT3B0aW9uIH0gZnJvbSAnLi4vaG9va3MvdXNlU3RvcmFnZSc7XG5pbXBvcnQgeyBfXywgY3VycnksIHBpcGUsIGFuZFRoZW4sIG1hcCwgZmlsdGVyLCByZWR1Y2UsIHRhcCwgYXBwbHksIHRyeUNhdGNofSBmcm9tICdyYW1kYScgLy8gRnVuY3Rpb25cbmltcG9ydCB7IHByb3AsIHByb3BFcSwgcHJvcFNhdGlzZmllcywgcGF0aCwgcGF0aEVxLCBoYXNQYXRoLCBhc3NvYywgYXNzb2NQYXRoLCB2YWx1ZXMsIG1lcmdlTGVmdCwgbWVyZ2VEZWVwTGVmdCwga2V5cywgbGVucywgbGVuc1Byb3AsIGxlbnNQYXRoLCBwaWNrLCBwcm9qZWN0LCBzZXQsIGxlbmd0aCB9IGZyb20gJ3JhbWRhJyAvLyBPYmplY3RcbmltcG9ydCB7IGhlYWQsIHRhaWwsIHRha2UsIGlzRW1wdHksIGFueSwgYWxsLCAgaW5jbHVkZXMsIGxhc3QsIGRyb3BXaGlsZSwgZHJvcExhc3RXaGlsZSwgZGlmZmVyZW5jZSwgYXBwZW5kLCBmcm9tUGFpcnMsIGZvckVhY2gsIG50aCwgcGx1Y2ssIHJldmVyc2UsIHVuaXEsIHNsaWNlfSBmcm9tICdyYW1kYScgLy8gTGlzdFxuaW1wb3J0IHsgZXF1YWxzLCBpZkVsc2UsIHdoZW4sIGJvdGgsIGVpdGhlciwgaXNOaWwsIGlzLCBkZWZhdWx0VG8sIGFuZCwgb3IsIG5vdCwgVCwgRiwgZ3QsIGx0LCBndGUsIGx0ZSwgbWF4LCBtaW4sIHNvcnQsIHNvcnRCeSwgc3BsaXQsIHRyaW0sIG11bHRpcGx5IH0gZnJvbSAncmFtZGEnIC8vIExvZ2ljLCBUeXBlLCBSZWxhdGlvbiwgU3RyaW5nLCBNYXRoXG5cbmltcG9ydCBCb29rbWFya0ljb24gZnJvbSAnLi4vLi4vaW1hZ2VzL2Jvb2ttYXJrLnN2Zyc7XG5pbXBvcnQgUmVwbHlJY29uIGZyb20gJy4uLy4uL2ltYWdlcy9yZXBseS5zdmcnO1xuaW1wb3J0IFJldHdlZXRJY29uIGZyb20gJy4uLy4uL2ltYWdlcy9yZXR3ZWV0LnN2Zyc7XG5pbXBvcnQgU2h1ZmZsZUljb24gZnJvbSAnLi4vLi4vaW1hZ2VzL3NodWZmbGUuc3ZnJztcbmltcG9ydCBMaWdodG5pbmdJY29uIGZyb20gJy4uLy4uL2ltYWdlcy9saWdodG5pbmcuc3ZnJztcbmltcG9ydCB7IGluaXRHQSwgY3NFdmVudCwgUGFnZVZpZXcsIFVBX0NPREUgfSBmcm9tICcuLi91dGlscy9nYSdcblxuY29uc3QgREVWSU5HID0gcHJvY2Vzcy5lbnYuREVWX01PREUgPT0gJ3NlcnZlJ1xuY29uc3QgdXNlT3B0aW9uID0gREVWSU5HID8gKG5hbWU6IHN0cmluZykgPT4gdXNlU3RhdGUobmFtZSkgOiBfdXNlT3B0aW9uXG5cblxuZXhwb3J0IGZ1bmN0aW9uIEZpbHRlckJ1dHRvbihwcm9wczogeyBJY29uOiBhbnk7IG5hbWU6IHN0cmluZzsgdXNlRmlsdGVyOiBib29sZWFuOyBzZXRGaWx0ZXI6IGFueTsgfSl7XG4gIGNvbnN0IEljb24gPSBwcm9wcy5JY29uXG4gIC8vIGNvbnNvbGUubG9nKCdGaWx0ZXJCdXR0b24nLCB7SWNvbn0pXG4gIC8vIHVzZUVmZmVjdCgoKT0+Y29uc29sZS5sb2coJ0ZpbHRlckJ1dHRvbicsIHtwcm9wcywgSWNvbn0pLCBbXSk7XG4gIHJldHVybiAoXG4gICAgPHNwYW4gY2xhc3M9e3Byb3BzLm5hbWV9PiBcbiAgICAgICAgPGlucHV0IGlkPXtwcm9wcy5uYW1lfSBuYW1lPXtwcm9wcy5uYW1lfSBjbGFzcz0nZmlsdGVyLWNoZWNrYm94JyB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtwcm9wcy51c2VGaWx0ZXJ9IG9uQ2hhbmdlPXsoZXZlbnQpPT5oYW5kbGVJbnB1dENoYW5nZShwcm9wcy5zZXRGaWx0ZXIsIGV2ZW50KX0+PC9pbnB1dD4gXG4gICAgICAgIDxsYWJlbCBmb3I9e3Byb3BzLm5hbWV9ID48IEljb24gY2xhc3M9J2ZpbHRlci1pY29uIGhvdmVySGlnaGxpZ2h0JyBvbkNsaWNrPXtfID0+IF99IC8+IDwvbGFiZWw+XG4gICAgICAgIHsvKiA8bGFiZWwgZm9yPXtwcm9wcy5uYW1lfSA+PCBSZXR3ZWV0SWNvbiBjbGFzcz0nZmlsdGVyLWljb24nIG9uQ2xpY2s9e18gPT4gX30gLz4gPC9sYWJlbD4gKi99XG4gICAgICAgIFxuICAgIDwvc3Bhbj5cbiAgKVxufVxuLy8gXG5leHBvcnQgZnVuY3Rpb24gQ29uc29sZSgpe1xuICAvLyBjb25zdCBbdGV4dCwgc2V0VGV4dF0gPSB1c2VTdGF0ZSgnW2NvbnNvbGUgdGV4dF0nKTtcbiAgY29uc3QgW3RleHQsIHNldFRleHRdID0gdXNlU3RhdGUoJ1tjb25zb2xlIHRleHRdJyk7XG4gIC8vIFRPRE8gbWFrZSB0aGVzZSBnZW5lcmF0ZSB0aGVtc2VsdmVzXG4gIGNvbnN0IFtnZXRSVHMsIHNldEdldFJUc10gPSB1c2VPcHRpb24oJ2dldFJUcycpXG4gIGNvbnN0IFt1c2VCb29rbWFya3MsIHNldFVzZUJvb2ttYXJrc10gPSB1c2VPcHRpb24oJ3VzZUJvb2ttYXJrcycpXG4gIGNvbnN0IFt1c2VSZXBsaWVzLCBzZXRVc2VSZXBsaWVzXSA9IHVzZU9wdGlvbigndXNlUmVwbGllcycpXG4gIGNvbnN0IFtpZGxlTW9kZSwgc2V0SWRsZU1vZGVdID0gdXNlT3B0aW9uKCdpZGxlTW9kZScpXG4gIGNvbnN0IFtzZWFyY2hNb2RlLCBzZXRTZWFyY2hNb2RlXSA9IHVzZU9wdGlvbignc2VhcmNoTW9kZScpXG4gIFxuICBjb25zdCBpZGxlMkJvb2wgPSAoaWRsZU1vZGU6IHN0cmluZykgPT4gaWRsZU1vZGUgPT09ICdyYW5kb20nID8gdHJ1ZSA6IGZhbHNlIC8vIFN0cmluZyAtPiBCb29sXG4gIGNvbnN0IGJvb2wySWRsZSA9IHZhbCA9PiB2YWwgPyAncmFuZG9tJyA6ICd0aW1lbGluZScgLy8gQm9vbCAtPiBTdHJpbmdcblxuICBjb25zdCBzZWFyY2hNb2RlMkJvb2wgPSAoaWRsZU1vZGU6IHN0cmluZykgPT4gaWRsZU1vZGUgPT09ICdzZW1hbnRpYycgPyB0cnVlIDogZmFsc2UgLy8gU3RyaW5nIC0+IEJvb2xcbiAgY29uc3QgYm9vbDJTZWFyY2hNb2RlID0gdmFsID0+IHZhbCA/ICdzZW1hbnRpYycgOiAnZnVsbHRleHQnIC8vIEJvb2wgLT4gU3RyaW5nXG5cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3M9XCJjb25zb2xlXCI+XG4gICAgICA8ZGl2IGlkPSdmaWx0ZXJzJz5cbiAgICAgICAgPCBGaWx0ZXJCdXR0b24gbmFtZT17XCJ1c2VTaHVmZmxlXCJ9IHVzZUZpbHRlcj17aWRsZTJCb29sKGlkbGVNb2RlKX0gc2V0RmlsdGVyPXtwaXBlKGJvb2wySWRsZSwgc2V0SWRsZU1vZGUpfSBJY29uPXtTaHVmZmxlSWNvbn0vPlxuICAgICAgICA8IEZpbHRlckJ1dHRvbiBuYW1lPXtcInNlYXJjaE1vZGVcIn0gdXNlRmlsdGVyPXtzZWFyY2hNb2RlMkJvb2woc2VhcmNoTW9kZSl9IHNldEZpbHRlcj17cGlwZShib29sMlNlYXJjaE1vZGUsIHNldFNlYXJjaE1vZGUpfSBJY29uPXtMaWdodG5pbmdJY29ufS8+XG4gICAgICAgIDxzcGFuPjwvc3Bhbj5cbiAgICAgICAgPCBGaWx0ZXJCdXR0b24gbmFtZT17XCJnZXRSVHNcIn0gdXNlRmlsdGVyPXtnZXRSVHN9IHNldEZpbHRlcj17c2V0R2V0UlRzfSBJY29uPXtSZXR3ZWV0SWNvbn0vPlxuICAgICAgICA8IEZpbHRlckJ1dHRvbiBuYW1lPXtcInVzZUJvb2ttYXJrc1wifSB1c2VGaWx0ZXI9e3VzZUJvb2ttYXJrc30gc2V0RmlsdGVyPXtzZXRVc2VCb29rbWFya3N9IEljb249e0Jvb2ttYXJrSWNvbn0vPlxuICAgICAgICA8IEZpbHRlckJ1dHRvbiBuYW1lPXtcInVzZVJlcGxpZXNcIn0gdXNlRmlsdGVyPXt1c2VSZXBsaWVzfSBzZXRGaWx0ZXI9e3NldFVzZVJlcGxpZXN9IEljb249e1JlcGx5SWNvbn0vPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+IFxuICApO1xufVxuXG5jb25zdCBnZXRUYXJnZXRWYWwgPSAodGFyZ2V0OiB7IHR5cGU6IHN0cmluZzsgY2hlY2tlZDogYW55OyB2YWx1ZTogYW55OyB9KT0+KHRhcmdldC50eXBlID09PSAnY2hlY2tib3gnID8gdGFyZ2V0LmNoZWNrZWQgOiB0YXJnZXQudmFsdWUpXG5jb25zdCBoYW5kbGVJbnB1dENoYW5nZSA9IGN1cnJ5KChfc2V0OiAoeDogYW55KSA9PiB1bmtub3duLCBldmVudCkgPT4ge1xuICBjc0V2ZW50KCdVc2VyJywgYFRvZ2dsZWQgZmlsdGVyICR7ZXZlbnQudGFyZ2V0LmlkfSB0byAke2dldFRhcmdldFZhbChldmVudC50YXJnZXQpfWAsIGV2ZW50LnRhcmdldC5pZCwgZ2V0VGFyZ2V0VmFsKGV2ZW50LnRhcmdldCkgPyAxIDogMCwpO1xuICBwaXBlKHByb3AoJ3RhcmdldCcpLCBnZXRUYXJnZXRWYWwsIF9zZXQpKGV2ZW50KVxufSlcbiJdLCJzb3VyY2VSb290IjoiIn0=