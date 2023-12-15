var Linker = require("Linker");

cc.Class({
    extends: cc.Component,

    properties: {
 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onButtonClick(event) {
        Linker.BonusTab.onClickItemReward(event.target.data);
    }

    // update (dt) {},
});
