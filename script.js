'use strict'

function to_bag(string) {
    if (string === '') {
        return new Set(['<empty>']);
    }
    return new Set(
        string
            .toLowerCase()
            .match(/\b(\w+)\b/g)
            .filter(x => !stopwords.has(x))
            .map(stemmer));
}

// precompute bags for all tweets:
for (let i = 0; i < tweets.length; i++) {
    const t = tweets[i];
    t.index = i;
    t.bag = to_bag(t.text);
}


// more efficient algorithms and data structures exist. Could flip the database (word -> tweet) or use a proper search engine (e.g. elasticlunr), etc

function get_related(tweet, tweets) {
    return tweets.topKBy(t => similarity(t.bag, tweet.bag), 5);
}

function similarity(bag1, bag2) { // similarity metric
    return bag1.intersect(bag2).size;
}

Array.prototype.topKBy = function topKBy(f, k = 5) {
    return this.sortBy(f).slice(this.length - k, this.length).reverse();
}

Array.prototype.sortBy = function sortBy(f) {
    return this.slice().sort((x, y) => f(x) - f(y));
}

Set.prototype.intersect = function intersect(s) {
    return new Set([...this].filter(x => s.has(x)));
}

// --- main code ---

function render_tweet(tweet) {
    let div = document.createElement("div");
    div.classList.add("tweet");

    let time = document.createElement("div");
    time.classList.add("time");
    time.innerHTML = tweet.timestamp;
    div.appendChild(time);

    let text = document.createElement("div");
    text.classList.add("text");
    text.innerHTML = tweet.text;
    div.appendChild(text);

    let url = document.createElement("a");
    url.classList.add("url");
    url.href = "https://twitter.com" + tweet.url;
    url.innerHTML = tweet.url;
    div.appendChild(url);

    return div;
}

function render_tweets(tweets) {
    var resultsDiv = document.getElementById("results");
    while (resultsDiv.firstChild) {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }
    for (let t of tweets) {
        const tweetDiv = render_tweet(t);
        resultsDiv.appendChild(tweetDiv);
    }
}


function on_change() {
    const input = document.getElementById('input');
    const text = input.value;
    console.log("text:", text);
    const bag = to_bag(text);
    console.log("Bag:", bag);
    const related = get_related({ "bag": bag }, tweets);
    render_tweets(related);
}


const input = document.getElementById('input');
input.addEventListener('input', on_change);
