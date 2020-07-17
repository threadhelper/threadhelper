
// webpage / style utils
class wUtils {
    constructor(ui, wiz){
      this.ui = ui
      this.wiz = wiz
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