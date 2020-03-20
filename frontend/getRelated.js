"use strict";

// precompute bags for all tweets:
console.log("starting bagging");
for (let i = 0; i < trumpTweets.length; i++) {
  const t = trumpTweets[i];
  t.index = i;
  t.bag = toBag(t.text);
}
console.log("done bagging");

function getRelated(tweet, tweets) {
  return topKBy(tweets, t => similarity(t.bag, tweet.bag), 20);
}

function toBag(string) {
  const lstring = string.toLowerCase();
  const words = lstring.match(/\b(\w+)\b/g);
  const actualWords = words ? words.filter(x => !stopwords.has(x)) : [];
  const shortWords = actualWords.map(stemmer);
  return new Set(shortWords);
}

// more efficient algorithms and data structures exist. Could flip the database (word -> tweet) or use a proper search engine (e.g. elasticlunr), etc

function similarity(bag1, bag2) {
  // similarity metric
  return intersect(bag1, bag2).size;
}

function topKBy(array, f, k = 5) {
  return sortBy(array, f)
    .slice(array.length - k, array.length)
    .reverse();
}

function sortBy(array, f) {
  return array.slice().sort((x, y) => f(x) - f(y));
}

function intersect(set1, set2) {
  return new Set([...set1].filter(x => set2.has(x)));
}
