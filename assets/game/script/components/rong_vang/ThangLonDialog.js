// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        textMoney: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.node.active = false;
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            self.node.emit('fade-out');
        }, this);
    },

    start () {

    },
    updateView(money) {
        this.textMoney.string = Utils.Number.format(money);
        //cc.log("TEST_TEST");
    },
    
    onDisable() {
        //this.node.emit('fade-out');
    },
    onEnable() {
        var self = this;
        this.node.emit('fade-in');
        // this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
        //     self.node.emit('fade-out');
        // })))
    }

    // update (dt) {},
});
