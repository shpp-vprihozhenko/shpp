/**
 * Created by Uzer on 17.01.2016.
 */
var commands = 'putBeeper();pickBeeper;move();move();putBeeper;turnLeft();pickBeeper();move();move();turnLeft();logOut()';
var resultActions = [];



function Field(map) {
    this.map = map;
}

function Karel(x, y, direction, beepers) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.beeperInBag = beepers || 1000;
}

Field.prototype.isAvailable = function (x, y) {
    if (y >= 0 && y < this.map.length && x >=0 && x < this.map[y].length){
        return (this.map[y][x] !== 'x');
    }
    return false;
};

Field.prototype.checkBeeper = function (x, y) {
    if (this.map[y][x] == ' ')
        return 0;
    else
        return this.map[y][x];
};

Field.prototype.getKarelPosition = function () {
    for (var i = 0; i < this.map.length; i++) {
        for (var j = 0; j < this.map[i].length; j++) {
            if (this.map[i][j] === 'v') {
                return {x: j, y: i, direction: 0};
            } else if (this.map[i][j] === '>') {
                return {x: j, y: i, direction: 1};
            } else if (this.map[i][j] === '^') {
                return {x: j, y: i, direction: 2};
            } else if (this.map[i][j] === '<') {
                return {x: j, y: i, direction: 3};
            }
        }
    }
};

//compatibility with beepers
//======================================================================================================================
Karel.prototype.beepersPresent = function () {
    return map.checkBeeper(this.x, this.y) !== 0;
};

Karel.prototype.noBeepersPresent = function () {
    return !this.beepersPresent();
};

Karel.prototype.putBeeper = function () {
    var commandsList = {};
    if (this.beeperInBag){
        map.map[this.x][this.y] = map.checkBeeper(this.x, this.y) + 1;
        this.beeperInBag--;
        commandsList.command = 'put';
    }
    else{
        this.crash('There are no beepers in the bag');
    }
    resultActions.push(commandsList);
};

Karel.prototype.pickBeeper = function () {
    var commandsList = {};
    if (map.checkBeeper(this.x, this.y)){
        map[this.x][this.y] = map.checkBeeper(this.x, this.y) - 1;
        this.beeperInBag++;
        commandsList.command = 'put';
    }
    else {
        this.crash('There are no beepers here');
    }
    resultActions.push(commandsList);
};

//check direction
//======================================================================================================================
Karel.prototype.facingNorth = function () {
    return this.direction == '2';
};

Karel.prototype.noFacingNorth = function () {
    return !this.facingNorth();
};

Karel.prototype.facingSouth = function () {
    return this.direction == '0';
};

Karel.prototype.noFacingSouth = function () {
    return !this.facingSouth();
};

Karel.prototype.facingWest = function () {
    return this.direction == '3';
};

Karel.prototype.noFacingWest = function () {
    return !this.facingWest();
};

Karel.prototype.facingEast = function () {
    return this.direction == '1';
};

Karel.prototype.noFacingEast = function () {
    return !this.facingEast();
};


//check front
//======================================================================================================================

Karel.prototype.frontIsClear = function () {
    if (this.direction == '0') {
        return (map.isAvailable(this.x, this.y + 1));
    } else if (this.direction == '1') {
        return (map.isAvailable(this.x + 1, this.y));
    } else if (this.direction == '2') {
        return (map.isAvailable(this.x, this.y - 1));
    } else if (this.direction == '3') {
        return (map.isAvailable(this.x - 1, this.y));
    }
    return false;
};

Karel.prototype.frontIsBlocked = function () {
    return !this.frontIsClear();
};

Karel.prototype.leftIsClear = function () {
    if (this.direction == '0') {
        return (map.isAvailable(this.x + 1, this.y));
    } else if (this.direction == '1') {
        return (map.isAvailable(this.x, this.y - 1));
    } else if (this.direction == '2') {
        return (map.isAvailable(this.x - 1, this.y));
    } else if (this.direction == '3') {
        return (map.isAvailable(this.x, this.y + 1));
    }
    return false;
};

