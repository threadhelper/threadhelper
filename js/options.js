
window.onload = () =>{
  console.log("window loaded")
  buildPage(options_template)
  setUpListeners()
  //displayLibrary()
  showValues()
  } 

const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )

// for pretty printing

function prettify(obj){
  let pretty = ''
  if (obj != null){
    if (obj["since_time"])obj["since_time"] = (new Date(obj["since_time"])).toLocaleString();
    if (obj["max_time"])obj["max_time"] = (new Date(obj["max_time"])).toLocaleString();
    if (obj["last_update"])obj["last_update"] = (new Date(obj["last_update"])).toLocaleString();
    pretty = JSON.stringify(obj, null, 4)
  }
  return pretty
}


let options = {
  
}

let options_template = {
  getRetweets: {
    type: "checkbox", 
    value: true, 
    description: "Search over my retweets in addition to my tweets."
  },
  getArchive: {
    type: "checkbox", 
    value: false,
    description: "Get archive (will attempt to get ALL user tweets. May take a while and make your browser slower.)"
  }
}

let actions_template = {
  saveOptions: {
    name: "Save Options",
    description:""
  },
  clearButton: {
    name: "Clear Storage",
    description:"(ATTENTION) This deletes all the tweet information you have stored in Thread Helper."
  }
}

function showValues(){
  chrome.storage.local.get(["options"], r =>{
    console.log("loaded options: ", r.options)
    if (r.options != null){
      options = r.options
      for (var [key, value] of Object.entries(options)) {
        el = document.getElementById(key);
        el.checked = value
        // var p = document.createElement("p");
        // p.textContent = toString(value);
        // p.textContent = value != null ?  value : "No value";
        // el.appendChild(p);
      }
    }
    else{
      console.log("couldn't load")
    }
  });
}

// async function showValues(){
  
//   try{
//     options = await loadOptions();
//     console.log(options)
//   }catch(err){
//     console.log("couldn't load")
//     if (err) console.error(err)
//     options = {}
//   }
//   if (options != {}){
//     for (var [key, value] of Object.entries(options)) {
//       el = document.getElementById(key);
//       var p = document.createElement("p");
//       p.textContent = toString(value);
//       p.textContent = value != null ?  value : "No value";
//       el.appendChild(p);
//     }
//   }
// }

// loads options form storage

async function loadOptions(){
  ops = new Promise(function (resolve, reject) {
    chrome.storage.local.get(["options"], r =>{
      console.log("loaded options: ", r.options)
      if (r.options != null){
        resolve(r.options);
      } else{
        reject(null);
      }
    })
  });
  return ops
}

//gets the elements of all options
function getOptionFields(){
  let checkboxes = document.getElementsByTagName('input');
  console.log("checkboxes:", checkboxes)
  return checkboxes
}


//displays meta info about tweets in storage
function displayLibrary(){
  //let lib = document.getElementById("library")
  let lib = document.createElement("div");
  lib.id = 'library'
  let params = ["tweets", "tweets_meta", "tweets_arch", "tweets_meta_arch"]
  chrome.storage.local.get(params, r =>{
    for (param of params){
      let details = document.createElement("details");
      //details.style = "text-indent: 50px;"
      let summary = document.createElement("summary");
      summary.textContent = param
      let t_div = document.createElement("div");
      t_div.style = "white-space: pre-wrap;"
      t_div.textContent = r.tweets_meta != null ?  prettify(r[param]) : `No ${param}`
      details.appendChild(summary);
      details.appendChild(t_div);
      lib.appendChild(details);
    }
    //typeof r.tweets_meta !== 'undefined' && 
  })
  return lib
}

function buildOption(key, value){
  let label = document.createElement("label");
  let input = document.createElement("input");
  let description = document.createElement("span");
  description.textContent = value.description
  input.type = value.type
  input.id = key
  if (value.type == "checked") {input.checked = value.value}
  label.appendChild(input)
  label.appendChild(description)
  return label
}


function buildButton(key, value){
  let div = document.createElement("div");
  div.id = key.concat("Div")
  let butt = document.createElement("button");
  butt.id = key
  butt.textContent = value.name
  div.appendChild(butt)
  return div
}

function buildCancel(key, value){
  let butt = document.createElement("button");
  butt.id = key.concat("Cancel")
  butt.textContent = "Cancel"
  butt.style.display = "none"
  return butt
}


function buildPage(options_template){
  // append all options
  for (var [key, value] of Object.entries(options_template)) {
    let label = buildOption(key,value)
    document.body.appendChild(label)
    document.body.appendChild(document.createElement("br"))
  }
  //append archive monitor
  // let lib = displayLibrary()
  // document.body.appendChild(lib)
  // document.body.appendChild(document.createElement("br"))
  
  
  for (var [key, value] of Object.entries(actions_template)) {
    let butt = buildButton(key,value)
    document.body.appendChild(butt)
    document.body.appendChild(document.createElement("br"))
  }
} 

// function saveOptions() {
//   let savebutt = document.getElementById("saveOptions")
//   const now = (new Date()).getTime()
//   let options_meta = {lastUpdated: now}
//   let new_options = {}
//   const checkboxes = getOptionFields()
//   for (ch of checkboxes){
//     //const option_name = ch.id
//     new_options[ch.id] = ch.checked
//   }
//   chrome.storage.local.set({options: new_options, options_meta: options_meta}, function() {
//     const message = {
//       type: "saveOptions",
//     };
//     chrome.runtime.sendMessage(message, ()=>{console.log("options set", new_options)});
//     chrome.storage.local.get(["options"], r =>{
//       console.log('set ', r.options);});
//       savebutt.textContent = "Saved!"
//       setTimeout(function() {
//         savebutt.textContent("Save Options")
//         }, 2000)
//     //chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => chrome.tabs.reload(tabs[0].id));
//   })
// }

function setUpListeners(){
  (document.getElementById("saveOptions")).addEventListener('click', saveOptions);
  (document.getElementById("clearButton")).addEventListener('click', () => {chrome.runtime.sendMessage({ type: "clear" });});
  function saveOptions() {
      let savebutt = document.getElementById("saveOptions")
      const now = (new Date()).getTime()
      let options_meta = {lastUpdated: now}
      let new_options = {}
      const checkboxes = getOptionFields()
      for (ch of checkboxes){
        //const option_name = ch.id
        new_options[ch.id] = ch.checked
      }
      chrome.storage.local.set({options: new_options, options_meta: options_meta}, function() {
        const message = {
          type: "saveOptions",
        };
        chrome.runtime.sendMessage(message);
        chrome.storage.local.get(["options"], r =>{
          console.log('set ', r.options);});
          savebutt.textContent = "Saved!"
          setTimeout(function() {
            savebutt.textContent = "Save Options"
            }, 2000)
        //chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => chrome.tabs.reload(tabs[0].id));
      })
  }
}