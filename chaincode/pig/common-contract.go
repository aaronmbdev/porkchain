package main

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type PigContract struct {
	contractapi.Contract
}

func (c *PigContract) _EntityExists(ctx contractapi.TransactionContextInterface, entityId string) (bool, error) {
	data, err := ctx.GetStub().GetState(entityId)
	if err != nil {
		return false, err
	}
	return data != nil, nil
}
