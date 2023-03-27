using data_model as model from '../db/data-model';

service CatalogService {
    entity BTC @readonly as projection on model.BTC;
}