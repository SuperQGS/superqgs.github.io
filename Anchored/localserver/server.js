var SERVER = {
    
    types: [
        
        //player
        {id: "player", char: "&", color: 0},
        {id: "type2build", char: "+", color: 0},
        
        //alien
        {id: "monument", char:"▋", color:8},
        {id: "worldedge", char:"░", color:8},
        
        //nature
        {id: "grass", char: ",", color: 5},
        {id: "tree", char: "t", color: 3},
        {id: "water", char: "w", color: 7},
        {id: "mountain", char: "M", color: 9},
        {id: "swamp", char: "~", color: 6},
        {id: "island", char: ".", color: 4},
        
        //human
        {id: "house", char: "H", color: 4},
        {id: "city", char: "C", color: 6},
    ],
    
    //players
    
    //chunks
    rain() {
        
        for (i = 0; i < TILES.array.length; i++) {
            var tile = TILES.array[i];
            if (tile.char == "," && tile.color == "#4E78C4") {
                RENDER.update();
                
                TILES.array[i].z -= 1;
                if (tile.z < 0) {
                    //playSound("rain");
                    TILES.array[i].z = 0;
                    TILES.array[i].char = "_";
                    TILES.array[i].dry = 0;
                }
                for (j = 0; j < TILES.array.length; j++) {
                    var tile2 = TILES.array[j]
                    if (tile != tile2 && tile.x == tile2.x && tile.y == tile2.y && tile.z == tile2.z) {
                        
                        if (tile2.char == "_" && tile2.color == "#4E78C4") {
                            
                            TILES.array.splice(i, 1);
                            
                        } else {
                            TILES.array[i].z += 1;
                            TILES.array[i].char = "_";
                            TILES.array[i].dry = 0;
                        }
                        
                        
                    }
                }
                
                
            }
            else if (tile.char == "@" && tile.color == "#E8ECFB") {
                RENDER.update();
                TILES.array[i].z -= 0.01;
                if (tile.z < 30) {
                    TILES.array[i].z = 30;
                    TILES.array[i].char = "Z";
                    TILES.array[i].color = "#D0B541";
                }
            }
            else if (tile.char == "Z" && tile.color == "#D0B541") {
                RENDER.update();
                TILES.array.splice(i, 1);
            }
            else if (tile.char == "_" && tile.color == "#4E78C4") {
                TILES.array[i].dry += 1;
                if (tile.dry > 60) {
                    RENDER.update();
                    TILES.array.splice(i, 1);
                }
            }
        }
    },
    
    rainDrop() {
        
        var cloudSize = 1;
        
        var x = Math.floor(Math.random() * 31*cloudSize) - 15*cloudSize;
        var y = Math.floor(Math.random() * 31*cloudSize) - 15*cloudSize;
        var z = Math.floor(Math.random() * 5) + 32;;
        
        TILES.array[TILES.array.length] = {x:x,y:y,z:z,char:",",color:"#4E78C4"}
        TILES.array[TILES.array.length] = {x:x,y:y,z:z,char:"@",color:"#E8ECFB"}
    }
    
}