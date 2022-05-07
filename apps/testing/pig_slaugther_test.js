'use strict';

const {Logger} = require("./utils/AppUtils");
const {generateID} = require("./utils/IDGenerator");

async function kill(contract, pigId) {
    let uuid = generateID();
    console.log("Trying to kill "+ pigId);
    await contract.submitTransaction("SlaughterPig", pigId, uuid);
    let testKilled = await contract.evaluateTransaction("ReadPig", pigId);
    return JSON.parse(testKilled.toString());
}

exports.killPig = async (pigs, contract) => {
    console.log('-----------------------------------------------------------------------------------------');
    console.log('****** Slaughter pigs ****** \n\n ');

    let selectedPig = pigs[0];
    let killedPig = await kill(contract,selectedPig);
    if(killedPig.status === "Slaughtered") {
        console.log("Test successful. Pig with id "+selectedPig+ " is no longer alive.");
    } else {
        console.error("The pig is still alive! Error in the test.");
    }

    console.log("Trying to kill the same pig again.");
    try {
        let logger = new Logger();
        logger.disableLogger();
        await kill(contract,selectedPig);
        logger.enableLogger();
        console.error("The pig was re-killed! This should not happen. Error!")
    } catch (e) {
        console.log("Success: The dead pig could not be re-killed");
    }

}