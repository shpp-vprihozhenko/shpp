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
    this.beepersSpritesInCells=[];
    this.init();
    this.karelSpriteMovingTime=1000;
        //this.drawMapAndKarel();
}
Karel2dPlayer.prototype.init = function () {
    //this.element.html(this.template());
    var obj=this;
    phLoaded=function(){
        console.log("phaser loaded");
        obj.phaserInit();
    };
    var s = document.createElement('script');
    s.type='text/javascript';
    s.onload=phLoaded;
    s.src='phaser.min.js';
    document.body.appendChild(s);
    var line=[];
    for(var i=0;i<this.map.data.map[0].length;i++)
        line.push(" ");
    for(var i=0;i<this.map.data.map.length;i++){
        var nline=line.slice();
        this.beepersSpritesInCells.push(nline);
    }
    this.ANIM_DELAY=700;
};
//Karel2dPlayer.prototype.template = function () {
//    return ""; //"<script src='phaser.min.js'></script>";
//            //"<textarea class='karel-commands-input'></textarea>";
//};
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
    var startX=myKarel.x, startY=myKarel.y, startDir=myKarel.dir, startBeepers=myKarel.beepers;
    var currentMap=this.map.data.map;
    //var incomingMap=JSON.parse(JSON.stringify(currentMap));
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
    myKarel.x=startX; myKarel.y=startY; myKarel.dir=startDir; myKarel.beepers=startBeepers;
    return arM;
};

//Karel2dPlayer.prototype.drawEmptyMap=function () {
//    this.graph.b_context.fillStyle="black";
//    this.graph.b_context.fillRect(0, 0, this.graph.numCols*this.graph.cellSizeX+
//        this.graph.windowBorderThick*2,
//        this.graph.numRows*this.graph.cellSizeY+this.graph.windowBorderThick*2);
//    this.graph.b_context.fillStyle="white";
//    this.graph.b_context.fillRect(this.graph.windowBorderThick, this.graph.windowBorderThick,
//        this.graph.numCols*this.graph.cellSizeX,
//        this.graph.numRows*this.graph.cellSizeY);
//
//    for(var i=0;i<this.graph.numRows;i++){
//        for(var j=0;j<this.graph.numCols;j++){
//            this.drawCell(j,i);
//        }
//    }
//};
//Karel2dPlayer.prototype.drawCell=function (x, y, beepers) {
//    if(this.map.data.map[y][x]=="x")
//        this.drawBlockedCell(x,y);
//    else {
//        this.drawClearCell(x,y);
//        if(beepers==undefined){
//            var bNum=parseInt(this.map.data.map[y][x]);
//            if( ! isNaN(bNum)) {
//                this.drawBeepersInCell(x,y,bNum);
//            }
//        } else {
//            if(beepers>0){
//                this.drawBeepersInCell(x,y,beepers);
//            }
//        }
//    }
//};
//Karel2dPlayer.prototype.drawBlockedCell=function (x,y) {
//    this.graph.b_context.fillStyle="black";
//    this.graph.b_context.fillRect(this.graph.startX+x*this.graph.cellSizeX,
//        this.graph.startY+y*this.graph.cellSizeY, this.graph.cellSizeX, this.graph.cellSizeY);
//};
//Karel2dPlayer.prototype.drawClearCell=function (x,y) {
//    this.graph.b_context.strokeRect(this.graph.startX+x*this.graph.cellSizeX,
//        this.graph.startY+y*this.graph.cellSizeY, this.graph.cellSizeX, this.graph.cellSizeY);
//    this.graph.b_context.fillStyle="white";
//    this.graph.b_context.fillRect(this.graph.startX+x*this.graph.cellSizeX,
//        this.graph.startY+y*this.graph.cellSizeY, this.graph.cellSizeX, this.graph.cellSizeY);
//};
//Karel2dPlayer.prototype.drawCircle=function (cx,cy,beeperRadius) {
//    this.graph.b_context.fillStyle="black";
//    this.graph.b_context.arc(cx, cy, beeperRadius+1, 0, 2*Math.PI);
//    this.graph.b_context.fill();
//    this.graph.b_context.beginPath();
//    this.graph.b_context.fillStyle="blue";
//    this.graph.b_context.arc(cx, cy, beeperRadius-1, 0, 2*Math.PI);
//    this.graph.b_context.fill();
//    this.graph.b_context.beginPath();
//};
//Karel2dPlayer.prototype.drawBeepersInCell=function (x, y, numBeepers) {
//    var beeperRadius=this.graph.cellSizeX/4;
//
//    var nb=numBeepers; if(nb>5) nb=5;
//    var K=this.graph.cellSizeX/beeperRadius;
//    var sX=this.graph.startX+x*this.graph.cellSizeX+beeperRadius*2 - (nb*(beeperRadius*2/K)/2),
//        sY=this.graph.startY+y*this.graph.cellSizeY+beeperRadius*2;
//    for(var i=0; i<nb;i++){
//        this.drawCircle(sX+i*beeperRadius*2/K,sY,beeperRadius);
//    }
//};
//Karel2dPlayer.prototype.drawKarel=function () {
//    var col=this.myKarel.x,row=this.myKarel.y,dir=this.myKarel.dir;
//    var x=this.graph.startX+col*this.graph.cellSizeX,
//        y=this.graph.startY+row*this.graph.cellSizeX;
//    if (dir==1) this.graph.b_context.drawImage(this.valli1Img,x,y,this.graph.cellSizeX,this.graph.cellSizeY);
//    else if (dir==2) this.graph.b_context.drawImage(this.valli2Img,x,y,this.graph.cellSizeX,this.graph.cellSizeY);
//    else if (dir==3) this.graph.b_context.drawImage(this.valli3Img,x,y,this.graph.cellSizeX,this.graph.cellSizeY);
//    else this.graph.b_context.drawImage(this.valli0Img,x,y,this.graph.cellSizeX,this.graph.cellSizeY);
//};

