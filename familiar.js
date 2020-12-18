let Lib = require("kolmafia");
let std = require("./lib.js"); 

function computeExpectedDropRate(baseDrop, dropDecRate, dropsToday, chargeIncRate, charges) {
    return ((Math.min(5, baseDrop - dropDecRate * dropsToday) + (chargeIncRate * charges)) / 100);
}

function spleenDropRate(baseDrop) {
    let dropDecRate = 5.0; 
    let chargeIncRate = 5.0
    return function expectedValue(familiarName) {
        let f = Familiar.get(familiarName); 
        if (f.dropsToday >= f.dropLimit) {
            return 0; 
        }
        let targetItem = f.dropItem;
        let mallPrice = Lib.mallPrice(targetItem);
        return mallPrice * computeExpectedDropRate(baseDrop, dropDecRate, f.dropsToday, chargeIncRate, f.charges);
    }
}

function puckMan() {
    return function expectedValue(familiarName) {
        let f = Familiar.get(familiarName); 
        if (f.dropsToday >= f.dropLimit) {
            return 0; 
        }
        let targetItem = f.dropItem;
        let mallPrice = Lib.mallPrice(targetItem);
        return 200 + mallPrice * computeExpectedDropRate(10.0, 0.0, f.dropsToday, 10.0, f.charges);
    }
}

function fistTurkey() {
    return function expectedValue(familiarName) {
        let f = Familiar.get(familiarName); 
        let level = Lib.myLevel(); 
        let targetItem = Item.get("Ambitious Turkey"); 
        if (level <= 4) { 
            targetItem = Item.get("Friendly Turkey");
        } else if (level <= 7) {
            targetItem = Item.get("Agitated Turkey")
        }
        let mallPrice = Lib.mallPrice(targetItem);
        return mallPrice * computeExpectedDropRate(15.0, 5.0, f.dropsToday, 5.0, f.charges);
    }
}

function professorLectures() {
    return Math.ceil(Math.sqrt(Lib.familiarWeight(Familiar.get("Pocket Professor"))))
}

function fixedDropRate(turns) {
    return function expectedValue(familiarName) {
        let f = Familiar.get(familiarName); 
        let mallPrice = Lib.mallPrice(f.dropItem);
        return (mallPrice * 1.0 * f.charges) / turns;
    }
}

function computeExpectedValue(familiar, foe) {
    let familiarStr = Lib.toString(familiar); 

    let expectedValueLookup = {
        "Astral Badger": spleenDropRate(20),
        "Green Pixie": spleenDropRate(20),
        "Llama lama": spleenDropRate(20),
        "Rogue Program": spleenDropRate(25),
        "Baby Sandworm": spleenDropRate(20),
        "Bloovian Groose": spleenDropRate(25),
        "Li'l Xenomorph": spleenDropRate(25),
        "Unconscious Collective": spleenDropRate(25),
        "Grimstone Golem": fixedDropRate(45),
        "Grim Brother": spleenDropRate(25),
        "Golden Monkey": spleenDropRate(25), // This is unspaded on the wiki, so assume it matches similar familiars
        "Adventurous Spelunker": fixedDropRate(7.5),
        "Puck Man": puckMan(),
        "Fist Turkey": fistTurkey(),

    };
    if(familiarStr in expectedValueLookup) {
        return expectedValueLookup[familiarStr](familiarStr); 
    } else {
        return 0; 
    }
}

function buffRobort() {
    // meat farming specific buffs

    Lib.useFamiliar(Familiar.get("Robortender")); 
    let robortDrinks = [
        "hell in a bucket",
        "Feliz Navidad",
        "drive-by shooting",
        "Bloody Nora",
    ];

    let needDrinks = robortDrinks.filter(d => !Lib.getProperty("_roboDrinks").includes(d));
    let cliCommands = needDrinks.map(d => "acquire " + d).concat(needDrinks.map(d => "robo " + d)); 
    if(!Lib.getProperty("_mummeryMods").includes("Meat Drop")) {
        cliCommands = cliCommands.concat("mummery meat"); 
    }
    cliCommands.forEach(c => Lib.cliExecute(c)); 

    if(Lib.availableAmount(Item.get("amulet coin")) == 0) {
        Lib.useFamiliar(Familiar.get("Cornbeefadon")); 
        Lib.cliExecute("acquire familiar jacks"); 
    }
}

function familiarize(goals) {
    let familiar = Familiar.get("Robortender"); 
    if(Lib.myLocation() == Location.get("Deep Machine Tunnels")) {
        familiar = Familiar.get("Machine Elf");
    } else if(goals.includes("drops")) {
        familiar = Familiar.all()
                    .map(f => [f, computeExpectedValue(f, null)])
                    .filter(f => f[1] > 0)
                    .reduce((acc, v) => acc[1] > v[1] ? acc : v)[0];
    } else if(goals.includes("copy") && std.intProp("_badlyRomanticArrows") == 0) {
        familiar = Familiar.get("Reanimated Reanimator");
    } else if(goals.includes("copy") && std.intProp("_pocketProfessorLectures") < professorLectures()) {
        familiar = Familiar.get("Pocket Professor"); 
    }
    Lib.useFamiliar(familiar); 
}

module.exports = {
    familiarize: familiarize,
    buffRobort: buffRobort
}