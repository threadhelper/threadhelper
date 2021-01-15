webpackHotUpdate("sidebar",{

/***/ "./src/ts/components/Dropdown.tsx":
/*!****************************************!*\
  !*** ./src/ts/components/Dropdown.tsx ***!
  \****************************************/
/*! exports provided: DropdownMenu */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__prefresh_utils__, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DropdownMenu", function() { return DropdownMenu; });
/* harmony import */ var preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact/jsx-runtime */ "./node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "./node_modules/preact/hooks/dist/hooks.module.js");
/* harmony import */ var _utils_ga__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/ga */ "./src/ts/utils/ga.tsx");
/* harmony import */ var _utils_dutils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/dutils */ "./src/ts/utils/dutils.tsx");
/* harmony import */ var ramda__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ramda */ "./node_modules/ramda/es/index.js");
/* harmony import */ var _Console__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Console */ "./src/ts/components/Console.tsx");
/* harmony import */ var _hooks_useStorage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../hooks/useStorage */ "./src/ts/hooks/useStorage.tsx");



var _s = $RefreshSig$(),
    _s3 = $RefreshSig$();

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




// Function
 // Logic, Type, Relation, String, Math



var debug = false;
var DEVING = Object({"NODE_ENV":"development"}).DEV_MODE == 'serve';
var useStgPath = DEVING ? _s(function (name, init) {
  _s();

  return Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useState"])(init);
}, "pGKq6I+KUYeLSiMR8kz/mQ+n6/0=") : _hooks_useStorage__WEBPACK_IMPORTED_MODULE_6__["useStgPath"];
function DropdownMenu(_props) {
  _s3();

  var _s2 = $RefreshSig$();

  var dropdownRef = Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useRef"])(null);

  function DropdownItem(props) {
    var onClickItem = function onClickItem(e) {
      Object(_utils_ga__WEBPACK_IMPORTED_MODULE_2__["csEvent"])('User', "".concat(_props.name, " dropdown click"), props.id);
      props.effect();
      Object(ramda__WEBPACK_IMPORTED_MODULE_4__["defaultTo"])(true, _props.itemClickClose) ? _props.closeMenu() : null;
    };

    return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("a", {
      href: "#",
      className: "menu-item",
      onClick: onClickItem,
      children: [Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("span", {
        className: "icon-button",
        children: props.leftIcon
      }), props.id, Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("span", {
        className: "icon-right",
        children: props.rightIcon
      })]
    });
  }

  function DebugItem(props) {
    return debug ? DropdownItem(props) : null;
  }

  function FilterItem(props) {
    _s2();

    var _useStgPath2 = useStgPath(props.path, true),
        _useStgPath3 = _slicedToArray(_useStgPath2, 2),
        filterItem = _useStgPath3[0],
        setFilterItem = _useStgPath3[1];

    var onClickItem = function onClickItem(e) {
      Object(_utils_ga__WEBPACK_IMPORTED_MODULE_2__["csEvent"])('User', "".concat(_props.name, " dropdown click"), props.screen_name);
      props.effect();
      Object(ramda__WEBPACK_IMPORTED_MODULE_4__["defaultTo"])(true, _props.itemClickClose) ? _props.closeMenu() : null;
    };

    return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("a", {
      href: "#",
      className: "menu-item",
      onClick: onClickItem,
      children: [Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(_Console__WEBPACK_IMPORTED_MODULE_5__["FilterButton"], {
        name: props.screen_name,
        useFilter: filterItem,
        setFilter: setFilterItem,
        Icon: props.leftIcon
      }), props.screen_name, Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("span", {
        className: "x-icon",
        onClick: function onClick(_) {
          return Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_3__["msgBG"])({
            type: 'remove-account',
            id: props.id
          });
        },
        children: "X"
      })]
    });
  }

  _s2(FilterItem, "bcTGSa8EfYoOJJlWTAjN2m7gpPo=", false, function () {
    return [useStgPath];
  });

  var filterItems = Object(ramda__WEBPACK_IMPORTED_MODULE_4__["defaultTo"])([], _props.filterItems);
  var componentItems = Object(ramda__WEBPACK_IMPORTED_MODULE_4__["defaultTo"])([], _props.componentItems);
  var items = Object(ramda__WEBPACK_IMPORTED_MODULE_4__["defaultTo"])([], _props.items);
  var debugItems = Object(ramda__WEBPACK_IMPORTED_MODULE_4__["defaultTo"])([], _props.debugItems);
  return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("div", {
    className: "dropdown",
    ref: dropdownRef,
    children: [componentItems.map(function (Item) {
      return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(Item, {});
    }), filterItems.map(function (item) {
      return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(FilterItem, {
        path: ['activeAccounts', item.id, 'showTweets'],
        id: item.id,
        screen_name: item.screen_name,
        leftIcon: item.leftIcon,
        effect: item.effect
      });
    }), items.map(function (item) {
      return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(DropdownItem, {
        id: item.id,
        leftIcon: item.leftIcon,
        effect: item.effect
      });
    }), debugItems.map(function (item) {
      return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(DebugItem, {
        id: item.id,
        leftIcon: item.leftIcon,
        effect: item.effect
      });
    })]
  });
}

