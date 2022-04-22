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
		return nil, fmt.Errorf(error_state_reading)
	}
	if bytes == nil {
		return nil, fmt.Errorf(error_asset_dont_exists, pigID)
	}

	pig := new(Pig)
	err = json.Unmarshal(bytes, pig)

	if err != nil {
		return nil, fmt.Errorf(error_not_a_pig)
	}

	return pig, nil
}
func (c *PigContract) UpdatePig(
	ctx contractapi.TransactionContextInterface,
	pigId string,
	parentId string,
	birthdate string,
	breed string,
	location string) error {
	return nil
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

func (c *PigContract) SlaughterPig(ctx contractapi.TransactionContextInterface, pigID string) error {
	pig, err := c.ReadPig(ctx, pigID)
	if err != nil {
		return err
	}
	if pig.Status != PigStatus_alive {
		return fmt.Errorf(error_pig_slaughtered, pigID)
	}
	pig.Status = PigStatus_slaughtered
	pigBytes, _ := json.Marshal(pig)

	err = c.createUpdateRecord(ctx, pigID, pig_slaughtered)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(pigID, pigBytes)
}

func (c *PigContract) CreatePig(
	ctx contractapi.TransactionContextInterface,
	parentId string,
	birthdate string,
	breed string,
	location string) (string, error) {

	if parentId != "" {
		exists, err := c.PigExists(ctx, parentId)
		if err != nil {
			return "", fmt.Errorf(error_state_reading)
		} else if !exists {
			return "", fmt.Errorf(error_parent_not_exists, parentId)
		}
	}

	parsedDate, err := date.ParseISO(birthdate)
	if err != nil {
		return "", fmt.Errorf(error_parsing_date, err)
	}

	exists, err := c.CageExists(ctx, location)
	if err != nil {
		return "", fmt.Errorf(error_state_reading)
	} else if !exists {
		return "", fmt.Errorf(error_cage_not_exists, location)
	}

	pig := Pig{
		ParentID:  parentId,
		Birthdate: parsedDate,
		Breed:     breed,
		Location:  location,
		Status:    PigStatus_alive,
	}

	bytes, _ := json.Marshal(pig)
	id, err := c.generateID(ctx)
	if err != nil {
		return "", fmt.Errorf(error_state_reading)
	}
	id = "PIG_" + id
	return id, ctx.GetStub().PutState(id, bytes)
}

func (c *PigContract) ListPigs(ctx contractapi.TransactionContextInterface, start string, end string, bookmark string) ([]*Pig, error) {
	iterator, _, err := ctx.GetStub().GetStateByRangeWithPagination(start, end, 10, bookmark)
	if err != nil {
		return nil, fmt.Errorf(error_list_pigs, err)
	}
	defer iterator.Close()

	var assets []*Pig
	for iterator.HasNext() {
		response, err := iterator.Next()
		if err != nil {
			return nil, err
		}
		var pig Pig
		err = json.Unmarshal(response.Value, &pig)
		if err == nil && pig.Status == PigStatus_alive {
			assets = append(assets, &pig)
		}
	}
	return assets, nil
}
