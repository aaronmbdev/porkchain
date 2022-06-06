package main

import (
	"encoding/json"
	"fmt"
	"github.com/fxtlabs/date"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func (c *PigContract) PigExists(ctx contractapi.TransactionContextInterface, pigID string) (bool, error) {
	return c._EntityExists(ctx, pigID)
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
	recordId string,
	pigId string,
	parentId string,
	birthdate string,
	breed string,
	location string) error {
	var changelog string

	assetExists, _ := c._EntityExists(ctx, recordId)
	if assetExists {
		return fmt.Errorf(error_record_already_exists, recordId)
	}

	pig, err := c.ReadPig(ctx, pigId)
	if err != nil {
		return err
	}

	if parentId != "" {
		_, err := c.ReadPig(ctx, parentId)
		if err != nil {
			return err
		}
		parent := pig.ParentID
		if parent == "" {
			parent = "no parent"
		}
		changelog = changelog + " Updated parent from " + parent + " to " + parentId + ". "
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

	updateRecord := HistoryRecord{
		RecordType: "update",
		AssetType:  "record",
		PigID:      pigId,
		Date:       date.Today().String(),
		Data:       changelog,
	}

	recordBytes, _ := json.Marshal(updateRecord)
	recordId = "RECORD_" + recordId
	err = ctx.GetStub().PutState(recordId, recordBytes)
	if err != nil {
		return fmt.Errorf(error_could_not_add_registry)
	}

	bytes, _ := json.Marshal(pig)
	return ctx.GetStub().PutState(pigId, bytes)

}

func (c *PigContract) SlaughterPig(ctx contractapi.TransactionContextInterface, pigID string, recordId string) error {
	pig, err := c.ReadPig(ctx, pigID)
	if err != nil {
		return err
	}
	if pig.Status != PigStatus_alive {
		return fmt.Errorf(error_pig_slaughtered, pigID)
	}
	pig.Status = PigStatus_slaughtered

	updateRecord := HistoryRecord{
		RecordType: "update",
		AssetType:  "record",
		PigID:      pigID,
		Date:       date.Today().String(),
		Data:       fmt.Sprintf(pig_slaughtered, pigID),
	}
	recordBytes, _ := json.Marshal(updateRecord)
	recordId = "RECORD_" + recordId
	err = ctx.GetStub().PutState(recordId, recordBytes)
	if err != nil {
		return fmt.Errorf(error_could_not_add_registry)
	}

	pigBytes, _ := json.Marshal(pig)
	return ctx.GetStub().PutState(pigID, pigBytes)
}

func (c *PigContract) FeedPig(ctx contractapi.TransactionContextInterface, pigID string, food string, recordId string) error {
	pig, err := c.ReadPig(ctx, pigID)
	if err != nil {
		return err
	}
	if pig.Status != PigStatus_alive {
		return fmt.Errorf(error_pig_dead, pigID)
	}

	updateRecord := HistoryRecord{
		RecordType: "food",
		AssetType:  "record",
		PigID:      pigID,
		Date:       date.Today().String(),
		Data:       fmt.Sprintf(pig_fed, pigID, food),
	}
	recordBytes, _ := json.Marshal(updateRecord)
	recordId = "RECORD_" + recordId
	err = ctx.GetStub().PutState(recordId, recordBytes)
	if err != nil {
		return fmt.Errorf(error_could_not_add_registry)
	}

	pigBytes, _ := json.Marshal(pig)
	return ctx.GetStub().PutState(pigID, pigBytes)
}

func (c *PigContract) HealthReview(ctx contractapi.TransactionContextInterface, pigID string, vetId string, data string, recordId string) error {
	pig, err := c.ReadPig(ctx, pigID)
	if err != nil {
		return err
	}
	if pig.Status != PigStatus_alive {
		return fmt.Errorf(error_pig_dead, pigID)
	}

	updateRecord := HistoryRecord{
		RecordType: "health",
		AssetType:  "record",
		PigID:      pigID,
		Date:       date.Today().String(),
		Data:       fmt.Sprintf(pig_reviewed, pigID, vetId, data),
	}
	recordBytes, _ := json.Marshal(updateRecord)
	recordId = "RECORD_" + recordId
	err = ctx.GetStub().PutState(recordId, recordBytes)
	if err != nil {
		return fmt.Errorf(error_could_not_add_registry)
	}

	pigBytes, _ := json.Marshal(pig)
	return ctx.GetStub().PutState(pigID, pigBytes)
}

func (c *PigContract) CreatePig(
	ctx contractapi.TransactionContextInterface,
	id string,
	parentId string,
	birthdate string,
	breed string,
	location string) (*Pig, error) {
	id = "PIG_" + id
	if id != "" {
		exists, err := c.PigExists(ctx, id)
		if err != nil {
			return nil, err
		}
		if exists {
			return nil, fmt.Errorf(error_pig_already_exists, id)
		}
	} else {
		return nil, fmt.Errorf(error_pig_id_required)
	}

	if parentId != "" {
		exists, err := c.PigExists(ctx, parentId)
		if err != nil {
			return nil, err
		}
		if !exists {
			return nil, fmt.Errorf(error_parent_not_exists, parentId)
		}
	}

	parsedDate, err := date.ParseISO(birthdate)
	if err != nil {
		return nil, fmt.Errorf(error_parsing_date, err)
	}

	exists, err := c.CageExists(ctx, location)
	if err != nil {
		return nil, fmt.Errorf(error_state_reading)
	} else if !exists {
		return nil, fmt.Errorf(error_cage_not_exists, location)
	}

	pig := Pig{
		PigID:     id,
		AssetType: "pig",
		ParentID:  parentId,
		Birthdate: parsedDate.String(),
		Breed:     breed,
		Location:  location,
		Status:    PigStatus_alive,
	}

	bytes, _ := json.Marshal(pig)
	return &pig, ctx.GetStub().PutState(id, bytes)
}

func (c *PigContract) ListPigs(ctx contractapi.TransactionContextInterface, pageSize int32, bookmark string, deadOnly bool) (*PaginatedPigResult, error) {
	queryString := `{
	   "selector": {
		  "assetType": {"$eq": "pig"}
	   }
	}`
	if deadOnly {
		queryString = fmt.Sprintf(`{
		   "selector": {
			  "assetType": {"$eq": "pig"},
               "status": {"$eq": "%s"}
		   }
		}`, PigStatus_slaughtered)
	}
	return _queryStringPaginatedResponsePig(ctx, queryString, pageSize, bookmark)
}

func (c *PigContract) GetPigRecords(ctx contractapi.TransactionContextInterface, pigId string, pageSize int32, bookmark string) (*PaginatedRecordsResult, error) {
	queryString := fmt.Sprintf(`{
	   "selector": {
		  "assetType": {"$eq": "record"},
		"pigID": {"$eq": "%s"}
	   }
	}`, pigId)
	return _queryStringPaginatedResponseRecord(ctx, queryString, pageSize, bookmark)
}

func _queryStringPaginatedResponsePig(ctx contractapi.TransactionContextInterface, queryString string, pageSize int32, bookmark string) (*PaginatedPigResult, error) {
	resultsIterator, responseMetadata, err := ctx.GetStub().GetQueryResultWithPagination(queryString, pageSize, bookmark)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	assets, err := _constructResponseFromIteratorForPigs(resultsIterator)
	if err != nil {
		return nil, err
	}

	return &PaginatedPigResult{
		Records:             assets,
		FetchedRecordsCount: responseMetadata.FetchedRecordsCount,
		Bookmark:            responseMetadata.Bookmark,
	}, nil
}

func _queryStringPaginatedResponseRecord(ctx contractapi.TransactionContextInterface, queryString string, pageSize int32, bookmark string) (*PaginatedRecordsResult, error) {
	resultsIterator, responseMetadata, err := ctx.GetStub().GetQueryResultWithPagination(queryString, pageSize, bookmark)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	assets, err := _constructResponseFromIteratorForRecords(resultsIterator)
	if err != nil {
		return nil, err
	}

	return &PaginatedRecordsResult{
		Records:             assets,
		FetchedRecordsCount: responseMetadata.FetchedRecordsCount,
		Bookmark:            responseMetadata.Bookmark,
	}, nil
}

func _constructResponseFromIteratorForPigs(resultsIterator shim.StateQueryIteratorInterface) ([]*Pig, error) {
	var assets []*Pig
	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var asset Pig
		err = json.Unmarshal(queryResult.Value, &asset)
		if err != nil {
			return nil, err
		}
		assets = append(assets, &asset)
	}

	return assets, nil
}

func _constructResponseFromIteratorForRecords(resultsIterator shim.StateQueryIteratorInterface) ([]*HistoryRecord, error) {
	var assets []*HistoryRecord
	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var asset HistoryRecord
		err = json.Unmarshal(queryResult.Value, &asset)
		if err != nil {
			return nil, err
		}
		assets = append(assets, &asset)
	}

	return assets, nil
}
