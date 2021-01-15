webpackHotUpdate("content-script",{

/***/ "./src/ts/components/LoadArchive.tsx":
/*!*******************************************!*\
  !*** ./src/ts/components/LoadArchive.tsx ***!
  \*******************************************/
/*! exports provided: ArchiveUploader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__prefresh_utils__, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArchiveUploader", function() { return ArchiveUploader; });
/* harmony import */ var preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact/jsx-runtime */ "./node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "./node_modules/preact/hooks/dist/hooks.module.js");
/* harmony import */ var _utils_dutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/dutils */ "./src/ts/utils/dutils.tsx");
/* harmony import */ var ramda__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ramda */ "./node_modules/ramda/es/index.js");
/* harmony import */ var _hooks_useStorage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hooks/useStorage */ "./src/ts/hooks/useStorage.tsx");
/* harmony import */ var _utils_ga__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/ga */ "./src/ts/utils/ga.tsx");



var _s = $RefreshSig$(),
    _s2 = $RefreshSig$();

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



// Function
 // Object

 // List

 // Logic, Type, Relation, String, Math



var DEVING = Object({"NODE_ENV":"development"}).DEV_MODE == 'serve';
var useStorage = DEVING ? _s(function (name) {
  _s();

  return Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useState"])(name);
}, "GTRNsdnKKfbdeG+zDCn86gfjco4=") : _hooks_useStorage__WEBPACK_IMPORTED_MODULE_4__["useStorage"];

function LoadArchiveIcon() {
  var tooltip = Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("span", {
    "class": "tooltiptext",
    children: [" Click here to upload your Twitter Archive. ", Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("a", {
      href: "https://twitter.com/settings/your_twitter_data",
      children: "Download an archive of your data"
    }), ", extract it and select data/tweet.js. "]
  });

  return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("div", {
    "class": "archive_icon",
    children: [Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("button", {
      children: "\uD83E\uDDFE Load Archive"
    }), tooltip]
  });
}

_c = LoadArchiveIcon;
var ArchiveUploader = function ArchiveUploader(props) {
  _s2();

  var _useStorage2 = useStorage('hasArchive', false),
      _useStorage3 = _slicedToArray(_useStorage2, 2),
      hasArchive = _useStorage3[0],
      setHasArchive = _useStorage3[1]; // Create a reference to the hidden file input element


  var hiddenFileInput = Object(preact_hooks__WEBPACK_IMPORTED_MODULE_1__["useRef"])(null); // Programatically click the hidden file input element
  // when the Button component is clicked

  var handleClick = function handleClick(event) {
    console.log('load archive clicked');
    Object(_utils_ga__WEBPACK_IMPORTED_MODULE_5__["csEvent"])('User', 'Load Archive click', ''); // ts-migrate(2531) FIXME: Object is possibly 'null'.

    hiddenFileInput.current.click();
  }; // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  // const handleChange = (e: { target: { files: any; }; }) => {


  var handleChange = function handleChange(e) {
    var files = e.target.files;
    {
      /* const files = e.target.files; */
    }
    console.log('arch files', files);
    var reader = new FileReader();
    reader.onload = importArchive;
    var file = Object(ramda__WEBPACK_IMPORTED_MODULE_3__["find"])(Object(ramda__WEBPACK_IMPORTED_MODULE_3__["propEq"])('name', "tweet.js"))(Array.from(files));
    console.log('arch file', file);

    try {
      reader.readAsText(file);
    } catch (e) {
      console.log('ERROR: Couldn\'t load archive');
      Object(_utils_ga__WEBPACK_IMPORTED_MODULE_5__["csException"])('Couldn\'t load archive', false);
    }
  }; // Parses json and stores in temp to be processed by BG


  function importArchive() {
    var result = this.result.replace(/^[a-z0-9A-Z\.]* = /, "");
    var importedTweetArchive = JSON.parse(result);
    Object(_utils_ga__WEBPACK_IMPORTED_MODULE_5__["csEvent"])('User', 'Loaded Archive', Object(ramda__WEBPACK_IMPORTED_MODULE_3__["defaultTo"])(0, importedTweetArchive.length));
    console.log('setting archive', importedTweetArchive);
    Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_2__["setStg"])('temp_archive', importedTweetArchive).then(function () {
      setHasArchive(true);
      Object(_utils_dutils__WEBPACK_IMPORTED_MODULE_2__["msgBG"])({
        type: "temp-archive-stored"
      });
      hiddenFileInput.current.value = null;
    });
  }

  return Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsxs"])("div", {
    onClick: handleClick,
    children: [Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])(LoadArchiveIcon, {}), Object(preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__["jsx"])("input", {
      type: "file",
      accept: ".json,.js",
      ref: hiddenFileInput,
      onChange: handleChange,
      style: {
        display: 'none'
      }
    })]
  });
};

