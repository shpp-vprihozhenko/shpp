/**
 * Created by Uzer on 04.02.2016.
 */

var Port = 6615;

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

    function restoreDataFromDB(res) {
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
                res.json(data);
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

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/data', function(req, res) {
    console.log("restore data request");
    restoreDataFromDB(res)
});
app.put('/data', function(req, res) {
    console.log("Incoming data to save",req.body);
    saveDataToDB(req.body);
});
app.post('/data', function(req, res) {
    console.log("Incoming data to save",req.body);
    saveDataToDB(req.body);
});

app.use(express.static(__dirname + '/public'));

app.listen(Port);//process.env.PORT
