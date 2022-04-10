package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"testing"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

const getStateError = "world state get error"

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

func configureStub() (*MockContext, *MockStub) {
	var nilBytes []byte

	testPig := new(Pig)
	testPig.ID = "set value"
	pigBytes, _ := json.Marshal(testPig)

	ms := new(MockStub)
	ms.On("GetState", "statebad").Return(nilBytes, errors.New(getStateError))
	ms.On("GetState", "missingkey").Return(nilBytes, nil)
	ms.On("GetState", "existingkey").Return([]byte("some value"), nil)
	ms.On("GetState", "pigkey").Return(pigBytes, nil)
	ms.On("PutState", mock.AnythingOfType("string"), mock.AnythingOfType("[]uint8")).Return(nil)
	ms.On("DelState", mock.AnythingOfType("string")).Return(nil)

	mc := new(MockContext)
	mc.On("GetStub").Return(ms)

	return mc, ms
}

func TestPigExists(t *testing.T) {
	var exists bool
	var err error

	ctx, _ := configureStub()
	c := new(PigContract)

	exists, err = c.PigExists(ctx, "statebad")
	assert.EqualError(t, err, getStateError)
	assert.False(t, exists, "should return false on error")

	exists, err = c.PigExists(ctx, "missingkey")
	assert.Nil(t, err, "should not return error when can read from world state but no value for key")
	assert.False(t, exists, "should return false when no value for key in world state")

	exists, err = c.PigExists(ctx, "existingkey")
	assert.Nil(t, err, "should not return error when can read from world state and value exists for key")
	assert.True(t, exists, "should return true when value for key in world state")
}

func TestCreatePig(t *testing.T) {
	var err error

	ctx, stub := configureStub()
	c := new(PigContract)

	err = c.CreatePig(ctx, "statebad", "some value")
	assert.EqualError(t, err, fmt.Sprintf("Could not read from world state. %s", getStateError), "should error when exists errors")

	err = c.CreatePig(ctx, "existingkey", "some value")
	assert.EqualError(t, err, "The asset existingkey already exists", "should error when exists returns true")

	err = c.CreatePig(ctx, "missingkey", "some value")
	stub.AssertCalled(t, "PutState", "missingkey", []byte("{\"value\":\"some value\"}"))
}

func TestReadPig(t *testing.T) {
	var pig *Pig
	var err error

	ctx, _ := configureStub()
	c := new(PigContract)

	pig, err = c.ReadPig(ctx, "statebad")
	assert.EqualError(t, err, fmt.Sprintf("Could not read from world state. %s", getStateError), "should error when exists errors when reading")
	assert.Nil(t, pig, "should not return Pig when exists errors when reading")

	pig, err = c.ReadPig(ctx, "missingkey")
	assert.EqualError(t, err, "The asset missingkey does not exist", "should error when exists returns true when reading")
	assert.Nil(t, pig, "should not return Pig when key does not exist in world state when reading")

	pig, err = c.ReadPig(ctx, "existingkey")
	assert.EqualError(t, err, "Could not unmarshal world state data to type Pig", "should error when data in key is not Pig")
	assert.Nil(t, pig, "should not return Pig when data in key is not of type Pig")

	pig, err = c.ReadPig(ctx, "pigkey")
	expectedPig := new(Pig)
	expectedPig.ID = "set value"
	assert.Nil(t, err, "should not return error when Pig exists in world state when reading")
	assert.Equal(t, expectedPig, pig, "should return deserialized Pig from world state")
}

func TestUpdatePig(t *testing.T) {
	var err error

	ctx, stub := configureStub()
	c := new(PigContract)

	err = c.UpdatePig(ctx, "statebad", "new value")
	assert.EqualError(t, err, fmt.Sprintf("Could not read from world state. %s", getStateError), "should error when exists errors when updating")

	err = c.UpdatePig(ctx, "missingkey", "new value")
	assert.EqualError(t, err, "The asset missingkey does not exist", "should error when exists returns true when updating")

	err = c.UpdatePig(ctx, "pigkey", "new value")
	expectedPig := new(Pig)
	expectedPig.ID = "new value"
	expectedPigBytes, _ := json.Marshal(expectedPig)
	assert.Nil(t, err, "should not return error when Pig exists in world state when updating")
	stub.AssertCalled(t, "PutState", "pigkey", expectedPigBytes)
}

func TestDeletePig(t *testing.T) {
	var err error

	ctx, stub := configureStub()
	c := new(PigContract)

	err = c.DeletePig(ctx, "statebad")
	assert.EqualError(t, err, fmt.Sprintf("Could not read from world state. %s", getStateError), "should error when exists errors")

	err = c.DeletePig(ctx, "missingkey")
	assert.EqualError(t, err, "The asset missingkey does not exist", "should error when exists returns true when deleting")

	err = c.DeletePig(ctx, "pigkey")
	assert.Nil(t, err, "should not return error when Pig exists in world state when deleting")
	stub.AssertCalled(t, "DelState", "pigkey")
}
