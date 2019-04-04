var game = require('macroDefine');
var customEvents = require('eventCustom');
cc.Class({
    extends: cc.Component,

    properties: {
        score_value: 5,
        score_audio: {
            default: null,
            type: cc.AudioClip
        },
        scoreEffect: [cc.Prefab],
        collisioned: false
    },

    start: function () {
        console.log('starControl__start');


    },

    // 普通碰撞组件回调
    // onCollisionEnter: function (other, self) {
    //     // console.log('onCollisionEnter...star_other.name=' + other.node.name);
    //     // other.getName();
    //     if (other && other.node.name == 'role') {
    //         // console.log('xxx_role_get start');
    //         cc.audioEngine.play(this.score_audio, false, 2);
    //         customEvents.trigger(game.EVTS.STAR_COLLECT, [this.score_value]);
    //         // this.anim = this.node.getChildByName("goldEffect").getComponent(cc.Animation);
    //         // this.animState = this.anim.play('goldEffect_jump_01');
    //         // this.node.emit(game.EVTS.STAR_COLLECT, this.core_value);
    //         this.node.removeFromParent();
    //     }
    // },

    // onCollisionStay: function (other, self) {
    //     // console.log('onCollisionStay...star');
    // },

    // onCollisionExit: function (other, self) {
    //     // console.log('onCollisionExit...star');
    // },

    //刚体碰撞组件回调
    //只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log("__star_contack_begin");
        if (otherCollider && otherCollider.node.name == 'role') {
            console.log('_star_get start');
            if (this.collisioned) return;
            this.collisioned = true;
            cc.audioEngine.play(this.score_audio, false, 2);
            customEvents.trigger(game.EVTS.STAR_COLLECT, [this.score_value]);
            var effect = cc.instantiate(this.scoreEffect[0]);
            var data = {
                score: this.score_value,
                startPos: this.node.getPosition()
            };
            effect.getComponent('coinGet').setData(data);
            this.node.getParent().addChild(effect);
            this.node.removeFromParent();
        }
    },
    //每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {

    },
    //每次处理完碰撞体接触逻辑时被调用
    onPostContact: function (contact, selfCollider, otherCollider) {

    },
    //只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {

    },

    onDestroy: function () {
        // console.log("xxx_star_onDestory");
    }
});
