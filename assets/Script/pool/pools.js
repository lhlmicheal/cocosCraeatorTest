var game = require('macroDefine');

var pools = pools || {};
pools.get = function (key) {
    if (!pools[key]) {
        pools[key] = new Array(game.MAX_EVTS_SIZE);
        return false;
    } else {
        return pools[key].shift();
    }
};
pools.putIn = function () {

};
module.exports = pools;
