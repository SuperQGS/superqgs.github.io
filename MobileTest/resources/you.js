// you.js
// handles player information
// currently this is just their coordinates
// eventually it will be username, inventory, stats, etc

var YOU = {
    
    x:0,
    y:0,
    z:0,
    
    target: {
        x: 0,
        y: 0,
        z: 0
    },
    
    
    move: function (x,y,z) {
        if (YOU.x < x) {
            YOU.x += 0.1;
        }
        if (YOU.x > x) {
            YOU.x -= 0.1;
        }
        if (YOU.y < y) {
            YOU.y += 0.1;
        }
        if (YOU.y > y) {
            YOU.y -= 0.1;
        }
        
    }
}