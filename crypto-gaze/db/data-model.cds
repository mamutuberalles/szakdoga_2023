namespace data_model;
using { managed } from '@sap/cds/common';


entity Crypto : managed {
    date : Date;
    open : Double;
    high : Double;
    low : Double;
    close : Double;
    adj_close : Double;
    volume : Double;
    ticker : String; //BTC, ETH, XMR
    type: String; // Real, forecast_05, forecast_075, forecast_09
}