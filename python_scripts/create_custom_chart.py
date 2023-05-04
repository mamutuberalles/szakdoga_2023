import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime
import requests
import csv
import wget
import darts
import darts.datasets as dds
import datetime
import os

charts_url = "http://localhost:4004/chart/PreDefinedCharts"
crypto_url = "http://localhost:4004/catalog/Crypto"

# Get available tickers
tickers = requests.get(crypto_url + "?$apply=groupby((ticker))").json()["value"]
tickers_plucked = [item["ticker"] for item in tickers]

# Create simple pre-defined chart
headers = {
    "Content-Type": "application/json;IEEE754Compatible=true",
    "Authorization": "Basic admin",
}
response = requests.post(
    charts_url,
    json={
        "ticker": tickers_plucked[0],
        "start_date": "2023-04-01",
        "end_date": "2023-05-31",
        "label": "BTC - USD",
        "title": "Sample chart - From manual python script",
    },
    headers=headers,
)

print(response)
