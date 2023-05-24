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
crypto_url = "http://localhost:4004/Crypto/Crypto"
result_url = "http://localhost:4004/endpoint/CommandResult"
headers = {
    "Content-Type": "application/json;IEEE754Compatible=true",
    "Authorization": "Basic admin",
}

issues = ""

ticker = None
start_date = None
end_date = None

def_date = '1970-01-01'

forecast = None

opKey = None

try:

    try:
        opKey = (sys.argv[4])
    except Exception as e:
        print("[ERROR] No operation key was given, proceeding without one, please note that you may not able to view the result of the script through the web gui. Exception: "+str(e))
        issues += "[ERROR] No operation key was given, proceeding without one, please note that you may not able to view the result of the script through the web gui. Exception: "+str(e)+".\n"

    if opKey == "undefined" or opKey == "null":
        print("[ERROR] No operation key was given, proceeding without one, please note that you may not able to view the result of the script through the web gui.")
        issues += "[ERROR] No operation key was given, proceeding without one, please note that you may not able to view the result of the script through the web gui.\n"


    try:
        ticker = (sys.argv[1])
    except:
        print("[ERROR] No ticker given, please add a ticker as the first argument.")
        requests.post(
                result_url,
                json={
                    "command": "add_data",
                    "data": "[ERROR] No ticker given, please add a ticker as the first argument.",
                    "opKey" : opKey
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
                    "opKey" : opKey
                },
                headers=headers,
            )
        exit(1)

    try:
        start_date = (sys.argv[2])
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
    except Exception as e:
        print("[ERROR] No end date given or wrong date or date format given, proceeding without end date. Exception: "+str(e))
        issues += "[ERROR] No end date given or wrong date or date format given, proceeding without end date. Exception: "+str(e)+".\n"
        end_date = None


    if end_date == "undefined" or end_date == "null":
        print("[ERROR] No end date given or wrong date or date format given, proceeding without end date.")
        issues += "[ERROR] No end date given or wrong date or date format given, proceeding without end date.\n"
        end_date = None


    response_url = (crypto_url+"?$filter=ticker eq '" +ticker+"' and type eq 'real'" + " and date ge "+str(start_date))

    if (end_date != None):
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

        forecast = model.predict(60)

        

        if (forecast[0]-forecast[59]) < 0:
            issues += "\nCurrent trend: upward\n;"
        else: 
            issues += "\nCurrent trend: downward\n;"

    except Exception as e:
        print("\n[ERROR] Could not determine trend, possibly because the dataset is too small, please provide a larger dataset. Exception: "+str(e))
        issues += "\n[ERROR] Could not determine trend, possibly because the dataset is too small, please provide a larger dataset. Exception: "+str(e)+"\n;"

    if isinstance(forecast, darts.timeseries.TimeSeries):
        forecast = forecast.pd_dataframe()
        idx = pd.date_range(df['date'].tail(1).to_string(index=False), periods=61)
        idx = idx.delete(0)
        for x in range(60):
            issues += str(idx[x].date() )+":"+str(forecast.iloc[x]['close']) +","
    
    requests.post(
            result_url,
            json={
                "command": "analysis",
                "data": issues,
                "opKey" : opKey
            },
            headers=headers,
        )
except Exception as e:
    print("[ERROR]  Fatal error encountered during the running of the script: "+str(e))
    requests.post(
                result_url,
                json={
                    "command": "add_data",
                    "data": "[ERROR] Fatal error encountered during the running of the script: "+str(e),
                    "opKey" : opKey
                },
                headers=headers,
            )