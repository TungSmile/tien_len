cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        txtMessage: cc.Label
    },

    onLoad: function () {
        this.node.active = false;
    },

    onShow: function (message, isLeft) {
        this.node.active = true;
        this.node.opacity = 0;
        this.node.stopAllActions();

        this.txtMessage.string = message;
        //TODO get real size label
        // this.txtMessage._updateRenderData(true);
        // cc.log('size: ', this.txtMessage.node.width);

        var callback = cc.callFunc(this.onHided.bind(this));
        this.node.runAction(cc.sequence(cc.fadeIn(0.2), cc.delayTime(2.5), cc.fadeOut(0.2), callback));
    },

    onHided: function () {
        this.node.active = false;
    }
});
