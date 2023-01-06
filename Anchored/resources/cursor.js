// cursor.js
// handles the selection cursor

var CURSOR = {
    
    select: {x:0, y:0, z:0, color: "rgb(232,236,251)"},

    plane: {
        mode: "horizontal",
        facing: "+y"
    },
    
    withinRadius: [],
    
    radiusFaces: [],
    radiusTiles: [],
    
    //should this eventually be in a different file?
    colors: [ //https://waterdata.usgs.gov/blog/tolcolors/ 
        "rgb(232,236,251)", //1
        "rgb(206, 34, 32)", //2
        "rgb(230, 127, 51)", //3
        "rgb(208, 181, 65)", //4
        "rgb(126, 184, 117)", //5
        "rgb(87, 162, 172)", //6
        "rgb(78, 120, 196)", //7
        "rgb(130, 77, 153)", //8
        "rgb(185, 151, 199)", //9
        "rgb(82, 26, 19)" //0
    ],
    
    main () {
        if (MOUSE.moved) {
            CURSOR.detectRadius(MOUSE.position);
            MOUSE.moved = false;
        }
        
    },
    
    selectTile: function (tile) {
        
        CURSOR.select.x = tile.x;
        CURSOR.select.y = tile.y;
        CURSOR.select.z = tile.z;

        CURSOR.plane.mode = MOUSE.mode;
        CURSOR.plane.facing = MOUSE.facing;
        
        CURSOR.correctSelect();
    },
    
    correctSelect: function () { //keep selected in bounds
        
        if (CURSOR.select.z < 0) {
            CURSOR.select.z = 0;
        }
        if (CURSOR.select.z > 30) {
            CURSOR.select.z = 30;
        }
        if (CURSOR.select.x < -15) {
            CURSOR.select.x = -15;
        }
        if (CURSOR.select.x > 15) {
            CURSOR.select.x = 15;
        }
        if (CURSOR.select.y < -15) {
            CURSOR.select.y = -15;
        }
        if (CURSOR.select.y > 15) {
            CURSOR.select.y = 15;
        }
        
    },
    
    moveSelect: function (x,y) {
        var offset = [0,0,0];
        var xAxis = {num:0,posneg:1};
        var yAxis = {num:0,posneg:1};

        if (CURSOR.plane.mode == "vertical") {
            if (CURSOR.plane.facing == "+y") {
                xAxis.num = 0;
                xAxis.posneg = 1;
                yAxis.num = 2;
                yAxis.posneg = 1;
            }
            else if (CURSOR.plane.facing == "-y") {
                xAxis.num = 0;
                xAxis.posneg = -1;
                yAxis.num = 2;
                yAxis.posneg = 1;
            }
            if (CURSOR.plane.facing == "+x") {
                xAxis.num = 1;
                xAxis.posneg = -1;
                yAxis.num = 2;
                yAxis.posneg = 1;
            }
            else if (CURSOR.plane.facing == "-x") {
                xAxis.num = 1;
                xAxis.posneg = 1;
                yAxis.num = 2;
                yAxis.posneg = 1;
            }
        }
        else if (CURSOR.plane.mode == "horizontal") {
            if (CURSOR.plane.facing == "+y") {
                xAxis.num = 0;
                xAxis.posneg = 1;
                yAxis.num = 1;
                yAxis.posneg = 1;
            }
            else if (CURSOR.plane.facing == "-y") {
                xAxis.num = 0;
                xAxis.posneg = -1;
                yAxis.num = 1;
                yAxis.posneg = -1;
            }
            if (CURSOR.plane.facing == "+x") {
                xAxis.num = 1;
                xAxis.posneg = -1;
                yAxis.num = 0;
                yAxis.posneg = 1;
            }
            else if (CURSOR.plane.facing == "-x") {
                xAxis.num = 1;
                xAxis.posneg = 1;
                yAxis.num = 0;
                yAxis.posneg = -1;
            }
        }

        offset[xAxis.num] = x * xAxis.posneg;
        offset[yAxis.num] = y * yAxis.posneg;

        CURSOR.select.x += offset[0];
        CURSOR.select.y += offset[1];
        CURSOR.select.z += offset[2];

        CURSOR.correctSelect();
    },
    
    detectRadius: function (click) {
        // click will be {x:_,y:_}
        
        var radius = RENDER.fontPx * 1.5; // explain
        
        CURSOR.withinRadius = []; // list of tiles within radius of mouse
        CURSOR.radiusFaces = [];
        CURSOR.radiusTiles = [];
        
        //detect radius
        for (i = TILES.array.length-1; i >= 0; i--) {
            
            var tile = TILES.array[i];
            var tilePos = RENDER.screenPos(tile.x+0.5,tile.y+0.5,tile.z+0.5);
            
            var point = {
                x: tilePos.x,
                y: tilePos.y + 8
            };
            
            if (RENDER.distance(click, point) < radius) {
                
                CURSOR.withinRadius[CURSOR.withinRadius.length] = tile;
            }
        }
        
        
        //-----------------------
        
        

        
        
        //get faces
        for (i = 0; i < CURSOR.withinRadius.length; i++) { //sort through tiles in radius
            
            for (j = 5; j >= 0; j--) {
                
                //f0 top
                //f1 bottom (skip)
                //f2 south
                //f3 north
                //f4 west
                //f5 east
                
                if (j == 5 && (MOUSE.altFacing == 2 || MOUSE.altFacing == 3)) {
                    j--;
                }
                if (j == 4 && (MOUSE.altFacing == 0 || MOUSE.altFacing == 1)) {
                    j--;
                }
                if (j == 3 && (MOUSE.altFacing == 0 || MOUSE.altFacing == 3)) {
                    j--;
                }
                if (j == 2 && (MOUSE.altFacing == 1 || MOUSE.altFacing == 2)) {
                    j--;
                }
                if (j == 1) {
                    j--;
                }
                
                var hover = CURSOR.withinRadius[i];
            
                var face = RENDER.generateBox(hover.x,hover.y,hover.z,1,1,1).faces[j];

                for (a = 0; a < face.length; a++) {
                    face[a] = RENDER.screenPos(face[a].x,face[a].y,face[a].z);
                }

                //detect if in face
                var inside = CURSOR.rayCasting(click, face);

                //push face
                if (inside) {
                    CURSOR.radiusFaces[CURSOR.radiusFaces.length] = face;
                    
                    hover.face = face;
                    
                    CURSOR.radiusTiles[CURSOR.radiusTiles.length] = hover;
                }
            }
            
        }
        
        TILES.sortByDistance(CURSOR.radiusTiles); //does this need to be done? if they're already being sorted by distance?
    },
    
    rayCasting: function (point, polygon){ //github.com/isedgar/1f5c5b4cf34a43d4db15f9b4fe58b04f
        var n=polygon.length,
            is_in=false,
            x=point.x,
            y=point.y,
            x1,x2,y1,y2;

        for(var i=0; i < n-1; ++i){
            x1=polygon[i].x;
            x2=polygon[i+1].x;
            y1=polygon[i].y;
            y2=polygon[i+1].y;

            if(y < y1 != y < y2 && x < (x2-x1) * (y-y1) / (y2-y1) + x1){
                is_in=!is_in;
            }
        }

        return is_in;
    },
}