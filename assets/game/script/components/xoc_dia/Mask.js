cc.Class({
    extends: cc.Node,

    properties: {
        sprite: cc.Sprite
    },

    ctor: function (isAllowTouch, layout) {
        this.layout = layout;

        if (isAllowTouch == undefined) {
            this.isAllowTouch = false;
        } else {
            this.isAllowTouch = isAllowTouch;
        }

        this.zIndex = -1;
        var deviceSize = cc.winSize;

        var self = this;
        self.sprite = self.addComponent(cc.Sprite);

        cc.resources.load("login/theblack_overlay", cc.SpriteFrame, function (err, spriteFrame) {
            self.sprite.spriteFrame = spriteFrame;
            self.sprite.node.setScale(deviceSize.width / self.sprite.node.getContentSize().width,
                deviceSize.height / self.sprite.node.getContentSize().height);

            self.onEventEnable();
        });
    },

    onDisable: function () {
        this.off(cc.Node.EventType.TOUCH_START);
        this.off(cc.Node.EventType.TOUCH_MOVE);
        this.off(cc.Node.EventType.MOUSE_DOWN);
        this.off(cc.Node.EventType.MOUSE_MOVE);
        this.off(cc.Node.EventType.MOUSE_UP);
        this.off(cc.Node.EventType.MOUSE_WHEEL);
    },

    onEventEnable: function () {
        var self = this;
        this.sprite.node.opacity = 150;

        this.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (self.isAllowTouch) {
                self.onEventDisable();
            }
            event.stopPropagation();
        });
        this.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            event.stopPropagation();
        });
        this.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            event.stopPropagation();
        });
        this.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            event.stopPropagation();
        });
        this.on(cc.Node.EventType.MOUSE_UP, function (event) {
            event.stopPropagation();
        });
        this.on(cc.Node.EventType.MOUSE_WHEEL, function (event) {
            event.stopPropagation();
        });
    },

    onEventDisable: function () {
        this.sprite.node.opacity = 50;
        if (this.layout != undefined) {
            this.layout.opacity = 150;
        }

        this.off(cc.Node.EventType.TOUCH_START);
        this.off(cc.Node.EventType.TOUCH_MOVE);
        this.off(cc.Node.EventType.MOUSE_DOWN);
        this.off(cc.Node.EventType.MOUSE_MOVE);
        this.off(cc.Node.EventType.MOUSE_UP);
        this.off(cc.Node.EventType.MOUSE_WHEEL);
    }
});
