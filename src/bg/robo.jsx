import {setData} from '../utils/dutils.jsx'
import {getThreadAbove} from './twitterScout.jsx'
import { flattenModule } from '../utils/putils.jsx'
import * as R from 'ramda';
flattenModule(global,R)

const clean_tweet = (text)=>{
  let t_url = /https:\/\/t\.co.*/
  // let t_url = /https:\/\/twitter\.com.*/
  text = text.replace(t_url,'')
  text = text.trim()
  text = text.replace(/^\s+|\s+$/g, '');
  return text
}

// getThreadText :: tid -> [tweets ]
const getThreadText = curry((getAuthInit, m) => pipe(
  defaultTo(null),
  getThreadAbove(getAuthInit, 0),
  andThen(pipe(
    map(x=>(x.full_text || x.text)),
    // reduce(join(tweet_separator),''),
    append(m.query),
    join(tweet_separator),
    )),
)(m.reply_to))

const tweet_separator = '\n---\n'
// const makeQuery = curry(async (getAuthInit, m)=>reduce(join(tweet_separator),'',[...(await getThreadText(getAuthInit,m.reply_to)), m.query]))
  // if(!isNil(m.reply_to) && !isEmpty(m.reply_to)){
  //   let thread = await getThreadAbove(m.reply_to)
  //   existing_thread_text = thread.map(x=>{return x.full_text || x.text})
  // }

// handleRoboTweet :: msg -> String
export const makeRoboRequest = curry((getAuthInit,m)=>pipe(
  getThreadText(getAuthInit),
  andThen(queryGPT),
  andThen(pipe(
    prop('choices'),
    head,
    prop('text'),
    ))
  )(m))


    
// export const handleRoboTweet = async (m)=>{
//     setData({'roboSync':false})
//     const query = await makeQuery(m)
//     console.log("Made query: ", query)
//     const data = await queryGPT(query)
//     console.log('got gpt response', data)
//     const roboTweet = data.choices[0].text
//     console.log('roboTweet text: ', roboTweet)
//     setData({'roboTweet':roboTweet})
//     setData({'roboSync':true})
// }

const queryGPT = async (prompt, max_tokens = 40,stop = '\n-', temperature=0.9)=>{
  let headers = {
        Authorization: "Bearer sk-kPznCiBCG9HRWX1iwuUWgpgR13GLLaox0EUNKdlw",
        "Content-Type": 'application/json'
      }
  let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        "prompt": prompt, 
        "max_tokens": max_tokens,
        "stop": stop,
        'temperature': temperature,
      })
    }
  let _do = (r)=>{return regeneratorRuntime}
  let res = await fetch('https://api.openai.com/v1/engines/davinci/completions', options).then(x => x.json())
  // console.log({res})
  // console.log(res.choices[0].text)
  // let data = await fetch('https://api.openai.com/v1/engines/davinci/completions', options).then((r)=>{return r.json()}).then((data)=>{console.log(data.choices[0].text); return data})

  return res
}
