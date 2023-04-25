const ORIGINS = { 'http://localhost/': 3000 }
const cds = require('@sap/cds')
cds.on('bootstrap', async app => {
  app.use((req, res, next) => {

    console.log(req)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
/*     const { origin } = req.headers
    // standard request
    if (origin && ORIGINS[origin]) res.set('access-control-allow-origin', origin)
    // preflight request
    if (origin && ORIGINS[origin] && req.method === 'OPTIONS')
      return res.set('access-control-allow-methods', 'GET,HEAD,PUT,PATCH,POST,DELETE').end() 
    next()*/
  })
})
