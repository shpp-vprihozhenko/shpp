/**
 * Created by Uzer on 27.02.2016.
 */
var http = require('http');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
//var Promise = require('bluebird');

function postDataTh(data) {

    return function (cb) {

        // Build the post string from an object
        var post_data = JSON.stringify(data);

        // An object of options to indicate where to post to
        var post_options = {
            host: '54.213.253.8',
            port: '5555',
            path: '/isolated-test',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };

        // Set up the request
        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ', chunk);
                cb();
            });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
    };


}

var data={
    "userName": "any name",
    "serverSecret": "key",
    "code": "class HelloWorld {public static void main(String[] args) {System.out.println(\"Hello World!\");}}",
    "language":"java",
    "testCases":["std1","std2"],
    "optionalConfig": {
        "taskLifetime": 5,
        "dockerMaxCores": 3,
        "dockerMaxMemory": 512
    }
};

var main = async(function() {
    for(var i=0; i<3; i++){
        await(postDataTh(data));
        console.log("data sent i="+i);
    }
    console.log("finished");
});

main().then(function(){
    console.log("finished all!");
});

console.log("all data sent");
