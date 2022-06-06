const express = require('express');
const router = express.Router();
const meatchain = require('../service/MeatchainService');
const generator = require("../utils/IDGenerator");

router.get("/", async (req, res) => {
    console.log("Requesting list of additives");
    let contract = await meatchain.getFactoryContract();
    let pageSize = req.query.pageSize || 5;
    let bookmark = req.query.bookmark || "";
    let adType = req.query.type || "seasoning";
    contract.evaluateTransaction('ListAdditives', adType, pageSize, bookmark).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    console.log("Requesting additive with id: " + id);
    let contract = await meatchain.getFactoryContract();
    contract.evaluateTransaction('ReadAdditive', id).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.post("/", async (req, res) => {
    console.log("Requesting to create a new additive");
    if(req.body.name === undefined) {
        res.status(400).send("name is required");
        return;
    }
    if(req.body.lot === undefined) {
        res.status(400).send("lot is required");
        return;
    }
    if(req.body.expiry === undefined) {
        res.status(400).send("expiry is required");
        return;
    }
    if(req.body.type !== "sauce" && req.body.type !== "seasoning") {
        res.status(400).send("type must be sauce or seasoning");
        return;
    }
    let contract = await meatchain.getFactoryContract();
    let uuid = generator.generateID();
    contract.submitTransaction('CreateAdditive',
        req.body.type,
        uuid,
        req.body.name,
        req.body.lot,
        req.body.expiry).then(() => {
        res.send({});
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

module.exports = router;