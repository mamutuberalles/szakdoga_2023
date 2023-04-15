using chart_model as model from '../db/chart-model';

service ChartService {
    entity Chart as projection on model.Chart;
    entity OpenChart @readonly as projection on model.OpenChart;
}

