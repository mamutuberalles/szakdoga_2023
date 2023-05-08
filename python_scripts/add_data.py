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

ticker = (sys.argv[1])
db_url = 'http://localhost:4004/catalog/Crypto'
url1 = "https://query1.finance.yahoo.com/v7/finance/download/"
url2 = "-USD?period1=1524096000&period2="
url3 = "&interval=1d&events=history&includeAdjustedClose=true"

response = requests.get(db_url+"?$filter=ticker eq '" +ticker+"' and type eq 'real'")



print("Looking for values")
df = pd.DataFrame(response.json()['value'])
if (df.shape[0] > 0):
    print("Data exists already, please use the refresh script")
    exit()

print("Data not found, fetching")
now = datetime.datetime(datetime.datetime.now().year,datetime.datetime.now().month,datetime.datetime.now().day,2,0,0).timestamp().__round__()
url = url1 + ticker + url2 + str(now) + url3
r = wget.download(url, ticker+"-USD.csv")
df_downloaded = pd.read_csv(ticker+"-USD.csv")
os.remove(ticker+"-USD.csv")
df2 = df_downloaded.rename( columns= { 'Date' : 'date', 'Open' : 'open', 'High' : 'high', 'Low' : 'low', 'Close' : 'close', 'Adj Close' : 'adj_close', 'Volume' : 'volume'})
count = df2.shape[0]
ticker_field = [ticker] * count
type_field = ['real'] * count
df2.insert(7,'ticker',ticker_field, True)
df2.insert(8,'type',type_field, True)
series = darts.TimeSeries.from_dataframe(df2,time_col="date",value_cols="close")
_,series_05 = series.split_before(0.5)
_,series_075 = series.split_before(0.75)
_,series_09 = series.split_before(0.9)
from darts.utils import missing_values
series_05 = darts.utils.missing_values.fill_missing_values(series_05)
series_075 = darts.utils.missing_values.fill_missing_values(series_075)
series_09 = darts.utils.missing_values.fill_missing_values(series_09)
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
df_05 = forecast_05.pd_dataframe()
df_075 = forecast_075.pd_dataframe()
df_09 = forecast_09.pd_dataframe()
start_dt = datetime.date.today() + datetime.timedelta(days=1)
end_dt = datetime.date.today() + datetime.timedelta(days=60)  #FIXIT
delta = datetime.timedelta(days=1)
dates = []
while start_dt <= end_dt:
    dates.append(start_dt.isoformat())
    start_dt += delta
ticker_field = [ticker] * 60
type_field = ['forecast_05'] * 60
df_05.insert(1,'date',dates, True)
column_list = ['date','open','high','low','close','adj_close','volume']
df_05 = df_05.reindex(columns = column_list)
df_05.insert(7,'ticker',ticker_field, True)
df_05.insert(8,'type',type_field, True)
ticker_field = [ticker] * 60
type_field = ['forecast_075'] * 60
df_075.insert(1,'date',dates, True)
column_list = ['date','open','high','low','close','adj_close','volume']
df_075 = df_075.reindex(columns = column_list)
df_075.insert(7,'ticker',ticker_field, True)
df_075.insert(8,'type',type_field, True)
ticker_field = [ticker] * 60
type_field = ['forecast_09'] * 60
df_09.insert(1,'date',dates, True)
column_list = ['date','open','high','low','close','adj_close','volume']
df_09 = df_09.reindex(columns = column_list)
df_09.insert(7,'ticker',ticker_field, True)
df_09.insert(8,'type',type_field, True)
df_05.fillna(0, inplace=True)
df_075.fillna(0, inplace=True)
df_09.fillna(0, inplace=True)
# Send every row of df2 to the database
headers = {"Content-Type" : "application/json;IEEE754Compatible=true", "Authorization" : "Basic admin"}
#'{"date":"2018-12-28","open":116.898201,
# "high":137.647018,"
# low":115.69313,
# "close":137.647018,
# "adj_close":137.647018,
# "volume":3130201009.0,
# "ticker":"ETH",
# "type":"real"}'
#requests.post(db_url, json = '{"date":"2018-12-28","open":116.898201,"high":137.647018,"low":115.69313,"close":137.647018,"adj_close":137.647018,"volume":3130201009.0,"ticker":"ETH","type":"real"}', headers=headers)
#exit()
for index in df2.index:
    print("****DATA****")
    print(df2.iloc[index].to_json())

    try:
        requests.post(db_url, json = {
            "date" : df2.iloc[index]['date'],
            "open" : df2.iloc[index]['open'],
            "high" : df2.iloc[index]['high'],
            "low" : df2.iloc[index]['low'],
            "close" : df2.iloc[index]['close'],
            "adj_close" : df2.iloc[index]['adj_close'],
            "volume" : df2.iloc[index]['open'],
            "ticker" : df2.iloc[index]['ticker'],
            "type" : df2.iloc[index]['type'],
        }, headers=headers)
    except:
        print("Wrong value deetected, skipping")
print(ticker + " added. ")


