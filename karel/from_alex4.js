///**
// * Created by Uzer on 15.01.2016.
// */
//var a = ["1x x1x1x1x ",
//    ">      1 1 ",
//    "1x x2x1x1x "];
//
//var map = new Field(a);


function Field(map) {
    this.map = map;
}

Field.prototype.isAvailable = function (x, y) {
    if (this.map[y].charAt(x) === 'x') {
        return false;
    } else {
        return true;
    }
};

Field.prototype.checkBeeper = function (x, y) {
    var beeperCount = parseInt(this.map[y].charAt(x), 10);
    return (isNaN(beeperCount)) ? 0 : beeperCount;
};
Field.prototype.getKarelPosition = function () {
    for (var i = 0; i < this.map.length; i++) {
        for (var j = 0; j < this.map[0].length; j++) {
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
Field.prototype.getHeight = function () {
    return this.map.length;
};
Field.prototype.getWidth = function () {
    return this.map[0].length;
};


function Karel(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.beeperInBag = 1000;
}

Karel.prototype.move = function () {
    var dX = 0, dY = 0;
    if (this.direction == '0') {
        if (map.isAvailable(this.x, this.y + 1)) {
            dY = 1;
        } else {
            this.x = -1;
            this.y = -1;
            return;
        }
    } else if (this.direction == '1') {
        if (map.isAvailable(this.x + 1, this.y)) {
            dX = 1;
        } else {
            this.x = -1;
            this.y = -1;
            return;
        }
    } else if (this.direction == '2') {
        if (map.isAvailable(this.x, this.y + 1)) {
            dY = -1;
        } else {
            this.x = -1;
            this.y = -1;
            return;
        }
    } else if (this.direction == '3') {
        if (map.isAvailable(this.x - 1, this.y)) {
            dX = -1;
        } else {
            this.x = -1;
            this.y = -1;
            return;
        }
    }
    var newX = this.x + dX;
    var newY = this.y + dY;
    this.x = newX;
    this.y = newY;
}

Karel.prototype.turnLeft = function () {
    var newDirection = (this.direction + 1) % 4;
    this.direction = newDirection;
}

Karel.prototype.frontIsClear = function () {
    if (this.direction == '0') {
        if (map.isAvailable(this.x, this.y + 1)) {
            return true;
        }
    } else if (this.direction == '1') {
        if (map.isAvailable(this.x + 1, this.y)) {
            return true;
        }
    } else if (this.direction == '2') {
        if (map.isAvailable(this.x, this.y + 1)) {
            return true;
        }
    } else if (this.direction == '3') {
        if (map.isAvailable(this.x - 1, this.y)) {
            return true;
        }
    }
    return false;
}

Karel.prototype.frontIsBlocked = function () {
    return !karel.frontIsClear();
}

Karel.prototype.leftIsClear = function () {
    if (this.direction == '0') {
        if (map.isAvailable(this.x + 1, this.y)) {
            return true;
        }
    } else if (this.direction == '1') {
        if (map.isAvailable(this.x, this.y - 1)) {
            return true;
        }
    } else if (this.direction == '2') {
        if (map.isAvailable(this.x - 1, this.y)) {
            return true;
        }
    } else if (this.direction == '3') {
        if (map.isAvailable(this.x, this.y + 1)) {
            return true;
        }
    }
    return false;
}

Karel.prototype.leftIsBlocked = function () {
    return !karel.leftIsClear();
}

Karel.prototype.rightIsClear = function () {
    if (this.direction == '0') {
        if (map.isAvailable(this.x - 1, this.y)) {
            return true;
        }
    } else if (this.direction == '1') {
        if (map.isAvailable(this.x, this.y + 1)) {
            return true;
        }
    } else if (this.direction == '2') {
        if (map.isAvailable(this.x + 1, this.y)) {
            return true;
        }
    } else if (this.direction == '3') {
        if (map.isAvailable(this.x, this.y - 1)) {
            return true;
        }
    }
    return false;
}

Karel.prototype.rightIsBlocked = function () {
    return !karel.rightIsClear();
}

Karel.prototype.beepersPresent = function () {
    return map.checkBeeper(this.x, this.y) != 0;
}

Karel.prototype.noBeepersPresent = function () {
    return !karel.beepersPresent();
}

Karel.prototype.putBeeper = function () {
    var x = this.x;
    var y = this.y;
    var currBeeperCount = map.checkBeeper(x, y);
    if (currBeeperCount < 9) {
        var s = map.map[y];
        var s1 = s.substring(0, x - 1);
        var s2 = s.substring(x + 1);
        s = s1 + (currBeeperCount + 1) + s2;
        map.map[y] = s;
    } else {
        return;
    }
}

Karel.prototype.pickBeeper = function () {
    var x = this.x;
    var y = this.y;
    var currBeeperCount = map.checkBeeper(x, y);
    if (currBeeperCount == 0) {
        return;
    } else {
        var s = map.map[y];
        var s1 = s.substring(0, x - 1);
        var s2 = s.substring(x + 1);
        s = s1 + (currBeeperCount - 1) + s2;
        map.map[y] = s;
    }
}

Karel.prototype.facingNorth = function () {
    return karel.direction == '2';
}

Karel.prototype.noFacingNorth = function () {
    return !karel.facingNorth();
}

Karel.prototype.facingSouth = function () {
    return karel.direction == '0';
}

Karel.prototype.noFacingSouth = function () {
    return !karel.facingSouth();
}

Karel.prototype.facingWest = function () {
    return karel.direction == '3';
}

Karel.prototype.noFacingWest = function () {
    return !karel.facingWest();
}

Karel.prototype.facingEast = function () {
    return karel.direction == '1';
}

Karel.prototype.noFacingEast = function () {
    return !karel.facingEast();
}

//var karelPosition = map.getKarelPosition();
//var karel = new Karel(karelPosition.x, karelPosition.y, karelPosition.direction);

//var commands = [];

function parseTask(lines, arMoves, karel) {
    for (var i = 0; i < lines.length; i++) {
        var oldX = karel.x;
        var oldY = karel.y;
        var oldDir = karel.direction;
        var oldBeepers = map.checkBeeper(oldX, oldY);
        checkCommands(lines[i]);
        var newX = karel.x;
        var newY = karel.y;
        var newDir = karel.direction;
        var newBeepers = map.checkBeeper(newX, newY);
        arMoves.push({oldData:{x:oldX, y:oldY, dir:oldDir, beepers: oldBeepers}, newData:{x:newX, y:newY, dir:newDir, beepers: newBeepers}})
    }
}

function checkCommands(command) {
    if (command.indexOf('move') > -1) {
        karel.move();
    } else if (command.indexOf('turnLeft') > -1) {
        karel.turnLeft();
    } else if (command.indexOf('frontIsClear') > -1) {
        karel.frontIsClear();
    } else if (command.indexOf('frontIsBlocked') > -1) {
        karel.frontIsBlocked();
    } else if (command.indexOf('rightIsClear') > -1) {
        karel.rightIsClear();
    } else if (command.indexOf('rightIsBlocked') > -1) {
        karel.rightIsBlocked();
    } else if (command.indexOf('leftIsClear') > -1) {
        karel.leftIsClear();
    } else if (command.indexOf('leftIsBlocked') > -1) {
        karel.leftIsBlocked();
    } else if (command.indexOf('beepersPresent') > -1) {
        karel.beepersPresent();
    } else if (command.indexOf('noBeepersPresent') > -1) {
        karel.noBeepersPresent();
    } else if (command.indexOf('facingNorth') > -1) {
        karel.facingNorth();
    } else if (command.indexOf('noFacingNorth') > -1) {
        karel.noFacingNorth();
    } else if (command.indexOf('facingEast') > -1) {
        karel.facingEast();
    } else if (command.indexOf('noFacingEast') > -1) {
        karel.noFacingEast();
    } else if (command.indexOf('facingSouth') > -1) {
        karel.facingSouth();
    } else if (command.indexOf('noFacingSouth') > -1) {
        karel.noFacingSouth();
    } else if (command.indexOf('facingWest') > -1) {
        karel.facingWest();
    } else if (command.indexOf('noFacingWest') > -1) {
        karel.noFacingWest();
    } else if (command.indexOf('putBeeper') > -1) {
        karel.putBeeper();
    } else if (command.indexOf('pickBeeper') > -1) {
        karel.pickBeeper();
    }
}