const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const meatchain = require('./service/MeatchainService');
const utils = require("./utils/AppUtils");
require('log-timestamp');


(async () => {
  await meatchain.createMeatchainConnection(utils.getFarmConnectionProfile(), utils.getFactoryConnectionProfile());
})();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const allowedOrigins = ['http://localhost:3000',
  'https://farm.meatchain.cloud','https://factory.meatchain.cloud','https://market.meatchain.cloud', 'http://localhost:3001',];

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

const additiveRouter = require('./routes/additive_management');
app.use('/additive', additiveRouter);

const meatRouter = require('./routes/meat_management');
app.use('/meat', meatRouter);

const trayRouter = require('./routes/tray_management');
app.use('/tray', trayRouter);

app.listen(4000);