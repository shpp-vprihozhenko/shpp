var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendfile('index.html');
});

app.post('/data', function(req, res) {
    var text=req.param('text', '');
    console.log(text);
});

app.use(express.static(__dirname + '/public'));

srv=app.listen(6615);//process.env.PORT
//console.log(srv);//.ondisconnect()
