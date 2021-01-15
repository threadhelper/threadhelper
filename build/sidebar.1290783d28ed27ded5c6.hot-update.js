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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9Db25zb2xlLnRzeCJdLCJuYW1lcyI6WyJERVZJTkciLCJwcm9jZXNzIiwiREVWX01PREUiLCJjb25zb2xlIiwibG9nIiwidXNlT3B0aW9uIiwibmFtZSIsInVzZVN0YXRlIiwiX3VzZU9wdGlvbiIsIkZpbHRlckJ1dHRvbiIsInByb3BzIiwiSWNvbiIsInVzZUZpbHRlciIsImV2ZW50IiwiaGFuZGxlSW5wdXRDaGFuZ2UiLCJzZXRGaWx0ZXIiLCJfIiwiQ29uc29sZSIsInRleHQiLCJzZXRUZXh0IiwiZ2V0UlRzIiwic2V0R2V0UlRzIiwidXNlQm9va21hcmtzIiwic2V0VXNlQm9va21hcmtzIiwidXNlUmVwbGllcyIsInNldFVzZVJlcGxpZXMiLCJpZGxlTW9kZSIsInNldElkbGVNb2RlIiwic2VhcmNoTW9kZSIsInNldFNlYXJjaE1vZGUiLCJpZGxlMkJvb2wiLCJib29sMklkbGUiLCJ2YWwiLCJzZWFyY2hNb2RlMkJvb2wiLCJib29sMlNlYXJjaE1vZGUiLCJwaXBlIiwiU2h1ZmZsZUljb24iLCJMaWdodG5pbmdJY29uIiwiUmV0d2VldEljb24iLCJCb29rbWFya0ljb24iLCJSZXBseUljb24iLCJnZXRUYXJnZXRWYWwiLCJ0YXJnZXQiLCJ0eXBlIiwiY2hlY2tlZCIsInZhbHVlIiwiY3VycnkiLCJfc2V0IiwiY3NFdmVudCIsImlkIiwicHJvcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUNBO0NBQzJGOztDQUNnRzs7QUFFckI7QUFFdEs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsTUFBTSxHQUFHQyxrQ0FBQSxDQUFZQyxRQUFaLElBQXdCLE9BQXZDO0FBQ0FDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGdCQUFaLEVBQThCO0FBQUNKLFFBQU0sRUFBTkE7QUFBRCxDQUE5QjtBQUNBLElBQU1LLFNBQVMsR0FB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SyxDQUFDNkIsTUFBTixDQUFhTyxFQUF4QyxpQkFBaURSLFlBQVksQ0FBQzVCLEtBQUssQ0FBQzZCLE1BQVAsQ0FBN0QsR0FBK0U3QixLQUFLLENBQUM2QixNQUFOLENBQWFPLEVBQTVGLEVBQWdHUixZQUFZLENBQUM1QixLQUFLLENBQUM2QixNQUFQLENBQVosR0FBNkIsQ0FBN0IsR0FBaUMsQ0FBakksQ0FBUDtBQUNBUCxvREFBSSxDQUFDZSxrREFBSSxDQUFDLFFBQUQsQ0FBTCxFQUFpQlQsWUFBakIsRUFBK0JNLElBQS9CLENBQUosQ0FBeUNsQyxLQUF6QztBQUNELENBSDhCLENBQS9CIiwiZmlsZSI6InNpZGViYXIuMTI5MDc4M2QyOGVkMjdkZWQ1YzYuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGgsIHJlbmRlciwgQ29tcG9uZW50IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZUNvbnRleHQgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgdXNlT3B0aW9uIGFzIF91c2VPcHRpb24gfSBmcm9tICcuLi9ob29rcy91c2VTdG9yYWdlJztcbmltcG9ydCB7IF9fLCBjdXJyeSwgcGlwZSwgYW5kVGhlbiwgbWFwLCBmaWx0ZXIsIHJlZHVjZSwgdGFwLCBhcHBseSwgdHJ5Q2F0Y2h9IGZyb20gJ3JhbWRhJyAvLyBGdW5jdGlvblxuaW1wb3J0IHsgcHJvcCwgcHJvcEVxLCBwcm9wU2F0aXNmaWVzLCBwYXRoLCBwYXRoRXEsIGhhc1BhdGgsIGFzc29jLCBhc3NvY1BhdGgsIHZhbHVlcywgbWVyZ2VMZWZ0LCBtZXJnZURlZXBMZWZ0LCBrZXlzLCBsZW5zLCBsZW5zUHJvcCwgbGVuc1BhdGgsIHBpY2ssIHByb2plY3QsIHNldCwgbGVuZ3RoIH0gZnJvbSAncmFtZGEnIC8vIE9iamVjdFxuaW1wb3J0IHsgaGVhZCwgdGFpbCwgdGFrZSwgaXNFbXB0eSwgYW55LCBhbGwsICBpbmNsdWRlcywgbGFzdCwgZHJvcFdoaWxlLCBkcm9wTGFzdFdoaWxlLCBkaWZmZXJlbmNlLCBhcHBlbmQsIGZyb21QYWlycywgZm9yRWFjaCwgbnRoLCBwbHVjaywgcmV2ZXJzZSwgdW5pcSwgc2xpY2V9IGZyb20gJ3JhbWRhJyAvLyBMaXN0XG5pbXBvcnQgeyBlcXVhbHMsIGlmRWxzZSwgd2hlbiwgYm90aCwgZWl0aGVyLCBpc05pbCwgaXMsIGRlZmF1bHRUbywgYW5kLCBvciwgbm90LCBULCBGLCBndCwgbHQsIGd0ZSwgbHRlLCBtYXgsIG1pbiwgc29ydCwgc29ydEJ5LCBzcGxpdCwgdHJpbSwgbXVsdGlwbHkgfSBmcm9tICdyYW1kYScgLy8gTG9naWMsIFR5cGUsIFJlbGF0aW9uLCBTdHJpbmcsIE1hdGhcblxuaW1wb3J0IEJvb2ttYXJrSWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvYm9va21hcmsuc3ZnJztcbmltcG9ydCBSZXBseUljb24gZnJvbSAnLi4vLi4vaW1hZ2VzL3JlcGx5LnN2Zyc7XG5pbXBvcnQgUmV0d2VldEljb24gZnJvbSAnLi4vLi4vaW1hZ2VzL3JldHdlZXQuc3ZnJztcbmltcG9ydCBTaHVmZmxlSWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvc2h1ZmZsZS5zdmcnO1xuaW1wb3J0IExpZ2h0bmluZ0ljb24gZnJvbSAnLi4vLi4vaW1hZ2VzL2xpZ2h0bmluZy5zdmcnO1xuaW1wb3J0IHsgaW5pdEdBLCBjc0V2ZW50LCBQYWdlVmlldywgVUFfQ09ERSB9IGZyb20gJy4uL3V0aWxzL2dhJ1xuXG5jb25zdCBERVZJTkcgPSBwcm9jZXNzLmVudi5ERVZfTU9ERSA9PSAnc2VydmUnXG5jb25zb2xlLmxvZygnQ29uc29sZSBERVZJTkcnLCB7REVWSU5HfSlcbmNvbnN0IHVzZU9wdGlvbiA9IERFVklORyA/IChuYW1lOiBzdHJpbmcpID0+IHVzZVN0YXRlKG5hbWUpIDogX3VzZU9wdGlvblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBGaWx0ZXJCdXR0b24ocHJvcHM6IHsgSWNvbjogYW55OyBuYW1lOiBzdHJpbmc7IHVzZUZpbHRlcjogYm9vbGVhbjsgc2V0RmlsdGVyOiBhbnk7IH0pe1xuICBjb25zdCBJY29uID0gcHJvcHMuSWNvblxuICAvLyBjb25zb2xlLmxvZygnRmlsdGVyQnV0dG9uJywge0ljb259KVxuICAvLyB1c2VFZmZlY3QoKCk9PmNvbnNvbGUubG9nKCdGaWx0ZXJCdXR0b24nLCB7cHJvcHMsIEljb259KSwgW10pO1xuICByZXR1cm4gKFxuICAgIDxzcGFuIGNsYXNzPXtwcm9wcy5uYW1lfT4gXG4gICAgICAgIDxpbnB1dCBpZD17cHJvcHMubmFtZX0gbmFtZT17cHJvcHMubmFtZX0gY2xhc3M9J2ZpbHRlci1jaGVja2JveCcgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17cHJvcHMudXNlRmlsdGVyfSBvbkNoYW5nZT17KGV2ZW50KT0+aGFuZGxlSW5wdXRDaGFuZ2UocHJvcHMuc2V0RmlsdGVyLCBldmVudCl9PjwvaW5wdXQ+IFxuICAgICAgICA8bGFiZWwgZm9yPXtwcm9wcy5uYW1lfSA+PCBJY29uIGNsYXNzPSdmaWx0ZXItaWNvbiBob3ZlckhpZ2hsaWdodCcgb25DbGljaz17XyA9PiBffSAvPiA8L2xhYmVsPlxuICAgICAgICB7LyogPGxhYmVsIGZvcj17cHJvcHMubmFtZX0gPjwgUmV0d2VldEljb24gY2xhc3M9J2ZpbHRlci1pY29uJyBvbkNsaWNrPXtfID0+IF99IC8+IDwvbGFiZWw+ICovfVxuICAgICAgICBcbiAgICA8L3NwYW4+XG4gIClcbn1cbi8vIFxuZXhwb3J0IGZ1bmN0aW9uIENvbnNvbGUoKXtcbiAgLy8gY29uc3QgW3RleHQsIHNldFRleHRdID0gdXNlU3RhdGUoJ1tjb25zb2xlIHRleHRdJyk7XG4gIGNvbnN0IFt0ZXh0LCBzZXRUZXh0XSA9IHVzZVN0YXRlKCdbY29uc29sZSB0ZXh0XScpO1xuICAvLyBUT0RPIG1ha2UgdGhlc2UgZ2VuZXJhdGUgdGhlbXNlbHZlc1xuICBjb25zdCBbZ2V0UlRzLCBzZXRHZXRSVHNdID0gdXNlT3B0aW9uKCdnZXRSVHMnKVxuICBjb25zdCBbdXNlQm9va21hcmtzLCBzZXRVc2VCb29rbWFya3NdID0gdXNlT3B0aW9uKCd1c2VCb29rbWFya3MnKVxuICBjb25zdCBbdXNlUmVwbGllcywgc2V0VXNlUmVwbGllc10gPSB1c2VPcHRpb24oJ3VzZVJlcGxpZXMnKVxuICBjb25zdCBbaWRsZU1vZGUsIHNldElkbGVNb2RlXSA9IHVzZU9wdGlvbignaWRsZU1vZGUnKVxuICBjb25zdCBbc2VhcmNoTW9kZSwgc2V0U2VhcmNoTW9kZV0gPSB1c2VPcHRpb24oJ3NlYXJjaE1vZGUnKVxuICBcbiAgY29uc3QgaWRsZTJCb29sID0gKGlkbGVNb2RlOiBzdHJpbmcpID0+IGlkbGVNb2RlID09PSAncmFuZG9tJyA/IHRydWUgOiBmYWxzZSAvLyBTdHJpbmcgLT4gQm9vbFxuICBjb25zdCBib29sMklkbGUgPSB2YWwgPT4gdmFsID8gJ3JhbmRvbScgOiAndGltZWxpbmUnIC8vIEJvb2wgLT4gU3RyaW5nXG5cbiAgY29uc3Qgc2VhcmNoTW9kZTJCb29sID0gKGlkbGVNb2RlOiBzdHJpbmcpID0+IGlkbGVNb2RlID09PSAnc2VtYW50aWMnID8gdHJ1ZSA6IGZhbHNlIC8vIFN0cmluZyAtPiBCb29sXG4gIGNvbnN0IGJvb2wyU2VhcmNoTW9kZSA9IHZhbCA9PiB2YWwgPyAnc2VtYW50aWMnIDogJ2Z1bGx0ZXh0JyAvLyBCb29sIC0+IFN0cmluZ1xuXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzPVwiY29uc29sZVwiPlxuICAgICAgPGRpdiBpZD0nZmlsdGVycyc+XG4gICAgICAgIDwgRmlsdGVyQnV0dG9uIG5hbWU9e1widXNlU2h1ZmZsZVwifSB1c2VGaWx0ZXI9e2lkbGUyQm9vbChpZGxlTW9kZSl9IHNldEZpbHRlcj17cGlwZShib29sMklkbGUsIHNldElkbGVNb2RlKX0gSWNvbj17U2h1ZmZsZUljb259Lz5cbiAgICAgICAgPCBGaWx0ZXJCdXR0b24gbmFtZT17XCJzZWFyY2hNb2RlXCJ9IHVzZUZpbHRlcj17c2VhcmNoTW9kZTJCb29sKHNlYXJjaE1vZGUpfSBzZXRGaWx0ZXI9e3BpcGUoYm9vbDJTZWFyY2hNb2RlLCBzZXRTZWFyY2hNb2RlKX0gSWNvbj17TGlnaHRuaW5nSWNvbn0vPlxuICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgIDwgRmlsdGVyQnV0dG9uIG5hbWU9e1wiZ2V0UlRzXCJ9IHVzZUZpbHRlcj17Z2V0UlRzfSBzZXRGaWx0ZXI9e3NldEdldFJUc30gSWNvbj17UmV0d2VldEljb259Lz5cbiAgICAgICAgPCBGaWx0ZXJCdXR0b24gbmFtZT17XCJ1c2VCb29rbWFya3NcIn0gdXNlRmlsdGVyPXt1c2VCb29rbWFya3N9IHNldEZpbHRlcj17c2V0VXNlQm9va21hcmtzfSBJY29uPXtCb29rbWFya0ljb259Lz5cbiAgICAgICAgPCBGaWx0ZXJCdXR0b24gbmFtZT17XCJ1c2VSZXBsaWVzXCJ9IHVzZUZpbHRlcj17dXNlUmVwbGllc30gc2V0RmlsdGVyPXtzZXRVc2VSZXBsaWVzfSBJY29uPXtSZXBseUljb259Lz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PiBcbiAgKTtcbn1cblxuY29uc3QgZ2V0VGFyZ2V0VmFsID0gKHRhcmdldDogeyB0eXBlOiBzdHJpbmc7IGNoZWNrZWQ6IGFueTsgdmFsdWU6IGFueTsgfSk9Pih0YXJnZXQudHlwZSA9PT0gJ2NoZWNrYm94JyA/IHRhcmdldC5jaGVja2VkIDogdGFyZ2V0LnZhbHVlKVxuY29uc3QgaGFuZGxlSW5wdXRDaGFuZ2UgPSBjdXJyeSgoX3NldDogKHg6IGFueSkgPT4gdW5rbm93biwgZXZlbnQpID0+IHtcbiAgY3NFdmVudCgnVXNlcicsIGBUb2dnbGVkIGZpbHRlciAke2V2ZW50LnRhcmdldC5pZH0gdG8gJHtnZXRUYXJnZXRWYWwoZXZlbnQudGFyZ2V0KX1gLCBldmVudC50YXJnZXQuaWQsIGdldFRhcmdldFZhbChldmVudC50YXJnZXQpID8gMSA6IDAsKTtcbiAgcGlwZShwcm9wKCd0YXJnZXQnKSwgZ2V0VGFyZ2V0VmFsLCBfc2V0KShldmVudClcbn0pXG4iXSwic291cmNlUm9vdCI6IiJ9