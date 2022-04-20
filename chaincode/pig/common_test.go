package main

import (
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/stretchr/testify/mock"
)

const getStateError = "There was an error communicating with the Blockchain state"

var nilBytes []byte
var someBytes = []byte("some value")

var mockedCageMatcher = mock.MatchedBy(func(arg string) bool {
	return arg == "ABC1234"
})
var anyPigNotMockedCageMatcher = mock.MatchedBy(func(arg string) bool {
	return arg != "ABC1234"
})

var badStateMatcher = mock.MatchedBy(func(arg string) bool {
	return arg == "BADSTATE"
})

type MockStub struct {
	shim.ChaincodeStubInterface
	mock.Mock
}

func (ms *MockStub) GetState(key string) ([]byte, error) {
	args := ms.Called(key)
	return args.Get(0).([]byte), args.Error(1)
}

func (ms *MockStub) PutState(key string, value []byte) error {
	args := ms.Called(key, value)
	return args.Error(0)
}

func (ms *MockStub) DelState(key string) error {
	args := ms.Called(key)
	return args.Error(0)
}

type MockContext struct {
	contractapi.TransactionContextInterface
	mock.Mock
}

func (mc *MockContext) GetStub() shim.ChaincodeStubInterface {
	args := mc.Called()
	return args.Get(0).(*MockStub)
}
