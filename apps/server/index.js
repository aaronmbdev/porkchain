const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const meatchain = require('./service/MeatchainService');
const utils = require("./utils/AppUtils");

(async () => {
  await meatchain.createMeatchainConnection(utils.getConnectionProfile());
})();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const allowedOrigins = ['http://localhost:3000',
  'https://farm.meatchain.cloud','https://factory.meatchain.cloud','https://market.meatchain.cloud'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      let msg = 'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const cageRouter = require('./routes/cage_management');
app.use('/cage', cageRouter);

const pigRouter = require('./routes/pig_management');
app.use('/pig', pigRouter);

app.listen(4000);