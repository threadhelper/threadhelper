// This is insane but I COULD NOT get a CSS file to load in the manifest

const styles = {
    suggestionBox: {
        position: "fixed",
        top: "150px",
        minWidth: "550px",
        minHeight: "100px",
        backgroundColor: "lightgrey",
        left: "50%",
        transform: "translateX(-50%)"
    },
    rtweet: {
        outline: "1px solid black",
        margin: "20px",
        padding: "5px",
    },
    rtext: {
        margin: "10px",
    },
    rurl: {
        margin: "10px",
    }
};

function applyStyle() {
    for (const [name, style] of Object.entries(styles)) {
        for (let div of document.getElementsByClassName(name)) {
            for (let [name, value] of Object.entries(style)) {
                div.style[name] = value;
            }
        }
    }
}