_s3(DropdownMenu, "LnagJAuXUB8rOHjffWUN0lD+IyE=");

_c = DropdownMenu;

var _c;

$RefreshReg$(_c, "DropdownMenu");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9Ecm9wZG93bi50c3giXSwibmFtZXMiOlsiZGVidWciLCJERVZJTkciLCJwcm9jZXNzIiwiREVWX01PREUiLCJ1c2VTdGdQYXRoIiwibmFtZSIsImluaXQiLCJ1c2VTdGF0ZSIsIl91c2VTdGdQYXRoIiwiRHJvcGRvd25NZW51IiwiX3Byb3BzIiwiZHJvcGRvd25SZWYiLCJ1c2VSZWYiLCJEcm9wZG93bkl0ZW0iLCJwcm9wcyIsIm9uQ2xpY2tJdGVtIiwiZSIsImNzRXZlbnQiLCJpZCIsImVmZmVjdCIsImRlZmF1bHRUbyIsIml0ZW1DbGlja0Nsb3NlIiwiY2xvc2VNZW51IiwibGVmdEljb24iLCJyaWdodEljb24iLCJEZWJ1Z0l0ZW0iLCJGaWx0ZXJJdGVtIiwicGF0aCIsImZpbHRlckl0ZW0iLCJzZXRGaWx0ZXJJdGVtIiwic2NyZWVuX25hbWUiLCJfIiwibXNnQkciLCJ0eXBlIiwiZmlsdGVySXRlbXMiLCJjb21wb25lbnRJdGVtcyIsIml0ZW1zIiwiZGVidWdJdGVtcyIsIm1hcCIsIkl0ZW0iLCJpdGVtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQTtBQUNBO0FBQzJGO0NBQzJFOztBQUV0SztBQUNBO0FBRUEsSUFBTUEsS0FBSyxHQUFHLEtBQWQ7QUFFQSxJQUFNQyxNQUFNLEdBQUdDLGtDQUFBLENBQVlDLFFBQVosSUFBd0IsT0FBdkM7QUFDQSxJQUFNQyxVQUFVLEdBQUdILE1BQU0sTUFBRyxVQUFDSSxJQUFELEVBQWVDLElBQWY7QUFBQTs7QUFBQSxTQUE0QkMsNkRBQVEsQ0FBQ0QsSUFBRCxDQUFwQztBQUFBLENBQUgsb0NBQWdERSw0REFBekU7QUFHTyxTQUFTQyxZQUFULENBQXNCQyxNQUF0QixFQUE2SjtBQUFBOztBQUFBOztBQUNsSyxNQUFNQyxXQUFXLEdBQUdDLDJEQUFNLENBQUMsSUFBRCxDQUExQjs7QUFFQSxXQUFTQyxZQUFULENBQXNCQyxLQUF0QixFQUE2QjtBQUMzQixRQUFNQyxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFBQyxDQUFDLEVBQUU7QUFDckJDLCtEQUFPLENBQUMsTUFBRCxZQUFZUCxNQUFNLENBQUNMLElBQW5CLHNCQUEyQ1MsS0FBSyxDQUFDSSxFQUFqRCxDQUFQO0FBQ0FKLFdBQUssQ0FBQ0ssTUFBTjtBQUNBQyw2REFBUyxDQUFDLElBQUQsRUFBT1YsTUFBTSxDQUFDVyxjQUFkLENBQVQsR0FBeUNYLE1BQU0sQ0FBQ1ksU0FBUCxFQUF6QyxHQUE4RCxJQUE5RDtBQUNELEtBSkQ7O0FBS0EsV0FDRTtBQUFHLFVBQUksRUFBQyxHQUFSO0FBQVksZUFBUyxFQUFDLFdBQXRCO0FBQWtDLGFBQU8sRUFBRVAsV0FBM0M7QUFBQSxpQkFDRTtBQUFNLGlCQUFTLEVBQUMsYUFBaEI7QUFBQSxrQkFBK0JELEtBQUssQ0FBQ1M7QUFBckMsUUFERixFQUVHVCxLQUFLLENBQUNJLEVBRlQsRUFHRTtBQUFNLGlCQUFTLEVBQUMsWUFBaEI7QUFBQSxrQkFBOEJKLEtBQUssQ0FBQ1U7QUFBcEMsUUFIRjtBQUFBLE1BREY7QUFPRDs7QUFFRCxXQUFTQyxTQUFULENBQW1CWCxLQUFuQixFQUEwQjtBQUN4QixXQUFRZCxLQUFLLEdBQUdhLFlBQVksQ0FBQ0MsS0FBRCxDQUFmLEdBQXlCLElBQXRDO0FBQ0Q7O0FBRUQsV0FBU1ksVUFBVCxDQUFvQlosS0FBcEIsRUFBMEI7QUFBQTs7QUFBQSx1QkFDWVYsVUFBVSxDQUFDVSxLQUFLLENBQUNhLElBQVAsRUFBYSxJQUFiLENBRHRCO0FBQUE7QUFBQSxRQUNqQkMsVUFEaUI7QUFBQSxRQUNMQyxhQURLOztBQUV4QixRQUFNZCxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFBQyxDQUFDLEVBQUU7QUFDckJDLCtEQUFPLENBQUMsTUFBRCxZQUFZUCxNQUFNLENBQUNMLElBQW5CLHNCQUEyQ1MsS0FBSyxDQUFDZ0IsV0FBakQsQ0FBUDtBQUNBaEIsV0FBSyxDQUFDSyxNQUFOO0FBQ0FDLDZEQUFTLENBQUMsSUFBRCxFQUFPVixNQUFNLENBQUNXLGNBQWQsQ0FBVCxHQUF5Q1gsTUFBTSxDQUFDWSxTQUFQLEVBQXpDLEdBQThELElBQTlEO0FBQ0QsS0FKRDs7QUFNQSxXQUNFO0FBQUcsVUFBSSxFQUFDLEdBQVI7QUFBWSxlQUFTLEVBQUMsV0FBdEI7QUFBa0MsYUFBTyxFQUFFUCxXQUEzQztBQUFBLGlCQUVFLCtEQUFFLHFEQUFGO0FBQWUsWUFBSSxFQUFFRCxLQUFLLENBQUNnQixXQUEzQjtBQUF3QyxpQkFBUyxFQUFFRixVQUFuRDtBQUErRCxpQkFBUyxFQUFFQyxhQUExRTtBQUF5RixZQUFJLEVBQUVmLEtBQUssQ0FBQ1M7QUFBckcsUUFGRixFQUdHVCxLQUFLLENBQUNnQixXQUhULEVBSUU7QUFBTSxpQkFBUyxFQUFDLFFBQWhCO0FBQXlCLGVBQU8sRUFBRSxpQkFBQUMsQ0FBQztBQUFBLGlCQUFFQywyREFBSyxDQUFDO0FBQUNDLGdCQUFJLEVBQUMsZ0JBQU47QUFBd0JmLGNBQUUsRUFBQ0osS0FBSyxDQUFDSTtBQUFqQyxXQUFELENBQVA7QUFBQSxTQUFuQztBQUFBLGtCQUFtRjtBQUFuRixRQUpGO0FBQUEsTUFERjtBQVNEOztBQXZDaUssTUFzQnpKUSxVQXRCeUo7QUFBQSxZQXVCNUh0QixVQXZCNEg7QUFBQTs7QUF3Q2xLLE1BQU04QixXQUFXLEdBQUdkLHVEQUFTLENBQUMsRUFBRCxFQUFLVixNQUFNLENBQUN3QixXQUFaLENBQTdCO0FBQ0EsTUFBTUMsY0FBYyxHQUFHZix1REFBUyxDQUFDLEVBQUQsRUFBS1YsTUFBTSxDQUFDeUIsY0FBWixDQUFoQztBQUNBLE1BQU1DLEtBQUssR0FBR2hCLHVEQUFTLENBQUMsRUFBRCxFQUFLVixNQUFNLENBQUMwQixLQUFaLENBQXZCO0FBQ0EsTUFBTUMsVUFBVSxHQUFHakIsdURBQVMsQ0FBQyxFQUFELEVBQUtWLE1BQU0sQ0FBQzJCLFVBQVosQ0FBNUI7QUFFQSxTQUNFO0FBQUssYUFBUyxFQUFDLFVBQWY7QUFBMEIsT0FBRyxFQUFFMUIsV0FBL0I7QUFBQSxlQUVHd0IsY0FBYyxDQUFDRyxHQUFmLENBQW9CLFVBQUNDLElBQUQ7QUFBQSxhQUFVLCtEQUFDLElBQUQsS0FBVjtBQUFBLEtBQXBCLENBRkgsRUFHR0wsV0FBVyxDQUFDSSxHQUFaLENBQWlCLFVBQUNFLElBQUQ7QUFBQSxhQUFzRSwrREFBQyxVQUFEO0FBQVksWUFBSSxFQUFFLENBQUMsZ0JBQUQsRUFBbUJBLElBQUksQ0FBQ3RCLEVBQXhCLEVBQTRCLFlBQTVCLENBQWxCO0FBQTZELFVBQUUsRUFBRXNCLElBQUksQ0FBQ3RCLEVBQXRFO0FBQTBFLG1CQUFXLEVBQUVzQixJQUFJLENBQUNWLFdBQTVGO0FBQXlHLGdCQUFRLEVBQUVVLElBQUksQ0FBQ2pCLFFBQXhIO0FBQWtJLGNBQU0sRUFBRWlCLElBQUksQ0FBQ3JCO0FBQS9JLFFBQXRFO0FBQUEsS0FBakIsQ0FISCxFQUlHaUIsS0FBSyxDQUFDRSxHQUFOLENBQVcsVUFBQ0UsSUFBRDtBQUFBLGFBQW9ELCtEQUFDLFlBQUQ7QUFBYyxVQUFFLEVBQUVBLElBQUksQ0FBQ3RCLEVBQXZCO0FBQTJCLGdCQUFRLEVBQUVzQixJQUFJLENBQUNqQixRQUExQztBQUFvRCxjQUFNLEVBQUVpQixJQUFJLENBQUNyQjtBQUFqRSxRQUFwRDtBQUFBLEtBQVgsQ0FKSCxFQUtHa0IsVUFBVSxDQUFDQyxHQUFYLENBQWdCLFVBQUNFLElBQUQ7QUFBQSxhQUFvRCwrREFBQyxTQUFEO0FBQVcsVUFBRSxFQUFFQSxJQUFJLENBQUN0QixFQUFwQjtBQUF3QixnQkFBUSxFQUFFc0IsSUFBSSxDQUFDakIsUUFBdkM7QUFBaUQsY0FBTSxFQUFFaUIsSUFBSSxDQUFDckI7QUFBOUQsUUFBcEQ7QUFBQSxLQUFoQixDQUxIO0FBQUEsSUFERjtBQVNEOztJQXREZVYsWTs7S0FBQUEsWSIsImZpbGUiOiJzaWRlYmFyLjBiOGIxYjA0YWE0ZGYxYzFmNDk2LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoLCByZW5kZXIsIENvbXBvbmVudCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZUNhbGxiYWNrIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGluaXRHQSwgY3NFdmVudCwgUGFnZVZpZXcsIFVBX0NPREUgfSBmcm9tICcuLi91dGlscy9nYSdcbmltcG9ydCB7IG1zZ0JHIH0gZnJvbSAnLi4vdXRpbHMvZHV0aWxzJztcbmltcG9ydCB7IF9fLCBjdXJyeSwgcGlwZSwgYW5kVGhlbiwgbWFwLCBmaWx0ZXIsIHJlZHVjZSwgdGFwLCBhcHBseSwgdHJ5Q2F0Y2h9IGZyb20gJ3JhbWRhJyAvLyBGdW5jdGlvblxuaW1wb3J0IHsgZXF1YWxzLCBpZkVsc2UsIHdoZW4sIGJvdGgsIGVpdGhlciwgaXNOaWwsIGlzLCBkZWZhdWx0VG8sIGFuZCwgb3IsIG5vdCwgVCwgRiwgZ3QsIGx0LCBndGUsIGx0ZSwgbWF4LCBtaW4sIHNvcnQsIHNvcnRCeSwgc3BsaXQsIHRyaW0sIG11bHRpcGx5IH0gZnJvbSAncmFtZGEnIC8vIExvZ2ljLCBUeXBlLCBSZWxhdGlvbiwgU3RyaW5nLCBNYXRoXG5cbmltcG9ydCB7RmlsdGVyQnV0dG9ufSBmcm9tICcuL0NvbnNvbGUnXG5pbXBvcnQgeyB1c2VTdGdQYXRoIGFzIF91c2VTdGdQYXRoIH0gZnJvbSAnLi4vaG9va3MvdXNlU3RvcmFnZSc7XG5cbmNvbnN0IGRlYnVnID0gZmFsc2VcblxuY29uc3QgREVWSU5HID0gcHJvY2Vzcy5lbnYuREVWX01PREUgPT0gJ3NlcnZlJ1xuY29uc3QgdXNlU3RnUGF0aCA9IERFVklORyA/IChuYW1lOiBzdHJpbmcsIGluaXQ6YW55KSA9PiB1c2VTdGF0ZShpbml0KSA6IF91c2VTdGdQYXRoXG5cblxuZXhwb3J0IGZ1bmN0aW9uIERyb3Bkb3duTWVudShfcHJvcHM6IHsgbmFtZTogYW55OyBpdGVtQ2xpY2tDbG9zZTogYW55OyBjbG9zZU1lbnU6ICgpID0+IGFueTsgY29tcG9uZW50SXRlbXM6IGFueTsgZmlsdGVySXRlbXM6IGFueTsgaXRlbXM6IGFueTsgZGVidWdJdGVtczogYW55OyB9KSB7XG4gIGNvbnN0IGRyb3Bkb3duUmVmID0gdXNlUmVmKG51bGwpO1xuXG4gIGZ1bmN0aW9uIERyb3Bkb3duSXRlbShwcm9wcykge1xuICAgIGNvbnN0IG9uQ2xpY2tJdGVtID0gZT0+e1xuICAgICAgY3NFdmVudCgnVXNlcicsIGAke19wcm9wcy5uYW1lfSBkcm9wZG93biBjbGlja2AgLCBwcm9wcy5pZCk7ICAgICAgXG4gICAgICBwcm9wcy5lZmZlY3QoKTsgXG4gICAgICBkZWZhdWx0VG8odHJ1ZSwgX3Byb3BzLml0ZW1DbGlja0Nsb3NlKSA/IF9wcm9wcy5jbG9zZU1lbnUoKSA6IG51bGxcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3NOYW1lPVwibWVudS1pdGVtXCIgb25DbGljaz17b25DbGlja0l0ZW19PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uLWJ1dHRvblwiPntwcm9wcy5sZWZ0SWNvbn08L3NwYW4+XG4gICAgICAgIHtwcm9wcy5pZH1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1yaWdodFwiPntwcm9wcy5yaWdodEljb259PC9zcGFuPlxuICAgICAgPC9hPlxuICAgICk7XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIERlYnVnSXRlbShwcm9wcykge1xuICAgIHJldHVybiAoZGVidWcgPyBEcm9wZG93bkl0ZW0ocHJvcHMpIDogbnVsbClcbiAgfVxuXG4gIGZ1bmN0aW9uIEZpbHRlckl0ZW0ocHJvcHMpe1xuICAgIGNvbnN0IFtmaWx0ZXJJdGVtLCBzZXRGaWx0ZXJJdGVtXSA9IHVzZVN0Z1BhdGgocHJvcHMucGF0aCwgdHJ1ZSlcbiAgICBjb25zdCBvbkNsaWNrSXRlbSA9IGU9PntcbiAgICAgIGNzRXZlbnQoJ1VzZXInLCBgJHtfcHJvcHMubmFtZX0gZHJvcGRvd24gY2xpY2tgICwgcHJvcHMuc2NyZWVuX25hbWUpOyAgICAgIFxuICAgICAgcHJvcHMuZWZmZWN0KCk7IFxuICAgICAgZGVmYXVsdFRvKHRydWUsIF9wcm9wcy5pdGVtQ2xpY2tDbG9zZSkgPyBfcHJvcHMuY2xvc2VNZW51KCkgOiBudWxsXG4gICAgfVxuXG4gICAgcmV0dXJuKFxuICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIiBvbkNsaWNrPXtvbkNsaWNrSXRlbX0+XG4gICAgICAgIHsvKiA8c3BhbiBjbGFzc05hbWU9XCJpY29uLWJ1dHRvblwiPntwcm9wcy5sZWZ0SWNvbn08L3NwYW4+ICovfVxuICAgICAgICA8IEZpbHRlckJ1dHRvbiBuYW1lPXtwcm9wcy5zY3JlZW5fbmFtZX0gdXNlRmlsdGVyPXtmaWx0ZXJJdGVtfSBzZXRGaWx0ZXI9e3NldEZpbHRlckl0ZW19IEljb249e3Byb3BzLmxlZnRJY29ufS8+XG4gICAgICAgIHtwcm9wcy5zY3JlZW5fbmFtZX1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwieC1pY29uXCIgb25DbGljaz17Xz0+bXNnQkcoe3R5cGU6J3JlbW92ZS1hY2NvdW50JywgaWQ6cHJvcHMuaWR9KX0+e1wiWFwifTwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICAgIFxuICAgIClcbiAgfVxuICBjb25zdCBmaWx0ZXJJdGVtcyA9IGRlZmF1bHRUbyhbXSwgX3Byb3BzLmZpbHRlckl0ZW1zKVxuICBjb25zdCBjb21wb25lbnRJdGVtcyA9IGRlZmF1bHRUbyhbXSwgX3Byb3BzLmNvbXBvbmVudEl0ZW1zKVxuICBjb25zdCBpdGVtcyA9IGRlZmF1bHRUbyhbXSwgX3Byb3BzLml0ZW1zKVxuICBjb25zdCBkZWJ1Z0l0ZW1zID0gZGVmYXVsdFRvKFtdLCBfcHJvcHMuZGVidWdJdGVtcylcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd25cIiByZWY9e2Ryb3Bkb3duUmVmfT5cbiAgICBcbiAgICAgIHtjb21wb25lbnRJdGVtcy5tYXAoIChJdGVtKSA9PiA8SXRlbSAvPiApfVxuICAgICAge2ZpbHRlckl0ZW1zLm1hcCggKGl0ZW06IHsgaWQ6IGFueTsgc2NyZWVuX25hbWU6IGFueTsgbGVmdEljb246IGFueTsgZWZmZWN0OiBhbnk7IH0pID0+IDxGaWx0ZXJJdGVtIHBhdGg9e1snYWN0aXZlQWNjb3VudHMnLCBpdGVtLmlkLCAnc2hvd1R3ZWV0cyddfSBpZD17aXRlbS5pZH0gc2NyZWVuX25hbWU9e2l0ZW0uc2NyZWVuX25hbWV9IGxlZnRJY29uPXtpdGVtLmxlZnRJY29ufSBlZmZlY3Q9e2l0ZW0uZWZmZWN0fSAvPiApfVxuICAgICAge2l0ZW1zLm1hcCggKGl0ZW06IHsgaWQ6IGFueTsgbGVmdEljb246IGFueTsgZWZmZWN0OiBhbnk7IH0pID0+IDxEcm9wZG93bkl0ZW0gaWQ9e2l0ZW0uaWR9IGxlZnRJY29uPXtpdGVtLmxlZnRJY29ufSBlZmZlY3Q9e2l0ZW0uZWZmZWN0fSAvPiApfVxuICAgICAge2RlYnVnSXRlbXMubWFwKCAoaXRlbTogeyBpZDogYW55OyBsZWZ0SWNvbjogYW55OyBlZmZlY3Q6IGFueTsgfSkgPT4gPERlYnVnSXRlbSBpZD17aXRlbS5pZH0gbGVmdEljb249e2l0ZW0ubGVmdEljb259IGVmZmVjdD17aXRlbS5lZmZlY3R9IC8+ICl9XG4gICAgPC9kaXY+XG4gICk7XG59Il0sInNvdXJjZVJvb3QiOiIifQ==