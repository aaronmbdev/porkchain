const {generateID} = require("./utils/IDGenerator");

exports.packMeats = async (contract, meats, additives) => {
    console.log('-----------------------------------------------------------------------------------------');
    console.log('****** Packing meat ****** \n\n ');

    uuid = generateID();
    quantities = [1,1,1,1,1]

    //await contract.submitTransaction("PackMeat", uuid, meats, additives, quantities);
}