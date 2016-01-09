var LOG_FILE_NAME="log.txt";
var fs = require('fs');

module.exports=function printAndSaveLog(msg){
	console.log(msg);
	fs.appendFile(LOG_FILE_NAME, msg+'\n', function (err) {if (err) throw err;});
}
