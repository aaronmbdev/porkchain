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

type PaginatedCageResult struct {
	Records             []*Cage `json:"records"`
	FetchedRecordsCount int32   `json:"fetchedRecordsCount"`
	Bookmark            string  `json:"bookmark"`
}

type PaginatedPigResult struct {
	Records             []*Pig `json:"records"`
	FetchedRecordsCount int32  `json:"fetchedRecordsCount"`
	Bookmark            string `json:"bookmark"`
}

type PaginatedRecordsResult struct {
	Records             []*HistoryRecord `json:"records"`
	FetchedRecordsCount int32            `json:"fetchedRecordsCount"`
	Bookmark            string           `json:"bookmark"`
}
