using endpoint_model as model from '../db/endpoint-model';

service EndpointService {
    entity RunCommand as projection on model.RunCommand;
}