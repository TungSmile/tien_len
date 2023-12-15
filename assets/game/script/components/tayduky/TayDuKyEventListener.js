var Constant = require('Constant');
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
        Linker.TayDuKyEventListener = this;

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
                Linker.TayDuKyController.spinBtnClick();


                break;
            }
            case "btn_back_lobby": {
                // cc.director.loadScene("HallScene");
                var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.REQUEST_CANVAS_ENABLE_CHILD_BY_NAME, true);
                customEvent.nameChild = Utils.Malicious.getPortalGameName();
                customEvent.enableChild = true;
                this.node.dispatchEvent(customEvent);
                this.node.active = false;
                // Linker.TayDuKy.active = false;
                // Linker.TayDuKy.position = cc.v2(3000, 3000);
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
                // if (Linker.RongVang) {
                //     Linker.RongVang.active = false;
                // }
                //cc.log(name);
                break;
            }
            case "btn_bang_thuong": {
                Linker.TayDuKyView.showWinBonusDialog(true);
                //cc.log(name);
                break;
            }

            case "btn_dong": {
                Linker.TayDuKyView.showLineDialog(true);
                //cc.log(name);
                break;
            }
            case "btn_back_ingame": {
                Linker.TayDuKyView.showGamePlay(false);
                Linker.TayDuKyView.updateAllPotMoney();
                Linker.TayDuKyView.updateUserMoneyLobby();
                Linker.TayDuKyView.showLobby(true);
                //cc.log(name);
                break;
            }
            case "btn_loaichoi": {
                if (Linker.TayDuKyController.typeChoi != 2) {
                    if (Linker.TayDuKyController.typeChoi == 0) {
                        Linker.TayDuKyController.typeChoi = 1;
                    } else {
                        Linker.TayDuKyController.typeChoi = 0;
                    }
                    Linker.TayDuKyView.updateTypeChoi(Linker.TayDuKyController.typeChoi);
                    //cc.log(name);
                }

                break;
            }
            case "btn_lichsu": {
                Linker.TayDuKyView.showHistoryJackPotDialog(true);
                //cc.log(name);
                break;
            }
            case "btn_lichsuchoi": {
                Linker.TayDuKyView.showHistoryGameDialog(true);
                //cc.log(name);
                break;
            }
            case "btn_close_bonus": {
                Linker.TayDuKyView.showWinBonusDialog(false);
                //cc.log(name);
                break;
            }
            case "btn_close_history": {
                Linker.TayDuKyView.showHistoryJackPotDialog(false);
                //cc.log(name);

                break;
            }
            case "btn_close_lichsu": {
                Linker.TayDuKyView.showHistoryGameDialog(false);
                //cc.log(name);

                break;
            }
            case "btn_close_line": {
                Linker.TayDuKyController.lineChoiString = Linker.TayDuKyController.getLineChoiString(Linker.TayDuKyController.getListLineChoiFromToogle(Linker.TayDuKyView.listLine.children));
                Linker.TayDuKyView.updateNumberLine(Linker.TayDuKyController.lineChoiArray.length);
                Linker.TayDuKyView.showLineDialog(false);
                //cc.log(name);
                break;
            }
            case "btn_le": {
                Linker.TayDuKyView.listLine.children.forEach((element, pos) => {
                    if ((pos + 1) % 2 == 0) {
                        element.getComponent(cc.Toggle).isChecked = true;
                    } else {
                        element.getComponent(cc.Toggle).isChecked = false;
                    }

                });
                Linker.TayDuKyController.lineChoiString = Linker.TayDuKyController.getLineChoiString(Linker.TayDuKyController.getListLineChoiFromToogle(Linker.TayDuKyView.listLine.children));
                Linker.TayDuKyView.updateNumberLine(Linker.TayDuKyController.lineChoiArray.length);
                //cc.log(name);
                break;
            }
            case "btn_chan": {
                Linker.TayDuKyView.listLine.children.forEach((element, pos) => {
                    if ((pos + 1) % 2 == 0) {
                        element.getComponent(cc.Toggle).isChecked = false;
                    } else {
                        element.getComponent(cc.Toggle).isChecked = true;
                    }
                });
                Linker.TayDuKyController.lineChoiString = Linker.TayDuKyController.getLineChoiString(Linker.TayDuKyController.getListLineChoiFromToogle(Linker.TayDuKyView.listLine.children));
                Linker.TayDuKyView.updateNumberLine(Linker.TayDuKyController.lineChoiArray.length);

                //cc.log(name);
                break;
            }
            case "btn_tatca": {
                Linker.TayDuKyView.listLine.children.forEach(element => {
                    element.getComponent(cc.Toggle).isChecked = false;
                });
                Linker.TayDuKyController.lineChoiString = Linker.TayDuKyController.getLineChoiString(Linker.TayDuKyController.getListLineChoiFromToogle(Linker.TayDuKyView.listLine.children));
                Linker.TayDuKyView.updateNumberLine(Linker.TayDuKyController.lineChoiArray.length);
                //cc.log(name);
                break;
            }
            case "btn_bochon": {
                Linker.TayDuKyView.listLine.children.forEach(element => {
                    element.getComponent(cc.Toggle).isChecked = true;
                });
                Linker.TayDuKyController.lineChoiString = Linker.TayDuKyController.getLineChoiString(Linker.TayDuKyController.getListLineChoiFromToogle(Linker.TayDuKyView.listLine.children));
                Linker.TayDuKyView.updateNumberLine(Linker.TayDuKyController.lineChoiArray.length);
                //cc.log(name);
                break;
            }
            case "lobby_mienphi": {
                cc.log("vaoday lobby_mienphi");
                Linker.TayDuKyController.initGame({
                    userMoney: Linker.userData.userMoney,
                    moneyPerLine: 100,
                    currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu1,
                    typeChoi: 0,
                    typeHu: 1
                });
                Linker.TayDuKyView.showGamePlay(true);
                Linker.TayDuKyView.showLobby(false);
                //cc.log(name);
                break;
            }
            case "lobby_ngocthiem": {
                Linker.TayDuKyController.initGame({
                    userMoney: Linker.userData.userMoney,
                    moneyPerLine: 100,
                    currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu1,
                    typeChoi: 1,
                    typeHu: 1
                });
                Linker.TayDuKyView.showGamePlay(true);
                Linker.TayDuKyView.showLobby(false);
                //cc.log(name);
                break;
            }
            case "lobby_rongvang": {
                Linker.TayDuKyController.initGame({
                    userMoney: Linker.userData.userMoney,
                    moneyPerLine: 10000,
                    currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu3,
                    typeChoi: 1,
                    typeHu: 3
                });
                Linker.TayDuKyView.showGamePlay(true);
                Linker.TayDuKyView.showLobby(false);
                //cc.log(name);
                break;
            }
            case "lobby_meothantai": {
                Linker.TayDuKyController.initGame({
                    userMoney: Linker.userData.userMoney,
                    moneyPerLine: 1000,
                    currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu2,
                    typeChoi: 1,
                    typeHu: 2
                });
                Linker.TayDuKyView.showGamePlay(true);
                Linker.TayDuKyView.showLobby(false);
                //cc.log(name);
                break;
            }
            case "btn_cuoc": {
                //cc.log(name);
                if (Linker.TayDuKyController.typeHu == 1) {
                    Linker.TayDuKyController.typeHu = 2;
                    Linker.TayDuKyController.moneyPerLine = 1000;
                } else {
                    if (Linker.TayDuKyController.typeHu == 2) {
                        Linker.TayDuKyController.typeHu = 3;
                        Linker.TayDuKyController.moneyPerLine = 10000;
                    } else {
                        if (Linker.TayDuKyController.typeHu == 3) {
                            Linker.TayDuKyController.typeHu = 1;
                            Linker.TayDuKyController.moneyPerLine = 100;
                        }
                    }
                }
                Linker.TayDuKyView.updateCurrentPotMoney(Linker.TayDuKyController.typeHu);
                Linker.TayDuKyView.updateTypeMoney(Linker.TayDuKyController.typeHu);

                break;
            }
        }

    },
    addSocketEvent() {
        Linker.Event.addEventListener(1005, Linker.TayDuKyController.onSpinResponse);
        Linker.Event.addEventListener(1006, Linker.TayDuKyController.onLiXiResponse);
        Linker.Event.addEventListener(1004, Linker.TayDuKyController.onUpdateSlotInfo);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(1005, Linker.TayDuKyController.onSpinResponse);
        Linker.Event.removeEventListener(1006, Linker.TayDuKyController.onLiXiResponse);
        Linker.Event.removeEventListener(1004, Linker.TayDuKyController.onUpdateSlotInfo);
    },
    onToogleAuto(toogle) {
        if (toogle.isChecked) {
            Linker.TayDuKyController.isAutoSpin = true;
            Linker.TayDuKyController.spinBtnClick();
        } else {
            Linker.TayDuKyController.isAutoSpin = false;
        }
        //cc.log(toogle.isChecked);
    }


    // update (dt) {},
});