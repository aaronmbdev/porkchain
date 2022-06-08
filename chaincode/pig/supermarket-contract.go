package main

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func (t *PigContract) TraceTray(ctx contractapi.TransactionContextInterface, trayId string) (*TraceRecord, error) {
	var additives []*Additive
	var meats []*Meat
	var pigs []*Pig
	tray, err := t.QueryTray(ctx, trayId)
	if err != nil {
		return nil, err
	}
	for addIndex := range tray.Additives {
		add, _ := t.ReadAdditive(ctx, tray.Additives[addIndex])
		additives = append(additives, add)
	}
	for meatIndex := range tray.Meats {
		meat, _ := t.ReadMeat(ctx, tray.Meats[meatIndex])
		meats = append(meats, meat)
	}

	for mIndex := range meats {
		if !pigExists(pigs, meats[mIndex].PigID) {
			pig, _ := t.ReadPig(ctx, meats[mIndex].PigID)
			pigs = append(pigs, pig)
		}
	}
	return &TraceRecord{
		Meats:     meats,
		Additives: additives,
		Pigs:      pigs,
	}, nil
}

func pigExists(pigs []*Pig, pigId string) bool {
	for _, pig := range pigs {
		if pig.PigID == pigId {
			return true
		}
	}
	return false
}
