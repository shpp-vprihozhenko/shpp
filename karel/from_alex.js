//var lines = document.getElementById('task').innerHTML.split('/n');

//var a = ["1x x1x1x1x ",
//    ">     1 1  ",
//    "1x x2x1x1x "];
//
//var f = new field(a);


function Field(map) {
    this.map = map;
    this.isAvailable = function (x, y) {
        if (this.map[y].charAt(x) === 'x') {
            return false;
        } else {
            return true;
        }
    };
    this.checkBeeper = function (x, y) {
        var beeperCount = parseInt(this.map[y].charAt(x), 10);
        return (isNaN(beeperCount)) ? 0 : beeperCount;
    };
    this.getKarelPosition = function () {
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
    this.getHeight = function () {
        return this.map.length;
    };
    this.getWidth = function () {
        return this.map[0].length;
    };
}


function Karel(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.beeperInBag = 1000;
}
Karel.prototype.karelMove = function () {
    var dX = 0, dY = 0;
    if (this.direction == '0') {
        if (f.isAvailable(this.x, this.y + 1)) {
            dY = 1;
        } else {
            listCommands.push(undefined, f.map);
            return;
        }
    } else if (this.direction == '1') {
        if (f.isAvailable(this.x + 1, this.y)) {
            dX = 1;
        } else {
            listCommands.push(undefined, f.map);
            return;
        }
    } else if (this.direction == '2') {
        if (f.isAvailable(this.x, this.y + 1)) {
            dY = -1;
        } else {
            listCommands.push(undefined, f.map);
            return;
        }
    } else if (this.direction == '3') {
        if (f.isAvailable(this.x - 1, this.y)) {
            dX = -1;
        } else {
            listCommands.push(undefined, f.map);
            return;
        }
    }
    var newX = this.x + dX;
    var newY = this.y + dY;
    karel = new Karel(newX, newY, this.direction);
    listCommands.push(karel, f.map);
}

Karel.prototype.turnLeft = function () {
    var newDirection = (this.direction + 1) % 4;
    karel = new Karel(this.x, this.y, newDirection);
    listCommands.push(karel, f.map);
}

Karel.prototype.frontIsClear = function () {
    if (this.direction == '0') {
        if (f.isAvailable(this.x, this.y + 1)) {
            return true;
        }
    } else if (this.direction == '1') {
        if (f.isAvailable(this.x + 1, this.y)) {
            return true;
        }
    } else if (this.direction == '2') {
        if (f.isAvailable(this.x, this.y + 1)) {
            return true;
        }
    } else if (this.direction == '3') {
        if (f.isAvailable(this.x - 1, this.y)) {
            return true;
        }
    }
    return false;
}

Karel.prototype.frontIsBlocked = function () {
    return !karel.frontIsClear();
}

//var karel = new Karel(f.getKarelPosition().x, f.getKarelPosition().y, f.getKarelPosition().direction);
//
//
//var line = "move(); turnLeft(); frontIsClear(); frontIsBlocked(); move();"
//var lines = line.split(' ');
//var commands = [];
//var listCommands = [];
//listCommands.push(karel, f.map);
//for (var i = 0; i < lines.length; i++) {
//    commands.push(lines[i].substr(0, lines[i].length - 3));
//    console.log(lines[i].substr(0, lines[i].length - 3));
//}
//
//for (var i = 0; i < commands.length; i++) {
//    if (commands[i] === 'move') {
//        karel.karelMove();
//    } else if (commands[i] === 'turnLeft') {
//        karel.turnLeft();
//    } else if (commands[i] === 'frontIsClear') {
//        karel.frontIsClear();
//        console.log("front", karel.frontIsClear());
//    } else if (commands[i] === 'frontIsBlocked') {
//        karel.frontIsBlocked();
//        console.log("front", karel.frontIsBlocked());
//    }
//}
//
//for (var i = 0; i < listCommands.length; i++) {
//    if (listCommands[i] === undefined) {
//        console.log("undefined");
//    } else {
//        console.log(listCommands[i]);
//    }
//}