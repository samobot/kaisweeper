//board functions

console.log("Game Start!");

function runAround(x, y, callback) {
    if(x-1 > -1 && y-1 > -1) {try {callback(x-1, y-1)} catch(event){console.log(event)}}
    if(x-1 > -1){try {callback(x-1, y)} catch(event){console.log(event)}}
    if(x-1 > -1 && y+1 < height){try {callback(x-1, y+1)} catch(event){console.log(event)}}
    if(x+1 < width && y-1 > -1){try {callback(x+1, y-1)} catch(event){console.log(event)}}
    if(x+1 < width){try {callback(x+1, y)} catch(event){console.log(event)}}
    if(x+1 < width && y+1 < height){try {callback(x+1, y+1)} catch(event){console.log(event)}}
    if(y-1 > -1){try {callback(x, y-1)} catch(event){console.log(event)}}
    if(y+1 < height){try {callback(x, y+1)} catch(event){console.log(event)}}
}

function countAround(board, x, y) {
    let c = 0;
    runAround(x, y, function(dx, dy) {
        c += board[dy][dx] === "*" ? 1 : 0;
    });
    /*try {c = board[y-1][x-1] === "*" ? 1 : 0;} catch(event){}
    try {c += board[y-1][x] === "*" ? 1 : 0;} catch(event){}
    try {c += board[y-1][x+1] === "*" ? 1 : 0;} catch(event){}
    try {c += board[y+1][x+1] === "*" ? 1 : 0;} catch(event){}
    try {c += board[y+1][x] === "*" ? 1 : 0;} catch(event){}
    try {c += board[y+1][x-1] === "*" ? 1 : 0;} catch(event){}
    try {c += board[y][x+1] === "*" ? 1 : 0;} catch(event){}
    try {c += board[y][x-1] === "*" ? 1 : 0;} catch(event){}
    */
    return c;
}

function revealAround(board, flipboard, x, y) {
    let flags = 0;
    runAround(x, y, function(dx, dy) {
        if(flipboard[dy][dx] === "f") {
            flags++;
        }
    });
    if(flags === board[y][x]) {
        runAround(x, y, function(dx, dy) {
            flipboard[dy][dx] = flipboard[dy][dx] === "f" ? "f" : true;
        });
    }
    /*try {flipboard[y-1][x-1] = flipboard[y-1][x-1] === "f" ? "f" : true;} catch{}
    try {flipboard[y-1][x] = flipboard[y-1][x] === "f" ? "f" : true;} catch{}
    try {flipboard[y-1][x+1] = flipboard[y-1][x+1] === "f" ? "f" : true;} catch{}
    try {flipboard[y+1][x+1] = flipboard[y+1][x+1] === "f" ? "f" : true;} catch{}
    try {flipboard[y+1][x] = flipboard[y+1][x] === "f" ? "f" : true;} catch{}
    try {flipboard[y+1][x-1] = flipboard[y+1][x-1] === "f" ? "f" : true;} catch{}
    try {flipboard[y][x+1] = flipboard[y][x+1] === "f" ? "f" : true;} catch{}
    try {flipboard[y][x-1] = flipboard[y][x-1] === "f" ? "f" : true;} catch{}
    */
}

function Coord(x, y) {
    this.x = x;
    this.y = y;
}

Coord.prototype.string = function() {
    return this.x + "x" + this.y;
};

function stringToCoord(string) {
    //console.log(string);
    let values = string.split("x");
    //console.log("func: " + values[0] + "x" + values[1]);
    return new Coord(parseInt(values[0]), parseInt(values[1]));
}

function zeroDiscover(board, flipboard, x, y) {
    if(board[y][x] === 0) {
        const zeroesFoundOld = new Set();
        let newDiscovered = 1;
        zeroesFoundOld.add(new Coord(x, y).string());
        while(newDiscovered != 0) {
            //console.log("loop again");
            newDiscovered = 0;
            let iterate = [...zeroesFoundOld];
            //console.log(iterate);
            for(let i=0; i < iterate.length; i++) {
                let space = stringToCoord(iterate[i]);
                //console.log(space.x + " " + space.y);
                runAround(space.x, space.y, function(dx, dy) {
                    //console.log("testing: " + dx + " " + dy);
                    if(board[dy][dx] === 0) {
                        if(!zeroesFoundOld.has(dx+"x"+dy)) {
                            //console.log("zero found: " + dx + " " + dy);
                            zeroesFoundOld.add(dx+"x"+dy);
                            flipboard[dy][dx] = true;
                            revealAround(board, flipboard, dx, dy);
                            newDiscovered++;
                        }
                    }
                }); 

            }
        }
    }
}

