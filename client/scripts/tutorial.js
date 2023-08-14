// tutorial.js
// handles button prompts

const TUTORIAL = {

    hint: {
        icon: "ⓘ",
        rightDrag: "Right Click and Drag to look around.",
        leftDrag: "⚠️ Left Click and Drag to move. ⚠️",
        typeToBuild: "⚠️ Type to build. ⚠️",
        arrowKeys: "⚠️ Use Arrow Keys to move the cursor. ⚠️",
        toggledAlt: "⚠️ Press Tab to change typing axis. ⚠️",
    },

    rightDragCount: 0,
    leftDragCount: 0,
    typeToBuildCount: 0,
    arrowKeysCount: 0,
    toggledAltCount: 0,

    //select?
    //zoom?
    //esc?
    
    isInProgress: true,
    seconds: 0,
    current: "",

    main: function() {
        if (TUTORIAL.isInProgress) {

            if (TUTORIAL.current == "rightDrag" && TUTORIAL.rightDragCount >= 20) {
                TUTORIAL.finishPhase();
            }
            if (TUTORIAL.current == "leftDrag" && TUTORIAL.leftDragCount >= 20) {
                TUTORIAL.finishPhase();
            }
            if (TUTORIAL.current == "typeToBuild" && TUTORIAL.typeToBuildCount >= 2) {
                TUTORIAL.finishPhase();
            }
            if (TUTORIAL.current == "arrowKeys" && TUTORIAL.arrowKeysCount >= 4) {
                TUTORIAL.finishPhase();
            }
            if (TUTORIAL.current == "toggledAlt" && TUTORIAL.toggledAltCount >= 3) {
                TUTORIAL.finishPhase();
            }
        }
    },

    intervaled: function() {

        if (TUTORIAL.rightDragCount < 20) {
            showSubTitle("ⓘ",TUTORIAL.hint.rightDrag);
            TUTORIAL.current = "rightDrag";
        }
        else if (TUTORIAL.leftDragCount < 20) {
            showSubTitle("ⓘ",TUTORIAL.hint.leftDrag);
            TUTORIAL.current = "leftDrag";
        }
        else if (TUTORIAL.typeToBuildCount < 2) {
            showSubTitle("ⓘ",TUTORIAL.hint.typeToBuild);
            TUTORIAL.current = "typeToBuild";
        }
        else if (TUTORIAL.arrowKeysCount < 4) {
            showSubTitle("ⓘ",TUTORIAL.hint.arrowKeys);
            TUTORIAL.current = "arrowKeys";
        }
        else if (TUTORIAL.toggledAltCount < 3) {
            showSubTitle("ⓘ",TUTORIAL.hint.toggledAlt);
            TUTORIAL.current = "toggledAlt";
        } else {
            TUTORIAL.isInProgress = false;
        }

    },

    finishPhase: function() {
        subtitle.classList.remove("show");
        TUTORIAL.current = "";
        TUTORIAL.seconds = 0;
    }

}

setInterval(function() { 

    TUTORIAL.seconds += 1;

    if (TUTORIAL.isInProgress && TUTORIAL.seconds > 10) { //10 should be variable? //if tutorialisgoingon
        TUTORIAL.intervaled();
    }

 }, 1000);

const subtitle = document.querySelector(".subtitle");

function showSubTitle(header,string) {

    let newHTML = "<strong><div style='font-size:25px'>" + header + "</div> " + string + " </strong>";

    document.getElementsByClassName('subtitle')[0].innerHTML = newHTML;

    subtitle.classList.add("show");
}