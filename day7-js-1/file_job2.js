var fs = require('fs');

var sourcePath = __dirname;
var folderForCopies=sourcePath+"/destFolder";
if(!fs.existsSync(folderForCopies))
    fs.mkdirSync(folderForCopies);

var copyFile=function(sourF,destF){
    var source = fs.createReadStream(sourF);
    var target = fs.createWriteStream(destF);
    source.pipe(target);
}

fs.readdir(sourcePath, function(err,files){
    if (err) return done(err);
    files.forEach(function(file){
        fs.stat(sourcePath+"/"+file, function(err, state){
            if(state.isDirectory()){
                console.log("directory "+file+" will be skipped.")
            } else {
                console.log("file "+file+" will be copied.")
                copyFile(sourcePath+"/"+file, folderForCopies+"/"+file);
            }
        })
        console.log(file);
    })
});
