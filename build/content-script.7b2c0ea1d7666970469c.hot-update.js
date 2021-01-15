webpackHotUpdate("content-script",{

/***/ "./src/ts/components/Header.tsx":
/*!**************************************!*\
  !*** ./src/ts/components/Header.tsx ***!
  \**************************************/
/*! exports provided: Header */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__prefresh_utils__, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Header", function() { return Header; });
/* harmony import */ var preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact/jsx-runtime */ "./node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Settings */ "./src/ts/components/Settings.tsx");
/* harmony import */ var _Accounts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Accounts */ "./src/ts/components/Accounts.tsx");




// const DEVING = process.env.DEV_MODE == 'serve'
function Header() {
  // const [hasArchive, setHasArchive] = DEVING ? useState(true) : useStorage('hasArchive') 
  return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("div", {
    "class": "header",
    children: [Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(_Accounts__WEBPACK_IMPORTED_MODULE_2__["AccountsButton"], {}), Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("div", {
      "class": "title-container",
      children: [" ", Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("span", {
        "class": "th-title",
        children: "Thread Helper"
      })]
    }), Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(_Settings__WEBPACK_IMPORTED_MODULE_1__["SettingsButton"], {})]
  });
}
_c = Header;

var _c;

$RefreshReg$(_c, "Header");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9IZWFkZXIudHN4Il0sIm5hbWVzIjpbIkhlYWRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQTtBQUNBO0FBS0E7QUFFTyxTQUFTQSxNQUFULEdBQWlCO0FBQ3RCO0FBRUEsU0FDRTtBQUFLLGFBQU0sUUFBWDtBQUFBLGVBRUUsK0RBQUMsd0RBQUQsS0FGRixFQUdFO0FBQUssZUFBTSxpQkFBWDtBQUFBLHNCQUE4QjtBQUFNLGlCQUFNLFVBQVo7QUFBQTtBQUFBLFFBQTlCO0FBQUEsTUFIRixFQUtFLCtEQUFDLHdEQUFELEtBTEY7QUFBQSxJQURGO0FBU0Q7S0FaZUEsTSIsImZpbGUiOiJjb250ZW50LXNjcmlwdC43YjJjMGVhMWQ3NjY2OTcwNDY5Yy5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgcmVuZGVyLCBDb21wb25lbnQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBtYWtlT25TdG9yYWdlQ2hhbmdlZCwgbXNnQkcgfSBmcm9tICcuLi91dGlscy9kdXRpbHMnO1xuaW1wb3J0IHsgU3luY0ljb24gfSBmcm9tICcuL1N5bmMnO1xuaW1wb3J0IHtTZXR0aW5nc0J1dHRvbn0gZnJvbSAnLi9TZXR0aW5ncyc7XG5pbXBvcnQge0FjY291bnRzQnV0dG9ufSBmcm9tICcuL0FjY291bnRzJztcbmltcG9ydCB7QXJjaGl2ZVVwbG9hZGVyfSBmcm9tICcuL0xvYWRBcmNoaXZlJztcblxuXG5cbi8vIGNvbnN0IERFVklORyA9IHByb2Nlc3MuZW52LkRFVl9NT0RFID09ICdzZXJ2ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIEhlYWRlcigpe1xuICAvLyBjb25zdCBbaGFzQXJjaGl2ZSwgc2V0SGFzQXJjaGl2ZV0gPSBERVZJTkcgPyB1c2VTdGF0ZSh0cnVlKSA6IHVzZVN0b3JhZ2UoJ2hhc0FyY2hpdmUnKSBcbiAgXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxuICAgICAgey8qIDxTeW5jSWNvbi8+ICovfVxuICAgICAgPEFjY291bnRzQnV0dG9uLz5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZS1jb250YWluZXJcIj4gPHNwYW4gY2xhc3M9XCJ0aC10aXRsZVwiPlRocmVhZCBIZWxwZXI8L3NwYW4+PC9kaXY+XG4gICAgICB7LyogeyFoYXNBcmNoaXZlID8gPEFyY2hpdmVVcGxvYWRlciAvPiA6IG51bGx9ICovfVxuICAgICAgPFNldHRpbmdzQnV0dG9uLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=