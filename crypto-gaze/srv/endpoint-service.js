module.exports = (srv) => {

  srv.on("DeleteResult", async (req) => {
    console.log("[INFO] Deleting result of last command")
    await DELETE.from`endpoint_model.CommandResult`
  });

  srv.on("Experimental", async (req) => {
    // Refreshing full dataset at midnight
    let CRYPTOS = await SELECT`data_model.Crypto`.groupBy('ticker')
    //console.log("[INFO] Refreshing available crypto data")
    for(const crypto of CRYPTOS) {
      console.log("[INFO] Refreshing available crypto data for: " + crypto.ticker)
      ticker = crypto.ticker
      date = await SELECT`from data_model.Crypto where ticker = ${ticker}`.orderBy('date asc').limit('1')
      date = date[0].date
      console.log("[INFO] Refreshing data for: " + ticker + " from " + date)
       if (ticker == "") {
        console.log("[ERROR] Ticker data not given, please enter ticker data.")
      }
      else {
        await DELETE.from`data_model.Crypto`.where({ ticker: ticker })
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
    }
  });

}
