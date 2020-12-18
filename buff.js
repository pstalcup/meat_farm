let Lib = require("kolmafia");
std = require("./lib.js"); 

function atSong(skill) {
    return skill.buff && skill.class == Class.get("Accordion Thief"); 
}

function buildMood(goal) {
    Lib.print("Building mood for " + goal); 
    let baseMood = Lib.getProperty("meatFarmBaseMood"); 
    cliCommands = [
        "mood meatFarm",
        "trigger clear"
    ];
    if(baseMood != "") {
        cliCommands = cliCommands.concat("mood meatFarm extends " + baseMood);
    }
    let results = Lib.maximize(goal, 0, 0, true, false);
    Lib.print("How did it get here"); 

    let noLimitBuffs = results.filter(r => Lib.haveSkill(r.skill) && !r.skill.expression && !atSong(r.skill) && r.skill.dailylimit <= 0);
    let expression = results.find(r => Lib.haveSkill(r.skill) && r.skill.expression);
    let atSongs = results.filter(r => atSong(r.skill)).slice(0, 3); 
    // build out a mood:
    cliCommands = cliCommands.concat(noLimitBuffs.concat(expression).concat(atSongs).map(r => "trigger lose_effect, " + r.effect.name + " , " + r.command));   
    cliCommands.forEach(c => Lib.cliExecute(c)); 
}

function buffFor(loc) {
    // cast or use location specific buffs
    if(loc.name != undefined && loc.environment == "underwater" && (Lib.myEffects()["Fishy"] > 0 || !std.boolProp("_fishyPipeUsed"))) {
        Lib.use(Item.get("fishy pipe")); 
    }
    if(loc.name == "Barf Mountain") {
        if(Lib.getProperty("boomBoxSong") != "Total Eclipse of Your Meat" && parseInt(Lib.getProperty("_boomBoxSongsLeft")) > 0) {
            Lib.cliExecute("boom meat"); 
        }
        if ((Lib.myEffects()["How to Scam Tourists"] || 0) == 0) {
            Lib.use(Item.get("How to Avoid Scams"));
        }
    }
}

module.exports = {
    buildMood: buildMood,
    buffFor: buffFor
}