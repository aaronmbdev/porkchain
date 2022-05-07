'use strict';

const {generateID} = require("./utils/IDGenerator");
exports.feedPigsTest = async (cages, contract) => {
    console.log('-----------------------------------------------------------------------------------------');
    console.log('****** Feeding some pigs ****** \n\n ');

    console.log("Trying to get all pigs available in cage " + cages[0]);
    let evaluateResponse = await contract.evaluateTransaction("GetAllPigsInCage", cages[0]);
    if (evaluateResponse.toString() === "") {
        throw "Error, no pigs were found in cage " + cages[0];
    }
    console.log("Found some pigs: " + evaluateResponse.toString());
    let foodData = "Pienso para cerdos ACME 2.0";
    let pigs = JSON.parse(evaluateResponse.toString());
    let vetId = "ABC-11234";
    let data = "All checks passed successfully";
    for(const pig in pigs) {
        console.log("Feeding pig " + pigs[pig].pig_id);
        let registry = generateID();
        let secondRegistry = generateID();
        await contract.submitTransaction("FeedPig", pigs[pig].pig_id, foodData, registry);

        console.log("Also, we will perform a health check");
        await contract.submitTransaction("HealthReview", pigs[pig].pig_id, vetId, data, secondRegistry);
    }

}