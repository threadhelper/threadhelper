const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )

let checkboxes = document.querySelectorAll('type="checkbox"');
for (let ch of checkboxes) {
    ch.onchange = () => {
        if(ch.checked){

        }
    }
}
function saveOptions(checkboxes) {
        options = {}
        for (ch of checkboxes){
            options[ch.id] = ch.checked
        }
        chrome.storage.sync.set(options, function() {
            console.log('set ' + options);
        })
    }
}
saveOptions(checkboxes);
