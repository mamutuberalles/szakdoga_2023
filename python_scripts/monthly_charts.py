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
result_url = "http://localhost:4004/endpoint/CommandResult"
req_headers = {
    "Content-Type": "application/json;IEEE754Compatible=true",
    "Authorization": "Basic admin",
}


# Get available tickers
tickers = requests.get(crypto_url + "?$apply=groupby((ticker))").json()["value"]
tickers_plucked = [item["ticker"] for item in tickers]

# Delete predefined charts
ids = requests.get(charts_url).json()["value"]
ids_plucked = [item["id"] for item in ids]
df = pd.DataFrame(ids_plucked)
count = df.shape[0]

if count > 0:
    print("[INFO] Deleting charts")

    while count > 0:
        for index, row in df.iterrows():
            requests.delete(charts_url + "/" + row.iloc[0])
            print("[INFO] Deleting chart : " + row.iloc[0])
        ids = requests.get(charts_url).json()["value"]
        ids_plucked = [item["id"] for item in ids]
        df = pd.DataFrame(ids_plucked)
        count = df.shape[0]

    print("[INFO] Charts deleted")

else:
    print("[INFO] No charts to be deleted")

if len(tickers_plucked) > 0:
    print("[INFO] Creating monthly charts")

    # Fix month because zero padding :(

    month = str(datetime.datetime.today().month)

    if len(month) == 1:
        month = "0" + month

    for ticker in tickers_plucked:
        response = requests.post(
            charts_url,
            json={
                "ticker": ticker,
                "start_date": "2023-" + month + "-01",
                "end_date": "2023-" + month + "-31",
                "label": ticker + " - USD",
                "title": "Value of " + ticker + " this month",
            },
            headers=req_headers,
        )
        print("[INFO] Creating chart " + ticker)

    print("[INFO] Monthly charts created")

else:
    print("[INFO] No charts to be created")

requests.post(
    result_url,
    json={
        "command": "chart_refresh",
        "data": "[INFO] Charts refreshed.",
    },
    headers=req_headers,
)
