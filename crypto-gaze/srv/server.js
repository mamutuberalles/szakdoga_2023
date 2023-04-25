const cds = require('@sap/cds');
const cors = require('cors');

cds.on('bootstrap', (app) => {
    console.debug("Use: cors middleware");
    app.use(cors());
})
module.exports = cds.server;