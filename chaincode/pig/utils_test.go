package main

import (
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"testing"
)

func configureStubUtils() (*MockContext, *MockStub) {
	var nilBytes []byte
	ms := new(MockStub)
	ms.On("GetState", mock.AnythingOfType("string")).Return(nilBytes, nil)

	mc := new(MockContext)
	mc.On("GetStub").Return(ms)

	return mc, ms
}

func TestIDGeneration(t *testing.T) {
	ctx, _ := configureStubUtils()
	c := new(PigContract)

	id, err := c.generateID(ctx)
	assert.NotNil(t, id)
	assert.Nil(t, err)
}
