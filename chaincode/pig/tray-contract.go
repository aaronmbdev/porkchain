package main

import (
	"encoding/json"
	"fmt"
	"github.com/fxtlabs/date"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func (t *PigContract) PackMeat(ctx contractapi.TransactionContextInterface, trayId string, meats string, additivesInput string) error {
	var meatId []string
	var additives []string
	marshalErr := json.Unmarshal([]byte(meats), &meatId)

	if marshalErr != nil {
		return fmt.Errorf("Could not convert string to object: %s", meats)
	}

	marshalErr = json.Unmarshal([]byte(additivesInput), &additives)
	if marshalErr != nil {
		return fmt.Errorf("Could not convert string to object: %s", meats)
	}

	_, err := t._validateInputsForPacking(ctx, meatId)
	if err != nil {
		return err
	}

	err = t._validateAdditiveInputs(ctx, additives)
	if err != nil {
		return err
	}

	trayId = "TRAY_" + trayId
	newTray := Tray{
		AssetType: "tray",
		TrayID:    trayId,
		Additives: additives,
		Meats:     meatId,
	}
	bytes, _ := json.Marshal(newTray)
	return ctx.GetStub().PutState(trayId, bytes)
}

func (t *PigContract) GetTrays(ctx contractapi.TransactionContextInterface, pageSize int32, bookmark string) (*PaginatedTrayResult, error) {
	queryString := fmt.Sprintf(`{
		   "selector": {
			  "assetType": {"$eq": "%s"}
		   }
		}`, "tray")
	result, err := t._TraysFromQuery(ctx, queryString, pageSize, bookmark)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (t *PigContract) QueryTray(ctx contractapi.TransactionContextInterface, trayId string) (*Tray, error) {
	bytes, err := ctx.GetStub().GetState(trayId)
	if err != nil {
		return nil, err
	}
	if bytes == nil {
		return nil, fmt.Errorf("Tray %s does not exist", trayId)
	}
	var tray Tray
	err = json.Unmarshal(bytes, &tray)
	if err != nil {
		return nil, err
	}
	return &tray, nil
}

func (t *PigContract) QueryTraysByMeat(ctx contractapi.TransactionContextInterface, meatId string) (*PaginatedTrayResult, error) {
	var meats []string
	err := json.Unmarshal([]byte(meatId), &meats)
	if err != nil {
		return nil, fmt.Errorf("Could not convert string to object: %s", meatId)
	}
	err = t._validateMeats(ctx, meats)
	if err != nil {
		return nil, err
	}
	queryString := fmt.Sprintf(`{
	   "selector": {
		  "assetType": {
			 "$eq": "%s"
		  },
		  "meats": {
			 "$elemMatch": {
				"$or": %s
			 }
		  }
	   }
	}`, "tray", meatId)

	result, err := t._TraysFromQuery(ctx, queryString, 1000, "")
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (t *PigContract) QueryTraysByAdditive(ctx contractapi.TransactionContextInterface, additiveId string, mode string) (*PaginatedTrayResult, error) {
	var additives []string
	err := json.Unmarshal([]byte(additiveId), &additives)
	if err != nil {
		return nil, fmt.Errorf("Could not convert string to object: %s", additiveId)
	}
	err = t._validateAdditives(ctx, additives)
	if err != nil {
		return nil, err
	}
	queryString := fmt.Sprintf(`{
	   "selector": {
		  "assetType": {
			 "$eq": "%s"
		  },
		  "additives": {
			 "$elemMatch": {
				"$%s": %s
			 }
		  }
	   }
	}`, "tray", mode, additiveId)
	if mode == "all" {
		queryString = fmt.Sprintf(`{
	   "selector": {
		  "assetType": {
			 "$eq": "%s"
		  },
		  "additives": {
			 "$all": %s
		  }
	   }
	}`, "tray", additiveId)
	}
	result, err := t._TraysFromQuery(ctx, queryString, 1000, "")
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (t *PigContract) _TraysFromQuery(ctx contractapi.TransactionContextInterface, query string, pageSize int32, bookmark string) (*PaginatedTrayResult, error) {
	resultsIterator, responseMetadata, err := ctx.GetStub().GetQueryResultWithPagination(query, pageSize, bookmark)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	assets, err := _constructResponseFromIteratorForTray(resultsIterator)
	if err != nil {
		return nil, err
	}

	return &PaginatedTrayResult{
		Records:             assets,
		FetchedRecordsCount: responseMetadata.FetchedRecordsCount,
		Bookmark:            responseMetadata.Bookmark,
	}, nil
}

func (c *PigContract) _validateAdditives(ctx contractapi.TransactionContextInterface, additives []string) error {
	for i := range additives {
		additive := additives[i]
		_, err := c.ReadAdditive(ctx, additive)
		if err != nil {
			return err
		}
	}
	return nil
}

func (c *PigContract) _validateMeats(ctx contractapi.TransactionContextInterface, meats []string) error {
	for i := range meats {
		meat := meats[i]
		_, err := c.ReadMeat(ctx, meat)
		if err != nil {
			return err
		}
	}
	return nil
}

func _constructResponseFromIteratorForTray(resultsIterator shim.StateQueryIteratorInterface) ([]*Tray, error) {
	var assets []*Tray
	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var asset Tray
		err = json.Unmarshal(queryResult.Value, &asset)
		if err != nil {
			return nil, err
		}
		assets = append(assets, &asset)
	}

	return assets, nil
}

func (c *PigContract) _validateAdditiveInputs(ctx contractapi.TransactionContextInterface, sauces []string) error {
	for saucesIndex := range sauces {
		sauce, err := c.ReadAdditive(ctx, sauces[saucesIndex])
		if err != nil {
			return err
		}
		expiry, _ := date.ParseISO(sauce.ExpiryDate)
		if expiry.Before(date.Today()) {
			return fmt.Errorf("Additive %s is expired", sauces[saucesIndex])
		}
	}
	return nil
}

func (c *PigContract) _validateInputsForPacking(ctx contractapi.TransactionContextInterface, meats []string) ([]Meat, error) {
	var result []Meat
	for meatsIndex := range meats {
		meat, err := c.ReadMeat(ctx, meats[meatsIndex])
		if err != nil {
			return nil, err
		}
		result = append(result, *meat)
	}
	return result, nil
}
