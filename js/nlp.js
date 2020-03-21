"use strict";

const nlp = (function() {
  // precompute bags for all tweets:
  console.log("starting bagging");
  for (let i = 0; i < trumpTweets.length; i++) {
    const t = trumpTweets[i];
    t.index = i;
    t.bag = toBag(t.text);
  }
  console.log("done bagging");

  return { getRelated: getRelated, toBag: toBag };

  //** Find related tweets */
  function getRelated(tweet, tweets) {
    return topKBy(tweets, t => similarity(t.bag, tweet.bag), 20);
  }

  //** Turn a string into a bag of keywords */
  function toBag(string) {
    const lstring = string.toLowerCase();
    const words = lstring.match(/\b(\w+)\b/g);
    const actualWords = words ? words.filter(x => !stopwords.has(x)) : [];
    const shortWords = actualWords.map(stemmer);
    return new Set(shortWords);
  }

  // more efficient algorithms and data structures exist. Could flip the database (word -> tweet) or use a proper search engine (e.g. elasticlunr), etc

  //** Similarity metric for bags of words */
  function similarity(bag1, bag2) {
    // similarity metric
    return intersect(bag1, bag2).size;
  }

  //** Get top k elements of array by key */
  function topKBy(arr, f, k = 5) {
    let items = arr.slice(0, k).map(x => [x, f(x)]);
    for (const x of arr) {
      const y = f(x);
      if (y > items[0][1]) {
        items[0] = [x, y];
        items.sort(([_, y1], [__, y2]) => y1 - y2);
      }
    }
    return items.map(([x, _]) => x);
  }

  //** Intersection of sets */
  function intersect(set1, set2) {
    return new Set([...set1].filter(x => set2.has(x)));
  }
})();
