const express = require('express');
const app = express();
const meatchain = require('./service/MeatchainService');
const utils = require("./utils/AppUtils");

(async () => {
  const gateway = await meatchain.createMeatchainConnection(utils.getConnectionProfile());
  const contract = await meatchain.getContract();
})();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(4000);