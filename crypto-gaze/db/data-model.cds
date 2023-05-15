namespace data_model;
using { managed } from '@sap/cds/common';


entity Crypto : managed {
    key id : UUID;
    date : Date;
    open : Double null;
    high : Double null;
    low : Double null;
    close : Double null;
    adj_close : Double null;
    volume : Double null;
    ticker : String; //BTC, ETH, XMR
    type: String; // Real, forecast_05, forecast_075, forecast_09
}