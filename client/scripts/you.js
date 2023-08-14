// you.js
// handles player information
// currently this is just their coordinates
// eventually it will be username, inventory, stats, etc


const PLAYER = new ITEMS.class.Backpack();
PLAYER.contains[0] = new ITEMS.class.Toothbrush();

PLAYER.contains[3] = new ITEMS.class.Backpack();

const YOU = {

    coords: {
        x:0,
        y:0,
        z:0,
    },

    view: { //currently only client side
        x:0,
        y:0,
        z:0
    },

    target: {
        x:0,
        y:0,
        z:0
    },

    health: 100,
    stamina: 100,
    hunger: 100,

    meals: 24,
    
    loadedChunks: ["0|0"],
    
    move: function (x,y) {

        x = Math.floor(YOU.view.x / TILES.chunkSize);
        y = Math.floor(YOU.view.y / TILES.chunkSize);

        YOU.loadedChunks = [];

        for (let i = x-TILES.chunkRange+1; i < x+TILES.chunkRange; i++) {
            for (let j = y-TILES.chunkRange+1; j < y+TILES.chunkRange; j++) {
                YOU.loadedChunks[YOU.loadedChunks.length] = i + "," + j;
            }
        }


        if (x > 0) {
            x = "+" + x;
        }

        if (y > 0) {
            y = "+" + y;
        } 

        document.getElementById("coordinates").innerHTML = "" + x + ", " + y;
        
    },
    
    moveReal() {
        if (YOU.coords.x < YOU.target.x) {
            YOU.coords.x+= 0.1;
        }
        if (YOU.coords.x > YOU.target.x) {
            YOU.coords.x-= 0.1;
        }
        if (YOU.coords.y < YOU.target.y) {
            YOU.coords.y+= 0.1;
        }
        if (YOU.coords.y > YOU.target.y) {
            YOU.coords.y-= 0.1;
        }

        //YOU.stamina--;
        RENDER.update();
        
    },

    setTarget(newTarget) {
        YOU.target.x = newTarget.x;
        YOU.target.y = newTarget.y;
        YOU.target.z = newTarget.z;
    }
}

setInterval(function() {
    
    socket.emit('moveUpload', {x:YOU.coords.x, y:YOU.coords.y});
    
}, 1000);

setInterval(function() {
    
    YOU.moveReal();
    
}, 1000 / 8 / 10);