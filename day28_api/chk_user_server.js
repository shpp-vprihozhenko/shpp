var arrStreams=[];

var port = 6615;
var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var log=require('./log.js')(module);

function sendError(res, errNum, msg) {
    log.error(msg);
    res.status(errNum);
    res.json({ data: msg });
}
function sendMsg(res, code, msg) {
    log.info(msg);
    res.status(code);
    res.json({ data: msg });
}

function findPosOfStream(streamID) {
    for(var i=0;i<arrStreams.length;i++)
        if(arrStreams[i].id==streamID)
            return i;
    return -1;
}

app.put('/chkuser', function(req, res) {
    function regNewStream(streamID,res) {
        if(findPosOfStream(streamID)>-1){
            sendError(res,500,"request rejected. This ID already used."+streamID)
            return;
        }
        var newStream={};
        newStream.id=streamID;
        newStream.allowedUsers=[];
        arrStreams.push(newStream);
        sendMsg(res,200,"stream is added")
    }

    console.log("PUT request. data:",req.body);
    var streamID=req.body.streamID;
    if(!streamID){
        sendError(res,500,"No stream ID in request.");
    } else {
        regNewStream(streamID,res);
    }
});

app.delete('/chkuser', function(req, res) {
    function killStream(streamID,res) {
        var pos=findPosOfStream(streamID);
        if(pos<0){
            sendError(res,500,"request rejected. No such stream id registred."+streamID)
            return;
        }
        arrStreams[pos].allowedUsers.splice(0,arrStreams[pos].allowedUsers.length);
        arrStreams.splice(pos,1);
        sendMsg(res,200,"stream is removed")
    }

    console.log("DELETE request. Stream ID:",req.body);
    var streamID=req.body.streamID;
    if(!streamID){
        sendError(res,500,"No stream ID in request.");
    } else {
        killStream(streamID,res);
    }
});

app.post('/chkuser', function(req, res) {
    function regNewWhiteUser(streamID, newWhiteUserID, res) {
        var streamPos=findPosOfStream(streamID);
        if(streamPos<0){
            sendError(res,500,"no such stream registred");
        } else {
            arrStreams[streamPos].allowedUsers.push(newWhiteUserID);
            sendMsg(res,200,"user permission added")
        }
    }

    console.log("POST request. data:",req.body);
    var streamID=req.body.streamID;
    if(!streamID){
        sendError(res,500,"No stream ID in request.");
    } else {
        var newWhiteUserID=req.body.userID;
        if(!newWhiteUserID)
            sendError(res,500,"No user ID in request.");
        else
            regNewWhiteUser(streamID,newWhiteUserID,res);
    }
});

app.get('/chkuser', function(req, res) {
    function sendUserPermission(streamID, userID, res) {
        function findInAllowed(userID, allowedUsers) {
            return (allowedUsers.indexOf(userID)>-1);
        }

        var streamPos=findPosOfStream(streamID);

        if(streamPos<0){
            sendError(res,500,"no such stream registred");
        } else {
            if (findInAllowed(userID,arrStreams[streamPos].allowedUsers))
                sendMsg(res,200,"access allowed");
            else
                sendMsg(res,400,"access restricted");
        }
    }

    function findStreamIDinURL(url) {
        var startPos=url.indexOf("streamID");
        if(startPos==-1)
            return undefined;
        startPos+=9;
        var sID=url.substr(startPos,1);
        for(var i=startPos+1;i<url.length;i++){
            if(url.substr(i,1)=="&")
                break;
            sID+=url.substr(i,1);
        }
        return sID;
    }

    function findUserIDinURL(url) {
        var startPos=url.indexOf("userID");
        if(startPos==-1)
            return undefined;
        startPos+=7;
        var uID=url.substr(startPos,1);
        for(var i=startPos+1;i<url.length;i++){
            if(url.substr(i,1)=="&")
                break;
            uID+=url.substr(i,1);
        }
        return uID;
    }

    console.log("GET request. data:",req.body);

    var streamID=findStreamIDinURL(req.url);
    if(!streamID){
        sendError(res,500,"No stream ID in request.");
    } else {
        var userID=findUserIDinURL(req.url);
        if(!userID)
            sendError(res,500,"No user ID in request.");
        else
            sendUserPermission(streamID,userID,res);
    }
});

app.listen(port);//process.env.PORT
