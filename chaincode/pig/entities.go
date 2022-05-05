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

type HistoryRecord struct {
	PigID string `json:"pigID"`
	Date  string `json:"date"`
	Data  string `json:"data"`
}
