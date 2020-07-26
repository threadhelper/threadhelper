let midRoboRequest = false


class Robo{
  constructor(wiz, utils){
    this.wiz = wiz
    this.utils = utils

    // this.query_preface = 
    // "This is an excelently written thread composed of high quality tweets: \n "
  }

  clean_tweet(text){
    let t_url = /https:\/\/t\.co.*/
    // let t_url = /https:\/\/twitter\.com.*/
    text = text.replace(t_url,'')
    text = text.trim()
    text = text.replace(/^\s+|\s+$/g, '');
    return text
  }

  make_query(thread_text){
    // console.log("making query", thread_text)
    let query = ''
    // let query = 'An insightful Twitter thread: \n'
    for(let [i,t] of thread_text.entries()){
        query = query.concat(`\n-------\n${this.clean_tweet(t)}`)
    }
    return query
  }

  async handleRoboTweet(m){
      console.log('robotweet message received!')
      let existing_thread_text = ''
      if(m.reply_to != ''){
        let thread = await wiz.getThreadAbove(m.reply_to)
        existing_thread_text = thread.map(x=>{return x.full_text || x.text})
      }
      existing_thread_text = [...existing_thread_text, m.query]
      let query = this.make_query(existing_thread_text)
      console.log("Making query: ", query)
      let data = await this.queryGPT(query)
      console.log('got gpt response', data)
      let roboTweet = data.choices[0].text
      console.log('roboTweet text: ', roboTweet)
      utils.setData({'roboTweet':roboTweet})
  }

  async queryGPT(prompt, max_tokens = 40,stop = '\n-', temperature=0.9){
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
    console.log({res})
    console.log(res.choices[0].text)
    // let data = await fetch('https://api.openai.com/v1/engines/davinci/completions', options).then((r)=>{return r.json()}).then((data)=>{console.log(data.choices[0].text); return data})

    return res
  }
}