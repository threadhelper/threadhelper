$(document).ready(function() {
  $("#messageButton").click(function() {
    console.log("clicked");
    chrome.runtime.sendMessage(null, null, null);
  });
});
