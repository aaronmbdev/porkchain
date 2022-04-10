package main

import (
	"google.golang.org/genproto/googleapis/type/date"
)

type Pig struct {
	ID        string    `json:"id"`
	ParentID  *Pig      `json:"parentId"`
	Birthdate date.Date `json:"birthdate"`
	Breed     string    `json:"breed"`
	Location  *Cage     `json:"location"`
	Status    string    `json:"status"`
}

type Cage struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Meat struct {
	ID     string
	PorkID *Pig
	Cut    string
	Pieces int
}
