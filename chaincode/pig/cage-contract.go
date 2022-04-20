package main

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func (c *PigContract) CageExists(ctx contractapi.TransactionContextInterface, cageId string) (bool, error) {
	return c.EntityExists(ctx, cageId)
}

func (c *PigContract) CreateCage(ctx contractapi.TransactionContextInterface, name string) error {
	id, err := c.generateID(ctx)
	if err != nil {
		return fmt.Errorf(stateError)
	}
	cage := Cage{
		Name: name,
	}
	cageBytes, _ := json.Marshal(cage)
	return ctx.GetStub().PutState(id, cageBytes)
}

func (c *PigContract) ReadCage(ctx contractapi.TransactionContextInterface, id string) (*Cage, error) {
	bytes, err := ctx.GetStub().GetState(id)

	if err != nil {
		return nil, fmt.Errorf(stateError)
	}
	if bytes == nil {
		return nil, fmt.Errorf("The asset %s does not exist", id)
	}

	cage := new(Cage)
	err = json.Unmarshal(bytes, cage)

	if err != nil {
		return nil, fmt.Errorf("The entity requested is not a Cage")
	}

	return cage, nil
}

func (c *PigContract) DeleteCage(ctx contractapi.TransactionContextInterface, id string) error {
	_, err := c.ReadCage(ctx, id)
	if err != nil {
		return err
	}
	return ctx.GetStub().DelState(id)
}
