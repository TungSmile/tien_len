var TQUtil = require('TQUtil');
var Global = require('Global');
var XocDiaSend = require('XocDiaSend');
var Linker = require('Linker');
var PopupFactory = require('PopupFactory');
cc.Class({
    extends: cc.Component,

    properties: {
        txtName: cc.Label,
        txtMoney: cc.Label,
        txtMoneyChange: cc.Node,
        ivAvatar: cc.Sprite,
        avatarList:  cc.SpriteAtlas
    },

    onLoad: function () {
        var nodeChat = cc.instantiate(Global.chatToast);
        nodeChat.parent = this.node;

        this.chatComp = nodeChat.getComponent(cc.Component);
        this.chatComp.positionY = this.node.getContentSize().height / 2;
    },

    onChatMessage: function (message, isLeft = false) {
        this.chatComp.onShow(message, isLeft);
        this.chatComp.positionX = this.node.getContentSize().width / 2;
    },

    reset() {
        this.node.active = false;
    },

    sendGetUserInfo() {
        XocDiaSend.sendGetUserInfo(this.player.id);
    },
    showInfo(){
        Linker.XocDiaScene.showPlayerInfo(this.player);
    },
    initData: function (idx, p) {
        this.pos = idx;
        this.player = p;

        this.node.active = true;

        this.txtName.string = TQUtil.trimUsername(p.name);
        this.txtMoney.string = TQUtil.addDot(p.money);
        cc.log('Init data',p);
        //load Avatar
        cc.log('*** avatar',p.avatar);
        if(p.avatar == "no_image.gif"){
            p.avatar = "1";
        }
        // this.ivAvatar.spriteFrame = this.listAvatar[(Number(p.avatar)-1).toString()];

      
        this.ivAvatar.spriteFrame  = this.avatarList.getSpriteFrame('avatar ('+p.avatar+')');
    },
    /*
    updateAva(ava) {
        this.player.avatar = ava;
        TQUtil.loadAvatar(this.ivAvatar, ava);
    },
    */

    updateRealMoney(moneyChange, currMoney) {
        this.animMoneyChange(currMoney);
        this.animMoneySlideDown(moneyChange);
    },

    updateMoney(money) {
        var moneyChange = money - this.player.money;
        this.setMoneyChange(moneyChange);
    },

    setMoneyChange: function (moneyChange) {
        this.animMoneyChange(this.player.money + moneyChange);
        this.animMoneySlideDown(moneyChange);
    },

    animMoneySlideDown(moneyChange) {
        if (moneyChange == 0) {
            return;
        }

        var node = this.txtMoneyChange;
        var labelTemp = cc.instantiate(node).getComponent(cc.Label);
        var strMoney = TQUtil.addDot(moneyChange);

        if (moneyChange > 0) {
            strMoney = "+" + strMoney;
        }
        else if (moneyChange < 0) {

        }

        labelTemp.string = strMoney;
        labelTemp.node.active = true;
        labelTemp.node.parent = this.node;
        labelTemp.node.runAction(
            cc.sequence(cc.moveBy(0.5, cc.v2(0.0, 65.0)),
                cc.delayTime(2),
                cc.callFunc(this.hideAnim.bind(this, labelTemp.node), this)));
    },

    hideAnim: function (labelTemp) {
        labelTemp.removeFromParent(true);
    },

    animMoneyChange: function (money) {
        var actionMove = [];
        var tempCurr = this.player.money;
        var moneyVenh = money - tempCurr;
        var moneyPerTen = Math.ceil(moneyVenh / 20.0);

        for (var i = 1; i <= 20; i++) {
            var moneyNew = tempCurr + (moneyPerTen * i);

            if (i == 20) {
                moneyNew = money;
            }

            var func = this.onMoneyChange.bind(this, moneyNew);
            var callbackText = cc.callFunc(func);

            actionMove.push(cc.delayTime(0.05));
            actionMove.push(callbackText);
        }

        this.txtMoney.node.runAction(cc.sequence(actionMove));
        this.player.money = money;
    },

    onMoneyChange: function (money) {
        this.txtMoney.string = TQUtil.addDot(money);
    },
});
