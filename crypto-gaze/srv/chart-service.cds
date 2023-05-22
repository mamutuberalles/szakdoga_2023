using chart_model as model from '../db/chart-model';

service ChartService {
    entity PreDefinedCharts as projection on model.PreDefinedCharts;
    entity CustomCharts as projection on model.CustomCharts;
    action RefreshCharts(opKey: String);
}

