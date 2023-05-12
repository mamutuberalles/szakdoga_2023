import schedule from 'node-schedule'
const cds = require('@sap/cds');
const cors = require('cors');

cds.on('bootstrap', (app) => {
    console.debug("Use: cors middleware");
    app.use(cors());
})
module.exports = cds.server;

schedule.scheduleJob('0 0 * * *', () => {
    // Refreshing full dataset at midnight
    
 }) 