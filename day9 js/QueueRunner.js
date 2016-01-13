fs = require('fs');

function someAsyncFunction(data, onfinish){
    console.log("Async func working.");
    fs.writeFile("./tmp/"+data.fileName, data.text, function(err) {
        if(err) {
            console.log(err);
            onfinish("all is bad...");
            return;
        }
        console.log("File "+data.fileName+" was saved to tmp with text "+data.text);
        onfinish("ok");
    });
}

function checkRunnerQueue(obj){
    if(obj.paused) return;
    if(obj.arData.length>0){
        if(obj.currentProcessFinished){
            obj.currentProcessFinished=false;
            obj.initFunc(obj.arData.shift(),obj.arFinishFunc.shift());
        }
    }
}

function QueueRunner(initFunc){
    this.initFunc=initFunc;
    this.arData=[];
    this.arFinishFunc=[];
    this.currentProcessFinished=true;
    this.paused=false;
    this.refreshIntervalId=setInterval(function(obj){checkRunnerQueue(obj)}, 1000, this);
    return this;
}

function formFinFunc(obj,data) {
    var obj2=obj;
    var f=function(status){
        data.onFinish(status);
        obj2.currentProcessFinished=true;
    };
    return f;
}

QueueRunner.prototype.push=function(data){
    this.arData.push(data.data);
    var fn=formFinFunc(this,data);
    this.arFinishFunc.push(fn);
};
QueueRunner.prototype.pause=function(){
    this.paused=true;
};
QueueRunner.prototype.resume=function(){
    this.paused=false;
};
QueueRunner.prototype.cleanup=function(){
    this.arData.splice(0,this.arData.length);
    this.arFinishFunc.splice(0,this.arFinishFunc.length);
    clearInterval(this.refreshIntervalId);
};


qr = new QueueRunner(function exec(data, onfinish){
    someAsyncFunction(data, onfinish); //<== onfinish will be called here
});

qr.push({
    data: {fileName:"tst2.txt", text:"Some text 2"},
    onFinish: function(status) {
        console.log("running finished with status "+status);
    }
});

qr.push({
    data: {fileName:"tst3.txt", text:"Some text 3"},
    onFinish: function(status) {
        console.log("running finished with status "+status);
    }
});

qr.pause();
qr.push({
    data: {fileName:"tst4.txt", text:"Some text 4"},
    onFinish: function(status) {
        console.log("running finished with status "+status);
    }
});

qr.push({
    data: {fileName:"tst5.txt", text:"Some text"},
    onFinish: function(status) {
        console.log("running finished with status "+status);
    }
});

qr.resume();

// do not process pending items, run their onFinish callbacks with "CANCELLED" error
//qr.cleanup();
