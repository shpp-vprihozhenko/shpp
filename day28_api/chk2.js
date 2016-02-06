/**
 * Created by Uzer on 06.02.2016.
 */
var arrStreams = {};

var port = 6615;
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var log = require('./log.js')(module);

function sendError(res, errNum, msg) {
    log.error(msg);
    res.status(errNum);
    res.json({data: msg});
}
function sendMsg(res, code, msg) {
    log.info(msg);
    res.status(code);
    res.json({data: msg});
}

app.put('/chkuser', function (req, res) {
    function regNewStream(streamID, res) {
        if (arrStreams[streamID] != undefined) {
            sendError(res, 500, "request rejected. This ID already used." + streamID);
            return;
        }
        arrStreams[streamID] = [];
        sendMsg(res, 200, "stream is added")
    }

    console.log("PUT request. data:", req.body);
    var streamID = req.body.streamID;
    if (!streamID) {
        sendError(res, 500, "No stream ID in request.");
    } else {
        regNewStream(streamID, res);
    }
});

app.delete('/chkuser', function (req, res) {
    function killStream(streamID, res) {
        if (arrStreams[streamID] == undefined) {
            sendError(res, 500, "request rejected. No such stream id registred." + streamID)
            return;
        }
        arrStreams[streamID].splice(0, arrStreams[streamID]);
        delete arrStreams[streamID];
        sendMsg(res, 200, "stream is removed")
    }

    console.log("DELETE request. Stream ID:", req.body);
    var streamID = req.body.streamID;
    if (!streamID) {
        sendError(res, 500, "No stream ID in request.");
    } else {
        killStream(streamID, res);
    }
});

app.post('/chkuser', function (req, res) {
    function regNewWhiteUser(streamID, newWhiteUserID, res) {
        if (arrStreams[streamID] == undefined) {
            sendError(res, 500, "no such stream registred");
        } else {
            arrStreams[streamID].push(newWhiteUserID);
            sendMsg(res, 200, "user permission added")
        }
    }

    console.log("POST request. data:", req.body);
    var streamID = req.body.streamID;
    if (!streamID) {
        sendError(res, 500, "No stream ID in request.");
    } else {
        var newWhiteUserID = req.body.userID;
        if (!newWhiteUserID)
            sendError(res, 500, "No user ID in request.");
        else
            regNewWhiteUser(streamID, newWhiteUserID, res);
    }
});

app.get('/chkuser', function (req, res) {
    function sendUserPermission(streamID, userID, res) {
        function findInAllowed(userID, allowedUsers) {
            return (allowedUsers.indexOf(userID) > -1);
        }

        if (arrStreams[streamID] == undefined) {
            sendError(res, 500, "no such stream registred");
        } else {
            if (findInAllowed(userID, arrStreams[streamID]))
                sendMsg(res, 200, "access allowed");
            else
                sendMsg(res, 400, "access restricted");
        }
    }

    console.log("GET request. data:", req.body);

    var streamID = req.query.streamID;
    if (!streamID) {
        sendError(res, 500, "No stream ID in request.");
    } else {
        var userID = req.query.userID;
        if (!userID)
            sendError(res, 500, "No user ID in request.");
        else
            sendUserPermission(streamID, userID, res);
    }
});

app.listen(port);//process.env.PORT
