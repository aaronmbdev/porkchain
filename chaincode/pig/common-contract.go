package main

import (
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"math/rand"
	"time"
)

var letters = []rune(IdGeneratorRune)

type PigContract struct {
	contractapi.Contract
}

func (c *PigContract) generateID(ctx contractapi.TransactionContextInterface) (string, error) {
	rand.Seed(time.Now().UnixNano())
	b := make([]rune, 12)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}

	exists, err := c.EntityExists(ctx, string(b))
	if err != nil {
		return "", fmt.Errorf(error_state_reading)
	} else if exists {
		return c.generateID(ctx)
	}
	return string(b), nil
}

func (c *PigContract) EntityExists(ctx contractapi.TransactionContextInterface, entityId string) (bool, error) {
	data, err := ctx.GetStub().GetState(entityId)
	if err != nil {
		return false, err
	}
	return data != nil, nil
}

func (s *PigContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	cages := []Cage{
		Cage{Name: "Cage1"},
		Cage{Name: "Cage2"},
		Cage{Name: "Cage3"},
	}

	for _, cage := range cages {
		err := s.CreateCage(ctx, cage.Name)
		if err != nil {
			return fmt.Errorf("Failed to create cage %s. %s", cage, err.Error())
		}
	}

	return nil
}