let Lib = require("kolmafia");

function main(choiceNumber, pageContents) {
    let choice = -1; 
    let choiceGoal = Lib.getProperty("_choiceGoal");
    Lib.print("Using choice script for " + choiceNumber);

    switch(choiceNumber) {
        case 1073: // Barf Adventure
            choice = 1; 
            break;
        case 1106: // Halloweiner 1
            choice = 3; // dog food
            break; 
        case 1107: // Halloweiner 2 
            choice = 2; // tennis ball
            break; 
        case 1108: // Halloweiner 3
            choice = 3; 
            break;
        case 1222:
            choice = 1; 
            break; 
        case 1223: // LOV entrance
            choice = 1; 
            break; 
        case 1224: // LOV equipment
            choice = 3; // LOV earrings
            break;
        case 1225: // LOV Engine Room
            choice = 1; 
            break; 
        case 1226: // LOV Emergency Room
            choice = 2; // Open Heart Surgery
            break; 
        case 1227:
            choice = 1;
            break; 
        case 1228:
            choice = 1; // LOV enamorang
            break; 
        case 1340: // Doctor Start Quest
            choice = 1; 
            break; 
        case 1387:
            if (choiceGoal == "banish") {
                choice = 1; 
            } else if (choiceGoal == "copy") {
                choice = 2; 
            } else if (choiceGoal == "drops") {
                choice = 3; 
            }
        case 1412:
            if (choiceGoal == "start_quest") {
                choice = 2; 
            } else if (choiceGoal == "drop_quest") {
                choice = 1; 
            }
            break;
    }
    if(choice != -1) {
        Lib.runChoice(choice);
    }
}

module.exports = {
    main: main
}