package main

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
