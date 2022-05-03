package main

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/hyperledger/fabric-contract-api-go/metadata"
)

func main() {
	pigContract := new(PigContract)
	pigContract.Info.Version = "0.1.0"
	pigContract.Info.Description = "Pig Management Smart Contract"
	pigContract.Info.License = new(metadata.LicenseMetadata)
	pigContract.Info.License.Name = "Apache-2.0"
	pigContract.Info.Contact = new(metadata.ContactMetadata)
	pigContract.Info.Contact.Name = "Aaron J. Morales Botton"
	chaincode, err := contractapi.NewChaincode(pigContract)

	if err != nil {
		panic("Could not create chaincode from PigContract." + err.Error())
	}

	chaincode.Info.Title = "pig chaincode"
	chaincode.Info.Version = "0.1.0"

	err = chaincode.Start()

	if err != nil {
		panic("Failed to start chaincode. " + err.Error())
	}
}