function randIntHasta(max) {
    return Math.floor(Math.random() * max);
}

var canvas = document.getElementById("game");
canvas.height = 320; //remember to come back and fix this after testing
canvas.width = 240; //remember to come back and fix this after testing
var ctx = canvas.getContext("2d");
var flagImg = document.getElementById("flag");
var bombImg = document.getElementById("bomb");

let params = new URLSearchParams(location.search);
console.log(params.get("width"));
var width = parseInt(localStorage.getItem("width"));
var height = parseInt(localStorage.getItem("height"));
var mines = parseInt(localStorage.getItem("mines"));
var blockheight = 320 / height; //remember to come back and fix this after testing
var blockwidth = 240 / width; //remember to come back and fix this after testing
var gameboard = [];
var flipboard = [];

//drawing functions
function drawTile(ctx, tileX, tileY, r, board, flipboard) {
    ctx.fillStyle = "#261C15";
    let x = tileX*blockwidth;
    let y = tileY*blockheight;
    if(flipboard[tileY][tileX] == true || flipboard[tileY][tileX] === "f") {
        ctx.beginPath();
        let flattopleft = true; try {flattopleft = flipboard[tileY][tileX-1] || flipboard[tileY-1][tileX]} catch(event){}
        let flattopright = true; try {flattopright = flipboard[tileY][tileX+1] || flipboard[tileY-1][tileX]} catch(event){}
        let flatbottomright = true; try {flatbottomright = flipboard[tileY][tileX+1] || flipboard[tileY+1][tileX]} catch(event){}
        let flatbottomleft = true; try {flatbottomleft = flipboard[tileY][tileX-1] || flipboard[tileY+1][tileX]} catch(event){}
        if(flattopleft) {
            ctx.moveTo(x, y);
        } else {
            ctx.arc(x+r, y+r, r, Math.PI, 1.5 * Math.PI);
        }
        if(flattopright) {
            ctx.lineTo(x+blockwidth, y);
        } else {
            //ctx.lineTo(x+blockwidth-r, y);
            ctx.arc(x+blockwidth-r, y+r, r, 1.5 * Math.PI, 0);
        }
        if(flatbottomright) {
            ctx.lineTo(x+blockwidth, y+blockheight);
        } else {
            //ctx.lineTo(x+blockwidth, y+blockheight-r);
            ctx.arc(x+blockwidth-r, y+blockheight-r, r, 0, 0.5 * Math.PI);
        }
        if(flatbottomleft) {
            ctx.lineTo(x, y+blockheight);
        } else {
            //ctx.lineTo(x+blockwidth, y+blockheight-r);
            ctx.arc(x+r, y+blockheight-r, r, 0.5 * Math.PI, Math.PI);
        }
        ctx.fill();
        ctx.closePath();
        if(board[tileY][tileX] !== "*" && flipboard[tileY][tileX] !== "f") {
            if(board[tileY][tileX] !== 0) {
                ctx.fillStyle = "#F7F7F2";
                ctx.fillText(board[tileY][tileX], x+(blockwidth/2), y+(1.4*blockheight/2));
            }
        }
    } 
    if(flipboard[tileY][tileX] === "f") {
        ctx.beginPath();
        ctx.fillStyle = "#F05D23";
        ctx.arc(x+r, y+r, r, Math.PI, 1.5 * Math.PI);
        ctx.arc(x+blockwidth-r, y+r, r, 1.5 * Math.PI, 0);
        ctx.arc(x+blockwidth-r, y+blockheight-r, r, 0, 0.5 * Math.PI);
        ctx.arc(x+r, y+blockheight-r, r, 0.5 * Math.PI, Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.drawImage(flagImg, x+((1.5/16)*blockwidth), y+((1.5/16)*blockheight), blockwidth/1.25, blockheight/1.25);
    }
    if(board[tileY][tileX] === "*" && flipboard[tileY][tileX] === true) {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(x+r, y+r, r, Math.PI, 1.5 * Math.PI);
        ctx.arc(x+blockwidth-r, y+r, r, 1.5 * Math.PI, 0);
        ctx.arc(x+blockwidth-r, y+blockheight-r, r, 0, 0.5 * Math.PI);
        ctx.arc(x+r, y+blockheight-r, r, 0.5 * Math.PI, Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.drawImage(bombImg, x+((1.5/16)*blockwidth), y+((1.5/16)*blockheight), blockwidth/1.25, blockheight/1.25);
    }
}

function debugGrid(ctx) {
    for(let i = 0; i < width; i++) {
        ctx.beginPath();
        ctx.moveTo(i*blockwidth, 0);
        ctx.lineTo(i*blockwidth, 320);
        ctx.stroke();
        ctx.closePath();
    }
    for(let i = 0; i < height; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i*blockheight);
        ctx.lineTo(240, i*blockheight);
        ctx.stroke();
        ctx.closePath();
    }
}

//create board
for(let i = 0; i < height; i++) {
    gameboard.push([]);
    flipboard.push([]);
}

for(let y = 0; y < height; y++) {
    console.log("inner loop")
    for(let x = 0; x < width; x++) {
        gameboard[y].push(" ");
        flipboard[y].push(false);
    }
}

//set mines
for(let i = 0; i < mines; i++) {
    let x = randIntHasta(width);
    let y = randIntHasta(height);
    while(gameboard[y][x] === "*") {
        x = randIntHasta(width);
        y = randIntHasta(height);
    }
    gameboard[y][x] = "*";
}

/*for(let i = 0; i < mines; i++) {
    let x = randIntHasta(width);
    let y = randIntHasta(height);
    while(flipboard[y][x] === true) {
        x = randIntHasta(width);
        y = randIntHasta(height);
    }
    flipboard[y][x] = true;
}*/

//set numbers
for(let y = 0; y < height; y++) {
    for(let x = 0; x < width; x++) {
        if(gameboard[y][x] === " ") {
            gameboard[y][x] = countAround(gameboard, x, y);
        }
    }
}

console.log("Board drawn!");

//debugGrid(ctx);

ctx.font = blockheight/2 + "px Roboto";
ctx.textAlign = "center";
ctx.fillStyle = "#261C15";

var cursorX = 0;
var cursorY = 5;
var cursorR = 5;

function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            drawTile(ctx, x, y, 5, gameboard, flipboard);
        }
    }
    let x = cursorX*blockwidth;
    let y = cursorY*blockheight;
    ctx.beginPath();
    ctx.arc(x+cursorR, y+cursorR, cursorR, Math.PI, 1.5 * Math.PI);
    ctx.arc(x+blockwidth-cursorR, y+cursorR, cursorR, 1.5 * Math.PI, 0);
    ctx.arc(x+blockwidth-cursorR, y+blockheight-cursorR, cursorR, 0, 0.5 * Math.PI);
    ctx.arc(x+cursorR, y+blockheight-cursorR, cursorR, 0.5 * Math.PI, Math.PI);
    ctx.closePath();
    ctx.strokeStyle = "#F7F7F2";
    ctx.stroke();
}

