"use-strict";

exports.listCages = async (contract) => {
    console.log('-----------------------------------------------------------------------------------------');
    console.log('****** Listing existing cages ****** \n\n ');
    let evaluateResponse = await contract.evaluateTransaction("ListCages", 0, 100, "");
    //For some reason, it only returns 3 elements check later
    console.log("Found some cages: " + evaluateResponse.toString());
}