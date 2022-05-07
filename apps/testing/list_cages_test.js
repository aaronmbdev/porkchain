"use-strict";

exports.listCages = async (contract) => {
    console.log('-----------------------------------------------------------------------------------------');
    console.log('****** Listing existing cages ****** \n\n ');
    let amount = 3;
    let evaluateResponse = await contract.evaluateTransaction("ListCages", amount, "");
    console.log("Found some cages: " + evaluateResponse.toString());
    let response = JSON.parse(evaluateResponse.toString());
    if(response.fetchedRecordsCount !== amount) {
        throw "Error: expected to find " + amount + " cages, but found " + response.fetchedRecordsCount + ". Record amount is not correct.";
    }
}