/**
 * Created by Uzer on 23.01.2016.
 */
var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwe123",
    database: "chat"
});

con.connect(function(err){
    if(err){
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
    con.query('SELECT * FROM employees',function(err,rows){
        if(err) console.log(err);

        var employee = { name: 'Winnie', location: 'Australia' };
        //con.query('INSERT INTO employees SET ?', employee, function(err,res){
        //    if(err) throw err;
        //
        //    console.log('Last insert ID:', res.insertId);
        //    console.log(rows);
        //});

        //con.query(
        //    'UPDATE employees SET location = ? Where ID = ?',
        //    ["South Africa", 5],
        //    function (err, result) {
        //        if (err) throw err;
        //
        //        console.log('Changed ' + result.changedRows + ' rows');
        //    }
        //);

        console.log('Data received from Db');
        console.log(rows);
        console.log(rows[0].name);
        console.log('Data received from Db end.');
    });
});

//con.end(function(err) {
//    // The connection is terminated gracefully
//    // Ensures all previously enqueued queries are still
//    // before sending a COM_QUIT packet to the MySQL server.
//});