namespace endpoint_model;

entity RunCommand {
    command : String;
    argTicker : String;
}

entity CommandResult {
    command: String;
    data : String;
}