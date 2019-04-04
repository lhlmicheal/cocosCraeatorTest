var game = require("macroDefine");
var customEvents = require('eventCustom');

cc.Class({
    extends: cc.Component,

    properties: {
        flySpeed: 0,
        upDownRange: 0,
        flyRevertTime: 0, //飞行折返时间。
        curDirection: 1, //1表示正向，-1表示反向
        revertWaiting: false, //折返停留
        hp: 0,
        score: 0,
        scoreEffect: [cc.Prefab], //得分特效
        collisioned: false
    },

    onLoad: function () {

    },

    start: function () {
        // this.upDown = [-1, 0, 1];
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
        var up = cc.moveBy(0.5, cc.v2(0, this.upDownRange));
        var upRev = up.reverse();
        var down = cc.moveBy(0.5, cc.v2(0, -this.upDownRange));
        var downRev = down.reverse();
        this.node.runAction(cc.repeatForever(cc.sequence(
            up, upRev, down, downRev
        )));
    },
    //刚体碰撞组件回调
    //只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == 'role') {
            //tode 死亡
            // this.animState.play(); 
        } else if (otherCollider.node.name == 'bullet_ball') {
            if (this.collisioned) return;
            this.collisioned = true;
            console.log("__enemy_crawl_connact_bullet");
            var power = otherCollider.node.getComponent('bullet_ball').power;
            this.hp -= power;
            if (this.hp <= 0) {
                cc.audioEngine.play(this.score_audio, false, 2);
                customEvents.trigger(game.EVTS.KILL_ENEMY, [this.score]);
                var effect = cc.instantiate(this.scoreEffect[0]);
                var data = {
                    score: this.score,
                    startPos: this.node.getPosition()
                };
                effect.getComponent('coinGet').setData(data);
                this.node.getParent().addChild(effect);
                this.node.removeFromParent();
            }
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
    }
});
