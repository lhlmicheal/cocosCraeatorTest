//事件分发类
/**
 * 1,负责事件的注册，注销
 * 2,负责事件广播
 * ***/
var CustomEventDispatch = cc.Class({
    extends: cc.Event,
    name: 'CustomEventDispatch',
    properties: {
        _events: [cc.String]
    },

    //注册事件
    listen: function (evt, call, target) {
        if (!this._events[evt]) {
            this._events[evt] = [];
            this._events[evt].push({
                callFunc: call,
                calltarget: target
            });
        } else {
            for (var element in this._events[evt]) {
                if (element && element.callFunc == call && element.calltarget == target) {
                    element.callFunc = call;
                    element.calltarget = target;
                    return;
                }
            }
        }
    },

    //注销事件
    ignore: function (evt, call, target) {
        if (this._events[evt]) {
            for (var element in this._events[evt]) {
                if (element && element.callFunc == call && element.calltarget == target) {
                    this._events[evt].remove(element);
                    return;
                }
            }
        }
    },

    //触发事件
    trigger: function (evt, params) {
        // console.log('xxx_eventCustom_trigger[evt]=' + evt);
        var args = Array.prototype.slice.call(params, 0);
        if (this._events[evt] && this._events[evt].length > 0) {
            for (var element in this._events[evt]) {
                if (this._events[evt][element].callFunc && this._events[evt][element].calltarget) {
                    this._events[evt][element].callFunc.apply(this._events[evt][element].calltarget, args);
                }
            }
        }
    }
});

module.exports = new CustomEventDispatch();