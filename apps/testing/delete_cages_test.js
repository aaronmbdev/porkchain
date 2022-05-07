const {Logger} = require("./utils/AppUtils");
"use-strict";

async function deleteCage(contract, cageId) {
    console.log("Trying to delete cage "+ cageId);
    await contract.submitTransaction("DeleteCage", cageId);

}

exports. deleteCages = async (cages, contract) => {
    console.log('-----------------------------------------------------------------------------------------');
    console.log('****** Delete cages ****** \n\n ');
    let withPigs = cages[0];
    let withoutPigs = cages[cages.length - 1];

    await deleteCage(contract,withoutPigs);
    console.log("Cage with ID: "+withoutPigs+ " was successfully deleted");

    try {
        let logger = new Logger();
        logger.disableLogger();
        await deleteCage(withPigs);
        logger.enableLogger();
        console.error("Error! This cage contains pigs and is not supposed to be deleted");
    } catch (e) {
        console.log("Success! A cage that contains pigs cannot be deleted");
    }

}