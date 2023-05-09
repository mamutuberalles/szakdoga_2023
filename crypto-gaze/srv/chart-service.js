/* const ORIGINS = { 'http://localhost/': 3000 }
const cds = require('@sap/cds')
cds.on('bootstrap', async app => {
  app.use((req, res, next) => {

    console.log(req)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  })
})
 */
module.exports = (srv) => {

  srv.on("RefreshCharts", (req) => {
    console.log("[INFO] Refreshing monthly charts")
    const { spawn } = require("child_process");
      console.log("[INFO] Running script monthly_charts.py")
      const pythonProcess = spawn('python', ["../python_scripts/monthly_charts.py"]);

      pythonProcess.stdout.on('data', function (data) {
        console.log("[INFO] Recieved data from monthly_charts.py: " + data.toString())
      });

      pythonProcess.on('close', (code) => {
        console.log("[INFO] Python process monthly_charts.py finished with code " + code)
        if(code == 0) {
          return("The operation was successful.")
        }
        else {
          return("The operation failed with code: "+ code)
        }
      })
  });

}
