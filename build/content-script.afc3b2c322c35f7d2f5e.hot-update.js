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
// import { msgBG } from "./dutils.tsx"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvZ2EudHN4Il0sIm5hbWVzIjpbIlVBX0NPREUiLCJpbml0R0EiLCJQYWdlVmlldyIsIm5hbWUiLCJFdmVudCIsImNhdGVnb3J5IiwiYWN0aW9uIiwibGFiZWwiLCJ2YWx1ZSIsIkV4Y2VwdGlvbiIsImRlc2NyaXB0aW9uIiwiZmF0YWwiLCJjc0V2ZW50IiwiY3NFeGNlcHRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRU8sSUFBTUEsT0FBTyxHQUFHLGdCQUFoQjtBQUVBLElBQU1DLE1BQU0sR0FBRyxTQUFUQSxNQUFTLEdBQU0sQ0FDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNELENBTk07QUFRQSxJQUFNQyxRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFDQyxJQUFELEVBQVUsQ0FDaEM7QUFDRCxDQUZNO0tBQU1ELFE7QUFJTixJQUFNRSxLQUFLLEdBQUcsU0FBUkEsS0FBUSxDQUFDQyxRQUFELEVBQVdDLE1BQVgsRUFBbUJDLEtBQW5CLEVBQXNDLENBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFOeUQsTUFBWkMsS0FBWSx1RUFBTixDQUFNO0FBTzFELENBUE07TUFBTUosSztBQVNOLElBQU1LLFNBQVMsR0FBRyxTQUFaQSxTQUFZLENBQUNDLFdBQUQsRUFBY0MsS0FBZCxFQUF3QixDQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNELENBTE07TUFBTUYsUztBQU9OLElBQU1HLE9BQU8sR0FBRyxTQUFWQSxPQUFVLENBQUNQLFFBQUQsRUFBV0MsTUFBWCxFQUFtQkMsS0FBbkIsRUFBc0MsQ0FDM0Q7O0FBRDJELE1BQVpDLEtBQVksdUVBQU4sQ0FBTTtBQUU1RCxDQUZNO0FBR0EsSUFBTUssV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ0gsV0FBRCxFQUFjQyxLQUFkLEVBQXdCLENBQ2pEO0FBQ0QsQ0FGTSIsImZpbGUiOiJjb250ZW50LXNjcmlwdC5hZmMzYjJjMzIyYzM1ZjdkMmY1ZS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0R0EgZnJvbSBcInJlYWN0LWdhXCI7XG4vLyBAdHMtZXhwZWN0LWVycm9yIHRzLW1pZ3JhdGUoMjY5MSkgRklYTUU6IEFuIGltcG9ydCBwYXRoIGNhbm5vdCBlbmQgd2l0aCBhICcudHN4JyBleHRlbnNpb24uLi4uIFJlbW92ZSB0aGlzIGNvbW1lbnQgdG8gc2VlIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2Vcbi8vIGltcG9ydCB7IG1zZ0JHIH0gZnJvbSBcIi4vZHV0aWxzLnRzeFwiXG5cbmV4cG9ydCBjb25zdCBVQV9DT0RFID0gJ1VBLTE3MDIzMDU0NS0yJ1xuXG5leHBvcnQgY29uc3QgaW5pdEdBID0gKCkgPT4ge1xuICAvLyBSZWFjdEdBLmluaXRpYWxpemUoVUFfQ09ERSwge1xuICAvLyAgIGRlYnVnOiBmYWxzZSxcbiAgLy8gICB0aXRsZUNhc2U6IGZhbHNlLFxuICAvLyB9KTtcbiAgLy8gUmVhY3RHQS5nYSgnc2V0JywgJ2NoZWNrUHJvdG9jb2xUYXNrJywgbnVsbCk7XG59O1xuXG5leHBvcnQgY29uc3QgUGFnZVZpZXcgPSAobmFtZSkgPT4ge1xuICAvLyBSZWFjdEdBLnBhZ2V2aWV3KG5hbWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IEV2ZW50ID0gKGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZT0wKSA9PiB7XG4gIC8vIFJlYWN0R0EuZXZlbnQoe1xuICAvLyAgIGNhdGVnb3J5LFxuICAvLyAgIGFjdGlvbixcbiAgLy8gICBsYWJlbCxcbiAgLy8gICB2YWx1ZVxuICAvLyB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBFeGNlcHRpb24gPSAoZGVzY3JpcHRpb24sIGZhdGFsKSA9PiB7XG4gIC8vIHJldHVybiBSZWFjdEdBLmV4Y2VwdGlvbih7XG4gIC8vIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcbiAgLy8gZmF0YWw6IGZhdGFsXG4gIC8vIH0pXG59O1xuXG5leHBvcnQgY29uc3QgY3NFdmVudCA9IChjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWU9MCkgPT4ge1xuICAvLyBtc2dCRyh7dHlwZTogJ2dhRXZlbnQnLCBldmVudDoge2NhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZX19KVxufVxuZXhwb3J0IGNvbnN0IGNzRXhjZXB0aW9uID0gKGRlc2NyaXB0aW9uLCBmYXRhbCkgPT4ge1xuICAvLyBtc2dCRyh7dHlwZTogJ2dhRXhjZXB0aW9uJywgZXhjZXB0aW9uOiB7ZGVzY3JpcHRpb24sIGZhdGFsfX0pXG59XG4iXSwic291cmNlUm9vdCI6IiJ9