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
    const message = {
      type: "update",
    };
    $("#notif").html(`Loading tweets...`)

    chrome.runtime.sendMessage(message);
  });

  // TODO: You shouldn't be able to click download until you have an auth
  // TODO: fix bug where it takes two clicks for tweets to update
  $("#downloadTimeline").click(function() {
    const message = {
      type: "timeline",
    };
    $("#notif").html(`Loading tweets...`)
    chrome.runtime.sendMessage(message);
  });

  
  // TODO: You shouldn't be able to click download until you have an auth
  // TODO: fix bug where it takes two clicks for tweets to update
  $("#downloadArchive").click(function() {
    const message = {
      type: "load_archive",
    };
    $("#notif").html(`Loading tweets...`)
    
    chrome.runtime.sendMessage(message);
  });


  $("#clearButton").click(function() {
    chrome.runtime.sendMessage({ type: "clear" }, ()=>{$("#notif").html(`Cleared storage.`);});
  });
});
