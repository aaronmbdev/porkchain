'use strict';

const {MeatchainConnection} = require("./network-connection");

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
    try {
        let connection = new MeatchainConnection();
        let gateway = await connection.createMeatchainConnection();

        try {
            let contract = await connection.getContract();

            console.log('-----------------------------------------------------------------------------------------');
            console.log('****** Submitting create cage queries ****** \n\n ');

            /*let queryResponse = await contract.evaluateTransaction('CageExists', 'Cage1');*/
            let queryResponse = await contract.submitTransaction('CreateCageID', "Cage1", "CAGE_sdasd123");
            console.log(queryResponse.toJSON());
            let json = JSON.parse(queryResponse);
            console.log(json);
            //console.log(prettyJSONString(queryResponse.toString()));

            /*if (cage != "nil") {
                console.log("Cage 1 was created successfully");
            }*/

            /*queryResponse = await contract.v('CreateCage', 'Cage2');
            cage = queryResponse.toString();

            if (cage != "nil") {
                console.log("Cage 2 was created successfully");
            }*/

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
