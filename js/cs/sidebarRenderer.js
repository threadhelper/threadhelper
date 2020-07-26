
class SidebarRenderer {
  // constructor(_onSyncIconClick=null, _onClickLoadArchive=null, _onRoboIconClick=null, _onToggleRTs=null){
  constructor(ui, tweetRen){
    // this.onSyncIconClick = _onSyncIconClick != null ? _onSyncIconClick : onSyncIconClick
    // this.onClickLoadArchive = _onClickLoadArchive != null ? _onClickLoadArchive : onClickLoadArchive
    // this.onRoboIconClick = _onRoboIconClick != null ? _onRoboIconClick : onRoboIconClick
    // this.onToggleRTs = _onToggleRTs != null ? _onToggleRTs : onToggleRTs
    this.ui = ui   
    this.tweetRen = tweetRen 
  }

    
  /** buildBox creates the 'Thread Helper' html elements */
  //isGetRTs = dutils.options.getRetweets
  //wiz.sync
  //wiz.has_archive
  buildBox(user_info, sync= false, has_archive = false, isGetRTs = true) {
    var sidebar = null;
    sidebar = document.createElement('div');   //create a div
    sidebar.setAttribute("aria-label", 'suggestionBox');
    
    sidebar.appendChild(this.setUpLoadArchive(sync, has_archive))
    sidebar.appendChild(this.buildBoxHeader())

    sidebar.appendChild(this.buildThirdDiv(user_info))
    sidebar.appendChild(this.buildSecondDiv(isGetRTs))
    return sidebar
  }

  setUpLoadArchive(){
    var x = document.createElement("input");
    let file = {}
    x.setAttribute("type", "file");
    x.setAttribute("id", "hidden_load_archive");
    x.accept=".json,.js" ;
    x.style.display = "none"
    x.addEventListener("change",(e)=>{this.ui.onClickLoadArchive(file,e)}, false);
    return x
  }



  buildSyncIcon(sync){
    let sync_icon = document.createElement('span')
    //TODO: Update sync icon 
    let sync_class = sync ? 'sync_icon synced' : 'sync_icon unsynced';
    sync_icon.setAttribute("class", sync_class);
    let tooltiptext = document.createElement('span')
    tooltiptext.setAttribute("class", 'tooltiptext');
    sync_icon.appendChild(tooltiptext)
    sync_icon.onclick = this.ui.onSyncIconClick
    return sync_icon
  }


  buildArchIcon(has_archive){
    let msg = '<span>Click here to upload your Twitter Archive here. <a href="https://twitter.com/settings/your_twitter_data">Download an archive of your data</a>, extract it and select data/tweet.js.</span>';
    let arch_icon = document.createElement('span')
    arch_icon.setAttribute("class", "arch_icon");
    let span = document.createElement('button')
    span.textContent = " (load archive)"
    arch_icon.appendChild(span)
    if(has_archive) this.ui.toggleArchIcon("none");

    let tooltiptext = document.createElement('span')
    tooltiptext.innerHTML = msg
    tooltiptext.setAttribute("class", 'tooltiptext');
    arch_icon.appendChild(tooltiptext)
    arch_icon.onclick = ()=>{(document.getElementById("hidden_load_archive")).click()}
    return arch_icon
  }

  // Builds the header: Currently title and sync light
  buildBoxHeader(sync, has_archive){
    let headerDiv = document.createElement('div')
    headerDiv.setAttribute("class", "suggHeader")
    var h2 = document.createElement('h2')
    let span = document.createElement('span')
    span.textContent = "Thread Helper"
    h2.appendChild(span)
    h2.setAttribute("class","suggTitle");
    headerDiv.appendChild(this.buildSyncIcon(sync))
    headerDiv.appendChild(h2)
    headerDiv.appendChild(this.buildArchIcon(has_archive))
    return headerDiv
  }

  buildSecondDiv(isGetRTs){
    let div = document.createElement('div')
    div.setAttribute("class", "suggSecondDiv")
    div.setAttribute("id", "suggSecondDiv")
    div.appendChild(this.buildBoxConsole())
    div.appendChild(this.buildBoxOptions(isGetRTs))
    //console.log("building second div", div)
    return div
  }
  buildThirdDiv(user_info){
    let div = document.createElement('div')
    div.setAttribute("class", "suggThirdDiv")
    div.setAttribute("id", "suggThirdDiv")
    div.appendChild(this.buildRoboIcon())
    div.appendChild(this.buildRoboTweet(user_info))
    //console.log("building third div", div)
    return div
  }

  buildRoboTweet(user_info, tweet = null){
    let placeholder_tweet = {
      username: user_info.screen_name,
      name: user_info.name + " bot",
      text: '[ your next tweet ]',
      id: 'roboTweet',
      profile_image: user_info.profile_image_url_https,
      retweeted: false,
      time: (new Date()).getTime(),
      reply_to: null,
      mentions: null,
      urls: null,
      has_media: false,
      media: null,
      has_quote: false,
      quote: null,
      is_quote_up: null
    }

    let div = document.createElement('div')
    div.setAttribute("class", "roboTweetDiv")
    div.setAttribute("id", "roboTweetDiv")
    // let tweet = document.createElement('div')
    // tweet.setAttribute("class", "roboTweet")
    // tweet.setAttribute("id", "roboTweet")
    // tweet.innerHTML = "roboTweet placeholder"
    div.appendChild(this.tweetRen.renderRoboTweet(placeholder_tweet))
    // div.appendChild(tweet)
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
    let textarea = document.createRange().createContextualFragment('<textarea class="roboConfig" cols="20" rows="5"></textarea>')
    tooltiptext.appendChild(textarea)
    robo_icon.onclick = this.ui.onRoboIconClick
    robo_icon.appendChild(tooltiptext)
    //console.log('built robo icon')
    return robo_icon
  }

//
  //all checkboxes for now
  buildBoxOptions(isGetRTs){
    let div = document.createElement('div')
    div.class = "suggOptions"
    
    let options = {
      toggleRTs: {
        description: "RT",
        onclick: this.ui.onToggleRTs,
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
      checkbox.checked = isGetRTs
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
}