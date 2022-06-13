[//]: # (SPDX-License-Identifier: CC-BY-4.0)

# Meatchain - Hyperledger Fabric

[![Go Tests for Pig Chaincode](https://github.com/aaronmbdev/porkchain/actions/workflows/go.yml/badge.svg)](https://github.com/aaronmbdev/porkchain/actions/workflows/go.yml)

| App             | Status                                                                                                                                                                 |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Farm app        | [![Netlify Status](https://api.netlify.com/api/v1/badges/d13bdb58-fa20-4caa-80d7-9419fc11e965/deploy-status)](https://app.netlify.com/sites/farm-meatchain/deploys)    |
| Factory app     | [![Netlify Status](https://api.netlify.com/api/v1/badges/e8ce9022-ef84-47b3-a1a3-587346921186/deploy-status)](https://app.netlify.com/sites/factory-meatchain/deploys) |
| Supermarket app | [![Netlify Status](https://api.netlify.com/api/v1/badges/71288c29-b45e-41a6-806d-6af41b0196de/deploy-status)](https://app.netlify.com/sites/market-meatchain/deploys)  |

This is the repository of the Meatchain project. A Meat Traceability System based in Blockchain. It was built using Hyperledger Fabric and ReactJs for the frontend apps. 

## Folder structure

1. Network: Contains the files to deploy the network
2. Chaincode: Contains the smart contracts to be deployed
3. Apps: Contains the three apps of the project. One is for the farm, another one for the meat processing plant and the last one for the supermarket. It also contains a testing lib that executes the integration test.