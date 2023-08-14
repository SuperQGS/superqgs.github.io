// render.js
// handles rendering of all sorts
// also handles rotation, distance, and box code

const RENDER = {
    
    //perspective vars
    tileRes: 50,
    fontPx: worldCanvas.height / 15, //30
    rotation: 0,
    tilt: 1, //"tilt" value that is gotten from the player's view (up to 135) //!!!no longer, now it's newish solution
    //RENDER.tiltPerspective takes this and converts it to a number from 1 to Infinity
    //can I make it take it from 0 to 1 instead?

    viewDistance: 60,

    highlighterMode: false,

    tileScale: {
        x: 0.6,
        y: 0.6,
        z: 0.7
    },

    originPosition: {
        x: 2, // 2 means centered
        y: 2, //!!! 1.1 might be a better survival mode angle
    },
    
    //optimization
    optimizationOverride: false,
    updateFrame: false,
    frameCounter: 0,
    previousTilt: 1,
    previousRotation: 0,
    
    //main
    main: function() {
        
        if (RENDER.frameIsDifferent()) {

            //TILES.sortByDistance(TILES.array); //* commented out because this is SUPER bad performance
            RENDER.setupFrame();
            
            RENDER.chunks();
            RENDER.selected();

            //DEBUG.drawScreen();
            
            TUTORIAL.main();
        }

        //!!!requestAnimationFrame(RENDER.main);
        
    },
    
    //stops unneccesary frames
    frameIsDifferent: function () {
        if (RENDER.updateFrame || RENDER.optimizationOverride) {
            RENDER.updateFrame = false;
            return true;
        }
    },
    
    //tells RENDER some state has changed and a new frame is needed
    update: function () {
        RENDER.updateFrame = true;
    },
    
    //matches font with tile resolution
    setFont: function () {
        RENDER.fontPx = worldCanvas.height / RENDER.tileRes;
        context.font = RENDER.fontPx + "px Courier New";
    },
    
    //clears canvas and tracks changes for performance
    setupFrame: function () {

        RENDER.frameCounter++;
        RENDER.previousTilt = RENDER.tilt;
        RENDER.previousRotation = RENDER.rotation;

        context.clearRect(0, 0, worldCanvas.width, worldCanvas.height);
        //context.imageSmoothingEnabled = false; //* if images should be pixelated, this is the place to do it. (probably?)

    },
    
    //rotates a point around an origin with an angle
    rotatePoint: function (originX, originY, x, y, angle) {
        //!!! this could POTENTIALLY be optimized by storing values outside of the function
        const radians = (Math.PI / 180) * angle,  //!!!could store (Math.PI / 180)
        cos = Math.cos(radians),
        sin = Math.sin(radians), //!!!Could potentially even cache these as a lookup table
        rotatedX = (cos * (x - originX)) + (sin * (y - originY)) + originX, //!!!these could also be cached or combined
        rotatedY = (cos * (y - originY)) - (sin * (x - originX)) + originY;

        return {x:rotatedX, y:rotatedY};
    
    },

    //gets the angle of a line between two points
    getLineAngle: function(point1,point2) {

        var dy = point2.y - point1.y;
        var dx = point2.x - point1.x;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        //if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta; //!!! it's 0 to 180 and -0 to -180. Should I make it 360 instead?

    },
    
    //gets distance between 2 points
    distance: function (point1, point2) {

        const distanceX = point1.x - point2.x;
        const distanceY = point1.y - point2.y;

        return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
    },

    isWithinRenderDistance: function (tile) {
        return Math.abs(tile.x-YOU.view.x) < RENDER.viewDistance && Math.abs(tile.y-YOU.view.y) < RENDER.viewDistance; //!!!could view.x be incorporated into the feedin value?
    },

    isOutlier: function (tile) {

        if (RENDER.highlighterMode) {

            const horizontalOutlier = CURSOR.plane.mode == "horizontal" && tile.z != CURSOR.select.z;
            const xOutlier = CURSOR.plane.mode == "vertical" && CURSOR.plane.facing[1] == "x" && tile.x != CURSOR.select.x;
            const yOutlier = CURSOR.plane.mode == "vertical" && CURSOR.plane.facing[1] == "y" && tile.y != CURSOR.select.y;
            
            return horizontalOutlier || xOutlier || yOutlier;

        }

    },

    //returns the 2d XY of 3d coordinates
    screenPosition: function (x,y,z) {
        
        x -= YOU.view.x; //!!!could view.x be incorporated into the feed in value?
        y -= YOU.view.y;

        const rotated = RENDER.rotatePoint(0,0,x,y,RENDER.rotation);

        //change tile dimensions
        rotated.x *= RENDER.tileScale.x;
        rotated.y *= RENDER.tileScale.y;
        z *= RENDER.tileScale.z;

        //Multiply coordinate by font size
        rotated.x *= RENDER.fontPx; //!!!tileScale & fontPx could be combined and cached for one multiplication
        rotated.y *= RENDER.fontPx;
        z*= RENDER.fontPx;

        //flip y, because canvas is upside down. //!!!could canvas be flipped instead?
        rotated.y = -rotated.y;

        const correctedOrigin = {

            x: worldCanvas.width / RENDER.originPosition.x, //!!!this could definitely be cached, just has to be changed whenever originposition or canvas.width/height is changed
            y: worldCanvas.height / RENDER.originPosition.y
        
        }

        const screenX = correctedOrigin.x + rotated.x; //!!!correctedOrigin.x could instead just be a one time canvas translation, right?
        //              origin            + x (fontsize)

        const screenY = correctedOrigin.y + rotated.y * (RENDER.tilt/100) - z; //!!!^
        //              origin            +  y        / tilt/100          - z //!!!should /100 be a thing?

        //* this code can give a curvature effect, I commented it out. the earth is flat B)
        //screenY += 0.005 * Math.pow(distanceFromCenter, RENDER.curve); //what is 0.005?
        
        return {x:screenX,y:screenY};
        
    },
    
    chunks: function() {
        for (let i in YOU.loadedChunks) {

            RENDER.objects(TILES.chunks[YOU.loadedChunks[i]]);

        }
    },

    //all objects
    objects: function (array) { //!!! should it really be "array"?
        
        for (let i in array) { //sort through the objects

            const trueTile = array[i]; //define tile //!!!wtf is trueTile

            const tile = {
                x: YOU.view.x + trueTile.x,
                y: YOU.view.y + trueTile.y,
                z: YOU.view.z + trueTile.z,
                char: trueTile.char,
                color: trueTile.color
            }

            if ( !RENDER.isWithinRenderDistance(trueTile) ) { //!!!refactoring? //!!!could putting in tile let us get rid of YOU.view.x?
                //tile is NOT within render distance
            }
            
            else if (tile.char == "box") {
                context.strokeStyle = "black";//!!!tile.color;
                //!!!RENDER.box(tile.x-YOU.view.x,tile.y-YOU.view.y,tile.z,1,1,1);
            }
            
            else if (tile.char.length > 1 && tile.char != "Loading Tiles...") { //!!! should be better way of detecting this
                RENDER.image(trueTile,i); //!!!could putting in tile let us get rid of YOU.view.x?
            } 
            
            else {

                RENDER.character(trueTile,i); //!!!could putting in tile let us get rid of YOU.view.x?
            }
        }
    },

    //render a single character
    character: function (tile, i) {
        
        context.fillStyle = "black"; //!!!tile.color;

        let canvasCoordinate = RENDER.screenPosition(tile.x,tile.y,tile.z);
        const half = context.measureText(tile.char).width / 2; //!!!measureText is slow, could be cached
        canvasCoordinate.x -= half;

        if ( RENDER.isOutlier(tile) ) {
            context.fillStyle = '#e6e6e6';
        }

        context.fillText( //!!!fillText is slow, maybe characters could be cached as images?
            tile.char,
            canvasCoordinate.x,
            canvasCoordinate.y
        );
        
    },

    //render a single image
    image: function (tile, i) {

        const size = RENDER.fontPx * 0.8; //!!!could be cached in setFont

        let canvasCoordinate = RENDER.screenPosition(tile.x,tile.y,tile.z);
        const half = size / 2;
        canvasCoordinate.x -= half;
        canvasCoordinate.y -= size;

        if ( RENDER.isOutlier(tile) ) {
            context.globalAlpha = 0.5; //!!! should this reset later?
        } else {
            context.globalAlpha = 1;
        }

        const image = document.getElementById(tile.char); //!!!image variables could already exist in object array

        
        //if tile is an entity tile
        let distanceHeight = 1; //!!! better name for distanceHeight?
        let degrees = 0;
        //distanceHeight = RENDER.distance({x:0,y:0},tile) / 3;
        //degrees = 90 + RENDER.getLineAngle({x:0,y:0},canvasCoordinate); //!!!notes?
        



        // //save canvas data
        // context.save();
        
        // //translate to canvas origin
        // context.translate(
        //     (worldCanvas.width/2),
        //     (worldCanvas.height/2)
        // );

        // //translate to the canvas coordinate
        // context.translate(
        //     canvasCoordinate.x,
        //     canvasCoordinate.y
        // );
        
        // //rotate the screen
        // context.rotate((degrees)*Math.PI/180); //!!!should this be alternate function? should it detect if the image has an angle first?

        // //undo translation
        // context.translate(
        //     -canvasCoordinate.x,
        //     -canvasCoordinate.y
        // );
        

        // //draw depth image //!!!should be commented out?
        // context.drawImage(
        //     image,
        //     Math.round(canvasCoordinate.x - Math.round((size * tile.w))/2),
        //     Math.round(canvasCoordinate.y - 2 - Math.round(size * tile.h * distanceHeight)), //!!! comment better explanation for these
        //     Math.round(size * tile.w),//width
        //     Math.round(size * tile.h * distanceHeight),//height
        // );

        //draw image
        context.drawImage(
            image,
            Math.round(canvasCoordinate.x),
            Math.round(canvasCoordinate.y), //!!! comment better explanation for these
            Math.round(size),//width
            Math.round(size * distanceHeight),//height
        );

        // //restore canvas data
        // context.restore();
        
    },

    point(tile,i) {

        context.fillStyle = "#bfbfbf"; //!!!tile.color;

        let canvasCoordinate = RENDER.screenPosition(tile.x,tile.y,tile.z); //!!!maybe boxes should be +0.5 and characters should be normal
        const half = RENDER.fontPx / 25; //!!!could be cached
        canvasCoordinate.x -= half;

        if ( RENDER.isOutlier(tile) ) {
            context.fillStyle = '#e6e6e6';
        }

        context.fillRect(canvasCoordinate.x,canvasCoordinate.y,half*2,half*2); //!!! could be cached as image? debug feature anyways

    },
    
    line(tile1,tile2) {

        context.fillStyle = "black"; //!!!tile.color;

        let canvasCoordinateStart = RENDER.screenPosition(tile1.x,tile1.y,tile1.z); //!!!maybe boxes should be +0.5 and characters should be normal
        let canvasCoordinateEnd = RENDER.screenPosition(tile2.x,tile2.y,tile2.z); //!!!maybe boxes should be +0.5 and characters should be normal

        // if ( RENDER.isOutlier(tile) ) {
        //     context.fillStyle = '#e6e6e6';
        // }

        context.moveTo(canvasCoordinateStart.x, canvasCoordinateStart.y);
        context.lineTo(canvasCoordinateEnd.x, canvasCoordinateEnd.y);
        context.stroke(); //!!! should it wait for the end to stroke?
    },

    solidShape(objects) {

        context.beginPath();
        //context.fillStyle = "cyan"; //!!!tile.color;

        for (i in objects) {

            const screenPoint = RENDER.screenPosition(
                objects[i].x,
                objects[i].y,
                objects[i].z
            );
            

            if (i == 0) {
                context.moveTo(screenPoint.x, screenPoint.y);
            }
            else {
                context.lineTo(screenPoint.x, screenPoint.y);
            }
           
        }

        context.fill();
        context.closePath();

    },

    outlineShape() {

    },

    //draws a shape from vertices
    drawShape: function (vertices) {
        
        context.beginPath();
  
        for (let i = 0; i < vertices.length; i++) {
            const start = vertices[i];
            const end = vertices[(i + 1) % vertices.length];
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
          }
  
        context.stroke();
    },

    drawLine: function (start, end, thickness) {
        context.lineWidth = thickness;
        
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();

        context.lineWidth = 1;
    },

    generateCharacterModel: function(x,y,z,char) { //!!! unfinished

        const underscoreNorthSouth = {
            start: 0,
            end: 0,
        }

    },
    
    generateBox: function (x,y,z,length,width,height) { //!!! could use comments or refactoring

        const points = {
            
            top: {
                front: {
                    left: {x:x,y:y,z:z},
                    right: {x:x+width,y:y,z:z}
                },
                back : {
                    left: {x:x,y:y+length,z:z},
                    right: {x:x+width,y:y+length,z:z}
                }
            },
            
            bottom: {
                front: {
                    left: {x:x,y:y,z:z+height},
                    right: {x:x+width,y:y,z:z+height}
                },
                back : {
                    left: {x:x,y:y+length,z:z+height},
                    right: {x:x+width,y:y+length,z:z+height}
                }
            },
            
        };
        
        const faces = [
            
            [ points.bottom.front.left, points.bottom.front.right, points.bottom.back.right, points.bottom.back.left, points.bottom.front.left ], //bottom
            [ points.top.front.left, points.top.front.right, points.top.back.right, points.top.back.left, points.top.front.left ], //top
            
            [ points.bottom.front.left, points.bottom.front.right, points.top.front.right, points.top.front.left, points.bottom.front.left ], //front
            [ points.bottom.back.left, points.bottom.back.right, points.top.back.right, points.top.back.left, points.bottom.back.left ], //back
            
            [ points.bottom.front.left, points.bottom.back.left, points.top.back.left, points.top.front.left, points.bottom.front.left ], //left
            [ points.bottom.front.right, points.bottom.back.right, points.top.back.right, points.top.front.right, points.bottom.front.right ], //right
            
        ];
        
        const box = {
            points: points,
            faces: faces
        }
        
        return box;
    },
    
    box: function (x,y,z,length,width,height) { //!!! should this use screenPosition?
        
        const faces = RENDER.generateBox(x,y,z,length,width,height).faces;
        
        for (let a = 0; a < faces.length; a++) {
            for (let j = 0; j < faces[a].length; j++) {
                faces[a][j] = RENDER.screenPosition(
                    faces[a][j].x,
                    faces[a][j].y,
                    faces[a][j].z
                );
            }
            RENDER.drawShape(faces[a]);
        }
        
    },
    
    //cursor and selected plane
    selected: function() {
        
        context.fillStyle = "f8f9fa";
        RENDER.solidShape(
            [
                {
                    x: YOU.view.x-(15*4),
                    y: YOU.view.y-(15*4),
                },
                {
                    x: YOU.view.x+(15*4),
                    y: YOU.view.y-(15*4),
                },
                {
                    x: YOU.view.x+(15*4),
                    y: YOU.view.y+(15*4),
                },
                {
                    x: YOU.view.x-(15*4),
                    y: YOU.view.y+(15*4),
                },
            ]
        ); //box

        context.strokeStyle = "#bfbfbf";

        RENDER.box(YOU.view.x-(15*4),YOU.view.y-(15*4),0,2*(15*4),2*(15*4),0); //box


        RENDER.box(YOU.view.x,YOU.view.y+(15*4)-2,0,4,0,0); //notch

        
        //center point, both smooth and jumpy
        let setView = {
            x: Math.round(YOU.view.x),
            y: Math.round(YOU.view.y),
            z: YOU.view.z
        }
        RENDER.point(setView);
        RENDER.point(YOU.view);

        //3d shape
        var polygonArray = [
            {x:setView.x,y:setView.y,z:setView.z},
            {x:setView.x+8,y:setView.y+2,z:setView.z},
            {x:setView.x+8,y:setView.y+2,z:setView.z+8},
            {x:setView.x,y:setView.y,z:setView.z+8},
        ];

        var polygonArrayCenter = [
            {x:0,y:0,z:0},
            {x:8,y:2,z:0},
            {x:8,y:2,z:8},
            {x:0,y:0,z:8},
        ]

        //RENDER.solidShape(polygonArray);
        RENDER.solidShape(polygonArrayCenter);

        context.strokeStyle = "black";//!!!CURSOR.select.color;
        
        RENDER.line(CURSOR.select,{x:0,y:0,z:0});

        //3d cursor
        if (CURSOR.plane.mode == "horizontal") {
            RENDER.box(CURSOR.select.x-0.5,CURSOR.select.y-0.5,CURSOR.select.z,1,1,0.5);
        }
        else if (CURSOR.plane.facing[1] == "y") {
            RENDER.box(CURSOR.select.x-0.5,CURSOR.select.y+0.25-0.5,CURSOR.select.z,0.5,1,1);
        } else {
            RENDER.box(CURSOR.select.x+0.25-0.5,CURSOR.select.y-0.5,CURSOR.select.z,1,0.5,1);
        }
        
        RENDER.box(CURSOR.select.x,CURSOR.select.y,CURSOR.select.z,0,0,-CURSOR.select.z); //!!!kinda hacky cursor line, too thick

        
        if (typeof CURSOR.radiusTiles[0] !== 'undefined') {
            RENDER.drawShape(CURSOR.radiusTiles[CURSOR.radiusTiles.length-1].face);
        }
    },
    
}

window.addEventListener("load", RENDER.setFont); //!!!can this be set to a better format?