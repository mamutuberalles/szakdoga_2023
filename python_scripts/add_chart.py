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

ticker=None

try:
    ticker = (sys.argv[1])
except:
    print("[ERROR] No ticker given, please add a ticker as the first argument.")
    exit(1)

if ticker == "undefined" or ticker == "null":
    print("[ERROR] No ticker given, please add a ticker as the first argument.")
    exit(1)

month = str(datetime.datetime.today().month)

if len(month) == 1:
    month = "0" + month


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


print("[INFO] Chart "+ ticker+" added.")
