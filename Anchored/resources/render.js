// render.js
// handles rendering of all sorts
// also handles rotation, distance, and box code

var RENDER = {    
    
    //perspective vars
    tileRes: 30,
    fontPx: worldCanvas.height / 15, //30
    rotation: 0,
    tilt: 1,
    renderTilt: 1,
    curve: 2,
    
    //optimization
    override: false,
    essentialFrame: true,
    frame: 0,
    lasttilt: 1,
    lastrotation: 0,
    
    //main
    main: function() {
        
        if (RENDER.optimized()) {
            
            TILES.sortByDistance(TILES.array);
            
            RENDER.setFont();
            RENDER.setupFrame();
            RENDER.tiltPerspective();
            RENDER.objects();
            RENDER.selected();
            RENDER.UI();
            DEBUG.drawScreen();
            
        }
        
    },
    
    //stops unneccesary frames
    optimized: function () {
        if (RENDER.essentialFrame || RENDER.override) {
            RENDER.essentialFrame = false;
            return true;
        }
    },
    
    update: function () {
        RENDER.essentialFrame = true;
    },
    
    //matches font with tile resolution
    setFont: function () {
        fontPx = worldCanvas.height / RENDER.tileRes;
        context.font = RENDER.fontPx + "px Courier New";
    },
    
    //clears canvas and tracks changes for performance
    setupFrame: function () {
        RENDER.frame++;
        RENDER.lasttilt = RENDER.tilt;
        RENDER.lastrotation = RENDER.rotation;
        
        context.clearRect(0, 0, worldCanvas.width, worldCanvas.height); //clear canvas
    },
    
    //this function makes tilting smooth, may not be optimized.
    tiltPerspective: function () {
        var newtilt = 1;
        var tiltacc = 1;
        for (i = 1; i < RENDER.tilt; i++) {
            newtilt += Math.pow(newtilt,tiltacc)/100; //increase newtilt by itself to the power of tiltacc, then divided by 100
            tiltacc += 0.01;
        }
        RENDER.renderTilt = newtilt;
    },
    
    //rotates a point around an origin with an angle
    rotate: function (centerX, centerY, x, y, angle) {
        var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        newX = (cos * (x - centerX)) + (sin * (y - centerY)) + centerX,
        newY = (cos * (y - centerY)) - (sin * (x - centerX)) + centerY;
        return [newX, newY];
    },
    
    //returns the 2d XY of 3d coordinates
    screenPos: function (x,y,z) {
        
        var trueCenter = 0.5; //0.5 to truly center everything
        
        var rotated = RENDER.rotate(0,0,x-trueCenter,y-trueCenter,RENDER.rotation);
        
        var rotatedX = rotated[0];
        var rotatedY = -rotated[1]; 
        var halfX = worldCanvas.width / 2;
        var halfY = worldCanvas.height / 1.5;
        
        
        var distance = RENDER.distance({x:0,y:0},{x:x,y:y});
        
        var screenX = halfX + (rotatedX * RENDER.fontPx/1.5);
        var screenY = halfY + (rotatedY / (RENDER.renderTilt) - z-trueCenter) * RENDER.fontPx/1.5;
        
        
        
        screenY += 0.005 * Math.pow(distance, RENDER.curve);        
        
        return {x:screenX,y:screenY,s:distance};
        
    },
    
    //gets distance between 2 spoints
    distance: function (point1, point2) {
      var distanceX = point1.x - point2.x;
      var distanceY = point1.y - point2.y;
      return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
    },

    //a single character
    character: function (tile,i) {
        
        var newXY = RENDER.screenPos(tile.x+0.5,tile.y+0.5,tile.z);
        
        var half = context.measureText(tile.char).width / 2;
        newXY.x -= half;
        
        context.fillStyle = tile.color;
        
        context.font = RENDER.fontPx - (newXY.s/5) + "px Courier"; //temporary, changes font to smaller
        
        
        
        var newChar = tile.char;
        
        
        if ((RENDER.fontPx - (newXY.s/5)) < 0) {
            context.font = "0px Courier";
        }
        
        context.fillText( //draw
            newChar, //character
            newXY.x, //x canvas coordinate !!!should describe fields better
            newXY.y //y canvas coordinate
        );
    
    },
    
    //all objects
    objects: function () {
        
        for (i = 0; i < TILES.array.length; i++) { //sort through the objects
            var trueTile = TILES.array[i]; //define tile

            var tile = {
                x: YOU.x + trueTile.x,
                y: YOU.y + trueTile.y,
                z: YOU.z + trueTile.z,
                char: trueTile.char,
                color: trueTile.color
            }

            if (tile.char == "box") {
                context.strokeStyle = tile.color;
                RENDER.box(tile.x,tile.y,tile.z,1,1,1);
            } else {
                RENDER.character(trueTile,i);
            }
        }
    },
    
    UI: function () {
        context.fillStyle = CURSOR.colors[0];
        context.font = 60 + "px Courier New";
        context.fillText(YOU.x,20,60);
        
        context.font = 15 + "px Courier New";
    },
    
    //draws a shape from vertices
    drawFace: function (vertices) {
        
        context.beginPath();
  
        for (var i = 0; i < vertices.length; i++) {
            var start = vertices[i];
            var end = vertices[(i + 1) % vertices.length];
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
          }
  
        context.stroke();
    },
    
    generateBox: function (x,y,z,length,width,height) {
        
        var points = {
            
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
        
        var faces = [
            
            [ points.bottom.front.left, points.bottom.front.right, points.bottom.back.right, points.bottom.back.left, points.bottom.front.left ], //bottom
            [ points.top.front.left, points.top.front.right, points.top.back.right, points.top.back.left, points.top.front.left ], //top
            
            [ points.bottom.front.left, points.bottom.front.right, points.top.front.right, points.top.front.left, points.bottom.front.left ], //front
            [ points.bottom.back.left, points.bottom.back.right, points.top.back.right, points.top.back.left, points.bottom.back.left ], //back
            
            [ points.bottom.front.left, points.bottom.back.left, points.top.back.left, points.top.front.left, points.bottom.front.left ], //left
            [ points.bottom.front.right, points.bottom.back.right, points.top.back.right, points.top.front.right, points.bottom.front.right ], //right
            
        ];
        
        var box = {
            points: points,
            faces: faces
        }
        
        return box;
    },
    
    box: function (x,y,z,length,width,height) {
        
        var faces = RENDER.generateBox(x,y,z,length,width,height).faces;
        
        for (a = 0; a < faces.length; a++) {
            for (j = 0; j < faces[a].length; j++) {
                faces[a][j] = RENDER.screenPos(
                    faces[a][j].x,
                    faces[a][j].y,
                    faces[a][j].z
                );
            }
            RENDER.drawFace(faces[a]);
        }
        
    },
    
    //cursor and selected plane
    selected: function() {
        
        context.strokeStyle = CURSOR.select.color;
        
        //3d cursor
        RENDER.box(CURSOR.select.x,CURSOR.select.y,CURSOR.select.z,1,1,1);   
        
        if (typeof CURSOR.radiusTiles[0] !== 'undefined') {
            RENDER.drawFace(CURSOR.radiusTiles[CURSOR.radiusTiles.length-1].face);
        }
        
        context.strokeStyle = '#E8ECFB';
        
        if (CURSOR.plane.mode == "horizontal") {
            
            RENDER.box(-15,-15,CURSOR.select.z,31,31,1);
        }
        
        else if (CURSOR.plane.mode == "vertical") {
            
            if (CURSOR.plane.facing[1] == "y") {
                
                RENDER.box(-15,CURSOR.select.y,0,1,31,31);
                
            } else if (CURSOR.plane.facing[1] == "x") {
                
                RENDER.box(CURSOR.select.x,-15,0,31,1,31);
                
            }
        }
    },
    
}