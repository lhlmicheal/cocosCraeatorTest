var game = require("macroDefine");
var customEvents = require('eventCustom');

cc.Class({
    extends: cc.Component,

    properties: {
        curDirection: 1, //1表示正向，-1表示反向
        moveSpeed: 20, //像素每秒
        acceleration: 0, //秒,表示在多少秒内速度提升到某个值.
        hp: 0,
        score: 0, //消灭怪物得分
        scoreEffect: [cc.Prefab], //得分特效
        collisioned: false
    },
    //状态检测
    dead: function () {
        return (this.hp <= 0);
    },
    //调整启动速度
    // adjustSlowStart: function (addV) {
    //     //速度启动缓冲。
    //     var that = this;
    //     var curSpeed = Math.abs(this.rigidbody.linearVelocity.x);
    //     if (curSpeed < this.moveSpeed) {
    //         curSpeed += addV;
    //         this.rigidbody.applyForceToCenter(cc.v2((-this.curDirection) * this.force, 0), this.rigidbody.getWorldCenter());
    //         this.rigidbody.linearVelocity = cc.v2((-this.curDirection) * (curSpeed), 0); //默认面向右
    //     } else {
    //         setTimeout(function () {

    //             var addVol = that.moveSpeed / Math.floor(that.acceleration / 0.2);
    //             console.log("_crawl_acceleration:" + addVol);
    //             that.adjustSlowStart(addVol);
    //         }, 200);
    //     }
    // },
    start: function () {
        console.log('enemy_crawl__start');
        this.force = this.rigidbody.getMass() * this.physicsCollider.friction;
        console.log("_enemy_Mass:" + this.rigidbody.getMass() + '_friction=' + this.physicsCollider.friction + '_density=' + this.physicsCollider.density);
        this.rigidbody.applyForceToCenter(cc.v2((-this.curDirection) * this.force, 0), this.rigidbody.getWorldCenter());
        this.rigidbody.linearVelocity = cc.v2((-this.curDirection) * this.moveSpeed, 0); //默认面向右
        console.log("__enemy_crawl_anima_speed:" + this.rigidbody.linearVelocity.x);
    },

    onLoad: function () {
        this.anim = this.node.getComponent(cc.Animation);
        this.animState = this.anim.play('mucus'); //animation clip loop
        var speed = this.animState.speed;
        this.animState.speed = 0.15;
        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.physicsCollider = this.node.getComponent(cc.PhysicsBoxCollider);
    },

    update: function (dt) {
        if (!this.dead()) {
            this.rigidbody.applyForceToCenter(cc.v2((-this.curDirection) * this.force, 0), this.rigidbody.getWorldCenter());
            this.rigidbody.linearVelocity = cc.v2((-this.curDirection) * this.moveSpeed, 0); //默认面向右
        }
        // console.log("__enemy_crawl_anima_speed:" + this.rigidbody.linearVelocity.x);
    },
    //刚体碰撞组件回调
    //只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == 'stone_pillar_1' || otherCollider.node.name == 'wooden_pile_thron_1') {
            //todo 改变方向
            this.curDirection = -this.curDirection;
            console.log("__enemy_direction_change =" + this.curDirection + '_colliderNodeName=' + otherCollider.node.name);
            this.node.scaleX = this.curDirection;
            this.rigidbody.applyForceToCenter(cc.v2((-this.curDirection) * this.force, 0), this.rigidbody.getWorldCenter());
            this.rigidbody.linearVelocity = cc.v2((-this.curDirection) * this.moveSpeed, 0);

        } else if (otherCollider.node.name == 'role') {
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
        // console.log("_role_contact_preSolve..");
        // var manifold = contact.getManifold();
        // var localPoints = manifold.points;
        // for (var i = 0; i < localPoints.length; i++) {
        //     console.log('xxx_local_point[' + i + ']=' + '(' + localPoints[i].localPoint.x + ',' + localPoints[i].localPoint.y + ')');
        // }
        // var worldManifold = contact.getWorldManifold();
        // var worldPoints = worldManifold.points;
        // for (var i = 0; i < worldPoints.length; i++) {
        //     console.log('xxx_wrold_point[' + i + ']=' + '(' + worldPoints[i].x + ',' + worldPoints[i].y + ')');
        // }
    },
    //每次处理完碰撞体接触逻辑时被调用
    onPostContact: function (contact, selfCollider, otherCollider) {

    },
    //只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
        // if (otherCollider.node.name != 'role' && otherCollider.node.name != 'ground') {
        //     console.log("__endContact");
        //     this.isColliding = false;
        // }
    }
});
