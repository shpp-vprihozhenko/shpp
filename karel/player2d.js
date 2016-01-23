var KarelObj=function(){
    this.x=0; this.y=0; this.dir=0; this.beepers=1000;
    this.move=function(){
        if(this.dir%2==0)
            this.y-=(this.dir-1);
        else
            this.x-=(this.dir-2);
    };
    this.turnLeft=function(){
        this.dir++; if(this.dir==4) this.dir=0;
    };
};

function Karel2dPlayer(elem, map) {
    this.element = elem;
    this.map = map;
    this.myKarel=new KarelObj();
    this.takeKarelFromMap(this.myKarel);
    this.graph={};
    this.init();
    //this.drawMapAndKarel();
}
Karel2dPlayer.prototype.init = function () {
    this.element.html(this.template());

    this.valli0Img=document.getElementById("valli0");
    this.valli1Img=document.getElementById("valli1");
    this.valli2Img=document.getElementById("valli2");
    this.valli3Img=document.getElementById("valli3");
    this.graph.windowBorderThick=5;
    this.ANIM_DELAY=700;
    this.framesDelimitter=10;
};
Karel2dPlayer.prototype.template = function () {
    return "" +"<canvas class='karel-2d-player' width='600' height='600' id='canvID'>"
        +
        "<img src='img/val0.png' id='valli0' style='display:none'>"+
        "<img src='img/val1.png' id='valli1' style='display:none'>"+
        "<img src='img/val2.png' id='valli2' style='display:none'>"+
        "<img src='img/val3.png' id='valli3' style='display:none'>"
    ;
        //"<textarea class='karel-commands-input'></textarea>";
};
Karel2dPlayer.prototype.takeKarelFromMap=function(myKarel) {
    for(var y=0; y<this.map.data.map.length;y++)
        for(var x=0; x<this.map.data.map[0].length;x++){
            if("<>^v".indexOf(this.map.data.map[y][x])>-1){
                myKarel.x=x;
                myKarel.y=y;
                if(this.map.data.map[y][x]=="v") myKarel.dir=0;
                else if(this.map.data.map[y][x]==">") myKarel.dir=1;
                else if(this.map.data.map[y][x]=="^") myKarel.dir=2;
                else if(this.map.data.map[y][x]=="<") myKarel.dir=3;
                this.map.data.map[y][x]=" ";
                return;
            }
        }
};
Karel2dPlayer.prototype.fillArMovies=function(commands) {
    var myKarel=this.myKarel;
    var currentMap=this.map.data.map;
    var arM=[];

    for(var i=0; i<commands.length;i++){

        var oldX=myKarel.x, oldY=myKarel.y, oldDir=myKarel.dir, oldBeepers=parseInt(currentMap[myKarel.y][myKarel.x]);

        var cmd=commands[i].command;
        if(cmd=="move") myKarel.move();
        else if(cmd=="rotate"){
            if(commands[i].data.angle=-1)
                myKarel.turnLeft();
            else {
                myKarel.turnLeft();myKarel.turnLeft();myKarel.turnLeft();
            }
        }
        else if(cmd=="pickup"){
            var newBeepersNum=parseInt(currentMap[oldY][oldX])-1;
            if(newBeepersNum==0)
                currentMap[oldY][oldX]=" ";
            else
                currentMap[oldY][oldX]=""+newBeepersNum;
        }
        else if(cmd=="put"){
            if(currentMap[oldY][oldX]==" ")
                var curBeepersNum=0;
            else
                var curBeepersNum=parseInt(currentMap[oldY][oldX]);
            currentMap[oldY][oldX]=""+(curBeepersNum+1);
        }

        var newX=myKarel.x, newY=myKarel.y, newDir=myKarel.dir,
            newBeepers=parseInt(currentMap[myKarel.y][myKarel.x]);

        arM.push(
            {oldData:{x:oldX, y:oldY, dir:oldDir, beepers: oldBeepers},
                newData:{x:newX, y:newY, dir:newDir, beepers: newBeepers},
                command: cmd}
        );
    }
    return arM;
};

