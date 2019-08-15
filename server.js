const grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader"); //cargamos variable de idl protocol buffer
let proto = grpc.loadPackageDefinition(   
    protoLoader.loadSync("proto/vacaciones.proto", { //carga nuestrop archivo proto file ruta de idl
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
    );
    const server = new grpc.Server();
    const SERVER_ADDRESS = "0.0.0.0:2019";
    
    
    
    
    /**
    Check if an employee is eligible for leave.
    True If the requested leave days are greater than 0 and within the number
    of accrued days.
    */
    function eligibleForLeave(call, callback) {
        if (call.request.requested_leave_days > 0) {
            if (call.request.accrued_leave_days > call.request.requested_leave_days) {
                callback(null, {eligible: true });
            } else {
                callback(null, {eligible: false });
                
            }
        } else {
            callback(new Error('Invalid requested days'));
        }
    };
    
    /**
    Grant an employee leave days
    */
    function grantLeave(call, callback) {
        let granted_leave_days = call.request.requested_leave_days;
        let accrued_leave_days = call.request.accrued_leave_days - granted_leave_days;
        callback(null, { granted: true,
            granted_leave_days,
            accrued_leave_days
        });
    };
        
    
    
    
    
    //define the callable methods that correspond to the methods defined in the protofile
    server.addService(proto.work_leave.EmployeeLeaveDaysService.service, {
        EligibleForLeave: eligibleForLeave,
        grantLeave:grantLeave    
    });
    //Specify the IP and and port to start the grpc Server, no SSL in test environment
    server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
    //Start the server
    server.start();
    console.log('grpc server running on port:', SERVER_ADDRESS);