// keyboard.js
// handles keyboard inputs
// also functions as a sort of "controls" or "binds" file
// also contains code for moving cursor. Should binds and cursor be moved? 
//
// listeners: keydown

const KEYBOARD = {

    rotationSnap: 15, //controls the degrees incremented by each ctrl+arrow press
    
    main: function(event) {
        
        RENDER.update();
        
        if (!event.ctrlKey) {
            event.preventDefault(); //colors can use f5's and stuff now!
        }
        
        let key = event.key;
        
        //if delete
        if (key == "Delete") {
            TILES.add("remove");
            CURSOR.moveSelect(1,0); //move cursor one to the right
        }
        
        //if backspace
        else if (key == "Backspace") {
            CURSOR.moveSelect(-1,0); //move cursor one to the left
            TILES.add("remove");
        }

        //space
        else if (key == " ") {
            TILES.add("remove");
            CURSOR.moveSelect(1,0); //move cursor one to the right
        }

        else if (key == "Enter") {

            CURSOR.select = CURSOR.enterSelect;
            CURSOR.moveSelect(0,-1);
            CURSOR.enterSelect = Object.assign({}, CURSOR.select);

        }
        
        //if functionkey
        else if (key[0] == "F" && key.length > 1) {
            KEYBOARD.fnKey(key);
        }

        //if insert
        else if (key == "Insert") {
            if (RENDER.highlighterMode) {
                RENDER.highlighterMode = false;
            } else {
                RENDER.highlighterMode = true;
            }
        }
        
        //if page up
        else if (key == "PageUp") { //could instead use a depth mover in cursor

            if (CURSOR.plane.mode == "horizontal") {
                CURSOR.select.z += 1;
            }
            else if (CURSOR.plane.facing == "+x") {
                CURSOR.select.x += 1;
            }
            else if (CURSOR.plane.facing == "-x") {
                CURSOR.select.x -= 1;
            }
            else if (CURSOR.plane.facing == "+y") {
                CURSOR.select.y += 1;
            }
            else if (CURSOR.plane.facing == "-y") {
                CURSOR.select.y -= 1;
            }

            CURSOR.correctSelect();
            CURSOR.enterSelect = Object.assign({}, CURSOR.select);
        }

        //if page down
        else if (event.code == "PageDown") { //could instead use a depth mover in cursor



            if (CURSOR.plane.mode == "horizontal") {
                CURSOR.select.z += -1;
            }
            else if (CURSOR.plane.facing == "+x") {
                CURSOR.select.x -= 1;
            }
            else if (CURSOR.plane.facing == "-x") {
                CURSOR.select.x += 1;
            }
            else if (CURSOR.plane.facing == "+y") {
                CURSOR.select.y -= 1;
            }
            else if (CURSOR.plane.facing == "-y") {
                CURSOR.select.y += 1;
            }

            CURSOR.correctSelect();
            CURSOR.enterSelect = Object.assign({}, CURSOR.select);
        }

        //if arrow
        else if (key.startsWith("Arrow")) {
            
            if (event.ctrlKey) { //eventually this could be used to skip spaces, like in text docs
                
                let correctedRotation = RENDER.rotation;

                while (correctedRotation > 360 || correctedRotation < 0) { //could be moved to different function, maybe getFacing?
                    if (correctedRotation > 360) {
                        correctedRotation -= 360;
                    }
                    if (correctedRotation < 0) {
                        correctedRotation += 360;
                    }
                }

                let newSnap = 0;
                while (newSnap < correctedRotation) {
                    newSnap += KEYBOARD.rotationSnap;
                }

                if (key == "ArrowRight") {
                    RENDER.rotation = newSnap + KEYBOARD.rotationSnap;
                }
                else if (key == "ArrowLeft") {
                    RENDER.rotation = newSnap - KEYBOARD.rotationSnap;
                }
                else if (key == "ArrowUp") { //this does nothing to account for vertical tilt, but no one will notice >:)
                    RENDER.tilt += KEYBOARD.rotationSnap; 
                }
                else if (key == "ArrowDown") {
                    RENDER.tilt -= KEYBOARD.rotationSnap;
                }

            }
            else if (event.shiftKey) { //eventually this could be used to highlight spaces, like in text docs
                KEYBOARD.arrow(key);
            } 
            else {
                KEYBOARD.arrow(key);
                CURSOR.enterSelect = Object.assign({}, CURSOR.select);
            }
            
            
        }
        
        //if esc
        else if (key == "Escape") {
            CURSOR.selectTile({
                x:Math.floor(YOU.coords.x),
                y:Math.floor(YOU.coords.y),
                z:0
            });

            //exit tutorial
            TUTORIAL.isInProgress = false;
            TUTORIAL.finishPhase();
        }
        
        //if Alt
        else if (key == "Alt" || key == "Tab") {

            TUTORIAL.toggledAltCount += 1;

            if (CURSOR.plane.mode == "horizontal") {
                CURSOR.plane.mode = "vertical";
            } else {
                CURSOR.plane.mode = "horizontal";
            }

        }

        // //if ctrl + c
        // else if (key == "c" && event.ctrlKey) {

        //     const selectedTile = {char:"▋"}; //todo detect tile
        //     navigator.clipboard.writeText(selectedTile.char);

        // }

        

        //else, add key
        else if (key.length == 1 && !event.ctrlKey) {

            TILES.add(key);
            CURSOR.moveSelect(1,0); //move cursor one to the right
            TUTORIAL.typeToBuildCount += 1;
        }
        
    },
    
    arrow: function(key) {

        TUTORIAL.arrowKeysCount += 1;
        
        if (key == "ArrowLeft") {
            CURSOR.moveSelect(-1,0);
        }
        else if (key == "ArrowUp") {
            CURSOR.moveSelect(0,1);
        }
        else if (key == "ArrowRight") {
            CURSOR.moveSelect(1,0);
        }
        else if (key == "ArrowDown") {
            CURSOR.moveSelect(0,-1);
        }
    },
    
    fnKey: function (key) {
        
        if (key == "F1") {

            TILES.add("backpack");CURSOR.moveSelect(1,0);

            //tempEat();
            CURSOR.select.color = CURSOR.colors[0];
        }
        else if (key == "F2") {

            TILES.add("canopener");CURSOR.moveSelect(1,0);

            CURSOR.select.color = CURSOR.colors[1];
        }
        else if (key == "F3") {
            TILES.add("crowbar");CURSOR.moveSelect(1,0);

            CURSOR.select.color = CURSOR.colors[2];
        }
        else if (key == "F4") {

            TILES.add("flashlight");CURSOR.moveSelect(1,0);

            CURSOR.select.color = CURSOR.colors[3];
        }
        else if (key == "F5") {

            TILES.add("hammer");CURSOR.moveSelect(1,0);

            CURSOR.select.color = CURSOR.colors[4];
        }
        else if (key == "F6") {

            TILES.add("molotov");CURSOR.moveSelect(1,0);

            CURSOR.select.color = CURSOR.colors[5];
        }
        else if (key == "F7") {

            TILES.add("saw");CURSOR.moveSelect(1,0);

            CURSOR.select.color = CURSOR.colors[6];
        }
        else if (key == "F8") {

            TILES.add("pallet");CURSOR.moveSelect(1,0);

            CURSOR.select.color = CURSOR.colors[7];
        }
        else if (key == "F9") {

            TILES.add("pistol");CURSOR.moveSelect(1,0);

            CURSOR.select.color = CURSOR.colors[8];
        }
        else if (key == "F10") {

            TILES.add("plank");CURSOR.moveSelect(1,0);

            CURSOR.select.color = CURSOR.colors[9];
        }
        else if (key == "F11") {

            TILES.add("radio");CURSOR.moveSelect(1,0);

        }
        else if (key == "F12") {

            TILES.add("trowel");CURSOR.moveSelect(1,0);

        }
        
    },

    copy: function (event) {

        const selectedTile = TILES.getTile(CURSOR.select.x,CURSOR.select.y,CURSOR.select.z);

        if (typeof selectedTile.char === undefined) {
            navigator.clipboard.writeText(" ");
        } else {
            navigator.clipboard.writeText(selectedTile.char);
        }
        

    },

    cut: function (event) {
        const selectedTile = TILES.getTile(CURSOR.select.x,CURSOR.select.y,CURSOR.select.z);
        
        if (typeof selectedTile === undefined) {
            navigator.clipboard.writeText(" ");
        } else {
            navigator.clipboard.writeText(selectedTile.char);
            TILES.add("remove");
        }

        
    },

    paste: function (event) {
        
        const clipboardData = event.clipboardData;
        const pastedData = clipboardData.getData('text');

        TILES.add(pastedData[0]);
        CURSOR.moveSelect(1,0); //move cursor one to the right

    }

}

document.addEventListener('copy', KEYBOARD.copy);
document.addEventListener('cut', KEYBOARD.cut);
document.addEventListener('paste', KEYBOARD.paste);

document.addEventListener('keydown', KEYBOARD.main);