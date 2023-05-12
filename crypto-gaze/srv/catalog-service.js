module.exports = (srv) => {
  const {CommandResult} = cds.entities('endpoint_model');
  srv.on("DeleteTicker", async (req) => {
    ticker = req.data.ticker
    console.log("[INFO] Deleting data for ticker: " + ticker)
    if (ticker == "") {
      console.log("[ERROR] Ticker data not given, please enter ticker data.")
    }
    else {
      await DELETE.from`data_model.Crypto`.where({ ticker: req.data.ticker })
      console.log("[INFO] Ticker data deleted for: "+ ticker)
      const result = [{ command:'delete_data',data:"[INFO] Ticker data deleted for: "+ ticker }]
      console.log("[DEBUG] result: ")
      await INSERT (result) .into`endpoint_model.CommandResult`
      return;
      result = SELECT`endpoint_model.CommandResult`.groupBy(ticker)
      console.log("[DEBUG] result: ")
      console.log(result)
    }
  }
  );


  srv.on("AddTicker", async (req) => {
    ticker = req.data.ticker
    date = req.data.date
    console.log("[INFO] Adding data for:" + ticker+" from " + date)
    if (ticker == "") {
      console.log("[ERROR] Ticker data not given, please enter ticker data.")
    }
    else {
      const { spawn } = require("child_process");
      console.log("[INFO] Running script add_data.py with argument " + ticker + " "+ date)
      const pythonProcess = spawn('python', ["../python_scripts/add_data.py", ticker,date]);

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
    date = req.data.date
    console.log("[INFO] Refreshing data for: " + ticker+" from " + date)
    if (ticker == "") {
      console.log("[ERROR] Ticker data not given, please enter ticker data.")
    }
    else {
      await DELETE.from`data_model.Crypto`.where({ ticker: ticker })
      console.log("[INFO] Ticker data deleted for: "+ ticker)
      const { spawn } = require("child_process");
      console.log("[INFO] Running script add_data.py with argument " + ticker + " "+ date)
      const pythonProcess = spawn('python', ["../python_scripts/add_data.py", ticker,date]);

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