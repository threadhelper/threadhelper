"use strict";

buildBox();
watchForStart();

/** buildBox creates the 'related tweets' html elements */
function buildBox() {
  $("<div>", { id: "suggestionBox" })
    .hide()
    .append("<h3>", { text: "Related Tweets" })
    .appendTo("body");
}

// TODO: Make this based on events, (div creation and deletion, or clicks)
/** waits for the compose button to appear */
function watchForStart() {
  const divs = $('span[data-text="true"]');
  if (divs.length) {
    $("#suggestionBox").show();
    addLogger(divs[0].parentElement.parentElement);
    setTimeout(watchForStop, 250);
  } else {
    setTimeout(watchForStart, 250);
  }
}

/** watchForStop checks if the box has disappeared */
function watchForStop() {
  const divs = $('span[data-text="true"]');
  if (divs.length) {
    setTimeout(watchForStop, 250);
  } else {
    $("#suggestionBox").hide();
    setTimeout(watchForStart, 250);
  }
}

/** Updates the tweetlist when user types */
function onChange(mutationRecords) {
  const text = mutationRecords[0].target.wholeText;
  console.log("text is: ", text);
  const bag = nlp.toBag(text);
  const tweet = { text: text, bag: bag };
  const related = nlp.getRelated(tweet, trumpTweets);
  renderTweets(related);
}

function addLogger(div) {
  var observer = new MutationObserver(onChange);
  observer.observe(div, { characterData: true, subtree: true });
}

function render_tweet(tweet, textTarget) {
  // TODO: print user on retweets
  const rtime = $("<a>", {
    class: "rtime",
    text: tweet.timestamp,
    href: "https://twitter.com" + tweet.url
  });

  const add = $("<span>", {
    class: "rplus",
    text: "+"
  });
  add.click(function() {
    const s = $('span[data-text="true"]').text();
    // TODO: links go away for some reason when you type after they're added
    $('span[data-text="true"]').text(s + " twitter.com" + tweet.url); // TODO: temporary
  });
  const rtext = $("<div>", { class: "rtext", text: tweet.text });
  return $("<div>", { class: "rtweet" }).append([rtime, add, rtext])[0];
}

function renderTweets(tweets) {
  var resultsDiv = document.getElementById("suggestionBox");
  while (resultsDiv.firstChild) {
    resultsDiv.removeChild(resultsDiv.firstChild);
  }
  var h3 = document.createElement("h3");
  h3.innerHTML = "Related Tweets";
  resultsDiv.appendChild(h3);
  const textTarget = $('span[data-text="true"]');
  for (let t of tweets) {
    const tweetDiv = render_tweet(t, textTarget);
    resultsDiv.appendChild(tweetDiv);
  }
}
