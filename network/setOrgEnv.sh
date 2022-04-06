#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0




# default to using Org1
ORG=${1:-Farm}

# Exit on first error, print all commands.
set -e
set -o pipefail

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

ORDERER_CA=${DIR}/network/organizations/ordererOrganizations/meatchain.cloud/tlsca/tlsca.meatchain.cloud-cert.pem
PEER0_ORG1_CA=${DIR}/network/organizations/peerOrganizations/farm.meatchain.cloud/tlsca/tlsca.farm.meatchain.cloud-cert.pem
PEER0_ORG2_CA=${DIR}/network/organizations/peerOrganizations/factory.meatchain.cloud/tlsca/tlsca.factory.meatchain.cloud-cert.pem


if [[ ${ORG,,} == "Farm" || ${ORG,,} == "farm" ]]; then

   CORE_PEER_LOCALMSPID=FarmMSP
   CORE_PEER_MSPCONFIGPATH=${DIR}/network/organizations/peerOrganizations/farm.meatchain.cloud/users/Admin@farm.meatchain.cloud/msp
   CORE_PEER_ADDRESS=localhost:7051
   CORE_PEER_TLS_ROOTCERT_FILE=${DIR}/network/organizations/peerOrganizations/farm.meatchain.cloud/tlsca/tlsca.farm.meatchain.cloud-cert.pem

elif [[ ${ORG,,} == "Factory" || ${ORG,,} == "factory" ]]; then

   CORE_PEER_LOCALMSPID=FactoryMSP
   CORE_PEER_MSPCONFIGPATH=${DIR}/network/organizations/peerOrganizations/factory.meatchain.cloud/users/Admin@factory.meatchain.cloud/msp
   CORE_PEER_ADDRESS=localhost:9051
   CORE_PEER_TLS_ROOTCERT_FILE=${DIR}/network/organizations/peerOrganizations/factory.meatchain.cloud/tlsca/tlsca.farm.meatchain.cloud-cert.pem

else
   echo "Unknown \"$ORG\", please choose Farm or Factory"
   echo "For example to get the environment variables to set up Farm shell environment run:  ./setOrgEnv.sh Farm"
   echo
   echo "This can be automated to set them as well with:"
   echo
   echo 'export $(./setOrgEnv.sh Farm | xargs)'
   exit 1
fi

# output the variables that need to be set
echo "CORE_PEER_TLS_ENABLED=true"
echo "ORDERER_CA=${ORDERER_CA}"
echo "PEER0_ORG1_CA=${PEER0_ORG1_CA}"
echo "PEER0_ORG2_CA=${PEER0_ORG2_CA}"

echo "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH}"
echo "CORE_PEER_ADDRESS=${CORE_PEER_ADDRESS}"
echo "CORE_PEER_TLS_ROOTCERT_FILE=${CORE_PEER_TLS_ROOTCERT_FILE}"

echo "CORE_PEER_LOCALMSPID=${CORE_PEER_LOCALMSPID}"
