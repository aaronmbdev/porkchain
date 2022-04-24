package main

import (
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"testing"
)

var mockedCage = Cage{
	Name: "A sample cage",
}

func configureStubCage() (*MockContext, *MockStub) {
	var nilBytes []byte
	cageBytes, _ := json.Marshal(mockedCage)

	ms := new(MockStub)
	ms.On("GetState", mockedCageMatcher).Return(cageBytes, nil)
	ms.On("GetState", "not-a-cage").Return([]byte("Some-value"), nil)
	ms.On("GetState", anyPigNotMockedCageMatcher).Return(nilBytes, nil)
	ms.On("PutState", mock.AnythingOfType("string"), mock.AnythingOfType("[]uint8")).Return(nil)
	ms.On("DelState", mock.AnythingOfType("string")).Return(nil)

	mc := new(MockContext)
	mc.On("GetStub").Return(ms)

	return mc, ms
}

func TestCreateCage(t *testing.T) {
	expected, _ := json.Marshal(mockedCage)
	ctx, stub := configureStubCage()
	c := new(PigContract)

	err := c.CreateCage(ctx, "A sample cage")
	stub.AssertCalled(t, "PutState", mock.AnythingOfType("string"), expected)
	assert.Nil(t, err)
}

func TestReadCage(t *testing.T) {
	ctx, _ := configureStubCage()
	c := new(PigContract)

	cage, err := c.ReadCage(ctx, "ABC1234")
	assert.Nil(t, err)
	assert.Equal(t, cage.Name, "A sample cage")

	cage, err = c.ReadCage(ctx, "AnythingElse")
	assert.NotNil(t, err)
	assert.EqualError(t, err, "The asset AnythingElse does not exist")

	cage, err = c.ReadCage(ctx, "not-a-cage")
	assert.NotNil(t, err)
	assert.EqualError(t, err, "The entity requested is not a Cage")
}
