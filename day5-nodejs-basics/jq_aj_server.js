/**
 * Created by Uzer on 09.01.2016.
 */
var express = require('express');
var callbacks = [];
var activeUsers=[];
var activeUsersID=[];
var totalUsers=0;

function sendMessageToListeners(message){
    var resp = {messages: [message]};
    if(totalUsers>callbacks.length) {
        totalUsers=callbacks.length;

    }
    while (callbacks.length > 0) {
        var fn=callbacks.shift();
        fn(resp);
    }
}

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendfile('jq_aj_index.html');
});

app.post('/send', function(req, res) {
    var message = {
        nickname: req.param('nickname', 'Anonymous'),
        text: req.param('text', '')
    };

    if(activeUsers.indexOf(message.nickname)==-1)
        activeUsers.push(message.nickname);

    sendMessageToListeners(message);

    res.json({status: 'ok'});
});

app.get('/newUser', function(req, res){
    totalUsers++;
    var message={};
    message.totalUsers=totalUsers;
    res.json(message);
    sendMessageToListeners(message);
});

app.get('/recv', function(req, res){
    var userID=req.query.userID;
    var userNickName=req.query.userNickName;
    callbacks.push(function(message){
        res.json(message);
    });
});

srv=app.listen(6611);//process.env.PORT
console.log(srv);//.ondisconnect()
