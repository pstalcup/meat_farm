let Lib = require("kolmafia");

let familiarLib = require("./familiar"); 
let locationLib = require("./location"); 
let buffLib = require("./buff");
let std = require("./lib.js"); 

const MPA = 5000; // for the purposes of calculations below

function dressUp(goals) {
    Lib.print("Dressing up with goals: " + goals); 
    let maximizerString = ""; 
    if(goals.includes("meat")) {
        maximizerString = "meat +equip haiku katana +equip mafia pointer finger ring";
    }
    else if(goals.includes("drops")) {
        maximizerString = "+equip garbage sticker +equip screege +equip lucky gold ring";
        if(goals.includes("drops") && "questDoctorBag" == "unstarted") {
            maximizerString += " +eqiup lil' doctor"; 
        } else {
            maximizerString += " +equip cheeng"
        }
    }

    // specific equipment overrides:

    if(std.kramcoChance() > 0.05) {
        maximizerString += " +equip kramco"; 
    }
    if(goals.includes("ghost")) {
        maximizerString += " +equip protonic accelerator pack";
    } else if(goals.includes("drops")) {
        maximizerString += " +equip camp scout backpack";
    } else if(Lib.availableAmount(Item.get("carpe")) > 0) {
        maximizerString += " +equip carpe"; 
    }

    if(Lib.myLocation() != undefined && Lib.myLocation().environment == "underwater") {
        maximizerString += ", adventure underwater";
    }

    Lib.cliExecute("maximize " + maximizerString);
}

function main() { 
    Lib.setProperty("choiceAdventureScript", "meat_farm/choice.js"); 
    familiarLib.buffRobort(); 
    buffLib.buildMood("meat, familiar, 0.1 da, 0.1 dr, 0.1 init, -tie");
    Lib.print("wut"); 

    while(Lib.myAdventures() > 0) {
    }
}

module.exports = {
    main: main
}