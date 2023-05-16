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
import time

ticker="None"

date ="None"

headers = {"Content-Type" : "application/json;IEEE754Compatible=true", "Authorization" : "Basic admin"}
issues = ""

result_url = "http://localhost:4004/endpoint/CommandResult"

db_url = 'http://localhost:4004/catalog/Crypto'
url1 = "https://query1.finance.yahoo.com/v7/finance/download/"
url2 = "-USD?period1="
no_date = "1524096000"
url3 = "&period2="
url4 = "&interval=1d&events=history&includeAdjustedClose=true"

try:
    ticker = (sys.argv[1])
except:
    print("[ERROR] No ticker given, please add a ticker as the first argument.")
    requests.post(
            result_url,
            json={
                "command": "add_data",
                "data": "[ERROR] No ticker given, please add a ticker as the first argument.",
            },
            headers=headers,
        )
    exit(1)

if ticker == "undefined" or ticker == "null":
    print("[ERROR] No ticker given, please add a ticker as the first argument.")
    requests.post(
            result_url,
            json={
                "command": "add_data",
                "data": "[ERROR] No ticker given, please add a ticker as the first argument.",
            },
            headers=headers,
        )
    exit(1)

try:
    date = (sys.argv[2])
    date = int(time.mktime(datetime.datetime.strptime(date, "%Y-%m-%d").timetuple()))+3600
except Exception as e:
    print("[ERROR] No date given or wrong date or date format given, proceeding with default date as 2018-04-19. Exception: "+str(e))
    issues += "[ERROR] No date given or wrong date or date format given, proceeding with default date as 2018-04-19 Exception: "+str(e)+".\n"
    date = no_date


if date == "undefined" or date == "null":
    print("[ERROR] No date given or wrong date or date format given, proceeding with default date as 2018-04-19."+str(e))
    issues += "[ERROR] No date given or wrong date or date format given, proceeding with default date as 2018-04-19. Exception :"+str(e)+".\n"




response = requests.get(db_url+"?$filter=ticker eq '" +ticker+"' and type eq 'real'")



print("Looking for values")
df = pd.DataFrame(response.json()['value'])
if (df.shape[0] > 0):
    print("[ERROR] Data exists already, please use the refresh script")
    requests.post(
            result_url,
            json={
                "command": "add_data",
                "data": "[ERROR] Data exists already, please use the refresh script",
            },
            headers=headers,
        )
    exit(1)

print("[INFO] Data not found, fetching")
now = datetime.datetime(datetime.datetime.now().year,datetime.datetime.now().month,datetime.datetime.now().day,2,0,0).timestamp().__round__()

url = ""

if date == "None":
    url = url1 + ticker + url2 +no_date+url3 +str(now) + url4
else:
    url = url1 + ticker + url2 +str(date)+url3 +str(now) + url4


try:
    r = wget.download(url, ticker+"-USD.csv")
except Exception as e:
    print("[ERROR] Exception encountered as trying to get data from yahoo with ticker: "+ticker)
    print(e)
    requests.post(
            result_url,
            json={
                "command": "add_data",
                "data": "[ERROR] Exception encountered as trying to get data from yahoo with ticker: "+ticker+"\n"+str(e),
            },
            headers=headers,
        )
    exit(1)

df_downloaded = pd.read_csv(ticker+"-USD.csv")
os.remove(ticker+"-USD.csv")
df2 = df_downloaded.rename( columns= { 'Date' : 'date', 'Open' : 'open', 'High' : 'high', 'Low' : 'low', 'Close' : 'close', 'Adj Close' : 'adj_close', 'Volume' : 'volume'})
count = df2.shape[0]
ticker_field = [ticker] * count
type_field = ['real'] * count
df2.insert(7,'ticker',ticker_field, True)
df2.insert(8,'type',type_field, True)
#df2.fillna(0, inplace=True)
print()
print("[INFO] Calculating forecast values")
series = darts.TimeSeries.from_dataframe(df2,time_col="date",value_cols="close")
_,series_05 = series.split_before(0.5)
_,series_075 = series.split_before(0.75)
_,series_09 = series.split_before(0.9)
from darts.utils import missing_values
series_05 = darts.utils.missing_values.fill_missing_values(series_05)
series_075 = darts.utils.missing_values.fill_missing_values(series_075)
series_09 = darts.utils.missing_values.fill_missing_values(series_09)
from darts.models import CatBoostModel, XGBModel
model_05 = CatBoostModel([-10,-1],output_chunk_length=5)
model_075 = CatBoostModel([-10,-1],output_chunk_length=5)
model_09 = CatBoostModel([-10,-1],output_chunk_length=5)


""" model_05 = XGBModel(lags=3,output_chunk_length=5)
model_075 = XGBModel(lags=3,output_chunk_length=5)
model_09 = XGBModel(lags=3,output_chunk_length=5)
 """

