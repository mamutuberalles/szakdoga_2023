module.exports = (srv) => {

  srv.on("RefreshCharts", (req) => {
    OPKEY = req.data.opKey
    console.log("[INFO] Refreshing monthly charts with operation key "+OPKEY)
    const { spawn } = require("child_process");
      console.log("[INFO] Running script monthly_charts.py with operation key "+OPKEY)
      const pythonProcess = spawn('python', ["../python_scripts/monthly_charts.py",OPKEY]);

      pythonProcess.stdout.on('data', function (data) {
        console.log("[INFO] Recieved data from monthly_charts.py with operation key "+OPKEY +": " + data.toString())
      });

      pythonProcess.on('close', (code) => {
        console.log("[INFO] Python process monthly_charts.py with operation key "+OPKEY +" finished with code " + code)
      });
  });
}
