var Utils = require("Utils");
var Linker = require("Linker");
var Api = require('Api');
var TQUtil = require('TQUtil');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        layout_progress: cc.Node,
        progress: cc.Label,
        btn_receive: cc.Node,
        finish: cc.Node,
        description: cc.Label,
        money: cc.Node,
        moneyLabel: cc.Label,
        moneyIcon: cc.Sprite,
        // food: cc.Node,
        // foodIcon: cc.Sprite,
        moneyFrame: [cc.SpriteFrame]
    },

    onLoad () {
        this.btn_receive.active = false;
        this.finish.active = false;
        this.layout_progress.active = false;
    },

    start () {

    },

    init(data) {
        this.nameLabel.string = Utils.Malicious.getNameGameByZone(Number(data.zoneId));
        var isWin = (Number(data.isWin) == 1) ? " - " + i18n.t("title_win") : "";
        this.description.string = i18n.t("title_total_play") + ": " + data.condition + isWin;
        this.progress.string = data.current + "/" + data.condition;
        this.missionId = data.missionId;
        if (Number(data.received) == 1) {
            this.finish.active = true;
        } else {
            if (Number(data.current) >= Number(data.condition)) {
                this.btn_receive.active = true;
            } else {
                this.layout_progress.active = true;
            }
        }
        if (data.moneyType !== null) {
            this.money.active = true;
            this.moneyLabel.string = TQUtil.abbreviate(data.amountMoney);
            var frame = this.setMoneyFrame(Number(data.amountMoney));
            if (frame) {
                this.moneyIcon.spriteFrame = frame;
            }
        } else {
            this.money.active = false;
        }
        // if (data.foodId !== null) {
        //     this.food.active = true;
        //     var frame = cc.Global.foodFrames[Number(data.foodId) - 1];
        //     if (frame) {
        //         this.foodIcon.spriteFrame = frame;
        //     }
        // } else {
        //     this.food.active = false;
        // }
    },

    setMoneyFrame (money) {
        var frame = this.moneyFrame[0];
        if (money <= 30000) {
            frame = this.moneyFrame[0];
        } else if (money <= 50000) {
            frame = this.moneyFrame[1];
        } else if (money <= 100000) {
            frame = this.moneyFrame[2];
        } else if (money <= 200000) {
            frame = this.moneyFrame[3];
        } else if (money <= 500000) {
            frame = this.moneyFrame[4];
        }
        return frame;
    },

    activeFinish () {
        this.finish.active = true;
        this.btn_receive.active = false;
    },

    onButtonClick () {
        if (this.missionId && Linker.Mission) {
            Linker.Mission.sendApiCompleteMission(this);
        }
    },
    renderData(data){
        cc.error(data);
        //render ra giao dien
        this.description.string=data.current;
        this.progress.string = data.current + "/" + data.condition;
        this.moneyLabel.string =data.amountMoney;
        this.missionId=data.missionId;
       
    }


    // update (dt) {},
});
