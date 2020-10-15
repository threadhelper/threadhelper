import { h, render, Component } from 'preact';
import { useState, useRef, useEffect, useContext, useCallback } from 'preact/hooks';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { initGA, csEvent, csException, PageView, UA_CODE } from '../utils/ga.jsx'
import $ from 'jquery'
import {getActiveComposer} from '../utils/wutils.jsx'
import ReplyIcon from '../../images/reply.svg';
import RetweetIcon from '../../images/retweet.svg';
import LikeIcon from '../../images/like.svg';
import ShareIcon from '../../images/share.svg';

const getTweetUrl = tweet => `https://twitter.com/${tweet.username}/status/${tweet.id}`
export function Tweet(props){
  // placeholder is just text
  // const [tweet, setTweet] = useState(tweet);
  // console.log(props.tweet)
  const tweet = props.tweet
  const id = tweet.id

  const timeDiff = getTimeDiff(tweet.time)
  let reply_text = ""
  try{
    reply_text = getReplyText(tweet.reply_to, tweet.mentions)
  } catch(e){
    console.log('ERROR [getReplyText]',{e, tweet})
  }
  const text = reformatText(tweet.text, tweet.reply_to, tweet.mentions, tweet.urls, tweet.media)
  const maybeMedia = tweet.has_media ? renderMedia(tweet.media, "th-media") : ""
  const maybeQuote = tweet.has_quote ? renderQuote(tweet.quote, tweet.has_media) : ""  
  
  // let tweetLink = `https://twitter.com/${"undefined"}/status/${tweet.id}`
  // try{
  //   tweetLink = `https://twitter.com/${tweet.username}/status/${tweet.id}`
  // } catch(e){
  //   //console.log("ERROR",tweet)
  // }
  
  //TODO REMOVE THESE COMMENTS
  const onClick = (e)=>{
    csEvent('User', 'Clicked tweet');
    return onClickTweet(tweet, getActiveComposer, e)
  }

  
  return (
    <div class="th-tweet-container">
      <div class="th-tweet">
        <div class="th-gutter">
          <img class="th-profile" src={tweet.profile_image} />
        </div>
        <div class="th-body">
          <div class="th-header">
            <div class="th-header-name">{tweet.name}</div>
            <div class="th-header-username">@{tweet.username}</div>
            <div class="th-header-dot">·</div>
            <div class="th-header-time"><a class="th-header-time-link" href={getTweetUrl(tweet)}>{timeDiff}</a></div>
          </div>
          <div class="th-reply">{reply_text}</div>
          <div class="th-text">{text}</div>
          {maybeMedia}
          {maybeQuote}
          <div class="th-icons">
            <div class="th-icon-field">
              <div class="th-reply-container"><ReplyIcon /></div>
            </div>
            <div class="th-icon-field">
              <div class="th-rt-container"><RetweetIcon /></div>
            </div>
            <div class="th-icon-field">
              <div class="th-like-container"><LikeIcon /></div>
            </div>
            <div class="th-icon-field">
              <div class="th-share-container"><ShareIcon /></div>
            </div>
          </div>
        </div>
      </div>
      <div class="th-hover" onClick={onClick}>
        <textarea style="display: none" id={`th-link-${tweet.id}`} class="th-link">{getTweetUrl(tweet)}</textarea>
        <div class="th-hover-copy">copy</div>
      </div>
    </div>
    );
}


let onClickTweet = function(tweet, getActiveComposer, e){
  const input = getActiveComposer()
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
  return 
}



const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// function renderTweetLike(tweet, copyContent, onClick){
//   let timeDiff = getTimeDiff(tweet.time)
//   let reply_text = getReplyText(tweet.reply_to, tweet.mentions)
//   let text = reformatText(tweet.text, tweet.reply_to, tweet.mentions, tweet.urls, tweet.media)
//   let maybeMedia = tweet.has_media ? renderMedia(tweet.media, "th-media") : ""
//   let maybeQuote = tweet.has_quote ? renderQuote(tweet.quote, tweet.has_media) : ""  
  
//   //TODO REMOVE THESE COMMENTS
//   // let hover = $('.th-hover', template)
//   // hover.click(onClick)

//   return (
//     <div class="th-tweet-container">
//       <div class="th-tweet">
//         <div class="th-gutter">
//           <img class="th-profile" src={tweet.profile_image} />
//         </div>
//         <div class="th-body">
//           <div class="th-header">
//             <div class="th-header-name">{tweet.name}</div>
//             <div class="th-header-username">@{tweet.username}</div>
//             <div class="th-header-dot">·</div>
//             <div class="th-header-time">{timeDiff}</div>
//           </div>
//           <div class="th-reply">{reply_text}</div>
//           <div class="th-text">{text}</div>
//           {maybeMedia}
//           {maybeQuote}
//         </div>
//       </div>
//       <div class="th-hover" onClick={onClick}>
//         <textarea style="display: none" id="th-link-{tweet.id}" class="th-link">{copyContent}</textarea>
//         <div class="th-hover-copy">copy</div>
//       </div>
//     </div>
//     );
// }     

