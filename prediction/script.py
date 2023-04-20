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

mode = (sys.argv[1])
ticker = (sys.argv[2])
#https://query1.finance.yahoo.com/v7/finance/download/BTC-USD?period1=1524096000&period2=1681862400&interval=1d&events=history&includeAdjustedClose=true
url1 = "https://query1.finance.yahoo.com/v7/finance/download/"
url2 = "-USD?period1=1524096000&period2="
url3 = "&interval=1d&events=history&includeAdjustedClose=true"

if ( mode == "download"):
    now = datetime.datetime(datetime.datetime.now().year,datetime.datetime.now().month,datetime.datetime.now().day,2,0,0).timestamp().__round__()
    url = url1 + ticker + url2 + str(now) + url3
    r = wget.download(url, ticker+"-USD.csv")
    #open(ticker+'-USD.csv', 'wb').write(r.content)
    df = pd.read_csv(ticker+"-USD.csv")
    df2 = df.rename( columns= { 'Date' : 'date', 'Open' : 'open', 'High' : 'high', 'Low' : 'low', 'Close' : 'close', 'Adj Close' : 'adj_close', 'Volume' : 'volume'})
    df2.to_csv(ticker+"-USD.csv",index=False)
    reader = csv.reader(open(ticker+"-USD.csv"), delimiter=',')
    writer = csv.writer(open("../crypto-gaze/db/csv/data_model."+ticker+".csv", 'w'), delimiter=';')
    writer.writerows(reader)

elif ( mode == "predict"):
    df = pd.read_csv("../crypto-gaze/db/csv/data_model."+ticker+".csv", sep=";")
    print(df.columns)
    df.drop(df.columns[[1,2,3,5,6]], axis=1, inplace=True)
    print(df.columns)
    print(df.head())
    series = darts.TimeSeries.from_dataframe(df,time_col="date",value_cols="close")
    _,series_05 = series.split_before(0.5)
    _,series_075 = series.split_before(0.75)
    _,series_09 = series.split_before(0.9)
    from darts.models import CatBoostModel
    model_05 = CatBoostModel([-10,-1],output_chunk_length=5)
    model_075 = CatBoostModel([-10,-1],output_chunk_length=5)
    model_09 = CatBoostModel([-10,-1],output_chunk_length=5)
    model_05.fit(series_05)
    model_075.fit(series_075)
    model_09.fit(series_09)
    forecast_05 = model_05.predict(60)
    forecast_075 = model_075.predict(60)
    forecast_09 = model_09.predict(60)

else:
    exit()