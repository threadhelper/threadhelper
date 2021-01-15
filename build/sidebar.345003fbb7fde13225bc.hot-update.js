webpackHotUpdate("sidebar",{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdHMvY29tcG9uZW50cy9Mb2FkQXJjaGl2ZS50c3giXSwibmFtZXMiOlsiREVWSU5HIiwicHJvY2VzcyIsIkRFVl9NT0RFIiwidXNlU3RvcmFnZSIsIm5hbWUiLCJ1c2VTdGF0ZSIsIl91c2VTdG9yYWdlIiwiTG9hZEFyY2hpdmVJY29uIiwidG9vbHRpcCIsIkFyY2hpdmVVcGxvYWRlciIsInByb3BzIiwiaGFzQXJjaGl2ZSIsInNldEhhc0FyY2hpdmUiLCJoaWRkZW5GaWxlSW5wdXQiLCJ1c2VSZWYiLCJoYW5kbGVDbGljayIsImV2ZW50IiwiY29uc29sZSIsImxvZyIsImNzRXZlbnQiLCJjdXJyZW50IiwiY2xpY2siLCJoYW5kbGVDaGFuZ2UiLCJlIiwiZmlsZXMiLCJ0YXJnZXQiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiaW1wb3J0QXJjaGl2ZSIsImZpbGUiLCJmaW5kIiwicHJvcEVxIiwiQXJyYXkiLCJmcm9tIiwicmVhZEFzVGV4dCIsImNzRXhjZXB0aW9uIiwicmVzdWx0IiwicmVwbGFjZSIsImltcG9ydGVkVHdlZXRBcmNoaXZlIiwiSlNPTiIsInBhcnNlIiwiZGVmYXVsdFRvIiwibGVuZ3RoIiwic2V0U3RnIiwidGhlbiIsIm1zZ0JHIiwidHlwZSIsInZhbHVlIiwiZGlzcGxheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQTtBQUMyRjtDQUNnRzs7Q0FDTjs7Q0FDZjs7QUFFdEs7QUFDQTtBQUVBLElBQU1BLE1BQU0sR0FBR0Msa0NBQUEsQ0FBWUMsUUFBWixJQUF3QixPQUF2QztBQUNBLElBQU1DLFVBQVUsR0FBR0gsTUFBTSxNQUFHLFVBQUNJLElBQUQ7QUFBQTs7QUFBQSxTQUFrQkMsNkRBQVEsQ0FBQ0QsSUFBRCxDQUExQjtBQUFBLENBQUgsb0NBQXNDRSw0REFBL0Q7O0FBR0EsU0FBU0MsZUFBVCxHQUEwQjtBQUN4QixNQUFNQyxPQUFPLEdBQUc7QUFBTSxhQUFNLGFBQVo7QUFBQSwrREFBc0U7QUFBRyxVQUFJLEVBQUMsZ0RBQVI7QUFBQTtBQUFBLE1BQXRFO0FBQUEsSUFBaEI7O0FBRUEsU0FDRTtBQUFLLGFBQU0sY0FBWDtBQUFBLGVBQ0k7QUFBQTtBQUFBLE1BREosRUFHS0EsT0FITDtBQUFBLElBREY7QUFPRDs7S0FWUUQsZTtBQVlGLElBQU1FLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0IsQ0FBQUMsS0FBSyxFQUFJO0FBQUE7O0FBQUEscUJBQ0ZQLFVBQVUsQ0FBQyxZQUFELEVBQWUsS0FBZixDQURSO0FBQUE7QUFBQSxNQUMvQlEsVUFEK0I7QUFBQSxNQUNuQkMsYUFEbUIsb0JBRXRDOzs7QUFDQSxNQUFNQyxlQUFlLEdBQUdDLDJEQUFNLENBQW1CLElBQW5CLENBQTlCLENBSHNDLENBS3RDO0FBQ0E7O0FBQ0EsTUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQUMsS0FBSyxFQUFJO0FBQzNCQyxXQUFPLENBQUNDLEdBQVIsQ0FBWSxzQkFBWjtBQUNBQyw2REFBTyxDQUFDLE1BQUQsRUFBUyxvQkFBVCxFQUErQixFQUEvQixDQUFQLENBRjJCLENBRzNCOztBQUNBTixtQkFBZSxDQUFDTyxPQUFoQixDQUF3QkMsS0FBeEI7QUFDRCxHQUxELENBUHNDLENBYXRDO0FBQ0E7QUFFQTs7O0FBQ0EsTUFBTUMsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQ0MsQ0FBRCxFQUFjO0FBQ2pDLFFBQU1DLEtBQWMsR0FBS0QsQ0FBQyxDQUFDRSxNQUFILENBQStCRCxLQUF2RDtBQUNBO0FBQUM7QUFBb0M7QUFDckNQLFdBQU8sQ0FBQ0MsR0FBUixDQUFZLFlBQVosRUFBMEJNLEtBQTFCO0FBQ0EsUUFBTUUsTUFBTSxHQUFHLElBQUlDLFVBQUosRUFBZjtBQUNBRCxVQUFNLENBQUNFLE1BQVAsR0FBZ0JDLGFBQWhCO0FBQ0EsUUFBTUMsSUFBSSxHQUFHQyxrREFBSSxDQUFDQyxvREFBTSxDQUFDLE1BQUQsRUFBUyxVQUFULENBQVAsQ0FBSixDQUFpQ0MsS0FBSyxDQUFDQyxJQUFOLENBQVdWLEtBQVgsQ0FBakMsQ0FBYjtBQUNBUCxXQUFPLENBQUNDLEdBQVIsQ0FBWSxXQUFaLEVBQXlCWSxJQUF6Qjs7QUFDQSxRQUFHO0FBQ0RKLFlBQU0sQ0FBQ1MsVUFBUCxDQUFrQkwsSUFBbEI7QUFDRCxLQUZELENBRUUsT0FBTVAsQ0FBTixFQUFRO0FBQ1JOLGFBQU8sQ0FBQ0MsR0FBUixDQUFZLCtCQUFaO0FBQ0FrQixtRUFBVyxDQUFDLHdCQUFELEVBQTJCLEtBQTNCLENBQVg7QUFDRDtBQUNGLEdBZEQsQ0FqQnNDLENBa0N0Qzs7O0FBQ0EsV0FBU1AsYUFBVCxHQUFpQztBQUMvQixRQUFNUSxNQUFNLEdBQUcsS0FBS0EsTUFBTCxDQUFZQyxPQUFaLENBQW9CLG9CQUFwQixFQUEwQyxFQUExQyxDQUFmO0FBQ0EsUUFBTUMsb0JBQW9CLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXSixNQUFYLENBQTdCO0FBRUFsQiw2REFBTyxDQUFDLE1BQUQsRUFBUyxnQkFBVCxFQUEyQnVCLHVEQUFTLENBQUMsQ0FBRCxFQUFJSCxvQkFBb0IsQ0FBQ0ksTUFBekIsQ0FBcEMsQ0FBUDtBQUVBMUIsV0FBTyxDQUFDQyxHQUFSLENBQVksaUJBQVosRUFBK0JxQixvQkFBL0I7QUFDQUssZ0VBQU0sQ0FBQyxjQUFELEVBQWdCTCxvQkFBaEIsQ0FBTixDQUE0Q00sSUFBNUMsQ0FBaUQsWUFBSTtBQUNuRGpDLG1CQUFhLENBQUMsSUFBRCxDQUFiO0FBQ0FrQyxpRUFBSyxDQUFDO0FBQUNDLFlBQUksRUFBQztBQUFOLE9BQUQsQ0FBTDtBQUNBbEMscUJBQWUsQ0FBQ08sT0FBaEIsQ0FBd0I0QixLQUF4QixHQUFnQyxJQUFoQztBQUNELEtBSkQ7QUFNRDs7QUFDRCxTQUNFO0FBQUssV0FBTyxFQUFFakMsV0FBZDtBQUFBLGVBRUUsK0RBQUMsZUFBRCxLQUZGLEVBSUU7QUFDRSxVQUFJLEVBQUMsTUFEUDtBQUVFLFlBQU0sRUFBQyxXQUZUO0FBR0UsU0FBRyxFQUFFRixlQUhQO0FBSUUsY0FBUSxFQUFFUyxZQUpaO0FBS0UsV0FBSyxFQUFFO0FBQUMyQixlQUFPLEVBQUU7QUFBVjtBQUxULE1BSkY7QUFBQSxJQURGO0FBY0QsQ0EvRE07O0lBQU14QyxlO1VBQ3lCTixVOzs7TUFEekJNLGUiLCJmaWxlIjoic2lkZWJhci4zNDUwMDNmYmI3ZmRlMTMyMjViYy5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgcmVuZGVyLCBDb21wb25lbnQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHNldFN0ZywgIG1zZ0JHIH0gZnJvbSAnLi4vdXRpbHMvZHV0aWxzJztcbmltcG9ydCB7IF9fLCBjdXJyeSwgcGlwZSwgYW5kVGhlbiwgbWFwLCBmaWx0ZXIsIHJlZHVjZSwgdGFwLCBhcHBseSwgdHJ5Q2F0Y2h9IGZyb20gJ3JhbWRhJyAvLyBGdW5jdGlvblxuaW1wb3J0IHsgcHJvcCwgcHJvcEVxLCBwcm9wU2F0aXNmaWVzLCBwYXRoLCBwYXRoRXEsIGhhc1BhdGgsIGFzc29jLCBhc3NvY1BhdGgsIHZhbHVlcywgbWVyZ2VMZWZ0LCBtZXJnZURlZXBMZWZ0LCBrZXlzLCBsZW5zLCBsZW5zUHJvcCwgbGVuc1BhdGgsIHBpY2ssIHByb2plY3QsIHNldCwgbGVuZ3RoIH0gZnJvbSAncmFtZGEnIC8vIE9iamVjdFxuaW1wb3J0IHsgaGVhZCwgdGFpbCwgdGFrZSwgaXNFbXB0eSwgYW55LCBhbGwsIGZpbmQsIGluY2x1ZGVzLCBsYXN0LCBkcm9wV2hpbGUsIGRyb3BMYXN0V2hpbGUsIGRpZmZlcmVuY2UsIGFwcGVuZCwgZnJvbVBhaXJzLCBmb3JFYWNoLCBudGgsIHBsdWNrLCByZXZlcnNlLCB1bmlxLCBzbGljZX0gZnJvbSAncmFtZGEnIC8vIExpc3RcbmltcG9ydCB7IGVxdWFscywgaWZFbHNlLCB3aGVuLCBib3RoLCBlaXRoZXIsIGlzTmlsLCBpcywgZGVmYXVsdFRvLCBhbmQsIG9yLCBub3QsIFQsIEYsIGd0LCBsdCwgZ3RlLCBsdGUsIG1heCwgbWluLCBzb3J0LCBzb3J0QnksIHNwbGl0LCB0cmltLCBtdWx0aXBseSB9IGZyb20gJ3JhbWRhJyAvLyBMb2dpYywgVHlwZSwgUmVsYXRpb24sIFN0cmluZywgTWF0aFxuXG5pbXBvcnQgeyB1c2VTdG9yYWdlIGFzIF91c2VTdG9yYWdlIH0gZnJvbSAnLi4vaG9va3MvdXNlU3RvcmFnZSc7XG5pbXBvcnQgeyBpbml0R0EsIGNzRXZlbnQsIGNzRXhjZXB0aW9uLCBQYWdlVmlldywgVUFfQ09ERSB9IGZyb20gJy4uL3V0aWxzL2dhJ1xuXG5jb25zdCBERVZJTkcgPSBwcm9jZXNzLmVudi5ERVZfTU9ERSA9PSAnc2VydmUnXG5jb25zdCB1c2VTdG9yYWdlID0gREVWSU5HID8gKG5hbWU6IHN0cmluZykgPT4gdXNlU3RhdGUobmFtZSkgOiBfdXNlU3RvcmFnZVxuXG5cbmZ1bmN0aW9uIExvYWRBcmNoaXZlSWNvbigpeyAgXG4gIGNvbnN0IHRvb2x0aXAgPSA8c3BhbiBjbGFzcz1cInRvb2x0aXB0ZXh0XCI+IENsaWNrIGhlcmUgdG8gdXBsb2FkIHlvdXIgVHdpdHRlciBBcmNoaXZlLiA8YSBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS9zZXR0aW5ncy95b3VyX3R3aXR0ZXJfZGF0YVwiPkRvd25sb2FkIGFuIGFyY2hpdmUgb2YgeW91ciBkYXRhPC9hPiwgZXh0cmFjdCBpdCBhbmQgc2VsZWN0IGRhdGEvdHdlZXQuanMuIDwvc3Bhbj4gIFxuICBcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzPVwiYXJjaGl2ZV9pY29uXCI+IFxuICAgICAgICA8YnV0dG9uPntg8J+nviBMb2FkIEFyY2hpdmVgfTwvYnV0dG9uPiBcbiAgICAgICAgey8qIDxidXR0b24+e2AobG9hZCBhcmNoaXZlKWB9PC9idXR0b24+ICAqL31cbiAgICAgICAge3Rvb2x0aXB9XG4gICAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IEFyY2hpdmVVcGxvYWRlciA9IHByb3BzID0+IHtcbiAgY29uc3QgW2hhc0FyY2hpdmUsIHNldEhhc0FyY2hpdmVdID0gdXNlU3RvcmFnZSgnaGFzQXJjaGl2ZScsIGZhbHNlKVxuICAvLyBDcmVhdGUgYSByZWZlcmVuY2UgdG8gdGhlIGhpZGRlbiBmaWxlIGlucHV0IGVsZW1lbnRcbiAgY29uc3QgaGlkZGVuRmlsZUlucHV0ID0gdXNlUmVmPEhUTUxJbnB1dEVsZW1lbnQ+KG51bGwpO1xuICBcbiAgLy8gUHJvZ3JhbWF0aWNhbGx5IGNsaWNrIHRoZSBoaWRkZW4gZmlsZSBpbnB1dCBlbGVtZW50XG4gIC8vIHdoZW4gdGhlIEJ1dHRvbiBjb21wb25lbnQgaXMgY2xpY2tlZFxuICBjb25zdCBoYW5kbGVDbGljayA9IGV2ZW50ID0+IHtcbiAgICBjb25zb2xlLmxvZygnbG9hZCBhcmNoaXZlIGNsaWNrZWQnKVxuICAgIGNzRXZlbnQoJ1VzZXInLCAnTG9hZCBBcmNoaXZlIGNsaWNrJywgJycpO1xuICAgIC8vIHRzLW1pZ3JhdGUoMjUzMSkgRklYTUU6IE9iamVjdCBpcyBwb3NzaWJseSAnbnVsbCcuXG4gICAgaGlkZGVuRmlsZUlucHV0LmN1cnJlbnQuY2xpY2soKTtcbiAgfTtcbiAgLy8gQ2FsbCBhIGZ1bmN0aW9uIChwYXNzZWQgYXMgYSBwcm9wIGZyb20gdGhlIHBhcmVudCBjb21wb25lbnQpXG4gIC8vIHRvIGhhbmRsZSB0aGUgdXNlci1zZWxlY3RlZCBmaWxlIFxuICBcbiAgLy8gY29uc3QgaGFuZGxlQ2hhbmdlID0gKGU6IHsgdGFyZ2V0OiB7IGZpbGVzOiBhbnk7IH07IH0pID0+IHtcbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gKGU6IEV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZXM6RmlsZUxpc3QgPSAoKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZpbGVzIGFzIEZpbGVMaXN0KTtcbiAgICB7LyogY29uc3QgZmlsZXMgPSBlLnRhcmdldC5maWxlczsgKi99XG4gICAgY29uc29sZS5sb2coJ2FyY2ggZmlsZXMnLCBmaWxlcylcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5vbmxvYWQgPSBpbXBvcnRBcmNoaXZlO1xuICAgIGNvbnN0IGZpbGUgPSBmaW5kKHByb3BFcSgnbmFtZScsIFwidHdlZXQuanNcIikpKEFycmF5LmZyb20oZmlsZXMpKSBhcyBGaWxlO1xuICAgIGNvbnNvbGUubG9nKCdhcmNoIGZpbGUnLCBmaWxlKVxuICAgIHRyeXtcbiAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpOyAgXG4gICAgfSBjYXRjaChlKXtcbiAgICAgIGNvbnNvbGUubG9nKCdFUlJPUjogQ291bGRuXFwndCBsb2FkIGFyY2hpdmUnKVxuICAgICAgY3NFeGNlcHRpb24oJ0NvdWxkblxcJ3QgbG9hZCBhcmNoaXZlJywgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIFxuICAvLyBQYXJzZXMganNvbiBhbmQgc3RvcmVzIGluIHRlbXAgdG8gYmUgcHJvY2Vzc2VkIGJ5IEJHXG4gIGZ1bmN0aW9uIGltcG9ydEFyY2hpdmUodGhpczogYW55KXtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnJlc3VsdC5yZXBsYWNlKC9eW2EtejAtOUEtWlxcLl0qID0gLywgXCJcIik7XG4gICAgY29uc3QgaW1wb3J0ZWRUd2VldEFyY2hpdmUgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgXG4gICAgY3NFdmVudCgnVXNlcicsICdMb2FkZWQgQXJjaGl2ZScsIGRlZmF1bHRUbygwLCBpbXBvcnRlZFR3ZWV0QXJjaGl2ZS5sZW5ndGgpKTtcblxuICAgIGNvbnNvbGUubG9nKCdzZXR0aW5nIGFyY2hpdmUnLCBpbXBvcnRlZFR3ZWV0QXJjaGl2ZSlcbiAgICBzZXRTdGcoJ3RlbXBfYXJjaGl2ZScsaW1wb3J0ZWRUd2VldEFyY2hpdmUpLnRoZW4oKCk9PntcbiAgICAgIHNldEhhc0FyY2hpdmUodHJ1ZSlcbiAgICAgIG1zZ0JHKHt0eXBlOlwidGVtcC1hcmNoaXZlLXN0b3JlZFwifSk7XG4gICAgICBoaWRkZW5GaWxlSW5wdXQuY3VycmVudC52YWx1ZSA9IG51bGw7XG4gICAgfSlcblxuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdiBvbkNsaWNrPXtoYW5kbGVDbGlja30+XG4gICAgICB7LyogQHRzLWV4cGVjdC1lcnJvciB0cy1taWdyYXRlKDI1NTkpIEZJWE1FOiBUeXBlICd7IGNoaWxkcmVuOiBuZXZlcltdOyB9JyBoYXMgbm8gcHJvcGVydGllcyBpbi4uLiBSZW1vdmUgdGhpcyBjb21tZW50IHRvIHNlZSB0aGUgZnVsbCBlcnJvciBtZXNzYWdlICovfVxuICAgICAgPExvYWRBcmNoaXZlSWNvbiA+XG4gICAgICA8L0xvYWRBcmNoaXZlSWNvbj5cbiAgICAgIDxpbnB1dFxuICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgIGFjY2VwdD1cIi5qc29uLC5qc1wiXG4gICAgICAgIHJlZj17aGlkZGVuRmlsZUlucHV0fVxuICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICBzdHlsZT17e2Rpc3BsYXk6ICdub25lJ319XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5cblxuXG4iXSwic291cmNlUm9vdCI6IiJ9