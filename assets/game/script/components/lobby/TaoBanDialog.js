
var Linker = require('Linker');
var Utils = require('Utils');
var LobbySend = require('LobbySend');
var i18n = require('i18n');
var DataAccess = require('DataAccess');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        cash: cc.RichText,
        slider: cc.Slider,
        textMinCash : cc.Label,
        spriteMoney: cc.Sprite,
        spriteFrameMoney: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //self.node.active = false;
        }, this);
        
    },

    start() {

    },
    onEnable: function () {

        // this.minBet = 500;
        this.minBet = !!Linker.valueBet && Linker.valueBet != -1 ? Linker.valueBet : Linker.betCreateTable[0];
        this.textMinCash.string = Utils.Malicious.moneyWithFormat(this.minBet, ".");
        // this.stopPropagationOnBackdrop = Utils.Node.stopPropagation(this.backdrop);
        this.node.stopAllActions();
        this.node.setScale(0.3);
        this.node.runAction(cc.spawn([cc.scaleTo(0.3, 1).easing(cc.easeBackOut()), cc.fadeIn(0.3)]));
        if (cc.Global.bidaMoneyType == 0) {
            this.cash.string = "<color=#07acff>" + Utils.Malicious.moneyWithFormat(DataAccess.Instance.userData.userMoney, ".") + "</c>";
        } else {
            this.cash.string = "<color=#ffff00>" + Utils.Malicious.moneyWithFormat(DataAccess.Instance.userData.userRealMoney, ".") + "</c>";
        }
        this.spriteMoney.spriteFrame = this.spriteFrameMoney[cc.Global.bidaMoneyType];


        var arrBet = Linker.betCreateTable;
        for (let i = 0; i < arrBet.length; i++) {
            if (arrBet[i] == this.minBet) {
                this.slider.progress = i / arrBet.length;
            }
        }

    },

    onDisable: function () {
        // if (this.stopPropagationOnBackdrop) {
        //     this.stopPropagationOnBackdrop();
        //     this.stopPropagationOnBackdrop = null;
        // }
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
        if (cc.Global.bidaMoneyType == 1) {
            money = Number(DataAccess.Instance.userData.userRealMoney);
        } else {
            money = Number(DataAccess.Instance.userData.userMoney);
        }

        if (Number(this.minBet)*1 <= money) {
            cc.Global.showLoading();
            if (Linker.ZONE == 8 || Linker.ZONE == 84 || Linker.ZONE == 86) {
                var data = LobbySend.createTableRequest(0, 0, this.minBet, 0);
                Linker.Socket.send(data);
            }
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
            this.slider.progress  = 0
        }
        this.updateMinBet();
    },
    onSlider(slider) {
        cc.log("PROGRESS", slider.progress);
        this.updateMinBet();
    },
    updateSlider () {
        var progress = this.slider.progress;
        
    },
    updateMinBet() {
        // var progress = this.slider.progress;
        // cc.log(progress);
        // // cc.log(Linker.betCreateTable);
        // if (progress <= 0.1) {
        //     this.minBet = 500;
        // }
        // if (progress > 0.1 && progress <= 0.2) {
        //     this.minBet = 1000;
        // }
        // if (progress > 0.2 && progress <= 0.3) {
        //     this.minBet = 2000;
        // }
        // if (progress > 0.3 && progress <= 0.4) {
        //     this.minBet = 5000;
        // }
        // if (progress > 0.4 && progress <= 0.5) {
        //     this.minBet = 10000;
        // }
        // if (progress > 0.5 && progress <= 0.6) {
        //     this.minBet = 20000;
        // }
        // if (progress > 0.6 && progress <= 0.7) {
        //     this.minBet = 50000;
        // }
        // if (progress > 0.7 && progress <= 0.8) {
        //     this.minBet = 100000;
        // }
        // if (progress > 0.8 && progress <= 0.9) {
        //     this.minBet = 200000;
        // }
        // if (progress > 0.9) {
        //     this.minBet = 500000;
        // }
        // this.textMinCash.string = Utils.Malicious.moneyWithFormat(this.minBet, ".");

        //NEW

        var progress = this.slider.progress;
        var betArray = Linker.betCreateTable;
        var averageValue = 1 / betArray.length;
        var checkProgress = 0;
        for (let i = 0; i < betArray.length; i++) {
            if (progress > checkProgress && progress < (checkProgress + averageValue)) {
                this.minBet = betArray[i];
                break;
            }
            checkProgress += averageValue;
        }
        this.textMinCash.string = Utils.Malicious.moneyWithFormat(this.minBet, ".");
    }
    

    // update (dt) {},
});