Karel.prototype.leftIsBlocked = function () {
    return !this.leftIsClear();
};

Karel.prototype.rightIsClear = function () {
    if (this.direction == '0') {
        return (map.isAvailable(this.x - 1, this.y));
    } else if (this.direction == '1') {
        return (map.isAvailable(this.x, this.y + 1));
    } else if (this.direction == '2') {
        return (map.isAvailable(this.x + 1, this.y));
    } else if (this.direction == '3') {
        return (map.isAvailable(this.x, this.y - 1));
    }
    return false;
};

Karel.prototype.rightIsBlocked = function () {
    return !this.rightIsClear();
};


// move()
//======================================================================================================================
Karel.prototype.move = function () {
    var dX = 0, dY = 0, err = false, commandsList = {};
    if (this.direction == '0') {
        if (map.isAvailable(this.x, this.y + 1)) {
            dY = 1;
        } else {
            err = true;
        }
    } else if (this.direction == '1') {
        if (map.isAvailable(this.x + 1, this.y)) {
            dX = 1;
        } else {
            err = true;
        }
    } else if (this.direction == '2') {
        if (map.isAvailable(this.x, this.y - 1)) {
            dY = -1;
        } else {
            err = true;
        }
    } else if (this.direction == '3') {
        if (map.isAvailable(this.x - 1, this.y)) {
            dX = -1;
        } else {
            err = true;
        }
    }
    if (err) {
        this.crash('Karel cannot move forward');
    }
    else {
        this.x += dX;
        this.y += dY;
        commandsList.command = 'move';
    }
    resultActions.push(commandsList);
};

//turnLeft()
//======================================================================================================================
Karel.prototype.turnLeft = function () {
    var commandsList = {};
    this.direction = (this.direction + 1) % 4;
    commandsList.command = 'turnLeft';
    resultActions.push(commandsList);
};

//crash
//======================================================================================================================
Karel.prototype.crash = function (err_msg){
    var commandsList = {};
    commandsList.command = 'error';
    commandsList.data = {};
    commandsList.data.message = err_msg;
    resultActions.push(commandsList);
    throw commandsList;
};

/*function crush (commandsList, err_msg) {
 commandsList.command = 'error';
 commandsList.data = {};
 commandsList.data.message = 'err_msg';
 throw commandsList;
 }*/

//======================================================================================================================
//                    x0  x1   x2  x3   x4
var map = new Field([[' ', 1, ' ', ' ', 'x'],
    [1, ' ', ' ', ' ', 'x'],
    [' ', '>', 2, ' ', 'x'],
    [' ', ' ', ' ', 2, 'x']]);

var KarelPosition = map.getKarelPosition();
var myKarel = new Karel(KarelPosition.x, KarelPosition.y, KarelPosition.direction);
function move(){
    myKarel.move();
    console.log("karel move")
}
function turnLeft(){
    myKarel.turnLeft();
    console.log("karel turn left")
}
function pickBeeper() {
    myKarel.pickBeeper();
    console.log("pickup beeper")
}
function  putBeeper() {
    myKarel.putBeeper();
    console.log("put beeper")
}

function  logOut(){
    console.log(KarelPosition.x + "->" + myKarel.x + ' ' + KarelPosition.y + "->" + myKarel.y + ' ' + KarelPosition.direction + "->" + myKarel.direction);
    var j;
    for (var i = 0; i < resultActions.length; i++){
        for(j in resultActions[i]){
            console.log(j,resultActions[i][j]);
        }
    }
}

var commands = 'putBeeper()';

try {
    eval(commands);
} catch(e) {
    console.log(e);
    logOut();
    //console.log(e);
}
//if (!commands[commands.length -1].err)
//   commands.push({finish: true})