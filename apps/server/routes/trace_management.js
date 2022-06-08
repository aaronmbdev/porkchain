const express = require('express');
const router = express.Router();
const meatchain = require('../service/MeatchainService');

router.post("/additive", async (req, res) => {
    let ids = req.body.additivesId;
    if(ids === undefined) {
        res.status(400).send("additivesId is required");
        return;
    }
    let json = JSON.stringify(ids);
    console.log("Requesting Trays with additives: " + json);
    let contract = await meatchain.getFactoryContract();
    contract.evaluateTransaction('QueryTraysByAdditive', json).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
})

router.post("/meat", async (req, res) => {
    let ids = req.body.meatsId;
    if(ids === undefined) {
        res.status(400).send("meatsId is required");
        return;
    }
    let json = JSON.stringify(ids);
    console.log("Requesting Trays with meats: " + json);
    let contract = await meatchain.getFactoryContract();
    contract.evaluateTransaction('QueryTraysByMeat', json).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
})

router.get("/tray/:id", async (req, res) => {
    let id = req.params.id;
    console.log("Requested Tray information with id: "+id);
    let contract = await meatchain.getFactoryContract();
    contract.evaluateTransaction("TraceTray", id).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
       res.status(500).send(err.toString());
    });
})

module.exports = router;