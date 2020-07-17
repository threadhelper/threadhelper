
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
      this.activeComposer = wutils.getFirstComposeBox().parentNode
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
    sidebar.appendChild(this.buildThirdDiv())
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
    console.log("building second div", div)
    return div
  }
  buildThirdDiv(){
    let div = document.createElement('div')
    div.setAttribute("class", "suggThirdDiv")
    div.setAttribute("id", "suggThirdDiv")
    div.appendChild(this.buildRoboTweet())
    console.log("building third div", div)
    return div
  }
  buildRoboTweet(){
    let div = document.createElement('div')
    div.setAttribute("class", "roboTweetDiv")
    div.setAttribute("id", "roboTweetDiv")
    let tweet = document.createElement('div')
    tweet.setAttribute("class", "roboTweet")
    tweet.setAttribute("id", "roboTweet")
    tweet.innerHTML = "roboTweet placeholder"
    div.appendChild(this.buildRoboIcon())
    div.appendChild(tweet)
    return div
  }

  buildRoboIcon(){
    let msg = 'Click to get a next tweet suggestion'
    let robo_icon = document.createElement('span')
    let robo_class = 'robo_icon';
    robo_icon.setAttribute("class", robo_class);
    let tooltiptext = document.createElement('span')
    tooltiptext.setAttribute("class", 'tooltiptext');
    tooltiptext.innerHTML = msg
    robo_icon.onclick = this.onRoboIconClick
    robo_icon.appendChild(tooltiptext)
    return robo_icon
  }

  onRoboIconClick(){
    console.log('icon clicked!')
    if (ui.activeComposer){
      let query = ui.getRoboQuery()
      dutils.msgBG({type:"robo-tweet", query: query})
    } else{
      console.log("can't robo tweet, no active composer")
    }
  }

  //supposed to get tweets in thread we're responding to / drafting
  getRoboQuery(){
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
    switch(wutils.getMode()){
      case 'compose':
        query = getThreadDraft()
        break;
      default:
        query = getCurrentText()
        break
    }
    return query
  }

  // TODO: move to wiz
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
