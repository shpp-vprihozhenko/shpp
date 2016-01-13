var express = require('express');
var app = express();
var siteIsBusy=false;
var startBusyTime=0;
var MAX_BUSY_TIME=10; //sec

var WebSocketServer=new require('ws');

function checkUsingTime(){
    if(siteIsBusy){
        var currTime=new Date().getTime();
        if((currTime-startBusyTime)/1000 > MAX_BUSY_TIME){
            siteIsBusy=false;
            console.log("Time is out! Breaking current user.");
        }
    }
}

app.get('/', function(req, res){
    if(siteIsBusy){
        res.sendfile('waitingclock.html');
        console.log("Incoming user! But site is busy...")
    } else {
        res.sendfile('workingPage.html');
        console.log("Incoming user! Start working...")
        siteIsBusy=true;
        startBusyTime=new Date().getTime();
    }
});

app.get('/newUser', function(req, res){
    totalUsers++;
    var message={};
    message.totalUsers=totalUsers;
    res.json(message);
    sendMessageToListeners(message);
});

var srv=app.listen(6613);
var wss=new WebSocketServer.Server({port:6614});

var clientsWS=[];
wss.on('connection',function(ws){
    clientsWS.push(ws);
    console.log("New connection detected.");
    ws.onmessage= function(msg){
        //console.log("incoming msg: ",msg);
        var data=JSON.parse(msg.data);
        console.log("data received");
        console.log(data);
        ws.send("data received.");
        if(data.age>16)
            ws.send("User enough old to view throw camera...");
    }
});

setInterval(function(){
    checkUsingTime();
},1000);