package main

import (
	"github.com/fxtlabs/date"
)

type Pig struct {
	ParentID  string    `json:"parentId"`
	Birthdate date.Date `json:"birthdate"`
	Breed     string    `json:"breed"`
	Location  string    `json:"location"`
	Status    string    `json:"status"`
}

type Cage struct {
	Name string `json:"name"`
}

type FeedingRecord struct {
	PigID string    `json:"pigId"`
	Date  date.Date `json:"date"`
	Data  string    `json:"data"`
}

type HealthRecord struct {
	PigID string    `json:"pigId"`
	Date  date.Date `json:"date"`
	VetID string    `json:"vetId"`
	Data  string    `json:"data"`
}

type UpdateRecord struct {
	PigID string    `json:"pigId"`
	Date  date.Date `json:"date"`
	Data  string    `json:"data"`
}
