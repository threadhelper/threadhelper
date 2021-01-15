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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9Db25zb2xlLnRzeCJdLCJuYW1lcyI6WyJERVZJTkciLCJwcm9jZXNzIiwiREVWX01PREUiLCJ1c2VPcHRpb24iLCJuYW1lIiwiaW5pdCIsInVzZVN0YXRlIiwiX3VzZU9wdGlvbiIsIkZpbHRlckJ1dHRvbiIsInByb3BzIiwiSWNvbiIsInVzZUZpbHRlciIsImV2ZW50IiwiaGFuZGxlSW5wdXRDaGFuZ2UiLCJzZXRGaWx0ZXIiLCJfIiwiQ29uc29sZSIsInRleHQiLCJzZXRUZXh0IiwiZ2V0UlRzIiwic2V0R2V0UlRzIiwidXNlQm9va21hcmtzIiwic2V0VXNlQm9va21hcmtzIiwidXNlUmVwbGllcyIsInNldFVzZVJlcGxpZXMiLCJpZGxlTW9kZSIsInNldElkbGVNb2RlIiwic2VhcmNoTW9kZSIsInNldFNlYXJjaE1vZGUiLCJpZGxlMkJvb2wiLCJib29sMklkbGUiLCJ2YWwiLCJzZWFyY2hNb2RlMkJvb2wiLCJib29sMlNlYXJjaE1vZGUiLCJwaXBlIiwiU2h1ZmZsZUljb24iLCJMaWdodG5pbmdJY29uIiwiUmV0d2VldEljb24iLCJCb29rbWFya0ljb24iLCJSZXBseUljb24iLCJnZXRUYXJnZXRWYWwiLCJ0YXJnZXQiLCJ0eXBlIiwiY2hlY2tlZCIsInZhbHVlIiwiY3VycnkiLCJfc2V0IiwiY3NFdmVudCIsImlkIiwicHJvcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUNBO0NBQzJGOztDQUNnRzs7QUFFckI7QUFFdEs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsTUFBTSxHQUFHQyxrQ0FBQSxDQUFZQyxRQUFaLElBQXdCLE9BQXZDO0FBQ0EsSUFBTUMsU0FBUyxHQUFHSCxNQUFNLE1BQUcsVUFBQ0ksSUFBRCxFQUFlQyxJQUFmO0FBQUE7O0FBQUEsU0FBNEJDLDZEQUFRLENBQUNELElBQUQsQ0FBcEM7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QUE3RCxHQUErRTdCLEtBQUssQ0FBQzZCLE1BQU4sQ0FBYU8sRUFBNUYsRUFBZ0dSLFlBQVksQ0FBQzVCLEtBQUssQ0FBQzZCLE1BQVAsQ0FBWixHQUE2QixDQUE3QixHQUFpQyxDQUFqSSxDQUFQO0FBQ0FQLG9EQUFJLENBQ0ZlLGtEQUFJLENBQUMsUUFBRCxDQURGLEVBRUZULFlBRkUsRUFHRk0sSUFIRSxDQUFKLENBSUVsQyxLQUpGO0FBS0QsQ0FQOEIsQ0FBL0IiLCJmaWxlIjoiY29udGVudC1zY3JpcHQuMDVkOWNjMjg4YTc1MjZhMTZiZDMuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGgsIHJlbmRlciwgQ29tcG9uZW50IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZUNvbnRleHQgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgdXNlT3B0aW9uIGFzIF91c2VPcHRpb24gfSBmcm9tICcuLi9ob29rcy91c2VTdG9yYWdlJztcbmltcG9ydCB7IF9fLCBjdXJyeSwgcGlwZSwgYW5kVGhlbiwgbWFwLCBmaWx0ZXIsIHJlZHVjZSwgdGFwLCBhcHBseSwgdHJ5Q2F0Y2h9IGZyb20gJ3JhbWRhJyAvLyBGdW5jdGlvblxuaW1wb3J0IHsgcHJvcCwgcHJvcEVxLCBwcm9wU2F0aXNmaWVzLCBwYXRoLCBwYXRoRXEsIGhhc1BhdGgsIGFzc29jLCBhc3NvY1BhdGgsIHZhbHVlcywgbWVyZ2VMZWZ0LCBtZXJnZURlZXBMZWZ0LCBrZXlzLCBsZW5zLCBsZW5zUHJvcCwgbGVuc1BhdGgsIHBpY2ssIHByb2plY3QsIHNldCwgbGVuZ3RoIH0gZnJvbSAncmFtZGEnIC8vIE9iamVjdFxuaW1wb3J0IHsgaGVhZCwgdGFpbCwgdGFrZSwgaXNFbXB0eSwgYW55LCBhbGwsICBpbmNsdWRlcywgbGFzdCwgZHJvcFdoaWxlLCBkcm9wTGFzdFdoaWxlLCBkaWZmZXJlbmNlLCBhcHBlbmQsIGZyb21QYWlycywgZm9yRWFjaCwgbnRoLCBwbHVjaywgcmV2ZXJzZSwgdW5pcSwgc2xpY2V9IGZyb20gJ3JhbWRhJyAvLyBMaXN0XG5pbXBvcnQgeyBlcXVhbHMsIGlmRWxzZSwgd2hlbiwgYm90aCwgZWl0aGVyLCBpc05pbCwgaXMsIGRlZmF1bHRUbywgYW5kLCBvciwgbm90LCBULCBGLCBndCwgbHQsIGd0ZSwgbHRlLCBtYXgsIG1pbiwgc29ydCwgc29ydEJ5LCBzcGxpdCwgdHJpbSwgbXVsdGlwbHkgfSBmcm9tICdyYW1kYScgLy8gTG9naWMsIFR5cGUsIFJlbGF0aW9uLCBTdHJpbmcsIE1hdGhcblxuaW1wb3J0IEJvb2ttYXJrSWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvYm9va21hcmsuc3ZnJztcbmltcG9ydCBSZXBseUljb24gZnJvbSAnLi4vLi4vaW1hZ2VzL3JlcGx5LnN2Zyc7XG5pbXBvcnQgUmV0d2VldEljb24gZnJvbSAnLi4vLi4vaW1hZ2VzL3JldHdlZXQuc3ZnJztcbmltcG9ydCBTaHVmZmxlSWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvc2h1ZmZsZS5zdmcnO1xuaW1wb3J0IExpZ2h0bmluZ0ljb24gZnJvbSAnLi4vLi4vaW1hZ2VzL2xpZ2h0bmluZy5zdmcnO1xuaW1wb3J0IHsgaW5pdEdBLCBjc0V2ZW50LCBQYWdlVmlldywgVUFfQ09ERSB9IGZyb20gJy4uL3V0aWxzL2dhJ1xuXG5jb25zdCBERVZJTkcgPSBwcm9jZXNzLmVudi5ERVZfTU9ERSA9PSAnc2VydmUnXG5jb25zdCB1c2VPcHRpb24gPSBERVZJTkcgPyAobmFtZTogc3RyaW5nLCBpbml0OmFueSkgPT4gdXNlU3RhdGUoaW5pdCkgOiBfdXNlT3B0aW9uXG5cblxuZXhwb3J0IGZ1bmN0aW9uIEZpbHRlckJ1dHRvbihwcm9wczogeyBJY29uOiBhbnk7IG5hbWU6IHN0cmluZzsgdXNlRmlsdGVyOiBib29sZWFuOyBzZXRGaWx0ZXI6IGFueTsgfSl7XG4gIGNvbnN0IEljb24gPSBwcm9wcy5JY29uXG4gIC8vIGNvbnNvbGUubG9nKCdGaWx0ZXJCdXR0b24nLCB7SWNvbn0pXG4gIC8vIHVzZUVmZmVjdCgoKT0+Y29uc29sZS5sb2coJ0ZpbHRlckJ1dHRvbicsIHtwcm9wcywgSWNvbn0pLCBbXSk7XG4gIHJldHVybiAoXG4gICAgPHNwYW4gY2xhc3M9e3Byb3BzLm5hbWV9PiBcbiAgICAgICAgPGlucHV0IGlkPXtwcm9wcy5uYW1lfSBuYW1lPXtwcm9wcy5uYW1lfSBjbGFzcz0nZmlsdGVyLWNoZWNrYm94JyB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtwcm9wcy51c2VGaWx0ZXJ9IG9uQ2hhbmdlPXsoZXZlbnQpPT5oYW5kbGVJbnB1dENoYW5nZShwcm9wcy5zZXRGaWx0ZXIsIGV2ZW50KX0+PC9pbnB1dD4gXG4gICAgICAgIDxsYWJlbCBmb3I9e3Byb3BzLm5hbWV9ID48IEljb24gY2xhc3M9J2ZpbHRlci1pY29uIGhvdmVySGlnaGxpZ2h0JyBvbkNsaWNrPXtfID0+IF99IC8+IDwvbGFiZWw+XG4gICAgICAgIHsvKiA8bGFiZWwgZm9yPXtwcm9wcy5uYW1lfSA+PCBSZXR3ZWV0SWNvbiBjbGFzcz0nZmlsdGVyLWljb24nIG9uQ2xpY2s9e18gPT4gX30gLz4gPC9sYWJlbD4gKi99XG4gICAgICAgIFxuICAgIDwvc3Bhbj5cbiAgKVxufVxuLy8gXG5leHBvcnQgZnVuY3Rpb24gQ29uc29sZSgpe1xuICAvLyBjb25zdCBbdGV4dCwgc2V0VGV4dF0gPSB1c2VTdGF0ZSgnW2NvbnNvbGUgdGV4dF0nKTtcbiAgY29uc3QgW3RleHQsIHNldFRleHRdID0gdXNlU3RhdGUoJ1tjb25zb2xlIHRleHRdJyk7XG4gIC8vIFRPRE8gbWFrZSB0aGVzZSBnZW5lcmF0ZSB0aGVtc2VsdmVzXG4gIGNvbnN0IFtnZXRSVHMsIHNldEdldFJUc10gPSB1c2VPcHRpb24oJ2dldFJUcycpXG4gIGNvbnN0IFt1c2VCb29rbWFya3MsIHNldFVzZUJvb2ttYXJrc10gPSB1c2VPcHRpb24oJ3VzZUJvb2ttYXJrcycpXG4gIGNvbnN0IFt1c2VSZXBsaWVzLCBzZXRVc2VSZXBsaWVzXSA9IHVzZU9wdGlvbigndXNlUmVwbGllcycpXG4gIGNvbnN0IFtpZGxlTW9kZSwgc2V0SWRsZU1vZGVdID0gdXNlT3B0aW9uKCdpZGxlTW9kZScpXG4gIGNvbnN0IFtzZWFyY2hNb2RlLCBzZXRTZWFyY2hNb2RlXSA9IHVzZU9wdGlvbignc2VhcmNoTW9kZScpXG4gIFxuICBjb25zdCBpZGxlMkJvb2wgPSAoaWRsZU1vZGU6IHN0cmluZykgPT4gaWRsZU1vZGUgPT09ICdyYW5kb20nID8gdHJ1ZSA6IGZhbHNlIC8vIFN0cmluZyAtPiBCb29sXG4gIGNvbnN0IGJvb2wySWRsZSA9IHZhbCA9PiB2YWwgPyAncmFuZG9tJyA6ICd0aW1lbGluZScgLy8gQm9vbCAtPiBTdHJpbmdcblxuICBjb25zdCBzZWFyY2hNb2RlMkJvb2wgPSAoaWRsZU1vZGU6IHN0cmluZykgPT4gaWRsZU1vZGUgPT09ICdzZW1hbnRpYycgPyB0cnVlIDogZmFsc2UgLy8gU3RyaW5nIC0+IEJvb2xcbiAgY29uc3QgYm9vbDJTZWFyY2hNb2RlID0gdmFsID0+IHZhbCA/ICdzZW1hbnRpYycgOiAnZnVsbHRleHQnIC8vIEJvb2wgLT4gU3RyaW5nXG5cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3M9XCJjb25zb2xlXCI+XG4gICAgICA8ZGl2IGlkPSdmaWx0ZXJzJz5cbiAgICAgICAgPCBGaWx0ZXJCdXR0b24gbmFtZT17XCJ1c2VTaHVmZmxlXCJ9IHVzZUZpbHRlcj17aWRsZTJCb29sKGlkbGVNb2RlKX0gc2V0RmlsdGVyPXtwaXBlKGJvb2wySWRsZSwgc2V0SWRsZU1vZGUpfSBJY29uPXtTaHVmZmxlSWNvbn0vPlxuICAgICAgICA8IEZpbHRlckJ1dHRvbiBuYW1lPXtcInNlYXJjaE1vZGVcIn0gdXNlRmlsdGVyPXtzZWFyY2hNb2RlMkJvb2woc2VhcmNoTW9kZSl9IHNldEZpbHRlcj17cGlwZShib29sMlNlYXJjaE1vZGUsIHNldFNlYXJjaE1vZGUpfSBJY29uPXtMaWdodG5pbmdJY29ufS8+XG4gICAgICAgIDxzcGFuPjwvc3Bhbj5cbiAgICAgICAgPCBGaWx0ZXJCdXR0b24gbmFtZT17XCJnZXRSVHNcIn0gdXNlRmlsdGVyPXtnZXRSVHN9IHNldEZpbHRlcj17c2V0R2V0UlRzfSBJY29uPXtSZXR3ZWV0SWNvbn0vPlxuICAgICAgICA8IEZpbHRlckJ1dHRvbiBuYW1lPXtcInVzZUJvb2ttYXJrc1wifSB1c2VGaWx0ZXI9e3VzZUJvb2ttYXJrc30gc2V0RmlsdGVyPXtzZXRVc2VCb29rbWFya3N9IEljb249e0Jvb2ttYXJrSWNvbn0vPlxuICAgICAgICA8IEZpbHRlckJ1dHRvbiBuYW1lPXtcInVzZVJlcGxpZXNcIn0gdXNlRmlsdGVyPXt1c2VSZXBsaWVzfSBzZXRGaWx0ZXI9e3NldFVzZVJlcGxpZXN9IEljb249e1JlcGx5SWNvbn0vPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+IFxuICApO1xufVxuXG5jb25zdCBnZXRUYXJnZXRWYWwgPSAodGFyZ2V0OiB7IHR5cGU6IHN0cmluZzsgY2hlY2tlZDogYW55OyB2YWx1ZTogYW55OyB9KT0+KHRhcmdldC50eXBlID09PSAnY2hlY2tib3gnID8gdGFyZ2V0LmNoZWNrZWQgOiB0YXJnZXQudmFsdWUpXG5jb25zdCBoYW5kbGVJbnB1dENoYW5nZSA9IGN1cnJ5KChfc2V0OiAoeDogYW55KSA9PiB1bmtub3duLCBldmVudCkgPT4ge1xuICBjc0V2ZW50KCdVc2VyJywgYFRvZ2dsZWQgZmlsdGVyICR7ZXZlbnQudGFyZ2V0LmlkfSB0byAke2dldFRhcmdldFZhbChldmVudC50YXJnZXQpfWAsIGV2ZW50LnRhcmdldC5pZCwgZ2V0VGFyZ2V0VmFsKGV2ZW50LnRhcmdldCkgPyAxIDogMCwpO1xuICBwaXBlKFxuICAgIHByb3AoJ3RhcmdldCcpLFxuICAgIGdldFRhcmdldFZhbCxcbiAgICBfc2V0XG4gICkoZXZlbnQpXG59KVxuIl0sInNvdXJjZVJvb3QiOiIifQ==