var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World 3002\n');
}).listen(3002);

console.log('Server running on port 3002.');