package main

import (
	"encoding/json"
	"fmt"
	"github.com/fxtlabs/date"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func (c *PigContract) PigExists(ctx contractapi.TransactionContextInterface, pigID string) (bool, error) {
	return c.EntityExists(ctx, pigID)
}

func (c *PigContract) ReadPig(ctx contractapi.TransactionContextInterface, pigID string) (*Pig, error) {
	bytes, err := ctx.GetStub().GetState(pigID)

	if err != nil {
		return nil, fmt.Errorf(stateError)
	}
	if bytes == nil {
		return nil, fmt.Errorf("The asset %s does not exist", pigID)
	}

	pig := new(Pig)
	err = json.Unmarshal(bytes, pig)

	if err != nil {
		return nil, fmt.Errorf("The entity requested is not a Pig")
	}

	return pig, nil
}

/*func (c *PigContract) UpdatePig(ctx contractapi.TransactionContextInterface, pigID string, newValue string) error {
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
}*/

/* Find the functions we should interact with below */

func (c *PigContract) CreatePig(
	ctx contractapi.TransactionContextInterface,
	parentId string,
	birthdate string,
	breed string,
	location string,
	status string) error {

	if parentId != "" {
		exists, err := c.PigExists(ctx, parentId)
		if err != nil {
			return fmt.Errorf(stateError)
		} else if !exists {
			return fmt.Errorf("The parent %s doesn't exists", parentId)
		}
	}

	parsedDate, err := date.ParseISO(birthdate)
	if err != nil {
		return fmt.Errorf("Error parsing birthdate. %s", err)
	}

	exists, err := c.CageExists(ctx, location)
	if err != nil {
		return fmt.Errorf(stateError)
	} else if !exists {
		return fmt.Errorf("The cage %s doesn't exists", location)
	}

	pig := Pig{
		ParentID:  parentId,
		Birthdate: parsedDate,
		Breed:     breed,
		Location:  location,
		Status:    status,
	}

	bytes, _ := json.Marshal(pig)
	id, err := c.generateID(ctx)
	if err != nil {
		return fmt.Errorf(stateError)
	}
	return ctx.GetStub().PutState(id, bytes)
}
