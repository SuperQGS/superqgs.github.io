//menu.js
//stuff for the right click context menu

//listeners: contextmenu, click
document.addEventListener("contextmenu", function(event) { event.preventDefault(); }); //prevent default right click menu

function createContextMenu(event) {

  let contextMenu = document.getElementById("context-menu");
  contextMenu.style.left = event.clientX + "px";
  contextMenu.style.top = event.clientY + "px";
  contextMenu.style.display = "block";

}

function removeContextMenu() {
  let contextMenu = document.getElementById("context-menu");
  contextMenu.style.display = "none";
}

const MENU = {
    select: {x:0, y:0, z:0, char: ""},

    moveHere: function() {
      YOU.setTarget(MENU.select);
    }


  }