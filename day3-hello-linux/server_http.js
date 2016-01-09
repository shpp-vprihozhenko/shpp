var port = 8080; // default

// trying take port number from env. variable TCP_SERVER_PORT

if (process.env.TCP_SERVER_PORT!=undefined) {
	PORT=process.env.HTTP_SERVER_PORT;
	console.log("From env. var readed port Nr " + PORT);
}

var host = '127.0.0.1'; // default

// trying take host-address from first parameter

if (process.argv[2]!=undefined) host=process.argv[2]; 

var getCurrentDateTime = require("./getCurTime.js")
var printAndSaveLog = require("./printAndSaveLog.js")
var http = require('http');

var server = http.createServer( function(req, res) {
  printAndSaveLog("Incoming request to server at "+getCurrentDateTime());

  var msg = '';

  req.on('data', function (data) {
    msg += data;
  });

  req.on('end', function () {
    printAndSaveLog("Received message: " + msg + " at " + getCurrentDateTime());
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(''+msg);
    printAndSaveLog("Answer message sent: " + msg + " at " + getCurrentDateTime());
    printAndSaveLog("Request done at " + getCurrentDateTime());
  });
});

server.listen(port, host);
printAndSaveLog("Server start at " + getCurrentDateTime());
