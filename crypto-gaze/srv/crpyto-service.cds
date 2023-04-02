using data_model as model from '../db/data-model';

service CatalogService {
    entity BTC @readonly as projection on model.BTC;
    entity ETH @readonly as projection on model.ETH;
    entity XMR @readonly as projection on model.XMR;
}