package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// PigContract contract for managing CRUD for Pig
type PigContract struct {
	contractapi.Contract
}

// PigExists returns true when asset with given ID exists in world state
func (c *PigContract) PigExists(ctx contractapi.TransactionContextInterface, pigID string) (bool, error) {
	data, err := ctx.GetStub().GetState(pigID)

	if err != nil {
		return false, err
	}

	return data != nil, nil
}

// CreatePig creates a new instance of Pig
func (c *PigContract) CreatePig(ctx contractapi.TransactionContextInterface, pigID string, value string) error {
	exists, err := c.PigExists(ctx, pigID)
	if err != nil {
		return fmt.Errorf("Could not read from world state. %s", err)
	} else if exists {
		return fmt.Errorf("The asset %s already exists", pigID)
	}

	pig := new(Pig)
	pig.ID = value

	bytes, _ := json.Marshal(pig)

	return ctx.GetStub().PutState(pigID, bytes)
}

// ReadPig retrieves an instance of Pig from the world state
func (c *PigContract) ReadPig(ctx contractapi.TransactionContextInterface, pigID string) (*Pig, error) {
	exists, err := c.PigExists(ctx, pigID)
	if err != nil {
		return nil, fmt.Errorf("Could not read from world state. %s", err)
	} else if !exists {
		return nil, fmt.Errorf("The asset %s does not exist", pigID)
	}

	bytes, _ := ctx.GetStub().GetState(pigID)

	pig := new(Pig)

	err = json.Unmarshal(bytes, pig)

	if err != nil {
		return nil, fmt.Errorf("Could not unmarshal world state data to type Pig")
	}

	return pig, nil
}

// UpdatePig retrieves an instance of Pig from the world state and updates its value
func (c *PigContract) UpdatePig(ctx contractapi.TransactionContextInterface, pigID string, newValue string) error {
	exists, err := c.PigExists(ctx, pigID)
	if err != nil {
		return fmt.Errorf("Could not read from world state. %s", err)
	} else if !exists {
		return fmt.Errorf("The asset %s does not exist", pigID)
	}

	pig := new(Pig)
	pig.ID = newValue

	bytes, _ := json.Marshal(pig)

	return ctx.GetStub().PutState(pigID, bytes)
}

// DeletePig deletes an instance of Pig from the world state
func (c *PigContract) DeletePig(ctx contractapi.TransactionContextInterface, pigID string) error {
	exists, err := c.PigExists(ctx, pigID)
	if err != nil {
		return fmt.Errorf("Could not read from world state. %s", err)
	} else if !exists {
		return fmt.Errorf("The asset %s does not exist", pigID)
	}

	return ctx.GetStub().DelState(pigID)
}