start_dt = datetime.date.today() + datetime.timedelta(days=1)
end_dt = datetime.date.today() + datetime.timedelta(days=60)  #FIXIT
delta = datetime.timedelta(days=1)
dates = []
while start_dt <= end_dt:
    dates.append(start_dt.isoformat())
    start_dt += delta


df_05 = 0
df_075 = 0
df_09 = 0

try:
    print("[INFO] Predicting 05 values")
    ticker_field = [ticker] * 60
    type_field = ['forecast_05'] * 60
    model_05.fit(series_05)
    forecast_05 = model_05.predict(60)
    df_05 = forecast_05.pd_dataframe()
    df_05.insert(1,'date',dates, True)
    column_list = ['date','open','high','low','close','adj_close','volume']
    df_05 = df_05.reindex(columns = column_list)
    df_05.insert(7,'ticker',ticker_field, True)
    df_05.insert(8,'type',type_field, True)
    df_05.fillna(0, inplace=True)
    new_index = pd.Index([item for item in range(0, df_05.shape[0])])
    df_05.set_index(new_index, inplace=True)
except Exception as e:
    print("[ERROR] Exception encountered: "+str(e))
    print("[ERROR] 05 prediction failed as not enough data was given, please pick an earlier date")
    issues += "[ERROR] Exception encountered: "+str(e)+"\n"+"[ERROR] 05 prediction failed as not enough data was given, please pick an earlier date"+"\n"


try:
    print("[INFO] Predicting 075 values")
    model_075.fit(series_075)
    forecast_075 = model_075.predict(60)
    df_075 = forecast_075.pd_dataframe()
    ticker_field = [ticker] * 60
    type_field = ['forecast_075'] * 60
    df_075.insert(1,'date',dates, True)
    column_list = ['date','open','high','low','close','adj_close','volume']
    df_075 = df_075.reindex(columns = column_list)
    df_075.insert(7,'ticker',ticker_field, True)
    df_075.insert(8,'type',type_field, True)
    df_075.fillna(0, inplace=True)
    new_index = pd.Index([item for item in range(0, df_075.shape[0])])
    df_075.set_index(new_index, inplace=True)
except Exception as e:
    print("[ERROR] Exception encountered: "+str(e))
    print("[ERROR] 075 prediction failed as not enough data was given, please pick an earlier date")
    issues += "[ERROR] Exception encountered: "+str(e)+"\n"+"[ERROR] 075 prediction failed as not enough data was given, please pick an earlier date"+"\n"

try:
    print("[INFO] Predicting 09 values")
    model_09.fit(series_09)
    forecast_09 = model_09.predict(60)
    df_09 = forecast_09.pd_dataframe()
    ticker_field = [ticker] * 60
    type_field = ['forecast_09'] * 60
    df_09.insert(1,'date',dates, True)
    column_list = ['date','open','high','low','close','adj_close','volume']
    df_09 = df_09.reindex(columns = column_list)
    df_09.insert(7,'ticker',ticker_field, True)
    df_09.insert(8,'type',type_field, True)
    df_09.fillna(0, inplace=True)
    new_index = pd.Index([item for item in range(0, df_09.shape[0])])
    df_09.set_index(new_index, inplace=True)
except Exception as e:
    print("[ERROR] Exception encountered: "+str(e))
    print("[ERROR] 09 prediction failed as not enough data was given, please pick an earlier date")
    issues += "[ERROR] Exception encountered: "+str(e)+"\n"+"[ERROR] 09 prediction failed as not enough data was given, please pick an earlier date"+"\n"



print("[INFO] Adding real values")


for index in df2.index:
#    print("[DEBUG] Adding record "+df2.iloc[index].to_json())
    try:
        requests.post(db_url, json = {
            "date" : df2.iloc[index]['date'],
            "open" : round(df2.iloc[index]['open'],2),
            "high" : round(df2.iloc[index]['high'],2),
            "low" : round(df2.iloc[index]['low'],2),
            "close" : round(df2.iloc[index]['close'],2),
            "adj_close" : round(df2.iloc[index]['adj_close'],2),
            "volume" : int(df2.iloc[index]['volume']),
            "ticker" : df2.iloc[index]['ticker'],
            "type" : df2.iloc[index]['type'],
        }, headers=headers)
    except Exception as e:
        print("[ERROR] Exception encountered during upload, trying null values: "+str(e))
        try:
                requests.post(db_url, json = {
                    "date" : df2.iloc[index]['date'],
                    "open" : None,
                    "high" : None,
                    "low" : None,
                    "close" : None,
                    "adj_close" : None,
                    "volume" : None,
                    "ticker" : df2.iloc[index]['ticker'],
                    "type" : df2.iloc[index]['type'],
                }, headers=headers)
        except:
                print("[ERROR] Exception encountered during upload, please check on it: "+str(e))
                requests.post(
                    result_url,
                    json={
                        "command": "add_data",
                        "data": "[ERROR] Exception encountered during upload, please check on it: "+str(e),
                    },
                    headers=headers,
                )
                exit(1)


