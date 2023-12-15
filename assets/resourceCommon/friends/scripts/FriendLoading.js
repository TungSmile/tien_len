cc.Class({
    extends: cc.Component,

    properties: {
       labelLoadingNode: cc.Node
    },
    onLoad() {
        this.scheduleOnce(function () {
            if (this && this.node.isValid) {
                this.removeFromContent();
            }
        }, 5);
    },
    setString: function(str){
        this.labelLoadingNode.active = true;
        this.labelLoadingNode.getComponent(cc.Label).string = str;
    },
    removeFromContent: function () {
        this.node.runAction(
            cc.sequence(
                cc.fadeOut(0.5),
                cc.removeSelf()
            )
        )
    },

    // update (dt) {},
});
