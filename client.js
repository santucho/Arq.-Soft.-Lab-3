const grpc = require('grpc');
var protoLoader = require("@grpc/proto-loader");
var readline = require("readline");
const SERVER_ADDRESS = "0.0.0.0:2019";

//Read terminal Lines
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var proto = grpc.loadPackageDefinition(protoLoader.loadSync("proto/vacaciones.proto",
{
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
}));

let employee_id;
let name;
let accrued_leave_days;
let requested_leave_days;


//Create gRPC client
let client = new proto.work_leave.EmployeeLeaveDaysService(SERVER_ADDRESS,grpc.credentials.createInsecure());



rl.question("Ingrese su id: ", (answer1) => {
    rl.question("Ingrese su nombre: ", (answer2) => {
        rl.question("Ingrese numero de dias a favor: ", (answer3) => {
            rl.question("Ingrese su peticion de dias: ", (answer4) => {
                employee_id = answer1;
                name = answer2;
                accrued_leave_days = answer3;
                requested_leave_days = answer4;  
                startLink();                    
            });
        });    
    });
});




//Start the stream between server and client
function startLink(){     
    client.eligibleForLeave({employee_id:employee_id, name:name, accrued_leave_days:accrued_leave_days, requested_leave_days:requested_leave_days},
        (err, res) => {
            if (!err) {                                       
                //var isElegible = res.eligible.toLowerCase() == 'true' ? true : false;   
                //console.log(res)
                //console.log(res.eligible)                
                if (res.eligible) {
                    givePermission();                    
                } else {
                    console.log('Permiso no concedido')
                }                                 
            } else {
                console.log(err);
            }                            
        });
    }; 
    
function givePermission(){    
    client.grantLeave({employee_id: employee_id , name:name, accrued_leave_days:accrued_leave_days, requested_leave_days:requested_leave_days},
        (err, res) => {
            console.log(name, ' se le ha concedido un permiso por ', res.granted_leave_days,
            ' dias. Ahora tiene ',res.accrued_leave_days, ' dias a favor'); 
            //console.log(res) ;      
            //console.log(res.granted) ;            
        });
    };