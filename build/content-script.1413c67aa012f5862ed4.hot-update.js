webpackHotUpdate("content-script",{

/***/ "./src/ts/hooks/useStorage.tsx":
/*!*************************************!*\
  !*** ./src/ts/hooks/useStorage.tsx ***!
  \*************************************/
/*! exports provided: useStorage, useStgPath, useOption */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__prefresh_utils__, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useStorage", function() { return useStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useStgPath", function() { return useStgPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useOption", function() { return useOption; });
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact/hooks */ "./node_modules/preact/hooks/dist/hooks.module.js");
/* harmony import */ var _useStream__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useStream */ "./src/ts/hooks/useStream.tsx");
/* harmony import */ var _utils_dutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/dutils */ "./src/ts/utils/dutils.tsx");
/* harmony import */ var _utils_putils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/putils */ "./src/ts/utils/putils.tsx");
/* harmony import */ var ramda__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ramda */ "./node_modules/ramda/es/index.js");
/* harmony import */ var _utils_defaultStg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/defaultStg */ "./src/ts/utils/defaultStg.tsx");
var _s2 = $RefreshSig$(),
    _s3 = $RefreshSig$(),
    _s4 = $RefreshSig$();

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var DEVING = "serve" == 'serve';
function useStorage(name, default_val) {
  _s2();

  var useStgObs = Object(preact_hooks__WEBPACK_IMPORTED_MODULE_0__["useMemo"])(function () {
    return Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_2__["makeStgItemObs"])(name);
  }, [name]);

  var _useStream2 = Object(_useStream__WEBPACK_IMPORTED_MODULE_1__["_useStream"])(useStgObs),
      _useStream3 = _slicedToArray(_useStream2, 2),
      storageItem = _useStream3[0],
      setStorageItem = _useStream3[1];

  var setStgItem = Object(ramda__WEBPACK_IMPORTED_MODULE_4__["pipe"])(Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_2__["setStg"])(name), Object(ramda__WEBPACK_IMPORTED_MODULE_4__["andThen"])(Object(ramda__WEBPACK_IMPORTED_MODULE_4__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_4__["prop"])(name), setStorageItem)));
  Object(preact_hooks__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    useStgObs.onValue(_utils_putils__WEBPACK_IMPORTED_MODULE_3__["nullFn"]); //init

    Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_2__["getData"])(name).then(Object(ramda__WEBPACK_IMPORTED_MODULE_4__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_4__["defaultTo"])(DEVING ? _utils_defaultStg__WEBPACK_IMPORTED_MODULE_5__["devStorage"][name] : default_val), setStorageItem));
    return function () {
      useStgObs.offValue(_utils_putils__WEBPACK_IMPORTED_MODULE_3__["nullFn"]);
    };
  }, []);
  Object(preact_hooks__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    return function () {};
  }, [storageItem]);
  return [storageItem, setStgItem];
}

_s2(useStorage, "fnuO+0KXGBTCJ095OzCjy7KaWO4=");

function useStgPath(_path, default_val) {
  _s3();

  var useStgObs = Object(preact_hooks__WEBPACK_IMPORTED_MODULE_0__["useMemo"])(function () {
    return Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_2__["makeStgPathObs"])(_path);
  }, [_path]);

  var _useStream4 = Object(_useStream__WEBPACK_IMPORTED_MODULE_1__["_useStream"])(useStgObs),
      _useStream5 = _slicedToArray(_useStream4, 2),
      storageItem = _useStream5[0],
      setStorageItem = _useStream5[1];

  var setStgItem = Object(ramda__WEBPACK_IMPORTED_MODULE_4__["pipe"])(Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_2__["updateStgPath"])(_path), Object(ramda__WEBPACK_IMPORTED_MODULE_4__["andThen"])(Object(ramda__WEBPACK_IMPORTED_MODULE_4__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_4__["path"])(_path), setStorageItem)));
  Object(preact_hooks__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    useStgObs.onValue(_utils_putils__WEBPACK_IMPORTED_MODULE_3__["nullFn"]); //init

    Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_2__["getStgPath"])(_path).then(Object(ramda__WEBPACK_IMPORTED_MODULE_4__["pipe"])(Object(ramda__WEBPACK_IMPORTED_MODULE_4__["defaultTo"])(DEVING ? _utils_defaultStg__WEBPACK_IMPORTED_MODULE_5__["devStorage"][name] : default_val), setStorageItem));
    return function () {
      useStgObs.offValue(_utils_putils__WEBPACK_IMPORTED_MODULE_3__["nullFn"]);
    };
  }, []);
  return [storageItem, setStgItem];
}