//reveal first 0 on board
for(let y = 0; y < height; y++) {
    let end = false;
    for(let x = 0; x < width; x++) {
        if(gameboard[y][x] === 0) {
            flipboard[y][x] = true;
            end = true;
            break;
        }
    }
    if(end) {
        break;
    }
}

draw();
//debugGrid(ctx);

console.log("First frame drawn!");

document.addEventListener("keyup", function(event) {
    if(event.key === "ArrowUp") {
        cursorY += cursorY > 0 ? -1 : 0;
        draw();
    } else if(event.key === "ArrowDown") {
        cursorY += cursorY < height-1 ? 1 : 0;
        draw();
    } else if(event.key === "ArrowLeft") {
        cursorX += cursorX > 0 ? -1 : 0;
        draw();
    } else if(event.key === "ArrowRight") {
        cursorX += cursorX < width-1 ? 1 : 0;
        draw();
    } else if(event.key === " " || event.key === "SoftRight") {
        if(flipboard[cursorY][cursorX] !== "f") {
            if(flipboard[cursorY][cursorX] === true) {
                revealAround(gameboard, flipboard, cursorX, cursorY);
            }
            flipboard[cursorY][cursorX] = true;
            if(gameboard[cursorY][cursorX] === 0) {
                zeroDiscover(gameboard, flipboard, cursorX, cursorY);
            }
        }
        draw();
    } else if(event.key === "f" || event.key === "SoftLeft") {
        if(flipboard[cursorY][cursorX] === false) {
            flipboard[cursorY][cursorX] = "f";
        } else if(flipboard[cursorY][cursorX] === "f") {
            flipboard[cursorY][cursorX] = false;
        }
        draw();
    }
});