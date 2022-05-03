package main

import (
	"encoding/json"
	"github.com/fxtlabs/date"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func (c *PigContract) createUpdateRecord(ctx contractapi.TransactionContextInterface, pigId string, content string) error {
	record := UpdateRecord{
		PigID: pigId,
		Date:  date.Today().String(),
		Data:  content,
	}
	recordBytes, _ := json.Marshal(record)
	id, err := c.generateID(ctx)
	if err != nil {
		return err
	}
	id = "UPDATE_" + id
	return ctx.GetStub().PutState(id, recordBytes)
}

func (c *PigContract) createHealthCheck(ctx contractapi.TransactionContextInterface, pigId string, vetId string, remarks string) error {
	record := HealthRecord{
		PigID: pigId,
		Date:  date.Today().String(),
		VetID: vetId,
		Data:  remarks,
	}
	recordBytes, _ := json.Marshal(record)
	id, err := c.generateID(ctx)
	if err != nil {
		return err
	}
	id = "HEALTH_" + id
	return ctx.GetStub().PutState(id, recordBytes)
}

func (c *PigContract) feed(ctx contractapi.TransactionContextInterface, pigId string, foodData string) error {
	record := FeedingRecord{
		PigID: pigId,
		Date:  date.Today().String(),
		Data:  foodData,
	}
	recordBytes, _ := json.Marshal(record)
	id, err := c.generateID(ctx)
	if err != nil {
		return err
	}
	id = "FEED_" + id
	return ctx.GetStub().PutState(id, recordBytes)
}
