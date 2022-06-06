package main

type Pig struct {
	PigID     string `json:"pig_id"`
	AssetType string `json:"assetType"`
	ParentID  string `json:"parentId"`
	Birthdate string `json:"birthdate"`
	Breed     string `json:"breed"`
	Location  string `json:"location"`
	Status    string `json:"status"`
}

type Cage struct {
	CageID    string `json:"cage_id"`
	AssetType string `json:"assetType"`
	Name      string `json:"name"`
}

type HistoryRecord struct {
	RecordType string `json:"recordType"`
	AssetType  string `json:"assetType"`
	PigID      string `json:"pigID"`
	Date       string `json:"date"`
	Data       string `json:"data"`
}

type Additive struct {
	AssetType    string `json:"assetType"`
	AdditiveID   string `json:"additive_id"`
	AdditiveType string `json:"additiveType"`
	Name         string `json:"name"`
	LotID        string `json:"lot_id"`
	ExpiryDate   string `json:"expiry_date"`
}

type Meat struct {
	AssetType  string `json:"assetType"`
	MeatID     string `json:"meat_id"`
	PigID      string `json:"pig_id"`
	Cut        string `json:"cut"`
	Pieces     int    `json:"pieces"`
	Production string `json:"production"`
}

type Tray struct {
	AssetType string   `json:"assetType"`
	TrayID    string   `json:"tray_id"`
	Meats     []string `json:"meats"`
	Additives []string `json:"additives"`
}

type PaginatedCageResult struct {
	Records             []*Cage `json:"records,omitempty" metadata:"records,optional" `
	FetchedRecordsCount int32   `json:"fetchedRecordsCount"`
	Bookmark            string  `json:"bookmark"`
}

type PaginatedPigResult struct {
	Records             []*Pig `json:"records,omitempty" metadata:"records,optional" `
	FetchedRecordsCount int32  `json:"fetchedRecordsCount"`
	Bookmark            string `json:"bookmark"`
}

type PaginatedRecordsResult struct {
	Records             []*HistoryRecord `json:"records,omitempty" metadata:"records,optional" `
	FetchedRecordsCount int32            `json:"fetchedRecordsCount"`
	Bookmark            string           `json:"bookmark"`
}

type PaginatedAdditiveResult struct {
	Records             []*Additive `json:"records,omitempty" metadata:"records,optional" `
	FetchedRecordsCount int32       `json:"fetchedRecordsCount"`
	Bookmark            string      `json:"bookmark"`
}

type PaginatedMeatResult struct {
	Records             []*Meat `json:"records,omitempty" metadata:"records,optional" `
	FetchedRecordsCount int32   `json:"fetchedRecordsCount"`
	Bookmark            string  `json:"bookmark"`
}
