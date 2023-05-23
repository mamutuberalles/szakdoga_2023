using data_model as model from '../db/data-model';

service CryptoService {
    entity Crypto @(cds.query.limit:{  max: 3000 }) as projection on model.Crypto;

    action DeleteTicker(ticker: String, opKey : String);
    action AddTicker(ticker: String, date: String, opKey: String);
    action RefreshTicker(ticker: String, date: String, opKey: String);
}