# Meatchain Integration Tests

This files will perform end-to-end tests to make sure all the functionalities are working as expected.
In order to work successfully there are a series of prerequisites.

## Prerequisites
1. Create `connection-profile.yaml` file at this folder so the Hyperledger SDK can verify the identity of the client.
2. Run a local environment using the scripts under /network folder. Make sure the chaincode is also deployed.
3. Run `npm install` to download all the required external libraries.

## Run the tests
You only need to execute `node test-network.js` and a series of sample transactions will be executed. If any of those fails the entire execution will be stopped as well.