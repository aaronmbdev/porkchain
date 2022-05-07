package main

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-chaincode-go/shim"
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
	cage := Cage{
		CageID:    id,
		AssetType: "cage",
		Name:      name,
	}
	id = "CAGE_" + id
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

	assets, err := _constructResponseFromIteratorForCages(resultsIterator)
	if err != nil {
		return nil, err
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
		  "location": {"$eq": "%s"}
	   }
	}`, cageId)
	iterator, errAux := ctx.GetStub().GetQueryResult(queryString)
	if errAux != nil {
		return false, errAux
	}
	defer iterator.Close()
	return iterator.HasNext(), nil
}

func (c *PigContract) GetAllPigsInCage(ctx contractapi.TransactionContextInterface, cageId string) ([]*Pig, error) {
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
	iterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer iterator.Close()
	response, err := _constructResponseFromIteratorForPigs(iterator)
	if err != nil {
		return nil, err
	}
	return response, nil
}

func _constructResponseFromIteratorForCages(resultsIterator shim.StateQueryIteratorInterface) ([]*Cage, error) {
	var assets []*Cage
	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var asset Cage
		err = json.Unmarshal(queryResult.Value, &asset)
		if err != nil {
			return nil, err
		}
		assets = append(assets, &asset)
	}

	return assets, nil
}
