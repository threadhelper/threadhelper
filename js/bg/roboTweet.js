let midRoboRequest = false

async function queryGPT(prompt, max_tokens = 40){
    let headers = {
          Authorization: "Bearer sk-kPznCiBCG9HRWX1iwuUWgpgR13GLLaox0EUNKdlw",
          "Content-Type": 'application/json'
        }
    let options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({"prompt": prompt, "max_tokens": max_tokens})
      }
    let _do = (r)=>{return regeneratorRuntime}
    let res = await fetch('https://api.openai.com/v1/engines/davinci/completions', options).then(x => x.json())
    console.log({res})
    console.log(res.choices[0].text)
    // let data = await fetch('https://api.openai.com/v1/engines/davinci/completions', options).then((r)=>{return r.json()}).then((data)=>{console.log(data.choices[0].text); return data})

    return res
}

