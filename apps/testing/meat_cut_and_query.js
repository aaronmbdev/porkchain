const {generateID} = require("./utils/IDGenerator");
const {Logger} = require("./utils/AppUtils");

async function cutMeat(contract, pigId, cut, pieces) {
    console.log("Cutting "+ pieces+ " piece/s of "+ cut + " from pig "+ pigId);
    let uuid = generateID();
    let updateid = generateID();
    await contract.submitTransaction("CutMeat", updateid, uuid, pigId, cut, pieces);
}

async function queryCutsAvailable(contract, cuts) {
    console.log("Querying " +cuts+ " available");
    let response = await contract.evaluateTransaction("QueryMeat",cuts,5,"");
    console.log("Found these cuts: " + response.toString());
}


exports.cutMeatAndQuery = async (contract, pigs) => {
    let deadPig = pigs[0];
    let alivePig = pigs[1];
    let cuts = ["Head","Ham","Leg","Belly","Blade"];
    let pieces = [1,2,4,8,16];

    for(const cut in cuts) {
        let cutS = cuts[cut];
        let piece = pieces[cut];
        await cutMeat(contract, deadPig, cutS, piece);
    }

    await queryCutsAvailable(contract, "Head");
    await queryCutsAvailable(contract, "Ham");
    await queryCutsAvailable(contract, "Blade");

    try {
        console.log("Trying to make a cut from an alive pig");
        let logger = new Logger();
        logger.disableLogger();
        await cutMeat(contract, alivePig, "Head", 1);
        logger.enableLogger();
        console.error("Error! We cannot cut a pig that is still alive");
    } catch (e) {
        console.log("Success! We cannot cut a pig that is still alive");
    }

}