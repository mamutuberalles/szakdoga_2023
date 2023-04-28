module.exports = (srv) => {
  
  srv.before('CREATE', 'RefreshData', (req)=> {
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python', ["../prediction/script.py", "final", req.data.ticker]);
    console.log("Python process started")
    pythonProcess.stdout.on('data', (data) => {
        console.log(data);
     });

  })
}
/* const ORIGINS = { 'http://localhost/': 3000 }
cds.on('bootstrap', async app => {
  app.use((req, res, next) => {
    const { origin } = req.headers
    // standard request
    if (origin && ORIGINS[origin]) res.set('access-control-allow-origin', origin)
    // preflight request
    if (origin && ORIGINS[origin] && req.method === 'OPTIONS')
      return res.set('access-control-allow-methods', 'GET,HEAD,PUT,PATCH,POST,DELETE').end()
    next()
  })
})
 */