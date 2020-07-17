class TweetRenderer {
    constructor(ui) {
      this.shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      this.ui = ui
    }
    
    renderTweetLike(tweet, copyContent, onClick){
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
          <textarea style="display: none" id="th-link-${tweet.id}" class="th-link">${copyContent}</textarea>
          <div class="th-hover-copy">copy</div>
        </div>
      </div>`)
      

      let hover = $('.th-hover', template)
      hover.click(onClick)
  
      return template[0]
    }     

    renderTweet(tweet) {
      let tweetLink = `https://twitter.com/${"undefined"}/status/${tweet.id}`
      try{
        tweetLink = `https://twitter.com/${tweet.username}/status/${tweet.id}`
      } catch(e){
        //console.log("ERROR",tweet)
      }
      let onClickTweet = function(tweet, input, e){
        var link = $(`#th-link-${tweet.id}`)[0]
        var copy = $(e.target).find(".th-hover-copy")
        link.style.display = "flex"
        link.select()
        document.execCommand("copy")
        link.style.display = "none"
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
        }, 2000)
      }
      let composer = this.ui.activeComposer
      let onClick = (e)=>{return onClickTweet(tweet, composer, e)}

      let template = this.renderTweetLike(tweet, tweetLink, onClick)
      return template
    }

    renderRoboTweet(tweet) {
      let onClickTweet = function(tweet, input, e){
        let robotext = $('.roboTweetDiv').find('.th-text')[0]
        var link = $(`#th-link-${tweet.id}`)[0]
        var copy = $(e.target).find(".th-hover-copy")
        link.style.display = "flex"
        link.select()
        document.execCommand("copy")
        link.style.display = "none"
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
        copy.text("copied text!")
        setTimeout(function() {
            copy.text("copy")
        }, 2000)
      }
      let composer = this.ui.activeComposer
      let onClick = (e)=>{return onClickTweet(tweet, composer, e)}

      let template = this.renderTweetLike(tweet, tweet.text, onClick)
      return template
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
    renderTweets(tweets, activeSidebar, text = '') {
      var resultsDiv = activeSidebar
      for (let child of resultsDiv.children){
        if (child.className == "th-tweet-container") {resultsDiv.removeChild(child);}
        else{
        }
      }
      let children = resultsDiv.children
      while (children.length > 4) {
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
        message = "Found these related tweets:"
      }
      this.ui.showConsoleMessage(message)
      const textTarget = $('span[data-text="true"]');
      for (let t of tweets) {
  
        let tweetDiv = document.createElement('div')
        try{
          tweetDiv = this.renderTweet(t);
        } catch(e){
          console.log(t)
          console.log(textTarget)
          throw("RENDER TWEET ERROR",e)
        }
        resultsDiv.appendChild(tweetDiv);
      }
    }
  
  }