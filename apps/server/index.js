const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const meatchain = require('./service/MeatchainService');
const utils = require("./utils/AppUtils");

(async () => {
  await meatchain.createMeatchainConnection(utils.getConnectionProfile());
})();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const cageRouter = require('./routes/cage_management');
app.use('/cage', cageRouter);

const pigRouter = require('./routes/pig_management');
app.use('/pig', pigRouter);

app.listen(4000);