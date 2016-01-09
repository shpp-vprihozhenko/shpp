var PORT=8080;

// trying take port number from env. variable TCP_SERVER_PORT

if (process.env.TCP_SERVER_PORT!=undefined) {
	PORT=process.env.TCP_SERVER_PORT;
	console.log("From env. var readed port Nr " + PORT);
}

var net=require("net");
var getCurrentDateTime=require("./getCurTime.js")
var printAndSaveLog=require("./printAndSaveLog.js")

var server=net.createServer(function(socket){
	var msg="Incoming connetion established with "+socket.remoteAddress+":"+socket.remotePort+" at "+getCurrentDateTime();
	printAndSaveLog(msg);

	socket.on("data",function(data){
		logMsg="At "+getCurrentDateTime()+" from "+this.remoteAddress + ':' + 					this.remotePort +' recieved msg: \"' +data+'\"';

		printAndSaveLog(logMsg);

		socket.write(data);
		socket.end();
	});

	socket.on("close",function() {
		var msg="Connetion terminated at "+getCurrentDateTime();
		printAndSaveLog(msg);
	});

}).listen(PORT);

printAndSaveLog("TCP server started. Listening port "+PORT);
