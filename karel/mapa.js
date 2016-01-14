function Field(map) {
    this.map = map;
    this.isAvailible = function (x, y) {
        if (this.map[y].charAt(x) === 'x') {
            return false;
        } else {
            return true;
        }
    };
    this.numBeepers = function (x, y) {
        var beeperCount = parseInt(this.map[y].charAt(x), 10);
        return (isNaN(beeperCount)) ? 0 : beeperCount;
    };
    this.getKarelPosition = function () {
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
    this.getHeight = function () {
        return this.map.length;
    };
    this.getWidth = function () {
        return this.map[0].length;
    };
}
