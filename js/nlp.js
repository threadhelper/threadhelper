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
  var index = null;
  let tweets = []
  return { getRelated: getRelated, makeIndex: makeIndex, addToIndex:addToIndex };

  async function makeIndex(_tweets){
    console.log("making index", _tweets)
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
    return _index
  }

  async function addToIndex(_tweets){
    if (index == null){
      makeIndex(_tweets)
    }
    else{
      for (const [id, tweet] of Object.entries(tweets)){
        var doc = {}
        for (var f of tweet_fields){
          doc[f] = tweet[f]
        }
        doc["id"] = id
        index.addDoc(doc)
      }
    console.log("added to index", _tweets)
    }
    return index
  }

  //** Find related tweets */
  async function getRelated(tweet_text, tweets, n_tweets = 20) {
    if (index == null){
      index = await makeIndex(tweets)
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
    // console.log(index)
    // console.log(results)
    return results.slice(0,n_tweets).map((x)=>{return tweets[x.ref]})
  }

})();




