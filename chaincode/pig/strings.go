package main

const (
	PigStatus_alive       string = "Alive"
	PigStatus_slaughtered        = "Slaughtered"
	IdGeneratorRune              = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789"

	error_state_reading     = "There was an error communicating with the Blockchain state"
	error_asset_dont_exists = "The asset %s does not exist"
	error_not_a_pig         = "The entity requested is not a Pig"
	error_parent_not_exists = "The parent %s doesn't exists"
	error_cage_not_exists   = "The cage %s doesn't exists"
	error_parsing_date      = "Error parsing birthdate. %s"
	error_list_pigs         = "There was an error trying to list the pigs: %s"
)