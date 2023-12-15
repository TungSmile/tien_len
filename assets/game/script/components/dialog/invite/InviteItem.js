var NewAudioManager = require("NewAudioManager");
var Linker = require('Linker');
var Utils = require('Utils');
var Constant = require('Constant');
var CommonSend = require('CommonSend');
cc.Class({
    extends: cc.Component,

    properties: {
        pos: cc.Label,
        playerName: cc.Label,
        money: cc.Label,
        playerBusyContainer: cc.Node,
        playerWaitingContainer: cc.Node,
        iconCoinSprite: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    init(data) {
        this.data = null;
        if (data) {
            // Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, data) {
            //     if (!err) {
            //         Linker.MoneyTypeSpriteFrame = data;
            //         var coinFrame = (Number(cc.Global.moneyType) == 1) ? Linker.MoneyTypeSpriteFrame.Quan : Linker.MoneyTypeSpriteFrame.Xu;
            //         if (coinFrame) {
            //             this.iconCoinSprite.spriteFrame = coinFrame;
            //         }
            //     }
            // }.bind(this));
            this.data = data;
            this.pos.string = data.pos + "";
            this.playerName.string = Utils.Malicious.formatNameData(data.playerName);
            this.money.string = Utils.Number.format(data.money);
            this.showWaiting();
        } else {
            this.showBusy();
        }
    },
    showBusy: function () {
        this.playerBusyContainer.active = true;
        this.playerWaitingContainer.active = false;
    },
    showWaiting: function () {
        this.playerBusyContainer.active = false;
        this.playerWaitingContainer.active = true;
    },
    inviteBtnClick() {
        NewAudioManager.playClick();
        if (this.data) {
            var userId = this.data.userId;
            var tableId = Linker.CURRENT_TABLE.tableId;
            if (userId && tableId) {
                var send = CommonSend.sendInviteRequest(tableId, userId);
                Linker.Socket.send(send);
            }
        }
        this.node.destroy();
        this.node.removeFromParent(true);
    }

    // update (dt) {},
});
