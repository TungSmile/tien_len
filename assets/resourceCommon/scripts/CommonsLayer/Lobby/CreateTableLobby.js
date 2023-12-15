
var Linker = require('Linker');
var Utils = require('Utils');
var LobbySend = require('LobbySend');
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        cash: cc.Label,
        slider: cc.Slider,
        spriteMoney: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
    },
    onEnable: function () {
        // this.minBet = 500;
        var minMoney = this.getMinBet();
        if (minMoney) {
            this.minBet = minMoney;
            this.cash.string = this.minBet;
            Utils.Malicious.getCoinFrame(Linker.MoneyTypeSpriteFrame, function (err, data) {
                if (!err) {
                    Linker.MoneyTypeSpriteFrame = data;
                    var coinFrame = (Number(cc.Global.moneyType) == 1) ? Linker.MoneyTypeSpriteFrame.Quan : Linker.MoneyTypeSpriteFrame.Xu;
                    if (coinFrame) {
                        this.spriteMoney.spriteFrame = coinFrame;
                    }
                }
            }.bind(this));
            Utils.Malicious.setColorMoney(this.cash.node);
            var betArray = this.getBetArray();
            if (betArray.length > 0) {
                for (let i = 0; i < betArray.length; i++) {
                    if (betArray[i] == this.minBet) {
                        this.slider.progress = i / betArray.length;
                    }
                }
            }
        }
    },
    getMinBet: function () {
        if (Linker && Linker.Lobby.CurrentBetting) {
            if (Linker.Lobby.CurrentBetting < 0 && Linker.Lobby.minBet) {
                return Linker.Lobby.minBet;
            }
            return Linker.Lobby.CurrentBetting;

        } else if (Linker.tableData && Array.isArray(Linker.tableData) && Linker.tableData.length > 0) {
            var listBet = this.getBetArray();
            if (listBet) {
                if (listBet.length > 0) {
                    return listBet[0]
                }
            }

        }
        return null;
    },
    closeBtnClick() {
        NewAudioManager.playClick();
        this.node.active = false;
    },
    huyBtn() {
        NewAudioManager.playClick();
        this.node.active = false;
    },
    taoBanBtn() {
        NewAudioManager.playClick();
        this.node.active = false;
        var money;
        if (Number(cc.Global.moneyType) == 1) {
            money = Number(Linker.userData.userRealMoney);
        } else {
            money = Number(Linker.userData.userMoney);
        }

        if (Number(this.minBet) * 1 <= money) {
            var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_YEU_CAU_TAO_BAN_CHOI, true);
            customEvent.tableData = { firstCashBet: Number(this.minBet) };
            customEvent.isReconnect = false;
            customEvent.isCreate = true;
            customEvent.isJoin = false;
            this.node.dispatchEvent(customEvent);
            this.onBtnCloseClick();
        } else {
            cc.Global.showMessage(i18n.t("Bạn không đủ tiền để tạo phòng"));
        }
    },
    tangBtn() {
        if (this.slider.progress <= 0.9) {
            this.slider.progress += 0.1;
        } else {
            this.slider.progress = 1;
        }
        this.updateMinBet();

    },
    giamBtn() {
        if (this.slider.progress >= 0.1) {
            this.slider.progress -= 0.1;
        } else {
            this.slider.progress = 0
        }
        this.updateMinBet();
    },
    onSlider(slider) {
        this.updateMinBet();
    },
    getBetArray: function () {
        if (Linker.tableData) {
            var listBet = [];
            for (var i = 0; i < Linker.tableData.length; i++) {
                var infoRoom = Linker.tableData[i];
                var money = Number(infoRoom.firstCashBet);
                if (listBet.indexOf(money) == -1) {
                    listBet.push(money);
                }
            }
            listBet.sort((a, b) => a - b);
            return listBet;
        }
        return [];
    },
    updateMinBet() {
        var progress = this.slider.progress;
        var betArray = this.getBetArray();
        if (betArray.length > 0) {
            var averageValue = 1 / betArray.length;
            var checkProgress = 0;
            for (let i = 0; i < betArray.length; i++) {
                if (progress > checkProgress && progress < (checkProgress + averageValue)) {
                    this.minBet = betArray[i];
                    break;
                }
                checkProgress += averageValue;
            }
            this.cash.string = Utils.Malicious.moneyWithFormat(this.minBet, ".");
        }

    },
    onBtnCloseClick: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_DONG_POPUP_THEO_TOGGLE, true);
        customEvent.toggle = this.node.getComponent(cc.Toggle);
        this.node.dispatchEvent(customEvent);
    }
});
