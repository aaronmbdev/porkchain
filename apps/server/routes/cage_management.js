const express = require('express');
const router = express.Router();
const meatchain = require('../service/MeatchainService');
const generator = require("../utils/IDGenerator");

router.get("/", async (req, res) => {
    console.log("Requesting list of cages");
    let pageSize = req.query.pageSize;
    let bookmark = req.query.bookmark;
    if (pageSize === undefined) pageSize = 5;
    if (bookmark === undefined) bookmark = "";

    let contract = await meatchain.getFarmContract();

    contract.evaluateTransaction("ListCages", pageSize, bookmark).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        console.log("ListCages response: " + response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
        console.log("ListCages error: " + err);
        res.status(500).send(err.toString());
    });

});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    console.log("Requesting information for cage with id " + id);
    let contract = await meatchain.getFarmContract();
    console.log("Getting cage with id: " + id);
    contract.evaluateTransaction("ReadCage", id).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.get("/:id/pigs", async (req, res) => {
    let id = req.params.id;
    console.log("Requesting pigs in cage with id "+ id);
    let pageSize = req.query.pageSize;
    let bookmark = req.query.bookmark;
    if (pageSize === undefined) pageSize = 5;
    if (bookmark === undefined) bookmark = "";

    let contract = await meatchain.getFarmContract();
    console.log("Getting pigs in cage with id: " + id);
    contract.evaluateTransaction("GetAllPigsInCage", id, pageSize, bookmark).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.post("/", async (req, res) => {
    let name = req.body.name;
    let id = generator.generateID();
    if(name === undefined) {
        res.status(400).send("Missing name, it's a required field");
        return;
    }
    console.log("Creating cage with name: "+name+" and id: " + id);
    let contract = await meatchain.getFarmContract();
    contract.submitTransaction("CreateCage", id, name).then((response) => {
        res.send({});
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.delete("/:id", async (req, res) => {
   let id = req.params.id;
   console.log("Requesting deletion of cage with id " + id);
   let contract = await meatchain.getFarmContract();
   contract.submitTransaction("DeleteCage", id).then((response) => {
       res.send({});
   }).catch((err) => {
       res.status(500).send(err.toString());
   });
});

module.exports = router;