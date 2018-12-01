cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        moveSpeed: 0,
        accel: 0
    },

    runJumpAction: function () {
        var upAction = cc.moveBy(this.jumpDuration, 0, this.jumpHeight).easing(cc.easeSineOut());
        var downAction = cc.moveBy(this.jumpDuration, 0, -this.jumpHeight).easing(cc.easeSineIn());
        return cc.repeatForever(cc.sequence(upAction, downAction));
    },

    onLoad: function () {
        this.node.runAction(this.runJumpAction());
    },
    update: function (dt) { }
});