Karel2dPlayer.prototype.drawEmptyMap=function () {
    this.graph.b_context.fillStyle="black";
    this.graph.b_context.fillRect(0, 0, this.graph.numCols*this.graph.cellSizeX+
        this.graph.windowBorderThick*2,
        this.graph.numRows*this.graph.cellSizeY+this.graph.windowBorderThick*2);
    this.graph.b_context.fillStyle="white";
    this.graph.b_context.fillRect(this.graph.windowBorderThick, this.graph.windowBorderThick,
        this.graph.numCols*this.graph.cellSizeX,
        this.graph.numRows*this.graph.cellSizeY);

    for(var i=0;i<this.graph.numRows;i++){
        for(var j=0;j<this.graph.numCols;j++){
            this.drawCell(j,i);
        }
    }
};
Karel2dPlayer.prototype.drawCell=function (x, y, beepers) {
    if(this.map.data.map[y][x]=="x")
        this.drawBlockedCell(x,y);
    else {
        this.drawClearCell(x,y);
        if(beepers==undefined){
            var bNum=parseInt(this.map.data.map[y][x]);
            if( ! isNaN(bNum)) {
                this.drawBeepersInCell(x,y,bNum);
            }
        } else {
            if(beepers>0){
                this.drawBeepersInCell(x,y,beepers);
            }
        }
    }
};
Karel2dPlayer.prototype.drawBlockedCell=function (x,y) {
    this.graph.b_context.fillStyle="black";
    this.graph.b_context.fillRect(this.graph.startX+x*this.graph.cellSizeX,
        this.graph.startY+y*this.graph.cellSizeY, this.graph.cellSizeX, this.graph.cellSizeY);
};
Karel2dPlayer.prototype.drawClearCell=function (x,y) {
    this.graph.b_context.strokeRect(this.graph.startX+x*this.graph.cellSizeX,
        this.graph.startY+y*this.graph.cellSizeY, this.graph.cellSizeX, this.graph.cellSizeY);
    this.graph.b_context.fillStyle="white";
    this.graph.b_context.fillRect(this.graph.startX+x*this.graph.cellSizeX,
        this.graph.startY+y*this.graph.cellSizeY, this.graph.cellSizeX, this.graph.cellSizeY);
};
Karel2dPlayer.prototype.drawCircle=function (cx,cy,beeperRadius) {
    this.graph.b_context.fillStyle="black";
    this.graph.b_context.arc(cx, cy, beeperRadius+1, 0, 2*Math.PI);
    this.graph.b_context.fill();
    this.graph.b_context.beginPath();
    this.graph.b_context.fillStyle="blue";
    this.graph.b_context.arc(cx, cy, beeperRadius-1, 0, 2*Math.PI);
    this.graph.b_context.fill();
    this.graph.b_context.beginPath();
};
Karel2dPlayer.prototype.drawBeepersInCell=function (x, y, numBeepers) {
    var beeperRadius=this.graph.cellSizeX/4;

    var nb=numBeepers; if(nb>5) nb=5;
    var K=this.graph.cellSizeX/beeperRadius;
    var sX=this.graph.startX+x*this.graph.cellSizeX+beeperRadius*2 - (nb*(beeperRadius*2/K)/2),
        sY=this.graph.startY+y*this.graph.cellSizeY+beeperRadius*2;
    for(var i=0; i<nb;i++){
        this.drawCircle(sX+i*beeperRadius*2/K,sY,beeperRadius);
    }
};
Karel2dPlayer.prototype.drawKarel=function () {
    var col=this.myKarel.x,row=this.myKarel.y,dir=this.myKarel.dir;
    var x=this.graph.startX+col*this.graph.cellSizeX,
        y=this.graph.startY+row*this.graph.cellSizeX;
    if (dir==1) this.graph.b_context.drawImage(this.valli1Img,x,y,this.graph.cellSizeX,this.graph.cellSizeY);
    else if (dir==2) this.graph.b_context.drawImage(this.valli2Img,x,y,this.graph.cellSizeX,this.graph.cellSizeY);
    else if (dir==3) this.graph.b_context.drawImage(this.valli3Img,x,y,this.graph.cellSizeX,this.graph.cellSizeY);
    else this.graph.b_context.drawImage(this.valli0Img,x,y,this.graph.cellSizeX,this.graph.cellSizeY);
};

Karel2dPlayer.prototype.drawMapAndKarel = function () {
    this.graph.b_canvas=document.getElementById("canvID");
    this.graph.b_context = this.graph.b_canvas.getContext("2d");

    this.graph.numCols=this.map.data.map[0].length;
    this.graph.numRows=this.map.data.map.length;
    this.graph.cellSizeX=(this.graph.b_canvas.width-this.graph.windowBorderThick*3)/this.graph.numCols;
    this.graph.cellSizeY=(this.graph.b_canvas.height-this.graph.windowBorderThick*3)/this.graph.numRows;

    this.graph.startX=this.graph.windowBorderThick;
    this.graph.startY=this.graph.windowBorderThick;

    if(this.graph.cellSizeY>this.graph.cellSizeX)
        this.graph.cellSizeY=this.graph.cellSizeX;
    else
        this.graph.cellSizeX=this.graph.cellSizeY;
    this.drawEmptyMap();

    var f=function(obj){
        obj.drawKarel();
    };
    setTimeout(f,100,this);// todo
//    this.drawKarel();
};

Karel2dPlayer.prototype.play = function (incomingCommands) {
    this.arMovies=this.fillArMovies(incomingCommands.commands);
    this.goKarel();
};
Karel2dPlayer.prototype.allFinished=function(){
    this.rotateKarel();
    //clearInterval(this.showFunc);
};

