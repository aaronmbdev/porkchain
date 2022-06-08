const express = require('express');
const router = express.Router();
const meatchain = require('../service/MeatchainService');

router.get("/additive", async (req, res) => {
    let id = req.params.id;
})

router.get("/meat", async (req, res) => {
    let id = req.params.id;
})

router.get("tray", async (req, res) => {
    let id = req.params.id;
})

router.get("/supermarket", async (req, res) => {
    let id = req.params.id;
})

module.exports = router;