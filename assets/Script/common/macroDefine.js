var game = game || {};

game.MAX_EVTS_SIZE = 10;

game.SCREEN_WIDTH = 960;
game.SCREEN_HEIGHT = 640;

game.PLAYER_STATE = {
    STAND_STILL: 0,
    HORIZON_FORWARD_MOVING: 1,
    HORIZON_BACKWARD_MOVING: 2,
    HANGING: 3
};

game.EVTS = {
    EMPTY: 'empty',
    STAR_COLLECT: 'star_collect',
    PICK_UP_WEAPON: 'pick_up_weapon',
    KILL_ENEMY: 'kill_enemy',
    PLAYER_DIE: 'player_die'
};

game.SCENE_MODE = {
    MAIN_MENU: 'mainMenu',
    MAIN_SCENE: 'mainScene'
};

module.exports = game;