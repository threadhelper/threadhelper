"use strict";

const url_regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
// We use this to find the tweet editor
const editorClass = "DraftEditor-editorContainer";
// We use this to detect changes in the text of a tweet being composed
const textFieldClass = 'span[data-text="true"]';
// We use this to find the spot to place the sugg box in the home screen
const trendText = '[aria-label="Timeline: Trending now"]';
// Holds the tweets to search over
let tweets = null;
let tweets_meta = {
  count: 0, 
  max_id: null, 
  max_time: null,
  since_id: null, 
  since_time: null,
  last_updated: null,
  has_archive: false,
  has_timeline: false,
}

// Options
let options = {}
// User info
let user_info = {}
// Hold the active context of tweeting/sugg_box
let activeComposer = {composer: null, sugg_box: null, observer: null, mode: null}
// Hold the underlying home sugg_box
let home_sugg = null
// Holds observers for eventual destruction
let observers = []
// Holds sync status
/* 
Sync:
- synced: No new tweets
- unsynced: There may be new tweets
Status:
- empty: No tweets
- new: Just latest few tweets
- timeline: got all getttable timeline tweets
- archive: got tweets from archive
*/
let sync_status = {
  EMPTY: "empty",
  UPDATE: "update",
  TIMELINE: "timeline",
  HISTORY: "history",
  ARCHIVE: "archive"
}
let db_sync = {synced: false, status:sync_status.EMPTY, msg: "No tweets yet..." }
// Whether a request is already halfway through
let mid_request = false
// Whether the timeline has been gotten 
let has_timeline = false
let current_url = ''

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


async function loadOptions(){
  chrome.storage.local.get(["options"], r =>{
    if (typeof r.options !== "undefined"){
      options = r.options
    }
  })
  return options
}
async function loadUserInfo(){
  chrome.storage.local.get(["user_info"], r =>{
    if (typeof r.user_info !== "undefined"){
      user_info = r.user_info
    }
  })
  return user_info
}

function clearTweets(){
  console.log("clearing tweets")
  tweets = null
  tweets_meta = null
  user_info = {}
}

function makeTweetsMeta(tweets, update_type = "update"){
  var meta = {
    count: tweets.length, 
    max_id: tweets[tweets.length - 1].id, 
    max_time: tweets[tweets.length - 1].time,
    since_id: tweets[0].id, 
    since_time: tweets[0].time,
    last_updated: (new Date()).getTime(),
    has_archive: tweets_meta.has_archive || update_type == "archive",
    has_timeline: tweets_meta.has_timeline || update_type == "timeline",
  }
  return tweets_meta
}

// filter to get only tweets by user
function filterUserTweets(ts){
  let _filtered = ts
  if (user_info != null && user_info.screen_name != null){
    _filtered = ts.filter(t=>{
      return t.username == user_info.screen_name
    })
  }
  else{
    //console.log('dont have user info or screen name')
  }
  return _filtered
}

function tweetsEmpty(tweets){
  return !(typeof ts !== 'undefined') || tweets == null || tweets.length < 1
}

// sets sync status
function handleNewTweets(from_message){  
  // make sync icon green
  if(!from_message) setSyncStatus(true, "Tweets loaded.", sync_status.TIMELINE)

  // make archive icon invisible if we already have the archive
  let icons = document.getElementsByClassName("arch_icon")
  for (let i of icons){
    if (tweets_meta.has_archive) {
      i.style.display = "none";
    }else{
      i.style.display = "block";
    }
  }
}

