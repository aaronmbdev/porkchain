const {generateID} = require("./utils/IDGenerator");
const {prettyJSONString, Logger} = require("./utils/AppUtils");
"use-strict";

async function createPigs(contract, parentId, birthdate, breed, location) {
    let uuid = generateID();
    console.log("Creating Pig with ID: " + uuid);
    await contract.submitTransaction('CreatePig',
        uuid,
        parentId,
        birthdate,
        breed,
        location);

    uuid = "PIG_" + uuid;
    let evaluateResponse = await contract.evaluateTransaction("ReadPig", uuid);
    console.log("Raw response: "+evaluateResponse);
    let processedResponse = prettyJSONString(evaluateResponse.toString());
    console.log("The pig "+uuid+ "was created successfully with the following data: " + processedResponse)
    return uuid;
}

async function getParentInfo(contract, pigId) {
    let evaluateResponse = await contract.evaluateTransaction("ReadPig", pigId);
    console.log("Reading pig: "+evaluateResponse.toString());
    return JSON.parse(evaluateResponse.toString());
}

exports.createPigs = async (cages, contract) => {
    console.log('-----------------------------------------------------------------------------------------');
    console.log('****** Submitting create pig queries ****** \n\n ');

    let pigs = [];
    let birthdate = "2021-09-15";
    let breeds = ["Iberico","Serrano"];
    let location = cages[0];

    for(const breed in breeds) {
        let id = await createPigs(contract,
            "",
            birthdate,
            breeds[breed],
            location);
        pigs.push(id);
    }

    console.log("Testing birth functionality with 5 piglets")
    let parentPig = pigs[0];
    let piglets = 5;
    let pigletIds = [];
    let parent = await getParentInfo(contract, parentPig);
    for(let i = 0; i < piglets; i++) {
        let breed = parent.breed;
        let location = parent.location;
        let piglet = await createPigs(contract,
            parentPig,
            birthdate,
            breed,
            location);
        pigletIds.push(piglet);
    }
    console.log("Created successfully the following piglets: "+ pigletIds.toString());

    console.log("Trying to create a pig with bad date");
    try {
        let logger = new Logger();
        logger.disableLogger();
        await createPigs(contract,
            "",
            "badDate",
            "Iberico",
            cages[0]);
        logger.enableLogger();
        console.error(`******** ERROR: The pig with a bad birthdate was created!`);
    } catch (e) {
        console.log("Test successful, the pig with bad birthdate could not be created")
    }

    console.log("Trying to create a pig with a nonExisting parent");
    try {
        let logger = new Logger();
        logger.disableLogger();
        await createPigs(contract,
            "badParent",
            birthdate,
            "Iberico",
            cages[0]);
        logger.enableLogger();
        console.error(`******** ERROR: The pig with a bad parent was created!`);
    } catch (e) {
        console.log("Test successful, the pig with bad parent could not be created")
    }

    console.log("Trying to create a pig with a nonExisting location");
    try {
        let logger = new Logger();
        logger.disableLogger();
        await createPigs(contract,
            "",
            birthdate,
            "Iberico",
            "badLocation");
        logger.enableLogger();
        console.error(`******** ERROR: The pig with a bad location was created!`);
    } catch (e) {
        console.log("Test successful, the pig with bad location could not be created")
    }


    return pigs;
}
