// debug.js
// handles testing tools 
// this file is kind of messy, but it doesn't need to be perfect
// I should probably clean it up at some point so I can test things faster, and add an in game interface

var DEBUG = {
    mode: true,
    screen: false,
    smooth: false,
    line: false,
    fill: false,
    glide: false,
    rain: false,
    
    main: function () {
        if (DEBUG.mode) {
            //DEBUG.move();
            //eventually add the render stuff here instead of in render
            DEBUG.smoothMove();
            DEBUG.drawLine();
            DEBUG.drawFill();
            DEBUG.drawGlide();
            
        }
        
    },
    
    move: function (x,y,z) {
        TILES.array[0].x += x;
        TILES.array[0].y += y;
        TILES.array[0].z += z;
        //debugTiles[0].char = debugTiles[0].z; //could be used to show the z coordinate in the tile
    },
    
    smoothMove: function () {
        if (DEBUG.smooth) {
            player = TILES.array[1]; //define chaser as object 1
            target = TILES.array[0]; //define target as object 0

            if (player.x < target.x) {
                player.x += 0.1;
            }
            if (player.x > target.x) {
                player.x -= 0.1;
            }

            if (player.y < target.y) {
                player.y += 0.1;
            }
            if (player.y > target.y) {
                player.y -= 0.1;
            }

            if (player.z < target.z) {
                player.z += 0.1;
            }
            if (player.z > target.z) {
                player.z -= 0.1;
            }
        }

    },
    
    //LINE
    dx: 0,
    dy: 0,
    renderDistance: 260,
    drawLine: function() {
        if (DEBUG.line && DEBUG.dx < DEBUG.renderDistance) {
            
            TILES.array[TILES.array.length] = {"char":".","color":"red","x":DEBUG.dx,"y":DEBUG.dy,"z":0};
            TILES.array[TILES.array.length] = {"char":".","color":"yellow","x":-DEBUG.dx,"y":-DEBUG.dy,"z":0};
            TILES.array[TILES.array.length] = {"char":".","color":"green","x":-DEBUG.dx,"y":DEBUG.dy,"z":0};
            TILES.array[TILES.array.length] = {"char":".","color":"blue","x":DEBUG.dx,"y":-DEBUG.dy,"z":0};

            TILES.array[TILES.array.length] = {"char":".","color":"white","x":0,"y":DEBUG.dy,"z":0};
            TILES.array[TILES.array.length] = {"char":".","color":"white","x":0,"y":-DEBUG.dy,"z":0};
            TILES.array[TILES.array.length] = {"char":".","color":"white","x":-DEBUG.dx,"y":0,"z":0};
            TILES.array[TILES.array.length] = {"char":".","color":"white","x":DEBUG.dx,"y":0,"z":0};

            DEBUG.dx++;
            DEBUG.dy++;
        }
    },
    
    //FILL
    //function debug fill
    sx: -15*6,
    sy: -15*6,
    sz: 0,
    ex: 15*6,
    ey: 15*6,
    ez: 1,
    //color: ["white","red","orange","yellow","green","blue","indigo","violet","pink","white","red","orange","yellow","green","blue","indigo","violet","pink","white","red","orange","yellow","green","blue","indigo","violet","pink","white","red","orange","yellow","green","blue","indigo","violet","pink"],
    color: ["hum"],
    char: [",","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
    drawFill: function() {
        if (DEBUG.fill) {
            DEBUG.fill = false;
            for (z = DEBUG.sz; z < DEBUG.ez; z++) {
                for (x = DEBUG.sx; x < DEBUG.ex; x++) {
                    for (y = DEBUG.sy; y < DEBUG.ey; y++) {

                        var charty = DEBUG.char[Math.floor(Math.random() * DEBUG.char.length)];

                        if (charty != "") {
                            TILES.array[TILES.array.length] = {"char":charty,"color":CURSOR.colors[x],"x":x,"y":y,"z":z};
                        }


                    }
                }
            }
        }
    },
    
    //GLIDE
    offsetList: {
        n: -90,
        s: 90,
        e: 180,
        w: 0
    },
    moveOffset: -90,
    scale: 10,
    speed: 5 / 10,
    drawGlide: function() {
        if (DEBUG.glide) {
            DEBUG.glide = false;
            setInterval(function() {

                YOU.x += Math.cos((RENDER.rotation + DEBUG.moveOffset) * Math.PI / 180)*DEBUG.speed;
                YOU.y += Math.sin((RENDER.rotation + DEBUG.moveOffset) * Math.PI / 180)*DEBUG.speed;

                TILES.array[0].x = -YOU.x;
                TILES.array[0].y = -YOU.y;
                TILES.array[0].z = -YOU.z;

                var xPlus = "";
                if (YOU.x >= 0) {
                    xPlus = "+";
                }
                var yPlus = "";
                if (YOU.y >= 0) {
                    yPlus = "+";
                }

                document.getElementById("xCoord").innerHTML = xPlus + Math.floor(YOU.x);
                document.getElementById("yCoord").innerHTML = yPlus + Math.floor(YOU.y);
                document.getElementById("username").innerHTML = YOU.username;

                var inventoryString = "";
//                for (i = 0; i < YOU.supplies.length; i++) {
//                    inventoryString += "- " + YOU.supplies[i] + "<br>"
//                }
                document.getElementById("inventory").innerHTML = inventoryString;


            }, 1000 / DEBUG.scale / 10);
        }
    },
    
        //debug information.
    drawScreen: function () {
        if (DEBUG.screen) {
            context.fillStyle = 'cyan';
            
            context.fillText("MAIN",200*0,20*1);
            
            context.fillText("RENDER",200*1,20*1);
            context.fillText(".tileRes: " + RENDER.tileRes,200*1,20*2);
            context.fillText(".fontPx: " + RENDER.fontPx,200*1,20*3);
            context.fillText(".rotation: " + RENDER.rotation,200*1,20*4);
            context.fillText(".tilt: " + RENDER.tilt,200*1,20*5);
            context.fillText(".renderTilt: " + RENDER.renderTilt,200*1,20*6);
            context.fillText(".curve: " + RENDER.curve,200*1,20*7);
            context.fillText(".override: " + RENDER.override,200*1,20*8);
            context.fillText(".essentialFrame: " + RENDER.essentialFrame,200*1,20*9);
            context.fillText(".frame: " + RENDER.frame,200*1,20*10);
            context.fillText(".lasttilt: " + RENDER.lasttilt,200*1,20*11);
            context.fillText(".lastrotation: " + RENDER.lastrotation,200*1,20*12);
            
            context.fillText("DEBUG",200*3,20*1);
            context.fillText(".mode: " + DEBUG.mode,200*3,20*2);
            context.fillText(".screen: " + DEBUG.screen,200*3,20*3);
            context.fillText(".smooth: " + DEBUG.smooth,200*3,20*4);
            context.fillText(".line: " + DEBUG.line,200*3,20*5);
            context.fillText(".fill: " + DEBUG.fill,200*3,20*6);
            context.fillText(".glide: " + DEBUG.glide,200*3,20*7);
            context.fillText(".rain: " + DEBUG.rain,200*3,20*8);
            
            context.fillText("MOUSE",200*4,20*1);
            context.fillText(".start.x: " + MOUSE.start.x,200*4,20*2);
            context.fillText(".start.y: " + MOUSE.start.y,200*4,20*3);
            context.fillText(".current.x: " + MOUSE.current.x,200*4,20*4);
            context.fillText(".current.y: " + MOUSE.current.y,200*4,20*5);
            context.fillText(".position.x: " + MOUSE.position.x,200*4,20*6);
            context.fillText(".position.y: " + MOUSE.position.y,200*4,20*7);
            context.fillText(".startRot: " + MOUSE.startRot,200*4,20*8);
            context.fillText(".startTilt: " + MOUSE.startTilt,200*4,20*9);
            context.fillText(".down: " + MOUSE.down,200*4,20*10);
            context.fillText(".selectRotation: " + MOUSE.selectRotation,200*4,20*11);
            context.fillText(".facing: " + MOUSE.facing,200*4,20*12);
            context.fillText(".altFacing: " + MOUSE.altFacing,200*4,20*13);
            context.fillText(".mode: " + MOUSE.mode,200*4,20*14);            
            
            context.fillText("KEYBOARD",200*5,20*1);
            
            context.fillText("YOU",200*6,20*1);
            context.fillText(".x: " + YOU.x,200*6,20*2);
            context.fillText(".y: " + YOU.y,200*6,20*3);
            context.fillText(".z: " + YOU.z,200*6,20*4);
            
            context.fillText("TILES",200*0,300*1);
            var tilestring = JSON.stringify(TILES.array);
            context.fillText(".array: " + JSON.stringify(TILES.array).substring(0, 100),200*0,20+300*1);
            context.fillText(JSON.stringify(TILES.array).substring(JSON.stringify(TILES.array).length-100, JSON.stringify(TILES.array).length),200*0,40+300*1);
            
            context.fillText("CURSOR",200*0,400*1);
            context.fillText(".select: " + JSON.stringify(CURSOR.select),200*0,20+400*1);
            context.fillText(".tile: " + JSON.stringify(CURSOR.tile),200*0,40+400*1);
            context.fillText(".lastSelect: " + JSON.stringify(CURSOR.lastSelect),200*0,60+400*1);
            context.fillText(".plane.mode: " + CURSOR.plane.mode,200*0,80+400*1);
            context.fillText(".plane.facing: " + CURSOR.plane.facing,200*0,100+400*1);
            context.fillText(".withinRadius: " + JSON.stringify(CURSOR.withinRadius),200*0,120+400*1);
            context.fillText(".radiusFaces: " + JSON.stringify(CURSOR.radiusFaces),200*0,140+400*1);
            context.fillText(".radiusTiles: " + JSON.stringify(CURSOR.radiusTiles),200*0,160+400*1);
        }
    },
}