package main

type Pig struct {
	AssetType string `json:"assetType"`
	ParentID  string `json:"parentId"`
	Birthdate string `json:"birthdate"`
	Breed     string `json:"breed"`
	Location  string `json:"location"`
	Status    string `json:"status"`
}

type Cage struct {
	AssetType string `json:"assetType"`
	Name      string `json:"name"`
}

type HistoryRecord struct {
	AssetType string `json:"assetType"`
	PigID     string `json:"pigID"`
	Date      string `json:"date"`
	Data      string `json:"data"`
}
