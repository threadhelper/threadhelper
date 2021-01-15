webpackHotUpdate("content-script",{

/***/ "./src/ts/utils/defaultStg.tsx":
/*!*************************************!*\
  !*** ./src/ts/utils/defaultStg.tsx ***!
  \*************************************/
/*! exports provided: defaultOptions, defaultStorage, devStorage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__prefresh_utils__, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultOptions", function() { return defaultOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultStorage", function() { return defaultStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "devStorage", function() { return devStorage; });
!(function webpackMissingModule() { var e = new Error("Cannot find module '../dev/accounts.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _dev_results_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dev/results.js */ "./src/ts/dev/results.js");
// DEFAULT OPTIONS V IMPORTANT
var defaultOptions = function defaultOptions() {
  return {
    name: 'options',
    getRTs: {
      name: 'getRTs',
      type: 'searchFilter',
      value: true
    },
    useBookmarks: {
      name: 'useBookmarks',
      type: 'searchFilter',
      value: true
    },
    useReplies: {
      name: 'useReplies',
      type: 'searchFilter',
      value: true
    },
    idleMode: {
      name: 'idleMode',
      type: 'idleMode',
      value: 'timeline'
    },
    // {'random', 'timeline'}
    roboActive: {
      name: 'roboActive',
      type: 'featureFilter',
      value: false
    },
    searchMode: {
      name: 'searchMode',
      type: 'searchMode',
      value: 'semantic'
    } // {'fulltext', 'semantic'}

  };
};
var defaultStorage = function defaultStorage() {
  return {
    options: defaultOptions(),
    hasArchive: false,
    hasTimeline: {},
    // {id_str: Bool}
    activeAccounts: [],
    //{screen_name: String, id_str: String, showTweets: Bool, ...}
    latest_tweets: [],
    search_results: [],
    temp_archive: [],
    syncDisplay: "Hi, I don't have any tweets yet.",
    sync: false
  };
};


var devStorage = function devStorage() {
  return {
    options: defaultOptions(),
    hasArchive: false,
    hasTimeline: {},
    // {id_str: Bool}
    activeAccounts: !(function webpackMissingModule() { var e = new Error("Cannot find module '../dev/accounts.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
    //{screen_name: String, id_str: String, showTweets: Bool, ...}
    latest_tweets: _dev_results_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    search_results: _dev_results_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    temp_archive: [],
    syncDisplay: "Hi, I don't have any tweets yet.",
    sync: true
  };
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvZGVmYXVsdFN0Zy50c3giXSwibmFtZXMiOlsiZGVmYXVsdE9wdGlvbnMiLCJuYW1lIiwiZ2V0UlRzIiwidHlwZSIsInZhbHVlIiwidXNlQm9va21hcmtzIiwidXNlUmVwbGllcyIsImlkbGVNb2RlIiwicm9ib0FjdGl2ZSIsInNlYXJjaE1vZGUiLCJkZWZhdWx0U3RvcmFnZSIsIm9wdGlvbnMiLCJoYXNBcmNoaXZlIiwiaGFzVGltZWxpbmUiLCJhY3RpdmVBY2NvdW50cyIsImxhdGVzdF90d2VldHMiLCJzZWFyY2hfcmVzdWx0cyIsInRlbXBfYXJjaGl2ZSIsInN5bmNEaXNwbGF5Iiwic3luYyIsImRldlN0b3JhZ2UiLCJhY2NvdW50cyIsInJlc3VsdHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNPLElBQU1BLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsR0FBZTtBQUFDLFNBQU87QUFDbkRDLFFBQUksRUFBRSxTQUQ2QztBQUVuREMsVUFBTSxFQUFFO0FBQUNELFVBQUksRUFBQyxRQUFOO0FBQWdCRSxVQUFJLEVBQUMsY0FBckI7QUFBcUNDLFdBQUssRUFBQztBQUEzQyxLQUYyQztBQUduREMsZ0JBQVksRUFBRTtBQUFDSixVQUFJLEVBQUMsY0FBTjtBQUFzQkUsVUFBSSxFQUFDLGNBQTNCO0FBQTJDQyxXQUFLLEVBQUM7QUFBakQsS0FIcUM7QUFJbkRFLGNBQVUsRUFBRTtBQUFDTCxVQUFJLEVBQUMsWUFBTjtBQUFvQkUsVUFBSSxFQUFDLGNBQXpCO0FBQXlDQyxXQUFLLEVBQUM7QUFBL0MsS0FKdUM7QUFLbkRHLFlBQVEsRUFBRTtBQUFDTixVQUFJLEVBQUMsVUFBTjtBQUFrQkUsVUFBSSxFQUFDLFVBQXZCO0FBQW1DQyxXQUFLLEVBQUM7QUFBekMsS0FMeUM7QUFLYTtBQUNoRUksY0FBVSxFQUFFO0FBQUNQLFVBQUksRUFBQyxZQUFOO0FBQW9CRSxVQUFJLEVBQUMsZUFBekI7QUFBMENDLFdBQUssRUFBQztBQUFoRCxLQU51QztBQU9uREssY0FBVSxFQUFFO0FBQUNSLFVBQUksRUFBQyxZQUFOO0FBQW9CRSxVQUFJLEVBQUMsWUFBekI7QUFBdUNDLFdBQUssRUFBQztBQUE3QyxLQVB1QyxDQU9tQjs7QUFQbkIsR0FBUDtBQVE1QyxDQVJLO0FBVUEsSUFBTU0sY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixHQUF3QjtBQUNwRCxTQUFNO0FBQ0pDLFdBQU8sRUFBQ1gsY0FBYyxFQURsQjtBQUVKWSxjQUFVLEVBQUUsS0FGUjtBQUdKQyxlQUFXLEVBQUUsRUFIVDtBQUdhO0FBQ2pCQyxrQkFBYyxFQUFFLEVBSlo7QUFJZ0I7QUFDcEJDLGlCQUFhLEVBQUUsRUFMWDtBQU1KQyxrQkFBYyxFQUFFLEVBTlo7QUFPSkMsZ0JBQVksRUFBRSxFQVBWO0FBUUpDLGVBQVcsb0NBUlA7QUFTSkMsUUFBSSxFQUFFO0FBVEYsR0FBTjtBQVdELENBWk07QUFjUDtBQUNBO0FBQ08sSUFBTUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsR0FBd0I7QUFDaEQsU0FBTTtBQUNKVCxXQUFPLEVBQUNYLGNBQWMsRUFEbEI7QUFFSlksY0FBVSxFQUFFLEtBRlI7QUFHSkMsZUFBVyxFQUFFLEVBSFQ7QUFHYTtBQUNqQkMsa0JBQWMsRUFBRU8sNElBSlo7QUFJc0I7QUFDMUJOLGlCQUFhLEVBQUVPLHVEQUxYO0FBTUpOLGtCQUFjLEVBQUVNLHVEQU5aO0FBT0pMLGdCQUFZLEVBQUUsRUFQVjtBQVFKQyxlQUFXLG9DQVJQO0FBU0pDLFFBQUksRUFBRTtBQVRGLEdBQU47QUFXRCxDQVpNIiwiZmlsZSI6ImNvbnRlbnQtc2NyaXB0LmFlZmMwMmVkZmE2MTlhYzhkMDE5LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcHRpb25zLCBTdG9yYWdlSW50ZXJmYWNlIH0gZnJvbSBcIi4uL3R5cGVzL3N0Z1R5cGVzXCJcblxuLy8gREVGQVVMVCBPUFRJT05TIFYgSU1QT1JUQU5UXG5leHBvcnQgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSAoKTogT3B0aW9ucyA9PiB7cmV0dXJuIHtcbiAgbmFtZTogJ29wdGlvbnMnLFxuICBnZXRSVHM6IHtuYW1lOidnZXRSVHMnLCB0eXBlOidzZWFyY2hGaWx0ZXInLCB2YWx1ZTp0cnVlfSxcbiAgdXNlQm9va21hcmtzOiB7bmFtZTondXNlQm9va21hcmtzJywgdHlwZTonc2VhcmNoRmlsdGVyJywgdmFsdWU6dHJ1ZX0sXG4gIHVzZVJlcGxpZXM6IHtuYW1lOid1c2VSZXBsaWVzJywgdHlwZTonc2VhcmNoRmlsdGVyJywgdmFsdWU6dHJ1ZX0sXG4gIGlkbGVNb2RlOiB7bmFtZTonaWRsZU1vZGUnLCB0eXBlOidpZGxlTW9kZScsIHZhbHVlOid0aW1lbGluZSd9LCAvLyB7J3JhbmRvbScsICd0aW1lbGluZSd9XG4gIHJvYm9BY3RpdmU6IHtuYW1lOidyb2JvQWN0aXZlJywgdHlwZTonZmVhdHVyZUZpbHRlcicsIHZhbHVlOmZhbHNlfSxcbiAgc2VhcmNoTW9kZToge25hbWU6J3NlYXJjaE1vZGUnLCB0eXBlOidzZWFyY2hNb2RlJywgdmFsdWU6J3NlbWFudGljJ30sIC8vIHsnZnVsbHRleHQnLCAnc2VtYW50aWMnfVxufX1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRTdG9yYWdlID0gKCk6IFN0b3JhZ2VJbnRlcmZhY2UgPT4ge1xuICByZXR1cm57XG4gICAgb3B0aW9uczpkZWZhdWx0T3B0aW9ucygpLFxuICAgIGhhc0FyY2hpdmU6IGZhbHNlLFxuICAgIGhhc1RpbWVsaW5lOiB7fSwgLy8ge2lkX3N0cjogQm9vbH1cbiAgICBhY3RpdmVBY2NvdW50czogW10sIC8ve3NjcmVlbl9uYW1lOiBTdHJpbmcsIGlkX3N0cjogU3RyaW5nLCBzaG93VHdlZXRzOiBCb29sLCAuLi59XG4gICAgbGF0ZXN0X3R3ZWV0czogW10sXG4gICAgc2VhcmNoX3Jlc3VsdHM6IFtdLFxuICAgIHRlbXBfYXJjaGl2ZTogW10sXG4gICAgc3luY0Rpc3BsYXk6IGBIaSwgSSBkb24ndCBoYXZlIGFueSB0d2VldHMgeWV0LmAsXG4gICAgc3luYzogZmFsc2UsXG4gIH1cbn1cblxuaW1wb3J0IGFjY291bnRzIGZyb20gJy4uL2Rldi9hY2NvdW50cy5qcydcbmltcG9ydCByZXN1bHRzIGZyb20gJy4uL2Rldi9yZXN1bHRzLmpzJ1xuZXhwb3J0IGNvbnN0IGRldlN0b3JhZ2UgPSAoKTogU3RvcmFnZUludGVyZmFjZSA9PiB7XG4gIHJldHVybntcbiAgICBvcHRpb25zOmRlZmF1bHRPcHRpb25zKCksXG4gICAgaGFzQXJjaGl2ZTogZmFsc2UsXG4gICAgaGFzVGltZWxpbmU6IHt9LCAvLyB7aWRfc3RyOiBCb29sfVxuICAgIGFjdGl2ZUFjY291bnRzOiBhY2NvdW50cywgLy97c2NyZWVuX25hbWU6IFN0cmluZywgaWRfc3RyOiBTdHJpbmcsIHNob3dUd2VldHM6IEJvb2wsIC4uLn1cbiAgICBsYXRlc3RfdHdlZXRzOiByZXN1bHRzLFxuICAgIHNlYXJjaF9yZXN1bHRzOiByZXN1bHRzLFxuICAgIHRlbXBfYXJjaGl2ZTogW10sXG4gICAgc3luY0Rpc3BsYXk6IGBIaSwgSSBkb24ndCBoYXZlIGFueSB0d2VldHMgeWV0LmAsXG4gICAgc3luYzogdHJ1ZSxcbiAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0=