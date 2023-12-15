var Linker = require("Linker");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onBtnAccept() {
        Linker.BonusTab.onClickAccept();
        this.node.destroy();
    },

    onBtnClose() {
        this.node.destroy();
    }
    // update (dt) {},
});
