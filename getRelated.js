"use strict";

// precompute bags for all tweets:
for (let i = 0; i < nosilvervTweets.length; i++) {
  const t = nosilvervTweets[i];
  t.index = i;
  t.bag = toBag(t.text);
}

function getRelated(tweet, tweets) {
  return topKBy(tweets, t => similarity(t.bag, tweet.bag), 20);
}

function toBag(string) {
  if (string === "") {
    return new Set(["<empty>"]);
  }
  return new Set(
    string
      .toLowerCase()
      .match(/\b(\w+)\b/g)
      .filter(x => !stopwords.has(x))
      .map(stemmer)
  );
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
