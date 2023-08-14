// mouse.js
// handles mouse inputs
// also holds the rotation input math. Should this be moved?
//
// listeners: mousedown, mouseup, mousemove, dblclick, wheel

//this also deals a lot with viewing angle

const MOUSE = {
    
    drag: {
        origin: {
            x: 0,
            y: 0,
        },
        endPoint: {
            x: 0,
            y: 0
        }
    },
    
    position: { //so "getCursorPosition" doesn't have to be called so frequently
        x: 0,
        y: 0
    },
    
    startRot: 45, //the rotation at the start of a mouse drag
    startTilt: 1, //the tilt at the start of a mouse drag

    startViewX: 0,
    startViewY: 0,

    rightClickDown: false,
    leftClickDown: false,
    hasMoved: false, //has the mouse moved since last detectradius? could this be refactored?
    
    selectRotation: RENDER.rotation, //the camera rotation, but culled to under 360 and over 0 by this function
    facing: "+y",
    altFacing: 0, //what is altfacing??
    mode: "horizontal",
    
    main: function() {
        
        if (MOUSE.rightClickDown) {
            MOUSE.setRotTilt();
        }

        if (MOUSE.leftClickDown) {
            MOUSE.panCamera();
        }
        
        MOUSE.getFacing();
        
        
    },

    //set rotation & tilt
    setRotTilt: function() {
        RENDER.rotation = MOUSE.startRot + (MOUSE.drag.origin.x/3 - MOUSE.drag.endPoint.x/3);
        
        RENDER.tilt = MOUSE.startTilt - (MOUSE.drag.origin.y/2 - MOUSE.drag.endPoint.y/2);
        if (RENDER.tilt < 0) {
            RENDER.tilt = 0;
            
        }
        else if (RENDER.tilt > 100) {
            RENDER.tilt = 100;
        }
    },

    panCamera: function() { //is it really panning?
        const speed = 43 * (30 / RENDER.tileRes);

        let x = MOUSE.startViewX + (MOUSE.drag.origin.x/speed - MOUSE.drag.endPoint.x/speed);
        let y = MOUSE.startViewY - (MOUSE.drag.origin.y/speed - MOUSE.drag.endPoint.y/speed);

        const rotated = RENDER.rotatePoint(MOUSE.startViewX, MOUSE.startViewY, x, y, -RENDER.rotation);

        YOU.view.x = rotated.x;
        YOU.view.y = rotated.y;
        
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
        const x = event.clientX * window.devicePixelRatio - rect.left //get x coord
        const y = event.clientY * window.devicePixelRatio - rect.top //get y coord

        return {x:x,y:y}; //return coord pair
    },
    
    mouseUp: function(event) {

        RENDER.update();

        //context menu. Should move to menu?
        if (MOUSE.rightClickDown) {

            const dragDistance = RENDER.distance(MOUSE.drag.origin,MOUSE.drag.endPoint);

            if (dragDistance < 10) {
                MENU.select = CURSOR.selectTile(CURSOR.radiusTiles[CURSOR.radiusTiles.length-1]);
                createContextMenu(event);
            }
        }

        MOUSE.rightClickDown = false;
        MOUSE.leftClickDown = false; //should it specify?

        

    },
    
    mouseDown: function(event) {
        
        RENDER.update();
        removeContextMenu();
        
        if (event.shiftKey == true) { //shift click
            
        }
        else if (event.button === 0 && !movingWindow) { //left click

            CURSOR.select = CURSOR.selectTile(CURSOR.radiusTiles[CURSOR.radiusTiles.length-1]);

            //if it hits the ground
            if (typeof CURSOR.select.x === 'undefined') {
                const click = MOUSE.getCursorPosition(worldCanvas, event);

                const floorCoords = CURSOR.getFloorTile(click,0,120);

                CURSOR.select = {
                    x: floorCoords.x,
                    y: floorCoords.y,
                    z: 0
                };
            }

            CURSOR.enterSelect = Object.assign({}, CURSOR.select);

            MOUSE.drag.origin = MOUSE.getCursorPosition(worldCanvas, event);
            MOUSE.drag.endPoint = MOUSE.getCursorPosition(worldCanvas, event);
            MOUSE.leftClickDown = true;
            MOUSE.startViewX = YOU.view.x; //why do these need to be here?
            MOUSE.startViewY = YOU.view.y;

        }
        else if (event.button === 1) { //middle click
            
        }
        else if (event.button === 2) { //right click
            MOUSE.drag.origin = MOUSE.getCursorPosition(worldCanvas, event);
            MOUSE.drag.endPoint = MOUSE.getCursorPosition(worldCanvas, event);
            MOUSE.rightClickDown = true;
            MOUSE.startRot = RENDER.rotation; //why do these need to be here?
            MOUSE.startTilt = RENDER.tilt;
        }
        
        

    },
    
    mouseMove: function(event) {

        //test function
        //var ghostItem; = //inventory item
        //ghostItem.style.left = 0 - event.x + 'px';
        //ghostItem.style.top = 0 - event.y + 'px';
        

        
        MOUSE.hasMoved = true;
        RENDER.update();
        
        MOUSE.position = MOUSE.getCursorPosition(worldCanvas, event) //update current mouse position

        if (MOUSE.rightClickDown || MOUSE.leftClickDown) {
            MOUSE.drag.endPoint = MOUSE.getCursorPosition(worldCanvas, event) //update current mouse position

            if (MOUSE.rightClickDown) {
                TUTORIAL.rightDragCount++;
            }
            if (MOUSE.leftClickDown) {
                TUTORIAL.leftDragCount++;
            }
        }
        
        if (event.clientX < 0 || event.clientX > window.innerWidth || event.clientY < 0 || event.clientY > window.innerHeight) {
            MOUSE.rightClickDown = false;
            MOUSE.leftClickDown = false;
        }
    },
    
    mouseDouble: function (event) {

        //move here
        MENU.select = CURSOR.selectTile(CURSOR.radiusTiles[CURSOR.radiusTiles.length-1]);
        MENU.moveHere();

    },
    
    mouseWheel: function (event) { //This should probably be split up

        RENDER.update();

        let mwheel = 0;

        if (event.deltaY < 0) {
            //The wheel was moved up
            mwheel = 1;
        }
        else if (event.deltaY > 0) {
            //The wheel was moved down
            mwheel = -1;
        }

        //zoom if not selecting anything
        if (true) {//typeof CURSOR.select.x === 'undefined') {

            RENDER.tileRes -= mwheel*6;
            RENDER.fontPx = worldCanvas.width / RENDER.tileRes;

            if (RENDER.tileRes < 10) {
                RENDER.tileRes = 10;
            }
            if (RENDER.tileRes > 200) {
                RENDER.tileRes = 200;
            }

            RENDER.setFont();
        }

        //if selecting something, move selection along depth axis. Shouldn't this be in cursor?
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

worldCanvas.focus();
const MOBILE = {

    touchDown: function (event) {

        CURSOR.selectTile(CURSOR.radiusTiles[CURSOR.radiusTiles.length-1]);

        MOUSE.drag.origin.x = event.touches[0].clientX;
        MOUSE.drag.origin.y = event.touches[0].clientY;

        MOUSE.drag.endPoint.x = event.touches[0].clientX;
        MOUSE.drag.endPoint.y = event.touches[0].clientY;

        MOUSE.startViewX = YOU.view.x; //why do these need to be here?
        MOUSE.startViewY = YOU.view.y;

        MOUSE.startRot = RENDER.rotation; //why do these need to be here?
        MOUSE.startTilt = RENDER.tilt;

        MOUSE.leftClickDown = true;

        

        RENDER.update();
    },
      
    touchMove: function (event) {
        if (!MOUSE.leftClickDown && !MOUSE.rightClickDown) {
          return;
        }
      
        MOUSE.drag.endPoint.x = event.touches[0].clientX;
        MOUSE.drag.endPoint.y = event.touches[0].clientY;

        MOUSE.position.x = event.touches[0].clientX;
        MOUSE.position.y = event.touches[0].clientX;

        MOUSE.hasMoved = true;
        RENDER.update();
    },
      
    touchUp: function (event) {
        MOUSE.leftClickDown = false;
        MOUSE.rightClickDown = false;

        RENDER.update();
    }
}

document.addEventListener("touchstart", MOBILE.touchDown); //🏈
document.addEventListener("touchmove", MOBILE.touchMove);
document.addEventListener("touchend", MOBILE.touchUp);

// Check if the user is on a mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {

    RENDER.rotation = 35; //the rotation at the start of a mouse drag
    RENDER.tilt = 75; //the tilt at the start of a mouse drag
    RENDER.tileRes = 60;

  // Create the popup element
  let popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '12.5%';
  popup.style.left = '12.5%';
  popup.style.width = '50%';
  popup.style.height = '30%';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
  popup.style.display = 'flex';
  popup.style.alignItems = 'center';
  popup.style.justifyContent = 'center';
  popup.style.zIndex = '9999';
  popup.style.textAlign = 'center';

  // Create the message element
  let message = document.createElement('h1');
  message.textContent = "Mobile use is not currently operational, sorry!! Please feel free to play on a desktop until we get it working.";
  popup.addEventListener('click', function() {
    popup.remove();
  });

  // Add the message and button elements to the popup
  popup.appendChild(message);

  // Add the popup to the document
  document.body.appendChild(popup);
}