if isinstance(df_05,pd.DataFrame):
    print("[INFO] Adding forecasted values (05)")

    for index in df_05.index:
    #    print("[INFO] Adding record "+df_05.iloc[index].to_json())
        try:
            requests.post(db_url, json = {
                "date" : df_05.iloc[index]['date'],
                "open" : round(df_05.iloc[index]['open'],2),
                "high" : round(df_05.iloc[index]['high'],2),
                "low" : round(df_05.iloc[index]['low'],2),
                "close" : round(df_05.iloc[index]['close'],2),
                "adj_close" : round(df_05.iloc[index]['adj_close'],2),
                "volume" : int(df_05.iloc[index]['volume']),
                "ticker" : df_05.iloc[index]['ticker'],
                "type" : df_05.iloc[index]['type'],
            }, headers=headers)
        except Exception as e:
            print("[ERROR] Exception encountered during upload, trying null values: "+str(e))
            try:
                    requests.post(db_url, json = {
                        "date" : df_05.iloc[index]['date'],
                        "open" : None,
                        "high" : None,
                        "low" : None,
                        "close" : None,
                        "adj_close" : None,
                        "volume" : None,
                        "ticker" : df_05.iloc[index]['ticker'],
                        "type" : df_05.iloc[index]['type'],
                    }, headers=headers)
            except:
                    print("[ERROR] Exception encountered during upload, please check on it: "+str(e))
                    requests.post(
                        result_url,
                        json={
                            "command": "add_data",
                            "data": "[ERROR] Exception encountered during upload, please check on it: "+str(e),
                        },
                        headers=headers,
                    )
                    exit(1)


if isinstance(df_075,pd.DataFrame):
    print("[INFO] Adding forecasted values (075)")

    for index in df_075.index:
    #    print("[INFO] Adding record "+df_075.iloc[index].to_json())
        try:
            requests.post(db_url, json = {
                "date" : df_075.iloc[index]['date'],
                "open" : round(df_075.iloc[index]['open'],2),
                "high" : round(df_075.iloc[index]['high'],2),
                "low" : round(df_075.iloc[index]['low'],2),
                "close" : round(df_075.iloc[index]['close'],2),
                "adj_close" : round(df_075.iloc[index]['adj_close'],2),
                "volume" : int(df_075.iloc[index]['volume']),
                "ticker" : df_075.iloc[index]['ticker'],
                "type" : df_075.iloc[index]['type'],
            }, headers=headers)
        except Exception as e:
            print("[ERROR] Exception encountered during upload, trying null values: "+str(e))
            try:
                    requests.post(db_url, json = {
                        "date" : df_075.iloc[index]['date'],
                        "open" : None,
                        "high" : None,
                        "low" : None,
                        "close" : None,
                        "adj_close" : None,
                        "volume" : None,
                        "ticker" : df_075.iloc[index]['ticker'],
                        "type" : df_075.iloc[index]['type'],
                    }, headers=headers)
            except:
                    print("[ERROR] Exception encountered during upload, please check on it: "+str(e))
                    requests.post(
                        result_url,
                        json={
                            "command": "add_data",
                            "data": "[ERROR] Exception encountered during upload, please check on it: "+str(e),
                        },
                        headers=headers,
                    )
                    exit(1)

if isinstance(df_09,pd.DataFrame):
    print("[INFO] Adding forecasted values (09)")
    for index in df_09.index:
    #    print("[INFO] Adding record "+df_09.iloc[index].to_json())
        try:
            requests.post(db_url, json = {
                "date" : df_09.iloc[index]['date'],
                "open" : round(df_09.iloc[index]['open'],2),
                "high" : round(df_09.iloc[index]['high'],2),
                "low" : round(df_09.iloc[index]['low'],2),
                "close" : round(df_09.iloc[index]['close'],2),
                "adj_close" : round(df_09.iloc[index]['adj_close'],2),
                "volume" : int(df_09.iloc[index]['volume']),
                "ticker" : df_09.iloc[index]['ticker'],
                "type" : df_09.iloc[index]['type'],
            }, headers=headers)
        except Exception as e:
            print("[ERROR] Exception encountered during upload, trying null values: "+str(e))
            try:
                    requests.post(db_url, json = {
                        "date" : df_09.iloc[index]['date'],
                        "open" : None,
                        "high" : None,
                        "low" : None,
                        "close" : None,
                        "adj_close" : None,
                        "volume" : None,
                        "ticker" : df_09.iloc[index]['ticker'],
                        "type" : df_09.iloc[index]['type'],
                    }, headers=headers)
            except:
                    print("[ERROR] Exception encountered during upload, please check on it: "+str(e))
                    requests.post(
                        result_url,
                        json={
                            "command": "add_data",
                            "data": "[ERROR] Exception encountered during upload, please check on it: "+str(e),
                        },
                        headers=headers,
                    )
                    exit(1)
print("[INFO] " + ticker + " added. ")
requests.post(
            result_url,
            json={
                "command": "add_data",
                "data": issues + "\n[INFO] " + ticker + " added. ",
            },
            headers=headers,
        )


