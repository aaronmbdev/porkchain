package main

import (
	"encoding/json"
	"errors"
	"github.com/fxtlabs/date"
	"github.com/stretchr/testify/assert"
	"testing"
)

func configureStubPigReading() (*MockContext, *MockStub) {
	birthdate, _ := date.ParseISO("2021-09-15")
	testPig := Pig{
		ParentID:  "",
		Birthdate: birthdate.String(),
		Breed:     "Iberico",
		Status:    "Alive",
		Location:  "ABC1234",
	}
	pigBytes, _ := json.Marshal(testPig)

	ms := new(MockStub)
	ms.On("GetState", "existing-pig").Return(pigBytes, nil)
	ms.On("GetState", "non-existing-pig").Return(nilBytes, nil)
	ms.On("GetState", "bad-state").Return(nilBytes, errors.New(getStateError))
	ms.On("GetState", "not-a-pig").Return([]byte("some value"), nil)

	mc := new(MockContext)
	mc.On("GetStub").Return(ms)

	return mc, ms
}

func TestReadingPig(t *testing.T) {
	var pig *Pig
	var err error

	ctx, _ := configureStubPigReading()
	c := new(PigContract)

	pig, err = c.ReadPig(ctx, "bad-state")
	assert.EqualError(t, err, getStateError, "should error when exists errors when reading")
	assert.Nil(t, pig, "should not return Pig when exists errors when reading")

	pig, err = c.ReadPig(ctx, "non-existing-pig")
	assert.EqualError(t, err, "The asset non-existing-pig does not exist", "should error when exists returns true when reading")
	assert.Nil(t, pig, "should not return Pig when key does not exist in world state when reading")

	pig, err = c.ReadPig(ctx, "not-a-pig")
	assert.EqualError(t, err, "The entity requested is not a Pig", "should error when data in key is not Pig")
	assert.Nil(t, pig, "should not return Pig when data in key is not of type Pig")

	pig, err = c.ReadPig(ctx, "existing-pig")
	expectedPig := testPig
	assert.Nil(t, err, "should not return error when Pig exists in world state when reading")
	assert.Equal(t, expectedPig, *pig, "should return deserialized Pig from world state")
}
