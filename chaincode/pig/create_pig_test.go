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
	Birthdate: birthdate.String(),
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
	var id string
	ctx, stub := configureStubCreatePig()
	c := new(PigContract)

	birthdateString := "2021-09-15"
	expectedPig, _ := json.Marshal(testPig)

	id, err = c.CreatePig(ctx, testPig.ParentID, birthdateString, testPig.Breed, testPig.Location)
	assert.Nil(t, err)
	assert.NotNil(t, id)
	stub.AssertCalled(t, "PutState", mock.AnythingOfType("string"), expectedPig)

	id, err = c.CreatePig(ctx, testPig.ParentID, "badDate", testPig.Breed, testPig.Location)
	assert.NotNil(t, err)
	assert.EqualError(t, err, "Error parsing birthdate. Date.ParseISO: cannot parse badDate", "should error if using incorrect date")

	id, err = c.CreatePig(ctx, testPig.ParentID, birthdateString, testPig.Breed, "badLocation")
	assert.NotNil(t, err)
	assert.EqualError(t, err, "The cage badLocation doesn't exists", "should error when a cage doesnt exists")

	id, err = c.CreatePig(ctx, "BADSTATE", birthdateString, testPig.Breed, "badLocation")
	assert.NotNil(t, err)
	assert.EqualError(t, err, getStateError, "should error when there's an error connecting with the world state")
}

func TestNewBornPigs(t *testing.T) {
	var err error
	var id string
	ctx, stub := configureStubCreatePig()
	c := new(PigContract)

	birthdateString := "2021-09-15"
	bornPig := testPig
	bornPig.ParentID = "ABC1234"
	expectedPig, _ := json.Marshal(bornPig)

	id, err = c.CreatePig(ctx, bornPig.ParentID, birthdateString, bornPig.Breed, bornPig.Location)
	assert.Nil(t, err)
	assert.NotNil(t, id)
	stub.AssertCalled(t, "PutState", mock.AnythingOfType("string"), expectedPig)

	bornPig.ParentID = "IDONTEXIST"
	id, err = c.CreatePig(ctx, bornPig.ParentID, birthdateString, bornPig.Breed, bornPig.Location)
	assert.NotNil(t, err)
	assert.EqualError(t, err, "The parent IDONTEXIST doesn't exists", "should error when a cage doesnt exists")

}
