const express = require('express');
const router = express.Router();
const meatchain = require('../service/MeatchainService');
const generator = require("../utils/IDGenerator");
const {generateID} = require("../utils/IDGenerator");

router.post("/", async (req, res) => {
    if(req.body.parentId === undefined) {
        res.status(400).send("parentId is required");
        return;
    }
    if(req.body.birthdate === undefined || req.body.birthdate === "") {
        res.status(400).send("birthdate is required");
        return;
    }
    if(req.body.breed === undefined) {
        res.status(400).send("breed is required");
        return;
    }
    if(req.body.location === undefined || req.body.location === "") {
        res.status(400).send("location is required");
        return;
    }
    let contract = await meatchain.getContract();
    let uuid = generator.generateID();
    contract.submitTransaction('CreatePig',
        uuid,
        req.body.parentId,
        req.body.birthdate,
        req.body.breed,
        req.body.location).then((response) => {
            res.status(200).send({});
        }).catch((err) => {
            res.status(500).send(err.toString());
        });
});

router.get("/", async (req, res) => {
    let contract = await meatchain.getContract();
    let pageSize = req.query.pageSize || 5;
    let bookmark = req.query.bookmark || "";
    contract.evaluateTransaction('ListPigs', pageSize, bookmark).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.get("/:id", async (req, res) => {
    let contract = await meatchain.getContract();
    let id = req.params.id;
    contract.evaluateTransaction('ReadPig', id).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.get("/:id/records", async (req, res) => {
    let contract = await meatchain.getContract();
    let id = req.params.id;
    let pageSize = req.query.pageSize || 5;
    let bookmark = req.query.bookmark || "";
    contract.evaluateTransaction('GetPigRecords', id, pageSize, bookmark).then((response) => {
        let parsedResponse = JSON.parse(response.toString());
        res.setHeader('Content-Type', 'application/json');
        res.send(parsedResponse);
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.post("/:id/kill", async (req, res) => {
    let contract = await meatchain.getContract();
    let id = req.params.id;
    let recordId = generateID();
    contract.submitTransaction('SlaughterPig', id, recordId).then((response) => {
        res.status(200).send({});
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.post("/:id/healthcheck", async (req, res) => {
    let contract = await meatchain.getContract();
    let id = req.params.id;
    let recordId = generateID();
    let vetId = req.body.vetId;
    let data = req.body.data;
    if(vetId === undefined || data === undefined) {
        res.status(400).send("vetId and data are required");
        return;
    }

    contract.submitTransaction('HealthReview', id, vetId, data, recordId).then((response) => {
        res.status(200).send({});
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.post("/:id/feed", async (req, res) => {
    let contract = await meatchain.getContract();
    let id = req.params.id;
    let recordId = generateID();
    let data = req.body.data;
    if(data === undefined) {
        res.status(400).send("Food data is required");
        return;
    }

    contract.submitTransaction('FeedPig', id, data, recordId).then((response) => {
        res.status(200).send({});
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
});

router.put("/:id", async (req, res) => {
    let recordId = generateID();
    let id = req.params.id;
    let parent = req.body.parentId || "";
    let birthdate = req.body.birthdate || "";
    let breed = req.body.breed || "";
    let location = req.body.location || "";
    let contract = await meatchain.getContract();
    contract.submitTransaction("UpdatePig",
        recordId,
        id,
        parent,
        birthdate,
        breed,
        location).then((response) => {
        res.status(200).send({});
    }).catch((err) => {
        res.status(500).send(err.toString());
    });

});


module.exports = router;