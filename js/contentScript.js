"use strict";


chrome.runtime.onMessage.addListener(onMessage);


const editorClass = "DraftEditor-editorContainer";
const textFieldClass = 'span[data-text="true"]';
const w_period = 500;
let tweets = null;
let activeDiv = null;
let activeComposer = {composer: null, sugg_box: null, observer: null, mode: null}
let composers = []
let home_sugg = null

/*document.addEventListener("DOMContentLoaded", () => {
  console.log("content loaded")
  setUpListeningComposeClick()
});*/
window.onload = () => {scanForTweets(); setUpListeningComposeClick();}




//watchForStart();
//getTweets();


function scanForTweets(){
  console.log("scanning for tweets")
  if (tweets == null){
    tweets = getTweets()
    if (tweets == null){
      setTimeout(scanForTweets, 1000);
    }
  }
  return tweets
}


function getTweets() {
  console.log("getting tweets from storage")
  chrome.storage.local.get(["tweets"], r =>{
    if (typeof r.tweets !== 'undefined' && r.tweets != null){ 
      tweets = r.tweets.map(t => ({...t, bag:nlp.toBag(t.text)}))
      console.log(r.tweets);    
    }else{
      console.log("got no tweets")
    }
    return true
  });
  return tweets
}


// Modes: home, compose, something else?
function getMode(){
  var pageURL = window.location.href
  var home = 'https://twitter.com/home'
  var compose = 'https://twitter.com/compose/tweet'
  
  console.log("mode is " + pageURL)
  if (pageURL.indexOf(home) > -1){
    return 'home'
  }
  else if (pageURL.indexOf(compose) > -1){
    return "compose"
  } 
  else{
    return "other"
  }
}


// EVENT DELEGATION CRL, EVENT BUBBLING FTW
function setUpListeningComposeClick(){
  console.log("event listener added")
  document.addEventListener('focusin',function(e){
    console.log("something focused")
    var divs = document.getElementsByClassName(editorClass)
    for (var div of divs){
      if(e.target && div.contains(e.target)){
        textBoxClicked(div)
      }
    }
  });
}



//somehow this isn't a native method
Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
      if (this[i] === obj) {
          return true;
      }
  }
  return false;
}


// given composer found by editorClass = "DraftEditor-editorContainer", 
// outputs grandparent of const textFieldClass = 'span[data-text="true"]'
function getTextField(compose_box){
  return compose_box.firstElementChild.firstElementChild.firstElementChild.firstElementChild
}

// The .composer parameter of the composer
function textBoxClicked(compose_box){
  console.log("text box clicked!")
  // if the clicked composer is different from previous active composer and elligible
  if (compose_box != activeComposer.composer && getMode() != "other"){

    var composer = setUpBox(compose_box)
    //if suggestion box was created, add logger
    
  }
}

function setUpBox(compose_box){
  console.log("setting up suggestion box")
  var mode = getMode();
  var composer = new Object()
  var sugg_box = null
  
  if (mode == "home" && home_sugg != null){
    sugg_box = home_sugg
  } 
  else{
    sugg_box = buildBox(mode);
    if (mode == "home"){
      home_sugg = sugg_box
    }
  }
  if (sugg_box != null){
    var observer = addLogger(getTextField(compose_box));
    composer.observer = observer;
    composer.composer = compose_box;
    composer.sugg_box = sugg_box;
    composer.mode = mode;
    activeComposer = composer
    composers.push(composer)
    watchForStart();
    //addLogger(getTextField(activeComposer.composer));
    //sugg_box.style.display = "block";
    console.log("box set up")
    console.log(activeComposer)
  } 
  else{
    console.log("null box")
  }
}

/** buildBox creates the 'related tweets' html elements */
function buildBox(mode) {
  var sugg_box = null;
  //sugg_box.compose_box = compose_box
  switch (mode){
    case "home":
      var trending_block = document.querySelector('[aria-label="Timeline: Trending now"]')
      if(typeof trending_block !== 'undefined' && trending_block != null)
      {
        var sideBar = trending_block.parentNode.parentNode.parentNode.parentNode.parentNode
        sugg_box = document.createElement('div');   //create a div
        sugg_box.setAttribute("aria-label", 'suggestionBox');
        sugg_box.setAttribute("class", 'suggestionBox_home');
        var h3 = document.createElement('h3')
        h3.textContent = "Related Tweets"
        sugg_box.appendChild(h3)
        sideBar.insertBefore(sugg_box,sideBar.children[2])
      }  
      else{
        console.log("didn't make box, couldn't find trends block")
      }
      break;

    case "compose":
      var sideBar = document.body
      sugg_box = document.createElement('div');   //create a div
      sugg_box.setAttribute("aria-label", 'suggestionBox');
      sugg_box.setAttribute("class", 'suggestionBox_compose');
      var h3 = document.createElement('h3')
      h3.textContent = "Related Tweets"
      sugg_box.appendChild(h3)
      sideBar.appendChild(sugg_box,sideBar)
      break;
    default:
      console.log("not building box because not in appropriate mode")
      sugg_box = null
      //sugg_box.compose_box = null
      break;
  }
  return sugg_box
}

