package main

const (
	PigStatus_alive       string = "Alive"
	PigStatus_slaughtered        = "Slaughtered"
	pig_slaughtered              = "The pig %s was slaughtered"
	pig_fed                      = "The pig %s was fed with the following food: %s"
	pig_reviewed                 = "The pig %s had a health check by the vet with ID %s and with the following result: %s"

	Sauce     = "sauce"
	Seasoning = "seasoning"
	AdditiveT = "additive"

	error_pig_dead                = "The pig %s is dead. We cannot feed a dead pig"
	error_pig_slaughtered         = "The pig %s was already slaughtered"
	error_state_reading           = "There was an error communicating with the Blockchain state"
	error_asset_dont_exists       = "The asset %s does not exist"
	error_not_a_pig               = "The entity requested is not a Pig"
	error_not_a_cage              = "The entity requested is not a Cage"
	error_not_a_meat              = "The entity requested is not a Meat entity"
	error_parent_not_exists       = "The parent %s doesn't exists"
	error_cage_not_exists         = "The cage %s doesn't exists"
	error_cage_aleady_exists      = "The cage %s already exists"
	error_parsing_date            = "Error parsing the provided date. %s"
	error_can_delete_cage         = "The cage %s cannot be deleted if there are pigs in it"
	error_pig_id_required         = "The pigId is required to create a new asset"
	error_pig_already_exists      = "There's already a pig with id %s registered on the chain"
	error_record_already_exists   = "The record %s already exists on the blockchain"
	error_could_not_add_registry  = "The update record could not be introduced into the blockchain"
	error_additive_type_unknown   = "The additive type %s is unknown"
	error_pig_must_be_slaugthered = "The pig %s must be slaughtered before being cut"
)
