// cursor.js
// handles the 3D selection cursor
// NOT to be confused with the COMPUTER cursor, which is handled by mouse.js

const CURSOR = {
    
    select: {x:0, y:0, z:0, color: "rgb(232,236,251)"},
    enterSelect: {x:0, y:0, z:0},

    plane: { //what is plane?
        mode: "horizontal", //can these be made more intuitive?
        facing: "+y"
    },
    
    tilesWithinRadius: [], //what is withinRadius?
    
    radiusFaces: [], //what is radiusFaces?
    radiusTiles: [], //what is radiusTiles? how is it different than withinRadius?
    
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

        if (MOUSE.hasMoved) {

            CURSOR.tilesWithinRadius = CURSOR.getTilesWithinMouseRadius(MOUSE.position);

            CURSOR.getTilesFaces(MOUSE.position,CURSOR.tilesWithinRadius);

            CURSOR.plane.facing = MOUSE.facing;
            MOUSE.hasMoved = false;
        }
        
    },
    
    selectTile: function (tile) {
        
        let selected = {};

        if (tile !== undefined) {
            selected.x = tile.x;
            selected.y = tile.y;
            selected.z = tile.z;
            selected.char = tile.char;

            //CURSOR.plane.mode = MOUSE.mode;
            //CURSOR.plane.facing = MOUSE.facing;
            
            CURSOR.correctSelect();
        }

        return selected;
        
    },
    
    correctSelect: function () { //keep 3D cursor in bounds
        
       if (CURSOR.select.z < 0) {
           CURSOR.select.z = 0;
       }

       const flooredX = Math.floor(YOU.coords.x);
       const flooredY = Math.floor(YOU.coords.y);

       //the rest of these moves you
       if (CURSOR.select.z > 64) {
           CURSOR.select.z = 64;
       }
       if (CURSOR.select.x == flooredX - 60) {
           YOU.coords.x -= 1;
       }
       if (CURSOR.select.x == flooredX + 60) {
        YOU.coords.x += 1;
       }
       if (CURSOR.select.y == flooredY - 60) {
        YOU.coords.y -= 1;
       }
       if (CURSOR.select.y == flooredY + 60) {
        YOU.coords.y += 1;
       }
        
    },
    
    moveSelect: function (x,y) {
        let offset = [0,0,0];
        let xAxis = {num:0,posneg:1}; //i hate posneg as a variable name, but I don't feel like dealing with this rn
        let yAxis = {num:0,posneg:1};

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
    
    getTilesWithinMouseRadius: function (click) {
        // click will be {x:_,y:_}
        
        const radius = RENDER.fontPx * 1.5; //!!! explain
        
        let tilesWithinRadius = [];
        
        for (let i in TILES.chunks) {
            for (let j in TILES.chunks[i]) {
                const tile = TILES.chunks[i][j];
                let tilePos = RENDER.screenPosition(tile.x,tile.y,tile.z); //!!!are tiles stored somewhere already as objects with their screenPosition? can their screenpos be added to their object to optomize this? could it be chunked instead of sorting through everything?
                
                let point = {
                    x: tilePos.x,
                    y: tilePos.y + 8 //why plus 8?
                };

                const isInsideRenderDistance = Math.abs(tile.x-YOU.view.x) < 60 && Math.abs(tile.y-YOU.view.y) < 60; //60 is render distance
                const isInsideRadius = RENDER.distance(click, point) < radius;
                
                if (isInsideRenderDistance && isInsideRadius) {
                    
                    tilesWithinRadius[tilesWithinRadius.length] = tile;
                }
            }
        }

        //detect radius
        // for (i = TILES.array.length-1; i >= 0; i--) { 
        //     //what does this do
        // }

        return tilesWithinRadius;
        
    },
        
    getTilesFaces: function (click, tiles) {

        CURSOR.radiusFaces = [];
        CURSOR.radiusTiles = [];
        
        for (i = 0; i < tiles.length; i++) { //sort through tiles
            
            for (j = 5; j >= 0; j--) { //sort through faces?
                
                //this code somehow figures out the priority for which face of a tile should be shown if multiple overlap. IDK how it works at all.
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
                
                //I left this comment as a guide, I have no idea what it means:
                //f0 top
                //f1 bottom (skip)
                //f2 south
                //f3 north
                //f4 west
                //f5 east
                
                let hover = tiles[i];

                let face = RENDER.generateBox(hover.x-0.5,hover.y-0.5,hover.z,1,1,1).faces[j]; //!!!j is not always the right face, it glitches sometimes

                for (a = 0; a < face.length; a++) {
                    face[a] = RENDER.screenPosition(face[a].x,face[a].y,face[a].z);
                }

                //detect if in face
                let inside = CURSOR.rayCasting(click, face);

                //push face
                if (inside) {
                    CURSOR.radiusFaces[CURSOR.radiusFaces.length] = face;
                    
                    hover.face = face;
                    
                    CURSOR.radiusTiles[CURSOR.radiusTiles.length] = hover;
                }
            }
            
        }

        if (CURSOR.radiusTiles.length == 0) {
            
        }

        TILES.sortByDistance(CURSOR.radiusTiles); //does this need to be done? if they're already being sorted by distance? A: yes, perhaps because of decimal offset
    },

    getFloorTile: function (click, face, gridResolution) {
        
        face = RENDER.generateBox(YOU.view.x-(15*4),YOU.view.y-(15*4),0,2*(15*4),2*(15*4),0).faces[0]; //!!! could be precalculated

        // Calculate the sides of the parallelogram
        const p1 = RENDER.screenPosition(face[0].x,face[0].y,face[0].z);
        const p2 = RENDER.screenPosition(face[1].x,face[1].y,face[1].z);
        const p3 = RENDER.screenPosition(face[2].x,face[2].y,face[2].z);
        const p4 = RENDER.screenPosition(face[3].x,face[3].y,face[3].z);

        const side1 = { x: p2.x - p1.x, y: p2.y - p1.y };
        const side2 = { x: p4.x - p1.x, y: p4.y - p1.y };

        // Calculate the transformation matrix from parallelogram to rectangle
        const transformMatrix = [
            [side1.x, side2.x],
            [side1.y, side2.y]
        ];

        // Invert the transformation matrix
        const inverseMatrix = CURSOR.invertMatrix(transformMatrix);
    
      
        // Calculate the click position relative to the parallelogram origin
        const relativeX = click.x - p1.x;
        const relativeY = click.x - p1.y;
      
        // Apply the inverse transformation to get the click position in the parallelogram's coordinate system
        const transformedX =
            inverseMatrix[0][0] * relativeX + inverseMatrix[0][1] * relativeY;
        const transformedY =
            inverseMatrix[1][0] * relativeX + inverseMatrix[1][1] * relativeY;

        // Calculate the cell dimensions
        const cellWidth = Math.sqrt(side1.x ** 2 + side1.y ** 2) / gridResolution;
        const cellHeight = Math.sqrt(side2.x ** 2 + side2.y ** 2) / gridResolution;

        // Calculate the click position in terms of grid cells
        const cellX = Math.floor(transformedX / cellWidth);
        const cellY = Math.floor(transformedY / cellHeight);

        console.log(cellX,cellY);

        return { x: cellX, y: cellY };
      },
      invertMatrix: function (matrix) {
        const determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        const inverseMatrix = [
          [matrix[1][1] / determinant, -matrix[0][1] / determinant],
          [-matrix[1][0] / determinant, matrix[0][0] / determinant]
        ];
        return inverseMatrix;
      },
    
    rayCasting: function (point, polygon){ //github.com/isedgar/1f5c5b4cf34a43d4db15f9b4fe58b04f

        //point: {"x":212,"y":31}
        //polygon: [{"x":1058...,"y":172...,"s":9...},{"x":1101...,"y":172...,"s":1...},{"x":1101...,"y":215...,"s":10...},{"x":1058...,"y":215...,"s":9...},{"x":1...,"y":172...,"s":9...}]

        let n=polygon.length,
            is_in=false,
            x=point.x,
            y=point.y,
            x1,x2,y1,y2;

        for(let i=0; i < n-1; ++i){
            x1=polygon[i].x;
            x2=polygon[i+1].x;
            y1=polygon[i].y;
            y2=polygon[i+1].y;

            if(y < y1 != y < y2 && x < (x2-x1) * (y-y1) / (y2-y1) + x1) {
                is_in=!is_in;
            }
        }

        return is_in;
    },
}