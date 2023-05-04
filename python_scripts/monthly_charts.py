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

# Delete predefined charts
ids = requests.get(charts_url).json()["value"]
ids_plucked = [item["id"] for item in ids]
df = pd.DataFrame(ids_plucked)
count = df.shape[0]
print("Deleting charts")

while count > 0:
    for index, row in df.iterrows():
        requests.delete(charts_url + "/" + row.iloc[0])
        print("Deleting chart : " + row.iloc[0])
    ids = requests.get(charts_url).json()["value"]
    ids_plucked = [item["id"] for item in ids]
    df = pd.DataFrame(ids_plucked)
    count = df.shape[0]

print("Charts deleted")

print("Creating monthly charts")

headers = {
    "Content-Type": "application/json;IEEE754Compatible=true",
    "Authorization": "Basic admin",
}

# Fix month because zero padding :(

month = str(datetime.datetime.today().month)

if (len(month) == 1):
    month = "0" + month

for ticker in tickers_plucked:
    response = requests.post(
        charts_url,
        json={
            "ticker": ticker,
            "start_date": "2023-"+month+"-01",
            "end_date": "2023-"+month+"-31",
            "label": ticker+" - USD",
            "title": "Value of "+ticker+" this month",
        },
        headers=headers,
    )
    print("Creating chart " + ticker)

print("Monthly charts created")
