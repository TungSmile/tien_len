var Linker = require("Linker");
var Utils = require("Utils");
var LobbySend = require("LobbySend");
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        avatarLeft: cc.Sprite,
        namePlayerLeft: cc.Label,
        avatarRight: cc.Sprite,
        namePlayerRight: cc.Label,
        bet: cc.Label,
        time: cc.Label,
        avatarAtlas: cc.SpriteAtlas,
        buttonCancle: cc.Button,
        buttonGhepDoi: cc.Button,
        findingPlayer: cc.Node
    },
    onEnable: function () {
        this.unshowContinueGhepDoi();
        if (Linker && Linker.userData) {
            this.setMyPlyerInfo(Linker.userData);
        }
    },
    ctor() {
        this.betMoney = 0;
    },
    onLoad: function () {
        this.addSocketEvent();
    },
    onDestroy: function () {
        this.removeSocketEvent();
    },
    addSocketEvent: function () {
        Linker.Event.addEventListener(12021, this.OnMatchMakingResponse, this);
    },
    removeSocketEvent: function () {
        Linker.Event.removeEventListener(12021, this.OnMatchMakingResponse, this);
    },
    unshowContinueGhepDoi: function () {
        if (this.buttonGhepDoi && cc.isValid(this.buttonGhepDoi)) {
            this.buttonGhepDoi.node.active = false;
            this.buttonGhepDoi.interactable = false;
        }

    },
    showContinueGhepDoi: function () {
        if (this.buttonGhepDoi && cc.isValid(this.buttonGhepDoi)) {
            this.buttonGhepDoi.node.active = true;
            this.buttonGhepDoi.interactable = true;
        }
    },
    stopRunningPlayer: function () {
        if (this.findingPlayer && cc.isValid(this.findingPlayer)) {
            var findingPlayerComponent = this.findingPlayer.getComponent("FindingPlayer");
            if (findingPlayerComponent) {
                findingPlayerComponent.stopFindingAnimation();
            }
        }
    },
    startRunningPlayer: function () {
        if (this.findingPlayer && cc.isValid(this.findingPlayer)) {
            var findingPlayerComponent = this.findingPlayer.getComponent("FindingPlayer");
            if (findingPlayerComponent) {
                findingPlayerComponent.runFindingAnimation();
            }
        }
    },
    closeGhepDoi: function () {
        if (this && cc.isValid(this) && this.node && cc.isValid(this.node)) {
            this.node.removeFromParent(true);
        }
        // var scrollCard = Linker.ScrollCard;
        // if (scrollCard && cc.isValid(scrollCard)) {
        //     scrollCard.block = false;
        // }
    },
    OnMatchMakingResponse: function (message) {
        if (this && cc.isValid(this)) {
            if (message && message.status == 1) {
                if (Number(message.type) == 1) { // 1 = dang tim || 0 = khong thay || -1 = dang tim, khong tim nua!
                    // cc.Global.showMessage(i18n.t("Đang tìm đối thủ, vui lòng chờ..."));
                } else if (Number(message.type) == 0) {

                } else if (Number(message.type) == -1) {
                    // cc.Global.showMessage(i18n.t("Đang tìm đối thủ, vui lòng chờ trong giây lát..."));
                } else if (Number(message.type) == -2) { // Không hủy đc

                } else if (Number(message.type) == 2) { // Đang hủy, vui lòng chờ

                } else if (Number(message.type) == 3) { // Hủy thành công
                    this.unschedule(this.timeOutNotification);
                    // cc.Global.showMessage(i18n.t("cancle_matching_success"));
                    // this.closeGhepDoi();
                } else if (Number(message.type) == -4) {
                    this.unschedule(this.timeOutNotification);
                    this.stopRunningPlayer();
                    this.showContinueGhepDoi();
                    cc.Global.showMessage(i18n.t("you_are_not_money_enough"));
                }
            } else {
                //xử lý như nào nhỉ nếu lỗi
                // this.closeGhepDoi();
            }
        }
    },
    // update (dt) {},
    initInfoTable: function (data) {
        if (data) {
            // money: 500
            // userId: "243047"
            // zoneID: 47
            this.setBetMatch(data.money);
            this.betMoney = data.money;
        }
        this.time.node.active = false;
    },
    getAvatarRight: function () {
        return this.avatarRight;
    },
    setBetMatch: function (money) {
        this.bet.string = Utils.Malicious.moneyWithFormat(money, ".");
    },
    setMyPlyerInfo(data) {
        this.namePlayerLeft.string = data.displayName;
        this.avatarLeft.spriteFrame = this.getAvatarSpriteFrame(data.avatar);
    },
    setInfoOtherPlayer: function (data) {
        if (data.length) {
            for (var i = 0; i < data.length; ++i) {
                if (data[i].userId == Linker.userData.userId) {
                    continue;
                } else {
                    this.namePlayerRight.string = data[i].viewName;
                }
            }
        } else {
            this.namePlayerRight.string = data.viewName;
        }
    },
    getAvatarSpriteFrame(id) {
        if (id == "no_image.gif") {
            id = 1;
        }
        var name = `avatar (${id})`;
        return this.avatarAtlas.getSpriteFrame(name);
    },

    clickHuyGhepDoi(event) {
        var data = LobbySend.requestGhepDoi(Linker.userData.userId, Linker.ZONE, this.betMoney, true);
        if (data) {
            Linker.Socket.send(data);
        }
        this.closeGhepDoi();
    },
    timeOutNotification: function () {
        if (this && cc.isValid(this) && this.node && cc.isValid(this.node)) {
            this.stopRunningPlayer();
            this.showContinueGhepDoi();
            if ((!Linker.CURRENT_TABLE) || (Linker.CURRENT_TABLE && isNaN(Number(Linker.CURRENT_TABLE.tableId)) == false && Number(Linker.CURRENT_TABLE.tableId) == 0)) {
                cc.Global.showMessage(i18n.t("game_invite_busy"));
            }
        }

    },
    yeuCauGhepDoi: function () {
        this.startRunningPlayer();
        this.unshowContinueGhepDoi();

        var data = LobbySend.requestGhepDoi(Linker.userData.userId, Linker.ZONE, this.betMoney);
        if (data) {
            Linker.Socket.send(data);
        }
        this.unschedule(this.timeOutNotification);
        this.scheduleOnce(this.timeOutNotification, 15);//15s tu dong huy
    }
});