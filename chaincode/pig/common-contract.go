package main

import (
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"math/rand"
	"time"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789")
var stateError = "there was an error communicating with the Blockchain state"

type PigContract struct {
	contractapi.Contract
}

func (c *PigContract) generateID(ctx contractapi.TransactionContextInterface) (string, error) {
	rand.Seed(time.Now().UnixNano())
	b := make([]rune, 12)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}

	exists, err := c.EntityExists(ctx, string(b))
	if err != nil {
		return "", fmt.Errorf(stateError)
	} else if exists {
		return c.generateID(ctx)
	}
	return string(b), nil
}

func (c *PigContract) EntityExists(ctx contractapi.TransactionContextInterface, entityId string) (bool, error) {
	data, err := ctx.GetStub().GetState(entityId)
	if err != nil {
		return false, err
	}
	return data != nil, nil
}
