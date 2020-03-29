$(document).ready(function() {
  $("#authButton").click(function() {
    function sendToBackground(tabs) {
      chrome.runtime.sendMessage({ type: "auth", tabId: tabs[0].id }, () =>
        console.log("auth complete")
      );
    }
    chrome.tabs.query({ currentWindow: true, active: true }, sendToBackground);
  });
  $("#downloadButton").click(function() {
    chrome.runtime.sendMessage("load");
  });
  $("#clearButton").click(function() {
    chrome.runtime.sendMessage("clear");
  });
});
