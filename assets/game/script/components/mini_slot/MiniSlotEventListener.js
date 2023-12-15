// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Linker = require('Linker');
var Global = require('Global');
var NewAudioManager = require('NewAudioManager');
var GameConstant = require('GameConstant');
var Api = require('Api');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.MiniSlotEventListener = this;
        this.cuocLevels = [0, 1, 2, 3]; //total 3 cuoc levels
        this.moneyPerLines = [0, 100, 1000, 10000]; //total 3 muc tien thuong
        this.targetContent = 1;
    },

    start() {
        //  this.addSocketEvent();
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onEnable() {
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
                Linker.MiniSlotController.spinBtnClick();
                break;
            }
            case "btn_bang_thuong": {
                Linker.MiniSlotView.showWinBonusDialog(true);
                //cc.log(name);
                break;
            }

            case "btn_dong": {
                Linker.MiniSlotView.showLineDialog(true);
                //cc.log(name);
                break;
            }
            case "btn_close": {
                this.node.active = false;
                break;
            }
            case "btn_loaichoi": {
                if (Linker.MiniSlotController.typeChoi != 2) {
                    if (Linker.MiniSlotController.typeChoi == 0) {
                        Linker.MiniSlotController.typeChoi = 1;
                    } else {
                        Linker.MiniSlotController.typeChoi = 0;
                    }
                    Linker.MiniSlotView.updateTypeChoi(Linker.MiniSlotController.typeChoi);
                    //cc.log(name);
                }

                break;
            }
            case "btn_lichsu": {
                Api.get(Global.configPurchase.API_URL + "api-hu-rong-history?slot="+GameConstant.IDHUSLOT.idMiniSlot777, (data) => {
                    if (data) {
                        //cc.log('Data ***',data);
                        Linker.MiniSlotView.updateHistoryJackpot(data.array);
                    }

                });
                Linker.MiniSlotView.showHistoryJackPotDialog(true);
                //cc.log(name);
                break;
            }
            case "btn_lichsuchoi": {
                Linker.MiniSlotView.showHistoryGameDialog(true);
                //cc.log(name);
                break;
            }
            case "btn_close_lichsu": {
                Linker.MiniSlotView.showHistoryGameDialog(false);
                //cc.log(name);
                break;
            }
            case "btn_close_bonus": {
                Linker.MiniSlotView.showWinBonusDialog(false);
                //cc.log(name);
                break;
            }
            case "btn_close_history": {
                Linker.MiniSlotView.showHistoryJackPotDialog(false);
                //cc.log(name);

                break;
            }
            case "btn_close_line": {
                Linker.MiniSlotController.lineChoiString = Linker.MiniSlotController.getLineChoiString(Linker.MiniSlotController.getListLineChoiFromToogle(Linker.MiniSlotView.listLine.children));
                Linker.MiniSlotView.updateNumberLine(Linker.MiniSlotController.lineChoiArray.length);
                Linker.MiniSlotView.showLineDialog(false);
                //cc.log(name);
                break;
            }
            case "btn_le": {
                Linker.MiniSlotView.listLine.children.forEach((element, pos) => {
                    if ((pos + 1) % 2 == 0) {
                        element.getComponent(cc.Toggle).isChecked = true;
                    } else {
                        element.getComponent(cc.Toggle).isChecked = false;
                    }

                });
                Linker.MiniSlotController.lineChoiString = Linker.MiniSlotController.getLineChoiString(Linker.MiniSlotController.getListLineChoiFromToogle(Linker.MiniSlotView.listLine.children));
                Linker.MiniSlotView.updateNumberLine(Linker.MiniSlotController.lineChoiArray.length);
                //cc.log(name);
                break;
            }
            case "btn_chan": {
                Linker.MiniSlotView.listLine.children.forEach((element, pos) => {
                    if ((pos + 1) % 2 == 0) {
                        element.getComponent(cc.Toggle).isChecked = false;
                    } else {
                        element.getComponent(cc.Toggle).isChecked = true;
                    }
                });
                Linker.MiniSlotController.lineChoiString = Linker.MiniSlotController.getLineChoiString(Linker.MiniSlotController.getListLineChoiFromToogle(Linker.MiniSlotView.listLine.children));
                Linker.MiniSlotView.updateNumberLine(Linker.MiniSlotController.lineChoiArray.length);

                //cc.log(name);
                break;
            }
            case "btn_tatca": {
                Linker.MiniSlotView.listLine.children.forEach(element => {
                    element.getComponent(cc.Toggle).isChecked = false;
                });
                Linker.MiniSlotController.lineChoiString = Linker.MiniSlotController.getLineChoiString(Linker.MiniSlotController.getListLineChoiFromToogle(Linker.MiniSlotView.listLine.children));
                Linker.MiniSlotView.updateNumberLine(Linker.MiniSlotController.lineChoiArray.length);
                //cc.log(name);
                break;
            }
            case "btn_bochon": {
                Linker.MiniSlotView.listLine.children.forEach(element => {
                    element.getComponent(cc.Toggle).isChecked = true;
                });
                Linker.MiniSlotController.lineChoiString = Linker.MiniSlotController.getLineChoiString(Linker.MiniSlotController.getListLineChoiFromToogle(Linker.MiniSlotView.listLine.children));
                Linker.MiniSlotView.updateNumberLine(Linker.MiniSlotController.lineChoiArray.length);
                //cc.log(name);
                break;
            }

            case "btn_100": {
                var currentTypeHu = Linker.MiniSlotController.typeHu;
                if (currentTypeHu !== 1) {
                    this.setLevelBet(this.cuocLevels.indexOf(1));
                }
                break;
            }

            case "btn_1k": {
                var currentTypeHu = Linker.MiniSlotController.typeHu;
                if (currentTypeHu !== 2) {
                    this.setLevelBet(this.cuocLevels.indexOf(2));
                }
                break;
            }

            case "btn_10k": {
                var currentTypeHu = Linker.MiniSlotController.typeHu;
                if (currentTypeHu !== 3) {
                    this.setLevelBet(this.cuocLevels.indexOf(3));
                }
                break;
            }

            case "btn_next": {
                var content = Linker.MiniSlotView.contentHuongDan;

                if (1 <= this.targetContent && this.targetContent < content.length) {
                    this.targetContent += 1;
                    Linker.MiniSlotView.btnBack.opacity = 255;
                    for (var i = 1; i <= content.length; i++) {
                        if (i == this.targetContent) {
                            content[i - 1].active = true;
                        } else {
                            content[i - 1].active = false;
                        }
                    }
                    if (this.targetContent == content.length) {
                        Linker.MiniSlotView.btnNext.opacity = 100;
                    }
                } else {
                    Linker.MiniSlotView.btnNext.opacity = 100;
                }
                break;
            }

            case "btn_back": {
                var content = Linker.MiniSlotView.contentHuongDan;

                if (1 < this.targetContent && this.targetContent <= content.length) {
                    this.targetContent -= 1;
                    Linker.MiniSlotView.btnNext.opacity = 255;
                    for (var i = 1; i <= content.length; i++) {
                        if (i == this.targetContent) {
                            content[i - 1].active = true;
                        } else {
                            content[i - 1].active = false;
                        }
                    }
                    if (this.targetContent == 1) {
                        Linker.MiniSlotView.btnBack.opacity = 100;
                    }
                } else {
                    Linker.MiniSlotView.btnBack.opacity = 100;
                }
                break;
            }
        }

    },
    setLevelBet: function (type) {
        Linker.MiniSlotController.moneyPerLine = this.moneyPerLines[type];
        Linker.MiniSlotController.typeHu = this.cuocLevels[type];
        Linker.MiniSlotView.updateCurrentPotMoney(Linker.MiniSlotController.typeHu);
        Linker.MiniSlotView.updateTypeBtnCuoc(Linker.MiniSlotController.typeHu);
    },
    addSocketEvent() {
        Linker.Event.addEventListener(701, Linker.MiniSlotController.onSpinResponse);
        Linker.Event.addEventListener(1005, Linker.MiniSlotController.onSpinResponse);
        Linker.Event.addEventListener(1004, Linker.MiniSlotController.onUpdateSlotInfo);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(701, Linker.MiniSlotController.onSpinResponse);
        Linker.Event.removeEventListener(1005, Linker.MiniSlotController.onSpinResponse);
        Linker.Event.removeEventListener(1004, Linker.MiniSlotController.onUpdateSlotInfo);
    },
    onToogleAuto(toogle) {
        if (toogle.isChecked) {
            Linker.MiniSlotController.isAutoSpin = true;
            Linker.MiniSlotController.spinBtnClick();
        } else {
            Linker.MiniSlotController.isAutoSpin = false;
        }
        //cc.log(toogle.isChecked);
    },

    // update (dt) {},
});