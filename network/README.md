# Running the network

This folder contains the scripts and artifacts required to run a hyperledger development network according to the diagram of the documentation. 

The entrypoint is the file `network.sh` it has the required options to operate a network.

## Turning on the network

To launch the docker containers of the orderer and peer nodes you only need to execute

```bash
./network.sh up
```

Note that this will not create a channel. If the channel was created previously, you can only turn on the network.

## Turning off the network

This option will shutdown and delete any persistence related to the network. This is useful when you need to start from scratch.

```bash
./network.sh down
```

## Turning on the network and create a channel

The following option will turn on the network and create the meatchannel.

```bash
./network.sh createChannel
```

## Deploy a smart contract

To deploy a smart contract you need to first launch the network with a channel.
Then you can execute the following command.

```bash
./network.sh deployCC -ccn NAME -ccp PATH -ccl LANG -ccv VERSION -ccs SEQUENCE [-cci initLedger]
```

To deploy the smart contract of the pig management contract we use the following command

```bash
./network.sh deployCC -ccn pigManagement -ccp ../chaincode/pig -ccl go -ccv 2.3 -ccs 5 
```

Where NAME is the name of the chaincode to be deployed. PATH is where the code is located (only the folder) and LANG is the language that the chaincode is written. It could be either Go, Java or Javascript.

We use the ccv and ccs parameter to setup the chaincode version, the first deployment should be v1.0.0 and secuence 1. To update the code we need to deploy a higher version with the next sequence number.

The `cci` attribute is optional and is used to launch an init function. It may be useful to launch the contract and create some initial data. In the example, the script will be calling the function `initLedger` of the contract as soon as it is deployed.

## Using the Peer commands

If you need to execute peer commands you can either attach a terminal to one of the containers or also use the `setOrgEnv.sh` script to setup the environment of a given Organization.
There are two available peer configs: Farm or Factory.

First you will need to add the Fabric binaries to the PATH.

```bash
 export PATH=$PATH:$(realpath ../bin)
 export FABRIC_CFG_PATH=$(realpath ../config)
```

You can then set up the environment variables for each organization. The `./setOrgEnv.sh` command is designed to be run as follows.

```bash
export $(./setOrgEnv.sh ORG | xargs)
```

Change ORG by either Farm or Factory.

## Debug and logs

We can check the logs of each local peer by using docker commands.

```bash
docker ps
```
We can use docker ps to get the active containers and their id. With the id we can get the logs by running.

```bash
docker logs XXXX [-f]
```
Replace XXX with the id seen with docker ps. The -f argument is very useful to follow the logs in realtime.

## Hyperledger Explorer

Hyperledger explorer is a tool made by the Linux Foundation that allows exploring a given hyperledger network and see the different transactions that are being committed to the ledger.

To run a local instance review the contents in the file connection-profile/test-network.json to match the existing files over the organization folder.
Then run the following command in the network file
```bash
docker-compose up -d
```

This will create a docker container running the explorer. Then we will be able to browse the explorer by accessing:
http://localhost:8080
If you can't access use the steps defined above to check the logs and see what's wrong.

The credentials are:
```bash
exploreradmin:exploreradminpw
```