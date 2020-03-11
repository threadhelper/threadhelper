buildBox();
waitForRender();

function buildBox() {
	var div = document.createElement("div");
	div.classList.add("suggestionBox");
	div.id = "suggestionBox"
	var h3 = document.createElement("h3");
	h3.innerHTML = "Related Tweets";
	div.appendChild(h3);
	document.body.appendChild(div);
}

function waitForRender() {
	let textDiv = document.querySelector('span[data-text="true"]');
	if (textDiv === null) {
		setTimeout(waitForRender, 250);
	} else {
		addLogger(textDiv);
	}
}

function onChange(mutationRecords) {
	console.log("new text is " + mutationRecords[0].target.wholeText);
	const text = mutationRecords[0].target.wholeText;
	let bag = toBag(text);
	let tweet = { text: text, bag: bag };
	const related = getRelated(tweet, nosilvervTweets);
	console.log("Related tweets:", related);
	render_tweets(related);
}

function addLogger(div) {
	var observer = new MutationObserver(onChange);
	observer.observe(div, { characterData: true, subtree: true });
}


function render_tweet(tweet) {
	let div = document.createElement("div");
	div.classList.add("rtweet");

	let time = document.createElement("div");
	time.classList.add("rtime");
	time.innerHTML = tweet.timestamp;
	div.appendChild(time);

	let text = document.createElement("div");
	text.classList.add("rtext");
	text.innerHTML = tweet.text;
	div.appendChild(text);

	let url = document.createElement("a");
	url.classList.add("rurl");
	url.href = "https://twitter.com" + tweet.url;
	url.innerHTML = tweet.url;
	div.appendChild(url);

	return div;
}

function render_tweets(tweets) {
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
	applyStyle()
}