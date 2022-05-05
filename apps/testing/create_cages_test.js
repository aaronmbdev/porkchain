const {generateID} = require("./utils/IDGenerator");
const {prettyJSONString, Logger} = require("./utils/AppUtils");
'use-strict';

exports.createCages = async (contract) => {
    let uuid;
    let queryResponse;
    let processedResponse;
    let lastCage;

    console.log('-----------------------------------------------------------------------------------------');
    console.log('****** Submitting create cage queries ****** \n\n ');

    uuid = generateID();
    console.log("Creating cage with ID: " + uuid);
    queryResponse = await contract.submitTransaction('CreateCage', uuid, "Sample Cage 1");

    queryResponse = await contract.evaluateTransaction("CageExists", uuid);
    processedResponse = prettyJSONString(queryResponse.toString());
    if(!processedResponse) {
        console.error(`******** ERROR: The cage ${uuid} was not created`);
    } else {
        console.log("Cage "+uuid+" created successfully");
        lastCage = uuid;
    }

    console.log("Trying to create an already existing cage");
    try {
        let logger = new Logger();
        logger.disableLogger();
        await contract.submitTransaction("CreateCage",uuid,"Existing cage");
        logger.enableLogger();
        console.error(`******** ERROR: The cage was created again, this shouldn't happen`);
    } catch (e) {
        console.log("Test successful, the existing cage could not be created again.")
    }

    return lastCage;
}