_s3(useStgPath, "PagMkmo6N65nKscYr3wk6S+STi4=");

var useOption = function useOption(name) {
  _s4();

  return useStgPath(['options', name, 'value']);
};

_s4(useOption, "EcASxS9ZI+NmMqLjJmCdrQSgz9s=", false, function () {
  return [useStgPath];
});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvaG9va3MvdXNlU3RvcmFnZS50c3giXSwibmFtZXMiOlsiREVWSU5HIiwicHJvY2VzcyIsInVzZVN0b3JhZ2UiLCJuYW1lIiwiZGVmYXVsdF92YWwiLCJ1c2VTdGdPYnMiLCJ1c2VNZW1vIiwibWFrZVN0Z0l0ZW1PYnMiLCJfdXNlU3RyZWFtIiwic3RvcmFnZUl0ZW0iLCJzZXRTdG9yYWdlSXRlbSIsInNldFN0Z0l0ZW0iLCJwaXBlIiwic2V0U3RnIiwiYW5kVGhlbiIsInByb3AiLCJ1c2VFZmZlY3QiLCJvblZhbHVlIiwibnVsbEZuIiwiZ2V0RGF0YSIsInRoZW4iLCJkZWZhdWx0VG8iLCJkZXZTdG9yYWdlIiwib2ZmVmFsdWUiLCJ1c2VTdGdQYXRoIiwiX3BhdGgiLCJtYWtlU3RnUGF0aE9icyIsInVwZGF0ZVN0Z1BhdGgiLCJwYXRoIiwiZ2V0U3RnUGF0aCIsInVzZU9wdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsTUFBTSxHQUFHQyxPQUFBLElBQXdCLE9BQXZDO0FBR08sU0FBU0MsVUFBVCxDQUFvQkMsSUFBcEIsRUFBMEJDLFdBQTFCLEVBQXNDO0FBQUE7O0FBQzNDLE1BQU1DLFNBQVMsR0FBR0MsNERBQU8sQ0FBQztBQUFBLFdBQUlDLG9FQUFjLENBQUNKLElBQUQsQ0FBbEI7QUFBQSxHQUFELEVBQTBCLENBQUNBLElBQUQsQ0FBMUIsQ0FBekI7O0FBRDJDLG9CQUVMSyw2REFBVSxDQUFDSCxTQUFELENBRkw7QUFBQTtBQUFBLE1BRXBDSSxXQUZvQztBQUFBLE1BRXZCQyxjQUZ1Qjs7QUFJM0MsTUFBTUMsVUFBVSxHQUFHQyxrREFBSSxDQUNyQkMsNERBQU0sQ0FBQ1YsSUFBRCxDQURlLEVBRXJCVyxxREFBTyxDQUFDRixrREFBSSxDQUNWRyxrREFBSSxDQUFDWixJQUFELENBRE0sRUFFVk8sY0FGVSxDQUFMLENBRmMsQ0FBdkI7QUFPQU0sZ0VBQVMsQ0FBQyxZQUFNO0FBQ2RYLGFBQVMsQ0FBQ1ksT0FBVixDQUFrQkMsb0RBQWxCLEVBRGMsQ0FFZDs7QUFDQUMsaUVBQU8sQ0FBQ2hCLElBQUQsQ0FBUCxDQUFjaUIsSUFBZCxDQUFtQlIsa0RBQUksQ0FBQ1MsdURBQVMsQ0FBQ3JCLE1BQU0sR0FBR3NCLDREQUFVLENBQUNuQixJQUFELENBQWIsR0FBc0JDLFdBQTdCLENBQVYsRUFBcURNLGNBQXJELENBQXZCO0FBQ0EsV0FBTyxZQUFNO0FBQUNMLGVBQVMsQ0FBQ2tCLFFBQVYsQ0FBbUJMLG9EQUFuQjtBQUE2QixLQUEzQztBQUNELEdBTFEsRUFLTixFQUxNLENBQVQ7QUFPQUYsZ0VBQVMsQ0FBQyxZQUFJO0FBQ1osV0FBTyxZQUFJLENBQUksQ0FBZjtBQUNELEdBRlEsRUFFUCxDQUFDUCxXQUFELENBRk8sQ0FBVDtBQUlBLFNBQU8sQ0FBQ0EsV0FBRCxFQUFjRSxVQUFkLENBQVA7QUFDRDs7SUF2QmVULFU7O0FBeUJULFNBQVNzQixVQUFULENBQW9CQyxLQUFwQixFQUEyQnJCLFdBQTNCLEVBQWtEO0FBQUE7O0FBQ3ZELE1BQU1DLFNBQVMsR0FBR0MsNERBQU8sQ0FBQztBQUFBLFdBQUlvQixvRUFBYyxDQUFDRCxLQUFELENBQWxCO0FBQUEsR0FBRCxFQUEyQixDQUFDQSxLQUFELENBQTNCLENBQXpCOztBQUR1RCxvQkFFakJqQiw2REFBVSxDQUFDSCxTQUFELENBRk87QUFBQTtBQUFBLE1BRWhESSxXQUZnRDtBQUFBLE1BRW5DQyxjQUZtQzs7QUFJdkQsTUFBTUMsVUFBVSxHQUFHQyxrREFBSSxDQUNyQmUsbUVBQWEsQ0FBQ0YsS0FBRCxDQURRLEVBRXJCWCxxREFBTyxDQUFDRixrREFBSSxDQUNWZ0Isa0RBQUksQ0FBQ0gsS0FBRCxDQURNLEVBRVZmLGNBRlUsQ0FBTCxDQUZjLENBQXZCO0FBT0FNLGdFQUFTLENBQUMsWUFBTTtBQUNkWCxhQUFTLENBQUNZLE9BQVYsQ0FBa0JDLG9EQUFsQixFQURjLENBRWQ7O0FBQ0FXLG9FQUFVLENBQUNKLEtBQUQsQ0FBVixDQUFrQkwsSUFBbEIsQ0FBdUJSLGtEQUFJLENBQUNTLHVEQUFTLENBQUNyQixNQUFNLEdBQUdzQiw0REFBVSxDQUFDbkIsSUFBRCxDQUFiLEdBQXNCQyxXQUE3QixDQUFWLEVBQXFETSxjQUFyRCxDQUEzQjtBQUNBLFdBQU8sWUFBTTtBQUFDTCxlQUFTLENBQUNrQixRQUFWLENBQW1CTCxvREFBbkI7QUFBNkIsS0FBM0M7QUFDRCxHQUxRLEVBS04sRUFMTSxDQUFUO0FBT0EsU0FBTyxDQUFDVCxXQUFELEVBQWNFLFVBQWQsQ0FBUDtBQUNEOztJQW5CZWEsVTs7QUFxQlQsSUFBTU0sU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FBQTNCLElBQUk7QUFBQTs7QUFBQSxTQUFJcUIsVUFBVSxDQUFDLENBQUMsU0FBRCxFQUFXckIsSUFBWCxFQUFnQixPQUFoQixDQUFELENBQWQ7QUFBQSxDQUF0Qjs7SUFBTTJCLFM7VUFBb0JOLFUiLCJmaWxlIjoiY29udGVudC1zY3JpcHQuMTQxM2M2N2FhMDEyZjU4NjJlZDQuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGgsIHJlbmRlciwgQ29tcG9uZW50IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZUNvbnRleHQsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHt1c2VTdHJlYW0sIF91c2VTdHJlYW19IGZyb20gJy4vdXNlU3RyZWFtJ1xuaW1wb3J0IHtnZXREYXRhLCBzZXREYXRhLCBzZXRTdGcsIG1ha2VTdGdJdGVtT2JzLCBnZXRTdGdQYXRoLCB1cGRhdGVTdGdQYXRoLCBtYWtlU3RnUGF0aE9icywgdXBkYXRlT3B0aW9uU3RnLCBnZXRPcHRpb25zfSBmcm9tICcuLi91dGlscy9kdXRpbHMnXG5pbXBvcnQge2luc3BlY3QsIG51bGxGbn0gZnJvbSAnLi4vdXRpbHMvcHV0aWxzJ1xuaW1wb3J0IHtwaXBlLCBhbmRUaGVuLCBwcm9wLCBwYXRoLCBpc05pbCwgZGVmYXVsdFRvfSBmcm9tICdyYW1kYSdcbmltcG9ydCB7IGRlZmF1bHRPcHRpb25zLCBkZWZhdWx0U3RvcmFnZSBhcyBfZGVmYXVsdFN0b3JhZ2UsIGRldlN0b3JhZ2UgfSBmcm9tICcuLi91dGlscy9kZWZhdWx0U3RnJztcblxuY29uc3QgREVWSU5HID0gcHJvY2Vzcy5lbnYuREVWX01PREUgPT0gJ3NlcnZlJ1xuXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VTdG9yYWdlKG5hbWUsIGRlZmF1bHRfdmFsKXtcbiAgY29uc3QgdXNlU3RnT2JzID0gdXNlTWVtbygoKT0+bWFrZVN0Z0l0ZW1PYnMobmFtZSksW25hbWVdKVxuICBjb25zdCBbc3RvcmFnZUl0ZW0sIHNldFN0b3JhZ2VJdGVtXSA9IF91c2VTdHJlYW0odXNlU3RnT2JzKVxuXG4gIGNvbnN0IHNldFN0Z0l0ZW0gPSBwaXBlKFxuICAgIHNldFN0ZyhuYW1lKSxcbiAgICBhbmRUaGVuKHBpcGUoXG4gICAgICBwcm9wKG5hbWUpLFxuICAgICAgc2V0U3RvcmFnZUl0ZW1cbiAgICAgICkpKVxuICAgIFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHVzZVN0Z09icy5vblZhbHVlKG51bGxGbilcbiAgICAvL2luaXRcbiAgICBnZXREYXRhKG5hbWUpLnRoZW4ocGlwZShkZWZhdWx0VG8oREVWSU5HID8gZGV2U3RvcmFnZVtuYW1lXSA6IGRlZmF1bHRfdmFsKSwgc2V0U3RvcmFnZUl0ZW0pKVxuICAgIHJldHVybiAoKSA9PiB7dXNlU3RnT2JzLm9mZlZhbHVlKG51bGxGbik7IH07XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCk9PntcbiAgICByZXR1cm4gKCk9PnsgIH07XG4gIH0sW3N0b3JhZ2VJdGVtXSk7XG5cbiAgcmV0dXJuIFtzdG9yYWdlSXRlbSwgc2V0U3RnSXRlbV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVN0Z1BhdGgoX3BhdGgsIGRlZmF1bHRfdmFsOiB1bmRlZmluZWQpe1xuICBjb25zdCB1c2VTdGdPYnMgPSB1c2VNZW1vKCgpPT5tYWtlU3RnUGF0aE9icyhfcGF0aCksW19wYXRoXSlcbiAgY29uc3QgW3N0b3JhZ2VJdGVtLCBzZXRTdG9yYWdlSXRlbV0gPSBfdXNlU3RyZWFtKHVzZVN0Z09icylcblxuICBjb25zdCBzZXRTdGdJdGVtID0gcGlwZShcbiAgICB1cGRhdGVTdGdQYXRoKF9wYXRoKSxcbiAgICBhbmRUaGVuKHBpcGUoXG4gICAgICBwYXRoKF9wYXRoKSxcbiAgICAgIHNldFN0b3JhZ2VJdGVtXG4gICAgICApKSlcbiAgICBcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB1c2VTdGdPYnMub25WYWx1ZShudWxsRm4pXG4gICAgLy9pbml0XG4gICAgZ2V0U3RnUGF0aChfcGF0aCkudGhlbihwaXBlKGRlZmF1bHRUbyhERVZJTkcgPyBkZXZTdG9yYWdlW25hbWVdIDogZGVmYXVsdF92YWwpLCBzZXRTdG9yYWdlSXRlbSkpXG4gICAgcmV0dXJuICgpID0+IHt1c2VTdGdPYnMub2ZmVmFsdWUobnVsbEZuKTsgfTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiBbc3RvcmFnZUl0ZW0sIHNldFN0Z0l0ZW1dXG59XG5cbmV4cG9ydCBjb25zdCB1c2VPcHRpb24gPSBuYW1lID0+IHVzZVN0Z1BhdGgoWydvcHRpb25zJyxuYW1lLCd2YWx1ZSddKVxuIl0sInNvdXJjZVJvb3QiOiIifQ==