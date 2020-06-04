
window.onload = () =>{
  console.log("window loaded")
  document.getElementById("save").onclick = saveOptions
  displayLibrary()
  showValues()
  } 

const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )

let options = {}
// for (let ch of checkboxes) {
//     ch.onchange = () => {
//         if(ch.checked){

//         }
//     }
// }


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
  let div = document.getElementById("library")
  chrome.storage.local.get(["tweets_meta"], r =>{
    var p = document.createElement("p");
    p.textContent = r.tweets_meta != null ?  r.tweets_meta : "No tweets_meta"
    //typeof r.tweets_meta !== 'undefined' && 
    div.appendChild(p);
  })
}

function saveOptions() {
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
    chrome.runtime.sendMessage(message, ()=>{console.log("options set", new_options)});
    chrome.storage.local.get(["options"], r =>{
      console.log('set ', r.options);});
    //chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => chrome.tabs.reload(tabs[0].id));
  })
}

