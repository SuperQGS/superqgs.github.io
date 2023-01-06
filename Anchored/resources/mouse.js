// mouse.js
// handles mouse inputs
// also holds the rotation input math. Should this be moved?
//
// listeners: mousedown, mouseup, mousemove, dblclick, wheel

var MOUSE = {
    
    //initial mouse position
    start: {
        x: 0, //45 degrees
        y: 0
    },
    
    //current mouse position
    current: {
        x: 0,
        y: 0
    },
    
    position: {
        x: 0,
        y: 0
    },
    
    startRot: 45, //the rotation at the start of a mouse drag
    startTilt: 65, //the tilt at the start of a mouse drag
    down: false, //is the mouse being held down?
    moved: false, //has the mouse moved since last detectradius?
    
    selectRotation: RENDER.rotation, //the camera rotation, but culled to under 360 and over 0 by this function
    facing: "+y",
    altFacing: 0,
    mode: "horizontal",
    
    main: function() {
        
        MOUSE.setRotTilt();
        MOUSE.getFacing();
        
    },

    //set rotation & tilt
    setRotTilt: function() {
        RENDER.rotation = MOUSE.startRot + (MOUSE.start.x/3 - MOUSE.current.x/3);
        
        RENDER.tilt = MOUSE.startTilt + (MOUSE.start.y/2 - MOUSE.current.y/2);
        if (RENDER.tilt < 1) {
            RENDER.tilt = 1;
            
        }
        else if (RENDER.tilt > 125) {
            RENDER.tilt = 135;
        }
    },
    
    //get the direction the player is facing
    getFacing: function () {
        selectRotation = RENDER.rotation;

        while (selectRotation > 360 || selectRotation < 0) {
            if (selectRotation > 360) {
                selectRotation -= 360;
            }
            if (selectRotation < 0) {
                selectRotation += 360;
            }
        }

        if (RENDER.tilt < 3) {
            MOUSE.mode = "horizontal";
        } else {
            MOUSE.mode = "vertical";
        }

        if (selectRotation < 45 || selectRotation > 315) {
            MOUSE.facing = "+y";
        }
        else if (selectRotation < 135 && selectRotation > 45) {
            MOUSE.facing = "-x";
        }
        else if (selectRotation < 225 && selectRotation > 135) {
            MOUSE.facing = "-y";
        }
        else if (selectRotation < 315 && selectRotation > 225) {
            MOUSE.facing = "+x";
        }        
        
        //alternative facing
        if (selectRotation > -1 && selectRotation <= 90) {
            MOUSE.altFacing = 0;
        }
        else if (selectRotation > 90 && selectRotation <= 180) {
            MOUSE.altFacing = 1;
        }
        else if (selectRotation > 180 && selectRotation <= 270) {
            MOUSE.altFacing = 2;
        }
        else if (selectRotation > 270 && selectRotation <= 360) {
            MOUSE.altFacing = 3;
        }
    },
    
    getCursorPosition: function (canvas, event) { //returns mouse position, I stole most of this
        const rect = canvas.getBoundingClientRect() //get clickable element
        const x = event.clientX - rect.left //get x coord
        const y = event.clientY - rect.top //get y coord

        return {x:x,y:y}; //return coord pair
    },
    
    mouseUp: function() {
        RENDER.update();
        MOUSE.down = false;
    },
    
    mouseDown: function(event) {
        
        RENDER.update();
        
        if (event.button === 0) { //left click
            CURSOR.selectTile(CURSOR.radiusTiles[CURSOR.radiusTiles.length-1]);
        }
        if (event.button === 1) { //middle click
            
        }
        if (event.button === 2) { //right click
            MOUSE.start = MOUSE.getCursorPosition(worldCanvas, event);
            MOUSE.current = MOUSE.getCursorPosition(worldCanvas, event);
            MOUSE.down = true;
            MOUSE.startRot = RENDER.rotation;
            MOUSE.startTilt = RENDER.tilt;
        }
        
        

    },
    
    mouseMove: function(event) {
        
        MOUSE.moved = true;
        RENDER.update();
        
        MOUSE.position = MOUSE.getCursorPosition(worldCanvas, event) //update current mouse position

        if (MOUSE.down) { //if mouse is down
            MOUSE.current = MOUSE.getCursorPosition(worldCanvas, event) //update current mouse position
        }
        
        if (event.clientX < 0 || event.clientX > window.innerWidth || event.clientY < 0 || event.clientY > window.innerHeight) {
            MOUSE.down = false;
        }
    },
    
    mouseDouble: function (event) {
        CURSOR.selectTile(CURSOR.radiusTiles[CURSOR.radiusTiles.length-1]);
    },
    
    mouseWheel: function (event) { //This should probably be split up

        RENDER.update();

        var mwheel = 0;

        if (event.deltaY < 0) {
            //The wheel was moved up
            mwheel = 1;
        }
        else if (event.deltaY > 0) {
            //The wheel was moved down
            mwheel = -1;
        }

        if (typeof CURSOR.select.x === 'undefined') {

            RENDER.tileRes -= mwheel*6;
            RENDER.fontPx = worldCanvas.width / RENDER.tileRes;

            if (RENDER.tileRes < 10) {
                RENDER.tileRes = 10;
            }
            if (RENDER.tileRes > 200) {
                RENDER.tileRes = 200;
            }
        }


        else if (CURSOR.plane.mode == "horizontal") {
            CURSOR.select.z += mwheel;
        }

        else if (CURSOR.plane.facing[0] == "-") {
            mwheel = mwheel * -1;
        } 

        else if (CURSOR.plane.facing[1] == "x") {
            CURSOR.select.x += mwheel;
        }
        else {
            CURSOR.select.y += mwheel;
        }
        
        CURSOR.correctSelect();
    }
    
}

document.addEventListener('mousedown', MOUSE.mouseDown);
document.addEventListener('mouseup', MOUSE.mouseUp);
document.addEventListener('mousemove', MOUSE.mouseMove);
document.addEventListener("dblclick", MOUSE.mouseDouble);
document.addEventListener('wheel', MOUSE.mouseWheel);