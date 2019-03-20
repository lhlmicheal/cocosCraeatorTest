var gameScore = require('gameScore');
var modelControl = modelControl || {};

modelControl.getGameScore = function () {
    return gameScore.score;
};

modelControl.setGameScore = function (newScore) {
    if (newScore != gameScore.score)
        gameScore.score = newScore;
};

module.exports = modelControl;