/**
 * Created by Uzer on 10.01.2016.
 */
var fs = require('fs');

console.log("Usage: " + __filename + " path/to/directory " + __dirname);

var path = __dirname;
var arFiles=[];

arFiles=fs.readdirSync(path);

//    , function(err, items) {
//    for (var i=0; i<items.length; i++) {
//        console.log(items[i]);
//        arFiles.push(items[i]);
//    }
//});

console.log(arFiles);

var folderForCopies=path+"/destFolder";
if(!fs.existsSync(folderForCopies))
    fs.mkdirSync(folderForCopies);

for(var i=0;i<arFiles.length;i++){
    console.log(arFiles[i]+" has size "+fs.statSync(arFiles[i]).size);
    if(fs.statSync(arFiles[i]).size>0){
        //var source = fs.createReadStream(arFiles[i]);
        //var target = fs.createWriteStream(folderForCopies+"/"+arFiles[i]);
        //source.pipe(target);
        var targetFile=folderForCopies+"/"+arFiles[i];
        fs.writeFileSync(targetFile, fs.readFileSync(arFiles[i]));
        console.log("copied "+folderForCopies+"/"+arFiles[i]);
    }
}

arFiles=fs.readdirSync(folderForCopies);
console.log(arFiles);

for(var i=0;i<arFiles.length-1;i++){
    fname=folderForCopies+"/"+arFiles[i];
    console.log(arFiles[i]+" has size "+fs.statSync(fname).size);
    fs.unlinkSync(fname);
    console.log(fname+" deleted. ");
}
