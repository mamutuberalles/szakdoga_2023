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

mode = (sys.argv[1])
ticker = (sys.argv[2])
#https://query1.finance.yahoo.com/v7/finance/download/BTC-USD?period1=1524096000&period2=1681862400&interval=1d&events=history&includeAdjustedClose=true
url1 = "https://query1.finance.yahoo.com/v7/finance/download/"
url2 = "-USD?period1=1524096000&period2="
url3 = "&interval=1d&events=history&includeAdjustedClose=true"
db_url = "http://localhost:4004/catalog/Crypto"

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

elif( mode == "crypto" ):
    # read existing data
    df = pd.read_csv("../crypto-gaze/db/csv/data_model.Crypto.csv", sep=";")
    # remove requested data
    df_cleaned = df[df['ticker'] != ticker]
    # add requested data
    now = datetime.datetime(datetime.datetime.now().year,datetime.datetime.now().month,datetime.datetime.now().day,2,0,0).timestamp().__round__()
    
    url = url1 + ticker + url2 + str(now) + url3
    r = wget.download(url, ticker+"-USD.csv")
    #open(ticker+'-USD.csv', 'wb').write(r.content)
    df_downloaded = pd.read_csv(ticker+"-USD.csv")
    #print(df_downloaded.tail())
    os.remove(ticker+"-USD.csv")
    df2 = df_downloaded.rename( columns= { 'Date' : 'date', 'Open' : 'open', 'High' : 'high', 'Low' : 'low', 'Close' : 'close', 'Adj Close' : 'adj_close', 'Volume' : 'volume'})
    count = df2.shape[0]
    ticker_field = [ticker] * count
    type_field = ['real'] * count
    df2.insert(7,'ticker',ticker_field, True)
    df2.insert(8,'type',type_field, True)
    #print(df2.tail())
    # add forecasted data
    series = darts.TimeSeries.from_dataframe(df2,time_col="date",value_cols="close")
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
    df_05 = forecast_05.pd_dataframe()
    df_075 = forecast_075.pd_dataframe()
    df_09 = forecast_09.pd_dataframe()
    start_dt = datetime.date.today() + datetime.timedelta(days=1)
    end_dt = datetime.date.today() + datetime.timedelta(days=60)  #FIXIT

    # difference between current and previous date
    delta = datetime.timedelta(days=1)

    # store the dates between two dates in a list
    dates = []

    while start_dt <= end_dt:
        # add current date to list by converting  it to iso format
        dates.append(start_dt.isoformat())
        # increment start date by timedelta
        start_dt += delta

    #print('Dates between', start_dt, 'and', end_dt)
    #print(dates)


    ticker_field = [ticker] * 60
    type_field = ['forecast_05'] * 60
    df_05.insert(1,'date',dates, True)
    column_list = ['date','open','high','low','close','adj_close','volume']
    #print()
    #print(df_05.columns)
    df_05 = df_05.reindex(columns = column_list)
#    print(df_05.head())
    df_05.insert(7,'ticker',ticker_field, True)
    df_05.insert(8,'type',type_field, True)
#    print(df_05.head())

    ticker_field = [ticker] * 60
    type_field = ['forecast_075'] * 60
    df_075.insert(1,'date',dates, True)
    column_list = ['date','open','high','low','close','adj_close','volume']
    df_075 = df_075.reindex(columns = column_list)
    df_075.insert(7,'ticker',ticker_field, True)
    df_075.insert(8,'type',type_field, True)
#    print(df_05.head(2))

    ticker_field = [ticker] * 60
    type_field = ['forecast_09'] * 60
    df_09.insert(1,'date',dates, True)
    column_list = ['date','open','high','low','close','adj_close','volume']
    df_09 = df_09.reindex(columns = column_list)
    df_09.insert(7,'ticker',ticker_field, True)
    df_09.insert(8,'type',type_field, True)
#    print(df_05.head(2))

    df_05.fillna(0, inplace=True)
#    print(df_05.head())
#    print(df_05['date'].head())
    df_075.fillna(0, inplace=True)
    df_09.fillna(0, inplace=True)

    df_cleaned = pd.concat([df_cleaned, df2])
    df_cleaned = pd.concat([df_cleaned, df_05])
#    print(df_cleaned.tail())
    df_cleaned = pd.concat([df_cleaned, df_075])
    df_cleaned = pd.concat([df_cleaned, df_09])
    
    # print values
    
    
    
    df_cleaned.to_csv("temp.csv",index=False,date_format='$Y-$m-$d')
    reader = csv.reader(open("temp.csv"), delimiter=',')
    writer = csv.writer(open("../crypto-gaze/db/csv/data_model.Crypto.csv", 'w'), delimiter=';')
    writer.writerows(reader)
    print("Script finished")
    sys.stdout.flush()

elif( mode == "final" ):
# Read database, and get rid of elements
    response = requests.get(db_url+"?$filter=ticker eq '" +ticker+"'")
    df = pd.DataFrame(response.json()['value'])
    #print(df.shape[0])

    count = df.shape[0]
    while(count >0):
        tickers = df[df['ticker'] == ticker]
        for index, row in tickers.iterrows():
            delete_url = db_url + "/" + row["id"]
            requests.delete(delete_url)
            #print(row["id"] + " -> deleted")
        response = requests.get(db_url+"?$filter=ticker eq '" +ticker+"'")
        df = pd.DataFrame(response.json()['value'])
        #print(df.shape[0])
        count = df.shape[0]

    print(ticker + " cleared. ")
# Get and shape new elements    
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
    #df2 = pd.concat([df2, df_05])
    #df2 = pd.concat([df2, df_075])
    #df2 = pd.concat([df2, df_09])
# Send every row of df2 to the database
    #print(df2.to_json(orient = 'records'))
    headers = {"Content-Type" : "application/json;IEEE754Compatible=true", "Authorization" : "Basic admin"}
    #'{"date":"2018-12-28","open":116.898201,"high":137.647018,"low":115.69313,"close":137.647018,"adj_close":137.647018,"volume":3130201009.0,"ticker":"ETH","type":"real"}'
    #requests.post(db_url, json = '{"date":"2018-12-28","open":116.898201,"high":137.647018,"low":115.69313,"close":137.647018,"adj_close":137.647018,"volume":3130201009.0,"ticker":"ETH","type":"real"}', headers=headers)
    #exit()
    for index in df2.index:
        print("****DATA****")
        print(df2.iloc[index].to_json())
        requests.post(db_url, json = df2.iloc[index].to_json(), headers=headers)
        
    print(ticker + " updated. ")
else:
    exit()