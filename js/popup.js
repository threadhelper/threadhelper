"use strict";
$(document).ready(function() {
  $("#authButton").click(function() {
    chrome.tabs.query({ currentWindow: true, active: true }, sendToBackground);
    function sendToBackground(tabs) {
      chrome.runtime.sendMessage({ type: "auth", tabId: tabs[0].id }, () =>
        console.log("auth complete")
      );
    }
  });
  $("#downloadButton").click(function() {
    chrome.runtime.sendMessage({ type: "load" });
  });
  $("#clearButton").click(function() {
    chrome.runtime.sendMessage({ type: "clear" });
  });
});
