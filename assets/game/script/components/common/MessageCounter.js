var Linker = require('Linker');
var Utils = require('Utils');
var Constant = require('Constant');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        newMessageLabel: cc.Label,
        newMessageNode: cc.Node
    },
    start() {
        this.resetUI();
        this.addSocketListener();
    },
    onChatResponse: function (message) {
        if (message.status == 1) {
            this.counter += 1;
            this.playNewMessageSound();
            if (this.counter > 0) {
                this.enableCounterNode(true);
            } else {
                this.enableCounterNode(false);
            }
            this.setCounterLabel(this.counter);
        }
    },
    playNewMessageSound: function () {
        var bundleName;
        var bundleSceneNameObj = Utils.Malicious.getBundleNameAndSceneNameByZoneId(Linker.ZONE);
        if (bundleSceneNameObj) {
            bundleName = bundleSceneNameObj.bundleName;
        }
        if (bundleName) {
            var filePath = NewAudioManager.SOUND_GAME.SOCCER_GALAXY.COMMON.NEW_MESSAGE_IN_GAME;
            NewAudioManager.playAudioClipFX(filePath, 1, false, false, bundleName);
        }
    },
    resetUI: function () {
        this.enableCounterNode(false);
        this.resetCounter();
    },
    enableCounterNode: function (enable) {
        this.newMessageNode.active = enable ? true : false;
        this.newMessageNode.stopAllActions();
        this.newMessageNode.opacity = 255;
        this.newMessageNode.setScale(1, 1);
        if (this.counter > 0) {
            this.newMessageNode.opacity = 0;
            this.newMessageNode.setScale(0, 0);
            this.newMessageNode.runAction(cc.repeatForever(
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
            ));
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
        this.newMessageLabel.string = str;
    },
    addSocketListener: function () {
        Linker.Event.addEventListener(Constant.CMD.CHAT, this.onChatResponse, this);
    },
    removeSocketListener: function () {
        Linker.Event.removeEventListener(Constant.CMD.CHAT, this.onChatResponse, this);
    },
    onDestroy: function () {
        this.removeSocketListener();
    }
    // update (dt) {},
});
