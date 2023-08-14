// tiles.js
// handles client side tiles

const TILES = {

    chunkSize: 8,
    chunkRange: 8+1,

    chunks: {
        '0,0': [{char: 'Loading Tiles...', color: 'rgb(0,0,0)', x: 0, y: 0, z: 0}]
    },

    doesChunkExist: function (x,y) { //temporarily needed, because if chunk does not exist on user side it needs to be made on user side

        
        const chunkId = x + "," + y;

        if (TILES.chunks[chunkId]) {
            return true;
          } else {
            TILES.chunks[chunkId] = {};

            

          }
    },

    getTile(x,y,z) {

        const chunkX = Math.floor(x / TILES.chunkSize);
        const chunkY = Math.floor(y / TILES.chunkSize);
        const chunkId = chunkX + "," + chunkY;

        const tileId = x + "," + y + "," + z;
        const tile = TILES.chunks[chunkId][tileId];

        return tile;

    },

    add: function (char) { //create new object
        const x = CURSOR.select.x //eventually this should take an x,y,z as well as a char, not just cursor info
        const y = CURSOR.select.y;
        const z = CURSOR.select.z;
        const color = CURSOR.select.color;

        const chunkX = Math.floor(x / TILES.chunkSize);
        const chunkY = Math.floor(y / TILES.chunkSize);
        const chunkId = chunkX + "," + chunkY;

        if (online) {
            socket.emit("tileUpload", {char:char,color:color,x:x,y:y,z:z});
        }
        else {

            TILES.doesChunkExist(chunkX,chunkY);
            TILES.chunks[chunkId][TILES.chunks[chunkId].length] = {char:char,color:color,x:x,y:y,z:z};
        }

    },

    delete: function () {

    },
    
    break: function () {

        const tile = CURSOR.tile;
        const birdIndex = TILES.array.indexOf(tile);

        TILES.array.splice(birdIndex, 1);

    },
    
    sortByDistance: function(array) {
        
        
        const rotated = RENDER.rotatePoint(0,0,0,30,-RENDER.rotation+180);
        const newPoint = {x:0,y:0};
        newPoint.x = rotated.x;
        newPoint.y = rotated.y
        
        for (let a = 0; a < array.length; a++) {
            array[a].distance = RENDER.distance({x:newPoint.x,y:newPoint.y}, {x:array[a].x,y:array[a].y});
        }
        
        let newArray = array;
        
        //Outer pass
        for(let i = 0; i < newArray.length; i++) {

            //Inner pass
            for(let j = 0; j < newArray.length - i - 1; j++){

                //Value comparison using ascending order

                if(newArray[j + 1].distance > newArray[j].distance){

                    //Swapping
                    [newArray[j + 1],newArray[j]] = [newArray[j],newArray[j + 1]]
                }
                else if (newArray[j + 1].distance == newArray[j].distance && newArray[j + 1].z < newArray[j].z) {
                    //Swapping
                    [newArray[j + 1],newArray[j]] = [newArray[j],newArray[j + 1]]
                }
            }
        }
        
        array = newArray;
        
    },
    
}