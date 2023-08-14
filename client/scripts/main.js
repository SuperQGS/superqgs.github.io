// main.js
// sets up canvas variables
// runs interval that executes main functions of other js files

//CANVAS SETUP //!!! should all of this be moved to render.js?
const worldCanvas = document.getElementById("worldCanvas");

//!!!Should this be moved to a canvas.js instead?
function resizeWindow() { //!!!Causes flickering effect
    worldCanvas.height = window.innerHeight;
    worldCanvas.width = window.innerWidth;
};
window.addEventListener("load", resizeWindow);
window.addEventListener("resize", resizeWindow);

worldCanvas.style.backgroundColor = "#f8f9fa";

const context = worldCanvas.getContext("2d");
context.lineWidth = 1;
context.lineCap = 'round';

//INTERVAL (50 milliseconds)
setInterval(function() {
    
    //CLIENT
    MOUSE.main();
    CURSOR.main();
    DEBUG.main();
    RENDER.main();
    
    YOU.move(YOU.target.x,YOU.target.y);
    
}, 50);

//!!! this probably should not be here, but if I move it things break
var movingWindow = false;



// I really really really really want to change the name of this game to "Courier" or "Couriers" or "The Couriers".
// Think about it! It's like traveler, but implies cargo. And the game will have so many mechanics around moving items around.
// And also, it's a reference to the font it uses, Courier New! And it sounds cool!
// But I've already renamed it.
// -The Travelers Plus
// -The Travelers Live
// -The After
// -Anchored

// if i rename it again everyone will make fun of me and bully me and i'll have to change my name and move to a new city and start a new life.