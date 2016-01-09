var express = require('express');
var callbacks = [];

function appendMessage(message){
    var resp = {messages: [message]};
    while (callbacks.length > 0) {
        callbacks.shift()(resp);
    }
}

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendfile('ind_srv2.html');
});

app.post('/send', function(req, res){
    var message = {
        nickname: req.param('nickname', 'Anonymous'),
        text: req.param('text', '')
    };
    appendMessage(message);
    res.json({status: 'ok'});
});

app.get('/recv', function(req, res){
    callbacks.push(function(message){
        res.json(message);
    });
});

app.listen(6611);