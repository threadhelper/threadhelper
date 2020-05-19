"use strict";


chrome.runtime.onMessage.addListener(onMessage);


let tweets = null;
watchForStart();
//getTweets();

/** buildBox creates the 'related tweets' html elements */
function buildBox() {
  var trending_block = document.querySelector('[aria-label="Timeline: Trending now"]')
  if(typeof trending_block !== 'undefined' && trending_block != null)
  {
  var sideBar = trending_block.parentNode.parentNode.parentNode.parentNode.parentNode
  var box = document.createElement('div');   //create a div
  box.setAttribute("aria-label", 'suggestionBox');
  box.setAttribute("class", 'suggestionBox');
  var h3 = document.createElement('h3')
  h3.textContent = "Related Tweets"
  box.appendChild(h3)
  sideBar.insertBefore(box,sideBar.children[2])
  }  
  // $("<div>", { id: "suggestionBox" })
  //   .hide()
  //   .append("<h3>", { text: "Related Tweets" })
  //   .appendTo("body");

    
}

// TODO: Make this based on events, (div creation and deletion, or clicks)
/** waits for the compose button to appear */
function watchForStart() {
  if (tweets == null){
    getTweets()
  }
  const divs = $('span[data-text="true"]');
  if (divs.length) {
    var box = document.querySelector('[aria-label="suggestionBox"]')
    if(typeof box !== 'undefined' && box != null){
      box.style.display = "block";
    }else{
      buildBox();
      box = document.querySelector('[aria-label="suggestionBox"]')
      box.style.display = "block";
    }
    addLogger(divs[0].parentElement.parentElement);
    setTimeout(watchForStop, 250);
  } else {
    setTimeout(watchForStart, 250);
  }
}

/** watchForStop checks if the box has disappeared */
function watchForStop() {
  const divs = $('span[data-text="true"]');
  const box = document.querySelector('[aria-label="suggestionBox"]')

  if (divs.length) {
    setTimeout(watchForStop, 250);
  } else {
    if(typeof box !== 'undefined' && box != null){
      box.style.display = "none";
    }
    setTimeout(watchForStart, 250);
  }
}

function getTweets() {
  console.log("getting tweets from storage")
  chrome.storage.local.get(["tweets"], r =>{
      if (r != null) tweets = r.tweets.map(t => ({...t, bag:nlp.toBag(t.text)}))
      console.log(r.tweets);    
      }
      );
}


/** Updates the tweetlist when user types */
function onChange(mutationRecords) {
  if(tweets != null){
    if(tweets.length>0){
      const box = document.querySelector('[aria-label="suggestionBox"]')
      if(box.style.display != "block"){
        box.style.display = "block"
      }
      const text = mutationRecords[0].target.wholeText;
      console.log("text is: ", text);
      const bag = nlp.toBag(text);
      const tweet = { text: text, bag: bag };
    
      const related = nlp.getRelated(tweet, tweets);
      //const related = [ { id: "123", text: "a tweet here", name: "bob t", username: "bobt", time: "2020", urls: [] } ]; //prettier-ignore
      renderTweets([...new Set(related.reverse())]);
      console.log(related);
    }
  }
  else{
    console.log("no tweets")
  }
}

//** Attach a mutation observer to a div */
function addLogger(div) {
  var observer = new MutationObserver(onChange);
  observer.observe(div, { characterData: true, subtree: true });
}

//** Build the html for one tweet */
function renderTweet(tweet, textTarget) {
  // TODO: print user on retweets
  const url = 'https://twitter.com/' + tweet.username + '/status/' + tweet.id;
  const rtime = $("<a>", {
    class: "rtime",
    text: tweet.time.toString(),
    href: url
  });

  var add = $("<span>", {
    class: "rplus",
    text: "+"
  });
  add.click(function(e) {
    // to copy something to clipboard it need to be on the page
    var textArea = document.createElement("textarea");
    textArea.value = url;
    var plus = e.target;
    plus.parentNode.insertBefore(textArea,plus.parentNode.children[1]);
    textArea.focus();
    textArea.select();
    textArea.style.size = 1
    document.execCommand("copy");
    textArea.style.display = "none";
    plus.style.cssText = "font-size: small";
    plus.textContent = "copied link!"
    setTimeout(function() {
      plus.textContent = "+";
      plus.style.cssText = "font-size: x-large";
    }, 2000);
  });
  const rtext = $("<div>", { class: "rtext", text: tweet.text });
  return $("<div>", { class: "rtweet" }).append([rtime, add, rtext])[0];
}


//** Build the html for a set of tweets */
function renderTweets(tweets) {
  var resultsDiv = document.querySelector('[aria-label="suggestionBox"]')
  ;
  while (resultsDiv.firstChild) {
    resultsDiv.removeChild(resultsDiv.firstChild);
  }
  var h3 = document.createElement("h3");
  h3.innerHTML = "Related Tweets";
  resultsDiv.appendChild(h3);
  const textTarget = $('span[data-text="true"]');
  for (let t of tweets) {
    const tweetDiv = renderTweet(t, textTarget);
    resultsDiv.appendChild(tweetDiv);
  }
}

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
}