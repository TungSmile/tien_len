var soccerConstant = require('soccerConstant');
var Linker = require('Linker');
var Utils = require('Utils');
var Constant = require('Constant');
var GameConstant = require('GameConstant');
cc.Class({
    extends: cc.Component,

    properties: {
        idSlot: Number(GameConstant.IDHUSLOT.idThinhKinh),
        tienHu100Label: cc.Label,
        tienHu1kLabel: cc.Label,
        tienHu10kLabel: cc.Label
    },
    onLoad() {
        this.addSocketEvent();
        this.resetSlotMoney();
        this.initSlotMoney(true);
    },
    resetSlotMoney: function () {
        this.tienHu100Label.string = 0;
        this.tienHu1kLabel.string = 0;
        this.tienHu10kLabel.string = 0;
    },
    initSlotMoney: function () {
        if (Linker.Hu) {
            Utils.Malicious.animateValue(this.tienHu100Label, Number(this.tienHu100Label.string.replace(/\./g, '')), Number(Linker.Hu.listHu[this.idSlot][0].moneyHu1), 2);
            Utils.Malicious.animateValue(this.tienHu1kLabel, Number(this.tienHu1kLabel.string.replace(/\./g, '')), Number(Linker.Hu.listHu[this.idSlot][0].moneyHu2), 2);
            Utils.Malicious.animateValue(this.tienHu10kLabel, Number(this.tienHu10kLabel.string.replace(/\./g, '')), Number(Linker.Hu.listHu[this.idSlot][0].moneyHu3), 2);
            Linker.HuTemp = Linker.Hu;
        }
    },
    updateSlotMoneyWhenEnable: function () {
        var runFromPercent = 25;//chay tu 25% neu hu khong thay doi gi
        var money = 0;
        var start = 0;
        var stop = 0;
        var duration = 0.5;
        if (runFromPercent && (runFromPercent > 0 && runFromPercent <= 100)) {
            //Đảm bảo rằng chạy animation từ 0-100%
            if (Linker.Hu && Linker.HuTemp) {
                if (Number(Linker.Hu.listHu[this.idSlot][0].moneyHu1) > Number(Linker.HuTemp.listHu[this.idSlot][0].moneyHu1)) {
                    Utils.Malicious.animateValue(this.tienHu100Label, Number(this.tienHu100Label.string.replace(/\./g, '')), Number(Linker.Hu.listHu[this.idSlot][0].moneyHu1), duration);
                } else {
                    money = Number(Linker.Hu.listHu[this.idSlot][0].moneyHu1);
                    if (isNaN(money) == false && money > 0) {
                        start = runFromPercent * money / 100;
                        stop = money;
                        Utils.Malicious.animateValue(this.tienHu100Label, start, stop, duration);
                    } else {
                        this.tienHu100Label.string = Utils.Malicious.custom_textForm(Linker.Hu.listHu[this.idSlot][0].moneyHu1);
                    }
                }
                if (Number(Linker.Hu.listHu[this.idSlot][0].moneyHu2) > Number(Linker.HuTemp.listHu[this.idSlot][0].moneyHu2)) {
                    Utils.Malicious.animateValue(this.tienHu1kLabel, Number(this.tienHu1kLabel.string.replace(/\./g, '')), Number(Linker.Hu.listHu[this.idSlot][0].moneyHu2), duration);
                } else {
                    money = Number(Linker.Hu.listHu[this.idSlot][0].moneyHu2);
                    if (isNaN(money) == false && money > 0) {
                        start = runFromPercent * money / 100;
                        stop = money;
                        Utils.Malicious.animateValue(this.tienHu1kLabel, start, stop, duration);
                    } else {
                        this.tienHu1kLabel.string = Utils.Malicious.custom_textForm(Linker.Hu.listHu[this.idSlot][0].moneyHu2);
                    }
                }
                if (Number(Linker.Hu.listHu[this.idSlot][0].moneyHu3) > Number(Linker.HuTemp.listHu[this.idSlot][0].moneyHu3)) {
                    Utils.Malicious.animateValue(this.tienHu10kLabel, Number(this.tienHu10kLabel.string.replace(/\./g, '')), Number(Linker.Hu.listHu[this.idSlot][0].moneyHu3), duration);
                } else {
                    money = Number(Linker.Hu.listHu[this.idSlot][0].moneyHu3);
                    if (isNaN(money) == false && money > 0) {
                        start = runFromPercent * money / 100;
                        stop = money;
                        Utils.Malicious.animateValue(this.tienHu10kLabel, start, stop, duration);
                    } else {
                        this.tienHu10kLabel.string = Utils.Malicious.custom_textForm(Linker.Hu.listHu[this.idSlot][0].moneyHu3);
                    }
                }
                Linker.HuTemp = Linker.Hu;
            }
        }
    },
    updateSlotMoney: function () {
        if (Linker.Hu && Linker.HuTemp) {
            if (Number(Linker.Hu.listHu[this.idSlot][0].moneyHu1) > Number(Linker.HuTemp.listHu[this.idSlot][0].moneyHu1)) {
                Utils.Malicious.animateValue(this.tienHu100Label, Number(this.tienHu100Label.string.replace(/\./g, '')), Number(Linker.Hu.listHu[this.idSlot][0].moneyHu1), 2);
            } else {
                this.tienHu100Label.string = Utils.Malicious.custom_textForm(Linker.Hu.listHu[this.idSlot][0].moneyHu1);
            }
            if (Number(Linker.Hu.listHu[this.idSlot][0].moneyHu2) > Number(Linker.HuTemp.listHu[this.idSlot][0].moneyHu2)) {
                Utils.Malicious.animateValue(this.tienHu1kLabel, Number(this.tienHu1kLabel.string.replace(/\./g, '')), Number(Linker.Hu.listHu[this.idSlot][0].moneyHu2), 2);
            } else {
                this.tienHu1kLabel.string = Utils.Malicious.custom_textForm(Linker.Hu.listHu[this.idSlot][0].moneyHu2);
            }
            if (Number(Linker.Hu.listHu[this.idSlot][0].moneyHu3) > Number(Linker.HuTemp.listHu[this.idSlot][0].moneyHu3)) {
                Utils.Malicious.animateValue(this.tienHu10kLabel, Number(this.tienHu10kLabel.string.replace(/\./g, '')), Number(Linker.Hu.listHu[this.idSlot][0].moneyHu3), 2);
            } else {
                this.tienHu10kLabel.string = Utils.Malicious.custom_textForm(Linker.Hu.listHu[this.idSlot][0].moneyHu3);
            }
            Linker.HuTemp = Linker.Hu;
        }
    },
    removeEventSocket: function () {
        Linker.Event.removeEventListener(1004, this.onUpdateSlotInfo, this);
    },
    addSocketEvent: function () {
        Linker.Event.addEventListener(1004, this.onUpdateSlotInfo, this);
    },
    onUpdateSlotInfo: function (message) {
        if (message && this && cc.isValid(this.node)) {
            this.updateSlotMoney();
        }
    },
    start() {

    },
    onDestroy: function () {
        this.removeEventSocket();
    }

    // update (dt) {},
});
