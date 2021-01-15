webpackHotUpdate("sidebar",{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvZGVmYXVsdFN0Zy50c3giXSwibmFtZXMiOlsiZGVmYXVsdE9wdGlvbnMiLCJuYW1lIiwiZ2V0UlRzIiwidHlwZSIsInZhbHVlIiwidXNlQm9va21hcmtzIiwidXNlUmVwbGllcyIsImlkbGVNb2RlIiwicm9ib0FjdGl2ZSIsInNlYXJjaE1vZGUiLCJkZWZhdWx0U3RvcmFnZSIsIm9wdGlvbnMiLCJoYXNBcmNoaXZlIiwiaGFzVGltZWxpbmUiLCJhY3RpdmVBY2NvdW50cyIsImxhdGVzdF90d2VldHMiLCJzZWFyY2hfcmVzdWx0cyIsInRlbXBfYXJjaGl2ZSIsInN5bmNEaXNwbGF5Iiwic3luYyIsImRldlN0b3JhZ2UiLCJhY2NvdW50cyIsInJlc3VsdHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNPLElBQU1BLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsR0FBZTtBQUFDLFNBQU87QUFDbkRDLFFBQUksRUFBRSxTQUQ2QztBQUVuREMsVUFBTSxFQUFFO0FBQUNELFVBQUksRUFBQyxRQUFOO0FBQWdCRSxVQUFJLEVBQUMsY0FBckI7QUFBcUNDLFdBQUssRUFBQztBQUEzQyxLQUYyQztBQUduREMsZ0JBQVksRUFBRTtBQUFDSixVQUFJLEVBQUMsY0FBTjtBQUFzQkUsVUFBSSxFQUFDLGNBQTNCO0FBQTJDQyxXQUFLLEVBQUM7QUFBakQsS0FIcUM7QUFJbkRFLGNBQVUsRUFBRTtBQUFDTCxVQUFJLEVBQUMsWUFBTjtBQUFvQkUsVUFBSSxFQUFDLGNBQXpCO0FBQXlDQyxXQUFLLEVBQUM7QUFBL0MsS0FKdUM7QUFLbkRHLFlBQVEsRUFBRTtBQUFDTixVQUFJLEVBQUMsVUFBTjtBQUFrQkUsVUFBSSxFQUFDLFVBQXZCO0FBQW1DQyxXQUFLLEVBQUM7QUFBekMsS0FMeUM7QUFLYTtBQUNoRUksY0FBVSxFQUFFO0FBQUNQLFVBQUksRUFBQyxZQUFOO0FBQW9CRSxVQUFJLEVBQUMsZUFBekI7QUFBMENDLFdBQUssRUFBQztBQUFoRCxLQU51QztBQU9uREssY0FBVSxFQUFFO0FBQUNSLFVBQUksRUFBQyxZQUFOO0FBQW9CRSxVQUFJLEVBQUMsWUFBekI7QUFBdUNDLFdBQUssRUFBQztBQUE3QyxLQVB1QyxDQU9tQjs7QUFQbkIsR0FBUDtBQVE1QyxDQVJLO0FBVUEsSUFBTU0sY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixHQUF3QjtBQUNwRCxTQUFNO0FBQ0pDLFdBQU8sRUFBQ1gsY0FBYyxFQURsQjtBQUVKWSxjQUFVLEVBQUUsS0FGUjtBQUdKQyxlQUFXLEVBQUUsRUFIVDtBQUdhO0FBQ2pCQyxrQkFBYyxFQUFFLEVBSlo7QUFJZ0I7QUFDcEJDLGlCQUFhLEVBQUUsRUFMWDtBQU1KQyxrQkFBYyxFQUFFLEVBTlo7QUFPSkMsZ0JBQVksRUFBRSxFQVBWO0FBUUpDLGVBQVcsb0NBUlA7QUFTSkMsUUFBSSxFQUFFO0FBVEYsR0FBTjtBQVdELENBWk07QUFjUDtBQUNBO0FBQ08sSUFBTUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsR0FBd0I7QUFDaEQsU0FBTTtBQUNKVCxXQUFPLEVBQUNYLGNBQWMsRUFEbEI7QUFFSlksY0FBVSxFQUFFLEtBRlI7QUFHSkMsZUFBVyxFQUFFLEVBSFQ7QUFHYTtBQUNqQkMsa0JBQWMsRUFBRU8sNElBSlo7QUFJc0I7QUFDMUJOLGlCQUFhLEVBQUVPLHVEQUxYO0FBTUpOLGtCQUFjLEVBQUVNLHVEQU5aO0FBT0pMLGdCQUFZLEVBQUUsRUFQVjtBQVFKQyxlQUFXLG9DQVJQO0FBU0pDLFFBQUksRUFBRTtBQVRGLEdBQU47QUFXRCxDQVpNIiwiZmlsZSI6InNpZGViYXIuYWVmYzAyZWRmYTYxOWFjOGQwMTkuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wdGlvbnMsIFN0b3JhZ2VJbnRlcmZhY2UgfSBmcm9tIFwiLi4vdHlwZXMvc3RnVHlwZXNcIlxuXG4vLyBERUZBVUxUIE9QVElPTlMgViBJTVBPUlRBTlRcbmV4cG9ydCBjb25zdCBkZWZhdWx0T3B0aW9ucyA9ICgpOiBPcHRpb25zID0+IHtyZXR1cm4ge1xuICBuYW1lOiAnb3B0aW9ucycsXG4gIGdldFJUczoge25hbWU6J2dldFJUcycsIHR5cGU6J3NlYXJjaEZpbHRlcicsIHZhbHVlOnRydWV9LFxuICB1c2VCb29rbWFya3M6IHtuYW1lOid1c2VCb29rbWFya3MnLCB0eXBlOidzZWFyY2hGaWx0ZXInLCB2YWx1ZTp0cnVlfSxcbiAgdXNlUmVwbGllczoge25hbWU6J3VzZVJlcGxpZXMnLCB0eXBlOidzZWFyY2hGaWx0ZXInLCB2YWx1ZTp0cnVlfSxcbiAgaWRsZU1vZGU6IHtuYW1lOidpZGxlTW9kZScsIHR5cGU6J2lkbGVNb2RlJywgdmFsdWU6J3RpbWVsaW5lJ30sIC8vIHsncmFuZG9tJywgJ3RpbWVsaW5lJ31cbiAgcm9ib0FjdGl2ZToge25hbWU6J3JvYm9BY3RpdmUnLCB0eXBlOidmZWF0dXJlRmlsdGVyJywgdmFsdWU6ZmFsc2V9LFxuICBzZWFyY2hNb2RlOiB7bmFtZTonc2VhcmNoTW9kZScsIHR5cGU6J3NlYXJjaE1vZGUnLCB2YWx1ZTonc2VtYW50aWMnfSwgLy8geydmdWxsdGV4dCcsICdzZW1hbnRpYyd9XG59fVxuXG5leHBvcnQgY29uc3QgZGVmYXVsdFN0b3JhZ2UgPSAoKTogU3RvcmFnZUludGVyZmFjZSA9PiB7XG4gIHJldHVybntcbiAgICBvcHRpb25zOmRlZmF1bHRPcHRpb25zKCksXG4gICAgaGFzQXJjaGl2ZTogZmFsc2UsXG4gICAgaGFzVGltZWxpbmU6IHt9LCAvLyB7aWRfc3RyOiBCb29sfVxuICAgIGFjdGl2ZUFjY291bnRzOiBbXSwgLy97c2NyZWVuX25hbWU6IFN0cmluZywgaWRfc3RyOiBTdHJpbmcsIHNob3dUd2VldHM6IEJvb2wsIC4uLn1cbiAgICBsYXRlc3RfdHdlZXRzOiBbXSxcbiAgICBzZWFyY2hfcmVzdWx0czogW10sXG4gICAgdGVtcF9hcmNoaXZlOiBbXSxcbiAgICBzeW5jRGlzcGxheTogYEhpLCBJIGRvbid0IGhhdmUgYW55IHR3ZWV0cyB5ZXQuYCxcbiAgICBzeW5jOiBmYWxzZSxcbiAgfVxufVxuXG5pbXBvcnQgYWNjb3VudHMgZnJvbSAnLi4vZGV2L2FjY291bnRzLmpzJ1xuaW1wb3J0IHJlc3VsdHMgZnJvbSAnLi4vZGV2L3Jlc3VsdHMuanMnXG5leHBvcnQgY29uc3QgZGV2U3RvcmFnZSA9ICgpOiBTdG9yYWdlSW50ZXJmYWNlID0+IHtcbiAgcmV0dXJue1xuICAgIG9wdGlvbnM6ZGVmYXVsdE9wdGlvbnMoKSxcbiAgICBoYXNBcmNoaXZlOiBmYWxzZSxcbiAgICBoYXNUaW1lbGluZToge30sIC8vIHtpZF9zdHI6IEJvb2x9XG4gICAgYWN0aXZlQWNjb3VudHM6IGFjY291bnRzLCAvL3tzY3JlZW5fbmFtZTogU3RyaW5nLCBpZF9zdHI6IFN0cmluZywgc2hvd1R3ZWV0czogQm9vbCwgLi4ufVxuICAgIGxhdGVzdF90d2VldHM6IHJlc3VsdHMsXG4gICAgc2VhcmNoX3Jlc3VsdHM6IHJlc3VsdHMsXG4gICAgdGVtcF9hcmNoaXZlOiBbXSxcbiAgICBzeW5jRGlzcGxheTogYEhpLCBJIGRvbid0IGhhdmUgYW55IHR3ZWV0cyB5ZXQuYCxcbiAgICBzeW5jOiB0cnVlLFxuICB9XG59Il0sInNvdXJjZVJvb3QiOiIifQ==