package main

import (
	"errors"
	"github.com/stretchr/testify/assert"
	"testing"
)

func configureStubPigExists() (*MockContext, *MockStub) {
	ms := new(MockStub)
	ms.On("GetState", "statebad").Return(nilBytes, errors.New(getStateError))
	ms.On("GetState", "missingkey").Return(nilBytes, nil)
	ms.On("GetState", "existingkey").Return([]byte("some value"), nil)
	mc := new(MockContext)
	mc.On("GetStub").Return(ms)
	return mc, ms
}

func TestPigExists(t *testing.T) {
	var exists bool
	var err error

	ctx, _ := configureStubPigExists()
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
