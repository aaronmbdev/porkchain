'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const yaml = require('js-yaml');
const { buildWallet } = require('./utils/AppUtils.js');

const channelName = 'meatchannel';
const chaincodeName = 'porkManagement';
const mspOrg1 = 'FarmMSP';
const Username = 'User1';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
    try {
        const wallet = await buildWallet(Wallets, walletPath);
        const userExists = await wallet.get(Username);
        let connectionProfile = yaml.safeLoad(fs.readFileSync("../../network/organizations/peerOrganizations/farm.meatchain.cloud/connection-farm.yaml","utf-8"));

        if(!userExists) {
            const caInfo = connectionProfile.certificateAuthorities['ca.Farm.meatchain.cloud'];
            const caTLSCACerts = caInfo.tlsCACerts.pem;
            const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, "ca-farm");
            const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: 'user1pw' });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: mspOrg1,
                type: 'X.509',
            };
            await wallet.put('User1', x509Identity);
            console.log('Successfully enrolled client user "user1" and imported it into the wallet');
        }

        const gateway = new Gateway();

        try {
            
            let connectionOptions =  {
                identity: Username,
                wallet: wallet,
                discovery: {
                    enabled: true,
                    asLocalhost: true
                }
            };
            
            console.log("Trying to connect to the Meatchain");

            await gateway.connect(connectionProfile, connectionOptions);

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);

            console.log('-----------------------------------------------------------------------------------------');
            console.log('****** Submitting create cage queries ****** \n\n ');

            let queryResponse = await contract.evaluateTransaction('CreateCage', 'Cage1');
            let cage = queryResponse.toString();
            console.log(cage);

            if (cage != "nil") {
                console.log("Cage 1 was created successfully");
            }

            queryResponse = await contract.evaluateTransaction('CreateCage', 'Cage2');
            cage = queryResponse.toString();

            if (cage != "nil") {
                console.log("Cage 2 was created successfully");
            }

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
