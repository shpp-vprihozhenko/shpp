var HOST = '127.0.0.1';
var PORT = 33333;

// first param - host addr, seconf - port

if (process.argv[2]!=undefined) HOST=process.argv[2];
if (process.argv[3]!=undefined) PORT=process.argv[3];


var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var fs = require('fs');

function getCurrentDateTime() {
    var date = new Date();
    var hour = date.getHours();
    var min  = date.getMinutes();
    var sec  = date.getSeconds();
    return hour + ":" + min + ":" + sec;
}

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
	logMsg="At "+getCurrentDateTime()+" from "+remote.address + ':' + remote.port +' received msg: \"' + message+'\"';

	console.log(logMsg);

	var bufferedMessage = new Buffer(message);
	server.send(bufferedMessage, 0, bufferedMessage.length, remote.port, remote.address);

	fs.appendFile('logs.txt', logMsg+'\n', function (err) {if (err) throw err;});

});

server.bind(PORT, HOST);