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
var useOption = DEVING ? _s(function (name, init) {
  _s();

  return Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useState"])(init);
}, "pGKq6I+KUYeLSiMR8kz/mQ+n6/0=") : _hooks_useStorage__WEBPACK_IMPORTED_MODULE_2__["useOption"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9Db25zb2xlLnRzeCJdLCJuYW1lcyI6WyJERVZJTkciLCJwcm9jZXNzIiwiREVWX01PREUiLCJ1c2VPcHRpb24iLCJuYW1lIiwiaW5pdCIsInVzZVN0YXRlIiwiX3VzZU9wdGlvbiIsIkZpbHRlckJ1dHRvbiIsInByb3BzIiwiSWNvbiIsInVzZUZpbHRlciIsImV2ZW50IiwiaGFuZGxlSW5wdXRDaGFuZ2UiLCJzZXRGaWx0ZXIiLCJfIiwiQ29uc29sZSIsInRleHQiLCJzZXRUZXh0IiwiZ2V0UlRzIiwic2V0R2V0UlRzIiwidXNlQm9va21hcmtzIiwic2V0VXNlQm9va21hcmtzIiwidXNlUmVwbGllcyIsInNldFVzZVJlcGxpZXMiLCJpZGxlTW9kZSIsInNldElkbGVNb2RlIiwic2VhcmNoTW9kZSIsInNldFNlYXJjaE1vZGUiLCJpZGxlMkJvb2wiLCJib29sMklkbGUiLCJ2YWwiLCJzZWFyY2hNb2RlMkJvb2wiLCJib29sMlNlYXJjaE1vZGUiLCJwaXBlIiwiU2h1ZmZsZUljb24iLCJMaWdodG5pbmdJY29uIiwiUmV0d2VldEljb24iLCJCb29rbWFya0ljb24iLCJSZXBseUljb24iLCJnZXRUYXJnZXRWYWwiLCJ0YXJnZXQiLCJ0eXBlIiwiY2hlY2tlZCIsInZhbHVlIiwiY3VycnkiLCJfc2V0IiwiY3NFdmVudCIsImlkIiwicHJvcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUNBO0NBQzJGOztDQUNnRzs7QUFFckI7QUFFdEs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsTUFBTSxHQUFHQyxrQ0FBQSxDQUFZQyxRQUFaLElBQXdCLE9BQXZDO0FBQ0EsSUFBTUMsU0FBUyxHQUFHSCxNQUFNLE1BQUcsVUFBQ0ksSUFBRCxFQUFlQyxJQUFmO0FBQUE7O0FBQUEsU0FBNEJDLDZEQUFRLENBQUNELElBQUQsQ0FBcEM7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QUE3RCxHQUErRTdCLEtBQUssQ0FBQzZCLE1BQU4sQ0FBYU8sRUFBNUYsRUFBZ0dSLFlBQVksQ0FBQzVCLEtBQUssQ0FBQzZCLE1BQVAsQ0FBWixHQUE2QixDQUE3QixHQUFpQyxDQUFqSSxDQUFQO0FBQ0FQLG9EQUFJLENBQ0ZlLGtEQUFJLENBQUMsUUFBRCxDQURGLEVBRUZULFlBRkUsRUFHRk0sSUFIRSxDQUFKLENBSUVsQyxLQUpGO0FBS0QsQ0FQOEIsQ0FBL0IiLCJmaWxlIjoic2lkZWJhci4wNWQ5Y2MyODhhNzUyNmExNmJkMy5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgcmVuZGVyLCBDb21wb25lbnQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlQ29udGV4dCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyB1c2VPcHRpb24gYXMgX3VzZU9wdGlvbiB9IGZyb20gJy4uL2hvb2tzL3VzZVN0b3JhZ2UnO1xuaW1wb3J0IHsgX18sIGN1cnJ5LCBwaXBlLCBhbmRUaGVuLCBtYXAsIGZpbHRlciwgcmVkdWNlLCB0YXAsIGFwcGx5LCB0cnlDYXRjaH0gZnJvbSAncmFtZGEnIC8vIEZ1bmN0aW9uXG5pbXBvcnQgeyBwcm9wLCBwcm9wRXEsIHByb3BTYXRpc2ZpZXMsIHBhdGgsIHBhdGhFcSwgaGFzUGF0aCwgYXNzb2MsIGFzc29jUGF0aCwgdmFsdWVzLCBtZXJnZUxlZnQsIG1lcmdlRGVlcExlZnQsIGtleXMsIGxlbnMsIGxlbnNQcm9wLCBsZW5zUGF0aCwgcGljaywgcHJvamVjdCwgc2V0LCBsZW5ndGggfSBmcm9tICdyYW1kYScgLy8gT2JqZWN0XG5pbXBvcnQgeyBoZWFkLCB0YWlsLCB0YWtlLCBpc0VtcHR5LCBhbnksIGFsbCwgIGluY2x1ZGVzLCBsYXN0LCBkcm9wV2hpbGUsIGRyb3BMYXN0V2hpbGUsIGRpZmZlcmVuY2UsIGFwcGVuZCwgZnJvbVBhaXJzLCBmb3JFYWNoLCBudGgsIHBsdWNrLCByZXZlcnNlLCB1bmlxLCBzbGljZX0gZnJvbSAncmFtZGEnIC8vIExpc3RcbmltcG9ydCB7IGVxdWFscywgaWZFbHNlLCB3aGVuLCBib3RoLCBlaXRoZXIsIGlzTmlsLCBpcywgZGVmYXVsdFRvLCBhbmQsIG9yLCBub3QsIFQsIEYsIGd0LCBsdCwgZ3RlLCBsdGUsIG1heCwgbWluLCBzb3J0LCBzb3J0QnksIHNwbGl0LCB0cmltLCBtdWx0aXBseSB9IGZyb20gJ3JhbWRhJyAvLyBMb2dpYywgVHlwZSwgUmVsYXRpb24sIFN0cmluZywgTWF0aFxuXG5pbXBvcnQgQm9va21hcmtJY29uIGZyb20gJy4uLy4uL2ltYWdlcy9ib29rbWFyay5zdmcnO1xuaW1wb3J0IFJlcGx5SWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvcmVwbHkuc3ZnJztcbmltcG9ydCBSZXR3ZWV0SWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvcmV0d2VldC5zdmcnO1xuaW1wb3J0IFNodWZmbGVJY29uIGZyb20gJy4uLy4uL2ltYWdlcy9zaHVmZmxlLnN2Zyc7XG5pbXBvcnQgTGlnaHRuaW5nSWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvbGlnaHRuaW5nLnN2Zyc7XG5pbXBvcnQgeyBpbml0R0EsIGNzRXZlbnQsIFBhZ2VWaWV3LCBVQV9DT0RFIH0gZnJvbSAnLi4vdXRpbHMvZ2EnXG5cbmNvbnN0IERFVklORyA9IHByb2Nlc3MuZW52LkRFVl9NT0RFID09ICdzZXJ2ZSdcbmNvbnN0IHVzZU9wdGlvbiA9IERFVklORyA/IChuYW1lOiBzdHJpbmcsIGluaXQ6YW55KSA9PiB1c2VTdGF0ZShpbml0KSA6IF91c2VPcHRpb25cblxuXG5leHBvcnQgZnVuY3Rpb24gRmlsdGVyQnV0dG9uKHByb3BzOiB7IEljb246IGFueTsgbmFtZTogc3RyaW5nOyB1c2VGaWx0ZXI6IGJvb2xlYW47IHNldEZpbHRlcjogYW55OyB9KXtcbiAgY29uc3QgSWNvbiA9IHByb3BzLkljb25cbiAgLy8gY29uc29sZS5sb2coJ0ZpbHRlckJ1dHRvbicsIHtJY29ufSlcbiAgLy8gdXNlRWZmZWN0KCgpPT5jb25zb2xlLmxvZygnRmlsdGVyQnV0dG9uJywge3Byb3BzLCBJY29ufSksIFtdKTtcbiAgcmV0dXJuIChcbiAgICA8c3BhbiBjbGFzcz17cHJvcHMubmFtZX0+IFxuICAgICAgICA8aW5wdXQgaWQ9e3Byb3BzLm5hbWV9IG5hbWU9e3Byb3BzLm5hbWV9IGNsYXNzPSdmaWx0ZXItY2hlY2tib3gnIHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3Byb3BzLnVzZUZpbHRlcn0gb25DaGFuZ2U9eyhldmVudCk9PmhhbmRsZUlucHV0Q2hhbmdlKHByb3BzLnNldEZpbHRlciwgZXZlbnQpfT48L2lucHV0PiBcbiAgICAgICAgPGxhYmVsIGZvcj17cHJvcHMubmFtZX0gPjwgSWNvbiBjbGFzcz0nZmlsdGVyLWljb24gaG92ZXJIaWdobGlnaHQnIG9uQ2xpY2s9e18gPT4gX30gLz4gPC9sYWJlbD5cbiAgICAgICAgey8qIDxsYWJlbCBmb3I9e3Byb3BzLm5hbWV9ID48IFJldHdlZXRJY29uIGNsYXNzPSdmaWx0ZXItaWNvbicgb25DbGljaz17XyA9PiBffSAvPiA8L2xhYmVsPiAqL31cbiAgICAgICAgXG4gICAgPC9zcGFuPlxuICApXG59XG4vLyBcbmV4cG9ydCBmdW5jdGlvbiBDb25zb2xlKCl7XG4gIC8vIGNvbnN0IFt0ZXh0LCBzZXRUZXh0XSA9IHVzZVN0YXRlKCdbY29uc29sZSB0ZXh0XScpO1xuICBjb25zdCBbdGV4dCwgc2V0VGV4dF0gPSB1c2VTdGF0ZSgnW2NvbnNvbGUgdGV4dF0nKTtcbiAgLy8gVE9ETyBtYWtlIHRoZXNlIGdlbmVyYXRlIHRoZW1zZWx2ZXNcbiAgY29uc3QgW2dldFJUcywgc2V0R2V0UlRzXSA9IHVzZU9wdGlvbignZ2V0UlRzJylcbiAgY29uc3QgW3VzZUJvb2ttYXJrcywgc2V0VXNlQm9va21hcmtzXSA9IHVzZU9wdGlvbigndXNlQm9va21hcmtzJylcbiAgY29uc3QgW3VzZVJlcGxpZXMsIHNldFVzZVJlcGxpZXNdID0gdXNlT3B0aW9uKCd1c2VSZXBsaWVzJylcbiAgY29uc3QgW2lkbGVNb2RlLCBzZXRJZGxlTW9kZV0gPSB1c2VPcHRpb24oJ2lkbGVNb2RlJylcbiAgY29uc3QgW3NlYXJjaE1vZGUsIHNldFNlYXJjaE1vZGVdID0gdXNlT3B0aW9uKCdzZWFyY2hNb2RlJylcbiAgXG4gIGNvbnN0IGlkbGUyQm9vbCA9IChpZGxlTW9kZTogc3RyaW5nKSA9PiBpZGxlTW9kZSA9PT0gJ3JhbmRvbScgPyB0cnVlIDogZmFsc2UgLy8gU3RyaW5nIC0+IEJvb2xcbiAgY29uc3QgYm9vbDJJZGxlID0gdmFsID0+IHZhbCA/ICdyYW5kb20nIDogJ3RpbWVsaW5lJyAvLyBCb29sIC0+IFN0cmluZ1xuXG4gIGNvbnN0IHNlYXJjaE1vZGUyQm9vbCA9IChpZGxlTW9kZTogc3RyaW5nKSA9PiBpZGxlTW9kZSA9PT0gJ3NlbWFudGljJyA/IHRydWUgOiBmYWxzZSAvLyBTdHJpbmcgLT4gQm9vbFxuICBjb25zdCBib29sMlNlYXJjaE1vZGUgPSB2YWwgPT4gdmFsID8gJ3NlbWFudGljJyA6ICdmdWxsdGV4dCcgLy8gQm9vbCAtPiBTdHJpbmdcblxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzcz1cImNvbnNvbGVcIj5cbiAgICAgIDxkaXYgaWQ9J2ZpbHRlcnMnPlxuICAgICAgICA8IEZpbHRlckJ1dHRvbiBuYW1lPXtcInVzZVNodWZmbGVcIn0gdXNlRmlsdGVyPXtpZGxlMkJvb2woaWRsZU1vZGUpfSBzZXRGaWx0ZXI9e3BpcGUoYm9vbDJJZGxlLCBzZXRJZGxlTW9kZSl9IEljb249e1NodWZmbGVJY29ufS8+XG4gICAgICAgIDwgRmlsdGVyQnV0dG9uIG5hbWU9e1wic2VhcmNoTW9kZVwifSB1c2VGaWx0ZXI9e3NlYXJjaE1vZGUyQm9vbChzZWFyY2hNb2RlKX0gc2V0RmlsdGVyPXtwaXBlKGJvb2wyU2VhcmNoTW9kZSwgc2V0U2VhcmNoTW9kZSl9IEljb249e0xpZ2h0bmluZ0ljb259Lz5cbiAgICAgICAgPHNwYW4+PC9zcGFuPlxuICAgICAgICA8IEZpbHRlckJ1dHRvbiBuYW1lPXtcImdldFJUc1wifSB1c2VGaWx0ZXI9e2dldFJUc30gc2V0RmlsdGVyPXtzZXRHZXRSVHN9IEljb249e1JldHdlZXRJY29ufS8+XG4gICAgICAgIDwgRmlsdGVyQnV0dG9uIG5hbWU9e1widXNlQm9va21hcmtzXCJ9IHVzZUZpbHRlcj17dXNlQm9va21hcmtzfSBzZXRGaWx0ZXI9e3NldFVzZUJvb2ttYXJrc30gSWNvbj17Qm9va21hcmtJY29ufS8+XG4gICAgICAgIDwgRmlsdGVyQnV0dG9uIG5hbWU9e1widXNlUmVwbGllc1wifSB1c2VGaWx0ZXI9e3VzZVJlcGxpZXN9IHNldEZpbHRlcj17c2V0VXNlUmVwbGllc30gSWNvbj17UmVwbHlJY29ufS8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj4gXG4gICk7XG59XG5cbmNvbnN0IGdldFRhcmdldFZhbCA9ICh0YXJnZXQ6IHsgdHlwZTogc3RyaW5nOyBjaGVja2VkOiBhbnk7IHZhbHVlOiBhbnk7IH0pPT4odGFyZ2V0LnR5cGUgPT09ICdjaGVja2JveCcgPyB0YXJnZXQuY2hlY2tlZCA6IHRhcmdldC52YWx1ZSlcbmNvbnN0IGhhbmRsZUlucHV0Q2hhbmdlID0gY3VycnkoKF9zZXQ6ICh4OiBhbnkpID0+IHVua25vd24sIGV2ZW50KSA9PiB7XG4gIGNzRXZlbnQoJ1VzZXInLCBgVG9nZ2xlZCBmaWx0ZXIgJHtldmVudC50YXJnZXQuaWR9IHRvICR7Z2V0VGFyZ2V0VmFsKGV2ZW50LnRhcmdldCl9YCwgZXZlbnQudGFyZ2V0LmlkLCBnZXRUYXJnZXRWYWwoZXZlbnQudGFyZ2V0KSA/IDEgOiAwLCk7XG4gIHBpcGUoXG4gICAgcHJvcCgndGFyZ2V0JyksXG4gICAgZ2V0VGFyZ2V0VmFsLFxuICAgIF9zZXRcbiAgKShldmVudClcbn0pXG4iXSwic291cmNlUm9vdCI6IiJ9