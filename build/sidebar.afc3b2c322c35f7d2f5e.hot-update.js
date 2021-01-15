webpackHotUpdate("sidebar",{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvZ2EudHN4Il0sIm5hbWVzIjpbIlVBX0NPREUiLCJpbml0R0EiLCJQYWdlVmlldyIsIm5hbWUiLCJFdmVudCIsImNhdGVnb3J5IiwiYWN0aW9uIiwibGFiZWwiLCJ2YWx1ZSIsIkV4Y2VwdGlvbiIsImRlc2NyaXB0aW9uIiwiZmF0YWwiLCJjc0V2ZW50IiwiY3NFeGNlcHRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRU8sSUFBTUEsT0FBTyxHQUFHLGdCQUFoQjtBQUVBLElBQU1DLE1BQU0sR0FBRyxTQUFUQSxNQUFTLEdBQU0sQ0FDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNELENBTk07QUFRQSxJQUFNQyxRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFDQyxJQUFELEVBQVUsQ0FDaEM7QUFDRCxDQUZNO0tBQU1ELFE7QUFJTixJQUFNRSxLQUFLLEdBQUcsU0FBUkEsS0FBUSxDQUFDQyxRQUFELEVBQVdDLE1BQVgsRUFBbUJDLEtBQW5CLEVBQXNDLENBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFOeUQsTUFBWkMsS0FBWSx1RUFBTixDQUFNO0FBTzFELENBUE07TUFBTUosSztBQVNOLElBQU1LLFNBQVMsR0FBRyxTQUFaQSxTQUFZLENBQUNDLFdBQUQsRUFBY0MsS0FBZCxFQUF3QixDQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNELENBTE07TUFBTUYsUztBQU9OLElBQU1HLE9BQU8sR0FBRyxTQUFWQSxPQUFVLENBQUNQLFFBQUQsRUFBV0MsTUFBWCxFQUFtQkMsS0FBbkIsRUFBc0MsQ0FDM0Q7O0FBRDJELE1BQVpDLEtBQVksdUVBQU4sQ0FBTTtBQUU1RCxDQUZNO0FBR0EsSUFBTUssV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ0gsV0FBRCxFQUFjQyxLQUFkLEVBQXdCLENBQ2pEO0FBQ0QsQ0FGTSIsImZpbGUiOiJzaWRlYmFyLmFmYzNiMmMzMjJjMzVmN2QyZjVlLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUmVhY3RHQSBmcm9tIFwicmVhY3QtZ2FcIjtcbi8vIEB0cy1leHBlY3QtZXJyb3IgdHMtbWlncmF0ZSgyNjkxKSBGSVhNRTogQW4gaW1wb3J0IHBhdGggY2Fubm90IGVuZCB3aXRoIGEgJy50c3gnIGV4dGVuc2lvbi4uLi4gUmVtb3ZlIHRoaXMgY29tbWVudCB0byBzZWUgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZVxuLy8gaW1wb3J0IHsgbXNnQkcgfSBmcm9tIFwiLi9kdXRpbHMudHN4XCJcblxuZXhwb3J0IGNvbnN0IFVBX0NPREUgPSAnVUEtMTcwMjMwNTQ1LTInXG5cbmV4cG9ydCBjb25zdCBpbml0R0EgPSAoKSA9PiB7XG4gIC8vIFJlYWN0R0EuaW5pdGlhbGl6ZShVQV9DT0RFLCB7XG4gIC8vICAgZGVidWc6IGZhbHNlLFxuICAvLyAgIHRpdGxlQ2FzZTogZmFsc2UsXG4gIC8vIH0pO1xuICAvLyBSZWFjdEdBLmdhKCdzZXQnLCAnY2hlY2tQcm90b2NvbFRhc2snLCBudWxsKTtcbn07XG5cbmV4cG9ydCBjb25zdCBQYWdlVmlldyA9IChuYW1lKSA9PiB7XG4gIC8vIFJlYWN0R0EucGFnZXZpZXcobmFtZSk7XG59O1xuXG5leHBvcnQgY29uc3QgRXZlbnQgPSAoY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlPTApID0+IHtcbiAgLy8gUmVhY3RHQS5ldmVudCh7XG4gIC8vICAgY2F0ZWdvcnksXG4gIC8vICAgYWN0aW9uLFxuICAvLyAgIGxhYmVsLFxuICAvLyAgIHZhbHVlXG4gIC8vIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IEV4Y2VwdGlvbiA9IChkZXNjcmlwdGlvbiwgZmF0YWwpID0+IHtcbiAgLy8gcmV0dXJuIFJlYWN0R0EuZXhjZXB0aW9uKHtcbiAgLy8gZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAvLyBmYXRhbDogZmF0YWxcbiAgLy8gfSlcbn07XG5cbmV4cG9ydCBjb25zdCBjc0V2ZW50ID0gKGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZT0wKSA9PiB7XG4gIC8vIG1zZ0JHKHt0eXBlOiAnZ2FFdmVudCcsIGV2ZW50OiB7Y2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlfX0pXG59XG5leHBvcnQgY29uc3QgY3NFeGNlcHRpb24gPSAoZGVzY3JpcHRpb24sIGZhdGFsKSA9PiB7XG4gIC8vIG1zZ0JHKHt0eXBlOiAnZ2FFeGNlcHRpb24nLCBleGNlcHRpb246IHtkZXNjcmlwdGlvbiwgZmF0YWx9fSlcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=