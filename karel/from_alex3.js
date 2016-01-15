/**
 * Created by Uzer on 15.01.2016.
 */
//var a = ["1x x1x1x1x ",
//    ">      1 1 ",
//    "1x x2x1x1x "];

//var map = new Field(a);


function Field(initMap) {
    this.map = initMap;
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
            commands.push({
                oldData: {
                    x: this.x,
                    y: this.y,
                    dir: this.direction,
                    beepers: map.checkBeeper(this.x, this.y)
                },
                newData: null
            });
            //listCommands.push(null);
            return;
        }
    } else if (this.direction == '1') {
        if (map.isAvailable(this.x + 1, this.y)) {
            dX = 1;
        } else {
            commands.push({
                oldData: {
                    x: this.x,
                    y: this.y,
                    dir: this.direction,
                    beepers: map.checkBeeper(this.x, this.y)
                },
                newData: null
            });
            //listCommands.push(null);
            return;
        }
    } else if (this.direction == '2') {
        if (map.isAvailable(this.x, this.y + 1)) {
            dY = -1;
        } else {
            commands.push({
                oldData: {
                    x: this.x,
                    y: this.y,
                    dir: this.direction,
                    beepers: map.checkBeeper(this.x, this.y)
                },
                newData: null
            });
            //listCommands.push(null);
            return;
        }
    } else if (this.direction == '3') {
        if (map.isAvailable(this.x - 1, this.y)) {
            dX = -1;
        } else {
            commands.push({
                oldData: {
                    x: this.x,
                    y: this.y,
                    dir: this.direction,
                    beepers: map.checkBeeper(this.x, this.y)
                },
                newData: null
            });
            //listCommands.push(null);
            return;
        }
    }
    var newX = this.x + dX;
    var newY = this.y + dY;
    commands.push({
        oldData: {
            x: this.x,
            y: this.y,
            dir: this.direction,
            beepers: map.checkBeeper(this.x, this.y)
        },
        newData: {x: newX, y: newY, dir: this.direction, beepers: map.checkBeeper(newX, newY)}
    });

    /*listCommands.push({
     x1: this.x,
     y1: this.y,
     direction1: this.direction,
     x2: newX,
     y2: newY,
     direction2: this.direction
     });*/
    this.x = newX;
    this.y = newY;
}

Karel.prototype.turnLeft = function () {
    var newDirection = (this.direction + 1) % 4;
    commands.push({
        oldData: {
            x: this.x,
            y: this.y,
            dir: this.direction,
            beepers: map.checkBeeper(this.x, this.y)
        },
        newData: {x: this.x, y: this.y, dir: newDirection, beepers: map.checkBeeper(this.x, this.y)}
    });
    /*listCommands.push({
     x1: this.x,
     y1: this.y,
     direction1: this.direction,
     x2: this.x,
     y2: this.y,
     direction2: newDirection
     });*/
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
    commands.push({
        oldData: {
            x: this.x,
            y: this.y,
            dir: this.direction,
            beepers: currBeeperCount
        },
        newData: {x: this.x, y: this.y, dir: this.direction, beepers: map.checkBeeper(this.x, this.y)}
    });
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
    commands.push({
        oldData: {
            x: this.x,
            y: this.y,
            dir: this.direction,
            beepers: currBeeperCount
        },
        newData: {x: this.x, y: this.y, dir: this.direction, beepers: map.checkBeeper(this.x, this.y)}
    });
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

function parseTask(lines,commands,karel) {
    for (var i = 0; i < lines.length; i++) {
        if (lines[i] === 'move();') {
            karel.move();
        } else if (lines[i] === 'turnLeft();') {
            karel.turnLeft();
        } else if (lines[i] === 'frontIsClear();') {
            karel.frontIsClear();
            console.log("front", karel.frontIsClear());
        } else if (lines[i] === 'frontIsBlocked();') {
            karel.frontIsBlocked();
            console.log("front", karel.frontIsBlocked());
        } else if (lines[i] === 'rightIsClear();') {
            karel.rightIsClear();
            console.log("right", karel.rightIsClear());
        } else if (lines[i] === 'rightIsBlocked();') {
            karel.rightIsBlocked();
        } else if (lines[i] === 'leftIsClear();') {
            karel.leftIsClear();
            console.log("left", karel.leftIsClear());
        } else if (lines[i] === 'leftIsBlocked();') {
            karel.leftIsBlocked();
        } else if (lines[i] === 'beepersPresent();') {
            karel.beepersPresent();
        } else if (lines[i] === 'noBeepersPresent();') {
            karel.noBeepersPresent();
        } else if (lines[i] === 'facingNorth();') {
            karel.facingNorth();
        } else if (lines[i] === 'noFacingNorth();') {
            karel.noFacingNorth();
        } else if (lines[i] === 'facingEast();') {
            karel.facingEast();
        } else if (lines[i] === 'noFacingEast();') {
            karel.noFacingEast();
        } else if (lines[i] === 'facingSouth();') {
            karel.facingSouth();
        } else if (lines[i] === 'noFacingSouth();') {
            karel.noFacingSouth();
        } else if (lines[i] === 'facingWest();') {
            karel.facingWest();
        } else if (lines[i] === 'noFacingWest();') {
            karel.noFacingWest();
        } else if (lines[i] === 'putBeeper();') {
            karel.putBeeper();
        } else if (lines[i] === 'pickBeeper();') {
            karel.pickBeeper();
        }
    }
    return commands;
}