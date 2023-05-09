module.exports = (srv) => {
  srv.on("DeleteTicker", async (req) => {
    ticker = req.data.ticker
    console.log("[INFO] Deleting data for ticker: " + ticker)
    if (ticker == "") {
      console.log("[ERROR] Ticker data not given, please enter ticker data.")
    }
    else {
      await DELETE.from`data_model.Crypto`.where({ ticker: req.data.ticker })
      console.log("[INFO] Ticker data deleted for: "+ ticker)
    }
  }
  );


  srv.on("AddTicker", async (req) => {
    ticker = req.data.ticker
    console.log("[INFO] Adding data for:" + ticker)
    if (ticker == "") {
      console.log("[ERROR] Ticker data not given, please enter ticker data.")
    }
    else {
      const { spawn } = require("child_process");
      console.log("[INFO] Running script add_data.py with argument " + ticker)
      const pythonProcess = spawn('python', ["../python_scripts/add_data.py", ticker]);

      pythonProcess.stdout.on('data', function (data) {
        console.log("[INFO] Recieved data from add_data.py: " + data.toString())
      });

      pythonProcess.on('close', (code) => {
        console.log("[INFO] Python process add_data.py finished with code " + code)
        if(code == 0) {
          return("The operation was successful.")
        }
        else {
          return("The operation failed with code: "+ code)
        }
      })
    }

    
  });

  srv.on("RefreshTicker", async (req) => {
    ticker = req.data.ticker
    console.log("[INFO] Refreshing data for: " + ticker)
    if (ticker == "") {
      console.log("[ERROR] Ticker data not given, please enter ticker data.")
    }
    else {
      await DELETE.from`data_model.Crypto`.where({ ticker: req.data.ticker })
      console.log("[INFO] Ticker data deleted for: "+ ticker)
      const { spawn } = require("child_process");
      console.log("[INFO] Running script add_data.py with argument " + ticker)
      const pythonProcess = spawn('python', ["../python_scripts/add_data.py", ticker]);

      pythonProcess.stdout.on('data', function (data) {
        console.log("[INFO] Recieved data from add_data.py: " + data.toString())
      });

      pythonProcess.on('close', (code) => {
        console.log("[INFO] Python process add_data.py finished with code " + code)
        if(code == 0) {
          return("The operation was successful.")
        }
        else {
          return("The operation failed with code: "+ code)
        }
      })
    }
  });

}