/**
 * Created by Uzer on 09.01.2016.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        console.log('Incoming message: ' + msg);
        socket.broadcast.emit('hi. '+msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});