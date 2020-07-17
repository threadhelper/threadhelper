//helper functions

class UI {
  constructor() {
    // We use this to find the tweet editor
    this.editorClass = "DraftEditor-editorContainer";
    // We use this to detect changes in the text of a tweet being composed
    this.textFieldClass = 'span[data-text="true"]';
    // We use this to find the spot to place the sugg box in the home screen
    this.trendText = '[aria-label="Timeline: Trending now"]';
    //
    this.tweetButtonSelectors = '[data-testid="tweetButtonInline"], [data-testid="tweetButton"]'
    this.sideBarSelector = '[data-testid="sidebarColumn"]'
    this.retweetConfirmSelector = '[data-testid="retweetConfirm"]'
    this.deleteConfirmSelector = '[data-testid="confirmationSheetConfirm"]'
    
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
		this.initSyncMsg = "Welcome to Thread Helper, scroll around for a bit."
    
		// Hold the active context of tweeting/sidebar
		
    this._activeComposer = null
    this.activeLogger = null
    this.activeSidebar = null
    // Hold the underlying home sidebar
    this.home_observer = null
    this.current_query = '' //last edited test in any compose box
    this.console_msg = ''

    //this.last_mode = wutils.getMode()
  }

  get activeComposer(){
    if (!(this._activeComposer != null)){
      let first = wutils.getFirstComposeBox()
      if(first){
        this.activeComposer = first.parentNode
      }
    }
    return this._activeComposer
  }

  set activeComposer(_activeComposer){
    
    this._activeComposer = _activeComposer
  }

  // Whether UI is ready to be interacted with
  ready(){
    return this.activeSidebar != null
	}

	onTabActivate(url){
    // console.log("tab activate", url)
		wutils.current_url = window.location.href
		// ui.updateSidebar()
	}

