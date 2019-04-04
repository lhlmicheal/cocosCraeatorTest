var game = require("macroDefine");
var customEvents = require('eventCustom');

cc.Class({
    extends: cc.Component,

    properties: {
        attachedWeapon: 0, //weaponId,
    },

    onLoad: function () {
        this.animState = this.node.getComponent(cc.Animation);
        this.animState.play("lifeMushroom");
    },

    start: function () {

    },

    update: function (dt) {

    },
    // 普通碰撞回调
    // onCollisionEnter: function (other, self) {
    //     console.log('onCollisionEnter...mushroom');
    // },

    // onCollisionStay: function (other, self) {
    //     console.log('onCollisionStay...mushroom');
    // },

    // onCollisionExit: function (other, self) {
    //     console.log('onCollisionExit...mushroom');
    // },
    //刚体碰撞组件回调
    //只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log("__mushroom_contact_begin");
        if (otherCollider && otherCollider.node.name == 'role') {
            cc.audioEngine.play(this.score_audio, false, 2);
            customEvents.trigger(game.EVTS.PICK_UP_WEAPON, [this.attachedWeapon]);
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
        console.log("__mushroom_contact_end");
    }
});
