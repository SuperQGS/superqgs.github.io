// debug.js
// handles testing tools 
// this file is kind of messy, but it doesn't need to be perfect
// I should probably clean it up at some point so I can test things faster, and add an in game interface

//SIMULATION
const SIMULATION = {
    
    player: {
        x: 0,
        velocity: 0,
        energy: 100,
        hunger: 100,
        food: 0
    },

    main: function () {
        setInterval(function () {

            if (SIMULATION.player.hunger > 0) {
                SIMULATION.player.hunger -= 1;
            }

            SIMULATION.move(SIMULATION.player.velocity);
            SIMULATION.regenergy();

            console.table(SIMULATION.player);

        }, 100);
    },

    move: function (velocity) {

        if (SIMULATION.player.energy > 0) {
            SIMULATION.player.x += velocity;
            SIMULATION.player.energy -= 1;
        }

    },

    regenergy: function () {
        if (SIMULATION.player.energy < 100 && SIMULATION.player.hunger > 0) {
            SIMULATION.player.energy += 1;
            SIMULATION.player.hunger -= 1;
        }
    }

};

//SIMULATION.main();






const DEBUG = {
    mode: false,
    screen: false,
    
    main: function () {
        if (DEBUG.mode) {
            //eventually add the render stuff here instead of in render?
            
        }
        
    },
    
    //display debug information.
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
            context.fillText(".frameCounter: " + RENDER.frameCounter,200*1,20*10);
            context.fillText(".previoustilt: " + RENDER.previoustilt,200*1,20*11);
            context.fillText(".previousrotation: " + RENDER.previousrotation,200*1,20*12);
            
            context.fillText("DEBUG",200*3,20*1);
            context.fillText(".mode: " + DEBUG.mode,200*3,20*2);
            context.fillText(".screen: " + DEBUG.screen,200*3,20*3);
            context.fillText(".smooth: " + DEBUG.smooth,200*3,20*4);
            context.fillText(".line: " + DEBUG.line,200*3,20*5);
            context.fillText(".fill: " + DEBUG.fill,200*3,20*6);
            context.fillText(".glide: " + DEBUG.glide,200*3,20*7);
            context.fillText(".rain: " + DEBUG.rain,200*3,20*8);
            
            context.fillText("MOUSE",200*4,20*1);
            context.fillText(".start.x: " + MOUSE.drag.origin.x,200*4,20*2);
            context.fillText(".start.y: " + MOUSE.drag.origin.y,200*4,20*3);
            context.fillText(".current.x: " + MOUSE.drag.endPoint.x,200*4,20*4);
            context.fillText(".current.y: " + MOUSE.drag.endPoint.y,200*4,20*5);
            context.fillText(".position.x: " + MOUSE.position.x,200*4,20*6);
            context.fillText(".position.y: " + MOUSE.position.y,200*4,20*7);
            context.fillText(".startRot: " + MOUSE.startRot,200*4,20*8);
            context.fillText(".startTilt: " + MOUSE.startTilt,200*4,20*9);
            context.fillText(".down: " + MOUSE.rightClickDown,200*4,20*10);
            context.fillText(".selectRotation: " + MOUSE.selectRotation,200*4,20*11);
            context.fillText(".facing: " + MOUSE.facing,200*4,20*12);
            context.fillText(".altFacing: " + MOUSE.altFacing,200*4,20*13);
            context.fillText(".mode: " + MOUSE.mode,200*4,20*14);            
            
            context.fillText("KEYBOARD",200*5,20*1);
            
            context.fillText("YOU",200*6,20*1);
            context.fillText(".x: " + YOU.view.x,200*6,20*2);
            context.fillText(".y: " + YOU.view.y,200*6,20*3);
            context.fillText(".z: " + YOU.view.z,200*6,20*4);
            
            context.fillText("TILES",200*0,300*1);
            let tilestring = JSON.stringify(TILES.array);
            context.fillText(".array: " + JSON.stringify(TILES.array).substring(0, 100),200*0,20+300*1);
            context.fillText(JSON.stringify(TILES.array).substring(JSON.stringify(TILES.array).length-100, JSON.stringify(TILES.array).length),200*0,40+300*1);
            
            context.fillText("CURSOR",200*0,400*1);
            context.fillText(".select: " + JSON.stringify(CURSOR.select),200*0,20+400*1);
            context.fillText(".tile: " + JSON.stringify(CURSOR.tile),200*0,40+400*1);
            context.fillText(".previousSelect: " + JSON.stringify(CURSOR.previousSelect),200*0,60+400*1);
            context.fillText(".plane.mode: " + CURSOR.plane.mode,200*0,80+400*1);
            context.fillText(".plane.facing: " + CURSOR.plane.facing,200*0,100+400*1);
            context.fillText(".withinRadius: " + JSON.stringify(CURSOR.withinRadius),200*0,120+400*1);
            context.fillText(".radiusFaces: " + JSON.stringify(CURSOR.radiusFaces),200*0,140+400*1);
            context.fillText(".radiusTiles: " + JSON.stringify(CURSOR.radiusTiles),200*0,160+400*1);
        }
    }
}