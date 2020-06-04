"use strict";

  const editorClass = "DraftEditor-editorContainer";
  const textFieldClass = 'span[data-text="true"]';
  const trendText = '[aria-label="Timeline: Trending now"]';
  const w_period = 500;
  let tweets = null;
  let activeDiv = null;
  let activeComposer = {composer: null, sugg_box: null, observer: null, mode: null}
  let composers = []
  let home_sugg = null
  let observers = []
  
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

  
  function onWinResize(){if(activeComposer.sugg_box)showSuggBox(activeComposer)}

  async function loadOptions(){
    chrome.storage.local.get(["options"], r =>{
      if (typeof r.options !== "undefined"){
        options = r.options
      }
    })
  }

  async function getTweets() {
    const processTweets = function(ts){
      if (typeof ts !== 'undefined' && ts != null){
        //tweets = ts.map(t => ({...t, bag:nlp.toBag(t.text)}))
        tweets = ts
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


  function setUpTrendsListener(){
    console.log("adding trends logger")
    var observer = new MutationObserver((mutationRecords, me) => {
      var trending_block = document.querySelector(trendText)
      if (trending_block){
        var compose_box = document.getElementsByClassName(editorClass)[0]
        textBoxFocused(compose_box)
        me.disconnect()
      }
    });
    observers.push(observer)
    observer.observe(document, { subtree: true, childList: true});
    return observer
  }

  function onFocusIn(e){
    var divs = document.getElementsByClassName(editorClass)
    for (var div of divs){
      if(e.target && div.contains(e.target)){
        textBoxFocused(div)
      }
    }
  }
  function onFocusOut(e){
    var divs = document.getElementsByClassName(editorClass)
    for (var div of divs){
      if(e.target && div.contains(e.target)){
        textBoxUnfocused(div)
      }
    }
  }

  // EVENT DELEGATION CRL, EVENT BUBBLING FTW
  function setUpListeningComposeClick(){
    console.log("event listeners added")
    document.addEventListener('focusin',onFocusIn);
    document.addEventListener('focusout',onFocusOut);
  }

  // given composer found by editorClass = "DraftEditor-editorContainer",
  // outputs grandparent of const textFieldClass = 'span[data-text="true"]'
  function getTextField(compose_box){
    //return compose_box.firstElementChild.firstElementChild.firstElementChild.firstElementChild
    return compose_box.firstElementChild.firstElementChild
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

  function setUpAfterResize(){
    if (activeComposer.composer != null){

    }
  }

  function setUpBox(compose_box){
    console.log("setting up suggestion box")
    var mode = getMode();
    var composer = new Object()
    var sugg_box = null

    // for the case on reload to home page, we don't need composebox as an argument, we can find it ourselves
    if (mode == "home" && home_sugg != null){
      sugg_box = home_sugg
    }
    else{
      sugg_box = buildBox();
    }
    if (sugg_box != null){
      placeBox(sugg_box,mode)
      var observer = addLogger(getTextField(compose_box));
      composer.observer = observer;
      composer.composer = compose_box;
      composer.sugg_box = sugg_box;
      composer.mode = mode;
      activeComposer = composer;
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
    mode = getMode()
    if (mode == "home"){
      //insert a little space bc of the title
      sugg_box.setAttribute("class", 'suggestionBox_home');
      var trending_block = document.querySelector(trendText)
      if(typeof trending_block !== 'undefined' && trending_block != null)
      {
        var sideBar = trending_block.parentNode.parentNode.parentNode.parentNode.parentNode
        sideBar.insertBefore(sugg_box,sideBar.children[2])
        home_sugg = sugg_box
      }
      else{
        console.log("didn't place box, couldn't find trends block")
      }
    }
    else if(mode == "compose"){
      if (!$(".dummyContainer").length) {
        let dummyUI = $(`
          <div class="dummyContainer">
            <div class="dummyLeft"></div>
            <div id="suggestionContainer" class="dummyRight"></div>
          </div>
        `)
        console.log("trying to append dummy")
        document.body.append(dummyUI[0])
      }
      sugg_box.setAttribute("class", 'suggestionBox_compose');
      var sideBar = $("#suggestionContainer")
      sideBar.append(sugg_box,sideBar)
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
    var p = document.createElement("p");
    p.textContent = "Type something to get related tweets :)"
    sugg_box.appendChild(p);
    return sugg_box
  }

  // gets composer object that has composer and sugg_box elements
  function showSuggBox(composer){
    if (typeof composer.sugg_box !== 'undefined' && composer.sugg_box != null){
      composer.sugg_box.style.display = "flex"
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
    if (composer.mode == "home"){
      //hideSuggBox(composer)
    }
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

  function getTextFromMutation(mutationRecords){
    //const text = mutationRecords[0].target.wholeText
    const t_fields = document.querySelectorAll(textFieldClass)
    var tgt = mutationRecords[0].target
    var daddy = null

    if (tgt.tagName == "DIV") {daddy = tgt}                 //when newline
    else if (tgt.tagName !== "SPAN") {                       //if tgt is final text element - happens when you write
      daddy = tgt.parentNode.parentNode.parentNode.parentNode.parentNode
    }
    else if (!(tgt in t_fields)) {                           //when backspace the tgt is the grandparent span of the text element
      daddy = tgt.parentNode.parentNode.parentNode
    }

    var text = ''
    console.log("daddy: ", daddy)
    for (var ch of daddy.children){
      text += ch.textContent + ' '
    }
    return text
  }

  /** Updates the tweetlist when user types */
  function onChange(mutationRecords) {
    const text = getTextFromMutation(mutationRecords)
    console.log("CHANGE! text is:", text, "; in element: ", mutationRecords[0].target);
    if(tweets != null && typeof text != "undefined" && text != null && text.trim() != ''){
      if(tweets.length>0){
        var box = activeComposer.sugg_box
        //const box = document.`querySelector('[aria-label="suggestionBox"]')
        if(typeof activeComposer.sugg_box !== 'undefined' && activeComposer.sugg_box != null && activeComposer.sugg_box.style.display != "flex"){
          activeComposer.sugg_box.style.display = "flex"
        }
        const tweet = text
        const related = nlp.getRelated(tweet, tweets);
        renderTweets([...new Set(related)]);
      }
    }
    else{
      console.log("no tweets")
      if (typeof activeComposer.sugg_box !== 'undefined'){
        renderTweets([], text);
      }
    }
  }

  //** Attach a mutation observer to a div */
  function addLogger(div) {
    console.log("adding logger")
    var observer = new MutationObserver(onChange);
    observer.observe(div, { characterData: true, subtree: true, childList: true }); //attribute: true
    return observer
  }




  //||||||| RENDER CITY STARTS HERE |||||||

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
  function renderTweets(tweets, text = '') {
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
    if (tweets.length < 1 ){
      let message = ""
      if(text == ''){
        message = "Type something to get related tweets :)"
      } else{
        message = "No matching tweets yet!"
      }
      var p = document.createElement("p");
      p.innerHTML = message
      resultsDiv.appendChild(p);
    }
    const textTarget = $('span[data-text="true"]');
    for (let t of tweets) {
      const tweetDiv = renderTweet(t, textTarget);
      resultsDiv.appendChild(tweetDiv);
    }
  }

  //||||||| RENDER CITY STOPS HERE |||||||

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

function main()
{
  chrome.runtime.onMessage.addListener(onMessage);

  window.addEventListener('resize', onWinResize)
  window.onload = () => {
    //scanForTweets();
    loadOptions()
    setUpListeningComposeClick();
    setUpTrendsListener();
  }
  history.pushState = ()=>{if(activeComposer.sugg_box)showSuggBox(activeComposer)}
  
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

all this is done when a new contentscript is created, sends a DOM event that is heard by other contentscripts
*/


function destructor() {
  console.log("DESTROYING")
  // Destruction is needed only once
  document.removeEventListener(destructionEvent, destructor);
  // Tear down content script: Unbind events, clear timers, restore DOM, etc.
  document.removeEventListener('focusin',onFocusIn);
  document.removeEventListener('focusout',onFocusOut);
  window.removeEventListener('resize', onWinResize);
  chrome.runtime.onMessage.removeListener(onMessage);
  for (obs of observers){
    obs.disconnect()
  }
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => chrome.tabs.reload(tabId));
}

var destructionEvent = 'destructmyextension_' + chrome.runtime.id;
// Unload previous content script if needed
document.dispatchEvent(new CustomEvent(destructionEvent));
document.addEventListener(destructionEvent, destructor);

chrome.runtime.connect().onDisconnect.addListener(destructor)

main();