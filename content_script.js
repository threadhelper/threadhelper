"use strict";

buildBox();
waitForRender();

function buildBox() {
  $('<div id="suggestionBox"></div>')
    .add("<h3>Related Tweets</h3>")
    .appendTo("body");
}

function waitForRender() {
  const textDivs = $('span[data-text="true"]');
  if (textDivs.length === 0) {
    setTimeout(waitForRender, 250);
  } else {
    addLogger(textDivs[0].parentElement.parentElement);
  }
}

function onChange(mutationRecords) {
  const text = mutationRecords[0].target.wholeText;
  console.log("text is: ", text);
  const bag = toBag(text);
  const tweet = { text: text, bag: bag };
  const related = getRelated(tweet, nosilvervTweets);
  renderTweets(related);
}

function addLogger(div) {
  var observer = new MutationObserver(onChange);
  observer.observe(div, { characterData: true, subtree: true });
}

function render_tweet(tweet) {
  //   return (
  //     <div class="rtweet">
  //       <div class="rtime">{tweet.timestamp}</div>
  //       <div class="rtext">{tweet.text}</div>
  //       <a href={"https://twitter.com" + tweet.url} class="rurl">
  //         tweet.url
  //       </a>
  //     </div>
  //   );
  const rtime = $("<div/>", { class: "rtime", text: tweet.timestamp });
  const rtext = $("<div/>", { class: "rtext", text: tweet.text });
  const rurl = $("<a/>", {
    class: "rurl",
    href: "https://twitter.com" + tweet.url,
    text: tweet.url
  });
  return $("<div/>", { class: "rtweet" }).append([rtime, rtext, rurl])[0];
}

function renderTweets(tweets) {
  var resultsDiv = document.getElementById("suggestionBox");
  while (resultsDiv.firstChild) {
    resultsDiv.removeChild(resultsDiv.firstChild);
  }
  var h3 = document.createElement("h3");
  h3.innerHTML = "Related Tweets";
  resultsDiv.appendChild(h3);
  for (let t of tweets) {
    const tweetDiv = render_tweet(t);
    resultsDiv.appendChild(tweetDiv);
  }
  // applyStyle()
}
