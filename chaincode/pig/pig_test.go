package main

import (
	"encoding/json"
	"errors"
	"github.com/fxtlabs/date"
	"github.com/stretchr/testify/mock"
	"testing"
)

func configureStubPig() (*MockContext, *MockStub) {
	var nilBytes []byte

	birthdate, _ := date.ParseISO("2021-09-15")
	testPig := Pig{
		ParentID:  "",
		Birthdate: birthdate,
		Breed:     "Iberico",
		Status:    "Alive",
		Location:  "ABC1234",
	}
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

func TestCreateBornPig(t *testing.T) {
	//TODO crearcerdoconParent, nonExistingParent
}

/*func TestReadPig(t *testing.T) {
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
}*/

/*func TestUpdatePig(t *testing.T) {
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
}*/

/*func TestDeletePig(t *testing.T) {
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
}*/
