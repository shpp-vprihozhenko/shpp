var http = require('http');

function postData(data) {
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
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

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

postData(data);
postData(data);
postData(data);