//Karel2dPlayer.prototype.drawMapAndKarel = function () {
//    this.graph.b_canvas=document.getElementById("canvID");
//    this.graph.b_context = this.graph.b_canvas.getContext("2d");
//
//    this.graph.numCols=this.map.data.map[0].length;
//    this.graph.numRows=this.map.data.map.length;
//    this.graph.cellSizeX=(this.graph.b_canvas.width-this.graph.windowBorderThick*3)/this.graph.numCols;
//    this.graph.cellSizeY=(this.graph.b_canvas.height-this.graph.windowBorderThick*3)/this.graph.numRows;
//
//    this.graph.startX=this.graph.windowBorderThick;
//    this.graph.startY=this.graph.windowBorderThick;
//
//    if(this.graph.cellSizeY>this.graph.cellSizeX)
//        this.graph.cellSizeY=this.graph.cellSizeX;
//    else
//        this.graph.cellSizeX=this.graph.cellSizeY;
//    this.drawEmptyMap();
//
//    var f=function(obj){
//        obj.drawKarel();
//    };
//    setTimeout(f,100,this);// todo
////    this.drawKarel();
//};

//Karel2dPlayer.prototype.allFinished=function(){
//    this.rotateKarel();
//    //clearInterval(this.showFunc);
//};
//
//function latedRefresh(obj){
//
//    var latedFunc=function(func){
//
//        function splitDistanceAndAddToArMovies(data, numberOfFrames) {
//            var frameTime=obj.ANIM_DELAY/numberOfFrames;
//
//            var dx=(data.newData.x-data.oldData.x)/numberOfFrames;
//            var dy=(data.newData.y-data.oldData.y)/numberOfFrames;
//
//            function dataCopy(data) {
//                var res=JSON.parse(JSON.stringify(data));
//                res.command=frameTime;
//                res.sourceOldData=data;
//                return res;
//            }
//            if(dy==0){
//                for(var x=data.newData.x; Math.abs(x-data.oldData.x)>Math.abs(dx); x-=dx){
//                    var newData=dataCopy(data);
//                    newData.newData.x=x;
//                    newData.oldData.x=x-dx;
//                    obj.arMovies.unshift(newData);
//                }
//            } else if(dx==0){
//                for(var y=data.newData.y; Math.abs(y-data.oldData.y)>Math.abs(dy); y-=dy){
//                    var newData=dataCopy(data);
//                    newData.newData.y=y;
//                    newData.oldData.y=y-dy;
//                    obj.arMovies.unshift(newData);
//                }
//            }
//        }
//
//        if(obj.arMovies.length==0){
//            obj.allFinished();
//            return;
//        }
//
//        var data=obj.arMovies.shift();
//
//        if(data.command=="move"){
//            splitDistanceAndAddToArMovies(data,obj.framesDelimitter);
//            data=obj.arMovies.shift();
//        } else if (data.command=="rotate"){
//            obj.myKarel.x=data.newData.x; obj.myKarel.y=data.newData.y;
//            obj.myKarel.dir=data.oldData.dir;
//            obj.rotateKarel(-90);
//            obj.myKarel.dir=data.newData.dir;
//            return;
//        }
//
//        var framesDelay=obj.ANIM_DELAY;
//        var framesMode=false;
//        if(!isNaN(parseInt(data.command))){
//            framesDelay=~~data.command; // splitted frames
//            framesMode=true;
//        }
//
//        if(framesMode){
//            obj.drawCell(~~data.sourceOldData.oldData.x,~~data.sourceOldData.oldData.y,data.sourceOldData.oldData.beepers);
//            obj.drawCell(~~data.sourceOldData.newData.x,~~data.sourceOldData.newData.y,data.newData.beepers);
//        }
//        else{
//            obj.drawCell(~~data.oldData.x,~~data.oldData.y,data.oldData.beepers);
//            obj.drawCell(~~data.newData.x,~~data.newData.y,data.newData.beepers);
//        }
//        obj.myKarel.x=data.newData.x; obj.myKarel.y=data.newData.y; obj.myKarel.dir=data.newData.dir;
//        obj.drawKarel();
//
//        setTimeout(func, framesDelay, func);
//    };
//
//    return latedFunc;
//}

