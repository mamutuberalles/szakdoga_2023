using endpoint_model as model from '../db/endpoint-model';

service EndpointService {
    entity RefreshData as projection on model.RefreshData;
}