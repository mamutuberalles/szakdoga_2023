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
import time

charts_url = "http://localhost:4004/chart/PreDefinedCharts"
crypto_url = "http://localhost:4004/catalog/Crypto"
result_url = "http://localhost:4004/endpoint/CommandResult"
headers = {
    "Content-Type": "application/json;IEEE754Compatible=true",
    "Authorization": "Basic admin",
}

issues = ""

ticker = None
start_date = None
end_date = None

def_date = '2018-04-19'

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
    start_date = (sys.argv[2])
#    start_date = int(time.mktime(datetime.datetime.strptime(start_date, "%Y-%m-%d").timetuple()))+3600
except Exception as e:
    print("[ERROR] No start date given or wrong date or date format given, proceeding with default date as 2018-04-19. Exception: "+str(e))
    issues += "[ERROR] No start date given or wrong date or date format given, proceeding with default date as 2018-04-19 Exception: "+str(e)+".\n"
    start_date = def_date


if start_date == "undefined" or start_date == "null":
    print("[ERROR] No start date given or wrong date or date format given, proceeding with default date as 2018-04-19.")
    issues += "[ERROR] No start date given or wrong date or date format given, proceeding with default date as 2018-04-19.\n"
    start_date = def_date


try:
    end_date = (sys.argv[3])
#    end_date = int(time.mktime(datetime.datetime.strptime(end_date, "%Y-%m-%d").timetuple()))+3600
except Exception as e:
    print("[ERROR] No end date given or wrong date or date format given, proceeding without end date. Exception: "+str(e))
    issues += "[ERROR] No end date given or wrong date or date format given, proceeding without end date. Exception: "+str(e)+".\n"
    end_date = None


if end_date == "undefined" or end_date == "null":
    print("[ERROR] No end date given or wrong date or date format given, proceeding without end date.")
    issues += "[ERROR] No end date given or wrong date or date format given, proceeding without end date.\n"




response_url = (crypto_url+"?$filter=ticker eq '" +ticker+"' and type eq 'real'")

if (start_date != "null" and start_date != "undefined" and start_date != None):
    response_url += " and date ge "+str(start_date)

if (end_date != "null" and end_date != "undefined" and end_date != None):
    response_url += " and date le "+str(end_date)

issues += ";ticker:"+ticker+",start_date:"+str(start_date)+",end_date:"+str(end_date)+";"

response_url+="&$top=5000"


response = requests.get(response_url).text

df = pd.json_normalize(pd.read_json(response)['value'])

rounding_number = 3
if df['close'].max() < 10:
     rounding_number = 5
if df['close'].max() > 1000:
     rounding_number = 2

#Range

issues+="\nTotal range: "+str(round(df['low'].min(),rounding_number))+" - "+str(round(df['high'].max(),rounding_number))

#Average

issues+="\nTotal average: "+str(round(df['close'].sum()/df.shape[0],rounding_number))

if (df.shape[0] >= 10):

    #10 day range

    issues+="\n10 day range: "+str(round(df['low'].tail(10).min(),rounding_number))+" - "+str(round(df['high'].tail(10).max(),rounding_number))

    #10 day average

    issues+="\n10 day average: "+str(round(df['close'].tail(10).sum()/10,rounding_number))
else:
    print("\n[ERROR] Could not determine 10 day values, as the dataset is smaller than 10.")
    issues += "\n[ERROR] Could not determine 10 day values, as the dataset is smaller than 10."

#Trend

df.sort_values(by=["date"],ascending=True,inplace=True)

try:
    series = darts.TimeSeries.from_dataframe(df,time_col="date",value_cols="close")
    from darts.models import LinearRegressionModel

    model = LinearRegressionModel(lags=3, output_chunk_length=5)

    model.fit(series)

    forecast = model.predict(2)

    if (forecast[0]-forecast[1]) < 0:
        issues += "\nCurrent trend: upward"
    else: 
        issues += "\nCurrent trend: downward"

except Exception as e:
     print("\n[ERROR] Could not determine trend, possibly because the dataset is too small, please provide a larger dataset. Exception: "+str(e))
     issues += "\n[ERROR] Could not determine trend, possibly because the dataset is too small, please provide a larger dataset. Exception: "+str(e)+"\n"



requests.post(
        result_url,
        json={
            "command": "analysis",
            "data": issues,
        },
        headers=headers,
    )