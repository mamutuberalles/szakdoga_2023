namespace chart_model;

entity CustomCharts {
    key id : UUID;
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
    forecast : String;
    bookmarked : String;
    hidden : String;
}

entity PreDefinedCharts {
    key id : UUID;
    ticker : String;
    start_date : Date;
    end_date : Date;
    label : String;
    title : String;
}