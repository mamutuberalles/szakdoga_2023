using endpoint_model as model from '../db/endpoint-model';

service EndpointService {
    entity CommandResult as projection on model.CommandResult;
    action DeleteResult(opKey: String);
    action Experimental();
    action Analyst(ticker: String, start_date: String, end_date: String, opKey: String);
}