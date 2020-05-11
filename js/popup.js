"use strict";
$(document).ready(function() {
  // TODO: add some sort of display feature
  $("#authButton").click(function() {
    chrome.tabs.query({ currentWindow: true, active: true }, sendToBackground);
    function sendToBackground(tabs) {
      chrome.runtime.sendMessage({ type: "auth", tabId: tabs[0].id }, () =>
        console.log("auth complete")
      );
    }
  });

  // TODO: You shouldn't be able to click download until you have an auth
  // TODO: fix bug where it takes two clicks for tweets to update
  $("#downloadButton").click(function() {
    const username = $("#username").val();
    var today = new Date();
    today.setDate(today.getDate()+1)
    var date = today.toISOString().substring(0, 10);
    const message = {
      type: "load",
      username: username,
      since: "2020-01-01",
      until: date
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
