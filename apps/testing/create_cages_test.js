const {generateID} = require("./utils/IDGenerator");
const {prettyJSONString, Logger} = require("./utils/AppUtils");
'use-strict';

async function createCage(contract, name) {
    let uuid = generateID();
    console.log("Creating cage with ID: " + uuid);
    await contract.submitTransaction('CreateCage', uuid, name);

    let evaluateResponse = await contract.evaluateTransaction("CageExists", uuid);
    let processedResponse = prettyJSONString(evaluateResponse.toString());
    if (!processedResponse) {
        console.error(`******** ERROR: The cage ${uuid} was not created`);
    } else {
        console.log("Cage " + uuid + " created successfully");
        return uuid;
    }
    return null;
}

exports.createCages = async (contract) => {
    let cages = [];
    let names = ["Sample Cage 1","Sample Cage 2","Sample Cage 3"];

    console.log('-----------------------------------------------------------------------------------------');
    console.log('****** Submitting create cage queries ****** \n\n ');

    for (const name of names) {
        let uuid = await createCage(contract, name);
        if(uuid != null) cages.push(uuid);
    }

    if(cages.length > 0) {
        console.log("Trying to create an already existing cage");
        try {
            let logger = new Logger();
            logger.disableLogger();
            await contract.submitTransaction("CreateCage",cages[0],"Existing cage");
            logger.enableLogger();
            console.error(`******** ERROR: The cage was created again, this shouldn't happen`);
        } catch (e) {
            console.log("Test successful, the existing cage could not be created again.")
        }
    }

    return cages;
}