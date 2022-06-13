# Meatchain Rest API

This is the API that receives requests from the three client apps. It is basically packed into a docker image and deployed automatically using a autoscaled cloud service from Google Cloud to avoid bottlenecks.
You can check the container definition at the Dockerfile.

## Prerequisites

1. Launch a local network instance and deploy the latest chaincode version. You can check the instructions at the readme located at the /network folder.
2. IMPORTANT. If you're working on your local environment setup the following variable.
   ```bash
    export NODE_ENV=development
    ```
3. Create two connection profiles, one for the farm organization and another one for the factory. See the following table.

| File                                  | Description                                                                                                                                                                                      |
|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| farm-connection-profile-local.yaml    | Required: If you're working on you local environment and the env variable NODE_ENV is set to environment. This file is required to connect the local farm peer.                                  |
| farm-connection-profile.yaml          | Optional: This file must contain the information of the production farm peer. Only required if NODE_ENV is not set. Note that using this file will connect the app to the production network.    |
| factory-connection-profile-local.yaml | Required: If you're working on you local environment and the env variable NODE_ENV is set to environment. This file is required to connect the local factory peer.                               |
| factory-connection-profile.yaml       | Optional: This file must contain the information of the production factory peer. Only required if NODE_ENV is not set. Note that using this file will connect the app to the production network. |

## Launch

There are three ways to launch an instance of the api. 
1. You can launch the latest docker image version by typing (assuming it's been built already)
   
   ```bash
    docker run -p 4000:4000 aaronmbdev/meatchain-server:latest
    ```
2. You can run a development version with auto-reload by running

   ```bash
    npm run dev
    ```
3. You can run a node instance by typing (same as 2 but without auto-reload)

    ```bash
    node index.js
    ```

If everything went well you will see that two identites have been created.
