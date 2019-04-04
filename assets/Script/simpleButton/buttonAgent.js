var game = require("macroDefine");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        // var clickEventHandle = new cc.Component.EventHandler();
        // clickEventHandle.target = this.node;
        // clickEventHandler.component = "buttonAgent";//这个是代码文件名
        // clickEventHandler.handler = "callback";
        // clickEventHandler.customEventData = "foobar"; //根据具体情况填写

        // var button = node.getComponent(cc.Button);
        // button.clickEvents.push(clickEventHandler);
    },

    // callBack: function (event, customEventData) {
    //     var node = event.target; //获取事件的发送节点,EventData等于之前设置的'foobar'

    // },

    onBtnClick: function (event, customEventData) {
        console.log("_buttonAgent_onBtnClick:[" + customEventData + "]");
        if (customEventData == 'gameStart')
            cc.director.loadScene(game.SCENE_MODE.MAIN_SCENE, function () {
                console.log("_onScene_load_call_finished");
            });
    },

    onBtnClick2: function (event, customEventData) {

    },

    start: function () {

    },

    // update: function (dt) {

    // },
});
