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
	var changelog string
	pig, err := c.ReadPig(ctx, pigId)
	if err != nil {
		return err
	}

	if parentId != "" {
		_, err := c.ReadPig(ctx, parentId)
		if err != nil {
			return err
		}
		changelog = changelog + " Updated parent from " + pig.ParentID + " to " + parentId + ". "
		pig.ParentID = parentId
	}

	if birthdate != "" {
		parsedDate, err := date.ParseISO(birthdate)
		if err != nil {
			return fmt.Errorf(error_parsing_date, err)
		}
		changelog = changelog + " Updated birthdate from " + pig.Birthdate + " to " + birthdate + ". "
		pig.Birthdate = parsedDate.String()
	}

	if breed != "" {
		changelog = changelog + " Updated breed from " + pig.Breed + " to " + breed + ". "
		pig.Breed = breed
	}

	if location != "" {
		_, err := c.ReadCage(ctx, location)
		if err != nil {
			return err
		}
		changelog = changelog + " Updated location from " + pig.Location + " to " + location + ". "
		pig.Location = location
	}

	UpdateRecord := UpdateRecord{
		Date: date.Today().String(),
		Data: changelog,
	}
	pig.UpdateRecords = append(pig.UpdateRecords, UpdateRecord)

	bytes, _ := json.Marshal(pig)
	return ctx.GetStub().PutState(pigId, bytes)

}

func (c *PigContract) SlaughterPig(ctx contractapi.TransactionContextInterface, pigID string) error {
	pig, err := c.ReadPig(ctx, pigID)
	if err != nil {
		return err
	}
	if pig.Status != PigStatus_alive {
		return fmt.Errorf(error_pig_slaughtered, pigID)
	}
	pig.Status = PigStatus_slaughtered
	pig.UpdateRecords = append(pig.UpdateRecords, UpdateRecord{
		Date: date.Today().String(),
		Data: pig_slaughtered,
	})

	pigBytes, _ := json.Marshal(pig)

	return ctx.GetStub().PutState(pigID, pigBytes)
}

func (c *PigContract) CreatePig(
	ctx contractapi.TransactionContextInterface,
	id string,
	parentId string,
	birthdate string,
	breed string,
	location string) error {

	if id != "" {
		exists, err := c.PigExists(ctx, id)
		if err != nil {
			return err
		}
		if !exists {
			return fmt.Errorf(error_pig_already_exists, id)
		}
	} else {
		return fmt.Errorf(error_pig_id_required)
	}

	if parentId != "" {
		exists, err := c.PigExists(ctx, parentId)
		if err != nil {
			return err
		}
		if !exists {
			return fmt.Errorf(error_parent_not_exists, parentId)
		}
	}

	parsedDate, err := date.ParseISO(birthdate)
	if err != nil {
		return fmt.Errorf(error_parsing_date, err)
	}

	exists, err := c.CageExists(ctx, location)
	if err != nil {
		return fmt.Errorf(error_state_reading)
	} else if !exists {
		return fmt.Errorf(error_cage_not_exists, location)
	}

	pig := Pig{
		ParentID:  parentId,
		Birthdate: parsedDate.String(),
		Breed:     breed,
		Location:  location,
		Status:    PigStatus_alive,
	}

	bytes, _ := json.Marshal(pig)
	return ctx.GetStub().PutState(id, bytes)
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
