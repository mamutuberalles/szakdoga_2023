namespace chart_model;

entity CustomCharts {
    id : UUID;
    ticker : String;
    start_date : Date;
    end_date : Date;
    label : String;
    title : String;
    field : String;
    chart_type : String;
    ticker2 : String;
    field2: String;
    label2 : String;
}

entity PreDefinedCharts {
    id : UUID;
    ticker : String;
    start_date : Date;
    end_date : Date;
    label : String;
    title : String;
    // TODO : Script for updating this every day for this month, or last 30 days
}


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