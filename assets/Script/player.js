var game = require("macroDefine");

cc.Class({
    extends: cc.Component,

    properties: {
        curDirection: 0, //0面向右，1面向左

        jumpHeight: 0,
        jumpDuration: 0,
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },
        isHanging: false,

        moveSpeed: 0,
        accel_backword: false,
        accel_forword: false
    },

    resetDirection: function (dire) {
        if (this.curDirection != dire) {
            this.curDirection = dire;
            this.node.scaleX = (this.curDirection == 0) ? 1 : -1;
        }
    },

    runJumpAction: function () {
        if (this.isHanging) return;
        var that = this;
        this.isHanging = true;
        cc.audioEngine.play(this.jumpAudio, false, 2);
        var upAction = cc.moveBy(this.jumpDuration, 0, this.jumpHeight).easing(cc.easeSineOut());
        var downAction = cc.moveBy(this.jumpDuration, 0, -this.jumpHeight).easing(cc.easeSineIn());
        this.node.runAction(cc.sequence(upAction, downAction, cc.callFunc(function () {
            that.isHanging = false;
        })));
    },

    checkMoveStatue: function (status) {
        var direction = this.curDirection;
        switch (status) {
            case game.PLAYER_STATE.HORIZON_FORWARD_MOVING:
                this.accel_backword = false;
                this.accel_forword = true;
                direction = 0;
                break;
            case game.PLAYER_STATE.HORIZON_BACKWARD_MOVING:
                this.accel_backword = true;
                this.accel_forword = false;
                direction = 1;
                break;
            case game.PLAYER_STATE.STAND_STILL:
                this.accel_backword = false;
                this.accel_forword = false;
                break;
            case game.PLAYER_STATE.HANGING:
                this.runJumpAction();
                break;
            default:
                this.accel_backword = false;
                this.accel_forword = false;
                break;
        }
        this.resetDirection(direction);
    },

    stopMoveAction: function (status) {
        switch (status) {
            case game.PLAYER_STATE.HORIZON_FORWARD_MOVING:
                this.accel_forword = false;
                break;
            case game.PLAYER_STATE.HORIZON_BACKWARD_MOVING:
                this.accel_backword = false;
                break;
            case game.PLAYER_STATE.STAND_STILL:
                this.accel_backword = false;
                this.accel_forword = false;
                break;
            default:
                break;
        }
    },

    moveAction: function (frameSpeed) {
        if (this.accel_forword && this.node.x < (game.SCREEN_WIDTH - 50))
            this.node.x += frameSpeed;
        else if (this.accel_backword && this.node.x > 50)
            this.node.x -= frameSpeed;
    },

    start: function () {
        console.log('player__start');
    },

    onLoad: function () {
        this.anim = this.node.getComponent(cc.Animation);
        this.animState = this.anim.play('role_walk');
    },

    update: function (dt) {
        this.moveAction(this.moveSpeed * dt);
    },

    onCollisionEnter: function (other, self) {
        console.log('onCollisionEnter...play');
    },

    onCollisionStay: function (other, self) {
        // console.log('onCollisionStay...play');
    },

    onCollisionExit: function (other, self) {
        // console.log('onCollisionExit...play');
    }
});
