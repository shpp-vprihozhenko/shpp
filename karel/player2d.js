var KarelObj=function(){
    this.x=0; this.y=0; this.dir=0; this.beepers=1000;
    this.move=function(){
        if(this.dir%2==0)
            this.y+=(this.dir-1);
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
    this.init();
    this.ANIM_DELAY=500;
    this.myKarel=new KarelObj();
}
Karel2dPlayer.prototype.init = function () {
    this.element.html(this.template());
};
Karel2dPlayer.prototype.template = function () {
    return "" +
        "<cavnas class='karel-2d-player' width='600' height='600'></canvas>" +
        "<textarea class='karel-commands-input'></textarea>";
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
            if(commands[i].data=-1)
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
            currentMap[oldY][oldX]=""+curBeepersNum+1;
        }

        var newX=myKarel.x, newY=myKarel.y, newDir=myKarel.dir, newBeepers=parseInt(currentMap[myKarel.y][myKarel.x]);

        arM.push(
            {oldData:{x:oldX, y:oldY, dir:oldDir, beepers: oldBeepers},
                newData:{x:newX, y:newY, dir:newDir, beepers: newBeepers},
                command: cmd}
        );
    }
    return arM;
};

function drawEmptyMap() {
    b_context.fillStyle="black";
    b_context.fillRect(0, 0, numCols*cellSizeX+10, numRows*cellSizeY+10);
    b_context.fillStyle="white";
    b_context.fillRect(5, 5, numCols*cellSizeX, numRows*cellSizeY);

    for(var i=0;i<numRows;i++){
        for(var j=0;j<numCols;j++){
            drawCell(j,i);
        }
    }
}
function drawCell(j, i, beepers) {
    if(!map.isAvailable(j,i))
        drawBlockedCell(j,i);
    else {
        drawClearCell(j,i);
        if(beepers==undefined){
            if(map.checkBeeper(j,i)>0){
                drawBeepersInCell(j,i,map.checkBeeper(j,i));
            }
        } else {
            if(beepers>0){
                drawBeepersInCell(j,i,beepers);
            }
        }
    }
}
function drawBlockedCell(x,y) {
    b_context.fillStyle="black";
    b_context.fillRect(startX+x*cellSizeX, startY+y*cellSizeY, cellSizeX, cellSizeY);
}
function drawClearCell(x,y) {
    b_context.strokeRect(startX+x*cellSizeX, startY+y*cellSizeY, cellSizeX, cellSizeY);
    b_context.fillStyle="white";
    b_context.fillRect(startX+x*cellSizeX, startY+y*cellSizeY, cellSizeX, cellSizeY);
}
function drawBeepersInCell(x, y, numBeepers) {
    var beeperRadius=cellSizeX/4;
    function drawCircle(cx,cy) {
        b_context.fillStyle="black";
        b_context.arc(cx, cy, beeperRadius+1, 0, 2*Math.PI);
        b_context.fill();
        b_context.beginPath();
        b_context.fillStyle="blue";
        b_context.arc(cx, cy, beeperRadius-1, 0, 2*Math.PI);
        b_context.fill();
        b_context.beginPath();
    }

    var nb=numBeepers; if(nb>5) nb=5;
    var K=cellSizeX/beeperRadius;
    var sX=startX+x*cellSizeX+beeperRadius*2 - (nb*(beeperRadius*2/K)/2), sY=startY+y*cellSizeY+beeperRadius*2;
    for(var i=0; i<nb;i++){
        drawCircle(sX+i*beeperRadius*2/K,sY);
    }
}

Karel2dPlayer.prototype.drawMap = function () {

    this.takeKarelFromMap(this.myKarel);

    b_canvas=document.getElementsByClassName("karel-2d-player");
    b_context = b_canvas.getContext("2d");

    numCols=map.getWidth();
    numRows=map.getHeight();
    cellSizeX=(b_canvas.width-15)/numCols;
    cellSizeY=(b_canvas.height-15)/numRows;

    startX=5;
    startY=5;

    if(cellSizeY>cellSizeX)
        cellSizeY=cellSizeX;
    else
        cellSizeX=cellSizeY;
    drawEmptyMap();
};
Karel2dPlayer.prototype.play = function (incomingCommands) {
    this.arMovies=this.fillArMovies(incomingCommands.commands);

};
