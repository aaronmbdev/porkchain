package main

const (
	PigStatus_alive       string = "Alive"
	PigStatus_slaughtered        = "Slaughtered"
	IdGeneratorRune              = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789"
	pig_slaughtered              = "The pig %s was slaughtered"

	error_pig_slaughtered        = "The pig %s was already slaughtered"
	error_state_reading          = "There was an error communicating with the Blockchain state"
	error_asset_dont_exists      = "The asset %s does not exist"
	error_not_a_pig              = "The entity requested is not a Pig"
	error_not_a_cage             = "The entity requested is not a Cage"
	error_parent_not_exists      = "The parent %s doesn't exists"
	error_cage_not_exists        = "The cage %s doesn't exists"
	error_cage_aleady_exists     = "The cage %s already exists"
	error_parsing_date           = "Error parsing birthdate. %s"
	error_list_pigs              = "There was an error trying to list the pigs: %s"
	error_list_cages             = "There was an error trying to list the cages: %s"
	error_can_delete_cage        = "The cage %s cannot be deleted if there are pigs in it"
	error_pig_id_required        = "The pigId is required to create a new asset"
	error_pig_already_exists     = "There's already a pig with id %s registered on the chain"
	error_record_already_exists  = "The record %s already exists on the blockchain"
	error_could_not_add_registry = "The update record could not be introduced into the blockchain"
)
