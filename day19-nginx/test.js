var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World 3003\n');
}).listen(3003);

console.log('Server running on port 3003.');