// gets composer object that has composer and sugg_box elements
function showSuggBox(composer){
  if (typeof composer.sugg_box !== 'undefined' ){
    console.log("showing box")
    composer.sugg_box.style.display = "block"
    //composer.sugg_box.remove()
    //composer.sugg_box = null
  }
}

// gets composer object that has composer and sugg_box elements
function hideSuggBox(composer){
  if (typeof composer.sugg_box !== 'undefined' ){
    console.log("hiding box")
    composer.sugg_box.style.display = "none"
    //composer.sugg_box.remove()
    //composer.sugg_box = null
  }
}

//checks whether composeBox is empty
function isComposeEmpty(comp){
  var spans = document.querySelectorAll(textFieldClass);
  for (var s of spans){
    if(comp.composer.contains(s)){
      return false
    }
  } 
  return true
}

/** watchForStop checks if the box has disappeared */
//should be runnning on active composer usually
function watchForStart() {
  console.log("watching for start")
  if(!isComposeEmpty(activeComposer)){
    showSuggBox(activeComposer) 
    setTimeout(watchForStop, w_period);
  } else{
    setTimeout(watchForStart, w_period);
  }
}
  
  
/** watchForStop checks if the box has disappeared */
//should be runnning on active composer usually
function watchForStop() {
  console.log("watching for stop")
  if(isComposeEmpty(activeComposer)){
    hideSuggBox(activeComposer)
    setTimeout(watchForStart, w_period);
  } else{
    setTimeout(watchForStop, w_period);
  }
}


/** Updates the tweetlist when user types */
function onChange(mutationRecords) {
  
  /*var text = mutationRecords[0].target.wholeText
  var textField = mutationRecords[0].target.firstElementChild.firstElementChild
  if(textField.tag != "SPAN" || text == ''){
  }*/
  if(tweets != null){
    if(tweets.length>0){
      //box = activeComposer.sugg_box
      //const box = document.`querySelector('[aria-label="suggestionBox"]')
      if(typeof activeComposer.sugg_box !== 'undefined' && activeComposer.sugg_box != null && activeComposer.sugg_box.style.display != "block"){
        activeComposer.sugg_box.style.display = "block"
      }
      const text = mutationRecords[0].target.wholeText;
      console.log("text is: ", text);
      const bag = nlp.toBag(text);
      const tweet = { text: text, bag: bag };
    
      const related = nlp.getRelated(tweet, tweets);
      //const related = [ { id: "123", text: "a tweet here", name: "bob t", username: "bobt", time: "2020", urls: [] } ]; //prettier-ignore
      renderTweets([...new Set(related.reverse())]);
      //console.log(related);
    }
  }
  else{
    console.log("no tweets")
  }
}

//** Attach a mutation observer to a div */
function addLogger(div) {
  console.log("adding logger")
  var observer = new MutationObserver(onChange);
  observer.observe(div, { characterData: true, subtree: true });
  return observer
}

//** Build the html for one tweet */
function renderTweet(tweet, textTarget) {
  // TODO: print user on retweets
  //console.log("rendering one tweet")
  const url = 'https://twitter.com/' + tweet.username + '/status/' + tweet.id;
  const rtime = $("<a>", {
    class: "rtime",
    text: tweet.time.toString(),
    href: url,
    style: "float: right"
  });

  var add = $("<span>", {
    class: "rplus",
    text: "+"
  });
  add.click(function(e) {
    // to copy something to clipboard it need to be on the page
    var textArea = document.createElement("textarea");
    textArea.value = url;
    var plus = e.target;
    plus.parentNode.insertBefore(textArea,plus.parentNode.children[1]);
    textArea.focus();
    textArea.select();
    textArea.style.size = 1
    document.execCommand("copy");
    textArea.style.display = "none";
    plus.style.cssText = "font-size: small; font-weight:normal;";
    plus.textContent = "copied link!"
    setTimeout(function() {
      activeComposer.composer.focus()
      plus.textContent = "+";
      plus.style.cssText = "font-size: x-large; font-weight:bold;";
    }, 2000);
  });
  const rtext = $("<div>", { class: "rtext", text: tweet.text });
  return $("<div>", { class: "rtweet" }).append([add, rtime,$("</br>"), rtext])[0];
}


//** Build the html for a set of tweets */
function renderTweets(tweets) {
  //console.log("rendering tweets")
  //var resultsDiv = document.querySelector('[aria-label="suggestionBox"]');
  var resultsDiv = activeComposer.sugg_box
  while (resultsDiv.firstChild) {
    resultsDiv.removeChild(resultsDiv.firstChild);
  }
  var h3 = document.createElement("h3");
  h3.innerHTML = "Related Tweets";
  resultsDiv.appendChild(h3);
  const textTarget = $('span[data-text="true"]');
  for (let t of tweets) {
    const tweetDiv = renderTweet(t, textTarget);
    resultsDiv.appendChild(tweetDiv);
  }
}

//** Handles messages sent from background or popup */
function onMessage(m, sender, sendResponse) {
  console.log("message received:", m);
  switch (m.type) {
    case "ping":
      sendResponse({ data: 'pong' });
      break;
    case "tweets-loaded":
      console.log("tweets loaded, getting tweets")
      getTweets()
      sendResponse()
      break;
  }
  return true
}