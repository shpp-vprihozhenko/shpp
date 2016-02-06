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
    var name="Somebody"
    try{
        var data=JSON.parse(req.query.data);
        console.log(data);
        name=data.name;
    } catch (e){ console.log("err",e); }
    res.status(200).json('Hello, '+name);
});

app.use('/files', express.static(__dirname));

app.listen(3000);