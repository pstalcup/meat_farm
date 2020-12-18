let Lib = require("kolmafia");

function boolProp(propName) {
    return Lib.getProperty(propName) == "true";
}

function intProp(propName) {
    return parseInt(Lib.getProperty(propName)); 
}

function monsterProp(propName) {
    let propValue = Lib.getProperty(propName);
    if(propValue.length > 0) {
        return Lib.toMonster(propValue); 
    }
    return Monster.get("none"); 
}

function itemProp(propName) {
    let propValue = Lib.getProperty(propName);
    if(propValue.length > 0) {
        return Lib.toItem(propValue); 
    }
    return Item.get("none"); 
}

function locationProp(propName) {
    let propValue = Lib.getProperty(propName);
    if(propValue.length > 0) {
        return Lib.toLocation(propValue); 
    }
    return Item.get("none"); 
}


function haveEffect(effect) {
    return Lib.myEffects()[effect.name] > 0; 
}

function buyTo(it, qt) {
    // currently busted: Lib.buy(it, qt - Lib.availableAmount(it))
    if(Lib.availableAmount(it) < qt && !Lib.cliExecute("acquire " + qt + " " + it.name)) {
        Lib.abort("Unable to buy" + it.name); 
    }
}

function kramcoNumber() {
    let previous = parseInt(Lib.getProperty("_sausageFights"));
    return 5+previous*3+Math.pow(Math.max(0,previous-5), 3);
}

function kramcoChance() {
    // max(min(to_float(total_turns_played()-to_int(get_property("_lastSausageMonsterTurn"))+1) / to_float(KramcoNumber()),1.0),0.0);
    return Math.max(Math.min(parseFloat(Lib.totalTurnsPlayed() - parseInt(Lib.getProperty("_lastSausageMonsterTurn")) + 1) / parseFloat(kramcoNumber()),1.0),0.0);
}

function expiringTimer(filter) {
    let relayProp = Lib.getProperty("relayCounters");
    let splitRelayProp = relayProp.split(":"); 
    let turncount = Lib.myTurncount(); 
    for(let i = 0; i < splitRelayProp.length; i+=3) {
        let counter = splitRelayProp[0];
        let name = splitRelayProp[1];
        if (turncount == parseInt(counter) && name.toLowerCase().includes(filter.toLowerCase())) {
            return true; 
        }
    }
    return false; 
}

function timeToBust() {
    return Lib.getProperty("questPAGhost") == "started"; 
}

module.exports = {
    boolProp: boolProp,
    intProp: intProp,
    monsterProp: monsterProp,
    locationProp: locationProp,
    itemProp: itemProp,
    haveEffect: haveEffect,
    buyTo: buyTo,
    kramcoChance: kramcoChance,
    expiringTimer: expiringTimer,
    timeToBust: timeToBust
}