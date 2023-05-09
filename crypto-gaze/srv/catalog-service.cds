using data_model as model from '../db/data-model';

service CatalogService {
    entity Crypto  as projection on model.Crypto;

    action DeleteTicker(ticker: String);
    action AddTicker(ticker: String);
    action RefreshTicker(ticker: String);
}