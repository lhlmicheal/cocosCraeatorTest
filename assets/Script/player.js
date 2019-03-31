var game = require("macroDefine");

cc.Class({
    extends: cc.Component,

    properties: {
        curDirection: 1, //1正向方向, -1反方向
        upPressed: false, //是否按下跳跃键

        jumpHeight: 0,
        jumpDuration: 0,
        jumpCounts: 0,
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },

        moveSpeed: 0,
        accel_backword: false,
        accel_forword: false,
    },
    //调整方向
    resetDirection: function (dire) {
        if (this.curDirection != dire) {
            this.curDirection = dire;
            this.node.scaleX = this.curDirection;
        }
    },
    //判断状态是否是站立状态，速度为0，不太准确。当处于悬空最高点时速度也可能是0
    isHanging: function () {
        return (this.rigidbody.linearVelocity.y != 0);
    },

    isFalling: function () {
        return (this.rigidbody.linearVelocity.y < 0);
    },
    // 连跳冲量(向上)加成系数,(为了保持平衡，有如下规则)
    // 向上跳跃是，速度越大，加成系数越小。下落时，速度越大，连跳加成系数越大
    getContinuousJumpFactor: function () {
        var vy = this.rigidbody.linearVelocity.y;
        var factor = 1;
        var v = Math.abs(vy);
        if (0 <= v && v <= 10) {
            factor *= 0.8;
        } else if (10 < v && v <= 200) {
            factor *= 0.6;
        } else if (200 < v && v <= 500) {
            factor *= 0.4;
        } else if (500 < v && v <= 1000) {
            factor *= 0.2;
        } else {
            factor *= 0;
        }
        if (this.isFalling())
            factor = 1 - factor;
        return factor;
    },

    jump: function () {
        var velocity = this.rigidbody.linearVelocity;
        var impuleFactor = this.getContinuousJumpFactor();
        console.log("xxx_jumpAction_vY=" + velocity.y + "_impuleFactor=" + impuleFactor);
        var impulse = cc.v2(0, 3600 * impuleFactor);
        cc.audioEngine.play(this.jumpAudio, false, 2);
        this.rigidbody.applyLinearImpulse(impulse, this.rigidbody.getWorldCenter());
    },

    checkMoveStatue: function (status) {
        var direction = this.curDirection;
        switch (status) {
            case game.PLAYER_STATE.HORIZON_FORWARD_MOVING:
                this.accel_backword = false;
                this.accel_forword = true;
                direction = 1;
                break;
            case game.PLAYER_STATE.HORIZON_BACKWARD_MOVING:
                this.accel_backword = true;
                this.accel_forword = false;
                direction = -1;
                break;
            case game.PLAYER_STATE.STAND_STILL:
                this.accel_backword = false;
                this.accel_forword = false;
                break;
            case game.PLAYER_STATE.HANGING:
                if (this.jumpLeftCount > 0 && !this.upPressed) {
                    this.jumpLeftCount--;
                    this.upPressed = true;
                    this.jump();
                }
                break;
            default:
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
            case game.PLAYER_STATE.HANGING:
                this.upPressed = false;
                break;
            default:
                break;
        }
    },

    moveAction: function (frameSpeed) {
        var hanging = this.isHanging();
        var adjustFactor = hanging ? 25 : 50;
        if (!hanging)
            this.jumpLeftCount = this.jumpCounts;

        var perVelocity = this.rigidbody.linearVelocity;

        if (this.accel_forword) {
            this.rigidbody.linearVelocity = cc.v2(frameSpeed * adjustFactor, perVelocity.y);
        } else if (this.accel_backword) {
            this.rigidbody.linearVelocity = cc.v2(-frameSpeed * adjustFactor, perVelocity.y);
        }
    },

    start: function () {
        console.log('player__start');
    },

    onLoad: function () {
        this.anim = this.node.getComponent(cc.Animation);
        this.animState = this.anim.play('role_walk');
        cc.director.getPhysicsManager().gravity = cc.v2(0, -960);
        this.rigidbody = this.node.getComponent(cc.RigidBody);

        this.jumpLeftCount = this.jumpCounts;
        console.log("_player_onLoad: jumpleftCount=" + this.jumpLeftCount);
    },

    update: function (dt) {
        this.moveAction(this.moveSpeed * dt);
    },
    // 普通碰撞回调
    // onCollisionEnter: function (other, self) {
    //     console.log('onCollisionEnter...play');
    // },

    // onCollisionStay: function (other, self) {
    //     // console.log('onCollisionStay...play');
    // },

    // onCollisionExit: function (other, self) {
    //     // console.log('onCollisionExit...play');
    // },

    //刚体碰撞组件回调
    //只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log("__role_contact_begin");
        // if (otherCollider && otherCollider.node.name == 'role') {
        //     console.log('_role_get start');
        //     cc.audioEngine.play(this.score_audio, false, 2);
        //     customEvents.trigger(game.EVTS.STAR_COLLECT, [this.score_value]);
        //     this.node.removeFromParent();
        // }
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

    }
});