//Karel2dPlayer.prototype.goKarel=function (){
//    func=latedRefresh(this);
//    //this.showFunc=setInterval(func, this.ANIM_DELAY);
//    this.showFunc=func;
//    setTimeout(this.showFunc, this.ANIM_DELAY, this.showFunc);
//};
//Karel2dPlayer.prototype.getImgName=function (dir) {
//    if (dir==0) return this.valli0Img;
//    if (dir==1) return this.valli1Img;
//    if (dir==2) return this.valli2Img;
//    if (dir==3) return this.valli3Img;
//};
//Karel2dPlayer.prototype.rotateKarel=function (angle) {
//    var col=this.myKarel.x, row=this.myKarel.y;
//    var x=this.graph.startX+col*this.graph.cellSizeX, y=this.graph.startY+row*this.graph.cellSizeX;
//
//    this.graph.b_context.save();
//    this.graph.b_context.translate(x+this.graph.cellSizeX/2, y+this.graph.cellSizeX/2);
//    this.graph.b_context.fillStyle="white";
//
//    var i= 0, di=2; if(angle<0) di=-di;
//    var obj=this;
//    var imgName=this.getImgName(obj.myKarel.dir);
//
//    var animRot=function (){
//        obj.graph.b_context.fillRect(-obj.graph.cellSizeX/2, -obj.graph.cellSizeX/2, obj.graph.cellSizeX, obj.graph.cellSizeY);
//        i+=di;
//        var k=i*Math.PI/180;
//        obj.graph.b_context.rotate(k);
//        obj.graph.b_context.drawImage(imgName,-(obj.graph.cellSizeX*0.9)/2,-(obj.graph.cellSizeX*0.9)/2,obj.graph.cellSizeX*0.9,obj.graph.cellSizeX*0.9);
//        obj.graph.b_context.rotate(k * -1);
//        if(Math.abs(i)>=Math.abs(angle))
//            obj.stopRotating();
//    };
//    this.rotationFunc=setInterval(animRot,this.ANIM_DELAY/10);
//};
//Karel2dPlayer.prototype.stopRotating=function() {
//    clearInterval(this.rotationFunc);
//    this.graph.b_context.restore();
//    setTimeout(this.showFunc, this.ANIM_DELAY, this.showFunc);
//};

