const express = require('express');
const router = express.Router();
const meatchain = require('../service/MeatchainService');
const generator = require("../utils/IDGenerator");

router.get("/", async (req, res) => {
    let pageSize = req.query.pageSize || 5;
    let bookmark = req.query.bookmark || "";
    let contract = await meatchain.getFactoryContract();
    console.log("Requesting list of existing trays");
    contract.evaluateTransaction("GetTrays", pageSize, bookmark).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch(err => {
        res.status(500).send(err.toString());
    })
})

router.post("/", async (req, res) => {
   if(req.body.meatIds === undefined) {
         res.status(400).send("It is required to supply an array of meat ids");
         return;
   }
   if(req.body.additives === undefined) {
            res.status(400).send("It is required to supply an array of additives");
            return;
   }
    let meats = req.body.meatIds;
    let additives = req.body.additives;
    console.log("Requesting to create a Tray");
    if(meats.constructor !== Array || additives.constructor !== Array) {
        res.status(400).send("meatIds and additives must be arrays");
        return;
    }
    let contract = await meatchain.getFactoryContract();
    let uuid = generator.generateID();
    contract.submitTransaction('PackMeat', uuid, JSON.stringify(meats), JSON.stringify(additives)).then((response) => {
        res.send({});
    }).catch(err => {
        res.status(500).send(err.toString());
    });
});

module.exports = router;