#!/bin/bash
# Local environment launch script. It deletes the existing content to start again
./network.sh down
./network.sh up createChannel
./network.sh deployCC -ccn porkManagement -ccp ../chaincode/pig -ccl go
docker-compose up