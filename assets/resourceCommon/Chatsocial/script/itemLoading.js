cc.Class({
    extends: cc.Component,

    properties: {
        loadingIcon: cc.Node
    },
    onLoad () {
        this.loadingIcon.stopAllActions();
        this.loadingIcon.runAction(cc.repeatForever(cc.rotateBy(0.8, -360)));
    },

    start () {

    },

    // update (dt) {},
});
