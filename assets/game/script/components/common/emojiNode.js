cc.Class({
    extends: cc.Component,

    properties: {
        anchorNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if(this.anchorNode && cc.isValid(this.anchorNode)){
            this.node.position = this.anchorNode.position;
        }
    },

    // update (dt) {},
});
