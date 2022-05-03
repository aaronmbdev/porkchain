package main

type Pig struct {
	ParentID  string    `json:"parentId"`
	Birthdate string `json:"birthdate" metadata:"records,optional"`
	Breed     string    `json:"breed"`
	Location  string    `json:"location"`
	Status    string    `json:"status"`
}

type Cage struct {
	Name string `json:"name"`
}

type FeedingRecord struct {
	PigID string    `json:"pigId"`
	Date  string `json:"date" metadata:"records,optional"`
	Data  string    `json:"data"`
}

type HealthRecord struct {
	PigID string    `json:"pigId"`
	Date  string `json:"date" metadata:"records,optional"`
	VetID string    `json:"vetId"`
	Data  string    `json:"data"`
}

type UpdateRecord struct {
	PigID string    `json:"pigId"`
	Date  string `json:"date" metadata:"records,optional"`
	Data  string    `json:"data"`
}

type Record struct {
	Date string `json:"date" metadata:"records,optional"`
	Data string    `json:"data"`
}