function latedRefresh(obj){

    var latedFunc=function(func){

        function splitDistanceAndAddToArMovies(data, numberOfFrames) {
            var frameTime=obj.ANIM_DELAY/numberOfFrames;

            var dx=(data.newData.x-data.oldData.x)/numberOfFrames;
            var dy=(data.newData.y-data.oldData.y)/numberOfFrames;

            function dataCopy(data) {
                var res=JSON.parse(JSON.stringify(data));
                res.command=frameTime;
                res.sourceOldData=data;
                return res;
            }
            if(dy==0){
                for(var x=data.newData.x; Math.abs(x-data.oldData.x)>Math.abs(dx); x-=dx){
                    var newData=dataCopy(data);
                    newData.newData.x=x;
                    newData.oldData.x=x-dx;
                    obj.arMovies.unshift(newData);
                }
            } else if(dx==0){
                for(var y=data.newData.y; Math.abs(y-data.oldData.y)>Math.abs(dy); y-=dy){
                    var newData=dataCopy(data);
                    newData.newData.y=y;
                    newData.oldData.y=y-dy;
                    obj.arMovies.unshift(newData);
                }
            }
        }

        if(obj.arMovies.length==0){
            obj.allFinished();
            return;
        }

        var data=obj.arMovies.shift();

        if(data.command=="move"){
            splitDistanceAndAddToArMovies(data,obj.framesDelimitter);
            data=obj.arMovies.shift();
        } else if (data.command=="rotate"){
            obj.myKarel.x=data.newData.x; obj.myKarel.y=data.newData.y;
            obj.myKarel.dir=data.oldData.dir;
            obj.rotateKarel(-90);
            obj.myKarel.dir=data.newData.dir;
            return;
        }

        var framesDelay=obj.ANIM_DELAY;
        var framesMode=false;
        if(!isNaN(parseInt(data.command))){
            framesDelay=~~data.command; // splitted frames
            framesMode=true;
        }

        if(framesMode){
            obj.drawCell(~~data.sourceOldData.oldData.x,~~data.sourceOldData.oldData.y,data.sourceOldData.oldData.beepers);
            obj.drawCell(~~data.sourceOldData.newData.x,~~data.sourceOldData.newData.y,data.newData.beepers);
        }
        else{
            obj.drawCell(~~data.oldData.x,~~data.oldData.y,data.oldData.beepers);
            obj.drawCell(~~data.newData.x,~~data.newData.y,data.newData.beepers);
        }
        obj.myKarel.x=data.newData.x; obj.myKarel.y=data.newData.y; obj.myKarel.dir=data.newData.dir;
        obj.drawKarel();

        setTimeout(func, framesDelay, func);
    };

    return latedFunc;
}

Karel2dPlayer.prototype.goKarel=function (){
    func=latedRefresh(this);
    //this.showFunc=setInterval(func, this.ANIM_DELAY);
    this.showFunc=func;
    setTimeout(this.showFunc, this.ANIM_DELAY, this.showFunc);
};
Karel2dPlayer.prototype.getImgName=function (dir) {
    if (dir==0) return this.valli0Img;
    if (dir==1) return this.valli1Img;
    if (dir==2) return this.valli2Img;
    if (dir==3) return this.valli3Img;
};
Karel2dPlayer.prototype.rotateKarel=function (angle) {
    var col=this.myKarel.x, row=this.myKarel.y;
    var x=this.graph.startX+col*this.graph.cellSizeX, y=this.graph.startY+row*this.graph.cellSizeX;

    this.graph.b_context.save();
    this.graph.b_context.translate(x+this.graph.cellSizeX/2, y+this.graph.cellSizeX/2);
    this.graph.b_context.fillStyle="white";

    var i= 0, di=2; if(angle<0) di=-di;
    var obj=this;
    var imgName=this.getImgName(obj.myKarel.dir);

    var animRot=function (){
        obj.graph.b_context.fillRect(-obj.graph.cellSizeX/2, -obj.graph.cellSizeX/2, obj.graph.cellSizeX, obj.graph.cellSizeY);
        i+=di;
        var k=i*Math.PI/180;
        obj.graph.b_context.rotate(k);
        obj.graph.b_context.drawImage(imgName,-(obj.graph.cellSizeX*0.9)/2,-(obj.graph.cellSizeX*0.9)/2,obj.graph.cellSizeX*0.9,obj.graph.cellSizeX*0.9);
        obj.graph.b_context.rotate(k * -1);
        if(Math.abs(i)>=Math.abs(angle))
            obj.stopRotating();
    };
    this.rotationFunc=setInterval(animRot,this.ANIM_DELAY/10);
};
Karel2dPlayer.prototype.stopRotating=function() {
    clearInterval(this.rotationFunc);
    this.graph.b_context.restore();
    setTimeout(this.showFunc, this.ANIM_DELAY, this.showFunc);
};