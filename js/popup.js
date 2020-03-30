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
  // TODO: You shouldn't be able to click download until you have an auth
  $("#downloadButton").click(function() {
    const username = $("#username").val();
    const message = {
      type: "load",
      username: username,
      since: "2020-03-01",
      until: "2020-03-31"
    };
    function onCompletion() {
      console.log("query completed");
      chrome.storage.local.get(["tweets"], r =>
        $("#storedTweets").html(JSON.stringify(r.tweets))
      );
    }
    chrome.runtime.sendMessage(message, onCompletion);
  });
  $("#clearButton").click(function() {
    chrome.runtime.sendMessage({ type: "clear" });
  });
});
