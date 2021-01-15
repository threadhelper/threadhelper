webpackHotUpdate("content-script",{

/***/ "./src/ts/utils/ga.tsx":
/*!*****************************!*\
  !*** ./src/ts/utils/ga.tsx ***!
  \*****************************/
/*! exports provided: UA_CODE, initGA, PageView, Event, Exception, csEvent, csException */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__prefresh_utils__, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UA_CODE", function() { return UA_CODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initGA", function() { return initGA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageView", function() { return PageView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Event", function() { return Event; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Exception", function() { return Exception; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "csEvent", function() { return csEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "csException", function() { return csException; });
// import ReactGA from "react-ga";
// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
var UA_CODE = 'UA-170230545-2';
var initGA = function initGA() {// ReactGA.initialize(UA_CODE, {
  //   debug: false,
  //   titleCase: false,
  // });
  // ReactGA.ga('set', 'checkProtocolTask', null);
};
var PageView = function PageView(name) {// ReactGA.pageview(name);
};
_c = PageView;
var Event = function Event(category, action, label) {// ReactGA.event({
  //   category,
  //   action,
  //   label,
  //   value
  // });

  var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
};
_c2 = Event;
var Exception = function Exception(description, fatal) {// return ReactGA.exception({
  // description: description,
  // fatal: fatal
  // })
};
_c3 = Exception;
var csEvent = function csEvent(category, action, label) {// msgBG({type: 'gaEvent', event: {category, action, label, value}})

  var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
};
var csException = function csException(description, fatal) {// msgBG({type: 'gaException', exception: {description, fatal}})
};

var _c, _c2, _c3;

$RefreshReg$(_c, "PageView");
$RefreshReg$(_c2, "Event");
$RefreshReg$(_c3, "Exception");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvZ2EudHN4Il0sIm5hbWVzIjpbIlVBX0NPREUiLCJpbml0R0EiLCJQYWdlVmlldyIsIm5hbWUiLCJFdmVudCIsImNhdGVnb3J5IiwiYWN0aW9uIiwibGFiZWwiLCJ2YWx1ZSIsIkV4Y2VwdGlvbiIsImRlc2NyaXB0aW9uIiwiZmF0YWwiLCJjc0V2ZW50IiwiY3NFeGNlcHRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUdPLElBQU1BLE9BQU8sR0FBRyxnQkFBaEI7QUFFQSxJQUFNQyxNQUFNLEdBQUcsU0FBVEEsTUFBUyxHQUFNLENBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxDQU5NO0FBUUEsSUFBTUMsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQ0MsSUFBRCxFQUFVLENBQ2hDO0FBQ0QsQ0FGTTtLQUFNRCxRO0FBSU4sSUFBTUUsS0FBSyxHQUFHLFNBQVJBLEtBQVEsQ0FBQ0MsUUFBRCxFQUFXQyxNQUFYLEVBQW1CQyxLQUFuQixFQUFzQyxDQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBTnlELE1BQVpDLEtBQVksdUVBQU4sQ0FBTTtBQU8xRCxDQVBNO01BQU1KLEs7QUFTTixJQUFNSyxTQUFTLEdBQUcsU0FBWkEsU0FBWSxDQUFDQyxXQUFELEVBQWNDLEtBQWQsRUFBd0IsQ0FDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDRCxDQUxNO01BQU1GLFM7QUFPTixJQUFNRyxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFDUCxRQUFELEVBQVdDLE1BQVgsRUFBbUJDLEtBQW5CLEVBQXNDLENBQzNEOztBQUQyRCxNQUFaQyxLQUFZLHVFQUFOLENBQU07QUFFNUQsQ0FGTTtBQUdBLElBQU1LLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUNILFdBQUQsRUFBY0MsS0FBZCxFQUF3QixDQUNqRDtBQUNELENBRk0iLCJmaWxlIjoiY29udGVudC1zY3JpcHQuYTExYjE1ODY3NTRjZDA1YTBjZjkuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBSZWFjdEdBIGZyb20gXCJyZWFjdC1nYVwiO1xuLy8gQHRzLWV4cGVjdC1lcnJvciB0cy1taWdyYXRlKDI2OTEpIEZJWE1FOiBBbiBpbXBvcnQgcGF0aCBjYW5ub3QgZW5kIHdpdGggYSAnLnRzeCcgZXh0ZW5zaW9uLi4uLiBSZW1vdmUgdGhpcyBjb21tZW50IHRvIHNlZSB0aGUgZnVsbCBlcnJvciBtZXNzYWdlXG5pbXBvcnQgeyBtc2dCRyB9IGZyb20gXCIuL2R1dGlscy50c3hcIlxuXG5leHBvcnQgY29uc3QgVUFfQ09ERSA9ICdVQS0xNzAyMzA1NDUtMidcblxuZXhwb3J0IGNvbnN0IGluaXRHQSA9ICgpID0+IHtcbiAgLy8gUmVhY3RHQS5pbml0aWFsaXplKFVBX0NPREUsIHtcbiAgLy8gICBkZWJ1ZzogZmFsc2UsXG4gIC8vICAgdGl0bGVDYXNlOiBmYWxzZSxcbiAgLy8gfSk7XG4gIC8vIFJlYWN0R0EuZ2EoJ3NldCcsICdjaGVja1Byb3RvY29sVGFzaycsIG51bGwpO1xufTtcblxuZXhwb3J0IGNvbnN0IFBhZ2VWaWV3ID0gKG5hbWUpID0+IHtcbiAgLy8gUmVhY3RHQS5wYWdldmlldyhuYW1lKTtcbn07XG5cbmV4cG9ydCBjb25zdCBFdmVudCA9IChjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWU9MCkgPT4ge1xuICAvLyBSZWFjdEdBLmV2ZW50KHtcbiAgLy8gICBjYXRlZ29yeSxcbiAgLy8gICBhY3Rpb24sXG4gIC8vICAgbGFiZWwsXG4gIC8vICAgdmFsdWVcbiAgLy8gfSk7XG59O1xuXG5leHBvcnQgY29uc3QgRXhjZXB0aW9uID0gKGRlc2NyaXB0aW9uLCBmYXRhbCkgPT4ge1xuICAvLyByZXR1cm4gUmVhY3RHQS5leGNlcHRpb24oe1xuICAvLyBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gIC8vIGZhdGFsOiBmYXRhbFxuICAvLyB9KVxufTtcblxuZXhwb3J0IGNvbnN0IGNzRXZlbnQgPSAoY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlPTApID0+IHtcbiAgLy8gbXNnQkcoe3R5cGU6ICdnYUV2ZW50JywgZXZlbnQ6IHtjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWV9fSlcbn1cbmV4cG9ydCBjb25zdCBjc0V4Y2VwdGlvbiA9IChkZXNjcmlwdGlvbiwgZmF0YWwpID0+IHtcbiAgLy8gbXNnQkcoe3R5cGU6ICdnYUV4Y2VwdGlvbicsIGV4Y2VwdGlvbjoge2Rlc2NyaXB0aW9uLCBmYXRhbH19KVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==