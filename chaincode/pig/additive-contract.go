package main

import (
	"encoding/json"
	"fmt"
	"github.com/fxtlabs/date"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func (c *PigContract) CreateAdditive(ctx contractapi.TransactionContextInterface,
	adType string,
	resourceId string,
	name string,
	lotid string,
	expiry string) error {

	_, err := date.ParseISO(expiry)
	if err != nil {
		return fmt.Errorf(error_parsing_date, err)
	}

	resourceId = "ADD_" + resourceId
	exists, err := c._EntityExists(ctx, resourceId)
	if err != nil || exists {
		return fmt.Errorf(error_record_already_exists, resourceId)
	}

	err = _verifyAdditiveType(adType)
	if err != nil {
		return err
	}

	additive := Additive{
		AssetType:    AdditiveT,
		AdditiveID:   resourceId,
		AdditiveType: adType,
		Name:         name,
		LotID:        lotid,
		ExpiryDate:   expiry,
	}
	additiveBytes, _ := json.Marshal(additive)
	return ctx.GetStub().PutState(resourceId, additiveBytes)
}

func (c *PigContract) ReadAdditive(ctx contractapi.TransactionContextInterface, additiveId string) (*Additive, error) {
	bytes, err := ctx.GetStub().GetState(additiveId)

	if err != nil {
		return nil, fmt.Errorf(error_state_reading)
	}
	if bytes == nil {
		return nil, fmt.Errorf(error_asset_dont_exists, additiveId)
	}

	cage := new(Additive)
	err = json.Unmarshal(bytes, cage)

	if err != nil {
		return nil, fmt.Errorf(error_not_an_additive)
	}

	return cage, nil
}

func (c *PigContract) ListAdditives(ctx contractapi.TransactionContextInterface, adType string, pageSize int32, bookmark string) (*PaginatedAdditiveResult, error) {
	err := _verifyAdditiveType(adType)
	if err != nil {
		return nil, err
	}

	queryString := _getSeasoningListQuery()
	if adType == Sauce {
		queryString = _getSaucesListQuery()
	}
	if adType == "all" {
		queryString = _getAdditivesListQuery()
	}

	resultsIterator, responseMetadata, err := ctx.GetStub().GetQueryResultWithPagination(queryString, pageSize, bookmark)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	assets, err := _constructResponseFromIteratorForAdditives(resultsIterator)
	if err != nil {
		return nil, err
	}

	return &PaginatedAdditiveResult{
		Records:             assets,
		FetchedRecordsCount: responseMetadata.FetchedRecordsCount,
		Bookmark:            responseMetadata.Bookmark,
	}, nil
}

func _getSaucesListQuery() string {
	queryString := `{
	   "selector": {
		  "assetType": {"$eq": "%s"},
          "additiveType": {"$eq": "%s"}
	   }
	}`
	return fmt.Sprintf(queryString, AdditiveT, Sauce)
}

func _getSeasoningListQuery() string {
	queryString := `{
	   "selector": {
		  "assetType": {"$eq": "%s"},
          "additiveType": {"$eq": "%s"}
	   }
	}`
	return fmt.Sprintf(queryString, AdditiveT, Seasoning)
}

func _getAdditivesListQuery() string {
	queryString := `{
	   "selector": {
		  "assetType": {"$eq": "%s"},
	   }
	}`
	return fmt.Sprintf(queryString, AdditiveT)
}

func _verifyAdditiveType(adType string) error {
	if adType != Sauce && adType != Seasoning && adType != "all" {
		return fmt.Errorf(error_additive_type_unknown, adType)
	}
	return nil
}

func _constructResponseFromIteratorForAdditives(resultsIterator shim.StateQueryIteratorInterface) ([]*Additive, error) {
	var assets []*Additive
	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var asset Additive
		err = json.Unmarshal(queryResult.Value, &asset)
		if err != nil {
			return nil, err
		}
		assets = append(assets, &asset)
	}

	return assets, nil
}
