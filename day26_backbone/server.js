/**
 * Created by Uzer on 03.02.2016.
 */
var fs = require('fs');
var httpServer = require('http');
var path = require('path');
var querystring=require('querystring');

var httpPort = 6615;

var mysql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwe123",
    database: "chat"
});

con.connect(function(err){
    if(err){
        console.log('Error connecting to Db. History will not saved.');
        return;
    }
    console.log('Connection established');
});

var sendHTML = function( filePath, contentType, response ){

    console.log('sendHTML: ' + filePath) ;

    fs.exists(filePath, function( exists ) {

        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
};

var getFilePath = function(url) {
    console.log("url: " + url);
    var filePath = './' + url;
    if (url == '/' ) filePath = './index.html';

    console.log("filePath: " + filePath);

    return filePath;
};

var getContentType = function(filePath) {
    var extname = path.extname(filePath);
    var contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    return contentType;
};

var onHtmlRequestHandler = function(request, res) {
    console.log('onHtmlRequestHandler... request.url: ' + request.url) ;

    if ( request.url === '/data') {
        console.log("/data.");

        var req=request;
        var fullBody = '';

        req.on('data', function(chunk) {
            console.log("Received part of body data:");
            fullBody += chunk.toString();
        });

        req.on('end', function() {
            if(fullBody.length>0){
                var decodedBody = querystring.parse(fullBody);
                var data=JSON.parse(Object.keys(decodedBody)[0]);
                console.log('data:',data);
            } else {
                data={};
            }

            res.writeHead(200, "OK", {'Content-Type': 'text/html'});

            if(this.method=="PUT"){ // save to db block
                saveDataToDB(data);
                res.write(JSON.stringify(data));
                res.end();
            } else { // read from db request
                restoreDataFromDB(data,res);
                //data[0]._do="220";
            }
        });

        return;
    }

    function restoreDataFromDB(data,res) {
        con.query('SELECT * FROM todo_list',function(err,rows){
            if(err) console.log(err);
            else{
                var data=[];
                for(var i=0; i<rows.length;i++){
                    var record={};
                    record._do=rows[i]._do;
                    record.stateLetter=rows[i].state;
                    data.push(record);
                }
                res.write(JSON.stringify(data));
                res.end();
            }
        });
    }

    function saveDataToDB(data) {
        con.query('TRUNCATE TABLE todo_list', function(err,res){
            if(err) console.log(err);
            console.log('db truncated');
        });
        for(var i=0; i<data.length;i++){
            var objData = { _do: data[i]._do, state: data[i].stateLetter};
            con.query('INSERT INTO todo_list SET ?', objData, function(err,res){
                if(err) console.log(err);
                console.log('Data added to db');
            });
        }
    }

    var filePath = getFilePath(request.url);
    var contentType = getContentType(filePath);

    console.log('onHtmlRequestHandler... getting: ' + filePath) ;

    sendHTML(filePath, contentType, res);
};

httpServer.createServer(onHtmlRequestHandler).listen(httpPort);