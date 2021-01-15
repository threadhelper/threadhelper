webpackHotUpdate("content-script",{

/***/ "./src/ts/components/ThreadHelper.tsx":
/*!********************************************!*\
  !*** ./src/ts/components/ThreadHelper.tsx ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__prefresh_utils__, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ThreadHelper; });
/* harmony import */ var preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact/jsx-runtime */ "./node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "./node_modules/preact/hooks/dist/hooks.module.js");
/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Header */ "./src/ts/components/Header.tsx");
/* harmony import */ var _Search__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Search */ "./src/ts/components/Search.tsx");



var _s2 = $RefreshSig$();

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




function ThreadHelper(props) {
  _s2();

  var _useState = Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useState"])(true),
      _useState2 = _slicedToArray(_useState, 2),
      active = _useState2[0],
      setActive = _useState2[1];

  var myRef = Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useRef"])(null);
  return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("div", {
    "class": "ThreadHelper",
    ref: myRef,
    children: Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(Sidebar, {
      active: active
    })
  });
}

_s2(ThreadHelper, "2qvLLoubK9qWwj7JxwPmTf+vNYk=");

_c = ThreadHelper;

function Sidebar(props) {
  return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("div", {
    "class": "sidebar",
    children: [Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(_Header__WEBPACK_IMPORTED_MODULE_2__["Header"], {}), Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(_Search__WEBPACK_IMPORTED_MODULE_3__["Search"], {})]
  });
}

_c2 = Sidebar;

var _c, _c2;

$RefreshReg$(_c, "ThreadHelper");
$RefreshReg$(_c2, "Sidebar");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9UaHJlYWRIZWxwZXIudHN4Il0sIm5hbWVzIjpbIlRocmVhZEhlbHBlciIsInByb3BzIiwidXNlU3RhdGUiLCJhY3RpdmUiLCJzZXRBY3RpdmUiLCJteVJlZiIsInVzZVJlZiIsIlNpZGViYXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBS0E7QUFDQTtBQUtlLFNBQVNBLFlBQVQsQ0FBc0JDLEtBQXRCLEVBQWlDO0FBQUE7O0FBQUEsa0JBQ2xCQyw2REFBUSxDQUFDLElBQUQsQ0FEVTtBQUFBO0FBQUEsTUFDdkNDLE1BRHVDO0FBQUEsTUFDL0JDLFNBRCtCOztBQUU5QyxNQUFNQyxLQUFLLEdBQUdDLDJEQUFNLENBQUMsSUFBRCxDQUFwQjtBQUVBLFNBQ0U7QUFBSyxhQUFNLGNBQVg7QUFBMEIsT0FBRyxFQUFFRCxLQUEvQjtBQUFBLGNBQ0UsK0RBQUMsT0FBRDtBQUFTLFlBQU0sRUFBRUY7QUFBakI7QUFERixJQURGO0FBS0Q7O0lBVHVCSCxZOztLQUFBQSxZOztBQVd4QixTQUFTTyxPQUFULENBQWlCTixLQUFqQixFQUF3QztBQUN0QyxTQUNFO0FBQUssYUFBTSxTQUFYO0FBQUEsZUFDRSwrREFBQyw4Q0FBRCxLQURGLEVBR0UsK0RBQUMsOENBQUQsS0FIRjtBQUFBLElBREY7QUFPRDs7TUFSUU0sTyIsImZpbGUiOiJjb250ZW50LXNjcmlwdC5iZTJlZTM0NjVlYWYyYTg4YTViZC5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgcmVuZGVyLCBDb21wb25lbnQsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlQ29udGV4dCwgdXNlUmVmIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IG1lbW8gfSBmcm9tICdwcmVhY3QvY29tcGF0JztcbmltcG9ydCBSZWFjdEdBIGZyb20gJ3JlYWN0LWdhJztcbmltcG9ydCB7IGluaXRHQSwgY3NFdmVudCwgUGFnZVZpZXcsIFVBX0NPREUgfSBmcm9tICcuLi91dGlscy9nYSdcbmltcG9ydCB7IGdldE1vZGUgfSBmcm9tICcuLi91dGlscy93dXRpbHMnO1xuaW1wb3J0IHsgSGVhZGVyIH0gZnJvbSAnLi9IZWFkZXInO1xuaW1wb3J0IHsgU2VhcmNoIH0gZnJvbSAnLi9TZWFyY2gnO1xuaW1wb3J0IHsgdXNlU3RyZWFtIH0gZnJvbSAnLi4vaG9va3MvdXNlU3RyZWFtJztcbmltcG9ydCB7IHVzZU9wdGlvbiB9IGZyb20gJy4uL2hvb2tzL3VzZVN0b3JhZ2UnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRocmVhZEhlbHBlcihwcm9wczogYW55KXtcbiAgY29uc3QgW2FjdGl2ZSwgc2V0QWN0aXZlXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBteVJlZiA9IHVzZVJlZihudWxsKTtcbiAgXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzcz1cIlRocmVhZEhlbHBlclwiIHJlZj17bXlSZWZ9PlxuICAgICAgPFNpZGViYXIgYWN0aXZlPXthY3RpdmV9Lz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZnVuY3Rpb24gU2lkZWJhcihwcm9wczogeyBhY3RpdmU6IGFueTt9KXtcbiAgcmV0dXJuKFxuICAgIDxkaXYgY2xhc3M9XCJzaWRlYmFyXCI+XG4gICAgICA8SGVhZGVyIC8+XG4gICAgICB7Lyoge3JvYm9BY3RpdmUgPyA8Um9ibyBhY3RpdmU9e3Byb3BzLmFjdGl2ZX0gc3RyZWFtcz17cHJvcHMuc3RyZWFtc30vPiA6IG51bGx9ICovfVxuICAgICAgPFNlYXJjaCAvPlxuICAgIDwvZGl2PlxuICApO1xufSJdLCJzb3VyY2VSb290IjoiIn0=