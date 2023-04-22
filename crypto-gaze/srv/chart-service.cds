using chart_model as model from '../db/chart-model';

service ChartService {
    entity Chart as projection on model.Chart;
    entity OpenChart @readonly as projection on model.OpenChart;
    entity MultiChart as projection on model.MultiChart;
    entity PreDefinedCharts @readonly as projection on model.PreDefinedCharts;
    entity CustomCharts as projection on model.CustomCharts;
}

