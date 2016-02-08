var PORT=6616;

if (process.env.TCP_SERVER_PORT!=undefined) {
	PORT=process.env.TCP_SERVER_PORT;
	console.log("From env. var readed port Nr " + PORT);
}

var net=require("net");

var server=net.createServer(function(socket){
	var msg="Incoming connetion established with "+socket.remoteAddress+":"+socket.remotePort;
	console.log(msg);

	socket.on("data",function(data){
	    logMsg=" from "+this.remoteAddress + ':' + this.remotePort +' recieved msg: \"' +data+'\"';
	    console.log("msg "+logMsg);
	    socket.write(data);
	    socket.end();
	});

	socket.on("close",function() {
	    console.log("connection closed");
	});

}).listen(PORT);

