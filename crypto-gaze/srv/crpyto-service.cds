using data_model as model from '../db/data-model';

service CatalogService {
    entity Crypto @readonly as projection on model.Crypto;
}