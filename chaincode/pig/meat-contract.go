package main

import (
	"encoding/json"
	"fmt"
	"github.com/fxtlabs/date"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func (c *PigContract) CutMeat(ctx contractapi.TransactionContextInterface, updateId string, recordId string, pigId string, cut string, pieces int) error {
	pig, err := c.ReadPig(ctx, pigId)
	if err != nil {
		return err
	}

	if pig.Status != PigStatus_slaughtered {
		return fmt.Errorf(error_pig_must_be_slaugthered, pigId)
	}

	updateId = "RECORD_" + recordId
	updateRecord := HistoryRecord{
		RecordType: "update",
		AssetType:  "record",
		PigID:      pigId,
		Date:       date.Today().String(),
		Data:       fmt.Sprintf("Pig cut into %d pieces of %s", pieces, cut),
	}
	updateBytes, _ := json.Marshal(updateRecord)
	err = ctx.GetStub().PutState(updateId, updateBytes)

	recordId = "MEAT_" + recordId
	meat := Meat{
		AssetType:  "meat",
		PigID:      pigId,
		MeatID:     recordId,
		Cut:        cut,
		Pieces:     pieces,
		Production: date.Today().String(),
	}
	meatBytes, _ := json.Marshal(meat)
	return ctx.GetStub().PutState(recordId, meatBytes)
}

func (c *PigContract) ReadMeat(ctx contractapi.TransactionContextInterface, meatId string) (*Meat, error) {
	bytes, err := ctx.GetStub().GetState(meatId)

	if err != nil {
		return nil, fmt.Errorf(error_state_reading)
	}
	if bytes == nil {
		return nil, fmt.Errorf(error_asset_dont_exists, meatId)
	}

	cage := new(Meat)
	err = json.Unmarshal(bytes, cage)

	if err != nil {
		return nil, fmt.Errorf(error_not_a_meat)
	}

	return cage, nil
}

func (c *PigContract) QueryMeat(ctx contractapi.TransactionContextInterface, cut string, pageSize int32, bookmark string, minAmount int) (*PaginatedMeatResult, error) {
	queryString := fmt.Sprintf(`{
	   "selector": {
		  "assetType": {"$eq": "%s"},
          "cut": {"$eq": "%s"},
          "pieces": {"$gte": %d}
	   }
	}`, "meat", cut, minAmount)
	if cut == "" {
		queryString = fmt.Sprintf(`{
		   "selector": {
			  "assetType": {"$eq": "%s"},
			  "pieces": {"$gte": %d}
		   }
		}`, "meat", minAmount)
	}
	resultsIterator, responseMetadata, err := ctx.GetStub().GetQueryResultWithPagination(queryString, pageSize, bookmark)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	assets, err := _constructResponseFromIteratorForMeat(resultsIterator)
	if err != nil {
		return nil, err
	}

	return &PaginatedMeatResult{
		Records:             assets,
		FetchedRecordsCount: responseMetadata.FetchedRecordsCount,
		Bookmark:            responseMetadata.Bookmark,
	}, nil

}

func _constructResponseFromIteratorForMeat(resultsIterator shim.StateQueryIteratorInterface) ([]*Meat, error) {
	var assets []*Meat
	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var asset Meat
		err = json.Unmarshal(queryResult.Value, &asset)
		if err != nil {
			return nil, err
		}
		assets = append(assets, &asset)
	}

	return assets, nil
}
