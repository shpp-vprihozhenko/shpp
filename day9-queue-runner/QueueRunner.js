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

function QueueRunner(initFunc){
    this.initFunc=initFunc;
    this.arData=[];
    this.arFinishFunc=[];
    this.currentProcessFinished=true;
    this.paused=false;
    return this;
}

function formFinFunc(obj,data) {
    //var obj2=obj;
    var f=function(status){
        console.log("Task is finished!");
        obj.currentProcessFinished=true;
        obj.launchNextTaskIfPossible();
        data.onFinish(status);
    };
    return f;
}

QueueRunner.prototype.launchNextTaskIfPossible=function(){
    if(this.paused) {console.log("runner paused");return;}
    if(this.arData.length>0){
        if(this.currentProcessFinished){
            console.log("runner will launch next task");
            this.currentProcessFinished=false;
            this.initFunc(this.arData.shift(),this.arFinishFunc.shift());
        } else {
            console.log("runner is busy");
        }
    } else {
        console.log("No tasks to run.");
    }
};
QueueRunner.prototype.push=function(data){
    this.arData.push(data.data);
    var fn=formFinFunc(this,data);
    this.arFinishFunc.push(fn);
    console.log("New task pushed to queue.");
    this.launchNextTaskIfPossible();
};
QueueRunner.prototype.pause=function(){
    this.paused=true;
};
QueueRunner.prototype.resume=function(){
    this.paused=false;
    this.launchNextTaskIfPossible();
};
QueueRunner.prototype.cleanup=function(){
    this.arData.splice(0,this.arData.length);
    this.arFinishFunc.splice(0,this.arFinishFunc.length);
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
