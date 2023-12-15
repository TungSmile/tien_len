// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        money: cc.Label,
        parrentNode: cc.Node
    },
    onLoad () {
        this.configDispatchEvent();
    },
    configDispatchEvent: function () {
        this.eventDispatcher = new cc.Event.EventCustom("EVENT_SELECT_MONEY_FROM_HINT_ITEM", true);
    },
    dispatchEventCustom: function(){
        this.parrentNode.dispatchEvent(this.eventDispatcher);
    },
    start () {

    },
    setMoneyValue: function(money){
        this.money.string = money;
    },
    getMoneyValue: function(){
        return this.money.string;
    }
    // update (dt) {},
});
