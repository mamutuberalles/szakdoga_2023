namespace data_model;
using { managed } from '@sap/cds/common';

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