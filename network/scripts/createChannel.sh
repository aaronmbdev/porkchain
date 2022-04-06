#!/bin/bash

# imports  
. scripts/envVar.sh
. scripts/utils.sh

CHANNEL_NAME="$1"
DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}

: ${CONTAINER_CLI:="docker"}
: ${CONTAINER_CLI_COMPOSE:="${CONTAINER_CLI}-compose"}
infoln "Using ${CONTAINER_CLI} and ${CONTAINER_CLI_COMPOSE}"

if [ ! -d "channel-artifacts" ]; then
	mkdir channel-artifacts
fi

createChannelGenesisBlock() {
	which configtxgen
	if [ "$?" -ne 0 ]; then
		fatalln "configtxgen tool not found."
	fi
	local output_block=./channel-artifacts/${CHANNEL_NAME}.block
	if test -f "$output_block"; then
		infoln "Genesis block already exists, skipping creation"
	else 
		set -x
		configtxgen -profile TwoOrgsApplicationGenesis -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
		res=$?
		{ set +x; } 2>/dev/null
	verifyResult $res "Failed to generate channel genesis block..."

	set -x
		configtxgen -profile TwoOrgsChannel -channelID ${CHANNEL_NAME} -outputCreateChannelTx channel-artifacts/${CHANNEL_NAME}.tx
		res=$?
		{ set +x; } 2>/dev/null
	verifyResult $res "Failed to generate channel configuration transaction..."
	fi
}

createChannel() {
	setGlobals 1
	# Poll in case the raft leader is not set yet
	local rc=1
	local COUNTER=1
	local output_block=./channel-artifacts/${CHANNEL_NAME}.block
	if test -f "$output_block"; then
		while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
			sleep $DELAY
			set -x
			osnadmin channel join --channelID $CHANNEL_NAME --config-block ./channel-artifacts/${CHANNEL_NAME}.block -o localhost:7053 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY" >&log.txt
			res=$?
			{ set +x; } 2>/dev/null
			let rc=$res
			COUNTER=$(expr $COUNTER + 1)
		done
		verifyResult $res "Channel creation failed"
		successln "Channel '$CHANNEL_NAME' created"
	fi
}


# joinChannel ORG
joinChannel() {
  FABRIC_CFG_PATH=$PWD/../config/
  ORG=$1
  setGlobals $ORG
	local rc=1
	local COUNTER=1
	## Sometimes Join takes time, hence retry
	local channels=`peer channel list`
	if [[ "$channels" == *"$CHANNEL_NAME"* ]]; then
		infoln "The peer from org $ORG is already in the channel, skipping joining"
	else 
		while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
		sleep $DELAY
		set -x
		peer channel join -b $BLOCKFILE >&log.txt
		res=$?
		{ set +x; } 2>/dev/null
			let rc=$res
			COUNTER=$(expr $COUNTER + 1)
		done
		cat log.txt
		verifyResult $res "After $MAX_RETRY attempts, Org ${ORG} has failed to join channel '$CHANNEL_NAME' "
	fi
}

FABRIC_CFG_PATH=${PWD}/configtx

## Create channel genesis block
infoln "Generating channel genesis block '${CHANNEL_NAME}.block'"
createChannelGenesisBlock

FABRIC_CFG_PATH=$PWD/../config/
BLOCKFILE="./channel-artifacts/${CHANNEL_NAME}.block"

## Create channel
infoln "Creating channel ${CHANNEL_NAME}"
createChannel

## Join all the peers to the channel
infoln "Joining org1 peer to the channel..."
joinChannel 1
infoln "Joining org2 peer to the channel..."
joinChannel 2
infoln "Joining org3 peer to the channel..."
joinChannel 3

successln "Channel '$CHANNEL_NAME' joined"
