var Global = require("Global");
var TQUtil = require("TQUtil");
//var BasePopup = require("BasePopup");
var PopupFactory = require("PopupFactory");
//var NativeBridge = require("NativeBridge");
//var FacebookSDK = require("FacebookSDK");
var Constant = require('Constant');
var Linker = require('Linker');
var BiDaSend = require('BiDaSend');

export var PopupPlayerInfo = cc.Class({
    //kyun:
    //extends: BasePopup,
    extends: cc.Component,
    properties: {
        txtRealMoney: cc.Label,
        txtXuMoney: cc.Label,
        txtTitleUS: cc.Label,
        txtUserName: cc.Label,
        txtViewName: cc.Label,
        txtID: cc.Label,
        txtLevel: cc.Label,
        ivAvatar: cc.Sprite,

        btnLog: cc.Button,
        btnActive: cc.Button,
        btnKick: cc.Node,
        fillSpriteTranThang: cc.ProgressBar,
        fillSpriteTranThua: cc.ProgressBar,
        rateTranThang: cc.Label,
        rateTranThua: cc.Label
    },

    onLoad: function () {
        cc.log('Loaded ?');
        //kyun:   
        Linker.PopupPlayerInfo = this;
        // Load avatar */
        this.targetPlayer = null;
    },
    onOpen() {
        cc.log('Linker.:', Linker.showInfoPlayer);
        this.txtID.string = Linker.showInfoPlayer.id;
        this.txtUserName.string = Linker.showInfoPlayer.name;
        this.txtViewName.string = Linker.showInfoPlayer.name;
        this.txtLevel.string = 0;
        this.txtRealMoney.string = TQUtil.addDot(Linker.showInfoPlayer.money);
    },
    onTouchBtnLog: function () {
        PopupFactory.openPopup(PopupFactory.Popup.HISTORY);
    },

    onTouchBtnActive: function () {
        if (cc.sys.isBrowser) {
            //kyun:
            //FacebookSDK.smsLogin();
        } else {
            //kyun:
            //NativeBridge.smsLogin();
        }
    },

    onTouchBtnLogoutFB: function () {},

    onChangeAvaClick() {},
    btnClose() {
        this.node.active = false;
        cc.log('Listen:', Linker.showInfoPlayer);
    },

    Open(avatar, TLMNPlayer) {
        this.node.active = true;
        this.targetPlayer = TLMNPlayer;
        this.txtRealMoney.string = TQUtil.abbreviate(Number(TLMNPlayer.player.userMoney));
        this.txtXuMoney.string = TQUtil.abbreviate(Number(TLMNPlayer.player.userMoneyXu));
        this.txtViewName.string = TLMNPlayer.player.viewName;
        this.txtID.string = TLMNPlayer.player.userId;

        if (Linker.userData.userId == TLMNPlayer.player.userId || !Linker.TLMNController.isMaster) {
            this.btnKick.active = false;
        } else {
            this.btnKick.active = true;
            Linker.TLMNController.KickID = TLMNPlayer.player.userId;
        }

        this.ivAvatar.spriteFrame = avatar;
        this.ShowGameHistory(TLMNPlayer.player);
    },

    SendGift(event, customEventData) {
        this.btnClose();
        Linker.TLMNController.player0.profileNode.active ? Linker.TLMNController.player0.SendGiftTo(this.targetPlayer, customEventData) :
            Linker.TLMNController.player4.SendGiftTo(this.targetPlayer, customEventData);

        var chatString = "13001, " + Linker.userData.userId + ", " + this.targetPlayer.player.userId + ", " + customEventData;
        var str = Constant.CMD.CHAT +
            Constant.SEPERATOR.N4 + Linker.CURRENT_TABLE.tableId +
            Constant.SEPERATOR.ELEMENT + chatString +
            Constant.SEPERATOR.ELEMENT + 0;

        cc.Canvas.instance.node.emit(1300, data);
        var data = BiDaSend.sendChatPrivate(str);
        Linker.Socket.send(data);
    },

    ShowGameHistory(player) {
        var totalPlay = 0;
        var totalWin = 0;
        var totalLose = 0;
        for (let index = 0; index < player.history.length; ++index) {
            totalWin += Number(player.history[index].win);
            totalLose += Number(player.history[index].lose);
        }
        totalPlay = totalWin + totalLose;
        if (totalPlay != 0) {
            this.fillSpriteTranThang.progress = totalWin / totalPlay;
            this.fillSpriteTranThua.progress = totalLose / totalPlay;
        } else {
            this.fillSpriteTranThang.progress = 0;
            
            this.fillSpriteTranThua.progress = 0;
        }

        this.rateTranThang.string = totalWin + "/" + totalPlay;
        this.rateTranThua.string = totalLose + "/" + totalPlay;
    }
});