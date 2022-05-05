package main

type Pig struct {
	ParentID       string          `json:"parentId"`
	Birthdate      string          `json:"birthdate" metadata:"records,optional"`
	Breed          string          `json:"breed"`
	Location       string          `json:"location"`
	Status         string          `json:"status"`
	UpdateRecords  []UpdateRecord  `json:"update_records"`
	HealthRecords  []HealthRecord  `json:"health_records"`
	FeedingRecords []FeedingRecord `json:"feeding_records"`
}

type Cage struct {
	Name string `json:"name"`
}

type FeedingRecord struct {
	Date string `json:"date"`
	Data string `json:"data"`
}

type HealthRecord struct {
	Date  string `json:"date"`
	VetID string `json:"vetId"`
	Data  string `json:"data"`
}

type UpdateRecord struct {
	Date string `json:"date" `
	Data string `json:"data"`
}

type Record struct {
	Date string `json:"date" `
	Data string `json:"data"`
}
