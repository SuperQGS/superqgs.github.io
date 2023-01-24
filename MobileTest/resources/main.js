// main.js
// runs the main functions of other javascript files
// also sets up canvas variables
// also runs server raindrop code

//CANVAS SETUP (should all of this be moved to render.js?)
var worldCanvas = document.getElementById("worldCanvas");
worldCanvas.height = window.innerHeight;
worldCanvas.width = window.innerWidth; //window.innerHeight / 3 * 4; //4:3
worldCanvas.style.backgroundColor = "white";
worldCanvas.addEventListener("contextmenu", function(event) { event.preventDefault(); }); //prevent right click menu

document.body.style.cursor = "&";

var context = worldCanvas.getContext("2d");
context.lineWidth = 1;

//INTERVAL (50 milliseconds)
setInterval(function() {
    
    //LOCAL SERVER (Should eventually move to localserver/main.js)
    SERVER.rain();
    if (DEBUG.rain) {
        SERVER.rainDrop();
        SERVER.rainDrop();
    }    
    
    //CLIENT
    MOUSE.main();
    CURSOR.main();
    DEBUG.main();
    //RENDER.main();
    
    
}, 50);



var moveanim = false;
var movenum = 0;

setInterval(function() {
    moveanim = true;
    
}, 500);


setInterval(function() {
    
    if (moveanim && movenum < 10) {
        YOU.move(YOU.target.x,YOU.target.y,0);
        
        movenum++;
    }
    
    if (movenum >= 10) {
        movenum = 0;
        moveanim = false;
    }
    
    
    
}, 10);