function checkParamValidity(event) {
    if(this.value === "") {
        this.setCustomValidity("No Value Entered");
        return false;
    } else if(isNaN(this.value) || !isFinite(this.value)) {
        this.setCustomValidity("Not a number")
        return false;
    } else if(parseInt(this.value) <= 0) {
        this.setCustomValidity("Negative or zero");
        return false;
    } else {
        this.setCustomValidity("");
        return true;
    }
    return "tf?";
}

$(function() {  
    var widthbox = $("#widthbox");
    widthbox.on("input", checkParamValidity);
    var heightbox = $("#heightbox");
    heightbox.on("input", checkParamValidity);
    var minesbox = $("#minesbox");
    minesbox.on("input", checkParamValidity);
});

function startDefaultGame() {
    localStorage.setItem("width", 12);
        localStorage.setItem("height", 16);
        localStorage.setItem("mines", 30);
    window.location = "./src/html/game.html";
}

function startCustomGame() {
    if(checkParamValidity.call(widthbox) && checkParamValidity.call(heightbox) && checkParamValidity.call(minesbox)) {
        localStorage.setItem("width", widthbox.value);
        localStorage.setItem("height", heightbox.value);
        localStorage.setItem("mines", minesbox.value);
        window.location = "./src/html/game.html";
    }
}

function nav(direction) {
    const currentIndex = document.activeElement.tabIndex;
    const next = currentIndex + direction;
    const items = document.querySelectorAll(".nav");
    const targetElement = items[next];
    targetElement.focus();
}

var startButton = document.getElementById("default-start");
console.log(startButton);
startButton.focus();

document.addEventListener("keydown", function(event) {
    switch(event.key) {
        case "ArrowLeft":
            nav(-1);
            break;
        case "ArrowRight":
            nav(1);
            break;
        case "ArrowUp":
            nav(-1);
            break;
        case "ArrowDown":
            nav(1);
            break;
    }
});