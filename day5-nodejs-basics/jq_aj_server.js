/**
 * Created by Uzer on 09.01.2016.
 */
var express = require('express');
var callbacks = [];
var arLastGotID=[];
var activeUsers=[];
var totalUsers=0;
var onlineRequest="who is online?";
var personalMsgRequest="to:";

function findLostUsers(){
    var res=[];
    for(var i=0;i<activeUsers.length;i++){
        if(arLastGotID.indexOf(activeUsers[i].id)==-1){
            if((activeUsers[i].userNickName!=undefined)&&(activeUsers[i].userNickName!=""))
                res.push(activeUsers[i].userNickName);
        }
    }
    return res;
}

function delLostUsersFromActive() {
    for(var i=0;i<activeUsers.length;i++){
        if(arLastGotID.indexOf(activeUsers[i].id)==-1){
            activeUsers.splice(i,1);
            i--;
        }
    }
    totalUsers=activeUsers.length;
}

function findActiveUserID(toNick) {
    for(var i=0;i<activeUsers.length;i++){
        if(activeUsers[i].userNickName==toNick){
            return activeUsers[i].id;
        }
    }
    return "";
}

function sendPersonalMsg(message) {
    message.text=message.text.substr(3).trim();
    var toNick=message.text.substr(0,message.text.indexOf(" ")).trim();
    var usrID=findActiveUserID(toNick);
    if(usrID=="") return;
    message.text="(personal msg) "+message.text;

    var resp = {messages: [message]};

    for (var i=0;i<callbacks.length;i++) {
        if(arLastGotID[i]==usrID){
            var fn=callbacks[i];
            fn(resp);
            callbacks.splice(i,1);
            arLastGotID.splice(i,1);
            break;
        }
    }
}

function sendMessageToListeners(message){
    var resp = {messages: [message]};

    if(callbacks.length<activeUsers.length){
        var lostUsers=findLostUsers();
        if(lostUsers.length>0){
            var msg={};
            msg.nickname=".server.";
            msg.text="Disconnected from chat: "+lostUsers;
            resp.messages.push(msg);
        }
        delLostUsersFromActive();
    }

    for (var i=0;i<callbacks.length;i++) {
        var fn=callbacks[i];
        fn(resp);
    }

    callbacks.splice(0,callbacks.length);
    arLastGotID.splice(0,arLastGotID.length);
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

    function formAnswer(message) {
        var s="";
        for(var i=0;i<activeUsers.length;i++){
            s+= activeUsers[i].userNickName;
            if(i<activeUsers.length-1) s+=", ";
        }
        message.nickname=".server."; message.text="Now online: "+s;
    }

    var message = {
        nickname: req.param('nickname', 'Anonymous'),
        text: req.param('text', ''),
        userID: req.param('userID', '')
    };

    if(message.text.toLowerCase().indexOf(onlineRequest)>-1){
        formAnswer(message)
    }
    if(message.text.toLowerCase().substr(0,3)==personalMsgRequest){
        sendPersonalMsg(message);
    } else {
        sendMessageToListeners(message);
    }

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

    function findUserIndexByID(activeUsers, userID) {
        var res=-1;
        for(var i=0; i<activeUsers.length; i++){
            if(activeUsers[i].id==userID) return i;
        }
        return res;
    }

    var usrIdx=findUserIndexByID(activeUsers,userID);
    if(usrIdx==-1){
        var user={};
        user.id=userID;
        user.userNickName="";
        activeUsers.push(user);
    } else {
        activeUsers[usrIdx].userNickName=userNickName;
    }

    arLastGotID.push(userID);
    callbacks.push(function(message){
        res.json(message);
    });
});

srv=app.listen(6612);//process.env.PORT
console.log(srv);//.ondisconnect()
