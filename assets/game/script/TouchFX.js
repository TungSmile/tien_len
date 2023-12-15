
cc.Class({
    extends: cc.Component,

    properties: {
        prefabTouchFx: [cc.Prefab],
        spriteTouchFx: [cc.SpriteFrame]
    },

    ctor() {
        this.touchFxPool = new cc.NodePool();
        this.touchCount = 0;
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.OnTouchStart, this, true);
        for (let index = 0; index < this.prefabTouchFx.length; index++) {
            try {
                var touchFx = cc.instantiate(this.prefabTouchFx[index]);
                touchFx.active = false;
                this.touchFxPool.put(touchFx);
            } catch(e) {

            }
        }
    },

    // update (dt) {},

    OnTouchStart(event) {
        var touchPos = event.getLocation();
        var nodePos = this.node.convertToNodeSpaceAR(touchPos);
        var touchFx = cc.instantiate(this.prefabTouchFx[0]);
        if (touchFx) {
            touchFx.active = true;
            var self = this;
            this.node.addChild(touchFx);
            touchFx.position = nodePos;
            try {
                var length = this.spriteTouchFx.length;
                touchFx.getComponent("itemTouchFx").RunAnimation(this.spriteTouchFx[this.touchCount % length]);
            } catch (error) {
                console.log(error);
            }

            // cc.tween(touchFx).set({opacity: 255}).blink(0.5, 0.75, {easing: "smooth"}).call((target) => {
            //     self.touchFxPool.put(target);
            // }).start();
        }
        this.touchCount++;
    }
});
