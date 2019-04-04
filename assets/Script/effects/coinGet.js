cc.Class({
    extends: cc.Component,

    properties: {
        score: 0, //分值
        startPos: new cc.v2(0, 0),
        jumpHeight: 0, //弹出高度
    },

    setData: function (data) {
        // console.log("_coinGet_setData:" + JSON.stringify(data) + ' end');
        this.startPos = data.startPos;
        this.score = data.score;
        this.node.setPosition(this.startPos);
    },

    jumpAction: function () {
        var that = this;
        var hide = function () {
            that.node.removeFromParent();
        };
        var action = new cc.moveBy(0.5, cc.v2(0, this.jumpHeight));
        this.node.runAction(cc.sequence(action.easing(cc.easeOut(3.0)), cc.delayTime(0.8), cc.callFunc(hide)));
    },

    onLoad: function () {
        this.anim = this.node.getComponent(cc.Animation);
        this.animState = this.anim.play('effect_jump_coin'); //animation clip loop
    },

    start: function () {
        console.log("_coinGet_start");
        this.node.getChildByName("num").getComponent(cc.Label).string = '+' + this.score;
        this.jumpAction();
    },

    update: function (dt) {

    }
});
