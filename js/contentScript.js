"use strict";


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

String.prototype.replaceBetween = function(start, end, what) {
  return this.substring(0, start) + what + this.substring(end);
};

function msgBG(msg = null){
  let message = msg == null ? {type: "update"} : msg
  chrome.runtime.sendMessage(message);
  console.log("messaging BG", message)
}

// Data/Storage/Comms utils
class dUtils {
  constructor() {
    // dutils.options
    this.options = {}
    // Holds observers for eventual destruction
  }

    
  getData(key) {
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

  async loadOptions(){
    chrome.storage.local.get(["options"], r =>{
      if (typeof r.options !== "undefined"){
        dutils.options = r.options
      }
    })
    return dutils.options
  }

  msgBG(msg = null){
    let message = msg == null ? {type: "update"} : msg
    chrome.runtime.sendMessage(message);
    console.log("messaging BG", message)
  }
}
// webpage / style utils
class wUtils {
  constructor(){
    this.observers = []
    this.url_regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
    this.current_url = ''
  }

  setTheme(){
    const light_theme = "rgb(255, 255, 255)"
    const dim_theme = "rgb(21, 32, 43)"
    const black_theme = "rgb(0, 0, 0)"
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

  // Modes: home, compose, something else?
  getMode(){
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
  setUpTrendsListener(){
    console.log("adding trends logger")
    var observer = new MutationObserver((mutationRecords, me) => {
      var trending_block = document.querySelector(ui.trendText)
      if (trending_block){
        var compose_box = document.getElementsByClassName(ui.editorClass)[0]
        ui.textBoxFocused(compose_box)
        ui.showSuggBox(ui.activeComposer)
        me.disconnect()
      }
    });
    this.observers.push(observer)
    observer.observe(document, { subtree: true, childList: true});
    return observer
  }

  // Detect when the compose box is focused
  onFocusIn(e){
    var divs = document.getElementsByClassName(ui.editorClass)
    for (var div of divs){
      if(e.target && div.contains(e.target)){
        ui.textBoxFocused(div)
      }
    }
  }
  // Detect when the compose box loses focus
  onFocusOut(e){
    var divs = document.getElementsByClassName(ui.editorClass)
    for (var div of divs){
      if(e.target && div.contains(e.target)){
        ui.textBoxUnfocused(div)
      }
    }
  }

  // EVENT DELEGATION CRL, EVENT BUBBLING FTW
  setUpListeningComposeClick(){
    console.log("event listeners added")
    document.addEventListener('focusin',this.onFocusIn);
    document.addEventListener('focusout',this.onFocusOut);
  }

  // given composer found by ui.editorClass = "DraftEditor-editorContainer",
  // outputs grandparent of const ui.textFieldClass = 'span[data-text="true"]'
  getTextField(compose_box){
    //return compose_box.firstElementChild.firstElementChild.firstElementChild.firstElementChild
    return compose_box.firstElementChild.firstElementChild
  }

  
  onWinResize(){if(ui.activeComposer.sugg_box) ui.showSuggBox(ui.activeComposer)}

  

}
class UI {
  constructor() {
    // We use this to find the tweet editor
    this.editorClass = "DraftEditor-editorContainer";
    // We use this to detect changes in the text of a tweet being composed
    this.textFieldClass = 'span[data-text="true"]';
    // We use this to find the spot to place the sugg box in the home screen
    this.trendText = '[aria-label="Timeline: Trending now"]';
    /* Holds sync status
    Sync:
    - synced: No new tweets
    - unsynced: There may be new tweets
    Status:
    - empty: No tweets
    - new: Just latest few tweets
    - timeline: got all getttable timeline tweets
    - archive: got tweets from archive
    */
    this.sync_status = {
      EMPTY: "empty",
      UPDATE: "update",
      TIMELINE: "timeline",
      HISTORY: "history",
      ARCHIVE: "archive"
    }
    
    // Hold the active context of tweeting/sugg_box
    this.activeComposer = {composer: null, sugg_box: null, observer: null, mode: null}
    // Hold the underlying home sugg_box
    this.home_sugg = null

    this.current_res = []
    
  }

  
  textBoxUnfocused(compose_box){
    //console.log("text box focus out")
    // If the active composer is empty and unselected, kill
    if (compose_box == this.activeComposer.composer && this.isComposeEmpty(this.activeComposer)){
      if (this.activeComposer.mode != "home"){
        this.killComposer(this.activeComposer)
      }
    }
  }
  
  // The .composer parameter of the composer
  textBoxFocused(compose_box){
    if (Object.keys(wiz.getTweets()).length < 1){
      wiz.loadTweets()
    } else{
      dutils.msgBG({type: "update"})
    }
    console.log("text box focus in!")
    // if the clicked composer is different from previous active composer and elligible
    if (compose_box != this.activeComposer.composer && wutils.getMode() != "other"){
      if (this.activeComposer.mode != "home") this.killComposer(this.activeComposer)
      var composer = this.setUpBox(compose_box)
      //if suggestion box was created, add logger
    }
    else{
      this.showSuggBox(this.activeComposer)
    }
  }
    
  setUpBox(compose_box){
    //console.log("setting up suggestion box")
    var mode = wutils.getMode();
    var composer = new Object()
    var sugg_box = null

    // for the case on reload to home page, we don't need composebox as an argument, we can find it ourselves
    if (mode == "home" && ui.home_sugg != null){
      sugg_box = this.home_sugg
    }
    else{
      sugg_box = this.buildBox();
    }
    if (sugg_box != null){
      this.placeBox(sugg_box,mode)
      var observer = this.addLogger(wutils.getTextField(compose_box));
      composer.observer = observer;
      composer.composer = compose_box;
      composer.sugg_box = sugg_box;
      composer.mode = mode;
      this.activeComposer = composer;
      console.log("box set up")
      console.log(ui.activeComposer)
    }
    else{
      console.log("null box")
    }
  }

  placeBox(sugg_box, mode){
    wutils.setTheme();
    mode = wutils.getMode()
    if (mode == "home"){
      //insert a little space bc of the title
      sugg_box.setAttribute("class", 'suggestionBox sug_home');
      var trending_block = document.querySelector(ui.trendText)
      if(typeof trending_block !== 'undefined' && trending_block != null)
      {
        var sideBar = trending_block.parentNode.parentNode.parentNode.parentNode.parentNode
        sideBar.insertBefore(sugg_box,sideBar.children[2])
        ui.home_sugg = sugg_box
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

  buildSyncIcon(){
    let sync_icon = document.createElement('span')
    let sync_class = wiz.db_sync.synced ? 'sync_icon synced' : 'sync_icon unsynced';
    sync_icon.setAttribute("class", sync_class);
    let tooltiptext = document.createElement('span')
    tooltiptext.innerHTML = wiz.db_sync.msg
    tooltiptext.setAttribute("class", 'tooltiptext');
    sync_icon.appendChild(tooltiptext)
    sync_icon.onclick = ()=>{console.log("Metadata:",wiz.tweets_meta); console.log("User info:", wiz.user_info); console.log("Results:", ui.current_res); wiz.loadTweets()}
    return sync_icon
  }

  buildArchIcon(){
    let msg = '<span>Click here to upload your Twitter Archive here. <a href="https://twitter.com/settings/your_twitter_data">Download an archive of your data</a>, extract it and select the resulting folder.</span>';
    let arch_icon = document.createElement('span')
    arch_icon.setAttribute("class", "arch_icon");
    let span = document.createElement('button')
    span.textContent = " (load archive)"
    arch_icon.appendChild(span)
    if(wiz.tweets_meta.has_archive) arch_icon.style.display = "none";

    let tooltiptext = document.createElement('span')
    tooltiptext.innerHTML = msg
    tooltiptext.setAttribute("class", 'tooltiptext');
    arch_icon.appendChild(tooltiptext)
    arch_icon.onclick = ()=>{(document.getElementById("hidden_load_archive")).click()}
    return arch_icon
  }

  // Builds the header: Currently title and sync light
  buildBoxHeader(){
    let headerDiv = document.createElement('div')
    headerDiv.setAttribute("class", "suggHeader")
    var h2 = document.createElement('h2')
    let span = document.createElement('span')
    span.textContent = "Thread Helper"
    h2.appendChild(span)
    h2.setAttribute("class","suggTitle");
    headerDiv.appendChild(this.buildSyncIcon())
    headerDiv.appendChild(h2)
    headerDiv.appendChild(this.buildArchIcon())
    return headerDiv
  }

  // Builds a display for notifications
  buildBoxConsole(){
    let consoleDiv = document.createElement('div')
    consoleDiv.setAttribute("class", "suggConsole")
    consoleDiv.setAttribute("id", "suggConsole")
    consoleDiv.innerHTML = "Type something to get related tweets :)"
    return consoleDiv
  }

  // Sets up a hidden file load button that is clicked by the button the user clicks.
  // Currently getting from dir but I worry it puts the whole contents into memory while we just want tweet.js and so maybe we should be import it directly (more user clicks)
  setUpLoadArchive(){
    var x = document.createElement("input");
      let file = {}
      let idx = 0
        x.setAttribute("type", "file");
        x.setAttribute("id", "hidden_load_archive");
        //x.accept=".json,.js,.zip" ;
        x.webkitdirectory = true;
        x.style.display = "none"
        x.addEventListener("change", (e) => {
          wiz.mid_request = true
          wiz.setSyncStatus(false, `Loading tweets...`)
          var files = e.target.files, reader = new FileReader();
          reader.onload = wiz.importArchive;
          for (let i = 0; i < files.length; i++){
            if(files[i].name == "tweet.js"){ file = files[i]; idx = i; break;}
          }
          console.log("files length", files.length)

          //if(idx <= files.length) 
          reader.readAsText(files[idx]);  
        }, false);
    return x
  }

  /** buildBox creates the 'Thread Helper' html elements */
  buildBox() {
    var sugg_box = null;
    sugg_box = document.createElement('div');   //create a div
    sugg_box.setAttribute("aria-label", 'suggestionBox');
    
    sugg_box.appendChild(this.setUpLoadArchive())
    sugg_box.appendChild(this.buildBoxHeader())
    sugg_box.appendChild(this.buildBoxConsole())
    return sugg_box
  }

  // Show a message in console, returns old message (presumably for interrupts and stuff like that)
  // TODO: Consoles could be separate but right now they're all the same. Could lead to confusion in the future
  showConsoleMessage(message){
    let consoleDivs = document.getElementsByClassName("suggConsole")
    let old_msg = ''
    for(let consoleDiv of consoleDivs) {
      old_msg = consoleDiv.innerHTML
      consoleDiv.innerHTML = message;
    }
    return old_msg
  }

  // gets composer object that has composer and sugg_box elements
  showSuggBox(composer){
    if (typeof composer.sugg_box !== 'undefined' && composer.sugg_box != null){
      composer.sugg_box.style.display = "flex"
      if(!document.body.contains(composer.sugg_box)){
        this.placeBox(composer.sugg_box)
      }
    }
  }

  // gets composer object that has composer and sugg_box elements
  hideSuggBox(composer){
    if (typeof composer.sugg_box !== 'undefined' ){
      //console.log("hiding box")
      if (composer.mode == "home") ren.renderTweets([]);
      else if (composer.sugg_box != null) composer.sugg_box.style.display = "none"
      //composer.sugg_box.remove()
      //composer.sugg_box = null
    }
  }
    
  /////////////////////////////////////////
  /////////////////////////////////////////
  //|||||||| COMPOSER CITY STARTING ||||||||
  /////////////////////////////////////////
  /////////////////////////////////////////

  //usually ui.activeComposer
  killComposer(composer){
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
      //ui.home_sugg = null;
      if (typeof composer.observer !== 'undefined' && composer.observer != null){
        composer.observer.disconnect()
        composer.observer = null
      }
      composer.mode = null
    }
  }

  //checks whether composeBox is empty
  isComposeEmpty(comp){
    var spans = document.querySelectorAll(ui.textFieldClass);
    for (var s of spans){
      if(comp.composer.contains(s)){
        return false
      }
    }
    return true
  }

  getTextFromMutation(mutationRecords){
    //const text = mutationRecords[0].target.wholeText
    const t_fields = document.querySelectorAll(ui.textFieldClass)
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

  //** Attach a mutation observer to a div */
  addLogger(div) {
    console.log("adding logger")
    var observer = new MutationObserver(onChange);
    observer.observe(div, { characterData: true, subtree: true, childList: true }); //attribute: true
    return observer
  }
}

/** Updates the tweetlist when user types */
async function onChange(mutationRecords) {
  const text = ui.getTextFromMutation(mutationRecords)
  console.log("CHANGE! text is:", text, "; in element: ", mutationRecords[0].target);
  //console.log(wiz.getTweets())
  if(wiz.getTweets() != null && typeof text != "undefined" && text != null && text.trim() != ''){
    //this.current_res = []
    if(Object.keys(wiz.getTweets()).length>0){
      var box = ui.activeComposer.sugg_box
      //const box = document.`querySelector('[aria-label="suggestionBox"]')
      if(typeof ui.activeComposer.sugg_box !== 'undefined' && ui.activeComposer.sugg_box != null && ui.activeComposer.sugg_box.style.display != "flex"){
        ui.activeComposer.sugg_box.style.display = "flex"
      }
      const tweet = text.replace(wutils.url_regex, "")
      nlp.getRelated(tweet, wiz.getTweets()).then((related)=>{
        ui.current_res = [...new Set(related)]
        console.log(ui.current_res)
        ren.renderTweets([...new Set(related)])
      });
    }
  }
  else{
    console.log("no tweets")
    if (typeof ui.activeComposer.sugg_box !== 'undefined'){
      ren.renderTweets([], text);
    }
  }
}

class Renderer {
  constructor() {
    this.shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
  }

    
  renderTweet(tweet, textTarget) {
    let tweetLink = `https://twitter.com/${"undefined"}/status/${tweet.id}`
    try{
      tweetLink = `https://twitter.com/${tweet.username}/status/${tweet.id}`
    } catch(e){
      console.log("ERROR",tweet)
    }
    let timeDiff = this.getTimeDiff(tweet.time)
    let reply_text = this.getReplyText(tweet.reply_to, tweet.mentions)
    let text = this.reformatText(tweet.text, tweet.reply_to, tweet.mentions, tweet.urls, tweet.media)
    let maybeMedia = tweet.has_media ? this.renderMedia(tweet.media, "th-media") : ""
    let maybeQuote = tweet.has_quote ? this.renderQuote(tweet.quote, tweet.has_media) : ""
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
      var input = ui.activeComposer.composer.firstElementChild
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

  getTimeDiff(time) {
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
    let month = this.shortMonths[timeDate.getMonth()]
    let day = timeDate.getDate()
    let thisYear = new Date(now.getFullYear(), 0)
    return timeDate > thisYear ? `${month} ${day}` : `${month} ${day}, ${timeDate.getFullYear()}`
  }

  getReplyText(reply_to, mentions) {
    if (reply_to === null) {
      return ""
    } else 
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

  reformatText(text, reply_to=null, mentions=null, urls=null, media=null) {
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

  renderMedia(media, className) {
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

  renderQuote(quote, parent_has_media) {
    if (quote != null){
      let timeDiff = this.getTimeDiff(quote.time)
      let replyText = this.getReplyText(quote.reply_to, quote.mentions)
      let text = this.reformatText(quote.text, quote.reply_to, quote.mentions, null, quote.media)
      let minimedia = ""
      let mainmedia = ""
      if (quote.has_media) {
        if (parent_has_media) {
          minimedia = this.renderMedia(quote.media, "th-quote-content-minimedia")
        } else {
          mainmedia = this.renderMedia(quote.media, "th-quote-content-main-media")
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
  renderTweets(tweets, text = '') {
    var resultsDiv = ui.activeComposer.sugg_box
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
    ui.showConsoleMessage(message)
    const textTarget = $('span[data-text="true"]');
    for (let t of tweets) {
      const tweetDiv = this.renderTweet(t, textTarget);
      resultsDiv.appendChild(tweetDiv);
    }
  }

}

class TweetWiz{
  constructor(){
    // Holds the tweets to search over
    this.tweets_dict = {};
    this.tweets_meta = {
      count: 0, 
      max_id: null, 
      max_time: null,
      since_id: null, 
      since_time: null,
      last_updated: null,
      has_archive: false,
      has_timeline: false,
    }
    // User info
    this.user_info = {}
    // holds sync state between CS and BG
    this.db_sync = {synced: false, status:ui.sync_status.EMPTY, msg: "No tweets yet..." }
    // Whether a request is already halfway through
    this.mid_request = false
  }

  getTweets(){
    return this.tweets_dict
  }
    
  async loadUserInfo(){
    chrome.storage.local.get(["user_info"], r =>{
      if (typeof r.user_info !== "undefined"){
        this.user_info = r.user_info
      }
    })
    return this.user_info
  }

  clearTweets(){
    console.log("clearing tweets")
    this.tweets= null
    this.tweets_meta = null
    this.user_info = {}
  }
   
  makeTweetsMeta(tweets, update_type = "update"){
    let meta = {}
    if (tweets != null){
      let len = Object.keys(tweets).length - 1
      let first_key = Object.keys(tweets)[0]
      let last_key = Object.keys(tweets)[len]
      meta = {
        count: len, 
        max_id: tweets[last_key].id, 
        max_time: tweets[last_key].time,
        since_id: tweets[first_key].id, 
        since_time: tweets[first_key].time,
        last_updated: (new Date()).getTime(),
        has_archive: update_type == "archive" || wiz.tweets_meta.has_archive ,
        has_timeline: wiz.tweets_meta.has_timeline, //update_type == "timeline"
      }
    } else{
      meta = {
        count: 0, 
        max_id: null, 
        max_time: null,
        since_id: null, 
        since_time: null,
        last_updated: null,
        has_archive: false,
        has_timeline: false,
      }
    }
    return meta
  }
  // filter to get only tweets by user
  filterUserTweets(ts){
    let key_vals = Object.entries(ts)

    const _filtered = Object.fromEntries(
      key_vals.filter(key_val => key_val[1].username == this.user_info.screen_name)
    )
    return _filtered
  }
  
  tweetsEmpty(tweets=null){
    tweets = tweets != null ? tweets : this.tweets_dict
    return !(typeof tweets !== 'undefined') || tweets == null || Object.keys(tweets).length < 1
  }
  
  // sets sync status
  handleNewTweets(from_message){  
    // make sync icon green
    if(!from_message) this.setSyncStatus(true, "Tweets loaded.", ui.sync_status.TIMELINE)

    // make archive icon invisible if we already have the archive
    let icons = document.getElementsByClassName("arch_icon")
    for (let i of icons){
      if (this.tweets_meta.has_archive) {
        i.style.display = "none";
      }else{
        i.style.display = "block";
      }
    }
  }

  // Compute ites that are different between 2 dicts of tweets
  getNewTweets(old_t,new_t){
    console.log("getnewtweets")
    let old_keys = old_t != null ? Object.keys(old_t) : []
    let new_key_vals = Object.entries(new_t)
    const _filtered = Object.fromEntries(
      new_key_vals.filter(key_val => {return !old_keys.includes(key_val[0])})
    )
    return _filtered
  }

  // gets tweets from storage
  async loadTweets(from_message=false) {
    this.loadUserInfo()
    let meta = {}
    this.tweets_meta = await dutils.getData("tweets_meta")
    let tweets_stored = await dutils.getData("tweets")
    // console.log("tweets_meta", this.tweets_meta)
    // console.log("tweets_stored", tweets_stored)
    
    if (typeof tweets_stored !== 'undefined' && tweets_stored != null){
      // If we shouldn't search over retweets
      if (!dutils.options.getRetweets){
        tweets_stored = this.filterUserTweets(tweets_stored)
        meta = wiz.makeTweetsMeta(tweets_stored)
      }
      let new_tweets = this.getNewTweets(this.tweets_dict, tweets_stored)
      // console.log("new tweets", new_tweets)
      
      if(Object.keys(new_tweets).length > 0){
        this.tweets_dict = Object.assign(this.tweets_dict, tweets_stored)
        let prev_msg = ''
        // store previous message and show loading msg
        if (document.getElementsByClassName("suggConsole").length > 0) {
          prev_msg = ui.showConsoleMessage("Just a moment, making an index of your tweets...")
        }
        //add new tweets to index and replace message
        nlp.addToIndex(new_tweets).then(()=>{if (document.getElementsByClassName("suggConsole").length > 0) ui.showConsoleMessage(prev_msg)})
        this.handleNewTweets(from_message)
      }
      return this.tweets
    }else{
      if(!from_message) this.setSyncStatus(false, "No tweets yet...", ui.sync_status.EMPTY)
      if(this.tweetsEmpty()) dutils.msgBG({type: "timeline"})
      return null
    }
  }

  setSyncStatus(sync, message='Sync Info:', status = null){
    chrome.storage.local.get(["tweets_meta"], r =>{
      let si = document.getElementsByClassName("sync_icon")
      this.db_sync.synced = sync == null ? this.db_sync.synced : sync;
      this.db_sync.status = status == null ? this.db_sync.status : status;
      let classes = this.db_sync.synced ? 'sync_icon synced' : 'sync_icon unsynced'
      message = message.concat(` \n${this.db_sync.status}. \n`)
      if (r.tweets_meta != null){
        message = message.concat(` \nHolding ${r.tweets_meta.count} tweets. \nLast updated ${(new Date(r.tweets_meta.last_updated)).toLocaleString()}`)
      } else{
        message = message.concat(` \nHolding ${0} tweets.`)
      }
      this.db_sync.msg = message;
      for (let s of si){  
        s.setAttribute("class", classes);
        s.firstChild.innerText = this.db_sync.msg
      }
    }); 
  }

  // Parses json and stores in temp to be processed by BG
  importArchive(){
    let result = this.result.replace(/^[a-z0-9A-Z\.]* = /, "");

    var importedTweetArchive = JSON.parse(result);
    //here is your imported data, and from here you should know what to do with it (save it to some storage, etc.)
    console.log(importedTweetArchive)
    //document.getElementById("loadArchive").value = ''; //make sure to clear input value after every import, iideally name wouldn't be  hardcoded

    chrome.storage.local.set({temp_archive: importedTweetArchive}, function() {
      console.log("temp tweet archive stored")
      let message = {type:"tempArchiveStored"}
      chrome.runtime.sendMessage(message);
      // console.log("messaging BG", message)
      (document.getElementById("hidden_load_archive")).value = null;
    })
  }
}








//** Handles messages sent from background or popup */
async function onMessage(m) {
  //console.log("message received:", m);
  switch (m.type) {
    case "saveOptions":
      dutils.loadOptions()
      break;
    case "saveArchive":
      let fileName = "threadhelper_archive.json";
      let data = JSON.stringify([tweets, wiz.tweets_meta], undefined, 4)
      console.log("saving", data)
      var blob = new Blob([data], {type: "text/plain;charset=utf-8", name: fileName});
      saveAs(blob, fileName);
      break;
    case "tweets-loading":
      wiz.mid_request = true
      wiz.setSyncStatus(false, `Loading tweets...`)
      break;
      case "tweets-loaded":
      wiz.mid_request = true
      //console.log("tweets loaded, getting tweets")
      wiz.loadTweets(true)
      wiz.setSyncStatus(null, "Tweets partially loaded...")
      break;
    case "tweets-done":
      console.log("message received:", m);
      wiz.mid_request = false
      wiz.setSyncStatus(true, "Tweets loaded.", m.update_type)
      break;
    case "storage-clear":
      //let sync_message = `Holding ${meta.count} tweets. \n Last updated ${(new Date(meta.since_time)).toLocaleString()}`
      wiz.clearTweets()
      wiz.setSyncStatus(false, `No tweets yet...`, ui.sync_status.EMPTY)
      break;
    case "tab-activate":
      wutils.current_url = m.url
      break;
    case "tab-change-url":
      wutils.current_url = m.url
      wutils.setTheme()  
      if(ui.activeComposer.sugg_box) ui.showSuggBox(ui.activeComposer)
      break;  
  }
  return true
}


function main()
{
  chrome.runtime.onMessage.addListener(onMessage);

  window.addEventListener('resize', wutils.onWinResize)
  window.onload = () => {
    //document.addEventListener(destructionEvent, destructor);
    wutils.setUpListeningComposeClick();
    wutils.setUpTrendsListener();
  }
  $(document).ready(function() {
    dutils.msgBG({type:"cs-created"})
    wutils.setTheme()
    dutils.loadOptions();
  })
  window.onpopstate = ()=>{
    //console.log("url changed")
    wutils.setTheme()
    if(ui.activeComposer.sugg_box) ui.showSuggBox(ui.activeComposer)
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
  document.removeEventListener('focusin',wutils.onFocusIn);
  document.removeEventListener('focusout',wutils.onFocusOut);
  window.removeEventListener('resize', wutils.onWinResize);
  chrome.runtime.onMessage.removeListener(onMessage);
  for (let obs of wutils.observers){
    if (obs != null) obs.disconnect()
  }
  console.log("DESTROYED")
  //chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => chrome.tabs.reload(tabId));
}

function setDestrunction(){
  var destructionEvent = 'destructmyextension_' + chrome.runtime.id;
  // Unload previous content script if needed
  document.dispatchEvent(new CustomEvent(destructionEvent));
  
  document.addEventListener(destructionEvent, destructor);
  
  
  //let port = chrome.runtime.connect()
  //port.onDisconnect.addListener(destructor)

}
setDestrunction();

let dutils = new dUtils();
let wutils = new wUtils();
let ui = new UI();
let ren = new Renderer();
let wiz = new TweetWiz();
main();