cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad: function () {

    },
    onEnable: function () {
        var canvas = cc.find("Canvas");
        this.node.opacity = 0;
        var _wiget = this.node.getComponent(cc.Widget);
        if (!_wiget || (_wiget && !cc.isValid(_wiget))) {
            _wiget = this.node.addComponent(cc.Widget);
        }
        _wiget.enabled = true;
        _wiget.isAlignLeft = true;
        _wiget.isAlignRight = true;
        _wiget.isAlignTop = true;
        _wiget.isAlignBottom = true;
        // _wiget.target = canvas;
        _wiget.top = 0;
        _wiget.bottom = 0;
        _wiget.left = 0;
        _wiget.right = 0;
        this.node.setScale(0, 0);
        var seq = cc.sequence(
            cc.spawn(
                cc.scaleTo(0.2, 1).easing(cc.easeBackOut(0.1)),
                cc.fadeIn(0.2)
            )
        )
        this.node.runAction(seq);
    }
});
