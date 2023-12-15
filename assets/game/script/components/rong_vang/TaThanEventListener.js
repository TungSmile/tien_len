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
var Utils = require('Utils');
var SlotSend = require('SlotSend');
var NewAudioManager = require('NewAudioManager');
var GameConstant = require('GameConstant');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.TaThanEventListener = this;
        this.cuocLevels = [0, 1, 2, 3]; //total 3 cuoc levels
        this.moneyPerLines = [0, 100, 1000, 10000]; //total 3 muc tien thuong
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
                Linker.TaThanController.spinBtnClick();


                break;
            }
            case "btn_back_lobby": {
                // cc.director.loadScene("HallScene");
                this.node.active = false;
                // Linker.RongVang.active = false;
                // Linker.RongVang.position = cc.v2(3000, 3000);
                // this.musicData = Linker.Local.readUserData();
                // if (this.musicData) {
                //     if (this.musicData.isMusic) {
                //         NewAudioManager.audioIDBG = null;
                //         cc.audioEngine.stopAll();
                //         NewAudioManager.playBackground(NewAudioManager.sound.background);
                //     }
                // }
                // if (Linker.LongThan) {
                //     Linker.LongThan.active = false;
                // }
                // if (Linker.ThuyCung) {
                //     Linker.ThuyCung.active = false;
                // }
                // if (Linker.TayDuKy) {
                //     Linker.TayDuKy.active = false;
                // }
                //cc.log(name);
                break;
            }
            case "btn_bang_thuong": {
                Linker.TaThanView.showWinBonusDialog(true);
                //cc.log(name);
                break;
            }

            case "btn_dong": {
                Linker.TaThanView.showLineDialog(true);
                //cc.log(name);
                break;
            }
            case "btn_back_ingame": {
                Linker.TaThanView.showGamePlay(false);
                Linker.TaThanView.updateAllPotMoney();
                Linker.TaThanView.updateUserMoneyLobby();
                Linker.TaThanView.showLobby(true);
                //cc.log(name);
                break;
            }
            case "btn_loaichoi": {
                if (Linker.TaThanController.typeChoi != 2) {
                    if (Linker.TaThanController.typeChoi == 0) {
                        Linker.TaThanController.typeChoi = 1;
                    } else {
                        Linker.TaThanController.typeChoi = 0;
                    }
                    Linker.TaThanView.updateTypeChoi(Linker.TaThanController.typeChoi);
                    //cc.log(name);
                }

                break;
            }
            case "btn_lichsu": {
                Linker.TaThanView.showHistoryJackPotDialog(true);
                //cc.log(name);
                break;
            }
            case "btn_lichsuchoi": {
                Linker.TaThanView.showHistoryGameDialog(true);
                //cc.log(name);
                break;
            }
            case "btn_close_lichsu": {
                Linker.TaThanView.showHistoryGameDialog(false);
                //cc.log(name);
                break;
            }
            case "btn_close_bonus": {
                Linker.TaThanView.showWinBonusDialog(false);
                //cc.log(name);
                break;
            }
            case "btn_close_history": {
                Linker.TaThanView.showHistoryJackPotDialog(false);
                //cc.log(name);

                break;
            }
            case "btn_close_line": {
                Linker.TaThanController.lineChoiString = Linker.TaThanController.getLineChoiString(Linker.TaThanController.getListLineChoiFromToogle(Linker.TaThanView.listLine.children));
                Linker.TaThanView.updateNumberLine(Linker.TaThanController.lineChoiArray.length);
                Linker.TaThanView.showLineDialog(false);
                //cc.log(name);
                break;
            }
            case "btn_le": {
                Linker.TaThanView.listLine.children.forEach((element, pos) => {
                    if ((pos + 1) % 2 == 0) {
                        element.getComponent(cc.Toggle).isChecked = true;
                    } else {
                        element.getComponent(cc.Toggle).isChecked = false;
                    }

                });
                Linker.TaThanController.lineChoiString = Linker.TaThanController.getLineChoiString(Linker.TaThanController.getListLineChoiFromToogle(Linker.TaThanView.listLine.children));
                Linker.TaThanView.updateNumberLine(Linker.TaThanController.lineChoiArray.length);
                //cc.log(name);
                break;
            }
            case "btn_chan": {
                Linker.TaThanView.listLine.children.forEach((element, pos) => {
                    if ((pos + 1) % 2 == 0) {
                        element.getComponent(cc.Toggle).isChecked = false;
                    } else {
                        element.getComponent(cc.Toggle).isChecked = true;
                    }
                });
                Linker.TaThanController.lineChoiString = Linker.TaThanController.getLineChoiString(Linker.TaThanController.getListLineChoiFromToogle(Linker.TaThanView.listLine.children));
                Linker.TaThanView.updateNumberLine(Linker.TaThanController.lineChoiArray.length);

                //cc.log(name);
                break;
            }
            case "btn_tatca": {
                Linker.TaThanView.listLine.children.forEach(element => {
                    element.getComponent(cc.Toggle).isChecked = false;
                });
                Linker.TaThanController.lineChoiString = Linker.TaThanController.getLineChoiString(Linker.TaThanController.getListLineChoiFromToogle(Linker.TaThanView.listLine.children));
                Linker.TaThanView.updateNumberLine(Linker.TaThanController.lineChoiArray.length);
                //cc.log(name);
                break;
            }
            case "btn_bochon": {
                Linker.TaThanView.listLine.children.forEach(element => {
                    element.getComponent(cc.Toggle).isChecked = true;
                });
                Linker.TaThanController.lineChoiString = Linker.TaThanController.getLineChoiString(Linker.TaThanController.getListLineChoiFromToogle(Linker.TaThanView.listLine.children));
                Linker.TaThanView.updateNumberLine(Linker.TaThanController.lineChoiArray.length);
                //cc.log(name);
                break;
            }
            case "lobby_mienphi": {
                cc.log("vaoday lobby_mienphi");
                Linker.TaThanController.initGame({
                    userMoney: Linker.userData.userMoney,
                    moneyPerLine: 100,
                    currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idTaThan][0].moneyHu1,
                    typeChoi: 0,
                    typeHu: 1
                });
                Linker.TaThanView.showGamePlay(true);
                Linker.TaThanView.showLobby(false);
                //cc.log(name);
                break;
            }
            case "lobby_ngocthiem": {
                Linker.TaThanController.initGame({
                    userMoney: Linker.userData.userMoney,
                    moneyPerLine: 100,
                    currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idTaThan][0].moneyHu1,
                    typeChoi: 1,
                    typeHu: 1
                });
                Linker.TaThanView.showGamePlay(true);
                Linker.TaThanView.showLobby(false);
                //cc.log(name);
                break;
            }
            case "lobby_rongvang": {
                Linker.TaThanController.initGame({
                    userMoney: Linker.userData.userMoney,
                    moneyPerLine: 10000,
                    currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idTaThan][0].moneyHu3,
                    typeChoi: 1,
                    typeHu: 3
                });
                Linker.TaThanView.showGamePlay(true);
                Linker.TaThanView.showLobby(false);
                //cc.log(name);
                break;
            }
            case "lobby_meothantai": {
                Linker.TaThanController.initGame({
                    userMoney: Linker.userData.userMoney,
                    moneyPerLine: 1000,
                    currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idTaThan][0].moneyHu2,
                    typeChoi: 1,
                    typeHu: 2
                });
                Linker.TaThanView.showGamePlay(true);
                Linker.TaThanView.showLobby(false);
                //cc.log(name);
                break;
            }
            case "btn_cuoc": {
                //cc.log(name);
                if (Linker.TaThanController.typeHu == 1) {
                    Linker.TaThanController.typeHu = 2;
                    Linker.TaThanController.moneyPerLine = 1000;
                } else {
                    if (Linker.TaThanController.typeHu == 2) {
                        Linker.TaThanController.typeHu = 3;
                        Linker.TaThanController.moneyPerLine = 10000;
                    } else {
                        if (Linker.TaThanController.typeHu == 3) {
                            Linker.TaThanController.typeHu = 1;
                            Linker.TaThanController.moneyPerLine = 100;
                        }
                    }
                }
                Linker.TaThanView.updateCurrentPotMoney(Linker.TaThanController.typeHu);
                Linker.TaThanView.updateTypeMoney(Linker.TaThanController.typeHu);

                break;
            }

            case "btn_tang_muc_cuoc": {
                //check current cuoc level
                var currentTypeHu = Linker.TaThanController.typeHu;
                if (currentTypeHu >= 1 && currentTypeHu < 3) {
                    this.setLevelBet(this.cuocLevels.indexOf(currentTypeHu) + 1);
                } else {
                    this.setLevelBet(this.cuocLevels.indexOf(currentTypeHu));
                }
                break;
            }

            case "btn_giam_muc_cuoc": {
                //check current cuoc level
                var currentTypeHu = Linker.TaThanController.typeHu;
                if (currentTypeHu > 1 && currentTypeHu <= 3) {
                    this.setLevelBet(this.cuocLevels.indexOf(currentTypeHu) - 1);
                } else {
                    this.setLevelBet(this.cuocLevels.indexOf(currentTypeHu));
                }
                break;
            }
        }

    },
    setLevelBet: function (type) {
        Linker.TaThanController.moneyPerLine = this.moneyPerLines[type];
        Linker.TaThanController.typeHu = this.cuocLevels[type];
        Linker.TaThanView.updateCurrentPotMoney(Linker.TaThanController.typeHu);
        Linker.TaThanView.updateTypeMoney(Linker.TaThanController.typeHu);
    },
    addSocketEvent() {
        Linker.Event.addEventListener(1005, Linker.TaThanController.onSpinResponse);
        Linker.Event.addEventListener(1006, Linker.TaThanController.onLiXiResponse);
        Linker.Event.addEventListener(1004, Linker.TaThanController.onUpdateSlotInfo);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(1005, Linker.TaThanController.onSpinResponse);
        Linker.Event.removeEventListener(1006, Linker.TaThanController.onLiXiResponse);
        Linker.Event.removeEventListener(1004, Linker.TaThanController.onUpdateSlotInfo);
    },
    onToogleAuto(toogle) {
        if (toogle.isChecked) {
            Linker.TaThanController.isAutoSpin = true;
            Linker.TaThanController.spinBtnClick();
        } else {
            Linker.TaThanController.isAutoSpin = false;
        }
        //cc.log(toogle.isChecked);
    }


    // update (dt) {},
});