// gets tweets from storage
async function getTweets(from_message=false) {
  loadUserInfo()
  var meta = {}
  tweets_meta = await getData("tweets_meta")
  var ts = await getData("tweets")
  if (typeof ts !== 'undefined' && ts != null){
    if (!options.getRetweets){
      ts = filterUserTweets(ts)
      meta = makeTweetsMeta(ts)
    }
    //if collection change, make a new index
    if(tweetsEmpty(tweets) || (ts.length > 0 && tweets.length != ts.length && tweets != ts)){
      tweets = ts
      tweets_meta = meta
      let prev_msg = ''
      if (document.getElementsByClassName("suggConsole").length > 0) {
        prev_msg = showConsoleMessage("Just a moment, making an index of your tweets...")
      }
      nlp.makeIndex(tweets)
      if (document.getElementsByClassName("suggConsole").length > 0) showConsoleMessage(prev_msg)
    }
    handleNewTweets(from_message)
    return tweets
  }else{
    if(!from_message) setSyncStatus(false, "No tweets yet...", sync_status.EMPTY)
    if(tweetsEmpty(tweets)) msgBG({type: "timeline"})
    return null
  }
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

// Sets up a listener for the Recent Trends block
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
function onWinResize(){if(activeComposer.sugg_box)showSuggBox(activeComposer)}

function textBoxUnfocused(compose_box){
  //console.log("text box focus out")
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
  } else{
    msgBG({type: "update"})
  }
  console.log("text box focus in!")
  // if the clicked composer is different from previous active composer and elligible
  if (compose_box != activeComposer.composer && getMode() != "other"){
    //if (!mid_request) msgBG()
    console.log(tweets )
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
  //console.log("setting up suggestion box")
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
  //setTheme();
  mode = getMode()
  if (mode == "home"){
    //insert a little space bc of the title
    sugg_box.setAttribute("class", 'suggestionBox sug_home');
    var trending_block = document.querySelector(trendText)
    if(typeof trending_block !== 'undefined' && trending_block != null)
    {
      var sideBar = trending_block.parentNode.parentNode.parentNode.parentNode.parentNode
      sideBar.insertBefore(sugg_box,sideBar.children[2])
      home_sugg = sugg_box
    }
    else{
      //console.log("didn't place box, couldn't find trends block")
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
    sugg_box.setAttribute("class", 'suggestionBox sug_compose');
    var sideBar = $("#suggestionContainer")
    sideBar.append(sugg_box,sideBar)
  }
  else{
      console.log("didn't place box, not in right mode")
      console.log(mode)
  }
}

function buildSyncIcon(){
  let sync_icon = document.createElement('span')
  let sync_class = db_sync.synced ? 'sync_icon synced' : 'sync_icon unsynced';
  sync_icon.setAttribute("class", sync_class);
  let tooltiptext = document.createElement('span')
  tooltiptext.innerHTML = db_sync.msg
  tooltiptext.setAttribute("class", 'tooltiptext');
  sync_icon.appendChild(tooltiptext)
  sync_icon.onclick = ()=>{console.log("Metadata:",tweets_meta); console.log("User info:", user_info)}
  return sync_icon
}

function buildArchIcon(){
  let msg = '<span>Click here to upload your Twitter Archive here. <a href="https://twitter.com/settings/your_twitter_data">Download an archive of your data</a>, extract it and select the resulting folder.</span>';
  let arch_icon = document.createElement('span')
  arch_icon.setAttribute("class", "arch_icon");
  let span = document.createElement('button')
  span.textContent = " (load archive)"
  arch_icon.appendChild(span)
  if(tweets_meta.has_archive) arch_icon.style.display = "none";

  let tooltiptext = document.createElement('span')
  tooltiptext.innerHTML = msg
  tooltiptext.setAttribute("class", 'tooltiptext');
  arch_icon.appendChild(tooltiptext)
  arch_icon.onclick = ()=>{(document.getElementById("hidden_load_archive")).click()}
  return arch_icon
}

// Builds the header: Currently title and sync light
function buildBoxHeader(){
  let headerDiv = document.createElement('div')
  headerDiv.setAttribute("class", "suggHeader")
  var h3 = document.createElement('h3')
  let span = document.createElement('span')
  span.textContent = "Thread Helper"
  h3.appendChild(span)
  h3.setAttribute("class","suggTitle");
  headerDiv.appendChild(buildSyncIcon())
  headerDiv.appendChild(h3)
  headerDiv.appendChild(buildArchIcon())
  return headerDiv
}

// Builds a display for notifications
function buildBoxConsole(){
  let consoleDiv = document.createElement('div')
  consoleDiv.setAttribute("class", "suggConsole")
  consoleDiv.setAttribute("id", "suggConsole")
  consoleDiv.innerHTML = "Type something to get related tweets :)"
  return consoleDiv
}

// Show a message in console, returns old message (presumably for interrupts and stuff like that)
// TODO: Consoles could be separate but right now they're all the same. Could lead to confusion in the future
function showConsoleMessage(message){
  let consoleDivs = document.getElementsByClassName("suggConsole")
  let old_msg = ''
  for(let consoleDiv of consoleDivs) {
    old_msg = consoleDiv.innerHTML
    consoleDiv.innerHTML = message;
  }
  return old_msg
}

/** buildBox creates the 'Thread Helper' html elements */
function buildBox() {
  var sugg_box = null;
  sugg_box = document.createElement('div');   //create a div
  sugg_box.setAttribute("aria-label", 'suggestionBox');
  
  sugg_box.appendChild(setUpLoadArchive())
  sugg_box.appendChild(buildBoxHeader())
  sugg_box.appendChild(buildBoxConsole())
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
  //console.log("daddy: ", daddy)
  for (var ch of daddy.children){
    text += ch.textContent + ' '
  }
  return text
}

/** Updates the tweetlist when user types */
async function onChange(mutationRecords) {
  const text = getTextFromMutation(mutationRecords)
  //console.log("CHANGE! text is:", text, "; in element: ", mutationRecords[0].target);
  if(tweets != null && typeof text != "undefined" && text != null && text.trim() != ''){
    if(tweets.length>0){
      var box = activeComposer.sugg_box
      //const box = document.`querySelector('[aria-label="suggestionBox"]')
      if(typeof activeComposer.sugg_box !== 'undefined' && activeComposer.sugg_box != null && activeComposer.sugg_box.style.display != "flex"){
        activeComposer.sugg_box.style.display = "flex"
      }
      const tweet = text.replace(url_regex, "")

      nlp.getRelated(tweet).then((related)=>{renderTweets([...new Set(related)])});
      // renderTweets([...new Set(related)]);
    }
  }
  else{
    //console.log("no tweets")
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
  var resultsDiv = activeComposer.sugg_box
  for (let child of resultsDiv.children){
    if (child.className == "th-tweet-container") {resultsDiv.removeChild(child);}
    else{
    }
  }
  let children = resultsDiv.children
  while (children.length > 3) {
    children = resultsDiv.children
    resultsDiv.removeChild(children[children.length -1]);
  }
  let message = ''
  // Header and hidden load button
  if (tweets.length < 1){
    if(text == ''){
      message = "Type something to get related tweets :)"
    } else{
      message = "No matching tweets yet!"
    }
  } else{
    message = "Found these:"
  }
  showConsoleMessage(message)
  const textTarget = $('span[data-text="true"]');
  for (let t of tweets) {
    const tweetDiv = renderTweet(t, textTarget);
    resultsDiv.appendChild(tweetDiv);
  }
}

//||||||| RENDER CITY NOW LEAVING |||||||

function setSyncStatus(sync, message='Sync Info:', status = null){
  chrome.storage.local.get(["tweets_meta"], r =>{
    let si = document.getElementsByClassName("sync_icon")
    db_sync.synced = sync == null ? db_sync.synced : sync;
    db_sync.status = status == null ? db_sync.status : status;
    let classes = db_sync.synced ? 'sync_icon synced' : 'sync_icon unsynced'
    message = message.concat(` \n${db_sync.status}. \n`)
    if (r.tweets_meta != null){
      message = message.concat(` \nHolding ${r.tweets_meta.count} tweets. \nLast updated ${(new Date(r.tweets_meta.last_updated)).toLocaleString()}`)
    } else{
      message = message.concat(` \nHolding ${0} tweets.`)
    }
    db_sync.msg = message;
    for (let s of si){  
      s.setAttribute("class", classes);
      s.firstChild.innerText = db_sync.msg
    }
  }); 
}




function importArchive() {
  let result = this.result.replace(/^[a-z0-9A-Z\.]* = /, "");

  var importedTweetArchive = JSON.parse(result);
  //here is your imported data, and from here you should know what to do with it (save it to some storage, etc.)
  console.log(importedTweetArchive)
  //document.getElementById("loadArchive").value = ''; //make sure to clear input value after every import, iideally name wouldn't be  hardcoded

  chrome.storage.local.set({temp_archive: importedTweetArchive}, function() {
    console.log("temp tweet archive stored", user_info)
    msgBG({type:"tempArchiveStored"})
    (document.getElementById("hidden_load_archive")).value = null;
  })
}

function setUpLoadArchive(){
  var x = document.createElement("input");
    let file = {}
    let idx = 0
      x.setAttribute("type", "file");
      x.setAttribute("id", "hidden_load_archive");
      //x.accept=".json,.js,.zip" ;
      x.webkitdirectory = true;
      x.style.display = "none"
      x.addEventListener("change", (e) => {
        mid_request = true
        setSyncStatus(false, `Loading tweets...`)
        var files = e.target.files, reader = new FileReader();
        reader.onload = importArchive;
        for (let i = 0; i < files.length; i++){
          if(files[i].name == "tweet.js"){ file = files[i]; idx = i; break;}
        }
        console.log("files length", files.length)
        //if(idx <= files.length) 
        reader.readAsText(files[idx]);  
      }, false);
  return x
}

//** Handles messages sent from background or popup */
async function onMessage(m) {
  console.log("message received:", m);
  switch (m.type) {
    case "saveOptions":
      Utils.loadOptions()
      break;
    case "saveArchive":
      let fileName = "threadhelper_archive.json";
      let data = JSON.stringify([tweets, tweets_meta], undefined, 4)
      console.log("saving", data)
      var blob = new Blob([data], {type: "text/plain;charset=utf-8", name: fileName});
      saveAs(blob, fileName);
      break;
    case "tweets-loading":
      mid_request = true
      setSyncStatus(false, `Loading tweets...`)
      break;
    case "tweets-loaded":
      mid_request = true
      //console.log("tweets loaded, getting tweets")
      getTweets(true)
      setSyncStatus(null, "Tweets partially loaded...")
      break;
    case "tweets-done":
      mid_request = false
      setSyncStatus(true, "Tweets loaded.", m.update_type)
      break;
    case "storage-clear":
      //let sync_message = `Holding ${meta.count} tweets. \n Last updated ${(new Date(meta.since_time)).toLocaleString()}`
      clearTweets()
      setSyncStatus(false, `No tweets yet...`, sync_status.EMPTY)
      break;
    case "tab-activate":
      current_url = m.url
      break;
    case "tab-change-url":
      current_url = m.url
      setTheme()  
      if(activeComposer.sugg_box)showSuggBox(activeComposer)
      break;  
  }
  return true
}


const light_theme = "rgb(255, 255, 255)"
const dim_theme = "rgb(21, 32, 43)"
const black_theme = "rgb(0, 0, 0)"


function setTheme(){
  let root = document.documentElement;
  let bg_color = document.body.style["background-color"]

  
  //console.log("setting theme", bg_color)
  switch(bg_color){
    case light_theme:
      root.style.setProperty('--main-bg-color', "#f5f8fa");
      root.style.setProperty('--main-txt-color', "black");
      root.style.setProperty('--main-border-color', "#e1e8ed");
      break;
    case dim_theme:
      root.style.setProperty('--main-bg-color', "#192734");
      root.style.setProperty('--main-txt-color', "white");
      root.style.setProperty('--main-border-color', "#38444d");
      break;
    case black_theme:
      root.style.setProperty('--main-bg-color', "black");
      root.style.setProperty('--main-txt-color', "white");
      root.style.setProperty('--main-border-color', "#2f3336");
      break;
    default:
      root.style.setProperty('--main-bg-color', "#f5f8fa");
      root.style.setProperty('--main-txt-color', "black");
      root.style.setProperty('--main-border-color', "#e1e8ed");
      break;
  }
}

function msgBG(msg = null){
  let message = msg == null ? {type: "update"} : msg
  chrome.runtime.sendMessage(message);
  console.log("messaging BG", message)
}

function main()
{
  chrome.runtime.onMessage.addListener(onMessage);

  window.addEventListener('resize', onWinResize)
  window.onload = () => {
    document.addEventListener(destructionEvent, destructor);
    setUpListeningComposeClick();
    setUpTrendsListener();
  }
  $(document).ready(function() {
    msgBG({type:"cs-created"})
    setTheme()
    loadOptions();
  })
  window.onpopstate = ()=>{
    //console.log("url changed")
    setTheme()
    if(activeComposer.sugg_box)showSuggBox(activeComposer)
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

all this is done when a new contentscript is created, sends a DOM event that is heard by other contentscripts
*/


function destructor() {
  // Destruction is needed only once
  document.removeEventListener(destructionEvent, destructor);
  // Tear down content script: Unbind events, clear timers, restore DOM, etc.
  document.removeEventListener('focusin',onFocusIn);
  document.removeEventListener('focusout',onFocusOut);
  window.removeEventListener('resize', onWinResize);
  chrome.runtime.onMessage.removeListener(onMessage);
  for (let obs of observers){
    if (obs != null) obs.disconnect()
  }
  console.log("DESTROYED")
  //chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => chrome.tabs.reload(tabId));
}

var destructionEvent = 'destructmyextension_' + chrome.runtime.id;
// Unload previous content script if needed
document.dispatchEvent(new CustomEvent(destructionEvent));

document.addEventListener(destructionEvent, destructor);


let port = chrome.runtime.connect()
//port.onDisconnect.addListener(destructor)
main();