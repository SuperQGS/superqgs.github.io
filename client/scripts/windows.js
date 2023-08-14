//popup window system

const WINDOWS = {

    list: {},

    exit: function(id) {
        const element = document.getElementById(id);
        const tab = document.getElementById(id + "Tab");
        element.classList.remove("show");
        tab.remove();

        setTimeout(function() {
            element.remove();
        }, 100);
    },

    minimize: function(id) {
        const element = document.getElementById(id);
        const tab = document.getElementById(id + "Tab");
        element.classList.remove("show"); //eventually this could be different animation that shows minimizing better
        tab.setAttribute('onclick', 'WINDOWS.maximize("' + id + '")');

        setTimeout(function() {
            element.style.display = "none";
        }, 100);
    
    },

    maximize: function(id) {
        const element = document.getElementById(id);
        const tab = document.getElementById(id + "Tab");
        element.style.display = "";
        tab.setAttribute('onclick', 'WINDOWS.minimize("' + id + '")');
        
    
        setTimeout(function() {
            element.classList.add("show"); //eventually this could be different animation that shows maximizing better
        }, 1);
    },

    direct: function(element, elementTab, object) { //!!!could just take window's id? and object ofc
        
        //tab
        //* elementTab.innerHTML = '<img src="imgs/dust/' + object.icon + '.png"> '; //!!!could have the item icon before
        elementTab.innerHTML = object.name; //!!!part of direct?
        
        //address bar

        //? get forwards
        //? get backwards
        //? apply forwards & backwards. Make it not blank and selectable.
        //? if one doesn't have one, make that blank and unselectable

        //get current directory
        const name = object.name;
        //get names of all parent folders into an array //!!!getting a parent object from just the object is IMPOSSIBLE. Maybe parent can be tracked in obj itself?

        const addressString = "";
        //HIGHER DIR: <span class="inventoryDirectoryField selectable" onclick="WINDOWS.direct()"><i>HigherDir</i></span>
        //DIVIDER: <span class="inventoryDirectoryField">›</span>
        //CURRENT DIR (bolded)
        //addressString += '<span class="inventoryDirectoryField selectable" onclick="WINDOWS.direct()"><i><b>CurrentDir</b></i></span>'
        //^^v clone instead
        //^get templates by cloning

        //modify each template during the process somehow
        //add each dir with dividers in between, then bold the last dir

        //element.querySelector('.inventoryAddress').innerHTML = addressString;


        //sidebar
        //!!!TODO make functional

        //contents
        //!!! should detect if folder is a list or grid folder
        //list

        //<div class="inventoryListItem"><img src="imgs/dust/backpack.png"> <b>Test Item</b></div>
        
        // let itemsString = "";
        // for (let i in object.contains) {

        //     let item = object.contains[i];

        //     if (item == 0) {
        //         //itemsString += container.slots[i].icon; //!!!shot slot background icon if there is one 
        //     } else {
        //         //create a new item element
        //         itemsString += '<div class="inventoryListItem"><img src="imgs/dust/' + item.icon + '.png"><b> ' + item.name + '</b></div>';
        //     }
        // }
        // element.querySelector('.inventoryList').innerHTML = itemsString;
    
    },

    dNum:0, //window number //!!!temporary

    build: function(object) { //this will take an inventory object as an input, and create a new window with it's contents
        
        //grab templates
        const template = document.querySelector('#inventoryTemplate');
        const tabTemplate = document.querySelector('#inventoryTemplateTab');
        
        //clone templates
        const element = template.cloneNode(true);
        const elementTab = tabTemplate.cloneNode(true);

        //set id's
        const id = "window" + WINDOWS.dNum;
        const tabId = "tab" + WINDOWS.dNum;
        element.id = id;
        elementTab.id = id + "Tab";
        //update number of windows //!!! ^this could be replace with the length of WINDOWS.list
        WINDOWS.dNum++;

        //enable dragging
        WINDOWS.makeElementDraggable(element);

        //exit & minimize onclick
        element.querySelector('.inventoryMinimize').setAttribute('onclick', 'WINDOWS.minimize("' + id + '")');
        element.querySelector('.inventoryExit').setAttribute('onclick', 'WINDOWS.exit("' + id + '")');
        //tab minimize onclick
        elementTab.setAttribute('onclick', 'WINDOWS.minimize("' + id + '")');

        //customize window to object
        WINDOWS.direct(element,elementTab,object);

        //append new window to windows div
        const container = document.querySelector('#windows');
        container.appendChild(element);

        //append new tab to minimizedTabs div
        const tabContainer = document.querySelector('#minimizedTabs');
        tabContainer.appendChild(elementTab);
        
    },


    //WINDOW DRAGGING
    //!!! could be made WAY better with https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
    makeElementDraggable: function(element) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(element.id + "Header")) {
            /* if present, the header is where you move the DIV from:*/
            document.getElementById(element.id + "Header").onmousedown = function(e) {
                WINDOWS.mouseDownOnElement(e, element);
            };
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            element.onmousedown = function(e) {
                WINDOWS.mouseDownOnElement(e, element);
            };
        }
    },

    mouseDownOnElement: function (e,element) {

        element.style.zIndex = "" + RENDER.frameCounter; //should be counted more efficiently

        movingWindow = true;
        //e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = function() {
            WINDOWS.closeDragElement();
        };
        //call a function whenever the cursor moves:
        document.onmousemove = function(e) {
            WINDOWS.moveElementWithMouse(e, element);
        };
    },

    moveElementWithMouse: function (e,element) {
        //e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    },

    closeDragElement: function () {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
        movingWindow = false;
    }
}


//window id's to add. make sure header id's are the same in the HTML, but followed by "Header"
WINDOWS.makeElementDraggable(document.getElementById("holding"));
WINDOWS.makeElementDraggable(document.getElementById("optionsMenu"));