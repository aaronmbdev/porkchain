#!/usr/bin/env bash

# look for binaries in local dev environment /build/bin directory and then in local samples /bin directory
export PATH="${PWD}"/../../fabric/build/bin:"${PWD}"/../bin:"$PATH"
export FABRIC_CFG_PATH="${PWD}"/../config

export FABRIC_LOGGING_SPEC=INFO
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE="${PWD}"/crypto-config/peerOrganizations/farm.meatchain.cloud/peers/peer0.farm.meatchain.cloud/tls/ca.crt
export CORE_PEER_ADDRESS=127.0.0.1:7051
export CORE_PEER_LOCALMSPID=FarmMSP
export CORE_PEER_MSPCONFIGPATH="${PWD}"/crypto-config/peerOrganizations/farm.meatchain.cloud/users/Admin@farm.meatchain.cloud/msp

# peer1 admin will be responsible for creating channel and adding anchor peer
peer channel create -c mychannel -o 127.0.0.1:6050 -f "${PWD}"/channel-artifacts/mychannel.tx --outputBlock "${PWD}"/channel-artifacts/mychannel.block  --tls --cafile "${PWD}"/crypto-config/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/tls/ca.crt
peer channel update -o 127.0.0.1:6050 -c mychannel -f "${PWD}"/channel-artifacts/FarmMSPanchors.tx --tls --cafile "${PWD}"/crypto-config/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/tls/ca.crt

# join peer to channel
peer channel join -b "${PWD}"/channel-artifacts/mychannel.block
