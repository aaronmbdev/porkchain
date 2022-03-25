#!/usr/bin/env bash

# look for binaries in local dev environment /build/bin directory and then in local samples /bin directory
export PATH="${PWD}"/../../fabric/build/bin:"${PWD}"/../bin:"$PATH"
export FABRIC_CFG_PATH="${PWD}"/../config

export FABRIC_LOGGING_SPEC=INFO
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE="${PWD}"/crypto-config/peerOrganizations/factory.meatchain.cloud/peers/peer0.factory.meatchain.cloud/tls/ca.crt
export CORE_PEER_ADDRESS=127.0.0.1:7053
export CORE_PEER_LOCALMSPID=FactoryMSP
export CORE_PEER_MSPCONFIGPATH="${PWD}"/crypto-config/peerOrganizations/factory.meatchain.cloud/users/Admin@factory.meatchain.cloud/msp

# join peer to channel
peer channel join -b "${PWD}"/channel-artifacts/mychannel.block
