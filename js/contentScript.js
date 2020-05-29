"use strict";



function main()
{
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
  window.onload = () => {
    //scanForTweets(); 
    setUpListeningComposeClick();}

  // async function scanForTweets(){
  //   console.log("scanning for tweets")
  //   if (tweets == null){
  //     tweets = await getTweets()
  //     if (tweets == null){
  //       setTimeout(scanForTweets, 1000);
  //     }
  //   }
  //   return true
  // }

  // async function getTweets() {   
  //   const prom = new Promise(function (resolve, reject) {
  //     chrome.storage.local.get(["tweets"], r =>{
  //       console.log("getting tweets from storage")
  //       resolve(r)
  //     });
  //   });
  //   const processTweets = (r) => {
  //     if (typeof ts !== 'undefined' && ts != null){ 
  //       tweets = ts.map(t => ({...t, bag:nlp.toBag(t.text)}))
  //       console.log(ts);    
  //     }else{
  //       console.log("got no tweets")
  //       return null
  //     }
  //   }
  //   tweets = await prom.then(processTweets);
  //   return tweets
  // }

  async function getTweets() {   
    const processTweets = function(ts){
      if (typeof ts !== 'undefined' && ts != null){ 
        tweets = ts.map(t => ({...t, bag:nlp.toBag(t.text)}))
        console.log(ts);    
      }else{
        console.log("got no tweets")
        return null
      }
    }
    chrome.storage.local.get(["tweets"], r =>{
      console.log("getting tweets from storage")
      processTweets(r.tweets)
    });
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
    console.log("event listeners added")
    document.addEventListener('focusin',function(e){
      var divs = document.getElementsByClassName(editorClass)
      for (var div of divs){
        if(e.target && div.contains(e.target)){
          textBoxFocused(div)
        }
      }
    });
    document.addEventListener('focusout',function(e){
      var divs = document.getElementsByClassName(editorClass)
      for (var div of divs){
        if(e.target && div.contains(e.target)){
          textBoxUnfocused(div)
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

  function textBoxUnfocused(compose_box){
    console.log("text box focus out")
    // If the active composer is empty and unselected, kill
    if (compose_box == activeComposer.composer && isComposeEmpty(activeComposer)){
      //hideSuggBox(activeComposer)
      if (activeComposer.mode != "home"){
        killComposer(activeComposer)
      }
    }
  }

  // The .composer parameter of the composer
  function textBoxFocused(compose_box){
    if (tweets == null){
      getTweets()
    }
    console.log("text box focus in!")
    // if the clicked composer is different from previous active composer and elligible
    if (compose_box != activeComposer.composer && getMode() != "other"){
      if (activeComposer.mode != "home") killComposer(activeComposer)
      var composer = setUpBox(compose_box)
      //if suggestion box was created, add logger
    }
    else{
      showSuggBox(activeComposer)
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
      sugg_box = buildBox();
    }
    placeBox(sugg_box,mode)
    if (sugg_box != null){
      var observer = addLogger(getTextField(compose_box));
      composer.observer = observer;
      composer.composer = compose_box;
      composer.sugg_box = sugg_box;
      composer.mode = mode;
      activeComposer = composer;
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

  function placeBox(sugg_box, mode){
    if (mode == "home"){
      //insert a little space bc of the title
      sugg_box.setAttribute("class", 'suggestionBox_home');
      var trending_block = document.querySelector('[aria-label="Timeline: Trending now"]')
      if(typeof trending_block !== 'undefined' && trending_block != null)
      {
        var sideBar = trending_block.parentNode.parentNode.parentNode.parentNode.parentNode
        var space = document.createElement('div') //a bit of space
        space.setAttribute("class", 'sugg_box_space');
        sideBar.insertBefore(sugg_box,sideBar.children[1])
        sideBar.insertBefore(space,sugg_box); 
        home_sugg = sugg_box
      }
      else{
        console.log("didn't place box, couldn't find trends block")
      }
    }
    else if(mode == "compose"){
      let dummyUI = $(`
        <div class="dummyContainer">
          <div class="dummyLeft"></div>
          <div id="suggestionContainer" class="dummyRight"></div>
        </div>
      `)
      sugg_box.setAttribute("class", 'suggestionBox_compose');
      var sideBar = $("#suggestionContainer", dummyUI)
      sideBar.append(sugg_box,sideBar)
      console.log("trying to append dummy")
      document.body.append(dummyUI[0])
    }
    else{
        console.log("didn't place box, not in right mode")
        console.log(mode)
    }
  }


  /** buildBox creates the 'Thread Helper' html elements */
  function buildBox() {
    var sugg_box = null;
    sugg_box = document.createElement('div');   //create a div
    sugg_box.setAttribute("aria-label", 'suggestionBox');
    var h3 = document.createElement('h3')
    h3.textContent = "Thread Helper"
    h3.setAttribute("class","suggTitle");
    sugg_box.appendChild(h3)    
    return sugg_box
  }

  // gets composer object that has composer and sugg_box elements
  function showSuggBox(composer){
    if (typeof composer.sugg_box !== 'undefined' && composer.sugg_box != null){
      composer.sugg_box.style.display = "block"
      if(!document.body.contains(composer.sugg_box)){
        placeBox(composer.sugg_box)
      }
    }
  }

  // gets composer object that has composer and sugg_box elements
  function hideSuggBox(composer){
    if (typeof composer.sugg_box !== 'undefined' ){
      //console.log("hiding box")
      if (composer.mode == "home") renderTweets([]);
      else if (composer.sugg_box != null) composer.sugg_box.style.display = "none"
      //composer.sugg_box.remove()
      //composer.sugg_box = null
    }
  }

  //usually activeComposer
  function killComposer(composer){
    if (composer.mode == "home")
      hideSuggBox(composer) 
    else{
      //{composer: null, sugg_box: null, observer: null, mode: null}
      composer.composer = null
      if (typeof composer.sugg_box !== 'undefined' && composer.sugg_box != null){
        composer.sugg_box.remove()
        composer.sugg_box = null
      }
      //home_sugg = null;
      if (typeof composer.observer !== 'undefined' && composer.observer != null){
        composer.observer.disconnect()
        composer.observer = null
      }
      composer.mode = null
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
    if(activeComposer.composer != null && !isComposeEmpty(activeComposer)){
      showSuggBox(activeComposer) 
      setTimeout(watchForStop, w_period);
    } else{
      //if (activeComposer.sugg_box.style.display !)
      hideSuggBox(activeComposer)
      setTimeout(watchForStart, w_period);
    }
  }  
    
  /** watchForStop checks if the box has disappeared */
  //should be runnning on active composer usually

  function watchForStop() {
    console.log("watching for stop")
    if(activeComposer.composer != null && isComposeEmpty(activeComposer)){
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

  /* Build the html for one tweet 
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
  }*/

    
  function renderTweet(tweet, textTarget) {
    let tweetLink = `https://twitter.com/${tweet.username}/status/${tweet.id}`
    let timeDiff = getTimeDiff(tweet.time)
    let reply_text = getReplyText(tweet.reply_to, tweet.mentions)
    let text = reformatText(tweet.text, tweet.reply_to, tweet.mentions, tweet.urls, tweet.media)
    let maybeMedia = tweet.has_media ? renderMedia(tweet.media, "th-media") : ""
    let maybeQuote = tweet.has_quote ? renderQuote(tweet.quote, tweet.has_media) : ""
    let template = $(`
    <div class="th-tweet-container">
      <div class="th-tweet">
        <div class="th-gutter">
          <img class="th-profile" src="${tweet.profile_image}">
        </div>
        <div class="th-body">
          <div class="th-header">
            <div class="th-header-name">${tweet.name}</div>
            <div class="th-header-username">@${tweet.username}</div>
            <div class="th-header-dot">·</div>
            <div class="th-header-time">${timeDiff}</div>
          </div>
          <div class="th-reply">${reply_text}</div>
          <div class="th-text">${text}</div>
          ${maybeMedia}
          ${maybeQuote}
        </div>
      </div>
      <div class="th-hover">
        <textarea style="display: none" id="th-link-${tweet.id}" class="th-link">${tweetLink}</textarea>
        <div class="th-hover-copy">copy</div>
      </div>
    </div>`)

    let hover = $('.th-hover', template)
    hover.click(function(e) {
      var link = $(`#th-link-${tweet.id}`)[0]
      var copy = $(e.target).find(".th-hover-copy")
      link.style.display = "flex"
      link.select()
      document.execCommand("copy")
      link.style.display = "none"
      var input = activeComposer.composer.firstElementChild
      input.focus()
      // https://stackoverflow.com/questions/24115860/set-caret-position-at-a-specific-position-in-contenteditable-div
      // There will be multiple spans if multiple lines, so we get the last one to set caret to the end of the last line.
      var text = $(input).find('span[data-text=true]').last()[0].firstChild
      var range = document.createRange()
      range.setStart(text, text.length)
      range.setEnd(text, text.length)
      var sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      copy.text("copied!")
      setTimeout(function() {
        copy.text("copy")
      }, 2000)
    })

    return template[0]
  }

  let shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  function getTimeDiff(time) {
    let now = new Date()
    let timeDate = new Date(time)
    let diff = now-timeDate // In milliseconds.
    let seconds = parseInt(diff/1000)
    if (seconds < 60) {
      return `${seconds}s`
    }
    let mins = parseInt(seconds/60)
    if (mins < 60) {
      return `${mins}m`
    }
    let hours = parseInt(mins/60)
    if (hours < 24) {
      return `${hours}h`
    }
    let month = shortMonths[timeDate.getMonth()-1]
    let day = timeDate.getDate()
    let thisYear = new Date(now.getFullYear(), 0)
    return timeDate > thisYear ? `${month} ${day}` : `${month} ${day}, ${timeDate.getFullYear()}`
  }

  function getReplyText(reply_to, mentions) {
    if (reply_to === null) {
      return ""
    }
    if (mentions.length === 1 || mentions.length === 0) {
      return `Replying to @${reply_to}`
    }

    // Count number of mentions that occur at the beginning of the tweet. Begin at -1 because mentions
    // will include reply_to.
    let numOthers = -1
    let nextIndex = 0
    for (var mention of mentions) {
      if (mention.indices[0] !== nextIndex) {
        break
      }
      numOthers++
      nextIndex = mention.indices[1]+1
    }
    let otherWord = numOthers===1 ? "other" : "others"
    return `Replying to @${reply_to} and ${numOthers} ${otherWord}`
  }

  String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
  };

  function reformatText(text, reply_to=null, mentions=null, urls=null, media=null) {
    let ret = text
    let charsRemoved = 0
    // Cut out reply_to + any mentions at the beginning.
    if (reply_to !== null) {
      let nextIndex = 0
      for (var mention of mentions) {
        if (mention.indices[0] !== nextIndex) {
          break
        }
        // Plus one to get rid of the space between usernames.
        ret = ret.replaceBetween(mention.indices[0]-charsRemoved, mention.indices[1]-charsRemoved+1, "")
        charsRemoved += mention.indices[1]-mention.indices[0]+1
        nextIndex = mention.indices[1]+1
      }
    }
    if (urls !== null) {
      for (var url of urls) {
        if (url.expanded.includes("https://twitter.com")) {
          ret = ret.replace(url.current_text, "")
        } else {
          ret = ret.replace(url.current_text, url.display)
        }
      }
    }
    if (media !== null) {
      for (var m of media) {
        ret = ret.replace(m.current_text, "")
      }
    }

    return ret
  }

  function renderMedia(media, className) {
    let topImgs = ""
    let botImgs = ""
    if (media.length > 0) {
      topImgs += `<div class="th-media-image"><img src="${media[0].url}"></div>`
    }
    if (media.length > 1) {
      topImgs += `<div class="th-media-image"><img src="${media[1].url}"></div>`
    }
    if (media.length > 2) {
      botImgs += `<div class="th-media-image"><img src="${media[2].url}"></div>`
    }
    if (media.length > 3) {
      botImgs += `<div class="th-media-image"><img src="${media[3].url}"></div>`
    }

    let top = `<div class="th-media-top">${topImgs}</div>`
    let bottom = botImgs === "" ? "" : `<div class="th-media-bottom">${botImgs}</div>`
    let template = `
    <div class="${className}">
      ${top}
      ${bottom}
    </div>
    `
    return template
  }

  function renderQuote(quote, parent_has_media) {
    if (quote != null){
      let timeDiff = getTimeDiff(quote.time)
      let replyText = getReplyText(quote.reply_to, quote.mentions)
      let text = reformatText(quote.text, quote.reply_to, quote.mentions, null, quote.media)
      let minimedia = ""
      let mainmedia = ""
      if (quote.has_media) {
        if (parent_has_media) {
          minimedia = renderMedia(quote.media, "th-quote-content-minimedia")
        } else {
          mainmedia = renderMedia(quote.media, "th-quote-content-main-media")
        }
      }
      let template = `
      <div class="th-quote">
        <div class="th-quote-header">
          <img class="th-quote-header-profile" src="${quote.profile_image}">
          <div class="th-quote-header-name">${quote.name}</div>
          <div class="th-quote-header-username">@${quote.username}</div>
          <div class="th-header-dot">·</div>
          <div class="th-quote-header-time">${timeDiff}</div>
        </div>
        <div class="th-quote-reply">${replyText}</div>
        <div class="th-quote-content">
          ${minimedia}
          <div class="th-quote-content-main">
            <div class="th-quote-content-main-text">${text}</div>
            ${mainmedia}
          </div>
        </div>
      </div>
      `
      return template
    }
    else{
      let template = `
      <div class="th-quote th-unavailable">
        <div class="th-quote-content">
          <div class="th-quote-content-main">
            <div class="th-quote-content-main-text">This Tweet is unavailable.</div>
          </div>
        </div>
      </div>
      `
      return template
    }
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
    h3.innerHTML = "Thread Helper";
    h3.setAttribute("class","suggTitle");
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
}


/*
https://stackoverflow.com/questions/25840674/chrome-runtime-sendmessage-throws-exception-from-content-script-after-reloading/25844023#25844023

When the extension runtime is reloaded, which happens in any of the following cases

- You've called chrome.runtime.reload().
- You've clicked on Reload extension at chrome://extensions/.
- The extension was updated.

then the most extension API methods in the content script cease to work (including chrome.runtime.sendMessage which causes the error in the question). There are two ways to work around this problem.

[ ] Option 1: Fall back to contentscript-only functionality
[X] Option 2: Unload the previous content script on content script insertion
- When a connection with the background page is important to your content script, then you have to implement a proper unloading routine, and set up some events to unload the previous content script when the content script is inserted back via chrome.tabs.executeScript.




function destructor() {
  // Destruction is needed only once
  document.removeEventListener(destructionEvent, destructor);
  // Tear down content script: Unbind events, clear timers, restore DOM, etc.
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => chrome.tabs.reload(tabId));
}

var destructionEvent = 'destructmyextension_' + chrome.runtime.id;
// Unload previous content script if needed
document.dispatchEvent(new CustomEvent(destructionEvent));
document.addEventListener(destructionEvent, destructor);
*/


main();