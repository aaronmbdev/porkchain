const express = require('express');
const router = express.Router();
const meatchain = require('../service/MeatchainService');
const generator = require("../utils/IDGenerator");

router.get("/", async (req, res) => {
    let contract = await meatchain.getFactoryContract();
    let pageSize = req.query.pageSize || 1000;
    let bookmark = req.query.bookmark || "";
    let cut = req.query.cut;
    let minAmount = req.query.minAmount || 0;
    console.log("Requesting meat list with pageSize: " + pageSize + ", bookmark: " + bookmark + ", cut: " + cut + ", minAmount: " + minAmount);
    contract.evaluateTransaction('QueryMeat', cut, pageSize, bookmark, minAmount).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.get("/:id", async (req, res) => {
   let id = req.params.id;
    console.log("Requesting meat with id: " + id);
    let contract = await meatchain.getFactoryContract();
    contract.evaluateTransaction('ReadMeat', id).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch(err => {
        res.status(500).send(err.toString());
    })
});

router.post("/", async (req, res) => {
    console.log("Creating a new meat cut");
    if(req.body.pigId === undefined) {
        res.status(400).send("pigId is required");
        return;
    }
    if(req.body.cut === undefined) {
        res.status(400).send("cut is required");
        return;
    }
    if(req.body.pieces === undefined) {
        res.status(400).send("pieces is required");
        return;
    }
    let uuid = generator.generateID();
    let recordId = generator.generateID();
    let contract = await meatchain.getFactoryContract();
    contract.submitTransaction('CutMeat', recordId, uuid, req.body.pigId, req.body.cut, req.body.pieces).then(() => {
        res.send({});
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

module.exports = router;