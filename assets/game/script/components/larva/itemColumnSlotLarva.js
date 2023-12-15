// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        itemSlot: cc.Prefab,
        type: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (this.type === undefined || this.type === -1) {
            this.type = 0;
        }
        this.itemList = [];
        this.node.removeAllChildren();
        for (var i = 0; i < 25; i++) {
            var item = cc.instantiate(this.itemSlot);
            
            var temp=['A','B','C','D','E','W'];
            var id = Utils.Number.random(0, 6);

            if(this.type==1){
                temp=['X2','X3','X5','X10','X15'];
                id = Utils.Number.random(0, 5);
            }
            item.getComponent('itemSlotLarva').setType(this.type, temp[id]);
            this.node.addChild(item);
            this.itemList.push(item.getComponent('itemSlotLarva'));
        }
    },

    start() {

    },

    // update (dt) {},
});