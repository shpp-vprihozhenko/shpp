# Server for user permission checking
RESTful API Using Node.js &amp; Express 4

##Requirements
* Node and npm

##Installation
* Clone the repo : git clone  
https://github.com/shpp-vprihozhenko/shpp/tree/master/day29-restful-api2
* Install dependencies : npm install  
* Start the server : node chk_user_server.js

##Required parameters
Server port: 6615
Path: /chkuser
logfile: somefile.log

##Exchange protocol
on new stream begin:
method: PUT
{
  "streamID": "15",
}

on stream stop:
method: DELETE
{
  "streamID": "15",
}

on allow user request:
method: POST
{
  "streamID": "15",
  "userID": "u1272"
}

check user:
method: GET
requested parameters - streamID & userUD transmitted through the url line like this
/chkuser?streamID=15&userID=u123456


possible server answers:
200 - ok,
{ data: "access allowed" }

400 - no permission
{ data: "access restricted" }

500 - server error
{ data: "...error description..." } 