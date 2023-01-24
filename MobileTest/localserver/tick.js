var TICK = {
    
    ticksPerSecond: 20,
    millisecondsPerTick: 50,
    
    currentTick: 0,
    
    
    
    tick: function () {
        //update position and velocity of entities
        
        //check and resolve collisions between entities (and blocks?) (do I even have "entities"?)
        
        //update the state of blocks
        
        //update the state of weather and lighting
        TICK.currentTick += 1;
        
        //run any scheduled tasks
        
        //check for & resolve player actions (breaking blocks, placing blocks)
        
        //update client-side user interface
        
        //send update to players
    }
}


//DB

//okay, so there's a 3d array and a 1d array for each chunk. a Chunk might be 16*16*16 maybe

//the 1d array contains all of the tiles and their information

//the 3d array is an index to the 1d array

//when something on the 1d array changes, just make sure it also changes the index at the same time

//then, you can sort through



//i think that's probably bs



//what about sparse arrays. First, there are chunks. They are 16x16
//inside the chunks, there are sparse arrays that represent a vertical column
//this way maybe you could sort through everything easier? maybe? I think this might be a winner.