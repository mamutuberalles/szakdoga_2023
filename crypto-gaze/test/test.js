const cds = require('@sap/cds/lib')

const { GET, POST, PATCH, axios, expect, DELETE } = cds.test(__dirname + '/..')

describe("Testing Crypto model", () => {
  it('POST', async () => {
    const req = await POST(`/crypto/Crypto`, {
      date: "2023-01-01",
      open: 1.0,
      high: 2.0,
      low: 0.5,
      close: 1.5,
      adj_close: 1.5,
      volume: 200,
      ticker: "M-COIN",
      type: "real"
    })
    expect(req.status).to.equal(201)
  })
  it('GET', async () => {
    const req = await GET(`/crypto/Crypto?$filter=ticker eq 'M-COIN'`, {
    })

    const payload = {
      date: "2023-01-01",
      open: 1,
      high: 2,
      low: 0.5,
      close: 1.5,
      adj_close: 1.5,
      volume: 200,
      ticker: "M-COIN",
      type: "real",
    }

    expect(req.data.value).to.deep.include(payload)
  })
  it('DELETE', async () => {
    const req = await POST(`/crypto/DeleteTicker`, {
      ticker: "M-COIN",
      opKey: "test-opkey-1"
    })
    expect(req.status).to.equal(204)
  })

});
describe("Testing PreDefinedCharts model", () => {
  let id = null
  it('POST', async () => {
    const req = await POST(`/chart/PreDefinedCharts`, {
      ticker: "M-COIN",
      start_date: "2023-01-01",
      end_date: "2023-05-29",
      label: "M-COIN - USD",
      title: "M-COIN in May"
    })

    expect(req.status).to.equal(201)
    id = req.data.id
  })
  it('GET', async () => {
    const req = await GET(`/chart/PreDefinedCharts?$filter=id eq ` + id, {
    })

    const payload = {
      ticker: "M-COIN",
      start_date: "2023-01-01",
      end_date: "2023-05-29",
      label: "M-COIN - USD",
      title: "M-COIN in May",
    }

    const chart = req.data.value[0]
    expect(payload['ticker']).to.equal(chart['ticker'])
    expect(payload['start_date']).to.equal(chart['start_date'])
    expect(payload['end_date']).to.equal(chart['end_date'])
    expect(payload['label']).to.equal(chart['label'])
    expect(payload['title']).to.equal(chart['title'])
  })
  it('DELETE', async () => {
    const req = await DELETE(`/chart/PreDefinedCharts` + `/` + id)
  })

});
describe("Testing CustomCharts model", () => {
  let id = null
  it('POST', async () => {
    const req = await POST(`/chart/CustomCharts`, {
      ticker: "M-COIN",
      start_date: "2023-01-01",
      end_date: "2023-05-29",
      label: "M-COIN - USD",
      title: "M-COIN in May",
      field: "close",
      chart_type: "complex",
      ticker2: "V-BUX",
      field2: "close",
      label2: "V-BUX - USD",
      forecast: "None",
      bookmarked: "False",
      hidden: "False"
    })

    expect(req.status).to.equal(201)
    id = req.data.id
  })
  it('GET', async () => {
    const req = await GET(`/chart/CustomCharts?$filter=id eq ` + id, {
    })

    const payload = {
      ticker: "M-COIN",
      start_date: "2023-01-01",
      end_date: "2023-05-29",
      label: "M-COIN - USD",
      title: "M-COIN in May",
      field: "close",
      chart_type: "complex",
      ticker2: "V-BUX",
      field2: "close",
      label2: "V-BUX - USD",
      forecast: "None",
      bookmarked: "False",
      hidden: "False"
    }

    const chart = req.data.value[0]
    expect(payload['ticker']).to.equal(chart['ticker'])
    expect(payload['start_date']).to.equal(chart['start_date'])
    expect(payload['end_date']).to.equal(chart['end_date'])
    expect(payload['label']).to.equal(chart['label'])
    expect(payload['title']).to.equal(chart['title'])
    expect(payload['field']).to.equal(chart['field'])
    expect(payload['chart_type']).to.equal(chart['chart_type'])
    expect(payload['ticker2']).to.equal(chart['ticker2'])
    expect(payload['forecast']).to.equal(chart['forecast'])
    expect(payload['bookmarked']).to.equal(chart['bookmarked'])
    expect(payload['hidden']).to.equal(chart['hidden'])
  })
  it('DELETE', async () => {
    const req = await DELETE(`/chart/CustomCharts` + `/` + id)
  })

}); 

describe("Testing CommandResult model", () => {
  let id = null
  it('POST', async () => {
    const req = await POST(`/endpoint/CommandResult`, {
      command: "Test command",
      data : "Test data",
      opKey : "test-opkey"
    })
    expect(req.status).to.equal(201)
    id = "test-opkey"
  })
  it('GET', async () => {
    const req = await GET(`/endpoint/CommandResult?$filter=opKey eq '`+id+`'`, {
    })

    const payload = {
      command: "Test command",
      data : "Test data",
      opKey : "test-opkey"
    }

    expect(req.data.value).to.deep.include(payload)
  })
  it('DELETE', async () => {
    const req = await POST(`/endpoint/DeleteResult`, {
      opKey: "test-opkey"
    })
    expect(req.status).to.equal(204)
  })

});