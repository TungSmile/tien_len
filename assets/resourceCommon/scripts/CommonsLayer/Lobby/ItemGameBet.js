var DataAccess = require('DataAccess');
var Utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
        select: cc.Node,
        moneyPrize: cc.Label,
        countPlayerOnline: cc.Label,
        buttonImg: cc.Sprite,
        icon: cc.Sprite,
        gameInfo: cc.Sprite,
        numPlayerOnline: cc.Label,
        moneyEntryLabel: cc.Label,
        lockNode: cc.Node,
        level: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    setEntryMoneyRoom: function (money) {
        if(money){
            money = money.toString();
            money = money.replace(/\D+/g, '');
            var entryMoney = Number(money) * 6;
            if (this.moneyEntryLabel) {
                this.moneyEntryLabel.string = entryMoney;
            }
        }
        
    },
    // update (dt) {},

    setMoney: function (money) {
        this.moneyPrize.string = money;
        this.setEntryMoneyRoom(money);
    },
    setPlayerOnline: function (count) {
        if (count) {
            this.countPlayerOnline.string = count;
        }
    },
    setLevelAccess: function (str) {
        if (str && this.level) {
            this.level.node.parent.active = true;
            this.level.string = str;
        } else {
            this.level.node.parent.active = false;
        }
    },
    setButtonImg: function (frame) {
        if (frame) this.buttonImg.spriteFrame = frame;
    },
    setIcon: function (frame) {
        if (frame) this.icon.spriteFrame = frame;
    },
    setGameInfo: function (frame) {
        if (frame) this.gameInfo.spriteFrame = frame;
    },
    setNumberPlayerOnline: function (num) {
        this.numPlayerOnline.string = num;
    },
    setLock(isLock = true) {
        if (isLock) {
            this.lockNode.active = true;
        } else {
            this.lockNode.active = false;
        }
    }
});
