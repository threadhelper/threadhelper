//helper functions

//General js tools
{
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
      if (this[i] === obj) {
          return true;
      }
  }
  return false;
};

String.prototype.replaceBetween = function(start, end, what) {
  return this.substring(0, start) + what + this.substring(end);
};
}

function msgBG(msg = null){
  let message = msg == null ? {type:"query", query_type: "update"} : msg
  chrome.runtime.sendMessage(message);
  //console.log("messaging BG", message)
}


// Data/Storage/Comms utils
class dUtils {
  constructor() {
    // dutils.options
    this.options = {};
    this.loadOptions();
    // Holds observers for eventual destruction
  }

    
  
  //returns a promise that gets a value from chrome local storage 
  async getData(key) {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get(key, function(items) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          // console.log(items[key])
          resolve(items[key]);
        }
      });
    });
  }

  //returns a promise that sets an object with key value pairs into chrome local storage 
  async setData(key_vals) {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.set(key_vals, function(items) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    });
  }


  async loadOptions(){
    this.getData("options").then((options)=>{this.options = options != null ? options : this.options})
    return this.options
  }
  

  msgBG(msg = null){
    let message = msg == null ? {type:"query", query_type: "update"} : msg
    chrome.runtime.sendMessage(message);
    //console.log("messaging BG", message)
  }
}

