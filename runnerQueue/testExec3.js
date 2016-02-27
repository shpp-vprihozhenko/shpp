module.exports=ExecDockerSimulator;

function ExecDockerSimulator(){}

ExecDockerSimulator.prototype.run=function(task,cb){

    this.task=task;
    this.cb=cb;

    var self=this;

    if(task.sessionId=="111"){
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        var util = require('util');

        process.stdin.on('data', function (text) {
            console.log('received data:', util.inspect(text));
            if (text === 'quit\n') {
                done();
            }
        });
    }

    function done() {
        console.log('Now that process.stdin is paused, there is nothing more to do.');
        //process.exit();
        self.cb(self.task.sessionId,self.task);
    }
};

//var exd=new ExecDockerSimulator();
//exd.run();
//
