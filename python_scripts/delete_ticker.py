import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime
import requests
import csv
import wget
import darts
import darts.utils
import darts.datasets as dds
import datetime
import os

print("Script under revision...")
exit(0)

ticker = (sys.argv[1])
db_url = 'http://localhost:4004/catalog/Crypto'
url1 = "https://query1.finance.yahoo.com/v7/finance/download/"
url2 = "-USD?period1=1524096000&period2="
url3 = "&interval=1d&events=history&includeAdjustedClose=true"

response = requests.get(db_url+"?$filter=ticker eq '" +ticker+"'")
df = pd.DataFrame(response.json()['value'])
count = df.shape[0]
headers = {"Content-Type" : "application/json;IEEE754Compatible=true", "Authorization" : "Basic admin"}
if (count >0 ):
    response = requests.delete(db_url+ "/$batch", headers=headers)
    print(response.json())

exit()

while(count >0):
    tickers = df[df['ticker'] == ticker]
    for index, row in tickers.iterrows():
        delete_url = db_url + "/" + row["id"]
        requests.delete(delete_url)
    response = requests.get(db_url+"?$filter=ticker eq '" +ticker+"'")
    df = pd.DataFrame(response.json()['value'])
    count = df.shape[0]

print(ticker + " cleared. ") 

exit()
