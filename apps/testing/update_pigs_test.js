const {generateID} = require("./utils/IDGenerator");
const {prettyJSONString} = require("./utils/AppUtils");
"use-strict";

async function updatePig(contract, pigId, parentId, birthdate, breed, location) {
    let uuid = generateID();
    console.log("Trying to update Pig with ID: "+ pigId + " and recordID " + uuid);
    await contract.submitTransaction("UpdatePig",
        uuid,
        pigId,
        parentId,
        birthdate,
        breed,
        location
    );
    console.log("Update completed. Trying to get the updated asset...");
    let newPig = await contract.evaluateTransaction("ReadPig",pigId);
    let pig = JSON.parse(newPig.toString());
    verifyFields(parentId, birthdate,breed,location, pig);
    await verifyRecord(contract, pigId);
}

async function verifyRecord(contract, pigId) {
    console.log("Trying to get the updated asset records with id: " + pigId);
    let records = await contract.evaluateTransaction("GetPigRecords",pigId, 10, "");
    let result = records.toString();
    if (result === "") {
        throw "No update records were created! Error";
    }
    console.log("Found the following records: "+ prettyJSONString(result));
}

function verifyFields(parent, date, breed, location, newPig) {
    if(parent !== "" && parent !== newPig.parentId) {
        throw "The parentID is not the expected!";
    }
    if(date !== "" && date !== newPig.birthdate) {
        throw "The birthdate is not the expected!";
    }
    if(breed !== "" && breed !== newPig.breed) {
        throw "The breed is not the expected!";
    }
    if(location !== "" && location !== newPig.location) {
        throw "The location is not the expected!";
    }
    console.log("The update has been verified successfully. Fields are updated.");
}

exports.updatePigs = async (cages, pigs, contract) => {
    console.log('-----------------------------------------------------------------------------------------');
    console.log('****** Update pigs test ****** \n\n ');

    let PigToUpdate = pigs[0];
    let PigToBeParent = pigs[1];
    let newLocation = cages[cages.length - 2];
    let newBirthday = "2019-09-05";
    let newBreed = "Husky";

    await updatePig(contract, PigToUpdate, PigToBeParent, newBirthday, newBreed, newLocation);

}