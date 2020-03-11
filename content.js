console.log("surething.js has been loaded");

var div = document.createElement("div");
div.innerHTML = "Oh hello";
div.id = "suggestionBox";
document.body.appendChild(div);
console.log("child added");

function waitForRender() {
	let textDiv = document.querySelector('span[data-text="true"]');
	if (textDiv === null) {
		setTimeout(waitForRender, 250);
	} else {
		addLogger(textDiv);
	}
}

function addLogger(div) {
	var observer = new MutationObserver(ls => console.log(ls));
	observer.observe(div, { characterData: true, subtree: true });
}

waitForRender();

console.log("end of script executed");
