// items.js
const ITEMS = {

    moveItem: function(parent1,slot1,parent2,slot2) {
        //record item at slot1
        const movedItem = parent1.contains[slot1];
        //delete item at slot1
        parent1.contains[slot1] = 0;
        //place item at slot 2
        parent2.contains[slot2] = movedItem;
        
        //!!! update inventory windows!
    },

    //Stamina: Energy Pool
    class: {


        //ANATOMY
        //Bones
        //Joints?
        //ligaments?
        //tendons?
        //Muscles
        //ORGANS
        //Veins?
        //Nerves?

        //--------hEAD---------
        //Head
        //Neck

        //--------cHEST---------
        //Upper Chest
        //Lower Chest
        
        //Right Arm
        //Left Arm

        //Right Hand
        //Left Hand

        //--------lEGS---------
        //Right Leg
        //Left Leg

        //--------fEET---------
        //Right Foot
        //Left Foot

        Backpack: function() {
            this.name = "Backpack";
            this.icon = "backpack";

            this.contains = [
                0,
                0,
                0,
                0,
            ];
        },

        Toothbrush: function() {
            this.name = "Toothbrush";
            this.icon = "toothbrush";

            this.contains = [];

        },


        
        Player: function() {
            
            this.id = "player"; //class name. class behavior?
            this.type = "entity"; //class behavior? class category?
            this.icon = "&";
            this.count = 1;
            this.fitsInside = []; //neccesary? they cannot be moved

            //meta
            this.name = "LightningWB";
            this.coords = {
                x: 0,
                y: 0,
                z: 0
            };
            this.target = {
                x:0,
                y:0,
                z:0
            };
            this.loadedChunks = ["0|0"];
            this.health = 100;
            this.stamina = 100;
            this.hunger = 100;
            this.meals = 24;
            
            //inventory
            this.slots = [
                {
                    name: "head",
                    type: "head",
                    icon: "⚇"
                },
                {
                    name: "chest",
                    type: "chest",
                    icon: "☖"
                },
                {
                    name: "legs",
                    type: "legs",
                    icon: "👖"
                },
                {
                    name: "feet",
                    type: "feet",
                    icon: "d"
                },

                {
                    name: "back",
                    type: "standard",
                    icon: "B"
                },
            ];

            this.contains = [
                0,0,0,0, 0,0,0,0
            ];

        },

        Belt: function () {
            this.id = "belt";
            this.type = "clothingWaist"; //needed?
            this.name = "Simple Belt"; //meta
            this.icon = "~";
            this.count = 1;
            this.fitsInside = ["standard","waist"];

            this.slots = [
                {
                    name: "left belt",
                    icon: "~",
                    type: "standard"
                },
                {
                    name: "right belt",
                    icon: "~",
                    type: "standard"
                }
            ],

            this.contains = [0,0]; //meta
        },

        Umbrella: function () {
            this.id = "umbrella";
            this.type = "tool"; //needed?
            this.name = "Umbrella"; //meta
            this.icon = "☂";
            this.count = 1;
            this.fitsInside = ["standard"];

            this.slots = []; //needed?

            this.contains = []; //meta, needed?
        }
        
    
    }
    
}