package main

import (
	"encoding/json"
	"fmt"
	"time"
	"github.com/fxtlabs/date"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"math/rand"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789")

type PigContract struct {
	contractapi.Contract
}

func (c *PigContract) generateID(ctx contractapi.TransactionContextInterface) (string,error) {
	rand.Seed(time.Now().UnixNano())
	b := make([]rune, 12)
    for i := range b {
        b[i] = letters[rand.Intn(len(letters))]
    }

	exists, err := c.EntityExists(ctx, string(b))
	if err != nil {
		return "", fmt.Errorf("Could not read from world state. %s", err)
	} else if exists {
		return c.generateID(ctx)
	}

    return string(b), nil
}

func (c *PigContract) EntityExists(ctx contractapi.TransactionContextInterface, entityId string) (bool,error) {
	data, err := ctx.GetStub().GetState(entityId)
	if err != nil {
		return false, err
	}
	return data != nil, nil
}

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

func (c *PigContract) CageExists(ctx contractapi.TransactionContextInterface, cageId string) (bool, error) {
	return c.EntityExists(ctx, cageId);
}


func (c *PigContract) PigExists(ctx contractapi.TransactionContextInterface, pigID string) (bool, error) {
	return c.EntityExists(ctx, pigID);
}

func (c *PigContract) CreatePig(
	ctx contractapi.TransactionContextInterface, 
	parentId string,
	birthdate string,
	breed string,
	location string,
	status string ) error {
		
	if parentId != "" {
		exists, err := c.PigExists(ctx, parentId)
		if err != nil {
			return fmt.Errorf("Could not read from world state. %s", err)
		} else if !exists {
			return fmt.Errorf("The parent %s not exists", parentId)
		}
	}

	parsedDate, err := date.ParseISO(birthdate)
	if err != nil {
		return fmt.Errorf("Error parsing birthdate. %s", err)
	}

	exists, err := c.CageExists(ctx, location)
	if err != nil {
		return fmt.Errorf("Could not read from world state. %s", err)
	} else if !exists {
		return fmt.Errorf("The cage %s not exists", location)
	}

	pig := Pig{
		ParentID: parentId,
		Birthdate: parsedDate,
		Breed: breed,
		Location: location,
		Status: status,
	}

	bytes, _ := json.Marshal(pig)
	id, err := c.generateID(ctx)
	if err != nil {
		return fmt.Errorf("Could not read from world state. %s", err)
	}
	return ctx.GetStub().PutState(id, bytes)
}