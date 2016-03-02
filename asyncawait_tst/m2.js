/**
 * Created by Uzer on 02.03.2016.
 */
var Promise = require('bluebird');
var request = require('request');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

request=Promise.promisify(request);

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

var opt={
    method: 'POST',
    uri: 'http://54.213.253.8:5555/isolated-test',
    json: data
};

/*
request(opt, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Google homepage.
    }
});
*/

var main=async(function(o,d){
    var result=await(request(o,d));
    console.log("res1", result);

    var result2=await(request(o,d));
    console.log("res2", result2);
    return [result,result2];
});

main(opt,data)
    .then(function (res) {
    console.log(res);
}).catch(function(err){
        console.log("Error", err);
    });
