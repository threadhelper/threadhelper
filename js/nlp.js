"use strict";

const nlp = (function() {
  const stemmer=function(){var e={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},i={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},t="([^aeiou][^aeiouy]*)",l="([aeiouy][aeiou]*)",s=new RegExp("^"+t+"?"+l+t),a=new RegExp("^"+t+"?"+l+t+l+"?$"),n=new RegExp("^"+t+"?("+l+t+"){2,}"),c=new RegExp("^"+t+"?[aeiouy]"),o=new RegExp("^"+t+"[aeiouy][^aeiouwxy]$"),u=/ll$/,g=/^(.+?)e$/,r=/^(.+?)y$/,$=/^(.+?(s|t))(ion)$/,x=/^(.+?)(ed|ing)$/,v=/(at|bl|iz)$/,z=/^(.+?)eed$/,b=/^.+?[^s]s$/,y=/^.+?(ss|i)es$/,f=/([^aeiouylsz])\1$/,h=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,m=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,w=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;return function(t){var l,p;return(t=String(t).toLowerCase()).length<3?t:(121===t.charCodeAt(0)&&(l=!0,t="Y"+t.slice(1)),y.test(t)?t=t.slice(0,t.length-2):b.test(t)&&(t=t.slice(0,t.length-1)),(p=z.exec(t))?s.test(p[1])&&(t=t.slice(0,t.length-1)):(p=x.exec(t))&&c.test(p[1])&&(t=p[1],v.test(t)?t+="e":f.test(t)?t=t.slice(0,t.length-1):o.test(t)&&(t+="e")),(p=r.exec(t))&&c.test(p[1])&&(t=p[1]+"i"),(p=h.exec(t))&&s.test(p[1])&&(t=p[1]+e[p[2]]),(p=m.exec(t))&&s.test(p[1])&&(t=p[1]+i[p[2]]),(p=w.exec(t))?n.test(p[1])&&(t=p[1]):(p=$.exec(t))&&n.test(p[1])&&(t=p[1]),(p=g.exec(t))&&(n.test(p[1])||a.test(p[1])&&!o.test(p[1]))&&(t=p[1]),u.test(t)&&n.test(t)&&(t=t.slice(0,t.length-1)),l&&(t="y"+t.slice(1)),t)}}(); // prettier-ignore
  const stopwords = new Set(['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]); // prettier-ignore

  return { getRelated: getRelated, toBag: toBag };

  //** Find related tweets */
  function getRelated(tweet, tweets, n_tweets = 20) {
    
    return topKBy(tweets, t => similarity(t.bag, tweet.bag),n_tweets);
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
    return intersect(bag1, bag2).size/union(bag1,bag2).size;
  }

  //** Get top k elements of array by key */
  function topKBy(arr, f, k = 20) {
    if(arr===null){
      arr = []
    }
    let items = arr.slice(0, k).map(x => [x, f(x)]);
    for (const x of arr) {
      const y = f(x);
      if (y > items[0][1]) {
        items[0] = [x, y];
        //items = items.filter(([x,s]) => s*s > 0);
        items.sort(([_, y1], [__, y2]) => y1 - y2);
      }
    }
    
    return items.map(([x, _]) => x);
  }

  //** Intersection of sets */
  function intersect(set1, set2) {
    return new Set([...set1].filter(x => set2.has(x)));
  }

  //** Union of sets */
  function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
  }
})();
