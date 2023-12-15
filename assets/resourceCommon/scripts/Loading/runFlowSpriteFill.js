cc.Class({
    extends: cc.Component,

    properties: {
        spriteTarget: cc.Sprite,
        isRoting: true,
    },
    onLoad: function () {
        this.node.stopAllActions();
        if (this.isRoting) {
            this.node.runAction(cc.rotateBy(2, -360).repeatForever());
        }
    },
    update(dt) {
        if (this && cc.isValid(this)) {
            var a = new cc.Sprite();
            if (this.spriteTarget.type == cc.Sprite.Type.FILLED && this.spriteTarget.fillType == cc.Sprite.FillType.HORIZONTAL) {
                var fillRange = this.spriteTarget.fillRange;
                var width = this.spriteTarget.node.width;
                var height = this.spriteTarget.node.height;
                var pos = cc.v2(0, 0);
                pos.x = width * fillRange;
                pos.y = 0;
                this.node.position = pos;
            }
        }
    },
});
