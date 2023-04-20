namespace chart_model;

entity Chart {
    id : Integer;
    ticker: String;
    type : String;
    label : String;
    timestamp_start : Date;
    timestamp_end : Date;
}

entity OpenChart {
    id : Integer;
    ticker : String;
    type : String;
    label : String;
}

entity MultiChart {
    id : Integer;
    text : String;
    ticker : String;
    type : String;
    label : String;
    timestamp : Boolean;
    timestamp_start : Date;
    timestamp_end : Date;
    axis2 : Boolean;
    ticker2 : String;
    type2: String;
    label2 : String;

}