_s2(ArchiveUploader, "2HcS+eCmkGsQ8I1zMNmb2uSkSEk=", false, function () {
  return [useStorage];
});

_c2 = ArchiveUploader;

var _c, _c2;

$RefreshReg$(_c, "LoadArchiveIcon");
$RefreshReg$(_c2, "ArchiveUploader");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9Mb2FkQXJjaGl2ZS50c3giXSwibmFtZXMiOlsiREVWSU5HIiwicHJvY2VzcyIsIkRFVl9NT0RFIiwidXNlU3RvcmFnZSIsIm5hbWUiLCJ1c2VTdGF0ZSIsIl91c2VTdG9yYWdlIiwiTG9hZEFyY2hpdmVJY29uIiwidG9vbHRpcCIsIkFyY2hpdmVVcGxvYWRlciIsInByb3BzIiwiaGFzQXJjaGl2ZSIsInNldEhhc0FyY2hpdmUiLCJoaWRkZW5GaWxlSW5wdXQiLCJ1c2VSZWYiLCJoYW5kbGVDbGljayIsImV2ZW50IiwiY29uc29sZSIsImxvZyIsImNzRXZlbnQiLCJjdXJyZW50IiwiY2xpY2siLCJoYW5kbGVDaGFuZ2UiLCJlIiwiZmlsZXMiLCJ0YXJnZXQiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiaW1wb3J0QXJjaGl2ZSIsImZpbGUiLCJmaW5kIiwicHJvcEVxIiwiQXJyYXkiLCJmcm9tIiwicmVhZEFzVGV4dCIsImNzRXhjZXB0aW9uIiwicmVzdWx0IiwicmVwbGFjZSIsImltcG9ydGVkVHdlZXRBcmNoaXZlIiwiSlNPTiIsInBhcnNlIiwiZGVmYXVsdFRvIiwibGVuZ3RoIiwic2V0U3RnIiwidGhlbiIsIm1zZ0JHIiwidHlwZSIsInZhbHVlIiwiZGlzcGxheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQTtBQUMyRjtDQUNnRzs7Q0FDTjs7Q0FDZjs7QUFFdEs7QUFDQTtBQUVBLElBQU1BLE1BQU0sR0FBR0Msa0NBQUEsQ0FBWUMsUUFBWixJQUF3QixPQUF2QztBQUNBLElBQU1DLFVBQVUsR0FBR0gsTUFBTSxNQUFHLFVBQUNJLElBQUQ7QUFBQTs7QUFBQSxTQUFrQkMsNkRBQVEsQ0FBQ0QsSUFBRCxDQUExQjtBQUFBLENBQUgsb0NBQXNDRSw0REFBL0Q7O0FBR0EsU0FBU0MsZUFBVCxHQUEwQjtBQUN4QixNQUFNQyxP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QUhQO0FBSUUsY0FBUSxFQUFFUyxZQUpaO0FBS0UsV0FBSyxFQUFFO0FBQUMyQixlQUFPLEVBQUU7QUFBVjtBQUxULE1BSkY7QUFBQSxJQURGO0FBY0QsQ0EvRE07O0lBQU14QyxlO1VBQ3lCTixVOzs7TUFEekJNLGUiLCJmaWxlIjoiY29udGVudC1zY3JpcHQuMzQ1MDAzZmJiN2ZkZTEzMjI1YmMuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGgsIHJlbmRlciwgQ29tcG9uZW50IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBzZXRTdGcsICBtc2dCRyB9IGZyb20gJy4uL3V0aWxzL2R1dGlscyc7XG5pbXBvcnQgeyBfXywgY3VycnksIHBpcGUsIGFuZFRoZW4sIG1hcCwgZmlsdGVyLCByZWR1Y2UsIHRhcCwgYXBwbHksIHRyeUNhdGNofSBmcm9tICdyYW1kYScgLy8gRnVuY3Rpb25cbmltcG9ydCB7IHByb3AsIHByb3BFcSwgcHJvcFNhdGlzZmllcywgcGF0aCwgcGF0aEVxLCBoYXNQYXRoLCBhc3NvYywgYXNzb2NQYXRoLCB2YWx1ZXMsIG1lcmdlTGVmdCwgbWVyZ2VEZWVwTGVmdCwga2V5cywgbGVucywgbGVuc1Byb3AsIGxlbnNQYXRoLCBwaWNrLCBwcm9qZWN0LCBzZXQsIGxlbmd0aCB9IGZyb20gJ3JhbWRhJyAvLyBPYmplY3RcbmltcG9ydCB7IGhlYWQsIHRhaWwsIHRha2UsIGlzRW1wdHksIGFueSwgYWxsLCBmaW5kLCBpbmNsdWRlcywgbGFzdCwgZHJvcFdoaWxlLCBkcm9wTGFzdFdoaWxlLCBkaWZmZXJlbmNlLCBhcHBlbmQsIGZyb21QYWlycywgZm9yRWFjaCwgbnRoLCBwbHVjaywgcmV2ZXJzZSwgdW5pcSwgc2xpY2V9IGZyb20gJ3JhbWRhJyAvLyBMaXN0XG5pbXBvcnQgeyBlcXVhbHMsIGlmRWxzZSwgd2hlbiwgYm90aCwgZWl0aGVyLCBpc05pbCwgaXMsIGRlZmF1bHRUbywgYW5kLCBvciwgbm90LCBULCBGLCBndCwgbHQsIGd0ZSwgbHRlLCBtYXgsIG1pbiwgc29ydCwgc29ydEJ5LCBzcGxpdCwgdHJpbSwgbXVsdGlwbHkgfSBmcm9tICdyYW1kYScgLy8gTG9naWMsIFR5cGUsIFJlbGF0aW9uLCBTdHJpbmcsIE1hdGhcblxuaW1wb3J0IHsgdXNlU3RvcmFnZSBhcyBfdXNlU3RvcmFnZSB9IGZyb20gJy4uL2hvb2tzL3VzZVN0b3JhZ2UnO1xuaW1wb3J0IHsgaW5pdEdBLCBjc0V2ZW50LCBjc0V4Y2VwdGlvbiwgUGFnZVZpZXcsIFVBX0NPREUgfSBmcm9tICcuLi91dGlscy9nYSdcblxuY29uc3QgREVWSU5HID0gcHJvY2Vzcy5lbnYuREVWX01PREUgPT0gJ3NlcnZlJ1xuY29uc3QgdXNlU3RvcmFnZSA9IERFVklORyA/IChuYW1lOiBzdHJpbmcpID0+IHVzZVN0YXRlKG5hbWUpIDogX3VzZVN0b3JhZ2VcblxuXG5mdW5jdGlvbiBMb2FkQXJjaGl2ZUljb24oKXsgIFxuICBjb25zdCB0b29sdGlwID0gPHNwYW4gY2xhc3M9XCJ0b29sdGlwdGV4dFwiPiBDbGljayBoZXJlIHRvIHVwbG9hZCB5b3VyIFR3aXR0ZXIgQXJjaGl2ZS4gPGEgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20vc2V0dGluZ3MveW91cl90d2l0dGVyX2RhdGFcIj5Eb3dubG9hZCBhbiBhcmNoaXZlIG9mIHlvdXIgZGF0YTwvYT4sIGV4dHJhY3QgaXQgYW5kIHNlbGVjdCBkYXRhL3R3ZWV0LmpzLiA8L3NwYW4+ICBcbiAgXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzcz1cImFyY2hpdmVfaWNvblwiPiBcbiAgICAgICAgPGJ1dHRvbj57YPCfp74gTG9hZCBBcmNoaXZlYH08L2J1dHRvbj4gXG4gICAgICAgIHsvKiA8YnV0dG9uPntgKGxvYWQgYXJjaGl2ZSlgfTwvYnV0dG9uPiAgKi99XG4gICAgICAgIHt0b29sdGlwfVxuICAgICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBjb25zdCBBcmNoaXZlVXBsb2FkZXIgPSBwcm9wcyA9PiB7XG4gIGNvbnN0IFtoYXNBcmNoaXZlLCBzZXRIYXNBcmNoaXZlXSA9IHVzZVN0b3JhZ2UoJ2hhc0FyY2hpdmUnLCBmYWxzZSlcbiAgLy8gQ3JlYXRlIGEgcmVmZXJlbmNlIHRvIHRoZSBoaWRkZW4gZmlsZSBpbnB1dCBlbGVtZW50XG4gIGNvbnN0IGhpZGRlbkZpbGVJbnB1dCA9IHVzZVJlZjxIVE1MSW5wdXRFbGVtZW50PihudWxsKTtcbiAgXG4gIC8vIFByb2dyYW1hdGljYWxseSBjbGljayB0aGUgaGlkZGVuIGZpbGUgaW5wdXQgZWxlbWVudFxuICAvLyB3aGVuIHRoZSBCdXR0b24gY29tcG9uZW50IGlzIGNsaWNrZWRcbiAgY29uc3QgaGFuZGxlQ2xpY2sgPSBldmVudCA9PiB7XG4gICAgY29uc29sZS5sb2coJ2xvYWQgYXJjaGl2ZSBjbGlja2VkJylcbiAgICBjc0V2ZW50KCdVc2VyJywgJ0xvYWQgQXJjaGl2ZSBjbGljaycsICcnKTtcbiAgICAvLyB0cy1taWdyYXRlKDI1MzEpIEZJWE1FOiBPYmplY3QgaXMgcG9zc2libHkgJ251bGwnLlxuICAgIGhpZGRlbkZpbGVJbnB1dC5jdXJyZW50LmNsaWNrKCk7XG4gIH07XG4gIC8vIENhbGwgYSBmdW5jdGlvbiAocGFzc2VkIGFzIGEgcHJvcCBmcm9tIHRoZSBwYXJlbnQgY29tcG9uZW50KVxuICAvLyB0byBoYW5kbGUgdGhlIHVzZXItc2VsZWN0ZWQgZmlsZSBcbiAgXG4gIC8vIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChlOiB7IHRhcmdldDogeyBmaWxlczogYW55OyB9OyB9KSA9PiB7XG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChlOiBFdmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGVzOkZpbGVMaXN0ID0gKChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5maWxlcyBhcyBGaWxlTGlzdCk7XG4gICAgey8qIGNvbnN0IGZpbGVzID0gZS50YXJnZXQuZmlsZXM7ICovfVxuICAgIGNvbnNvbGUubG9nKCdhcmNoIGZpbGVzJywgZmlsZXMpXG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkID0gaW1wb3J0QXJjaGl2ZTtcbiAgICBjb25zdCBmaWxlID0gZmluZChwcm9wRXEoJ25hbWUnLCBcInR3ZWV0LmpzXCIpKShBcnJheS5mcm9tKGZpbGVzKSkgYXMgRmlsZTtcbiAgICBjb25zb2xlLmxvZygnYXJjaCBmaWxlJywgZmlsZSlcbiAgICB0cnl7XG4gICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTsgIFxuICAgIH0gY2F0Y2goZSl7XG4gICAgICBjb25zb2xlLmxvZygnRVJST1I6IENvdWxkblxcJ3QgbG9hZCBhcmNoaXZlJylcbiAgICAgIGNzRXhjZXB0aW9uKCdDb3VsZG5cXCd0IGxvYWQgYXJjaGl2ZScsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBcbiAgLy8gUGFyc2VzIGpzb24gYW5kIHN0b3JlcyBpbiB0ZW1wIHRvIGJlIHByb2Nlc3NlZCBieSBCR1xuICBmdW5jdGlvbiBpbXBvcnRBcmNoaXZlKHRoaXM6IGFueSl7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5yZXN1bHQucmVwbGFjZSgvXlthLXowLTlBLVpcXC5dKiA9IC8sIFwiXCIpO1xuICAgIGNvbnN0IGltcG9ydGVkVHdlZXRBcmNoaXZlID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgIFxuICAgIGNzRXZlbnQoJ1VzZXInLCAnTG9hZGVkIEFyY2hpdmUnLCBkZWZhdWx0VG8oMCwgaW1wb3J0ZWRUd2VldEFyY2hpdmUubGVuZ3RoKSk7XG5cbiAgICBjb25zb2xlLmxvZygnc2V0dGluZyBhcmNoaXZlJywgaW1wb3J0ZWRUd2VldEFyY2hpdmUpXG4gICAgc2V0U3RnKCd0ZW1wX2FyY2hpdmUnLGltcG9ydGVkVHdlZXRBcmNoaXZlKS50aGVuKCgpPT57XG4gICAgICBzZXRIYXNBcmNoaXZlKHRydWUpXG4gICAgICBtc2dCRyh7dHlwZTpcInRlbXAtYXJjaGl2ZS1zdG9yZWRcIn0pO1xuICAgICAgaGlkZGVuRmlsZUlucHV0LmN1cnJlbnQudmFsdWUgPSBudWxsO1xuICAgIH0pXG5cbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgb25DbGljaz17aGFuZGxlQ2xpY2t9PlxuICAgICAgey8qIEB0cy1leHBlY3QtZXJyb3IgdHMtbWlncmF0ZSgyNTU5KSBGSVhNRTogVHlwZSAneyBjaGlsZHJlbjogbmV2ZXJbXTsgfScgaGFzIG5vIHByb3BlcnRpZXMgaW4uLi4gUmVtb3ZlIHRoaXMgY29tbWVudCB0byBzZWUgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSAqL31cbiAgICAgIDxMb2FkQXJjaGl2ZUljb24gPlxuICAgICAgPC9Mb2FkQXJjaGl2ZUljb24+XG4gICAgICA8aW5wdXRcbiAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICBhY2NlcHQ9XCIuanNvbiwuanNcIlxuICAgICAgICByZWY9e2hpZGRlbkZpbGVJbnB1dH1cbiAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgc3R5bGU9e3tkaXNwbGF5OiAnbm9uZSd9fVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuXG5cblxuIl0sInNvdXJjZVJvb3QiOiIifQ==