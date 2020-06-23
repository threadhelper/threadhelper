"use strict";

const nlp = (function() {

  const tweet_fields = [
    "id",
    "text", 
    "name", 
    "username", 
    //"time", 
    "reply_to",
    "mentions"
  ]
  let index = null; 
  let tweets = {}; // keeping a local copy of tweets for sorting. This can be done in contentscript instead
  return { getRelated: getRelated, makeIndex: makeIndex, addToIndex:addToIndex, getIndex:getIndex, loadIndex:loadIndex};

  function getIndex(){
    return index
  }

  function loadIndex(_index){
    console.log("loaded index from storage", _index)
    index = elasticlunr.Index.load(_index)
  }

  async function makeIndex(_tweets){
    tweets = sortTweets(_tweets)
    let start = (new Date()).getTime()
    console.log("making index...")
    var _index = elasticlunr(function () {
      this.setRef('id');
      for (var field_name of tweet_fields){
        this.addField(field_name);
      }
    });

    for (const [id, tweet] of Object.entries(_tweets)){
      var doc = {}
      for (var f of tweet_fields){
        doc[f] = tweet[f]
      }
      doc["id"] = id
      _index.addDoc(doc)
    }
    index = _index
    let end = (new Date()).getTime()
    console.log(`Making index took ${(end-start)/1000}s`)
    return _index
  }

  async function addToIndex(_tweets){
    if (index == null){
      makeIndex(_tweets)
    }
    else{
      // add new tweets to tweets and sort it
      Object.assign(tweets,_tweets)
      // tweets = tweets = sortTweets(tweets)
      for (const [id, tweet] of Object.entries(_tweets)){
        var doc = {}
        for (var f of tweet_fields){
          doc[f] = tweet[f]
        }
        doc["id"] = id
        index.addDoc(doc)
      }
    console.log("added to index", Object.keys(tweets).length)
    }
    return index
  }

  function sortTweets(tweetDict){
    let keys = Object.keys(tweetDict)
    let comp = (b,a)=>{return a.localeCompare(b,undefined,{numeric: true})}
    let skeys = keys.sort(comp)
    let stobj = Object.fromEntries(skeys.map((k)=>{return[k,tweetDict[k]]}))
    return stobj
  }

  //** Find related tweets */
  async function getRelated(tweet_text, _tweets, n_tweets = 20) {
    let start = (new Date()).getTime()
    if (index == null){
      index = await makeIndex(_tweets)
    }
    //results are of the format {ref, doc}
    var results = index.search(tweet_text, {
      fields: {
          text: {boost: 3},
          name: {boost: 1},
          username: {boost: 1},
          reply_to: {boost: 1},
          mentions: {boost: 1}
        },
      boolean: "OR",
      expand: true
    });

    let resultTweets = res=>{return res.slice(0,n_tweets).map((x)=>{return tweets[x.ref]})} // get tweets from docs
    let end = (new Date()).getTime()
    // console.log(`Searching ${tweet_text} took ${(end-start)/1000}s`)
    
    let keys = Object.keys(tweets)
    let getLatest =  ()=>{return (keys.slice(0, n_tweets).map(k=>{return tweets[k]}))}
    // if no results, get latest tweets
    let related = results.length > 0 ? resultTweets(results) : getLatest()
    return related
  }

})();