// webpage / style utils
class wUtils {
  constructor(){
    this.observers = []
    this.url_regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
    this.current_url = window.location.href
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
  getMode(url = null){
    var pageURL = url == null ? window.location.href : url
    var home = 'https://twitter.com/home'
    var compose = 'https://twitter.com/compose/tweet'
    var notifications = 'https://twitter.com/notifications'
    var explore = 'https://twitter.com/explore'
    var bookmarks = 'https://twitter.com/i/bookmarks'
    
    // console.log("mode is " + pageURL)
    if (pageURL.indexOf(home) > -1){
      return 'home'
    }
    else if (pageURL.indexOf(compose) > -1){
      return "compose"
		}
		else if (pageURL.indexOf(notifications) > -1){
      return "notifications"
		}
		else if (pageURL.indexOf(explore) > -1){
      return "explore"
		}
		else if (pageURL.indexOf(bookmarks) > -1){
      return "bookmarks"
    }
    else{
      return "other"
    }
  }

  getFirstComposeBox(){
    return document.getElementsByClassName(ui.editorClass)[0]
	}
	
	isSidebar(mode){
		switch(mode){
			case 'home':
				return document.getElementsByClassName('sug_home').length > 0 
			case 'compose':
        return document.getElementsByClassName('sug_compose').length > 0
      default:
        return false
		}
	}
  
  // Sets up a listener for the Recent Trends block. Listens to changes in document's children and checks if it's what we want.
  setUpTrendsListener(){
    // console.log("adding trends logger")
    if(wutils.getMode() != "other"){
      var observer = new MutationObserver((mutationRecords, me)=>{ui.onTrendsReady(mutationRecords, me)});
      this.observers.push(observer)
      observer.observe(document, { subtree: true, childList: true});
      return observer
    }
    return
  }

  setUpSidebarRemovedListener(){
    // console.log("setting up sidebar removed listener")
    var observer = new MutationObserver((mutationRecords, me)=>{ui.onSidebarRemoved(mutationRecords, me)});
    this.observers.push(observer)
    let sidebarColumn = document.querySelector(ui.sideBarSelector)
    observer.observe(sidebarColumn.parentNode, {childList: true});
    return observer
  }

  // Detect when the compose box is focused
  onFocusIn(e){
    var divs = document.getElementsByClassName(ui.editorClass)
    for (var div of divs){
      if(e.target && div.contains(e.target)){
        if(wutils.getMode() != "other") ui.composeBoxFocused(div)
      }
    }
  }
  // Detect when the compose box loses focus
  onFocusOut(e){
    var divs = document.getElementsByClassName(ui.editorClass)
    for (var div of divs){
      if(e.target && div.contains(e.target)){
        if(wutils.getMode() != "other") ui.composeBoxUnfocused(div)
      }
    }
  }

  //When tweet buttons are clicked
  tweetButtonClicked(e){
    var divs = document.querySelectorAll(ui.tweetButtonSelectors)
    for (var div of divs){
      if(e.target && div.contains(e.target)){
        console.log("Tweet button pressed")
        wiz.handlePost()
      }
    }
  }

  isComposeFocused(){
    if(ui.activeComposer)
     {return ui.activeComposer.contains(document.activeElement)}
     else{return false}
  }
  isRetweetFocused(){
    var divs = document.querySelectorAll(ui.retweetConfirmSelector)
    for (var div of divs){
      if(div.contains(document.activeElement) || document.activeElement.contains(div)){
        console.log("retweet confirm is focused")
        return true
      }
    }
    return false
  }

  isDeleteFocused(){
    var divs = document.querySelectorAll(ui.deleteConfirmSelector)
    for (var div of divs){
      if(div.contains(document.activeElement) || document.activeElement.contains(div)){
        console.log("delete confirm is focused")
        return true
      }
    }
    return false
  }

  //When tweet buttons are clicked
  tweetButtonClicked(e){
    var divs = document.querySelectorAll(ui.tweetButtonSelectors)
    for (var div of divs){
      if(e.target && div.contains(e.target)){
        console.log("Tweet button pressed")
        wiz.handlePost()
      }
    }
  }  

  tweetShortcut(e){
    if (e.ctrlKey && e.key === 'Enter') {
      if(wutils.isComposeFocused()){
        console.log("Tweet shortcut pressed")
        wiz.handlePost()
      }
    }
  }

  retweetButtonClicked(e){
    var divs = document.querySelectorAll(ui.retweetConfirmSelector)
    for (var div of divs){
      if(e.target && (div.contains(e.target) || e.target.contains(div))){
        console.log("Retweet button pressed")
        wiz.handlePost()
      }
    }
  }
  retweetShortcut(e){
    if (e.key === 'Enter') {
      if(wutils.isRetweetFocused()){
        console.log("Retweet confirm entered")
        wiz.handlePost()
      }
    }
  }
  deleteConfirmSelector
  deleteButtonClicked(e){
    var divs = document.querySelectorAll(ui.deleteConfirmSelector)
    for (var div of divs){
      if(e.target && (div.contains(e.target) || e.target.contains(div))){
        console.log("Delete button pressed")
        wiz.handlePost()
      }
    }
  }
  deleteShortcut(e){
    if (e.key === 'Enter') {
      if(wutils.isDeleteFocused()){
        console.log("Delete confirm entered")
        wiz.handlePost()
      }
    }
  }

  // EVENT DELEGATION CRL, EVENT BUBBLING FTW
  setUpListeningComposeClick(){
    //console.log("event listeners added")
    document.addEventListener('focusin',this.onFocusIn);
    document.addEventListener('focusout',this.onFocusOut);
    document.addEventListener('click',this.tweetButtonClicked);
    document.addEventListener('keydown', this.tweetShortcut);
    document.addEventListener('click',this.retweetButtonClicked);
    document.addEventListener('keydown', this.retweetShortcut);
    document.addEventListener('click',this.deleteButtonClicked);
    document.addEventListener('keydown', this.deleteShortcut);
  }

  // given composer found by ui.editorClass = "DraftEditor-editorContainer",
  // outputs grandparent of const ui.textFieldClass = 'span[data-text="true"]'
  getTextField(compose_box){
    //return compose_box.firstElementChild.firstElementChild.firstElementChild.firstElementChild
    return compose_box.firstElementChild.firstElementChild
  }

  onWinResize(){}
}
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
    if (this._activeComposer){

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
		let sidebar = this.buildBox()
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
	
	
  /** buildBox creates the 'Thread Helper' html elements */
  buildBox() {
    var sidebar = null;
    sidebar = document.createElement('div');   //create a div
    sidebar.setAttribute("aria-label", 'suggestionBox');
    
    sidebar.appendChild(this.setUpLoadArchive())
    sidebar.appendChild(this.buildBoxHeader())

    sidebar.appendChild(this.buildSecondDiv())
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

  buildSyncIcon(){
    let sync_icon = document.createElement('span')
    let sync_class = wiz.sync ? 'sync_icon synced' : 'sync_icon unsynced';
    sync_icon.setAttribute("class", sync_class);
    let tooltiptext = document.createElement('span')
    tooltiptext.setAttribute("class", 'tooltiptext');
    sync_icon.appendChild(tooltiptext)
    sync_icon.onclick = this.onSyncIconClick
    return sync_icon
  }

  toggleArchIcon(state="flex"){
    let icons = document.getElementsByClassName('arch_icon')
    for(let arch_icon of icons) {
      arch_icon.style.display = state;
    }
  }

  buildArchIcon(){
    let msg = '<span>Click here to upload your Twitter Archive here. <a href="https://twitter.com/settings/your_twitter_data">Download an archive of your data</a>, extract it and select data/tweet.js.</span>';
    let arch_icon = document.createElement('span')
    arch_icon.setAttribute("class", "arch_icon");
    let span = document.createElement('button')
    span.textContent = " (load archive)"
    arch_icon.appendChild(span)
    if(wiz.has_archive) this.toggleArchIcon("none");

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

  buildSecondDiv(){
    let div = document.createElement('div')
    div.setAttribute("class", "suggSecondDiv")
    div.setAttribute("id", "suggSecondDiv")
    div.appendChild(this.buildBoxConsole())
    div.appendChild(this.buildBoxOptions())
    return div
  }
//
  //all checkboxes for now
  buildBoxOptions(){
    let div = document.createElement('div')
    div.class = "suggOptions"
    let onToggleRTs = (cb)=>{
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
    let options = {
      toggleRTs: {
        description: "RT",
        onclick: onToggleRTs,
      },
    }
    for(let [key, val] of Object.entries(options)){
      let span = document.createElement('span')
      span.id = key
      span.class = "suggOption"
      span.style = "display:flex; align-items:center"

      let description = document.createElement('span')
      description.innerHTML = val.description

      let checkbox = document.createElement('input')
      checkbox.type = "checkbox"
      checkbox.checked = dutils.options.getRetweets
      checkbox.onclick = ()=>{val.onclick(checkbox)}

      span.appendChild(description)
      span.appendChild(checkbox)
      div.appendChild(span)
    }
    return div
  }
  // Builds a display for notifications
  buildBoxConsole(){
    let consoleDiv = document.createElement('div')
    consoleDiv.setAttribute("class", "suggConsole")
    consoleDiv.setAttribute("id", "suggConsole")
    consoleDiv.innerHTML = "Type something to get related tweets :)"
    return consoleDiv
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

  // Sets up a hidden file load button that is clicked by the button the user clicks.
  // Currently getting from dir but I worry it puts the whole contents into memory while we just want tweet.js and so maybe we should be import it directly (more user clicks)
  setUpLoadArchiveFromDir(){
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
          wiz.sync = false
          var files = e.target.files, reader = new FileReader();
          reader.onload = wiz.importArchive;
          for (let i = 0; i < files.length; i++){
            if(files[i].name == "tweet.js"){ file = files[i]; idx = i; break;}
          }
          //console.log("files length", files.length)

          //if(idx <= files.length) 
          reader.readAsText(files[idx]);  
        }, false);
    return x
  }
  // from file
  setUpLoadArchive(){
    var x = document.createElement("input");
      let file = {}
      let idx = 0
        x.setAttribute("type", "file");
        x.setAttribute("id", "hidden_load_archive");
        x.accept=".json,.js" ;
        x.style.display = "none"
        x.addEventListener("change", (e) => {
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
        }, false);
    return x
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
  // console.log("CHANGE! text is:", text, "; in element: ", mutationRecords[0].target);
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
      try{ren.renderTweets([...new Set(related)])} catch(e){
        console.log("updating with search ",related)
        throw(e)
      }
    }
  }
  // if(!ui.ready()) return
  // let isTextValid = (text) => {return typeof text != "undefined" && text != null /*&& text.trim() != ''*/}
  // if(/*wiz.getTweets() != null &&*/ isTextValid(text)){
  //   if(Object.keys(wiz.getTweets()).length>0){
  //     var box = ui.activeSidebar
  //     //const box = document.`querySelector('[aria-label="suggestionBox"]')
  //     if(typeof ui.activeSidebar !== 'undefined' && ui.activeSidebar != null && ui.activeSidebar.style.display != "flex"){
  //       ui.activeSidebar.style.display = "flex"
  //     }
  //     const tweet = text.replace(wutils.url_regex, "")
  //     nlp.getRelated(tweet, wiz.getTweets()).then((related)=>{
  //       ren.renderTweets([...new Set(related)])
  //     });
      
  //   }
  // }
  // else{
  //   //console.log("no tweets")
  //   if (typeof ui.activeSidebar !== 'undefined'){
  //     ren.renderTweets([], text != null ? text : '');
  //   }
  // }
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

  // get sync(){
  //   return this.tweets_meta.has_timeline
  // }

  // set sync(synced){
  //   this._sync = synced
  // }

  // get tweets_meta(){
  //   return this._tweets_meta
  // }
  // set tweets_meta(meta){
  //   console.log("set metadata ", meta)
  //   this._tweets_meta = meta
  //   //set ui icons
  //   if (meta.has_archive){ui.toggleArchIcon("none")} else{ui.toggleArchIcon("flex")}
  //   if (meta.has_timeline){this.sync = true; this.updateSyncStatus(true)} else{this.sync = false; this.updateSyncStatus(false)}
  // }

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

class Renderer {
  constructor() {
    this.shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
  }

    
  renderTweet(tweet, textTarget) {
    let tweetLink = `https://twitter.com/${"undefined"}/status/${tweet.id}`
    try{
      tweetLink = `https://twitter.com/${tweet.username}/status/${tweet.id}`
    } catch(e){
      //console.log("ERROR",tweet)
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
            <div class="th-text">${text}</div>
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
    var resultsDiv = ui.activeSidebar
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

      let tweetDiv = document.createElement('div')
      try{
        tweetDiv = this.renderTweet(t, textTarget);
      } catch(e){
        console.log(t)
        console.log(textTarget)
        throw("RENDER TWEET ERROR",e)
      }
      resultsDiv.appendChild(tweetDiv);
    }
  }

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
          wiz.latest_tweets = newVal
          ui.refreshSidebars()
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
    wutils = new wUtils();
    ui = new UI();
    ren = new Renderer();
    wiz = new TweetWiz(); //loads tweets
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