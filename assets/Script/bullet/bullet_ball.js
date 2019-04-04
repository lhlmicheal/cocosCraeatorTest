var utils = require("gameUtil");
cc.Class({
    extends: cc.Component,

    properties: {
        moveSpeed: 0,
        curDrection: -1,//取决于主角发射方向。
        impulseHorizonStartV: 0, //水平冲量速度。
        impulseRestitutionV: 0, //垂直方向冲量起始速度,手动指定最大弹跳冲量。不至于从二层坠落到一层，起跳高度仍反弹到二层。
        power: 0, //杀伤力。
        firePos: new cc.v2(0, 0),
    },
    //调整反弹系数
    adjustRestitutionByVelocityY: function (vy) {
        var fator = (Math.abs(vy) / this.impulseRestitutionV).toFixed(2);
        console.log('_adjustRestitutionFactor:' + fator);
        if (0 < fator && fator <= 1) {
            fator = 1;
        } else if (1 < fator && fator < 1.5) {
            fator = 0.8;
        } else if (1.5 <= fator && fator < 2) {
            fator = 0.6;
        } else if (2 <= fator && fator < 4) {
            fator = 0.4;
        }
        console.log('_adjustRestitutionFactor_2:' + fator);
        return fator;
    },

    setData: function (data) {
        console.log("_bullet_ball_setData");
        this.curDrection = data.direction;
        this.power = data.power;
        this.firePos = data.startPos;
        this.node.setPosition(this.firePos.x, this.firePos.y);
        // console.log("_bulletSetData:curDirection=" + this.curDrection + '_power=' + this.power + '_firePos(' + this.firePos.x + ',' + this.firePos.y + ")");
        // console.log("_bulletSetData:impulseStarV=" + this.impulseHorizonStartV);
        // var impulse = cc.v2(this.curDrection * this.impulseStartV, 0);
        // this.rigidbody.applyLinearImpulse(impulse, this.rigidbody.getWorldCenter());
    },

    onLoad: function () {
        this.anim = this.node.getComponent(cc.Animation);
        this.animState = this.anim.play('bullet_ball'); //animation clip loop
        var speed = this.animState.speed;
        this.animState.speed = 0.2;
        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.physicsCollider = this.node.getComponent(cc.PhysicsBoxCollider);
    },

    start: function () {
        //根据发射方向，设置一个水平冲量.

        var impulse = cc.v2(this.curDrection * this.impulseHorizonStartV, 0);
        this.rigidbody.applyLinearImpulse(impulse, this.rigidbody.getWorldCenter());
    },

    update: function (dt) {
        if (utils.outOfView(this.node.getPosition()))
            this.node.removeFromParent();
    },

    //刚体碰撞组件回调
    //只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log("__bullet_contact_begin");
        //子弹与那些碰撞体有效。与哪些无效。
        if (otherCollider.node.name != 'ground' &&
            otherCollider.node.name != 'role' &&
            otherCollider.node.name != 'hanging_slab_1') { //消失
            cc.audioEngine.play(this.jumpAudio, false, 2);
            this.node.removeFromParent();
        }
    },
    //每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
        var speedVec = this.rigidbody.linearVelocity;
        // console.log("_onPreSolveSpeedY" + speedVec.y + '_maxVV=' + this.impulseRestitutionV);
        contact.setRestitution(this.adjustRestitutionByVelocityY(speedVec.y));
    },
    //每次处理完碰撞体接触逻辑时被调用
    onPostContact: function (contact, selfCollider, otherCollider) {

    },
    //只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {

    },
});
