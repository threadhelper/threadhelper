webpackHotUpdate("background",{

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
    activeAccounts: [],
    //{screen_name: String, id_str: String, showTweets: Bool, ...}
    latest_tweets: [],
    search_results: [],
    temp_archive: [],
    syncDisplay: "Hi, I don't have any tweets yet.",
    sync: false
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvdXRpbHMvZGVmYXVsdFN0Zy50c3giXSwibmFtZXMiOlsiZGVmYXVsdE9wdGlvbnMiLCJuYW1lIiwiZ2V0UlRzIiwidHlwZSIsInZhbHVlIiwidXNlQm9va21hcmtzIiwidXNlUmVwbGllcyIsImlkbGVNb2RlIiwicm9ib0FjdGl2ZSIsInNlYXJjaE1vZGUiLCJkZWZhdWx0U3RvcmFnZSIsIm9wdGlvbnMiLCJoYXNBcmNoaXZlIiwiaGFzVGltZWxpbmUiLCJhY3RpdmVBY2NvdW50cyIsImxhdGVzdF90d2VldHMiLCJzZWFyY2hfcmVzdWx0cyIsInRlbXBfYXJjaGl2ZSIsInN5bmNEaXNwbGF5Iiwic3luYyIsImRldlN0b3JhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ08sSUFBTUEsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixHQUFlO0FBQUMsU0FBTztBQUNuREMsUUFBSSxFQUFFLFNBRDZDO0FBRW5EQyxVQUFNLEVBQUU7QUFBQ0QsVUFBSSxFQUFDLFFBQU47QUFBZ0JFLFVBQUksRUFBQyxjQUFyQjtBQUFxQ0MsV0FBSyxFQUFDO0FBQTNDLEtBRjJDO0FBR25EQyxnQkFBWSxFQUFFO0FBQUNKLFVBQUksRUFBQyxjQUFOO0FBQXNCRSxVQUFJLEVBQUMsY0FBM0I7QUFBMkNDLFdBQUssRUFBQztBQUFqRCxLQUhxQztBQUluREUsY0FBVSxFQUFFO0FBQUNMLFVBQUksRUFBQyxZQUFOO0FBQW9CRSxVQUFJLEVBQUMsY0FBekI7QUFBeUNDLFdBQUssRUFBQztBQUEvQyxLQUp1QztBQUtuREcsWUFBUSxFQUFFO0FBQUNOLFVBQUksRUFBQyxVQUFOO0FBQWtCRSxVQUFJLEVBQUMsVUFBdkI7QUFBbUNDLFdBQUssRUFBQztBQUF6QyxLQUx5QztBQUthO0FBQ2hFSSxjQUFVLEVBQUU7QUFBQ1AsVUFBSSxFQUFDLFlBQU47QUFBb0JFLFVBQUksRUFBQyxlQUF6QjtBQUEwQ0MsV0FBSyxFQUFDO0FBQWhELEtBTnVDO0FBT25ESyxjQUFVLEVBQUU7QUFBQ1IsVUFBSSxFQUFDLFlBQU47QUFBb0JFLFVBQUksRUFBQyxZQUF6QjtBQUF1Q0MsV0FBSyxFQUFDO0FBQTdDLEtBUHVDLENBT21COztBQVBuQixHQUFQO0FBUTVDLENBUks7QUFVQSxJQUFNTSxjQUFjLEdBQUcsU0FBakJBLGNBQWlCLEdBQXdCO0FBQ3BELFNBQU07QUFDSkMsV0FBTyxFQUFDWCxjQUFjLEVBRGxCO0FBRUpZLGNBQVUsRUFBRSxLQUZSO0FBR0pDLGVBQVcsRUFBRSxFQUhUO0FBR2E7QUFDakJDLGtCQUFjLEVBQUUsRUFKWjtBQUlnQjtBQUNwQkMsaUJBQWEsRUFBRSxFQUxYO0FBTUpDLGtCQUFjLEVBQUUsRUFOWjtBQU9KQyxnQkFBWSxFQUFFLEVBUFY7QUFRSkMsZUFBVyxvQ0FSUDtBQVNKQyxRQUFJLEVBQUU7QUFURixHQUFOO0FBV0QsQ0FaTTtBQWdCQSxJQUFNQyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxHQUF3QjtBQUNoRCxTQUFNO0FBQ0pULFdBQU8sRUFBQ1gsY0FBYyxFQURsQjtBQUVKWSxjQUFVLEVBQUUsS0FGUjtBQUdKQyxlQUFXLEVBQUUsRUFIVDtBQUdhO0FBQ2pCQyxrQkFBYyxFQUFFLEVBSlo7QUFJZ0I7QUFDcEJDLGlCQUFhLEVBQUUsRUFMWDtBQU1KQyxrQkFBYyxFQUFFLEVBTlo7QUFPSkMsZ0JBQVksRUFBRSxFQVBWO0FBUUpDLGVBQVcsb0NBUlA7QUFTSkMsUUFBSSxFQUFFO0FBVEYsR0FBTjtBQVdELENBWk0iLCJmaWxlIjoiYmFja2dyb3VuZC45ZTY0NDhiZWRjOTdkMWEzMmVkZS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3B0aW9ucywgU3RvcmFnZUludGVyZmFjZSB9IGZyb20gXCIuLi90eXBlcy9zdGdUeXBlc1wiXG5cbi8vIERFRkFVTFQgT1BUSU9OUyBWIElNUE9SVEFOVFxuZXhwb3J0IGNvbnN0IGRlZmF1bHRPcHRpb25zID0gKCk6IE9wdGlvbnMgPT4ge3JldHVybiB7XG4gIG5hbWU6ICdvcHRpb25zJyxcbiAgZ2V0UlRzOiB7bmFtZTonZ2V0UlRzJywgdHlwZTonc2VhcmNoRmlsdGVyJywgdmFsdWU6dHJ1ZX0sXG4gIHVzZUJvb2ttYXJrczoge25hbWU6J3VzZUJvb2ttYXJrcycsIHR5cGU6J3NlYXJjaEZpbHRlcicsIHZhbHVlOnRydWV9LFxuICB1c2VSZXBsaWVzOiB7bmFtZTondXNlUmVwbGllcycsIHR5cGU6J3NlYXJjaEZpbHRlcicsIHZhbHVlOnRydWV9LFxuICBpZGxlTW9kZToge25hbWU6J2lkbGVNb2RlJywgdHlwZTonaWRsZU1vZGUnLCB2YWx1ZTondGltZWxpbmUnfSwgLy8geydyYW5kb20nLCAndGltZWxpbmUnfVxuICByb2JvQWN0aXZlOiB7bmFtZToncm9ib0FjdGl2ZScsIHR5cGU6J2ZlYXR1cmVGaWx0ZXInLCB2YWx1ZTpmYWxzZX0sXG4gIHNlYXJjaE1vZGU6IHtuYW1lOidzZWFyY2hNb2RlJywgdHlwZTonc2VhcmNoTW9kZScsIHZhbHVlOidzZW1hbnRpYyd9LCAvLyB7J2Z1bGx0ZXh0JywgJ3NlbWFudGljJ31cbn19XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0U3RvcmFnZSA9ICgpOiBTdG9yYWdlSW50ZXJmYWNlID0+IHtcbiAgcmV0dXJue1xuICAgIG9wdGlvbnM6ZGVmYXVsdE9wdGlvbnMoKSxcbiAgICBoYXNBcmNoaXZlOiBmYWxzZSxcbiAgICBoYXNUaW1lbGluZToge30sIC8vIHtpZF9zdHI6IEJvb2x9XG4gICAgYWN0aXZlQWNjb3VudHM6IFtdLCAvL3tzY3JlZW5fbmFtZTogU3RyaW5nLCBpZF9zdHI6IFN0cmluZywgc2hvd1R3ZWV0czogQm9vbCwgLi4ufVxuICAgIGxhdGVzdF90d2VldHM6IFtdLFxuICAgIHNlYXJjaF9yZXN1bHRzOiBbXSxcbiAgICB0ZW1wX2FyY2hpdmU6IFtdLFxuICAgIHN5bmNEaXNwbGF5OiBgSGksIEkgZG9uJ3QgaGF2ZSBhbnkgdHdlZXRzIHlldC5gLFxuICAgIHN5bmM6IGZhbHNlLFxuICB9XG59XG5cbmltcG9ydCBhY2NvdW50cyBmcm9tICcuLi9kZXYvYWNjb3VudHMnXG5pbXBvcnQgcmVzdWx0cyBmcm9tICcuLi9kZXYvcmVzdWx0cydcbmV4cG9ydCBjb25zdCBkZXZTdG9yYWdlID0gKCk6IFN0b3JhZ2VJbnRlcmZhY2UgPT4ge1xuICByZXR1cm57XG4gICAgb3B0aW9uczpkZWZhdWx0T3B0aW9ucygpLFxuICAgIGhhc0FyY2hpdmU6IGZhbHNlLFxuICAgIGhhc1RpbWVsaW5lOiB7fSwgLy8ge2lkX3N0cjogQm9vbH1cbiAgICBhY3RpdmVBY2NvdW50czogW10sIC8ve3NjcmVlbl9uYW1lOiBTdHJpbmcsIGlkX3N0cjogU3RyaW5nLCBzaG93VHdlZXRzOiBCb29sLCAuLi59XG4gICAgbGF0ZXN0X3R3ZWV0czogW10sXG4gICAgc2VhcmNoX3Jlc3VsdHM6IFtdLFxuICAgIHRlbXBfYXJjaGl2ZTogW10sXG4gICAgc3luY0Rpc3BsYXk6IGBIaSwgSSBkb24ndCBoYXZlIGFueSB0d2VldHMgeWV0LmAsXG4gICAgc3luYzogZmFsc2UsXG4gIH1cbn0iXSwic291cmNlUm9vdCI6IiJ9