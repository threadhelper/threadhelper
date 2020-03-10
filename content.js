console.log("surething.js has been loaded");

var div = document.createElement("div")
div.style.position = "fixed";
div.style.right = "10px";
div.style.top = "10px";
div.style.width = "100px";
div.style.height = "100px";
div.style.backgroundColor = "orange";
div.innerHTML = "Oh hello";
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
	var observer = new MutationObserver((ls) => console.log(ls));
	observer.observe(div, { characterData: true, subtree: true });
}

waitForRender();

console.log("end of script executed");