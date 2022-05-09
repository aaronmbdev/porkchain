'use strict';

const {MeatchainConnection} = require("./network-connection");
const {createCages} = require("./create_cages_test");
const {listCages} = require("./list_cages_test");
const {createPigs} = require("./create_pigs_test");
const {listPigs} = require("./list_pigs_test");
const {killPig} = require("./pig_slaugther_test");
const {deleteCages} = require("./delete_cages_test");
const {updatePigs} = require("./update_pigs_test");
const {feedPigsTest} = require("./feed_pigs_test");
const {createAdditives} = require("./create_additives_test");
const {listAdditives} = require("./list_additives_test");
const {cutMeatAndQuery} = require("./meat_cut_and_query");
const {packMeats} = require("./packMeat_test");

async function main() {
    try {
        let connection = new MeatchainConnection();
        let gateway = await connection.createMeatchainConnection();

        try {
            let contract = await connection.getContract();
            let cages = await createCages(contract);
            await listCages(contract);
            let pigs = await createPigs(cages, contract);
            await listPigs(contract);
            await killPig(pigs,contract);
            await updatePigs(cages, pigs, contract);
            await deleteCages(cages, contract);
            await feedPigsTest(cages,contract);

            console.log('-----------------------------------------------------------------------------------------');
            console.log('****** First contract fully tested. Starting the second ****** \n\n ');

            let additives = await createAdditives(contract);
            await listAdditives(contract);

            let cuts = await cutMeatAndQuery(contract, pigs);
            let trays = await packMeats(contract, cuts, additives);

        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}

main();
