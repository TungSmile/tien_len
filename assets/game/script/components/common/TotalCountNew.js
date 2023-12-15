var Linker = require('Linker');
var Utils = require('Utils');
var Constant = require('Constant');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        newTotalLabel: cc.Label,
        newTotalNode: cc.Node,
        counters: [cc.Label]
    },
    resetUI: function () {
        this.enableCounterNode(false);
        this.resetCounter();
    },
    enableCounterNode: function (enable) {
        this.newTotalNode.active = enable ? true : false;
        this.newTotalNode.opacity = 255;
        this.newTotalNode.setScale(1, 1);
        if (this.counter > 0) {
            this.newTotalNode.active = true;
            var ofx = this.newTotalNode.getActionByTag(Constant.TAG.action.COUNT_TOTAL_NEW);
            if (ofx && !ofx.isDone()) {
                // cc.error("Continue run action fade in/out new total count....");
            } else {
                this.newTotalNode.opacity = 0;
                this.newTotalNode.setScale(0, 0);
                this.newTotalNode.stopAllActions();
                var fx = cc.repeatForever(
                    cc.sequence(
                        cc.spawn(
                            cc.fadeTo(1, 100),
                            cc.scaleTo(1, 0.8)
                        ),
                        cc.spawn(
                            cc.fadeTo(1, 255),
                            cc.scaleTo(1, 1.0)
                        ),
                        cc.blink(2, 10),
                        cc.delayTime(2))
                );
                fx.setTag(Constant.TAG.action.COUNT_TOTAL_NEW);
                this.newTotalNode.runAction(fx);
            }
        } else {
            this.newTotalNode.stopAllActions();
            this.newTotalNode.active = false;
        }
    },
    resetCounter: function () {
        this.counter = 0;
        this.setCounterLabel();
    },
    setCounterLabel: function () {
        this.counter = Number(this.counter);
        if (isNaN(this.counter) == true) {
            this.counter = 0;
        }
        var str = "";
        if (this.counter > 0) {
            str = this.counter.toString();
        }
        this.newTotalLabel.string = str;
    },
    updateCounters: function () {
        this.counter = 0;
        for (var i = 0; i < this.counters.length; i++) {
            var strValue = Number(this.counters[i].string);
            strValue = isNaN(strValue) ? 0 : strValue;
            this.counter += strValue;
        }
        this.enableCounterNode();
        this.setCounterLabel();
    },
    update(dt) {
        this.updateCounters();
    },
});
