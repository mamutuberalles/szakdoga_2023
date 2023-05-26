const cds = require('@sap/cds');
const cors = require('cors');
const schedule = require('node-schedule')
const express = require('express');
const path = require('path');
const app = require('express')();

cds.on("listening", async (app) => {
  await DELETE.from`endpoint_model.CommandResult`
  let CRYPTOS = await SELECT`data_model.Crypto`.groupBy('ticker')
  for (const crypto of CRYPTOS) {
    console.log("[INFO] Refreshing available crypto data for: " + crypto.ticker)
    ticker = crypto.ticker
    date = await SELECT`from data_model.Crypto where ticker = ${ticker}`.orderBy('date asc').limit('1')
    date = date[0].date
    console.log("[INFO] Refreshing data for: " + ticker + " from " + date)
    if (ticker == "") {
      console.log("[ERROR] Ticker data not given, please enter ticker data.")
    }
    else {
      await DELETE.from`data_model.Crypto`.where({ ticker: ticker })
      await DELETE.from`chart_model.PreDefinedCharts`.where({ ticker: ticker })
      console.log("[INFO] Ticker data deleted for: " + ticker)
      const { spawn } = require("child_process");
      console.log("[INFO] Running script add_data.py with argument " + ticker + " " + date)
      const pythonProcess = spawn('python', ["../python_scripts/add_data.py", ticker, date]);
      const pythonProcess2 = spawn('python', ["../python_scripts/add_chart.py", ticker]);
      pythonProcess.stdout.on('data', function (data) {
        console.log("[INFO] Recieved data from add_data.py: " + data.toString())
      });

      pythonProcess.on('close', async (code) => {
        console.log("[INFO] Python process add_data.py finished with code " + code)
      })


      pythonProcess2.stdout.on('data', function (data) {
        console.log("[INFO] Recieved data from add_chart.py: " + data.toString())
      });

      pythonProcess2.on('close', async (code) => {
        console.log("[INFO] Python process add_chart.py finished with code " + code)
        await DELETE.from`endpoint_model.CommandResult where opKey = null`
      })

    }
  }
})

cds.on('bootstrap', (app) => {
  app.use(cors());
  app.use("/", express.static("../react-ui/build"))
  app.get("/experimental", (req,res) =>{
    res.redirect('/')
  })
  app.get("/charts", (req,res) =>{
    res.redirect('/')
  })
  app.get("/bookmarkedcharts", (req,res) =>{
    res.redirect('/')
  })
  app.get("/hiddencharts", (req,res) =>{
    res.redirect('/')
  })
  app.get("/addsimplechart", (req,res) =>{
    res.redirect('/')
  })
  app.get("/addcomplexchart", (req,res) =>{
    res.redirect('/')
  })
  app.get("/chartmodifier", (req,res) =>{
    res.redirect('/')
  })
  app.get("/scripts", (req,res) =>{
    res.redirect('/')
  })
})




schedule.scheduleJob('0 0 * * *', async () => {
  let CRYPTOS = await SELECT`data_model.Crypto`.groupBy('ticker')
  for (const crypto of CRYPTOS) {
    console.log("[INFO] Refreshing available crypto data for: " + crypto.ticker)
    ticker = crypto.ticker
    date = await SELECT`from data_model.Crypto where ticker = ${ticker}`.orderBy('date asc').limit('1')
    date = date[0].date
    console.log("[INFO] Refreshing data for: " + ticker + " from " + date)
    if (ticker == "") {
      console.log("[ERROR] Ticker data not given, please enter ticker data.")
    }
    else {
      await DELETE.from`data_model.Crypto`.where({ ticker: ticker })
      await DELETE.from`chart_model.PreDefinedCharts`.where({ ticker: ticker })
      console.log("[INFO] Ticker data deleted for: " + ticker)
      const { spawn } = require("child_process");
      console.log("[INFO] Running script add_data.py with argument " + ticker + " " + date)
      const pythonProcess = spawn('python', ["../python_scripts/add_data.py", ticker, date]);
      const pythonProcess2 = spawn('python', ["../python_scripts/add_chart.py", ticker]);
      pythonProcess.stdout.on('data', function (data) {
        console.log("[INFO] Recieved data from add_data.py: " + data.toString())
      });

      pythonProcess.on('close', async (code) => {
        console.log("[INFO] Python process add_data.py finished with code " + code)
      })


      pythonProcess2.stdout.on('data', function (data) {
        console.log("[INFO] Recieved data from add_chart.py: " + data.toString())
      });

      pythonProcess2.on('close', async (code) => {
        console.log("[INFO] Python process add_chart.py finished with code " + code)
      })

    }
  }
});