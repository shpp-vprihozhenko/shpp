var sourceMsg="hello world! 0123456789";
var http=require('http');
var options={
    hostname:"127.0.0.1",
    path: '/',
    port:8080,
    method:'POST'
};

callback = function(response) {
    var str = ''
    response.on('data', function (chunk) {
        str += chunk;
    });
    response.on('end', function () {
        console.log("recieved from server: "+str);
        if(str==sourceMsg)
            console.log("Message delivered ok.");
        else
            console.log("Some troubles with delivering");
    });
}

var req = http.request(options, callback);

req.on('error',function(e){
    console.log('error: '+ e.message);
});

req.write(sourceMsg);
console.log("sent to server "+sourceMsg);
req.end();

