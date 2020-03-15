"use strict";
// console.log("script opened");
// $(document).ready(function() {
//   console.log("document ready");
//   const s = 'a[href="/compose/tweet"]';
//   $(s).bind("DOMNodeRemoved", () => console.log("deleted!"));
//   if ($(s).length > 0) {
//     console.log("query succeeded");
//   }
//   $(s).ready(function() {
//     console.log("link is ready");
//     $(s).click(function() {
//       console.log("link clicked");
//     });
//   });
// });

buildBox();
watchForStart();

function buildBox() {
  $("<div>", { id: "suggestionBox" })
    .hide()
    .append("<h3>", { text: "Related Tweets" })
    .appendTo("body");
}

// TODO: Make this based on events, (div creation and deletion, or clicks)
function watchForStart() {
  console.log("checked for start");
  const divs = $('span[data-text="true"]');
  if (divs.length) {
    $("#suggestionBox").show();
    addLogger(divs[0].parentElement.parentElement);
    setTimeout(watchForStop, 250);
  } else {
    setTimeout(watchForStart, 250);
  }
}

function watchForStop() {
  console.log("checked for stop");
  const divs = $('span[data-text="true"]');
  if (divs.length) {
    setTimeout(watchForStop, 250);
  } else {
    $("#suggestionBox").hide();
    setTimeout(watchForStart, 250);
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

function render_tweet(tweet, textTarget) {
  //   return (
  //     <div class="rtweet">
  //       <div class="rtime">{tweet.timestamp}</div>
  //       <div class="rtext">{tweet.text}</div>
  //       <a href={"https://twitter.com" + tweet.url} class="rurl">
  //         tweet.url
  //       </a>
  //     </div>
  //   );

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
    console.log("Plus clicked");
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
  // applyStyle()
}
