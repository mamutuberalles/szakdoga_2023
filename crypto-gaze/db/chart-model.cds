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
    forecast : String;
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