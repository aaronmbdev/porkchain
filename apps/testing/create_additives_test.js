const {generateID} = require("./utils/IDGenerator");
const {Logger} = require("./utils/AppUtils");

async function createAdditive (contract, adType, name, lotid, expiry) {
    let uuid = generateID();
    await contract.submitTransaction("CreateAdditive", adType, uuid, name, lotid, expiry);
    console.log("Created "+ adType + " additive with ID: " + uuid);
    return "ADD_" + uuid;
}

exports.createAdditives = async (contract) => {
    let sauces = [];
    let seasoning = [];
    let goodDate = "2024-05-23";
    let sauceNames = ["Sauce 1", "Sauce 2", "Sauce 3"];
    let seasoningNames = ["Seasoning 1", "Seasoning 2", "Seasoning 3"];

    for (const sauce in sauceNames) {
        let id = await createAdditive(contract, "sauce", sauceNames[sauce], "LOT1", goodDate);
        sauces.push(id);
    }

    for (const season in seasoningNames) {
        let id = await createAdditive(contract, "seasoning", seasoningNames[season], "LOT1", goodDate);
        seasoning.push(id);
    }

    try {
        let logger = new Logger();
        logger.disableLogger();
        createAdditive(contract, "wrongType", seasoningNames[0], "LOT1", goodDate);
        logger.enableLogger();
        console.error("Error! Wrong type should have thrown an error");
    } catch (e) {
        console.log("Success, a wrong type additive must not be created")
    }

    try {
        let logger = new Logger();
        logger.disableLogger();
        createAdditive(contract, "sauce", seasoningNames[0], "LOT1", "badDate");
        logger.enableLogger();
        console.error("Error! Wrong date should have thrown an error");
    } catch (e) {
        console.log("Success, a wrong date additive must not be created")
    }

    return {sauces, seasoning};
}