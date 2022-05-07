'use strict';

exports.listPigs = async (contract) => {
    console.log('-----------------------------------------------------------------------------------------');
    console.log('****** Listing existing pigs ****** \n\n ');
    let evaluateResponse = await contract.evaluateTransaction("ListPigs", 10, "");
    //For some reason, it only returns 3 elements check later
    console.log("Found some pigs: " + evaluateResponse.toString());
}