'use strict';

const {MeatchainConnection} = require("./network-connection");
const {createCages} = require("./create_cages_test");
const {listCages} = require("./list_cages_test");
const {createPigs} = require("./create_pigs_test");
const {listPigs} = require("./list_pigs_test");

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


        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}

main();
