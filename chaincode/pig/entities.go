package main

type Pig struct {
	ParentID  string `json:"parentId"`
	Birthdate string `json:"birthdate"`
	Breed     string `json:"breed"`
	Location  string `json:"location"`
	Status    string `json:"status"`
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
