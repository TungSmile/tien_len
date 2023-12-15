var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        gamePrefabBtn: [cc.Prefab],
        gameBtnContentContainer: cc.Node,
        isSlotGameTab: false
    },
    onEnable: function () {
        if (this.isSlotGameTab) {
            for(var i = 0; i< this.gameBtnContentContainer.children.length; i++){
                var slotBtnGame = this.gameBtnContentContainer.children[i];
                var slotBtnGameComponent = slotBtnGame.getComponent("ButtonGameSlot");
                if(slotBtnGameComponent){
                    slotBtnGameComponent.updateSlotMoneyWhenEnable();
                }
            }
        }   
    },
    // LIFE-CYCLE CALLBACKS:
    getAllBtnGame: function () {
        return this.gameBtnContentContainer;
    },
    initListButtonGame: function () {
        this.gameBtnContentContainer.removeAllChildren(true);
        for (var i = 0; i < this.gamePrefabBtn.length; i++) {
            var gameBtn = cc.instantiate(this.gamePrefabBtn[i]);
            this.gameBtnContentContainer.addChild(gameBtn);
        }
    },
    start() {

    },

    // update (dt) {},
});
