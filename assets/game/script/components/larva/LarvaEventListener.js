var Linker = require('Linker');
var Utils = require('Utils');
var SlotSend = require('SlotSend');
var NewAudioManager = require('NewAudioManager');
var GameConstant = require('GameConstant');
var i18n = require('i18n');

cc.Class({
    extends: cc.Component,

    properties: {
        btn100: cc.Node,
        btn1000: cc.Node,
        btn10000: cc.Node,
        btn_choithu: cc.Node,
        btn_tuquay: cc.Node,
        btn_sieutoc: cc.Node,
        btn_spriteFrame: [cc.SpriteFrame]
    },


    onLoad() {
        Linker.LarvaEventListener = this;
        this.tryMode = false;
    },

    start() {},
    onDestroy() {
        this.removeSocketEvent();
    },
    onEnable() {
        Linker.LarvaController.isFinish = true;
        this.addSocketEvent();
    },
    onDisable() {
        this.removeSocketEvent();
    },
    onButtonClick(event) {
        var name = event.target.name;
        NewAudioManager.playClick();
        switch (name) {
            case "btn_quay": {
                Linker.LarvaController.spinBtnClick();
                break;
            }
            case "btn_tuquay": {
                if (Linker.LarvaController.isAutoSpin) {
                    Linker.LarvaController.isAutoSpin = false;
                    // this.btn_tuquay.getChildByName('Background').getComponent(cc.Sprite).spriteFrame = this.btn_spriteFrame[0];
                    this.btn_tuquay.getChildByName('glow2').active = false;
                } else {
                    Linker.LarvaController.isAutoSpin = true;
                    // this.btn_tuquay.getChildByName('Background').getComponent(cc.Sprite).spriteFrame = this.btn_spriteFrame[1];
                    this.btn_tuquay.getChildByName('glow2').active = true;
                    Linker.LarvaController.spinBtnClick();
                }
                break;
            }
            case "btn_sieutoc": {
                if (Linker.LarvaController.quickSpin) {
                    Linker.LarvaController.quickSpin = false;
                    // this.btn_sieutoc.getChildByName('Background').getComponent(cc.Sprite).spriteFrame = this.btn_spriteFrame[0];
                    this.btn_sieutoc.getChildByName('glow1').active = false;
                } else {
                    Linker.LarvaController.quickSpin = true;
                    // this.btn_sieutoc.getChildByName('Background').getComponent(cc.Sprite).spriteFrame = this.btn_spriteFrame[1];
                    this.btn_sieutoc.getChildByName('glow1').active = true;
                }
                break;
            }
            case "btn_bang_thuong": {
                Linker.LarvaView.showWinBonusDialog(true);
                break;
            }

            case "btn_thele": {
                Linker.LarvaView.showWinBonusDialog(true);
                break;
            }
            case "btn_vinhdanh": {
                Linker.LarvaController.updateRank();
                Linker.LarvaView.showRankJackPotDialog(true);
                break;
            }
            case "btn_lichsu": {
                Linker.LarvaController.updateHistory();
                Linker.LarvaView.showHistoryJackPotDialog(true);
                break;
            }
            case "btn_close_bonus": {
                Linker.LarvaView.showWinBonusDialog(false);
                break;
            }
            case "btn_close_rank": {
                Linker.LarvaView.showRankJackPotDialog(false);
                break;
            }
            case "btn_close_history": {
                Linker.LarvaView.showHistoryJackPotDialog(false);
                break;
            }
            case "btn_close": {
                Linker.isOpenLarva = false;
                this.node.active = false;
                break;
            }
            case "btn_10000": {
                Linker.LarvaController.initGame({
                    userMoney: Linker.userData.userMoney,
                    moneyPerLine: 10000,
                    currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu3,
                    typeChoi: 1,
                    typeHu: 3
                });
                Linker.LarvaController.isAutoSpin = false;
                // this.btn_tuquay.getChildByName('Background').getComponent(cc.Sprite).spriteFrame = this.btn_spriteFrame[0];
                this.btn_tuquay.getChildByName('glow2').active = false;
                Linker.LarvaController.animateValue(Linker.LarvaView.textCurrentPlotMoney, Linker.LarvaView.textCurrentPlotMoney.value, Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu3, 2);
                this.btn1000.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
                this.btn100.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
                //this.btn_choithu.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
                this.btn10000.getChildByName('Background').color = new cc.Color(255, 255, 255, 255);

                break;
            }
            case "btn_1000": {
                Linker.LarvaController.initGame({
                    userMoney: Linker.userData.userMoney,
                    moneyPerLine: 1000,
                    currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu2,
                    typeChoi: 1,
                    typeHu: 2
                });
                Linker.LarvaController.isAutoSpin = false;
                this.btn_tuquay.getChildByName('glow2').active = false;
                // this.btn_tuquay.getChildByName('Background').getComponent(cc.Sprite).spriteFrame = this.btn_spriteFrame[0];
                Linker.LarvaController.animateValue(Linker.LarvaView.textCurrentPlotMoney, Linker.LarvaView.textCurrentPlotMoney.value, Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu2, 2);
                this.btn10000.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
                //this.btn_choithu.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
                this.btn100.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
                this.btn1000.getChildByName('Background').color = new cc.Color(255, 255, 255, 255);
                break;
            }
            case "btn_100": {
                Linker.LarvaController.initGame({
                    userMoney: Linker.userData.userMoney,
                    moneyPerLine: 100,
                    currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu1,
                    typeChoi: 1,
                    typeHu: 1
                });
                Linker.LarvaController.isAutoSpin = false;
                this.btn_tuquay.getChildByName('glow2').active = false;
                // this.btn_tuquay.getChildByName('Background').getComponent(cc.Sprite).spriteFrame = this.btn_spriteFrame[0];
                Linker.LarvaController.animateValue(Linker.LarvaView.textCurrentPlotMoney, Linker.LarvaView.textCurrentPlotMoney.value, Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu1, 2);
                this.btn10000.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
                //this.btn_choithu.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
                this.btn1000.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
                this.btn100.getChildByName('Background').color = new cc.Color(255, 255, 255, 255);
                break;
            }
            case "btn_choithu": {
                Linker.LarvaController.isAutoSpin = false;
                this.btn_tuquay.getChildByName('glow2').active = false;
                // this.btn_tuquay.getChildByName('Background').getComponent(cc.Sprite).spriteFrame = this.btn_spriteFrame[0];
                if (this.tryMode) {
                    this.tryMode = false;
                    this.btn_choithu.getChildByName('Background').getChildByName('text').getComponent(cc.Label).string = i18n.t("minigame_btn_money");
                    this.btn1000.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
                    this.btn100.getChildByName('Background').color = new cc.Color(255, 255, 255, 255);
                    this.btn10000.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
                    this.btn100.active = true;
                    this.btn1000.active = true;
                    this.btn10000.active = true;
                    Linker.LarvaController.initGame({
                        userMoney: Linker.userData.userMoney,
                        moneyPerLine: 100,
                        currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu1,
                        typeChoi: 1,
                        typeHu: 1
                    });
                } else {
                    this.tryMode = true;
                    this.btn_choithu.getChildByName('Background').getChildByName('text').getComponent(cc.Label).string = i18n.t("minigame_btn_test");
                    Linker.LarvaController.initGame({
                        userMoney: Linker.userData.userMoney,
                        moneyPerLine: 100,
                        currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu1,
                        typeChoi: 0,
                        typeHu: 1
                    });
                    Linker.LarvaController.animateValue(Linker.LarvaView.textCurrentPlotMoney, Linker.LarvaView.textCurrentPlotMoney.value, Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu1, 2);
                    this.btn100.active = false;
                    this.btn1000.active = false;
                    this.btn10000.active = false;
                    //this.btn_choithu.getChildByName('Background').color = new cc.Color(255, 255, 255, 255);

                }

                break;
            }

        }

    },
    addSocketEvent() {
        Linker.Event.addEventListener(10051, Linker.LarvaController.onSpinResponse);
        Linker.Event.addEventListener(1004, Linker.LarvaController.onUpdateSlotInfo);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(10051, Linker.LarvaController.onSpinResponse);
        Linker.Event.removeEventListener(1004, Linker.LarvaController.onUpdateSlotInfo);
    },
    onToogleAuto(toogle) {
        if (toogle.isChecked) {
            Linker.LarvaController.isAutoSpin = true;
            Linker.LarvaController.spinBtnClick();
        } else {
            Linker.LarvaController.isAutoSpin = false;
        }
        //cc.log(toogle.isChecked);
    }


    // update (dt) {},
});