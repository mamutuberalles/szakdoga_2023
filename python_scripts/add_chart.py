import sys
import datetime
import requests

charts_url = "http://localhost:4004/chart/PreDefinedCharts"
crypto_url = "http://localhost:4004/Crypto/Crypto"
result_url = "http://localhost:4004/endpoint/CommandResult"
req_headers = {
    "Content-Type": "application/json;IEEE754Compatible=true",
    "Authorization": "Basic admin",
}

ticker=None

try:

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

except Exception as e:
    print("[ERROR] Fatal error occurred: "+str(e))