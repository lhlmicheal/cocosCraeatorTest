var game = require('macroDefine');
var customEvents = require('eventCustom');
cc.Class({
    extends: cc.Component,

    properties: {
        score_value: 5,
        score_audio: {
            default: null,
            type: cc.AudioClip
        }
    },

    start: function () {
        console.log('starControl__start');
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
    },

    onCollisionEnter: function (other, self) {
        console.log('onCollisionEnter...star_other.name=' + other.node.name);
        // other.getName();
        if (other && other.node.name == 'role') {
            console.log('xxx_role_get start');
            cc.audioEngine.play(this.score_audio, false, 2);
            customEvents.trigger(game.EVTS.STAR_COLLECT, [this.score_value]);
            // this.anim = this.node.getComponent(cc.Animation);
            // this.animState = this.anim.play('goldEffect_jump_01');
            // this.node.emit(game.EVTS.STAR_COLLECT, this.core_value);
            this.node.removeFromParent();
        }
    },

    onCollisionStay: function (other, self) {
        // console.log('onCollisionStay...star');
    },

    onCollisionExit: function (other, self) {
        // console.log('onCollisionExit...star');
    },
    onDestroy: function () {
        console.log("xxx_star_onDestory");
    }
});
