var a = ["1x x1x1x1x ",
    ">      1 1 ",
    "1x x2x1x1x "];

var map = new Field(a);


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
            listCommands.push(null);
            return;
        }
    } else if (this.direction == '1') {
        if (map.isAvailable(this.x + 1, this.y)) {
            dX = 1;
        } else {
            listCommands.push(null);
            return;
        }
    } else if (this.direction == '2') {
        if (map.isAvailable(this.x, this.y + 1)) {
            dY = -1;
        } else {
            listCommands.push(null);
            return;
        }
    } else if (this.direction == '3') {
        if (map.isAvailable(this.x - 1, this.y)) {
            dX = -1;
        } else {
            listCommands.push(null);
            return;
        }
    }
    var newX = this.x + dX;
    var newY = this.y + dY;

    listCommands.push({
        x1: this.x,
        y1: this.y,
        direction1: this.direction,
        x2: newX,
        y2: newY,
        direction2: this.direction
    });
    this.x = newX;
    this.y = newY;
}

Karel.prototype.turnLeft = function () {
    var newDirection = (this.direction + 1) % 4;
    listCommands.push({
        x1: this.x,
        y1: this.y,
        direction1: this.direction,
        x2: this.x,
        y2: this.y,
        direction2: newDirection
    });
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

var karelPosition = map.getKarelPosition();
var karel = new Karel(karelPosition.x, karelPosition.y, karelPosition.direction);

var line = "turnLeft(); move(); pickBeeper(); putBeeper(); putBeeper();"
var lines = line.split(' ');
var commands = [];
var listCommands = [];
for (var i = 0; i < lines.length; i++) {
    commands.push(lines[i].substr(0, lines[i].length - 3));
}

for (var i = 0; i < commands.length; i++) {
    var oldX = karel.x;
    var oldY = karel.y;
    var oldDirection = karel.direction;
    if (commands[i] === 'move') {
        karel.move();
    } else if (commands[i] === 'turnLeft') {
        karel.turnLeft();
    } else if (commands[i] === 'frontIsClear') {
        karel.frontIsClear();
        console.log("front", karel.frontIsClear());
    } else if (commands[i] === 'frontIsBlocked') {
        karel.frontIsBlocked();
        console.log("front", karel.frontIsBlocked());
    } else if (commands[i] === 'rightIsClear') {
        karel.rightIsClear();
        console.log("right", karel.rightIsClear());
    } else if (commands[i] === 'rightIsBlocked') {
        karel.rightIsBlocked();
    } else if (commands[i] === 'leftIsClear') {
        karel.leftIsClear();
        console.log("left", karel.leftIsClear());
    } else if (commands[i] === 'leftIsBlocked') {
        karel.leftIsBlocked();
    } else if (commands[i] === 'beepersPresent') {
        karel.beepersPresent();
    } else if (commands[i] === 'noBeepersPresent') {
        karel.noBeepersPresent();
    } else if (commands[i] === 'facingNorth') {
        karel.facingNorth();
    } else if (commands[i] === 'noFacingNorth') {
        karel.noFacingNorth();
    } else if (commands[i] === 'facingEast') {
        karel.facingEast();
    } else if (commands[i] === 'noFacingEast') {
        karel.noFacingEast();
    } else if (commands[i] === 'facingSouth') {
        karel.facingSouth();
    } else if (commands[i] === 'noFacingSouth') {
        karel.noFacingSouth();
    } else if (commands[i] === 'facingWest') {
        karel.facingWest();
    } else if (commands[i] === 'noFacingWest') {
        karel.noFacingWest();
    } else if (commands[i] === 'putBeeper') {
        karel.putBeeper();
    } else if (commands[i] === 'pickBeeper') {
        karel.pickBeeper();
    }

    goKarel({x: oldX, y: oldY, direction: oldDirection}, {})
}

for (var i = 0; i < listCommands.length; i++) {
    if (listCommands[i] === null) {
        console.log("null");
    } else {
        console.log(listCommands[i]);
    }
}
console.log(map.map)