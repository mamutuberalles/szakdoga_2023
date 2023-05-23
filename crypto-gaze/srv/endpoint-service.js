module.exports = (srv) => {

  srv.on("DeleteResult", async (req) => {
    let OPKEY = req.data.opKey;
    console.log("[INFO] Deleting result of command with opkey " + OPKEY)
    await DELETE.from`endpoint_model.CommandResult`.where`opKey = ${OPKEY}`
  });

  srv.on("Analyst", async (req) => {
    let OPKEY = req.data.opKey;
    console.log("[INFO] Running analyst script with opkey " + OPKEY)
    let TICKER = req.data.ticker
    let START_DATE = req.data.start_date
    let END_DATE = req.data.end_date
    if (ticker == "") {
      console.log("[ERROR] Ticker data not given, please enter ticker data.")
    }
    else {
      const { spawn } = require("child_process");
      console.log("[INFO] Running script analysis.py with argument " + TICKER + " " + START_DATE + " " + END_DATE + " " + OPKEY)
      const pythonProcess = spawn('python', ["../python_scripts/analysis.py", TICKER, START_DATE, END_DATE, OPKEY]);


      pythonProcess.stdout.on('data', function (data) {
        console.log("[INFO] Recieved data from analysis.py with operation key " + OPKEY + ": " + data.toString())
      });

      pythonProcess.on('close', async (code) => {
        console.log("[INFO] Python process analysis.py with operation key " + OPKEY + " finished with code " + code)
      });
    }
  });
}
