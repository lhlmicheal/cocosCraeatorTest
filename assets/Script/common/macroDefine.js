var game = game || {};
game.MAX_EVTS_SIZE = 10;
game.SCREEN_WIDTH = 960;
game.SCREEN_HEIGHT = 480;
game.PLAYER_STATE = {
    STAND_STILL: 0,
    HORIZON_FORWARD_MOVING: 1,
    HORIZON_BACKWARD_MOVING: 2,
    HANGING: 3
};
game.EVTS = {
    EMPTY: 'empty',
    STAR_COLLECT: 'star_collect',
};

module.exports = game;