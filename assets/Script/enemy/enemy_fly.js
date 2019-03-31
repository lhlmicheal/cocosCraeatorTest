// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        flySpeed: 0,
        upDown: [cc.Integer],
        flyRevertTime: 0, //飞行折返时间。
        curDirection: 1, //1表示正向，-1表示反向
        revertWaiting: false, //折返停留
    },

    onLoad: function () {

    },

    start: function () {
        this.upDown = [-1, 0, 1];
        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.physicscollider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.anim = this.node.getComponent(cc.Animation);
        this.animState = this.anim.play('fire_bird');
        var speed = this.animState.speed;
        this.animState.speed = 0.15;

        this.leftFlyTime = this.flyRevertTime;
        this.rigidbody.linearVelocity = cc.v2((-this.curDirection) * this.flySpeed, 0); //默认面向左

        this.flyUpDown();
    },

    update: function (dt) {
        this.leftFlyTime -= dt;
        if (this.leftFlyTime <= 0) {
            this.changeFlyDirection();
        }
    },

    changeFlyDirection: function () {
        var that = this;
        //折返时停留一段时间不会太突兀。
        if (this.revertWaiting) return;
        this.rigidbody.linearVelocity.x = 0;
        this.revertWaiting = true;
        setTimeout(function (params) {
            that.leftFlyTime = that.flyRevertTime;
            that.curDirection = -that.curDirection;
            that.node.scaleX = that.curDirection;
            that.rigidbody.linearVelocity = cc.v2((-that.curDirection) * that.flySpeed, 0); //默认面向左
            that.revertWaiting = false;
        }, 1000);
    },

    flyUpDown: function () {
        var that = this;
        var up = cc.moveBy(0.5, cc.v2(0, 50));
        var upRev = up.reverse();
        var down = cc.moveBy(0.5, cc.v2(0, -50));
        var downRev = down.reverse();
        this.node.runAction(cc.repeatForever(cc.sequence(
            up, upRev, down, downRev
        )));
    }
});