  //handle compose box on tab change
	onTabChangeUrl(url){
    this.activeComposer = null

    let prev_url = wutils.current_url
    let old_mode = wutils.getMode(prev_url)
		wutils.current_url = url
    let new_mode = wutils.getMode(wutils.current_url)
    this.manageSidebarPresence(old_mode,new_mode)
    this.refreshSidebars()
		wutils.setTheme()  
		// if(ui.ready()) ui.updateSidebar()
	}

  
	putSidebar(mode, compose_box = null){
    //to set active Composer
		let sidebar = sideRen.buildBox()
    sidebar = this.placeBox(sidebar,mode)
    return sidebar
	}
	

  
  // for refreshing properties withing sidebar: sync, archive, metadata
	refreshSidebars(){
    let sidebars = document.getElementsByClassName('sugg_box')
    this.updateSyncIcon(wiz.sync)
    let isArch = wiz.has_archive ? 'none' : 'flex'
    this.toggleArchIcon(isArch)
    //search results
    let searchText = ''
    // If we have an active composer, make a search (i.e. if we're writing)
    if (this.activeComposer){
      // searchText = wutils.getTextField(this.activeComposer).textContent
      searchText = ui.current_query
      requestSearch(searchText)
      console.log("searching for", searchText)
    } else{ //just update with latest tweets
      console.log("showing latest tweets", searchText)
      let related = wiz.latest_tweets
      updateWithSearch(related)
      this.showConsoleMessage("Latest tweets:")
    }
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

  toggleArchIcon(state="flex"){
    let icons = document.getElementsByClassName('arch_icon')
    for(let arch_icon of icons) {
      arch_icon.style.display = state;
    }
  }

  handleOldSidebar(old_mode){
		switch(old_mode){
			case 'compose':
				let composeSidebars = document.getElementsByClassName('sug_compose')
				for (let c of composeSidebars){
					c.remove()
        }
				break;
      default:
    }
  }

  activateComposeSidebar(){
    this.activeSidebar = this.putSidebar('compose')
  }

  activateHomeSidebar(){
    if (wutils.isSidebar('home')){
      this.activeSidebar = document.getElementsByClassName('sug_home')[0]
    } else{
      this.activeSidebar = this.putSidebar('home')
    } 
  }

  handleNewSidebar(new_mode){
    switch(new_mode){
      case 'other':
        break;
      case 'compose':
        if (!wutils.isSidebar('compose')){
          this.activateComposeSidebar()
        }
        break;
      default:
        if(!wutils.isSidebar('home')){
          wutils.setUpTrendsListener()
        }else{
          this.activateHomeSidebar()
          this.refreshSidebars()
        }
        break;
    }
  }

  manageSidebarPresence(old_mode,new_mode){
    // console.log("managing sidebar presence", [old_mode, new_mode])
    this.handleOldSidebar(old_mode)
    this.handleNewSidebar(new_mode)
    console.log("sidebar managed", this.activeSidebar)
    return this.activeSidebar
  }
    
	onTrendsReady(mutationRecords, me){
    var trending_block = document.querySelector(ui.trendText)
    if (trending_block){
      // var compose_box = wutils.getFirstComposeBox()
      this.activateHomeSidebar()
      this.refreshSidebars()
      wutils.setUpSidebarRemovedListener()
      me.disconnect()
    }
	}


  // What to do when compose box becomes unfocused
  composeBoxUnfocused(compose_box){
    this.activeLogger.disconnect()
  }
  
  // When a text box is focused, needed for thread-screen scenario 
  composeBoxFocused(compose_box){
    let text_field = wutils.getTextField(compose_box)
    this.activeComposer = compose_box
    this.activeLogger = this.addLogger(text_field)
    this.refreshSidebars()
	}
  
  onSidebarRemoved(mutationRecords, me){
    for(let mutation of mutationRecords){
      for (let removed of mutation.removedNodes){
        if(removed.getAttribute('data-testid') == "sidebarColumn"){
          wutils.setUpTrendsListener()
        }
      }
    }
  }



  // Place box differently if in home or in compose. This determines the suggestion box's class, which is independent of mode until now.
  // Sets home_sugg on placing.
  placeBox(sidebar, mode = null){
    wutils.setTheme();
    mode = mode == null ? wutils.getMode() : mode
    switch(mode){
      // Place sidebar on the sidebar before the Trending blcok
      case "home":
        //insert a little space bc of the title
        sidebar.setAttribute("class", 'suggestionBox sug_home');
        var trending_block = document.querySelector(ui.trendText)
        if(typeof trending_block !== 'undefined' && trending_block != null)
        {
          var sideBar = trending_block.parentNode.parentNode.parentNode.parentNode.parentNode
          sideBar.insertBefore(sidebar,sideBar.children[2])
        }
        else{
          console.log("didn't place box, couldn't find trends block")
        }
        break;
      // Place sidebar to the side of the floating composer
      case "compose":
        if (!$(".dummyContainer").length) {
          let dummyUI = $(`
            <div class="dummyContainer">
              <div class="dummyLeft"></div>
              <div id="suggestionContainer" class="dummyRight"></div>
            </div>
          `)
          //console.log("trying to append dummy")
          document.body.append(dummyUI[0])
        }
        sidebar.setAttribute("class", 'suggestionBox sug_compose');
        var sideBar = $("#suggestionContainer")
        sideBar.append(sidebar,sideBar)
        break;
      default:
        // console.log("didn't place box, not in right mode")
        // console.log(mode)
        break;
    }
		return sidebar
  }
  
  updateSyncIcon(synced, msg = null){
    //message
    let message = msg != null ? msg : ''
    if (wiz.has_archive) message = message.concat("Archive loaded. ")
    if (wiz.tweets_meta != null){
      message = message.concat(`Holding ${wiz.tweets_meta.count} tweets. \nLast updated ${(new Date(wiz.tweets_meta.last_updated)).toLocaleString()} `)
    } else{
      message = message.concat(`Holding ${0} tweets. `)
    }
    //icon
    let si = document.getElementsByClassName("sync_icon")
    let classes = synced ? 'sync_icon synced' : 'sync_icon unsynced'
    for (let s of si){  
      s.setAttribute("class", classes);
      s.firstChild.innerText = message
    }
    return message
  }
	
  onSyncIconClick(){
    console.log("Metadata:",wiz.tweets_meta); 
    console.log("User info:", wiz.user_info); 
    console.log("Results:", wiz.search_results); 
    dutils.msgBG({type:"query", query_type: "update"})
    
  }
  
  onClickLoadArchive(file, e){
      let idx = 0
      wiz.mid_request = true
      wiz.sync = false
      var files = e.target.files, reader = new FileReader();
      reader.onload = wiz.importArchive;
      for (let i = 0; i < files.length; i++){
        if(files[i].name == "tweet.js"){ file = files[i]; idx = i; break;}
      }
      //console.log("files length", files.length)
  
      //if(idx <= files.length) 
      reader.readAsText(files[idx]);  
  }
  
  onToggleRTs(cb){
    let checked = cb.checked
    console.log("toggled get retweets", cb)
    dutils.getData("options").then((options)=>{
      options = options != null ? options : {}
      options.getRetweets = checked; 
      dutils.setData({options:options}).then(()=>{
        console.log("updated get retweets to",checked)
      })
    })
  }
  
  onRoboIconClick(activeComposer){
    console.log('icon clicked!')
    if (activeComposer){
      let query = ui.getRoboQuery()
      console.log('robo query: ', query)
      dutils.msgBG({type:"robo-tweet", query: query})
    } else{
      console.log("can't robo tweet, no active composer")
    }
  }
  
  //supposed to get tweets in thread we're responding to / drafting
  // mode = wutils.getMode()
  getRoboQuery(mode){
    let make_query=(thread_text)=>{
      let query = 'My new twitter thread: \n'
      for(let [i,t] of thread_text.entries()){
          query = query.concat(`${i}/N: ${t}\n`)
      }
      return query
    }
    let getThreadExisting = ()=>{return ''}
    let getThreadDraft = ()=>{
      let editors = [...document.getElementsByClassName(ui.editorClass)]
      let thread_parent = ui.activeComposer.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      editors = editors.filter(e=>{return thread_parent.contains(e)})
      let thread_text = editors.map(x=>x.textContent)
      return make_query(thread_text)
    }
    let getCurrentText = ()=>{
      return make_query([ui.activeComposer.textContent])
    }
    let query = ''
    switch(mode){
      case 'compose':
        query = getThreadDraft()
        break;
      default:
        query = getCurrentText()
        break
    }
    return query
  }
  
  showRoboTweet(tweet){
    // shouldn't be all of them, just current sidebar's
    let roboDivs = document.getElementsByClassName('roboTweet')
    for (let div of roboDivs){
      if(ui.activeSidebar.contains(div)){
        console.log('showing robotweet')
        div.innerHTML = tweet
      }
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
    // console.log("adding logger")
    var observer = new MutationObserver(onChange);
    wutils.observers.push(observer)
    observer.observe(div, { characterData: true, subtree: true, childList: true }); //attribute: true
    return observer
  }

  
}


/** Updates the tweetlist when user types */
// put semaphore here?
async function onChange(mutationRecords) {
  const text = ui.getTextFromMutation(mutationRecords)
  console.log("CHANGE! text is:", text, "; in element: ", mutationRecords[0].target);
  ui.current_query = text
  requestSearch(text)
  
}

async function requestSearch(text){
  let current_query = text != null ? text : '' 
  ui.current_query = current_query
  if(wutils.isSidebar('home') || wutils.isSidebar('compose')){
    let next_tweet = current_query.replace(wutils.url_regex, "")
    next_tweet = next_tweet.trim()
    if(next_tweet.length <= 0){
      updateWithSearch(wiz.latest_tweets)
      return
    } else{
      dutils.msgBG({type:"search", query: next_tweet})
      return
    }
  }
}


async function updateWithSearch(related){
  if(wutils.isSidebar('home') || wutils.isSidebar('compose')){
    // const next_tweet = text.replace(wutils.url_regex, "")
    // dutils.msgBG({type:"search", query: next_tweet})
    // let related = wiz.search_results
    if (!(related != null)){
      related = []
    }
    if(related.length <= 0) {
      related = wiz.latest_tweets
      ui.showConsoleMessage("None related. Latest tweets:")
    }
    if (related.length > 0){
      // maybe we should throw error instead of just filtering
      related = related.filter(x=>{return x != null})
      try{ren.renderTweets([...new Set(related)], ui.activeSidebar)} catch(e){
        console.log("updating with search ",related)
        throw(e)
      }
    }
  }
}



class TweetWiz{
  constructor(){
    // holds sync state between CS and BG
    this.mid_request = false
    this.user_info = {}
    this.has_archive = false
    this.has_timeline = false
    this.sync = false
    this.tweets_meta = {}
    this.search_results = []

    this.tweets_dict = {};
    
    this.latest_tweets = []
    this.init()
  }

  init(){
    dutils.getData("user_info").then((info)=>{this.user_info = info != null ? info : {}})
    dutils.getData("has_archive").then((info)=>{this.has_archive = info != null ? info : false})
    dutils.getData("has_timeline").then((info)=>{this.has_timeline = info != null ? info : false})
    dutils.getData("sync").then((info)=>{this.sync = info != null ? info : false})
    dutils.getData("tweets_meta").then((meta)=>{this.tweets_meta = meta != null ? meta : this.tweets_meta})
    dutils.getData("tweets").then((tweets)=>{this.tweets_dict = tweets != null ? tweets : {}})
    dutils.getData("latest_tweets").then((latest_tweets)=>{this.latest_tweets = latest_tweets != null ? latest_tweets : []})
  }

  //called when a new tweet is posted. 
  handlePost(){
    dutils.msgBG({type:"new-tweet"})
    ui.current_query = ''
    // ui.refreshSidebars()
  }

  askUpdate(){
    let message = {type:"query", query_type: "update"}
    dutils.msgBG(message)
  }

  // Parses json and stores in temp to be processed by BG
  importArchive(){
    let start = (new Date()).getTime()
    let result = this.result.replace(/^[a-z0-9A-Z\.]* = /, "");

    var importedTweetArchive = JSON.parse(result);
    //here is your imported data, and from here you should know what to do with it (save it to some storage, etc.)
    console.log(importedTweetArchive)
    //document.getElementById("loadArchive").value = ''; //make sure to clear input value after every import, iideally name wouldn't be  hardcoded

    chrome.storage.local.set({temp_archive: importedTweetArchive}, function() {
      console.log("temp tweet archive stored")
      let message = {type:"query", query_type: "archive"}
      chrome.runtime.sendMessage(message);
      // console.log("messaging BG", message)
      (document.getElementById("hidden_load_archive")).value = null;
    })
    let end = (new Date()).getTime()
    console.log(`Importing archive took ${(end-start)/1000}s`)
  }
}


function onClickTweet(e){
  var link = $(`#th-link-${tweet.id}`)[0]
  var copy = $(e.target).find(".th-hover-copy")
  link.style.display = "flex"
  link.select()
  document.execCommand("copy")
  link.style.display = "none"
  var input = ui.activeComposer != null ? ui.activeComposer.firstElementChild : wutils.getFirstComposeBox()
  if(input != null)  {
      input.focus()
      // https://stackoverflow.com/questions/24115860/set-caret-position-at-a-specific-position-in-contenteditable-div
      // There will be multiple spans if multiple lines, so we get the last one to set caret to the end of the last line.
      let _span = $(input).find('span[data-text=true]').last()[0]
      // If there's some writing on it, otherwise _span will be undefined
      if (_span != null){
      var text = _span.firstChild
      var range = document.createRange()
      range.setStart(text, text.length)
      range.setEnd(text, text.length)
      var sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      }
  }
  copy.text("copied!")
  setTimeout(function() {
      copy.text("copy")
  }, 20000)
}


// changes: each has oldValue and newValue
// area: could be sync local or managed
async function onStorageChanged(changes, area){
    if (area != 'local') return null 
    let oldVal = {}
    let newVal = {}
    let changedItems = Object.keys(changes)
    for(let item of changedItems){
      oldVal = changes[item].oldValue
      newVal = changes[item].newValue
      if (oldVal == newVal) break;
      switch(item){
        case "options": 
          dutils.options = newVal != null ? newVal : dutils.options;
        case "user_info":
          wiz.user_info = newVal;
          break;
        case "has_archive":
          wiz.has_archive = newVal;
          ui.refreshSidebars()
					break;
				case "has_timeline":
          wiz.has_timeline = newVal;
          ui.refreshSidebars()
					break;
				case "sync":
          console.log("sync changed!")
          wiz.sync = newVal;
          ui.refreshSidebars()
					break;
				case "search_results":
          wiz.search_results = newVal;
          console.log("search results: ",newVal)
          ui.showConsoleMessage("Found these tweets")
          updateWithSearch(newVal)
          break;
        case "latest_tweets":
          console.log("new latest tweets", newVal)
          wiz.latest_tweets = newVal != null ? newVal : []
          ui.refreshSidebars()
          break;
        case "roboTweet":
          console.log("roboTweet changed in storage, newVal")
          ui.showRoboTweet(newVal)  
          break;
        case "tweets_meta":
          // wiz.tweets_meta = newVal != null ? newVal : wiz.makeTweetsMeta(null)
          wiz.tweets_meta = newVal
          ui.refreshSidebars()
          break;
        default:
          break;
      }
    }
  }
  
  //** Handles messages sent from background or popup */
  async function onMessage(m) {
    //console.log("message received:", m);
    switch (m.type) {
      case "tweets-done":
        wiz.mid_request = false
        break;
      case "storage-clear":
				dutils.msgBG({type:"query", query_type: "timeline"})
        break;
      case "tab-activate":
        ui.onTabActivate()
        break;
      case "tab-change-url":
				ui.onTabChangeUrl(m.url)
        break;  
      case "toggled-retweets":
        ui.refreshSidebars()
        break;
    }
    return true
  }
  
  
  let dutils = {}
  let wutils = {}
  let ui = {}
  let ren = {}
  let wiz = {}
  // let myWorker = {}
  
  function main()
  {
    dutils = new dUtils();
    ui = new UI();
    sideRen = new SidebarRenderer(ui)
    ren = new Renderer(ui);
    wiz = new TweetWiz(); //loads tweets
    wutils = new wUtils(ui, wiz);
    // myWorker = new Worker('worker.js');
  
    chrome.runtime.onMessage.addListener(onMessage);
    chrome.storage.onChanged.addListener(onStorageChanged);
  
    window.addEventListener('resize', wutils.onWinResize)
    window.onload = () => {
      if(!wiz.sync){
        dutils.msgBG({type:"query", query_type: "update"})
      }
      wutils.setUpListeningComposeClick();
      wutils.setUpTrendsListener();
      wutils.setTheme()
    }
    $(document).ready(function() {
      dutils.msgBG({type:"cs-created"})
      // wutils.setTheme()
    })
    // window.onpopstate = ()=>{
    //   wutils.setTheme()
    // }
  
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
    //console.log("DESTROYED")
    //chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => chrome.tabs.reload(tabId));
  }
  
  function setDestruction(){
    var destructionEvent = 'destructmyextension_' + chrome.runtime.id;
    // Unload previous content script if needed
    document.dispatchEvent(new CustomEvent(destructionEvent));
    
    document.addEventListener(destructionEvent, destructor);
    
    
    //let port = chrome.runtime.connect()
    //port.onDisconnect.addListener(destructor)
  
  }
  setDestruction();
  
  
  main();