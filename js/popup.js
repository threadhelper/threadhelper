"use strict";

let buttons_template = {
  updateTweets: {
    name: "update Tweets"
  },
  downloadTimeline: {
    name: "get Tweets"
  },
  downloadArchive: {
    name: "get Archive"
  },
  clearButton: {
    name: "Clear Storage"
  }
}

function getData(key) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(key, function(items) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(items[key]);
      }
    });
  });
}

function buildNameField(){
  let butt = document.createElement("input")
  butt.type = 'text'
  butt.id = 'username'
  butt.placeholder = 'username'
  return butt
}

function buildOption(key, value){
  let butt = document.createElement("button");
  butt.id = key

  butt.textContent = value.name
  return butt
}

function buildButton(){
  
}

function buildPage(buttons_template){
  //document.body.appendChild(buildNameField())
  document.body.appendChild(document.createElement("br"))
  // append all options
  for (var [key, value] of Object.entries(buttons_template)) {
    let butt = buildOption(key,value)
    document.body.appendChild(butt)
    document.body.appendChild(document.createElement("br"))
  }
}
  
let username = "null"

$(document).ready(function() {
  buildPage(buttons_template)

  // auto load username
  let stored_username = null
  getData("user_info").then((r)=>{username = r.screen_name; /*document.getElementById("username").value = username*/})
  
  // chrome.storage.local.get(["username"], r =>{
  //   stored_username = r.username; 
  //   console.log(`loaded username "${stored_username}" from storage`)
  //   document.getElementById("username").value = stored_username
  // });

  $("#updateTweets").click(function() {
    const username = $("#username").val();
    chrome.storage.local.set({ username: username }, function() {
      console.log("username stored")
    })
    const message = {
      type: "update",
      username: username
    };
    $("#notif").html(`Loading tweets...`)

    function onCompletion() {
      console.log("query completed");
      chrome.storage.local.get(["tweets","tweets_meta"], r =>{
        $("#notif").html(`Getting tweets`);
      });
    }
    chrome.runtime.sendMessage(message, onCompletion);
  });

  // TODO: You shouldn't be able to click download until you have an auth
  // TODO: fix bug where it takes two clicks for tweets to update
  $("#downloadTimeline").click(function() {
    const username = $("#username").val();
    chrome.storage.local.set({ username: username }, function() {
      console.log("username stored")
    })
    const message = {
      type: "load",
      username: username
    };
    $("#notif").html(`Loading tweets...`)

    function onCompletion() {
      console.log("query completed");
      chrome.storage.local.get(["tweets","tweets_meta"], r =>{
        $("#notif").html(`Getting tweets`);
      });
    }
    chrome.runtime.sendMessage(message, onCompletion);
  });

  
  // TODO: You shouldn't be able to click download until you have an auth
  // TODO: fix bug where it takes two clicks for tweets to update
  $("#downloadArchive").click(function() {
    const username = $("#username").val();
    chrome.storage.local.set({ username: username }, function() {
      console.log("username stored")
    })
    const message = {
      type: "load_archive",
      username: username
    };
    $("#notif").html(`Loading tweets...`)
    function onCompletion() {
      console.log("query completed");
      chrome.storage.local.get(["arch_tweets","arch_tweets_meta"], r =>{
        $("#notif").html(`Got tweets, locally saved!`);
        if (typeof r.tweets_meta !== 'undefined'){
        }
      });
    }
    chrome.runtime.sendMessage(message, onCompletion);
  });


  $("#clearButton").click(function() {
    chrome.runtime.sendMessage({ type: "clear" }, ()=>{$("#notif").html(`Cleared storage.`);});
  });
});
