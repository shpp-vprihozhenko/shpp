var express = require('express');
var app = express();
//var bodyParser = require('body-parser')
//
//app.use(bodyParser.urlencoded({
//    extended: true
//}));
//app.use(bodyParser.json());

app.get('/test1', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    var data=JSON.parse(req.query.data);
    console.log(data);
    res.status(200).json('Hello, '+data.name);
});

app.listen(3000);