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

entity BTC : managed {
//    id : UUID;
    date : Date;
    open : Double;
    high : Double;
    low : Double;
    close : Double;
    adj_close : Double;
    volume : Double;
}

entity ETH : managed {
//    id : UUID;
    date : Date;
    open : Double;
    high : Double;
    low : Double;
    close : Double;
    adj_close : Double;
    volume : Double; 
}

entity XMR : managed {
//    id : UUID;
    date : Date;
    open : Double;
    high : Double;
    low : Double;
    close : Double;
    adj_close : Double;
    volume : Double;
}

entity EXPERIMENTAL : managed {
    date : Date;
    xmr_open : Double;  
    xmr_high : Double;
    xmr_low : Double;
    xmr_close : Double;
    xmr_adj_close : Double;
    xmr_volume : Double;
    eth_open : Double;
    eth_high : Double;
    eth_low : Double;
    eth_close : Double;
    eth_adj_close : Double;
    eth_volume : Double;
    btc_open : Double;
    btc_high : Double;
    btc_low : Double;
    btc_close : Double;
    btc_adj_close : Double;
    btc_volume : Double;
}