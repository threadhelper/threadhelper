webpackHotUpdate("sidebar",{

/***/ "./src/ts/components/Settings.tsx":
/*!****************************************!*\
  !*** ./src/ts/components/Settings.tsx ***!
  \****************************************/
/*! exports provided: SettingsButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__prefresh_utils__, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsButton", function() { return SettingsButton; });
/* harmony import */ var preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact/jsx-runtime */ "./node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "./node_modules/preact/hooks/dist/hooks.module.js");
/* harmony import */ var _utils_ga__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/ga */ "./src/ts/utils/ga.tsx");
/* harmony import */ var _images_gear_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../images/gear.svg */ "./src/images/gear.svg");
/* harmony import */ var _Dropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Dropdown */ "./src/ts/components/Dropdown.tsx");
/* harmony import */ var _Console__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Console */ "./src/ts/components/Console.tsx");
/* harmony import */ var _LoadArchive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./LoadArchive */ "./src/ts/components/LoadArchive.tsx");
/* harmony import */ var _utils_dutils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/dutils */ "./src/ts/utils/dutils.tsx");
/* harmony import */ var ramda__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ramda */ "./node_modules/ramda/es/index.js");



var _s2 = $RefreshSig$();

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }








 // Function

// List
 // Logic, Type, Relation, String, Math

function onClearStorage() {
  console.log("clear storage");
  Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_7__["msgBG"])({
    type: 'clear'
  });
}

function onAssessStorage() {
  console.log("assess storage"); // chrome.storage.local.getBytesInUse(b=>{console.log(`Storage using ${b} bytes`)})
}

function onGetBookmarks() {
  console.log("get bookmarks");
  Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_7__["msgBG"])({
    type: 'get-bookmarks'
  });
}

var items = [// {id: 'Load Archive', leftIcon: <GearIcon />, effect: ()=>{}},
{
  id: 'Update Timeline',
  leftIcon: '♻',
  effect: function effect() {
    Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_7__["msgBG"])({
      type: 'update-timeline'
    });
  }
}, {
  id: 'Reset Storage',
  leftIcon: '⛔',
  effect: onClearStorage
}];
var debugItems = [{
  id: 'Assess Storage',
  leftIcon: '🛠',
  effect: onAssessStorage
}, {
  id: 'Log Auth',
  leftIcon: '🛠',
  effect: function effect() {
    Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_7__["msgBG"])({
      type: 'log-auth'
    });
  }
}, {
  id: 'Get User Info',
  leftIcon: '🛠',
  effect: function effect() {
    Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_7__["msgBG"])({
      type: 'get-user-info'
    });
  }
}, {
  id: 'Update Tweets',
  leftIcon: '🛠',
  effect: function effect() {
    Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_7__["msgBG"])({
      type: 'update-tweets'
    });
  }
}, {
  id: 'Get Latest',
  leftIcon: '🛠',
  effect: function effect() {
    Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_7__["msgBG"])({
      type: 'get-latest'
    });
  }
}, {
  id: 'Get Bookmarks',
  leftIcon: '🛠',
  effect: onGetBookmarks
}, {
  id: 'Make Index',
  leftIcon: '🛠',
  effect: function effect() {
    Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_7__["msgBG"])({
      type: 'make-index'
    });
  }
}];
function SettingsButton(props) {
  _s2();

  var _useState = Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useState"])(false),
      _useState2 = _slicedToArray(_useState, 2),
      open = _useState2[0],
      setOpen = _useState2[1]; // const closeMenu = (e) => ((!e.currentTarget.parentNode.parentNode.contains(e.relatedTarget)) ? setOpen(false) : null)
  // (e: { currentTarget: { parentNode: { parentNode: { contains: (arg0: any) => any; }; }; }; relatedTarget: any; }) => {return (!e.currentTarget.parentNode.parentNode.contains(e.relatedTarget)) ? setOpen(false) : null}


  var closeMenu = Object(ramda__WEBPACK_IMPORTED_MODULE_8__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_8__["defaultTo"])(null), function (e) {
    return !e.currentTarget.contains(document.activeElement) ? function () {
      console.log('[DEBUG] Setting onBlur', {
        e: e
      });
      setOpen(false);
    } : null;
  });

  var clickSettings = function clickSettings() {
    Object(_utils_ga__WEBPACK_IMPORTED_MODULE_2__["csEvent"])('User', 'Clicked Settings button', '');
    console.log('Clicked Settings button');
    setOpen(!open);
  };

  var onClickSettings = Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(clickSettings, [open]);
  return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("div", {
    id: "settings-menu",
    className: "nav-item",
    children: [Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("div", {
      "class": "options icon-button",
      children: Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(_images_gear_svg__WEBPACK_IMPORTED_MODULE_3__["default"], {
        "class": "dropdown-icon",
        onClick: onClickSettings,
        onBlur: closeMenu
      })
    }), open && Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(_Dropdown__WEBPACK_IMPORTED_MODULE_4__["DropdownMenu"], {
      name: 'Settings',
      componentItems: [_Console__WEBPACK_IMPORTED_MODULE_5__["Console"], _LoadArchive__WEBPACK_IMPORTED_MODULE_6__["ArchiveUploader"]],
      items: items,
      debugItems: debugItems,
      closeMenu: function closeMenu() {
        return setOpen(false);
      }
    })]
  });
}

