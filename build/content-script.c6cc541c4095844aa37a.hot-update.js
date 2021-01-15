webpackHotUpdate("content-script",{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9TZXR0aW5ncy50c3giXSwibmFtZXMiOlsib25DbGVhclN0b3JhZ2UiLCJjb25zb2xlIiwibG9nIiwibXNnQkciLCJ0eXBlIiwib25Bc3Nlc3NTdG9yYWdlIiwib25HZXRCb29rbWFya3MiLCJpdGVtcyIsImlkIiwibGVmdEljb24iLCJlZmZlY3QiLCJkZWJ1Z0l0ZW1zIiwiU2V0dGluZ3NCdXR0b24iLCJwcm9wcyIsInVzZVN0YXRlIiwib3BlbiIsInNldE9wZW4iLCJjbG9zZU1lbnUiLCJwaXBlIiwiZGVmYXVsdFRvIiwiZSIsImN1cnJlbnRUYXJnZXQiLCJjb250YWlucyIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsImNsaWNrU2V0dGluZ3MiLCJjc0V2ZW50Iiwib25DbGlja1NldHRpbmdzIiwidXNlQ2FsbGJhY2siLCJDb25zb2xlIiwiQXJjaGl2ZVVwbG9hZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0NBQzJGOztBQUVxRjtDQUNWOztBQUt0SyxTQUFTQSxjQUFULEdBQXlCO0FBQ3ZCQyxTQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaO0FBQ0FDLDZEQUFLLENBQUM7QUFBQ0MsUUFBSSxFQUFDO0FBQU4sR0FBRCxDQUFMO0FBQ0Q7O0FBRUQsU0FBU0MsZUFBVCxHQUEwQjtBQUN4QkosU0FBTyxDQUFDQyxHQUFSLENBQVksZ0JBQVosRUFEd0IsQ0FFeEI7QUFDRDs7QUFFRCxTQUFTSSxjQUFULEdBQXlCO0FBQ3ZCTCxTQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaO0FBQ0FDLDZEQUFLLENBQUM7QUFBQ0MsUUFBSSxFQUFDO0FBQU4sR0FBRCxDQUFMO0FBQ0Q7O0FBRUQsSUFBTUcsS0FBSyxHQUFHLENBQ1o7QUFDQTtBQUFDQyxJQUFFLEVBQUUsaUJBQUw7QUFBd0JDLFVBQVEs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ZUFBTSxxQkFBWDtBQUFBLGdCQUNFLCtEQUFFLHdEQUFGO0FBQVcsaUJBQU0sZUFBakI7QUFBaUMsZUFBTyxFQUFFWSxlQUExQztBQUEyRCxjQUFNLEVBQUVWO0FBQW5FO0FBREYsTUFERixFQUlHRixJQUFJLElBQUksK0RBQUMsc0RBQUQ7QUFBYyxVQUFJLEVBQUUsVUFBcEI7QUFBZ0Msb0JBQWMsRUFBRSxDQUFDYyxnREFBRCxFQUFVQyw0REFBVixDQUFoRDtBQUE0RSxXQUFLLEVBQUV2QixLQUFuRjtBQUEwRixnQkFBVSxFQUFFSSxVQUF0RztBQUFrSCxlQUFTLEVBQUU7QUFBQSxlQUFJSyxPQUFPLENBQUMsS0FBRCxDQUFYO0FBQUE7QUFBN0gsTUFKWDtBQUFBLElBREY7QUFRRDs7SUE3QmVKLGM7O0tBQUFBLGMiLCJmaWxlIjoiY29udGVudC1zY3JpcHQuYzZjYzU0MWM0MDk1ODQ0YWEzN2EuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGgsIHJlbmRlciwgQ29tcG9uZW50IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlQ2FsbGJhY2sgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgaW5pdEdBLCBjc0V2ZW50LCBQYWdlVmlldywgVUFfQ09ERSB9IGZyb20gJy4uL3V0aWxzL2dhJ1xuaW1wb3J0IEdlYXJJY29uIGZyb20gJy4uLy4uL2ltYWdlcy9nZWFyLnN2Zyc7XG5pbXBvcnQgeyBEcm9wZG93bk1lbnUgfSBmcm9tICcuL0Ryb3Bkb3duJ1xuaW1wb3J0IHtDb25zb2xlfSBmcm9tICcuL0NvbnNvbGUnXG5pbXBvcnQge0FyY2hpdmVVcGxvYWRlcn0gZnJvbSAnLi9Mb2FkQXJjaGl2ZSdcbmltcG9ydCB7IG1zZ0JHLCBzZXRTdGcsIGFwcGx5VG9PcHRpb25TdGcgfSBmcm9tICcuLi91dGlscy9kdXRpbHMnO1xuaW1wb3J0IHsgX18sIGN1cnJ5LCBwaXBlLCBhbmRUaGVuLCBtYXAsIGZpbHRlciwgcmVkdWNlLCB0YXAsIGFwcGx5LCB0cnlDYXRjaH0gZnJvbSAncmFtZGEnIC8vIEZ1bmN0aW9uXG5pbXBvcnQgeyBwcm9wLCBwcm9wRXEsIHByb3BTYXRpc2ZpZXMsIHBhdGgsIHBhdGhFcSwgaGFzUGF0aCwgYXNzb2MsIGFzc29jUGF0aCwgdmFsdWVzLCBtZXJnZUxlZnQsIG1lcmdlRGVlcExlZnQsIGtleXMsIGxlbnMsIGxlbnNQcm9wLCBsZW5zUGF0aCwgcGljaywgcHJvamVjdCwgc2V0LCBsZW5ndGggfSBmcm9tICdyYW1kYScgLy8gT2JqZWN0XG5pbXBvcnQgeyBoZWFkLCB0YWlsLCB0YWtlLCBpc0VtcHR5LCBhbnksIGFsbCwgIGluY2x1ZGVzLCBsYXN0LCBkcm9wV2hpbGUsIGRyb3BMYXN0V2hpbGUsIGRpZmZlcmVuY2UsIGFwcGVuZCwgZnJvbVBhaXJzLCBmb3JFYWNoLCBudGgsIHBsdWNrLCByZXZlcnNlLCB1bmlxLCBzbGljZX0gZnJvbSAncmFtZGEnIC8vIExpc3RcbmltcG9ydCB7IGVxdWFscywgaWZFbHNlLCB3aGVuLCBib3RoLCBlaXRoZXIsIGlzTmlsLCBpcywgZGVmYXVsdFRvLCBhbmQsIG9yLCBub3QsIFQsIEYsIGd0LCBsdCwgZ3RlLCBsdGUsIG1heCwgbWluLCBzb3J0LCBzb3J0QnksIHNwbGl0LCB0cmltLCBtdWx0aXBseSB9IGZyb20gJ3JhbWRhJyAvLyBMb2dpYywgVHlwZSwgUmVsYXRpb24sIFN0cmluZywgTWF0aFxuXG5cblxuXG5mdW5jdGlvbiBvbkNsZWFyU3RvcmFnZSgpe1xuICBjb25zb2xlLmxvZyhcImNsZWFyIHN0b3JhZ2VcIilcbiAgbXNnQkcoe3R5cGU6J2NsZWFyJ30pXG59XG5cbmZ1bmN0aW9uIG9uQXNzZXNzU3RvcmFnZSgpe1xuICBjb25zb2xlLmxvZyhcImFzc2VzcyBzdG9yYWdlXCIpXG4gIC8vIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldEJ5dGVzSW5Vc2UoYj0+e2NvbnNvbGUubG9nKGBTdG9yYWdlIHVzaW5nICR7Yn0gYnl0ZXNgKX0pXG59XG5cbmZ1bmN0aW9uIG9uR2V0Qm9va21hcmtzKCl7XG4gIGNvbnNvbGUubG9nKFwiZ2V0IGJvb2ttYXJrc1wiKVxuICBtc2dCRyh7dHlwZTonZ2V0LWJvb2ttYXJrcyd9KVxufVxuXG5jb25zdCBpdGVtcyA9IFtcbiAgLy8ge2lkOiAnTG9hZCBBcmNoaXZlJywgbGVmdEljb246IDxHZWFySWNvbiAvPiwgZWZmZWN0OiAoKT0+e319LFxuICB7aWQ6ICdVcGRhdGUgVGltZWxpbmUnLCBsZWZ0SWNvbjogJ+KZuycsIGVmZmVjdDogKCk9Pnttc2dCRyh7dHlwZTondXBkYXRlLXRpbWVsaW5lJ30pfX0sXG4gIHtpZDogJ1Jlc2V0IFN0b3JhZ2UnLCBsZWZ0SWNvbjogJ+KblCcsIGVmZmVjdDogb25DbGVhclN0b3JhZ2V9LFxuXVxuY29uc3QgZGVidWdJdGVtcyA9IFtcbiAge2lkOiAnQXNzZXNzIFN0b3JhZ2UnLCBsZWZ0SWNvbjogJ/Cfm6AnLCBlZmZlY3Q6IG9uQXNzZXNzU3RvcmFnZX0sXG4gIHtpZDogJ0xvZyBBdXRoJywgbGVmdEljb246ICfwn5ugJywgZWZmZWN0OiAoKT0+e21zZ0JHKHt0eXBlOidsb2ctYXV0aCd9KX19LFxuICB7aWQ6ICdHZXQgVXNlciBJbmZvJywgbGVmdEljb246ICfwn5ugJywgZWZmZWN0OiAoKT0+e21zZ0JHKHt0eXBlOidnZXQtdXNlci1pbmZvJ30pfX0sXG4gIHtpZDogJ1VwZGF0ZSBUd2VldHMnLCBsZWZ0SWNvbjogJ/Cfm6AnLCBlZmZlY3Q6ICgpPT57bXNnQkcoe3R5cGU6J3VwZGF0ZS10d2VldHMnfSl9fSxcbiAge2lkOiAnR2V0IExhdGVzdCcsIGxlZnRJY29uOiAn8J+boCcsIGVmZmVjdDogKCk9Pnttc2dCRyh7dHlwZTonZ2V0LWxhdGVzdCd9KX19LFxuICB7aWQ6ICdHZXQgQm9va21hcmtzJywgbGVmdEljb246ICfwn5ugJywgZWZmZWN0OiBvbkdldEJvb2ttYXJrc30sXG4gIHtpZDogJ01ha2UgSW5kZXgnLCBsZWZ0SWNvbjogJ/Cfm6AnLCBlZmZlY3Q6ICgpPT57bXNnQkcoe3R5cGU6J21ha2UtaW5kZXgnfSl9fSxcbl1cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBTZXR0aW5nc0J1dHRvbihwcm9wcyl7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICAvLyBjb25zdCBjbG9zZU1lbnUgPSAoZSkgPT4gKCghZS5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQpKSA/IHNldE9wZW4oZmFsc2UpIDogbnVsbClcbiAgLy8gKGU6IHsgY3VycmVudFRhcmdldDogeyBwYXJlbnROb2RlOiB7IHBhcmVudE5vZGU6IHsgY29udGFpbnM6IChhcmcwOiBhbnkpID0+IGFueTsgfTsgfTsgfTsgcmVsYXRlZFRhcmdldDogYW55OyB9KSA9PiB7cmV0dXJuICghZS5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQpKSA/IHNldE9wZW4oZmFsc2UpIDogbnVsbH1cbiAgY29uc3QgY2xvc2VNZW51ID0gcGlwZShcbiAgICBkZWZhdWx0VG8obnVsbCksICAgIFxuICAgIChlOiBNb3VzZUV2ZW50KSA9PiB7cmV0dXJuICEoZS5jdXJyZW50VGFyZ2V0IGFzIE5vZGUpLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpID8gKCk9Pntjb25zb2xlLmxvZygnW0RFQlVHXSBTZXR0aW5nIG9uQmx1cicsIHtlfSk7IHNldE9wZW4oZmFsc2UpfSA6IG51bGx9XG4gIClcblxuICBjb25zdCBjbGlja1NldHRpbmdzID0gKCk9PntcbiAgICBjc0V2ZW50KCdVc2VyJywgJ0NsaWNrZWQgU2V0dGluZ3MgYnV0dG9uJywgJycpXG4gICAgY29uc29sZS5sb2coJ0NsaWNrZWQgU2V0dGluZ3MgYnV0dG9uJylcbiAgICBzZXRPcGVuKCFvcGVuKVxuICB9XG5cbiAgY29uc3Qgb25DbGlja1NldHRpbmdzID0gdXNlQ2FsbGJhY2soXG4gICAgY2xpY2tTZXR0aW5ncyxcbiAgICBbb3Blbl1cbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJzZXR0aW5ncy1tZW51XCIgY2xhc3NOYW1lPVwibmF2LWl0ZW1cIiA+XG4gICAgICA8ZGl2IGNsYXNzPVwib3B0aW9ucyBpY29uLWJ1dHRvblwiID4gXG4gICAgICAgIDwgR2Vhckljb24gY2xhc3M9J2Ryb3Bkb3duLWljb24nIG9uQ2xpY2s9e29uQ2xpY2tTZXR0aW5nc30gb25CbHVyPXtjbG9zZU1lbnV9IC8+IFxuICAgICAgPC9kaXY+XG4gICAgICB7b3BlbiAmJiA8RHJvcGRvd25NZW51IG5hbWU9eydTZXR0aW5ncyd9IGNvbXBvbmVudEl0ZW1zPXtbQ29uc29sZSwgQXJjaGl2ZVVwbG9hZGVyXX0gaXRlbXM9e2l0ZW1zfSBkZWJ1Z0l0ZW1zPXtkZWJ1Z0l0ZW1zfSBjbG9zZU1lbnU9eygpPT5zZXRPcGVuKGZhbHNlKX0vPn1cbiAgICA8L2Rpdj5cbiAgKVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==