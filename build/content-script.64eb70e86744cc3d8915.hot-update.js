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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9Db25zb2xlLnRzeCJdLCJuYW1lcyI6WyJERVZJTkciLCJwcm9jZXNzIiwiREVWX01PREUiLCJ1c2VPcHRpb24iLCJuYW1lIiwidXNlU3RhdGUiLCJfdXNlT3B0aW9uIiwiRmlsdGVyQnV0dG9uIiwicHJvcHMiLCJJY29uIiwidXNlRmlsdGVyIiwiZXZlbnQiLCJoYW5kbGVJbnB1dENoYW5nZSIsInNldEZpbHRlciIsIl8iLCJDb25zb2xlIiwidGV4dCIsInNldFRleHQiLCJnZXRSVHMiLCJzZXRHZXRSVHMiLCJ1c2VCb29rbWFya3MiLCJzZXRVc2VCb29rbWFya3MiLCJ1c2VSZXBsaWVzIiwic2V0VXNlUmVwbGllcyIsImlkbGVNb2RlIiwic2V0SWRsZU1vZGUiLCJzZWFyY2hNb2RlIiwic2V0U2VhcmNoTW9kZSIsImlkbGUyQm9vbCIsImJvb2wySWRsZSIsInZhbCIsInNlYXJjaE1vZGUyQm9vbCIsImJvb2wyU2VhcmNoTW9kZSIsInBpcGUiLCJTaHVmZmxlSWNvbiIsIkxpZ2h0bmluZ0ljb24iLCJSZXR3ZWV0SWNvbiIsIkJvb2ttYXJrSWNvbiIsIlJlcGx5SWNvbiIsImdldFRhcmdldFZhbCIsInRhcmdldCIsInR5cGUiLCJjaGVja2VkIiwidmFsdWUiLCJjdXJyeSIsIl9zZXQiLCJjc0V2ZW50IiwiaWQiLCJwcm9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7Q0FDMkY7O0NBQ2dHOztBQUVyQjtBQUV0SztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxNQUFNLEdBQUdDLGtDQUFBLENBQVlDLFFBQVosSUFBd0IsT0FBdkM7QUFDQSxJQUFNQyxTQUFTLEdBQUdILE1BQU0sTUFBRyxVQUFDSSxJQUFEO0FBQUE7O0FBQUEsU0FBa0JDLDZEQUFRLENBQUNELElBQUQsQ0FBMUI7QUFBQSxDQUFILG9DQUFzQ0Us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QUFDNkIsTUFBTixDQUFhTyxFQUE1RixFQUFnR1IsWUFBWSxDQUFDNUIsS0FBSyxDQUFDNkIsTUFBUCxDQUFaLEdBQTZCLENBQTdCLEdBQWlDLENBQWpJLENBQVA7QUFDQVAsb0RBQUksQ0FBQ2Usa0RBQUksQ0FBQyxRQUFELENBQUwsRUFBaUJULFlBQWpCLEVBQStCTSxJQUEvQixDQUFKLENBQXlDbEMsS0FBekM7QUFDRCxDQUg4QixDQUEvQiIsImZpbGUiOiJjb250ZW50LXNjcmlwdC42NGViNzBlODY3NDRjYzNkODkxNS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgcmVuZGVyLCBDb21wb25lbnQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlQ29udGV4dCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyB1c2VPcHRpb24gYXMgX3VzZU9wdGlvbiB9IGZyb20gJy4uL2hvb2tzL3VzZVN0b3JhZ2UnO1xuaW1wb3J0IHsgX18sIGN1cnJ5LCBwaXBlLCBhbmRUaGVuLCBtYXAsIGZpbHRlciwgcmVkdWNlLCB0YXAsIGFwcGx5LCB0cnlDYXRjaH0gZnJvbSAncmFtZGEnIC8vIEZ1bmN0aW9uXG5pbXBvcnQgeyBwcm9wLCBwcm9wRXEsIHByb3BTYXRpc2ZpZXMsIHBhdGgsIHBhdGhFcSwgaGFzUGF0aCwgYXNzb2MsIGFzc29jUGF0aCwgdmFsdWVzLCBtZXJnZUxlZnQsIG1lcmdlRGVlcExlZnQsIGtleXMsIGxlbnMsIGxlbnNQcm9wLCBsZW5zUGF0aCwgcGljaywgcHJvamVjdCwgc2V0LCBsZW5ndGggfSBmcm9tICdyYW1kYScgLy8gT2JqZWN0XG5pbXBvcnQgeyBoZWFkLCB0YWlsLCB0YWtlLCBpc0VtcHR5LCBhbnksIGFsbCwgIGluY2x1ZGVzLCBsYXN0LCBkcm9wV2hpbGUsIGRyb3BMYXN0V2hpbGUsIGRpZmZlcmVuY2UsIGFwcGVuZCwgZnJvbVBhaXJzLCBmb3JFYWNoLCBudGgsIHBsdWNrLCByZXZlcnNlLCB1bmlxLCBzbGljZX0gZnJvbSAncmFtZGEnIC8vIExpc3RcbmltcG9ydCB7IGVxdWFscywgaWZFbHNlLCB3aGVuLCBib3RoLCBlaXRoZXIsIGlzTmlsLCBpcywgZGVmYXVsdFRvLCBhbmQsIG9yLCBub3QsIFQsIEYsIGd0LCBsdCwgZ3RlLCBsdGUsIG1heCwgbWluLCBzb3J0LCBzb3J0QnksIHNwbGl0LCB0cmltLCBtdWx0aXBseSB9IGZyb20gJ3JhbWRhJyAvLyBMb2dpYywgVHlwZSwgUmVsYXRpb24sIFN0cmluZywgTWF0aFxuXG5pbXBvcnQgQm9va21hcmtJY29uIGZyb20gJy4uLy4uL2ltYWdlcy9ib29rbWFyay5zdmcnO1xuaW1wb3J0IFJlcGx5SWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvcmVwbHkuc3ZnJztcbmltcG9ydCBSZXR3ZWV0SWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvcmV0d2VldC5zdmcnO1xuaW1wb3J0IFNodWZmbGVJY29uIGZyb20gJy4uLy4uL2ltYWdlcy9zaHVmZmxlLnN2Zyc7XG5pbXBvcnQgTGlnaHRuaW5nSWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvbGlnaHRuaW5nLnN2Zyc7XG5pbXBvcnQgeyBpbml0R0EsIGNzRXZlbnQsIFBhZ2VWaWV3LCBVQV9DT0RFIH0gZnJvbSAnLi4vdXRpbHMvZ2EnXG5cbmNvbnN0IERFVklORyA9IHByb2Nlc3MuZW52LkRFVl9NT0RFID09ICdzZXJ2ZSdcbmNvbnN0IHVzZU9wdGlvbiA9IERFVklORyA/IChuYW1lOiBzdHJpbmcpID0+IHVzZVN0YXRlKG5hbWUpIDogX3VzZU9wdGlvblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBGaWx0ZXJCdXR0b24ocHJvcHM6IHsgSWNvbjogYW55OyBuYW1lOiBzdHJpbmc7IHVzZUZpbHRlcjogYm9vbGVhbjsgc2V0RmlsdGVyOiBhbnk7IH0pe1xuICBjb25zdCBJY29uID0gcHJvcHMuSWNvblxuICAvLyBjb25zb2xlLmxvZygnRmlsdGVyQnV0dG9uJywge0ljb259KVxuICAvLyB1c2VFZmZlY3QoKCk9PmNvbnNvbGUubG9nKCdGaWx0ZXJCdXR0b24nLCB7cHJvcHMsIEljb259KSwgW10pO1xuICByZXR1cm4gKFxuICAgIDxzcGFuIGNsYXNzPXtwcm9wcy5uYW1lfT4gXG4gICAgICAgIDxpbnB1dCBpZD17cHJvcHMubmFtZX0gbmFtZT17cHJvcHMubmFtZX0gY2xhc3M9J2ZpbHRlci1jaGVja2JveCcgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17cHJvcHMudXNlRmlsdGVyfSBvbkNoYW5nZT17KGV2ZW50KT0+aGFuZGxlSW5wdXRDaGFuZ2UocHJvcHMuc2V0RmlsdGVyLCBldmVudCl9PjwvaW5wdXQ+IFxuICAgICAgICA8bGFiZWwgZm9yPXtwcm9wcy5uYW1lfSA+PCBJY29uIGNsYXNzPSdmaWx0ZXItaWNvbiBob3ZlckhpZ2hsaWdodCcgb25DbGljaz17XyA9PiBffSAvPiA8L2xhYmVsPlxuICAgICAgICB7LyogPGxhYmVsIGZvcj17cHJvcHMubmFtZX0gPjwgUmV0d2VldEljb24gY2xhc3M9J2ZpbHRlci1pY29uJyBvbkNsaWNrPXtfID0+IF99IC8+IDwvbGFiZWw+ICovfVxuICAgICAgICBcbiAgICA8L3NwYW4+XG4gIClcbn1cbi8vIFxuZXhwb3J0IGZ1bmN0aW9uIENvbnNvbGUoKXtcbiAgLy8gY29uc3QgW3RleHQsIHNldFRleHRdID0gdXNlU3RhdGUoJ1tjb25zb2xlIHRleHRdJyk7XG4gIGNvbnN0IFt0ZXh0LCBzZXRUZXh0XSA9IHVzZVN0YXRlKCdbY29uc29sZSB0ZXh0XScpO1xuICAvLyBUT0RPIG1ha2UgdGhlc2UgZ2VuZXJhdGUgdGhlbXNlbHZlc1xuICBjb25zdCBbZ2V0UlRzLCBzZXRHZXRSVHNdID0gdXNlT3B0aW9uKCdnZXRSVHMnKVxuICBjb25zdCBbdXNlQm9va21hcmtzLCBzZXRVc2VCb29rbWFya3NdID0gdXNlT3B0aW9uKCd1c2VCb29rbWFya3MnKVxuICBjb25zdCBbdXNlUmVwbGllcywgc2V0VXNlUmVwbGllc10gPSB1c2VPcHRpb24oJ3VzZVJlcGxpZXMnKVxuICBjb25zdCBbaWRsZU1vZGUsIHNldElkbGVNb2RlXSA9IHVzZU9wdGlvbignaWRsZU1vZGUnKVxuICBjb25zdCBbc2VhcmNoTW9kZSwgc2V0U2VhcmNoTW9kZV0gPSB1c2VPcHRpb24oJ3NlYXJjaE1vZGUnKVxuICBcbiAgY29uc3QgaWRsZTJCb29sID0gKGlkbGVNb2RlOiBzdHJpbmcpID0+IGlkbGVNb2RlID09PSAncmFuZG9tJyA/IHRydWUgOiBmYWxzZSAvLyBTdHJpbmcgLT4gQm9vbFxuICBjb25zdCBib29sMklkbGUgPSB2YWwgPT4gdmFsID8gJ3JhbmRvbScgOiAndGltZWxpbmUnIC8vIEJvb2wgLT4gU3RyaW5nXG5cbiAgY29uc3Qgc2VhcmNoTW9kZTJCb29sID0gKGlkbGVNb2RlOiBzdHJpbmcpID0+IGlkbGVNb2RlID09PSAnc2VtYW50aWMnID8gdHJ1ZSA6IGZhbHNlIC8vIFN0cmluZyAtPiBCb29sXG4gIGNvbnN0IGJvb2wyU2VhcmNoTW9kZSA9IHZhbCA9PiB2YWwgPyAnc2VtYW50aWMnIDogJ2Z1bGx0ZXh0JyAvLyBCb29sIC0+IFN0cmluZ1xuXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzPVwiY29uc29sZVwiPlxuICAgICAgPGRpdiBpZD0nZmlsdGVycyc+XG4gICAgICAgIDwgRmlsdGVyQnV0dG9uIG5hbWU9e1widXNlU2h1ZmZsZVwifSB1c2VGaWx0ZXI9e2lkbGUyQm9vbChpZGxlTW9kZSl9IHNldEZpbHRlcj17cGlwZShib29sMklkbGUsIHNldElkbGVNb2RlKX0gSWNvbj17U2h1ZmZsZUljb259Lz5cbiAgICAgICAgPCBGaWx0ZXJCdXR0b24gbmFtZT17XCJzZWFyY2hNb2RlXCJ9IHVzZUZpbHRlcj17c2VhcmNoTW9kZTJCb29sKHNlYXJjaE1vZGUpfSBzZXRGaWx0ZXI9e3BpcGUoYm9vbDJTZWFyY2hNb2RlLCBzZXRTZWFyY2hNb2RlKX0gSWNvbj17TGlnaHRuaW5nSWNvbn0vPlxuICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgIDwgRmlsdGVyQnV0dG9uIG5hbWU9e1wiZ2V0UlRzXCJ9IHVzZUZpbHRlcj17Z2V0UlRzfSBzZXRGaWx0ZXI9e3NldEdldFJUc30gSWNvbj17UmV0d2VldEljb259Lz5cbiAgICAgICAgPCBGaWx0ZXJCdXR0b24gbmFtZT17XCJ1c2VCb29rbWFya3NcIn0gdXNlRmlsdGVyPXt1c2VCb29rbWFya3N9IHNldEZpbHRlcj17c2V0VXNlQm9va21hcmtzfSBJY29uPXtCb29rbWFya0ljb259Lz5cbiAgICAgICAgPCBGaWx0ZXJCdXR0b24gbmFtZT17XCJ1c2VSZXBsaWVzXCJ9IHVzZUZpbHRlcj17dXNlUmVwbGllc30gc2V0RmlsdGVyPXtzZXRVc2VSZXBsaWVzfSBJY29uPXtSZXBseUljb259Lz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PiBcbiAgKTtcbn1cblxuY29uc3QgZ2V0VGFyZ2V0VmFsID0gKHRhcmdldDogeyB0eXBlOiBzdHJpbmc7IGNoZWNrZWQ6IGFueTsgdmFsdWU6IGFueTsgfSk9Pih0YXJnZXQudHlwZSA9PT0gJ2NoZWNrYm94JyA/IHRhcmdldC5jaGVja2VkIDogdGFyZ2V0LnZhbHVlKVxuY29uc3QgaGFuZGxlSW5wdXRDaGFuZ2UgPSBjdXJyeSgoX3NldDogKHg6IGFueSkgPT4gdW5rbm93biwgZXZlbnQpID0+IHtcbiAgY3NFdmVudCgnVXNlcicsIGBUb2dnbGVkIGZpbHRlciAke2V2ZW50LnRhcmdldC5pZH0gdG8gJHtnZXRUYXJnZXRWYWwoZXZlbnQudGFyZ2V0KX1gLCBldmVudC50YXJnZXQuaWQsIGdldFRhcmdldFZhbChldmVudC50YXJnZXQpID8gMSA6IDAsKTtcbiAgcGlwZShwcm9wKCd0YXJnZXQnKSwgZ2V0VGFyZ2V0VmFsLCBfc2V0KShldmVudClcbn0pXG4iXSwic291cmNlUm9vdCI6IiJ9