Karel2dPlayer.prototype.phaserInit = function () {
    var obj=this;
    var preload=function() {
        obj.game.load.spritesheet('presets', 'assets/tilemaps/tiles/tmw_desert_spacing.png',obj.spriteCellSize,obj.spriteCellSize);
        obj.game.load.image('beeper', 'assets/sprites/aqua_ball.png');
        obj.game.load.image('karel', 'assets/sprites/robot/val1.png');
    };
    function addBeepersToCell(x,y, num){
        var arBeepersPerCell=[];
        function putBeeperWithCenterAt(x, y) {
            var beeperScaleFactor=obj.scaleFactor*0.75;
            if(num>1&&num<3)beeperScaleFactor=beeperScaleFactor*0.7;
            if(num>=3)beeperScaleFactor=beeperScaleFactor*0.5;
            var bSize=obj.spriteBeeperSize*beeperScaleFactor;
            var realX=x-bSize/2, realY=y-bSize/2;
            var spr=obj.game.add.sprite(realX, realY, 'beeper');
            spr.scale.setTo(beeperScaleFactor,beeperScaleFactor);
            arBeepersPerCell.push(spr);
        }
        var realX=x*obj.spriteCellSize*obj.scaleFactor,realY=y*obj.spriteCellSize*obj.scaleFactor;
        var cellSize=obj.spriteCellSize*obj.scaleFactor;
        var xCenter=realX+cellSize/2;
        var yCenter=realY+cellSize/2;

        function putBeepersLine(number, lineY) {
            if(number==2){
                putBeeperWithCenterAt(realX+cellSize/4, lineY);
                putBeeperWithCenterAt(realX+cellSize*3/4, lineY);
            } else {
                putBeeperWithCenterAt(realX+cellSize/4, lineY);
                putBeeperWithCenterAt(xCenter, lineY);
                putBeeperWithCenterAt(realX+cellSize*3/4, lineY);
            }
        }

        if(num==1) {
            putBeeperWithCenterAt(xCenter, yCenter);
        } else if(num==2){
            putBeepersLine(2,yCenter);
        } else  if(num==3){
            putBeeperWithCenterAt(realX+cellSize/4, realY+cellSize/4);
            putBeeperWithCenterAt(xCenter, yCenter);
            putBeeperWithCenterAt(realX+cellSize*3/4, realY+cellSize*3/4);
        } else  if(num==4){
            putBeepersLine(2,realY+cellSize/4);
            putBeepersLine(2,realY+cellSize*3/4);
        } else  if(num==5){
            putBeepersLine(2,realY+cellSize/4);
            putBeeperWithCenterAt(xCenter, yCenter);
            putBeepersLine(2,realY+cellSize*3/4);
        } else  if(num==6){
            putBeepersLine(3,realY+cellSize/4);
            putBeepersLine(3,realY+cellSize*3/4);
        } else  if(num==7){
            putBeepersLine(3,realY+cellSize/4);
            putBeeperWithCenterAt(xCenter, yCenter);
            putBeepersLine(3,realY+cellSize*3/4);
        } else  if(num==8){
            putBeepersLine(3,realY+cellSize/4);
            putBeepersLine(2,yCenter);
            putBeepersLine(3,realY+cellSize*3/4);
        } else {
            putBeepersLine(3,realY+cellSize/4);
            putBeepersLine(3,yCenter);
            putBeepersLine(3,realY+cellSize*3/4);
        }
        obj.beepersSpritesInCells[y][x]=arBeepersPerCell;
    }

    var create=function () {
        function createKarelSprite(x,y){
            var realX=x*obj.spriteCellSize*obj.scaleFactor+obj.karelOffset,
                realY=y*obj.spriteCellSize*obj.scaleFactor+obj.karelOffset;
            var spr=obj.game.add.sprite(realX, realY, 'karel');
            var sc=obj.spriteCellSize*obj.scaleFactor/spr.height;
            obj.karelScaleFactor=sc;
            spr.scale.setTo(sc,sc);
            spr.anchor.setTo(0.5, 0.5);
            spr.x=spr.x+spr.width/2;
            spr.y=spr.y+spr.height/2;
            return spr;
        }
        function addEmptyCell(x,y){
            var realX=x*obj.spriteCellSize*obj.scaleFactor,
                realY=y*obj.spriteCellSize*obj.scaleFactor;
            var spr=obj.game.add.sprite(realX, realY, 'presets');
            spr.frame = 33; // road
            spr.scale.setTo(obj.scaleFactor,obj.scaleFactor);
        }
        function addWallCell(x,y){
            var realX=x*obj.spriteCellSize*obj.scaleFactor,
                realY=y*obj.spriteCellSize*obj.scaleFactor;
            var spr=obj.game.add.sprite(realX, realY, 'presets');
            spr.frame = 9; // wall
            spr.scale.setTo(obj.scaleFactor,obj.scaleFactor);
        }

        var map=obj.map.data.map;
        for(var x=0; x<map[0].length; x++){
            for(var y=0; y<map.length; y++){
                if(map[y][x]=="x")
                    addWallCell(x,y);
                else {
                    addEmptyCell(x,y);
                    if(!isNaN(parseInt(map[y][x]))){
                        addBeepersToCell(x,y,parseInt(map[y][x]));
                    }
                }
            }
        }

        obj.karelSprite=createKarelSprite(0,1);
        var bounce=obj.game.add.tween(obj.karelSprite.scale);
        bounce.to( { x: (obj.karelScaleFactor*1.1), y: (obj.karelScaleFactor*1.1) }, obj.karelSpriteMovingTime/4, Phaser.Easing.Linear.None, true,0,-1,true);

    };

    function putBeeperSprite(x,y,num) {
        var arSpritesInCurrentCell=obj.beepersSpritesInCells[y][x];
        for(var i=0;i<arSpritesInCurrentCell.length;i++){
            arSpritesInCurrentCell[i].destroy(true);
        }
        obj.beepersSpritesInCells[y][x].splice(0,obj.beepersSpritesInCells[y][x].length);
        addBeepersToCell(x,y,num);
        obj.game.world.bringToTop(obj.karelSprite);
        obj.goKarel();
    }
    function pickUpBeeperSprite(x,y) {
        var bs=obj.beepersSpritesInCells[y][x].shift();
        var bounce=obj.game.add.tween(bs.scale);
        bounce.to( { x: 0, y: 0 }, obj.karelSpriteMovingTime, Phaser.Easing.Linear.None, false);
        bounce.onComplete.add(function(){
            bounce.stop();
            bs.destroy(true);
            console.log("pickupping stopped");
            obj.goKarel();
        });
        bounce.start();
    }
    function rotateKarelSprite() {
        var bounce=obj.game.add.tween(obj.karelSprite);
        bounce.to({angle: 90*obj.currentAngleRotation}, obj.karelSpriteMovingTime, Phaser.Easing.Linear.InOut,false);
        bounce.onComplete.add(function(){
            bounce.stop();
            console.log("rotating stopped");
            obj.goKarel();
        });
        bounce.start();
    }
    function moveKarelSprite() {
        var dx=0, dy=0;
        if(obj.myKarel.dir%2==0)
            dy=(1-obj.myKarel.dir)*obj.realCellSize;
        else
            dx=(2-obj.myKarel.dir)*obj.realCellSize;

        var bounce=obj.game.add.tween(obj.karelSprite);
        bounce.to( {x: obj.karelSprite.x+dx, y: obj.karelSprite.y+dy}, obj.karelSpriteMovingTime,
                    Phaser.Easing.Linear.InOut,obj.karelSpriteMovingTime*2);
        bounce.onComplete.add(function(){
            bounce.stop();
            console.log("moving stopped");
            obj.goKarel();
        }, this);
        bounce.start();
    }
    var update= function () {
        if(obj.currentCommand=="move"){
            obj.currentCommand="";
            moveKarelSprite()
        } else if(obj.currentCommand=="rotate"){
            obj.currentCommand="";
            rotateKarelSprite();
        } else if(obj.currentCommand=="pickup"){
            obj.currentCommand="";
            pickUpBeeperSprite(obj.myKarel.x,obj.myKarel.y);
        } else if(obj.currentCommand=="put"){
            obj.currentCommand="";
            var totalBeepersInCell=obj.currentBeepersInCell;
            putBeeperSprite(obj.myKarel.x,obj.myKarel.y,totalBeepersInCell);
        }
    };

    var divForPhaser=this.element.selector.substr(1);

    this.spriteCellSize=33;
    this.spriteBeeperSize=17;
    this.scaleFactor=2;
    this.realCellSize=this.scaleFactor*this.spriteCellSize;
    this.karelOffset=3;

    this.game = new Phaser.Game(800, 600, Phaser.CANVAS, divForPhaser, { preload: preload, create: create, update: update});

};

Karel2dPlayer.prototype.play = function (incomingCommands) {
    this.arMoves=this.fillArMovies(incomingCommands.commands);
    this.goKarel();
};

Karel2dPlayer.prototype.goKarel=function(){
        if(this.arMoves.length==0){
            this.allFinished();
            return;
        }

        var data=this.arMoves.shift();

        if(data.command=="move"){
            this.currentCommand="move";
            this.myKarel.x=data.newData.x; this.myKarel.y=data.newData.y;
        } else if (data.command=="rotate"){
            if(data.newData.dir>data.oldData.dir)
                this.currentAngleRotation=-1;
            else
                this.currentAngleRotation=1;
            this.currentCommand="rotate";
            this.myKarel.dir=data.newData.dir;
        } else if (data.command=="pickup"){
            this.currentCommand="pickup";
            this.myKarel.beepers++;
        } else if (data.command=="put"){
            this.currentCommand="put";
            this.myKarel.beepers--;
            this.currentBeepersInCell=data.newData.beepers;
        }

};

Karel2dPlayer.prototype.allFinished=function(){
    console.log("all finished");
    //this.rotateKarel();
    //clearInterval(this.showFunc);
};