// function renderTweet(tweet) {
//   let tweetLink = `https://twitter.com/${"undefined"}/status/${tweet.id}`
//   try{
//     tweetLink = `https://twitter.com/${tweet.username}/status/${tweet.id}`
//   } catch(e){
//     //console.log("ERROR",tweet)
//   }
//   let onClickTweet = function(tweet, getActiveComposer, e){
//     const input = getActiveComposer()
//     var link = $(`#th-link-${tweet.id}`)[0]
//     var copy = $(e.target).find(".th-hover-copy")
//     link.style.display = "flex"
//     link.select()
//     document.execCommand("copy")
//     link.style.display = "none"
//     if(input != null)  {
//       input.focus()
//       // https://stackoverflow.com/questions/24115860/set-caret-position-at-a-specific-position-in-contenteditable-div
//       // There will be multiple spans if multiple lines, so we get the last one to set caret to the end of the last line.
//       let _span = $(input).find('span[data-text=true]').last()[0]
//       // If there's some writing on it, otherwise _span will be undefined
//       if (_span != null){
//       var text = _span.firstChild
//       var range = document.createRange()
//       range.setStart(text, text.length)
//       range.setEnd(text, text.length)
//       var sel = window.getSelection()
//       sel.removeAllRanges()
//       sel.addRange(range)
//       }
//     }
//     copy.text("copied!")
//     setTimeout(function() {
//         copy.text("copy")
//     }, 2000)
//   }

//   //TODO REMOVE THESE COMMENTS
//   let onClick = (e)=>{return onClickTweet(tweet, getActiveComposer, e)}

//   let template = renderTweetLike(tweet, tweetLink, onClick)
//   return template
// }

// renderRoboTweet(tweet) {
//   let onClickTweet = function(tweet, input, e){
//     let robotext = $('.roboTweetDiv').find('.th-text')[0]
//     var link = $(`#th-link-${tweet.id}`)[0]
//     var copy = $(e.target).find(".th-hover-copy")
//     link.style.display = "flex"
//     link.select()
//     document.execCommand("copy")
//     link.style.display = "none"
//     if(input != null)  {
//       input.focus()
//       // https://stackoverflow.com/questions/24115860/set-caret-position-at-a-specific-position-in-contenteditable-div
//       // There will be multiple spans if multiple lines, so we get the last one to set caret to the end of the last line.
//       let _span = $(input).find('span[data-text=true]').last()[0]
//       // If there's some writing on it, otherwise _span will be undefined
//       if (_span != null){
//         var text = _span.firstChild
//         var range = document.createRange()
//         range.setStart(text, text.length)
//         range.setEnd(text, text.length)
//         var sel = window.getSelection()
//         sel.removeAllRanges()
//         sel.addRange(range)
//       }
//     }
//     copy.text("copied text!")
//     setTimeout(function() {
//         copy.text("copy")
//     }, 2000)
//   }
//   let composer = getActiveComposer()
//   let onClick = (e)=>{return onClickTweet(tweet, composer, e)}

//   let template = renderTweetLike(tweet, tweet.text, onClick)
//   return template
// }

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
  let month = shortMonths[timeDate.getMonth()]
  let day = timeDate.getDate()
  let thisYear = new Date(now.getFullYear(), 0)
  return timeDate > thisYear ? `${month} ${day}` : `${month} ${day}, ${timeDate.getFullYear()}`
}

function getReplyText(reply_to, mentions) {
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

function replaceBetween(originalString, start, end, replacement){
    return originalString.substr(0,start)+replacement+originalString.substr(end);
}

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
      ret = replaceBetween(ret, mention.indices[0]-charsRemoved, mention.indices[1]-charsRemoved+1, "")
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
  let topImgs = []
  let botImgs =[]
  if (media.length > 0) {
    topImgs.push(<div class="th-media-image"><img src={media[0].url} /></div>)
  }
  if (media.length > 1) {
    topImgs.push(<div class="th-media-image"><img src={media[1].url} /></div>)
  }
  if (media.length > 2) {
    botImgs.push(<div class="th-media-image"><img src={media[2].url} /></div>)
  }
  if (media.length > 3) {
    botImgs.push(<div class="th-media-image"><img src={media[3].url} /></div>)
  }

  let top = <div class="th-media-top">{topImgs}</div>
  let bottom = botImgs.length <= 0 ? "" : <div class="th-media-bottom">${botImgs}</div>

  return (
  <div class={className}>
    {top}
    {bottom}
  </div>
  )
}

function renderQuote(quote, parent_has_media) {
  if (quote != null){
    let timeDiff = getTimeDiff(quote.time)
    let replyText = getReplyText(quote.reply_to, quote.mentions)
    try{
      replyText = getReplyText(quote.reply_to, quote.mentions)
    } catch(e){
      console.log('ERROR [getReplyText]',{e, quote})
    }
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
    let template = (
    <div class="th-quote">
      <div class="th-quote-header">
        <img class="th-quote-header-profile" src={quote.profile_image} />
        <div class="th-quote-header-name">{quote.name}</div>
        <div class="th-quote-header-username">@{quote.username}</div>
        <div class="th-header-dot">·</div>
        <div class="th-quote-header-time"><a class="th-quote-header-time-link" href={getTweetUrl(quote)}>{timeDiff}</a></div>
      </div>
      <div class="th-quote-reply">{replyText}</div>
      <div class="th-quote-content">
        {minimedia}
        <div class="th-quote-content-main">
          <div class="th-text">{text}</div>
          {mainmedia}
        </div>
      </div>
    </div>
    )
    return template
  }
  else{
    let template = (
    <div class="th-quote th-unavailable">
      <div class="th-quote-content">
        <div class="th-quote-content-main">
          <div class="th-quote-content-main-text">This Tweet is unavailable.</div>
        </div>
      </div>
    </div>
    )
    return template
  }
}