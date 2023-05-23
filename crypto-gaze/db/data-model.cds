namespace data_model;

entity Crypto  {
    date : Date;
    open : Double null;
    high : Double null;
    low : Double null;
    close : Double null;
    adj_close : Double null;
    volume : Double null;
    ticker : String;
    type: String;
}