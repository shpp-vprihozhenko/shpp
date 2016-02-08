var PORT = "6616";
var HOST = '127.0.0.1';

var testMsg="Testing message. 0123456789";

var net=require("net");
var clientSocket=new net.Socket();

clientSocket.on("data",function (data){
  console.log("Received "+data);
	if(data=testMsg) console.log("Source msg delivered correctly.");
	else console.log("Wrong answer from server, msg delivered incorrectly!");
});

clientSocket.on("close",function (){
  console.log("Connection closed");
});

clientSocket.connect(PORT,HOST,function(){
	console.log("Connected to server.")
});

clientSocket.setEncoding("utf8");

clientSocket.write(testMsg);


