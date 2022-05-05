'use strict';

const {MeatchainConnection} = require("./network-connection");
const {createCages} = require("./create_cages_test");

async function main() {
    try {
        let connection = new MeatchainConnection();
        let gateway = await connection.createMeatchainConnection();

        try {
            let contract = await connection.getContract();
            let cage = await createCages(contract);

        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}

main();
