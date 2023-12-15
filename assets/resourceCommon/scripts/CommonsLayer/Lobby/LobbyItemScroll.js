var Constant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        state: {
            type: Constant.stateItemLobby,
            default: Constant.stateItemLobby.OPEN
        },
        unSelectNode: cc.Node,
        unSelectBgNode: cc.Node,
        selectNode: cc.Node,
        selectBgNode: cc.Node,
        moneyLableNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        if (this.state == Constant.stateItemLobby.BLOCK) {
            this.selectBgNode.active = false;
            this.unSelectBgNode.active = false;
        } else {
            this.selectBgNode.active = true;
            this.unSelectBgNode.active = true;
        }
    },

    // update (dt) {},
});
