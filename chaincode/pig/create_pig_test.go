package main

import (
	"encoding/json"
	"errors"
	"github.com/fxtlabs/date"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"testing"
)

var birthdate, _ = date.ParseISO("2021-09-15")
var testPig = Pig{
	ParentID:  "",
	Birthdate: birthdate,
	Breed:     "Iberico",
	Status:    "Alive",
	Location:  "ABC1234",
}

func configureStubCreatePig() (*MockContext, *MockStub) {
	ms := new(MockStub)
	ms.On("PutState", mock.AnythingOfType("string"), mock.AnythingOfType("[]uint8")).Return(nil)
	ms.On("GetState", badStateMatcher).Return(nilBytes, errors.New(getStateError))
	ms.On("GetState", mockedCageMatcher).Return(someBytes, nil)
	ms.On("GetState", anyPigNotMockedCageMatcher).Return(nilBytes, nil)
	mc := new(MockContext)
	mc.On("GetStub").Return(ms)

	return mc, ms
}

func TestCreatePig(t *testing.T) {
	var err error
	ctx, stub := configureStubCreatePig()
	c := new(PigContract)

	birthdateString := "2021-09-15"
	expectedPig, _ := json.Marshal(testPig)

	err = c.CreatePig(ctx, testPig.ParentID, birthdateString, testPig.Breed, testPig.Location, testPig.Status)
	assert.Nil(t, err)
	stub.AssertCalled(t, "PutState", mock.AnythingOfType("string"), expectedPig)

	err = c.CreatePig(ctx, testPig.ParentID, "badDate", testPig.Breed, testPig.Location, testPig.Status)
	assert.NotNil(t, err)
	assert.EqualError(t, err, "Error parsing birthdate. Date.ParseISO: cannot parse badDate", "should error if using incorrect date")

	err = c.CreatePig(ctx, testPig.ParentID, birthdateString, testPig.Breed, "badLocation", testPig.Status)
	assert.NotNil(t, err)
	assert.EqualError(t, err, "The cage badLocation doesn't exists", "should error when a cage doesnt exists")

	err = c.CreatePig(ctx, "BADSTATE", birthdateString, testPig.Breed, "badLocation", testPig.Status)
	assert.NotNil(t, err)
	assert.EqualError(t, err, getStateError, "should error when there's an error connecting with the world state")
}

func TestNewBornPigs(t *testing.T) {
	var err error
	ctx, stub := configureStubCreatePig()
	c := new(PigContract)

	birthdateString := "2021-09-15"
	bornPig := testPig
	bornPig.ParentID = "ABC1234"
	expectedPig, _ := json.Marshal(bornPig)

	err = c.CreatePig(ctx, bornPig.ParentID, birthdateString, bornPig.Breed, bornPig.Location, bornPig.Status)
	assert.Nil(t, err)
	stub.AssertCalled(t, "PutState", mock.AnythingOfType("string"), expectedPig)

	bornPig.ParentID = "IDONTEXIST"
	err = c.CreatePig(ctx, bornPig.ParentID, birthdateString, bornPig.Breed, bornPig.Location, bornPig.Status)
	assert.NotNil(t, err)
	assert.EqualError(t, err, "The parent IDONTEXIST doesn't exists", "should error when a cage doesnt exists")

}
