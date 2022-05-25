const express = require('express');
const router = express.Router();
const meatchain = require('../service/MeatchainService');
const generator = require("../utils/IDGenerator");

router.get("/", async (req, res) => {
    let pageSize = req.query.pageSize;
    let bookmark = req.query.bookmark;
    if (pageSize === undefined) pageSize = 5;
    if (bookmark === undefined) bookmark = "";

    let contract = await meatchain.getContract();

    contract.evaluateTransaction("ListCages", pageSize, bookmark).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
        res.status(500).send(err);
    });

});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let contract = await meatchain.getContract();
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
    let contract = await meatchain.getContract();
    console.log("Getting pigs in cage with id: " + id);
    contract.evaluateTransaction("GetAllPigsInCage", id).then((response) => {
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
    let contract = await meatchain.getContract();
    contract.submitTransaction("CreateCage", id, name).then((response) => {
        res.send({});
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.delete("/:id", async (req, res) => {
   let id = req.params.id;
   let contract = await meatchain.getContract();
   contract.submitTransaction("DeleteCage", id).then((response) => {
       res.send({});
   }).catch((err) => {
       res.status(500).send(err.toString());
   });
});

module.exports = router;