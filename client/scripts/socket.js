
const online = true;
const socket = io('https://typetobuild.com');
//const socket = io('http://localhost:80');

socket.on('worldDownload', worldChunks => {

  if (online) {
    TILES.chunks = worldChunks;
  }
  
  RENDER.update();

});

socket.on('tileDownload', tile => {

  const chunkX = Math.floor(tile.x / TILES.chunkSize);
  const chunkY = Math.floor(tile.y / TILES.chunkSize);
  const chunkId = chunkX + "," + chunkY;
  TILES.doesChunkExist(chunkX,chunkY);

  const tileId = tile.x + "," + tile.y + "," + tile.z;
  TILES.chunks[chunkId][tileId] = tile;

  RENDER.update();

});

socket.on('deletionDownload', data => {

  delete TILES.chunks[data.chunkId][data.tileId];

  RENDER.update();

});

socket.on('rubberBand', coords => {
  //YOU.coords.x = coords.x;
  //YOU.coords.y = coords.y;
});