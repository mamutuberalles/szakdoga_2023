module.exports = (srv) => {
  srv.before('CREATE', 'RunCommand', (req) => {
    const command  = req.data.command.replace(/"/g, '')
    const argTicker  = req.data.argTicker.replace(/"/g, '')
    const { spawn } = require("child_process");
    console.log("Running script : " +command)
    const pythonProcess = spawn('python', ["../python_scripts/"+command,argTicker]);

    pythonProcess.stdout.on('data', function (data) {
      console.log("[DEBUG] Recieved data from "+command+" : " + data.toString())
    });

    pythonProcess.on('close', (code) => {
      console.log("Python process "+command+" finished with code "+code)
    })
  })
}