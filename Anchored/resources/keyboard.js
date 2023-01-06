// keyboard.js
// handles keyboard inputs
// also functions as a sort of "controls" or "binds" file
// also contains code for moving cursor. Should binds and cursor be moved? 
//
// listeners: keydown

var KEYBOARD = {
    
    main: function(event) {
        
        RENDER.update();
        
        event.preventDefault(); //colors can use f5's and stuff now!
        var key = event.key;
        
        //if delete
        
        //if backspace
        
        //if enter
        
        //if functionkey
        if (key[0] == "F" && key.length > 1) {
            KEYBOARD.fnKey(key);
        }
        
        //if arrow
        else if (key.startsWith("Arrow")) {
            
            if (event.ctrlKey) {
                KEYBOARD.ctrlArrow(key);
            }
            else if (event.shiftKey) {
                KEYBOARD.shiftArrow(key);
            } 
            else {
                KEYBOARD.arrow(key);
            }
        
        }
        
        //if esc
        else if (key == "Escape") {
            CURSOR.selectTile(0);
        }
        
        //tab box
        else if (key == "Tab") {
            TILES.add("box");
            CURSOR.moveSelect(1,0); //move cursor one to the right
        }
        
        //space
        else if (key == " ") {
            CURSOR.moveSelect(1,0); //move cursor one to the right
        }
        
        //else, add key
        else if (key.length == 1) {
            TILES.add(key);
            CURSOR.moveSelect(1,0); //move cursor one to the right
        }
        
    },
    
    arrow: function(key) {
        
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
    
    ctrlArrow: function(key) {
        var order = ["+y","+x","-y","-x"];
        if (key == "ArrowRight") {
            if (CURSOR.plane.facing == "+y") {
                CURSOR.plane.facing = "+x";
            }
            else if (CURSOR.plane.facing == "+x") {
                CURSOR.plane.facing = "-y";
            }
            else if (CURSOR.plane.facing == "-y") {
                CURSOR.plane.facing = "-x";
            }
            else if (CURSOR.plane.facing == "-x") {
                CURSOR.plane.facing = "+y";
            }

        }

        if (key == "ArrowLeft") {
            if (CURSOR.plane.facing == "+y") {
                CURSOR.plane.facing = "-x";
            }
            else if (CURSOR.plane.facing == "-x") {
                CURSOR.plane.facing = "-y";
            }
            else if (CURSOR.plane.facing == "-y") {
                CURSOR.plane.facing = "+x";
            }
            else if (CURSOR.plane.facing == "+x") {
                CURSOR.plane.facing = "+y";
            }
        }

        if (key == "ArrowUp" || key == "ArrowDown") {
            if (CURSOR.plane.mode == "horizontal") {
                CURSOR.plane.mode = "vertical";
            } else {
                CURSOR.plane.mode = "horizontal";
            }
        }
    },
    
    shiftArrow: function (key) {
        
    },
    
    fnKey: function (key) {
        
        if (key == "F1") {
            CURSOR.select.color = CURSOR.colors[0];
        }
        else if (key == "F2") {
            CURSOR.select.color = CURSOR.colors[1];
        }
        else if (key == "F3") {
            CURSOR.select.color = CURSOR.colors[2];
        }
        else if (key == "F4") {
            CURSOR.select.color = CURSOR.colors[3];
        }
        else if (key == "F5") {
            CURSOR.select.color = CURSOR.colors[4];
        }
        else if (key == "F6") {
            CURSOR.select.color = CURSOR.colors[5];
        }
        else if (key == "F7") {
            CURSOR.select.color = CURSOR.colors[6];
        }
        else if (key == "F8") {
            CURSOR.select.color = CURSOR.colors[7];
        }
        else if (key == "F9") {
            CURSOR.select.color = CURSOR.colors[8];
        }
        else if (key == "F10") {
            CURSOR.select.color = CURSOR.colors[9];
        }
        else if (key == "F11") {
            if (DEBUG.screen) {
                DEBUG.screen = false;
            } else {
                DEBUG.screen = true;
            }
        }
        else if (key == "F12") {
            if (DEBUG.rain) {
                DEBUG.rain = false;
            } else {
                DEBUG.rain = true;
            }
        }
        
    }
}

document.addEventListener('keydown', KEYBOARD.main);
