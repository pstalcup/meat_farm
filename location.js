let Lib = require("kolmafia");

let std = require("./lib.js"); 
let canAdv = require("canadv.ash").canAdv;

function freeWanderer() {
    return Monster.get(Lib.getProperty("_sourceTerminalDigitizeMonster")).attributes.includes("FREE");
}

function meatMonster(foe) {
    return foe.name.includes("Embezzler"); 
}

function guzzlrQuest() {
    if(!std.boolProp("_guzzlrSkip") && Lib.getProperty("questGuzzlr") == "unstarted") {
        Lib.setProperty("_choiceGoal", "start_quest")
        let tablet = Item.get("guzzlr tablet"); 
        Lib.use(tablet); 
        if(!canAdv(Location.get(Lib.getProperty("guzzlrQuestLocation")))) {
            if(std.boolProp("_guzzlrQuestAbandoned")) {
                Lib.setProperty("_guzzlrSkip", true);  
            } else { 
                Lib.setProperty("_choiceGoal", "drop_quest")
                Lib.use(tablet); 
                guzzlrQuest();
            }
        } else {
            buy_to(Item.get(Lib.getProperty("guzzlrQuestBooze")), 1);
        }
    }
}

function getTarget(wander) {
    if(wander) {
        let monster_goal = propName => meatMonster(std.monsterProp(propName)) ? ["meat"] : ["drops"]; 
        let wander_goal = monster_goal("_sourceTerminalDigitizeMonster");
    }

    if(!std.boolProp("_loveTunnelUsed")) {
        return {
            location: Location.get("The Tunnel of L.O.V.E."),
            goal: ["drops"]
        }
    }
    if(std.intProp("_snojoFreeFights") < 10) {
        if(Lib.getProperty("snojoSetting") == "NONE") {
            return {
                url: "place.php?whichplace=snojo&action=snojo_controller",
                goal: ["drops"]
            }
        } else {
            return {
                location: Location.get("X-32-F Combat Training Snowman"),
                goal: ["drops"]
            }
        }
    }
    if(std.intProp("_neverendingPartyFreeTurn") < 10) {
        return {
            location: Location.get("Neverending Party"),
            goal: ["drops"]
        }
    }
    if(!std.boolProp("_kgeCopied")) {
        Lib.setProperty("_kgeCopied", true); 
        if(std.monsterProp("chateauMonster").name.includes("Embezzler")) {
            return {
                url: "place.php?whichplace=chateau&action=chateau_painting",
                goal: ["meat", "copy"]
            }
        } else {
            return {
                cli: "genie monster Knob Goblin Embezzler",
                goal: ["meat",  "copy"]
            }
        }
    }
    /*if(false || Lib.availableAmount(Item.get("Spooky Putty monster")) > 0) {
        goal = Lib.getProperty("spookyPuttyMonster").includes("Embezzler") ? ["meat", "copy"] : ["drops", "copy"]
        return {
            item: Item.get("Spooky Putty monster"),
            goal: goal
        }
    }*/
    if(std.timeToBust()) {
        return {
            location: Location.get(Lib.getProperty("ghostLocation")),
            goal: ["drops"]
        }; 
    }
    if(wander && !std.boolProp("_envyfishEggUsed") && (std.haveEffect(Effect.get("Fishy")) || !std.boolProp("_fishyPipeUsed"))) {
        return {
            location: Location.get("The Sunken Party Yacht"),
            goal: wander_goal
        }
    }
    if(wander && parseInt(Lib.getProperty("_machineTunnelsAdv")) < 5 && !freeWanderer()) { 
        return {
            location: Location.get("Deep Machine Tunnels"),
            goal: wander_goal
        }
    }
    if(wander && Lib.getProperty("questDoctorBag") != "unstarted") {
        buy_to(Item.get(Lib.getProperty("doctorBagQuestItem")), 1);
        return {
            location: Lib.toLocation(Lib.getProperty("doctorBagQuestLocation")),
            goal: wander_goal
        }        
    }
    else if(wander && Lib.getProperty("questGuzzlr") != "unstarted") {
        return {
            location: Lib.toLocation(Lib.getProperty("guzzlrQuestLocation")),
            goal: wander_goal
        }
    }
    else if(wander && !Location.get("Bubblin' Caldera").noncombatQueue.includes("Lava Dogs") && !freeWanderer()) {
        return {
            location: Location.get("Bubblin' Caldera"),
            goal: wander_goal
        }
    }
    return {
        location: Location.get("Barf Mountain"),
        goal: ["meat"]
    }
}

function runTarget(target) {
    if(target.hasOwnProperty("preadventure")) {
        if(Array.isArray(target.preadventure)) {
            target.preadventure.forEach(t => runTarget(t));
        } else {
            runTarget(target.preadventure)
        }
    }
    if(target.hasOwnProperty("location")) {
        Lib.adv1(target.location, -1, "");
    } else if(target.hasOwnProperty("item")) {
        Lib.use(target.item);
    } else if(target.hasOwnProperty("url")) {
        Lib.visitUrl(target.url); 
        Lib.runCombat(); 
    } else if(target.hasOwnProperty("cli")) {
        Lib.cliExecute(target.cli); 
    }
    if(target.hasOwnProperty("postadventure")) {
        if(Array.isArray(target.preadventure)) {
            target.preadventure.forEach(t => runTarget(t));
        } else {
            runTarget(target.preadventure)
        }
    }
}

module.exports = {
    getTarget: getTarget,
    guzzlrQuest: guzzlrQuest,
    runTarget: runTarget,
}