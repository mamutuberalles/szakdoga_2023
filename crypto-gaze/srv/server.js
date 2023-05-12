const cds = require('@sap/cds');
const cors = require('cors');
const schedule = require('node-schedule')

cds.on('bootstrap', (app) => {
    app.use(cors());
})
module.exports = cds.server;

schedule.scheduleJob('0 0 * * *',async () => {
    let CRYPTOS = await SELECT`data_model.Crypto`.groupBy('ticker')
    console.log("[INFO] Refreshing available crypto data")
    CRYPTOS.forEach(async element => {
      console.log("[INFO] Refreshing available crypto data for: " + element.ticker)
      ticker = element.ticker
      date = await SELECT`from data_model.Crypto where ticker = ${ticker}`.orderBy('date asc').limit('1')
      date = date[0].date
      console.log("[INFO] Refreshing data for: " + ticker + " from " + date)
      if (ticker == "") {
        console.log("[ERROR] Ticker data not given, please enter ticker data.")
      }
      else {
        await DELETE.from`data_model.Crypto`.where({ ticker: req.data.ticker })
        console.log("[INFO] Ticker data deleted for: " + ticker)
        const { spawn } = require("child_process");
        console.log("[INFO] Running script add_data.py with argument " + ticker + " " + date)
        const pythonProcess = spawn('python', ["../python_scripts/add_data.py", ticker, date]);

        pythonProcess.stdout.on('data', function (data) {
          console.log("[INFO] Recieved data from add_data.py: " + data.toString())
        });

        pythonProcess.on('close', (code) => {
          console.log("[INFO] Python process add_data.py finished with code " + code)
          if (code == 0) {
            return ("The operation was successful.")
          }
          else {
            return ("The operation failed with code: " + code)
          }
        })
      }
    });
  });