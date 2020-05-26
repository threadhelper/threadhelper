"use strict";

$(document).ready(function() {

  // auto load username
  let stored_username = null
  chrome.storage.local.get(["username"], r =>{
    stored_username = r.username; 
    console.log(`loaded username "${stored_username}" from storage`)
    document.getElementById("username").value = stored_username
  });

  //present info about loaded tweets
  chrome.storage.local.get(["tweets_meta"], r =>{
    if (typeof r !== 'undefined' && r!=null && typeof r.tweets_meta !== 'undefined'){
      var meta = r.tweets_meta 
      $("#tweetStatus").html(`${meta.count} tweets, last updated: ${meta.since_time}`);
    } else{
        $("#tweetStatus").html(`${0} tweets, last updated: ${"never"}`);
      }
    });


  //$("#username").val(stored_username);
  
  /* TODO: add some sort of display feature
  $("#authButton").click(function() {
    chrome.tabs.query({ currentWindow: true, active: true }, sendToBackground);
    function sendToBackground(tabs) {      
      chrome.runtime.sendMessage({ type: "auth", tabId: tabs[0].id }, () =>
        {console.log("auth complete");
        $("#notif").html(`Got auth!!`);}
      );
    }
  });*/

  // TODO: You shouldn't be able to click download until you have an auth
  // TODO: fix bug where it takes two clicks for tweets to update
  $("#downloadButton").click(function() {
    const username = $("#username").val();
    chrome.storage.local.set({ username: username }, function() {
      console.log("username stored")
    })
    var today = new Date();
    today.setDate(today.getDate()+1)
    var date = today.toISOString().substring(0, 10);
    const message = {
      type: "load",
      //since: "2020-01-01",
      //until: date,
      username: username
    };
    $("#notif").html(`Loading tweets...`)

    function onCompletion() {
      console.log("query completed");
      chrome.storage.local.get(["tweets","tweets_meta"], r =>{
        $("#notif").html(`Stored ${String(r.tweets.length)} tweets!`);
        if (typeof r.tweets_meta !== 'undefined'){
          $("#tweetStatus").html(`${String(r.tweets_meta.count)} tweets, last updated: ${String(r.tweets_meta.since_time)}`);
        }
      });
    }
    chrome.runtime.sendMessage(message, onCompletion);
  });

  $("#clearButton").click(function() {
    chrome.runtime.sendMessage({ type: "clear" }, ()=>{$("#notif").html(`Cleared storage.`);});
  });
});
