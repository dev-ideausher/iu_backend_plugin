// Creating and connecting with server
const net = require('net');
const server = net.createServer(); //Creating server

//utils
const {getTypes, setTypes} = require("../utils/iotHelper")

let sockets = {}

//Connecting with server
server.on('connection', function (socket) {
    let remoteAddress = `${socket.remoteAddress},${socket.remotePort}`
    console.log("Scooter remote address and port:- ",remoteAddress)
    let remotePort = `${socket.remotePort}`
    sockets[remotePort] = socket
    console.log(`connection is established... ${Date.now()} \n `);
    // socket.write(`connection is established...${Date.now()} \n`);
    //Receiving and Sending payload from/to client
    socket.on('data', async function (payload) {
        console.log(`----- payload data on remote port ${remotePort} ------`)
        payload = getTypes(payload, 'string');
        console.log("string data:-",payload)
        let commandData = payload.split(",")
        commandData[commandData.length - 1] = commandData[commandData.length - 1].split("#")[0]
        payload = setTypes(payload, 'string');
        // socket.write(`acknowledge : ${payload}`);
        let scooterData = {}
        scooterData.command = commandData[3]
        scooterData.vendorCode = commandData[1]
        scooterData.lockId = commandData[2]
        switch (commandData[3]) {
            case "Q0": 
                scooterData.voltage = commandData[4]
                scooterData.power = commandData[5]
                scooterData.signal = commandData[6]
                console.log(scooterData)
                break;
            case "R0":
                scooterData.operation = commandData[4]
                scooterData.operationKey = commandData[5]
                scooterData.userId = commandData[6]
                scooterData.timestamp = commandData[7]
                console.log(scooterData)
                break;
            case "H0":
                scooterData.lockState = commandData[4]
                scooterData.voltage = commandData[5]
                scooterData.signal = commandData[6]
                scooterData.power = commandData[7]
                scooterData.chargingStatus = commandData[8]
                console.log(scooterData)
                break;
            case "L0":
                scooterData.lockStatus = commandData[4]
                scooterData.userId = commandData[5]
                scooterData.timestamp = commandData[6]
                console.log(scooterData)
                break;
            case "L1":
                scooterData.lockStatus = commandData[4]
                scooterData.userId = commandData[5]
                scooterData.timestamp = commandData[6]
                scooterData.cyclingTime = commandData[7]
                console.log(scooterData)
                break;

            case "D0":
                scooterData.positioning = commandData[4]
                scooterData.utcTime = commandData[5]
                scooterData.positioningStatus = commandData[6]
                scooterData.degreeLatitude = commandData[7]
                scooterData.hemisphereLatitude = commandData[8]
                scooterData.hemisphereLongitude = commandData[9]
                scooterData.hemisphereLongitude = commandData[10]
                scooterData.noOfSatellites = commandData[11]
                scooterData.hdop = commandData[12]
                scooterData.utcDate = commandData[13]
                scooterData.altitude = commandData[14]
                scooterData.height = commandData[15] // in meter
                scooterData.modeIndication = commandData[16] // in meter

                console.log(scooterData)
                break;

        }
    });

    //Close connection
    socket.on('close', function () {
        console.log('Server Connection Closed');
        delete sockets.remotePort;
    });
    //Server error
    socket.on('error', function (err) {
        console.log("Caught flash policy server socket error: ")
        console.log(err.stack)
    });
});


const lockAndUnlock = (remotePort,command) => {
    if(!sockets[remotePort]){
        return false
    }
    sockets[remotePort].write(command);
    return true;
}


const bikePosition = (remotePort,command) => {
    if(!sockets[remotePort]){
        return false
    }
    console.log("Hello")
    sockets[remotePort].write(command);
    console.log("cool")
    let scooterData = {}
    if(remotePort){
        sockets[remotePort].on('data',function(payload){
            console.log("hey")
            console.log(`----- payload data on remote port ${remotePort} ------`)
            payload = getTypes(payload, 'string');
            console.log("string data:-",payload)
            let commandData = payload.split(",")
            commandData[commandData.length - 1] = commandData[commandData.length - 1].split("#")[0]
            scooterData.command = commandData[3]
            scooterData.vendorCode = commandData[1]
            scooterData.lockId = commandData[2]
    
            switch (commandData[3]) {
                case "D0": 
                    scooterData.positioning = commandData[4]
                    scooterData.utcTime = commandData[5]
                    scooterData.positioningStatus = commandData[6]
                    scooterData.degreeLatitude = commandData[7]
                    scooterData.hemisphereLatitude = commandData[8]
                    scooterData.hemisphereLongitude = commandData[9]
                    scooterData.hemisphereLongitude = commandData[10]
                    scooterData.noOfSatellites = commandData[11]
                    scooterData.hdop = commandData[12]
                    scooterData.utcDate = commandData[13]
                    scooterData.altitude = commandData[14]
                    scooterData.height = commandData[15] // in meter
                    scooterData.modeIndication = commandData[16] // in meter
    
                    console.log(scooterData)
                    break;
            }
        })
    }
    

    return scooterData;
}


module.exports = {
    server,
    lockAndUnlock,
    bikePosition
};
