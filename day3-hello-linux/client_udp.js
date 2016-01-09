var PORT = 33333;
var HOST = '144.76.198.99';

var dgram = require('dgram');
var message = new Buffer('Testing message. 0123456789');

var client = dgram.createSocket('udp4');

client.on('message', function (backMessage, remote) {
	console.log("Received answer from "+remote.address + ':' + remote.port +' - \"' + backMessage+'\"');
	client.close();
	if(backMessage=message) console.log("Source msg delivered correctly.");
	else console.log("Wrong answer from server, msg delivered incorrectly!");
});

client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message \"'+message+'\" sent to ' + HOST +':'+ PORT);
});

