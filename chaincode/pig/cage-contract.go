package main

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func (c *PigContract) CageExists(ctx contractapi.TransactionContextInterface, cageId string) (bool, error) {
	return c._EntityExists(ctx, cageId)
}

func (c *PigContract) CreateCage(ctx contractapi.TransactionContextInterface, id string, name string) error {
	exists, err := c.CageExists(ctx, id)
	if exists || err != nil {
		return fmt.Errorf(error_cage_aleady_exists, id)
	}
	id = "CAGE_" + id
	cage := Cage{
		CageID:    id,
		AssetType: "cage",
		Name:      name,
	}
	cageBytes, _ := json.Marshal(cage)
	return ctx.GetStub().PutState(id, cageBytes)
}

func (c *PigContract) ReadCage(ctx contractapi.TransactionContextInterface, id string) (*Cage, error) {
	bytes, err := ctx.GetStub().GetState(id)

	if err != nil {
		return nil, fmt.Errorf(error_state_reading)
	}
	if bytes == nil {
		return nil, fmt.Errorf(error_asset_dont_exists, id)
	}

	cage := new(Cage)
	err = json.Unmarshal(bytes, cage)

	if err != nil {
		return nil, fmt.Errorf(error_not_a_cage)
	}

	return cage, nil
}

func (c *PigContract) DeleteCage(ctx contractapi.TransactionContextInterface, id string) error {
	_, err := c.ReadCage(ctx, id)
	if err != nil {
		return err
	}
	pigsInCage, err := c.PigsInCage(ctx, id)
	if pigsInCage && err == nil {
		return fmt.Errorf(error_can_delete_cage, id)
	}
	return ctx.GetStub().DelState(id)
}

func (c *PigContract) ListCages(ctx contractapi.TransactionContextInterface, pageSize int32, bookmark string) (*PaginatedCageResult, error) {
	var assets []*Cage
	queryString := `{
	   "selector": {
		  "assetType": {"$eq": "cage"}
	   }
	}`
	resultsIterator, responseMetadata, err := ctx.GetStub().GetQueryResultWithPagination(queryString, pageSize, bookmark)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		queryResult, err2 := resultsIterator.Next()
		if err2 != nil {
			return nil, err2
		}
		var asset Cage
		err2 = json.Unmarshal(queryResult.Value, &asset)
		if err2 != nil {
			return nil, err2
		}
		assets = append(assets, &asset)
	}

	return &PaginatedCageResult{
		Records:             assets,
		FetchedRecordsCount: responseMetadata.FetchedRecordsCount,
		Bookmark:            responseMetadata.Bookmark,
	}, nil
}

func (c *PigContract) PigsInCage(ctx contractapi.TransactionContextInterface, cageId string) (bool, error) {
	_, err := c.ReadCage(ctx, cageId)
	if err != nil {
		return false, err
	}
	queryString := fmt.Sprintf(`{
	   "selector": {
		  "assetType": {"$eq": "pig"},
          "status": {"$eq": "%s"},
		  "location": {"$eq": "%s"}
	   }
	}`, PigStatus_alive, cageId)
	iterator, errAux := ctx.GetStub().GetQueryResult(queryString)
	if errAux != nil {
		return false, errAux
	}
	defer iterator.Close()
	return iterator.HasNext(), nil
}

func (c *PigContract) GetAllPigsInCage(ctx contractapi.TransactionContextInterface, cageId string, pageSize int32, bookmark string) (*PaginatedPigResult, error) {
	var assets []*Pig
	_, err := c.ReadCage(ctx, cageId)
	if err != nil {
		return nil, err
	}
	queryString := fmt.Sprintf(`{
	   "selector": {
		  "assetType": {"$eq": "pig"},
          "status": {"$eq": "%s"},
          "location": {"$eq": "%s"}
	   }
	}`, PigStatus_alive, cageId)
	resultsIterator, responseMetadata, err := ctx.GetStub().GetQueryResultWithPagination(queryString, pageSize, bookmark)
	if err != nil {
		return nil, err
	}

	for resultsIterator.HasNext() {
		queryResult, err2 := resultsIterator.Next()
		if err2 != nil {
			return nil, err2
		}
		var asset Pig
		err2 = json.Unmarshal(queryResult.Value, &asset)
		if err2 != nil {
			return nil, err2
		}
		assets = append(assets, &asset)
	}

	return &PaginatedPigResult{
		Records:             assets,
		FetchedRecordsCount: responseMetadata.FetchedRecordsCount,
		Bookmark:            responseMetadata.Bookmark,
	}, nil
}
