
var game = require("macroDefine");
var customEvents = require('eventCustom');
var modelControl = require('modelControl');

cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },
        score: {
            default: null,
            type: cc.Label
        },
        star: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.oneKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.oneKeyUp, this);

        customEvents.listen(game.EVTS.STAR_COLLECT, this.onStarCollect, this);
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;
    },

    onDestroy: function () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.oneKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.oneKeyUp, this);

        console.log("__gameControl_onDestroy");
        customEvents.ignore(game.EVTS.STAR_COLLECT, this.onStarCollect, this);
    },

    start: function () {
        console.log("__gameConstrol_enableCollision_physics");
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;

    },

    update: function (dt) {

    },

    oneKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.player.getComponent('player').checkMoveStatue(game.PLAYER_STATE.HORIZON_BACKWARD_MOVING);
                break;
            case cc.macro.KEY.d:
                this.player.getComponent('player').checkMoveStatue(game.PLAYER_STATE.HORIZON_FORWARD_MOVING);
                break;
            case cc.macro.KEY.up:
                this.player.getComponent('player').checkMoveStatue(game.PLAYER_STATE.HANGING);
                break;
            default: break;
        }
    },

    oneKeyUp: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.player.getComponent('player').stopMoveAction(game.PLAYER_STATE.HORIZON_BACKWARD_MOVING);
                break;
            case cc.macro.KEY.d:
                this.player.getComponent('player').stopMoveAction(game.PLAYER_STATE.HORIZON_FORWARD_MOVING);
                break;
            case cc.macro.KEY.up:
                this.player.getComponent('player').stopMoveAction(game.PLAYER_STATE.HANGING);
                console.log("_control_key_up:key=up");
                break;
            default:
                break;
        }
    },

    onStarCollect: function (score) {
        // console.log("xxx_gameControl_startCollect_score=" + score);
        modelControl.setGameScore(modelControl.getGameScore() + score);
        // cc.find("score", this.node).setString(modelControl.getGameScore() - '');
        this.score.string = (modelControl.getGameScore());
        this.randomGenerateStar();
    },

    randomGenerateStar: function () {
        var scene = cc.director.getScene();
        var node = cc.instantiate(this.star);
        node.parent = scene;
        var randomPos = function (min, max) {
            return min + Math.random() * (max - min);
        };
        node.setPosition(randomPos(60, 900), randomPos(200, 400));
    }
});
