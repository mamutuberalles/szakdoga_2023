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
      await DELETE.from`chart_model.PreDefinedCharts`.where({ticker: ticker})
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

      pythonProcess.on('close', async (code) => {
        console.log("[INFO] Python process add_data.py finished with code " + code)
        if(code == 0) {
          // Need to add monthly chart also
          const y = new Date().getFullYear()
          const m = new Date().getMonth() + 1
          start_date = 0;
          end_date = 0;
          if(m >= 10) {
            start_date = y +"-"+m+"-"+"01"
            end_date = y +"-"+m+"-"+"31"
          }
          else {
            start_date = y +"-0"+m+"-"+"01"
            end_date = y +"-0"+m+"-"+"31"
          }

          let chart = [{ticker:ticker, start_date: start_date,end_date:end_date, label: ticker+" - USD", title: "Values of "+ticker+" this month"}]
          await INSERT (chart) .into`chart_model.PreDefinedCharts`
          
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
      await DELETE.from`chart_model.PreDefinedCharts`.where({ticker: ticker})
      console.log("[INFO] Ticker data deleted for: "+ ticker)
      const { spawn } = require("child_process");
      console.log("[INFO] Running script add_data.py with argument " + ticker + " "+ date)
      const pythonProcess = spawn('python', ["../python_scripts/add_data.py", ticker,date]);

      pythonProcess.stdout.on('data', function (data) {
        console.log("[INFO] Recieved data from add_data.py: " + data.toString())
      });

      pythonProcess.on('close', async (code) => {
        console.log("[INFO] Python process add_data.py finished with code " + code)
        if(code == 0) {

          // Need to add monthly chart also
          const y = new Date().getFullYear()
          const m = new Date().getMonth() + 1
          start_date = 0;
          end_date = 0;
          if(m >= 10) {
            start_date = y +"-"+m+"-"+"01"
            end_date = y +"-"+m+"-"+"31"
          }
          else {
            start_date = y +"-0"+m+"-"+"01"
            end_date = y +"-0"+m+"-"+"31"
          }

          let chart = [{ticker:ticker, start_date: start_date,end_date:end_date, label: ticker+" - USD", title: "Values of "+ticker+" this month"}]
          await INSERT (chart) .into`chart_model.PreDefinedCharts`
          return("The operation was successful.")
        }
        else {
          return("The operation failed with code: "+ code)
        }
      })
    }
  });

}