var game = require("macroDefine");

var util = util || {};
util.outOfView = function (pos) {
    var out = false;
    if (pos.x < 0 || pos.x >= game.SCREEN_WIDTH || pos.y < 0 || pos.y >= game.SCREEN_HEIGHT)
        out = true;
    return out;
};

module.exports = util;