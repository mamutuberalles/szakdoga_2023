using endpoint_model as model from '../db/endpoint-model';

service EndpointService {
    entity CommandResult as projection on model.CommandResult;
    action DeleteResult();
    action Experimental();
}