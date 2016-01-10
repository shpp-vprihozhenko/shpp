/**
 * Created by Uzer on 09.01.2016.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users={};
var msgRequestWhoIsOnline="ho is online?";
var rulePersonalMsg="to:";

app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    var usersCounter=0;
    for(var user in io.sockets.connected){
        usersCounter++;
    }
    console.log("Total users: "+usersCounter);
    io.emit('chat message', "New user "+socket.client.id+" connected us! Total users of this chat: "+usersCounter);

    socket.on('disconnect', function(){
        console.log('user disconnected');
        usersCounter--;
        io.emit('chat message', "1 user left us "+this.client.id);
    });

    socket.on('chat message', function(msg){
        var cli=this.client.id;

        function parseUName(msg) {
            return msg.substr(0,msg.indexOf(":"));
        }

        if(users[cli]==undefined){
            if(parseUName(msg)!="")
                users[cli]=parseUName(msg);
        }
        console.log('Incoming message from : ' +cli+'  '+ msg);

        function personalMsg(msg) {
            if(users[cli]==undefined) return false;
            var subMsg=msg.substr(users[cli].length+2);
            if(subMsg.substr(0,3).toLowerCase()==rulePersonalMsg) return true;
            else return false;
        }

        function cutToUserNickName(msg) {
            var subMsg=msg.substr(users[cli].length+5);
            return subMsg.substr(0,subMsg.indexOf(" "));
        }

        function findSocketIdByUNN(UNN) {
            res="";
            for(var userIndex in users){
                if(users[userIndex]==UNN) return "/#"+userIndex;
            }
        }

        if(personalMsg(msg)){
            var UNN=cutToUserNickName(msg);
            var socketid=findSocketIdByUNN(UNN);
            if(socketid!=""){
                //io.sockets.connected[socketid].emit('chat message', 'for your eyes only');
                io.to(socketid).emit('chat message', 'For your eyes only! '+msg);
            }
        }
        else
            io.emit('chat message', msg);

        if(msg.indexOf(msgRequestWhoIsOnline)>0){
            for(var userIndex in users)
                io.emit('chat message', "User "+users[userIndex]+" online.");
        }
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});