_s2(SettingsButton, "dZd98LC350Wa+/LitP2hDQjVrfU=");

_c = SettingsButton;

var _c;

$RefreshReg$(_c, "SettingsButton");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9TZXR0aW5ncy50c3giXSwibmFtZXMiOlsib25DbGVhclN0b3JhZ2UiLCJjb25zb2xlIiwibG9nIiwibXNnQkciLCJ0eXBlIiwib25Bc3Nlc3NTdG9yYWdlIiwib25HZXRCb29rbWFya3MiLCJpdGVtcyIsImlkIiwibGVmdEljb24iLCJlZmZlY3QiLCJkZWJ1Z0l0ZW1zIiwiU2V0dGluZ3NCdXR0b24iLCJwcm9wcyIsInVzZVN0YXRlIiwib3BlbiIsInNldE9wZW4iLCJjbG9zZU1lbnUiLCJwaXBlIiwiZGVmYXVsdFRvIiwiZSIsImN1cnJlbnRUYXJnZXQiLCJjb250YWlucyIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsImNsaWNrU2V0dGluZ3MiLCJjc0V2ZW50Iiwib25DbGlja1NldHRpbmdzIiwidXNlQ2FsbGJhY2siLCJDb25zb2xlIiwiQXJjaGl2ZVVwbG9hZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0NBQzJGOztBQUVxRjtDQUNWOztBQUt0SyxTQUFTQSxjQUFULEdBQXlCO0FBQ3ZCQyxTQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaO0FBQ0FDLDZEQUFLLENBQUM7QUFBQ0MsUUFBSSxFQUFDO0FBQU4sR0FBRCxDQUFMO0FBQ0Q7O0FBRUQsU0FBU0MsZUFBVCxHQUEwQjtBQUN4QkosU0FBTyxDQUFDQyxHQUFSLENBQVksZ0JBQVosRUFEd0IsQ0FFeEI7QUFDRDs7QUFFRCxTQUFTSSxjQUFULEdBQXlCO0FBQ3ZCTCxTQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaO0FBQ0FDLDZEQUFLLENBQUM7QUFBQ0MsUUFBSSxFQUFDO0FBQU4sR0FBRCxDQUFMO0FBQ0Q7O0FBRUQsSUFBTUcsS0FBSyxHQUFHLENBQ1o7QUFDQTtBQUFDQyxJQUFFLEVBQUUsaUJBQUw7QUFBd0JDLFVBQVEs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ZUFBTSxxQkFBWDtBQUFBLGdCQUNFLCtEQUFFLHdEQUFGO0FBQVcsaUJBQU0sZUFBakI7QUFBaUMsZUFBTyxFQUFFWSxlQUExQztBQUEyRCxjQUFNLEVBQUVWO0FBQW5FO0FBREYsTUFERixFQUlHRixJQUFJLElBQUksK0RBQUMsc0RBQUQ7QUFBYyxVQUFJLEVBQUUsVUFBcEI7QUFBZ0Msb0JBQWMsRUFBRSxDQUFDYyxnREFBRCxFQUFVQyw0REFBVixDQUFoRDtBQUE0RSxXQUFLLEVBQUV2QixLQUFuRjtBQUEwRixnQkFBVSxFQUFFSSxVQUF0RztBQUFrSCxlQUFTLEVBQUU7QUFBQSxlQUFJSyxPQUFPLENBQUMsS0FBRCxDQUFYO0FBQUE7QUFBN0gsTUFKWDtBQUFBLElBREY7QUFRRDs7SUE3QmVKLGM7O0tBQUFBLGMiLCJmaWxlIjoic2lkZWJhci5jNmNjNTQxYzQwOTU4NDRhYTM3YS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgcmVuZGVyLCBDb21wb25lbnQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VDYWxsYmFjayB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBpbml0R0EsIGNzRXZlbnQsIFBhZ2VWaWV3LCBVQV9DT0RFIH0gZnJvbSAnLi4vdXRpbHMvZ2EnXG5pbXBvcnQgR2Vhckljb24gZnJvbSAnLi4vLi4vaW1hZ2VzL2dlYXIuc3ZnJztcbmltcG9ydCB7IERyb3Bkb3duTWVudSB9IGZyb20gJy4vRHJvcGRvd24nXG5pbXBvcnQge0NvbnNvbGV9IGZyb20gJy4vQ29uc29sZSdcbmltcG9ydCB7QXJjaGl2ZVVwbG9hZGVyfSBmcm9tICcuL0xvYWRBcmNoaXZlJ1xuaW1wb3J0IHsgbXNnQkcsIHNldFN0ZywgYXBwbHlUb09wdGlvblN0ZyB9IGZyb20gJy4uL3V0aWxzL2R1dGlscyc7XG5pbXBvcnQgeyBfXywgY3VycnksIHBpcGUsIGFuZFRoZW4sIG1hcCwgZmlsdGVyLCByZWR1Y2UsIHRhcCwgYXBwbHksIHRyeUNhdGNofSBmcm9tICdyYW1kYScgLy8gRnVuY3Rpb25cbmltcG9ydCB7IHByb3AsIHByb3BFcSwgcHJvcFNhdGlzZmllcywgcGF0aCwgcGF0aEVxLCBoYXNQYXRoLCBhc3NvYywgYXNzb2NQYXRoLCB2YWx1ZXMsIG1lcmdlTGVmdCwgbWVyZ2VEZWVwTGVmdCwga2V5cywgbGVucywgbGVuc1Byb3AsIGxlbnNQYXRoLCBwaWNrLCBwcm9qZWN0LCBzZXQsIGxlbmd0aCB9IGZyb20gJ3JhbWRhJyAvLyBPYmplY3RcbmltcG9ydCB7IGhlYWQsIHRhaWwsIHRha2UsIGlzRW1wdHksIGFueSwgYWxsLCAgaW5jbHVkZXMsIGxhc3QsIGRyb3BXaGlsZSwgZHJvcExhc3RXaGlsZSwgZGlmZmVyZW5jZSwgYXBwZW5kLCBmcm9tUGFpcnMsIGZvckVhY2gsIG50aCwgcGx1Y2ssIHJldmVyc2UsIHVuaXEsIHNsaWNlfSBmcm9tICdyYW1kYScgLy8gTGlzdFxuaW1wb3J0IHsgZXF1YWxzLCBpZkVsc2UsIHdoZW4sIGJvdGgsIGVpdGhlciwgaXNOaWwsIGlzLCBkZWZhdWx0VG8sIGFuZCwgb3IsIG5vdCwgVCwgRiwgZ3QsIGx0LCBndGUsIGx0ZSwgbWF4LCBtaW4sIHNvcnQsIHNvcnRCeSwgc3BsaXQsIHRyaW0sIG11bHRpcGx5IH0gZnJvbSAncmFtZGEnIC8vIExvZ2ljLCBUeXBlLCBSZWxhdGlvbiwgU3RyaW5nLCBNYXRoXG5cblxuXG5cbmZ1bmN0aW9uIG9uQ2xlYXJTdG9yYWdlKCl7XG4gIGNvbnNvbGUubG9nKFwiY2xlYXIgc3RvcmFnZVwiKVxuICBtc2dCRyh7dHlwZTonY2xlYXInfSlcbn1cblxuZnVuY3Rpb24gb25Bc3Nlc3NTdG9yYWdlKCl7XG4gIGNvbnNvbGUubG9nKFwiYXNzZXNzIHN0b3JhZ2VcIilcbiAgLy8gY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0Qnl0ZXNJblVzZShiPT57Y29uc29sZS5sb2coYFN0b3JhZ2UgdXNpbmcgJHtifSBieXRlc2ApfSlcbn1cblxuZnVuY3Rpb24gb25HZXRCb29rbWFya3MoKXtcbiAgY29uc29sZS5sb2coXCJnZXQgYm9va21hcmtzXCIpXG4gIG1zZ0JHKHt0eXBlOidnZXQtYm9va21hcmtzJ30pXG59XG5cbmNvbnN0IGl0ZW1zID0gW1xuICAvLyB7aWQ6ICdMb2FkIEFyY2hpdmUnLCBsZWZ0SWNvbjogPEdlYXJJY29uIC8+LCBlZmZlY3Q6ICgpPT57fX0sXG4gIHtpZDogJ1VwZGF0ZSBUaW1lbGluZScsIGxlZnRJY29uOiAn4pm7JywgZWZmZWN0OiAoKT0+e21zZ0JHKHt0eXBlOid1cGRhdGUtdGltZWxpbmUnfSl9fSxcbiAge2lkOiAnUmVzZXQgU3RvcmFnZScsIGxlZnRJY29uOiAn4puUJywgZWZmZWN0OiBvbkNsZWFyU3RvcmFnZX0sXG5dXG5jb25zdCBkZWJ1Z0l0ZW1zID0gW1xuICB7aWQ6ICdBc3Nlc3MgU3RvcmFnZScsIGxlZnRJY29uOiAn8J+boCcsIGVmZmVjdDogb25Bc3Nlc3NTdG9yYWdlfSxcbiAge2lkOiAnTG9nIEF1dGgnLCBsZWZ0SWNvbjogJ/Cfm6AnLCBlZmZlY3Q6ICgpPT57bXNnQkcoe3R5cGU6J2xvZy1hdXRoJ30pfX0sXG4gIHtpZDogJ0dldCBVc2VyIEluZm8nLCBsZWZ0SWNvbjogJ/Cfm6AnLCBlZmZlY3Q6ICgpPT57bXNnQkcoe3R5cGU6J2dldC11c2VyLWluZm8nfSl9fSxcbiAge2lkOiAnVXBkYXRlIFR3ZWV0cycsIGxlZnRJY29uOiAn8J+boCcsIGVmZmVjdDogKCk9Pnttc2dCRyh7dHlwZTondXBkYXRlLXR3ZWV0cyd9KX19LFxuICB7aWQ6ICdHZXQgTGF0ZXN0JywgbGVmdEljb246ICfwn5ugJywgZWZmZWN0OiAoKT0+e21zZ0JHKHt0eXBlOidnZXQtbGF0ZXN0J30pfX0sXG4gIHtpZDogJ0dldCBCb29rbWFya3MnLCBsZWZ0SWNvbjogJ/Cfm6AnLCBlZmZlY3Q6IG9uR2V0Qm9va21hcmtzfSxcbiAge2lkOiAnTWFrZSBJbmRleCcsIGxlZnRJY29uOiAn8J+boCcsIGVmZmVjdDogKCk9Pnttc2dCRyh7dHlwZTonbWFrZS1pbmRleCd9KX19LFxuXVxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIFNldHRpbmdzQnV0dG9uKHByb3BzKXtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIC8vIGNvbnN0IGNsb3NlTWVudSA9IChlKSA9PiAoKCFlLmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCkpID8gc2V0T3BlbihmYWxzZSkgOiBudWxsKVxuICAvLyAoZTogeyBjdXJyZW50VGFyZ2V0OiB7IHBhcmVudE5vZGU6IHsgcGFyZW50Tm9kZTogeyBjb250YWluczogKGFyZzA6IGFueSkgPT4gYW55OyB9OyB9OyB9OyByZWxhdGVkVGFyZ2V0OiBhbnk7IH0pID0+IHtyZXR1cm4gKCFlLmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCkpID8gc2V0T3BlbihmYWxzZSkgOiBudWxsfVxuICBjb25zdCBjbG9zZU1lbnUgPSBwaXBlKFxuICAgIGRlZmF1bHRUbyhudWxsKSwgICAgXG4gICAgKGU6IE1vdXNlRXZlbnQpID0+IHtyZXR1cm4gIShlLmN1cnJlbnRUYXJnZXQgYXMgTm9kZSkuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgPyAoKT0+e2NvbnNvbGUubG9nKCdbREVCVUddIFNldHRpbmcgb25CbHVyJywge2V9KTsgc2V0T3BlbihmYWxzZSl9IDogbnVsbH1cbiAgKVxuXG4gIGNvbnN0IGNsaWNrU2V0dGluZ3MgPSAoKT0+e1xuICAgIGNzRXZlbnQoJ1VzZXInLCAnQ2xpY2tlZCBTZXR0aW5ncyBidXR0b24nLCAnJylcbiAgICBjb25zb2xlLmxvZygnQ2xpY2tlZCBTZXR0aW5ncyBidXR0b24nKVxuICAgIHNldE9wZW4oIW9wZW4pXG4gIH1cblxuICBjb25zdCBvbkNsaWNrU2V0dGluZ3MgPSB1c2VDYWxsYmFjayhcbiAgICBjbGlja1NldHRpbmdzLFxuICAgIFtvcGVuXVxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cInNldHRpbmdzLW1lbnVcIiBjbGFzc05hbWU9XCJuYXYtaXRlbVwiID5cbiAgICAgIDxkaXYgY2xhc3M9XCJvcHRpb25zIGljb24tYnV0dG9uXCIgPiBcbiAgICAgICAgPCBHZWFySWNvbiBjbGFzcz0nZHJvcGRvd24taWNvbicgb25DbGljaz17b25DbGlja1NldHRpbmdzfSBvbkJsdXI9e2Nsb3NlTWVudX0gLz4gXG4gICAgICA8L2Rpdj5cbiAgICAgIHtvcGVuICYmIDxEcm9wZG93bk1lbnUgbmFtZT17J1NldHRpbmdzJ30gY29tcG9uZW50SXRlbXM9e1tDb25zb2xlLCBBcmNoaXZlVXBsb2FkZXJdfSBpdGVtcz17aXRlbXN9IGRlYnVnSXRlbXM9e2RlYnVnSXRlbXN9IGNsb3NlTWVudT17KCk9PnNldE9wZW4oZmFsc2UpfS8+fVxuICAgIDwvZGl2PlxuICApXG59XG4iXSwic291cmNlUm9vdCI6IiJ9