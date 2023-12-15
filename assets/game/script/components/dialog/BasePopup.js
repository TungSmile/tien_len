var PopupFactory = require("PopupFactory");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
    },

    onOpen: function () {
        this.fadeInContent();
    },

    fadeInContent: function () {
        this.node.scale = 0.4;
        this.node.opacity = 0;

        var scale = cc.scaleTo(0.3, 1);
        var fadeAct = cc.fadeTo(0.2, 255);

        var mySpawn = cc.spawn(scale.easing(cc.easeBackOut()), fadeAct);
        this.node.runAction(mySpawn);
    },

    fadeOutContent: function () {
        var scale = cc.scaleTo(0.15, 0.3);
        var fadeAct = cc.fadeTo(0.15, 0);

        var mySpawn = cc.spawn(scale, fadeAct);
        var callback = cc.callFunc(this.onClose, this);
        var seq = cc.sequence(mySpawn, callback);

        this.node.runAction(seq);
    },

    onClose: function () {
        this.node.active = false;
        PopupFactory.closePopup(this.node);
    },

    closePopup: function () {
        this.fadeOutContent();
    },

    onTouchCloseBtn: function () {
        this.closePopup();
    }
});
