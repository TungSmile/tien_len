var i18n = require('i18n');
var SlotSend = require('SlotSend');
var Linker = require('Linker');
var ItemColumnSlot = require('ItemColumnSlot');
var Api = require('Api');
var Utils = require('Utils');
var Global = require('Global');
var NewAudioManager = require('NewAudioManager');
var GameConstant = require('GameConstant');
var SocketConstant = require('SocketConstant');
cc.Class({
    extends: cc.Component,

    properties: {
        columnRongVangList: {
            default: [],
            type: ItemColumnSlot
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var that = this;
        cc.find('Canvas/Ta_Than/lobbyContainer').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            Linker.lastTimeManipulation = new Date().getTime();
        }, that);
        cc.find('Canvas/Ta_Than/gameContainer/gameContent').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            Linker.lastTimeManipulation = new Date().getTime();
        }, that);

        Linker.TaThanController = this;
        this.resetRotatePos = -186;
        this.resetRotateSpacing = 6;
        //cc.log(Linker.MINI);
        //cc.director.getScene().getChildByName('Canvas').addChild(Linker.MINI);
    },

    onEnable() {
        this.musicData = Linker.Local.readUserData();
        var self = this;
        // cc.loader.load(cc.url.raw(NewAudioManager.sound.tathanbackground), function () {
        //     if (self.musicData) {
        //         if (self.musicData.isMusic) {
        //             NewAudioManager.audioIDBG = null;
        //             cc.audioEngine.stopAll();
        //             NewAudioManager.playBackground(NewAudioManager.sound.tathanbackground);
        //         }
        //     }
        // });
    },
    shuffle: function (array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },

    start() {
        Linker.TaThanView.showLobby(true);
        Api.get(Global.configPurchase.API_URL + "api-hu-rong-history?slot="+GameConstant.IDHUSLOT.idTaThan, (data) => {
            if (data) {
                //cc.log('Data ***',data);
                Linker.TaThanView.updateHistoryJackpot(data.array);
            }

        });
    },
    spin(message) {
        var result = message.line;
        var i, columnNode, arrayDelayTime = [],
            type = 0,
            colLength = 0,
            swapIndex = 0,
            self = this;
        //message.noHu=true;

        // Reset 3 Dong Dau => 3 Dong Cuoi
        colLength = Linker.TaThanController.columnRongVangList[0].itemList.length;
        if (Linker.TaThanController.ingnoreFirstTime !== undefined) {
            for (i = 0; i < Linker.TaThanController.columnRongVangList.length; i += 1) {
                for (var j = 0; j < 3; j += 1) {
                    swapIndex = (colLength - 1) + (j - 2);
                    type = Linker.TaThanController.columnRongVangList[i].itemList[j].type;
                    var id = Linker.TaThanController.columnRongVangList[i].itemList[swapIndex].id;
                    Linker.TaThanController.columnRongVangList[i].itemList[j].setType(type, id);
                }
            }
        }

        // Reset Pos
        for (i = 0; i < Linker.TaThanController.columnRongVangList.length; i += 1) {
            columnNode = Linker.TaThanController.columnRongVangList[i].node;
            columnNode.stopAllActions();
            columnNode.y = Linker.TaThanController.resetRotatePos;
            arrayDelayTime.push(i * 0.5 + 0.5);
        }
        // return;
        // Set Ket Qua
        var col = 0,
            row = 0;
        for (i = 0; i < result.length; i += 1) {
            swapIndex = (colLength - 1) - row;
            // cc.log('col ' + col + ' row ' + row + '=> swapIndex ' + swapIndex + ' id ' + result[i]);
            var itemRongVang = Linker.TaThanController.columnRongVangList[col].itemList[swapIndex];
            itemRongVang.setType(itemRongVang.type, Number(result[i]) - 1);
            itemRongVang.stopEffect();
            col += 1;
            if (col >= 5) {
                row += 1;
                col = 0;
            }
        }

        // rotate
        Linker.TaThanController.countRotate = 0;
        // arrayDelayTime = Linker.TaThanController.shuffle(arrayDelayTime);

        for (i = 0; i < Linker.TaThanController.columnRongVangList.length; i += 1) {
            columnNode = Linker.TaThanController.columnRongVangList[i].node;
            var subHeight = columnNode.getContentSize().height - 125 * 3 - 2 * Linker.TaThanController.resetRotateSpacing;
            if (Linker.TaThanController.lostForcus) {
                columnNode.y = columnNode.y - subHeight;
                Linker.TaThanController.countRotate += 1;
                if (Linker.TaThanController.countRotate >= 5) {
                    Linker.TaThanController.isFinish = true;
                    Linker.TaThanController.showFinish(message);


                }
            } else {

                var seq4 = cc.delayTime(i * 0.4);

                var seq5 = cc.sequence(
                    cc.moveTo(0.2, cc.v2(columnNode.x, columnNode.y - 40))
                );

                var seq = cc.repeat(
                    cc.sequence(
                        cc.moveTo(0.015, cc.v2(columnNode.x, -186)),
                        cc.moveTo(0.025, cc.v2(columnNode.x, columnNode.y - subHeight))
                    ), 70);

                var seq2 = cc.sequence(
                    cc.moveTo(0.2, cc.v2(columnNode.x, columnNode.y - subHeight + 40)),
                    cc.moveTo(0.2, cc.v2(columnNode.x, columnNode.y - subHeight))
                );

                var seq3 = cc.sequence(seq4, seq5, seq, seq2, cc.callFunc(function () {
                    Linker.TaThanController.countRotate += 1;
                    if (Linker.TaThanController.countRotate >= 5) {
                        Linker.TaThanController.isFinish = true;
                        Linker.TaThanController.showFinish(message);
                    }
                }));
                columnNode.runAction(seq3);
                // columnNode.runAction(cc.sequence(cc.delayTime(arrayDelayTime[i]), cc.moveTo(1.2, cc.v2(columnNode.x, columnNode.y - subHeight)).easing(cc.easeQuinticActionOut()), cc.callFunc(function () {
                //     Linker.TaThanController.countRotate += 1;
                //     if (Linker.TaThanController.countRotate >= 5) {
                //         Linker.TaThanController.isFinish = true;
                //         Linker.TaThanController.showFinish(message);


                //     }
                // })));
            }
        }
        Linker.TaThanController.ingnoreFirstTime = true;

    },
    onSpinResponse(message) {
        if (message.status == 1 && !message.thongBao) {
            Linker.TaThanController.moneyWin = 0;
            Linker.TaThanView.updateMoneyWin(Linker.TaThanController.moneyWin);
            Linker.TaThanController.spin(message);
            //cc.log(name);
            if (Linker.TaThanController.isPreeSpin) {
                if (Linker.TaThanController.numberPreeSpin >= 1) {
                    Linker.TaThanController.numberPreeSpin--;
                    // khi het luot quay free van duoc quay tiep
                    if (Linker.TaThanController.numberPreeSpin == 0) {
                        Linker.ContinueSpin = true;
                    }
                } else {
                    // Linker.TaThanController.isPreeSpin = false;
                    // Linker.TaThanController.numberPreeSpin = 0;
                    // Linker.TaThanController.typeChoi = 1;
                    // //Linker.TaThanController.typeChoi = 2;
                    // Linker.TaThanView.updateTypeChoi(Linker.TaThanController.typeChoi);
                }

                Linker.TaThanView.updateTextPreeSpin(Linker.TaThanController.numberPreeSpin);
            }



        } else {
            Linker.TaThanController.isFinish = true;
            if (message.thongBao) {
                cc.Global.showMessage(message.thongBao);
            } else {
                cc.Global.showMessage(message.error);
            }

            // check khi het luot quay free van duoc quay tiep
            if (Linker.ContinueSpin) {
                Linker.TaThanController.isPreeSpin = false;
                Linker.TaThanController.numberPreeSpin = 0;
                Linker.TaThanController.typeChoi = 1;
                Linker.TaThanView.updateTypeChoi(Linker.TaThanController.typeChoi);
                Linker.ContinueSpin = false;
                Linker.TaThanController.spinBtnClick();
            }
        }
    },
    onUpdateSlotInfo() {
        if (Linker.Hu && Linker.TaThanView) {
            Linker.TaThanView.textMoneyHu1.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idTaThan][0].moneyHu1);
            Linker.TaThanView.textMoneyHu2.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idTaThan][0].moneyHu2);
            Linker.TaThanView.textMoneyHu3.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idTaThan][0].moneyHu3);
            if (Linker.TaThanController.moneyPerLine == 100) {
                Linker.TaThanView.updateCurrentPotMoney(1);
            } else if (Linker.TaThanController.moneyPerLine == 1000) {
                Linker.TaThanView.updateCurrentPotMoney(2);
            } else if (Linker.TaThanController.moneyPerLine == 10000) {
                Linker.TaThanView.updateCurrentPotMoney(3);
            }

        }
    },
    onLiXiResponse(message) {
        //cc.log("aaa", message);
        if (message.status == 1) {
            if (Linker.TaThanController.numberLiXi > 0) {
                Linker.TaThanController.numberLiXi--;
                //cc.log("LIXI", Linker.TaThanController.numberLiXi);

            }
            Linker.LiXiDialog.textLixi.string =  i18n.t("you_have") + " " + Linker.TaThanController.numberLiXi + " " + i18n.t("times_to_open_bonus");
            var money = Number(Linker.userData.userMoney) + Number(message.money);
            Linker.LiXiDialog.textUserMoney.string = Utils.Number.format(money);
            Linker.LiXiDialog.winDialog.active = true;
            var test = cc.find("Canvas/Ta_Than/lixiContainer/win/border/lixi/text").getComponent(cc.Label);
            if (test) {
                test.string = message.money;
            }
            if (Linker.TaThanController.tempEvent && Linker.TaThanController.tempEvent.target) {
                Linker.TaThanController.tempEvent.target.getComponent(cc.Button).interactable = false;
                Linker.TaThanController.tempEvent.target.getChildByName("check2").active = true;
            } else {
                setTimeout(function () {
                    Linker.LiXiDialog.node.active = false;
                    Linker.TaThanView.updateUserMoneyIngame();
                    Linker.LixiHandler.auto_click = false;
                    if (Linker.TaThanController.isAutoSpin) {
                        Linker.TaThanController.spinBtnClick();
                    }
                }, GameConstant.LIXI.TIME_DELAY_SHOW_OPENED_LIXI);
            }

        } else {
            //cc.Global.showMessage("Có lỗi xảy ra. Vui lòng thử lại sau");
            if (message.thongBao) {
                cc.Global.showMessage(message.thongBao);
            } else {
                cc.Global.showMessage(message.error);
            }
        }
    },
    showFinish(message) {
        if (!Linker.TaThanController.isAutoSpin) {
            var i = 0;
            var seq = cc.callFunc(() => {
                if (message.lineWin[i] != "") {
                    let index = Number(message.lineWin[i]);
                    var indexLine = index > 0 ? index - 1 : index;

                    Linker.TaThanLineCuaAn.activeLine(indexLine, Linker.TaThanController.columnRongVangList, message.lineWin, () => {
                        if (i < message.lineWin.length - 1) {
                            i++;
                            Linker.TaThanController.node.runAction(seq);
                        } else {
                            i = 0;
                            Linker.TaThanController.node.runAction(seq);
                        }
                    });

                }
            });
            Linker.TaThanController.node.runAction(seq);
        } else {
            var i = 0;
            var seq = cc.callFunc(() => {
                if (message.lineWin[i] != "") {
                    let index = Number(message.lineWin[i]);
                    var indexLine = index > 0 ? index - 1 : index;

                    Linker.TaThanLineCuaAn.activeLineQuick(indexLine, Linker.TaThanController.columnRongVangList, message.lineWin, () => {
                        if (i < message.lineWin.length - 1) {
                            i++;
                            Linker.TaThanController.node.runAction(seq);
                        } else {
                            i = 0;
                            Linker.TaThanController.node.runAction(seq);
                        }
                    });

                }
            });
            Linker.TaThanController.node.runAction(seq);
        }

        Linker.TaThanController.idMach = message.idSpin;
        Linker.TaThanView.updateIdMatch(Linker.TaThanController.idMach);
        Linker.TaThanController.moneyWin = message.moneyWin;
        Linker.TaThanView.updateMoneyWin(Linker.TaThanController.moneyWin);
        Linker.TaThanView.updateUserMoneyIngame(Linker.userData.userMoney);
        Linker.TaThanView.updateCurrentPotMoney(Linker.TaThanController.typeHu);
        if (Linker.HallView) {
            Linker.HallView.updateUserMoney();
            //Linker.HallView.updateHu();
        }
        if (Number(message.freeSpin) > 0) {
            Linker.TaThanController.isPreeSpin = message.idSpin;
            Linker.TaThanController.numberPreeSpin = Number(message.freeSpin);
            cc.Global.showMessage("Bạn nhận được " + message.freeSpin + " lượt quay miễn phí");
            Linker.TaThanView.updateTextPreeSpin(Linker.TaThanController.numberPreeSpin);
            Linker.TaThanController.typeChoi = 2;
            //Linker.TaThanView.updateTypeChoi(Linker.TaThanController.typeChoi);

        }
        if (Number(message.lixi) > 0) {
            Linker.TaThanController.numberLiXi = Number(message.lixi);
            Linker.TaThanController.isLiXi = true;
            if (Linker.TaThanController.isLiXi) {
                Linker.TaThanView.playLiXiEffect();
            } else {

            }
            return;
        } else {
            Linker.TaThanController.isLiXi = false;
        }
        // message.noHu=true;
        if (message.noHu == true) {
            NewAudioManager.playEffect(NewAudioManager.sound.tdkNoHu);
            Linker.TaThanController.isNoHu = true;
            // Linker.TaThanController.isAutoSpin = false;
            if (!Linker.TaThanController.isAutoSpin) {
                Linker.TaThanView.toogleFreeSpin.isChecked = false;
            } else {
                Linker.TaThanController.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(() => {
                    if (Linker.TaThanController.isAutoSpin) {
                        Linker.TaThanView.noHuNode.active = false;
                        Linker.TaThanController.spinBtnClick();
                    }
                })));
            }
            Linker.TaThanView.playJackPotEffect();
            return;
        };
        // message.bigWin=true;
        if (message.bigWin == true) {
            NewAudioManager.playEffect(NewAudioManager.sound.tdkBigWin);
            Linker.TaThanController.isBigWin = true;
            // Linker.TaThanController.isAutoSpin = false;
            if (!Linker.TaThanController.isAutoSpin) {
                Linker.TaThanView.toogleFreeSpin.isChecked = false;
            } else {
                Linker.TaThanController.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(() => {
                    if (Linker.TaThanController.isAutoSpin) {
                        Linker.TaThanView.thangLonNode.active = false;
                        Linker.TaThanController.spinBtnClick();
                    }
                })));
            }
            Linker.TaThanView.playBigWinEffect();
            return;
        };
        Linker.TaThanController.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
            if (Linker.TaThanController.isAutoSpin) {
                Linker.TaThanController.spinBtnClick();
            }
        })));

    },
    initGame(data) {
        this.isAutoSpin = false;
        this.isNoHu = false;
        this.isBigWin = false;
        this.isPreeSpin = false;
        this.isLiXi = false;
        this.numberLiXi = 0;
        this.numberPreeSpin = 0;
        this.resetRotatePos = -186;
        this.resetRotateSpacing = 6;
        this.lostForcus = false;
        this.isFinish = true;
        this.moneyWin = 0;
        //cc.log("Linker.Hu.listHu:",Linker.Hu.listHu);
        //this.idHu = "10"+Linker.Hu.listHu[1][0].id;
        this.idHu = 1; //"10"+Linker.Hu.listHu[1][0].id;
        this.idMach = 0;
        this.lineChoiArray = [];
        this.lineChoiString = this.getLineChoiString(this.getListLineChoiFromToogle(Linker.TaThanView.listLine.children));
        this.typeChoi = data.typeChoi;
        this.moneyPerLine = data.moneyPerLine;
        this.typeHu = data.typeHu;
        Linker.TaThanView.updateUserMoneyIngame();
        Linker.TaThanView.updateMoneyWin(this.moneyWin);
        Linker.TaThanView.updateNumberLine(this.lineChoiArray.length);
        Linker.TaThanView.updateTypeMoney(this.typeHu)
        Linker.TaThanView.updateIdMatch(this.idMach);
        Linker.TaThanView.updateCurrentPotMoney(Linker.TaThanController.typeHu);
        Linker.TaThanView.updateTypeChoi(Linker.TaThanController.typeChoi);
        Linker.TaThanView.updateTextPreeSpin(this.numberPreeSpin);
        //cc.log(this);

    },
    getListLineChoiFromToogle(array) {
        this.lineChoiArray = [];
        array.forEach((element, pos) => {
            var toogle = element.getComponent(cc.Toggle);
            if (!toogle.isChecked) {
                this.lineChoiArray.push(pos);
            }
        })
        return this.lineChoiArray;
    },
    getLineChoiString(array) {
        var string = "";
        array.forEach((element, pos) => {
            string = string + element + "#";
        })
        return string;
    },
    autoSpin() {

    },
    stopAutoSpin() {

    },
    spinBtnClick() {
        //cc.log("Linker.TaThanController.isFinish:",Linker.TaThanController.isFinish);
        if (Linker.TaThanController.isFinish) {
            if (Linker.TaThanController.isPreeSpin && Linker.TaThanController.isPreeSpin > 0) { //dung cho truong hop free spin
                var test = SlotSend.spin(Linker.TaThanController.typeChoi, Linker.TaThanController.idHu, Linker.TaThanController.moneyPerLine, Linker.TaThanController.lineChoiString, Linker.TaThanController.isPreeSpin);
            } else {
                var test = SlotSend.spin(Linker.TaThanController.typeChoi, Linker.TaThanController.idHu, Linker.TaThanController.moneyPerLine, Linker.TaThanController.lineChoiString, 0);
            }
            cc.log('SEND HU:', test);
            Linker.Socket.send(test);
            Linker.TaThanController.isFinish = false;
            Linker.TaThanView.resetUi();
            setTimeout(() => {
                Linker.TaThanController.isFinish = true;
            }, 6000);
        } else {
            //cc.log("Spin to fast");
        }
    },
    lixiBtnClick(event) {
        var aaa = SlotSend.lixi(Linker.TaThanController.idMach, SocketConstant.GAME.SLOT.GET_ONE_LIXI);
        //cc.log(aaa);
        Linker.Socket.send(aaa);
        this.tempEvent = event;
        //cc.log("SEND__");
    },
    lixiAutoBtnClick() {
        var aaa = SlotSend.lixi(Linker.TaThanController.idMach, SocketConstant.GAME.SLOT.GET_ALL_LIXI);
        //cc.log(aaa);
        Linker.Socket.send(aaa);
        this.tempEvent = null;
        //cc.log("SEND__");
    }




    // update (dt) {},
});