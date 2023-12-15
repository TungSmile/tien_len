var SlotSend = require('SlotSend');
var Linker = require('Linker');
var ItemColumnSlot = require('ItemColumnSlot');
var Api = require('Api');
var Utils = require('Utils');
var Global = require('Global');
var NewAudioManager = require('NewAudioManager');
var GameConstant = require('GameConstant');
var SocketConstant = require('SocketConstant');
var DataAccess = require('DataAccess');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        columnTayDuKyList: {
            default: [],
            type: ItemColumnSlot
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var that=this;
        cc.find('Canvas/Tay_Du_Ky/lobbyContainer').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            Linker.lastTimeManipulation=new Date().getTime();
        }, that);
        cc.find('Canvas/Tay_Du_Ky/gameContainer/gameContent').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            Linker.lastTimeManipulation=new Date().getTime();
        }, that);
        
        Linker.TayDuKyController = this;
        this.resetRotatePos = -186;
        this.resetRotateSpacing = 6;
        //cc.log(Linker.MINI);
        //cc.director.getScene().getChildByName('Canvas').addChild(Linker.MINI);
    },

    onEnable() {
        this.musicData = Linker.Local.readUserData();
        if (this.musicData && this.musicData.isMusic) {
            NewAudioManager.audioIDBG = null;
            cc.audioEngine.stopAll();
            this.audioSource = this.node.getComponent(cc.AudioSource);
            this.audioSource.play();
        }
    },

    onDisable () {
        DataAccess.Instance.node.emit("update-user-data", Linker.userData);
        if (this.musicData && this.musicData.isMusic) {
            NewAudioManager.audioIDBG = null;
            cc.audioEngine.stopAll();
            NewAudioManager.playBackground(NewAudioManager.SOUND_GAME.COMMON.BACKGROUND, 1.0, true, false);
        }
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
        Linker.TayDuKyView.showLobby(true);
        Api.get(Global.configPurchase.API_URL + "api-hu-rong-history?slot="+GameConstant.IDHUSLOT.idThinhKinh, (data) => {
            if (data) {
                //console.log('Data ***',data);
                Linker.TayDuKyView.updateHistoryJackpot(data.array);
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
        colLength = Linker.TayDuKyController.columnTayDuKyList[0].itemList.length;
        if (Linker.TayDuKyController.ingnoreFirstTime !== undefined) {
            for (i = 0; i < Linker.TayDuKyController.columnTayDuKyList.length; i += 1) {
                for (var j = 0; j < 3; j += 1) {
                    swapIndex = (colLength - 1) + (j - 2);
                    type = Linker.TayDuKyController.columnTayDuKyList[i].itemList[j].type;
                    var id = Linker.TayDuKyController.columnTayDuKyList[i].itemList[swapIndex].id;
                    Linker.TayDuKyController.columnTayDuKyList[i].itemList[j].setType(type, id);
                }
            }
        }

        // Reset Pos
        for (i = 0; i < Linker.TayDuKyController.columnTayDuKyList.length; i += 1) {
            columnNode = Linker.TayDuKyController.columnTayDuKyList[i].node;
            columnNode.stopAllActions();
            columnNode.y = Linker.TayDuKyController.resetRotatePos;
            arrayDelayTime.push(i * 0.5 + 0.5);
        }
        // return;
        // Set Ket Qua
        var col = 0,
            row = 0;
        for (i = 0; i < result.length; i += 1) {
            swapIndex = (colLength - 1) - row;
            // cc.log('col ' + col + ' row ' + row + '=> swapIndex ' + swapIndex + ' id ' + result[i]);
            var itemRongVang = Linker.TayDuKyController.columnTayDuKyList[col].itemList[swapIndex];
            itemRongVang.setType(itemRongVang.type, Number(result[i]) - 1);
            itemRongVang.stopEffect();
            col += 1;
            if (col >= 5) {
                row += 1;
                col = 0;
            }
        }

        // rotate
        Linker.TayDuKyController.countRotate = 0;
        // arrayDelayTime = Linker.TayDuKyController.shuffle(arrayDelayTime);

        for (i = 0; i < Linker.TayDuKyController.columnTayDuKyList.length; i += 1) {
            columnNode = Linker.TayDuKyController.columnTayDuKyList[i].node;
            var subHeight = columnNode.getContentSize().height - 125 * 3 - 2 * Linker.TayDuKyController.resetRotateSpacing;
            if (Linker.TayDuKyController.lostForcus) {
                columnNode.y = columnNode.y - subHeight;
                Linker.TayDuKyController.countRotate += 1;
                if (Linker.TayDuKyController.countRotate >= 5) {
                    Linker.TayDuKyController.isFinish = true;
                    Linker.TayDuKyController.showFinish(message);


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
                    Linker.TayDuKyController.countRotate += 1;
                    if (Linker.TayDuKyController.countRotate >= 5) {
                        Linker.TayDuKyController.isFinish = true;
                        Linker.TayDuKyController.showFinish(message);
                    }
                }));
                columnNode.runAction(seq3);
                // columnNode.runAction(cc.sequence(cc.delayTime(arrayDelayTime[i]), cc.moveTo(1.2, cc.v2(columnNode.x, columnNode.y - subHeight)).easing(cc.easeQuinticActionOut()), cc.callFunc(function () {
                //     Linker.TayDuKyController.countRotate += 1;
                //     if (Linker.TayDuKyController.countRotate >= 5) {
                //         Linker.TayDuKyController.isFinish = true;
                //         Linker.TayDuKyController.showFinish(message);


                //     }
                // })));
            }
        }
        Linker.TayDuKyController.ingnoreFirstTime = true;

    },
    onSpinResponse(message) {
        if (message.id && Number(message.id) !== 401) {
            return;
        }
        if (message.status == 1 && !message.thongBao) {
            Linker.TayDuKyController.moneyWin = 0;
            Linker.TayDuKyView.updateMoneyWin(Linker.TayDuKyController.moneyWin);
            Linker.TayDuKyController.spin(message);
            //cc.log(name);
            if (Linker.TayDuKyController.isPreeSpin) {
                if (Linker.TayDuKyController.numberPreeSpin >= 1) {
                    Linker.TayDuKyController.numberPreeSpin--;
                    // khi het luot quay free van duoc quay tiep
                    if (Linker.TayDuKyController.numberPreeSpin == 0) {
                        Linker.TayDuKyController.isPreeSpin = false;
                        Linker.TayDuKyController.typeChoi = 1;
                        Linker.TayDuKyView.updateTypeChoi(Linker.TayDuKyController.typeChoi);
                        Linker.ContinueSpin = true;
                    }
                } else {
                    // Linker.TayDuKyController.isPreeSpin = false;
                    // Linker.TayDuKyController.numberPreeSpin = 0;
                    // Linker.TayDuKyController.typeChoi = 1;
                    // //Linker.TayDuKyController.typeChoi = 2;
                    // Linker.TayDuKyView.updateTypeChoi(Linker.TayDuKyController.typeChoi);
                }

                Linker.TayDuKyView.updateTextPreeSpin(Linker.TayDuKyController.numberPreeSpin);
            } else {
                Linker.TayDuKyController.updateMoneyUser(Linker.TayDuKyController.moneyPerLine, Linker.TayDuKyController.lineChoiString);
            }
        } else {
            Linker.TayDuKyController.isFinish = true;
            if (message.thongBao) {
                Linker.showMessage(message.thongBao);
            } else {
                Linker.showMessage(message.error);
            }
            // check khi het luot quay free van duoc quay tiep
            if (Linker.ContinueSpin) {
                Linker.TayDuKyController.isPreeSpin = false;
                Linker.TayDuKyController.numberPreeSpin = 0;
                Linker.TayDuKyController.typeChoi = 1;
                Linker.TayDuKyView.updateTypeChoi(Linker.TayDuKyController.typeChoi);
                Linker.ContinueSpin = false;
                Linker.TayDuKyController.spinBtnClick();
            }
        }
    },
    updateMoneyUser(bet, line) {
        if (line && line !== "" && Linker.userData && Linker.userData.userRealMoney) {
            line = line.substring(0, line.length - 1);
            line = line.split("#");
            line = line.length;
            if (line && !isNaN(line)) {
                var money = Number(line) * Number(bet);
                Linker.userData.userRealMoney -= money;
                Linker.TayDuKyView.updateUserMoneyIngame();
            }
        }
    },
    onUpdateSlotInfo() {
        if (Linker.Hu && Linker.TayDuKyView) {
            Linker.TayDuKyView.textMoneyHu1.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu1);
            Linker.TayDuKyView.textMoneyHu2.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu2);
            Linker.TayDuKyView.textMoneyHu3.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu3);
            if (Linker.TayDuKyController.moneyPerLine == 100) {
                Linker.TayDuKyView.updateCurrentPotMoney(1);
            } else if (Linker.TayDuKyController.moneyPerLine == 1000) {
                Linker.TayDuKyView.updateCurrentPotMoney(2);
            } else if (Linker.TayDuKyController.moneyPerLine == 10000) {
                Linker.TayDuKyView.updateCurrentPotMoney(3);
            }

        }
    },
    onLiXiResponse(message) {
        //cc.log("aaa", message);
        if (message.status == 1) {
            if (Linker.TayDuKyController.numberLiXi > 0) {
                Linker.TayDuKyController.numberLiXi--;
                //cc.log("LIXI", Linker.TayDuKyController.numberLiXi);

            }
            Linker.LiXiDialog.textLixi.string = i18n.t("tdk_title_text_lixi", { n: Linker.TayDuKyController.numberLiXi });
            var money = Number(Utils.Malicious.convertMoney(Linker.LiXiDialog.textUserMoney.string)) + Number(message.money);
            Linker.LiXiDialog.textUserMoney.string = Utils.Number.format(money);
            Linker.LiXiDialog.winDialog.active = true;
            var test = cc.find("Canvas/Tay_Du_Ky/lixiContainer/win/border/lixi/text").getComponent(cc.Label);
            if (test) {
                test.string = message.money;
            }
            if (Linker.TayDuKyController.tempEvent && Linker.TayDuKyController.tempEvent.target) {
                Linker.TayDuKyController.tempEvent.target.getComponent(cc.Button).interactable = false;
                Linker.TayDuKyController.tempEvent.target.getChildByName("check2").active = true;
            } else {
                setTimeout(function () {
                    Linker.LiXiDialog.node.active = false;
                    Linker.TayDuKyView.updateUserMoneyIngame();
                    Linker.LixiHandler.auto_click = false;
                    if (Linker.TayDuKyController.isAutoSpin) {
                        Linker.TayDuKyController.spinBtnClick();
                    }
                }, GameConstant.LIXI.TIME_DELAY_SHOW_OPENED_LIXI);
            }

        } else {
            //Linker.showMessage("Có lỗi xảy ra. Vui lòng thử lại sau");
            if (message.thongBao) {
                Linker.showMessage(message.thongBao);
            } else {
                Linker.showMessage(message.error);
            }
        }
    },
    showFinish(message) {
        if (!Linker.TayDuKyController.isAutoSpin) {
            var i = 0;
            var seq = cc.callFunc(() => {
                if (message.lineWin[i] != "") {
                    let index = Number(message.lineWin[i]);
                    var indexLine = index > 0 ? index -1 : index;

                    Linker.TayDuKyLineCuaAn.activeLine(indexLine, Linker.TayDuKyController.columnTayDuKyList, message.lineWin, () => {
                        if (i < message.lineWin.length - 1) {
                            i++;
                            Linker.TayDuKyController.node.runAction(seq);
                        } else {
                            i = 0;
                            Linker.TayDuKyController.node.runAction(seq);
                        }
                    });

                }
            });
            Linker.TayDuKyController.node.runAction(seq);
        } else {
            var i = 0;
            var seq = cc.callFunc(() => {
                if (message.lineWin[i] != "") {
                    let index = Number(message.lineWin[i]);
                    var indexLine = index > 0 ? index -1 : index;

                    Linker.TayDuKyLineCuaAn.activeLineQuick(indexLine, Linker.TayDuKyController.columnTayDuKyList, message.lineWin, () => {
                        if (i < message.lineWin.length - 1) {
                            i++;
                            Linker.TayDuKyController.node.runAction(seq);
                        } else {
                            i = 0;
                            Linker.TayDuKyController.node.runAction(seq);
                        }
                    });

                }
            });
            Linker.TayDuKyController.node.runAction(seq);
        }

        Linker.TayDuKyController.idMach = message.idSpin;
        Linker.TayDuKyView.updateIdMatch(Linker.TayDuKyController.idMach);
        Linker.TayDuKyController.moneyWin = message.moneyWin;
        Linker.TayDuKyView.updateMoneyWin(Linker.TayDuKyController.moneyWin);
        Linker.TayDuKyView.updateUserMoneyIngame(Linker.userData.userRealMoney);
        Linker.TayDuKyView.updateCurrentPotMoney(Linker.TayDuKyController.typeHu);
        if (Linker.HallView) {
            Linker.HallView.updateUserMoney();
            //Linker.HallView.updateHu();
        }
        if (Number(message.freeSpin) > 0) {
            Linker.TayDuKyController.isPreeSpin = message.idSpin;
            Linker.TayDuKyController.numberPreeSpin = Number(message.freeSpin);
            Linker.showMessage(i18n.t("You got ") + message.freeSpin + i18n.t(" free spins"));
            Linker.TayDuKyView.updateTextPreeSpin(Linker.TayDuKyController.numberPreeSpin);
            Linker.TayDuKyController.typeChoi = 2;
            //Linker.TayDuKyView.updateTypeChoi(Linker.TayDuKyController.typeChoi);

        }
        if (Number(message.lixi) > 0) {
            Linker.TayDuKyController.numberLiXi = Number(message.lixi);
            Linker.TayDuKyController.isLiXi = true;
            if (Linker.TayDuKyController.isLiXi) {
                Linker.TayDuKyView.playLiXiEffect();
            } else {

            }
            return;
        } else {
            Linker.TayDuKyController.isLiXi = false;
        }
        // message.noHu=true;
        if (message.noHu == true) {
            // NewAudioManager.playEffect(NewAudioManager.sound.tdkNoHu);
            Linker.TayDuKyController.isNoHu = true;
            // Linker.TayDuKyController.isAutoSpin = false;
            if(!Linker.TayDuKyController.isAutoSpin){
                Linker.TayDuKyView.toogleFreeSpin.isChecked = false;
            }else{
                Linker.TayDuKyController.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(() => {
                    if (Linker.TayDuKyController.isAutoSpin) {
                        Linker.TayDuKyView.noHuNode.active = false;
                        Linker.TayDuKyController.spinBtnClick();
                    }
                })));
            }
            Linker.TayDuKyView.playJackPotEffect();
            return;
        };
        // message.bigWin=true;
        if (message.bigWin == true) {
            // NewAudioManager.playEffect(NewAudioManager.sound.tdkBigWin);
            Linker.TayDuKyController.isBigWin = true;
            // Linker.TayDuKyController.isAutoSpin = false;
            if(!Linker.TayDuKyController.isAutoSpin){
                Linker.TayDuKyView.toogleFreeSpin.isChecked = false;
            }else{
                Linker.TayDuKyController.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(() => {
                    if (Linker.TayDuKyController.isAutoSpin) {
                        Linker.TayDuKyView.thangLonNode.active = false;
                        Linker.TayDuKyController.spinBtnClick();
                    }
                })));
            }
            Linker.TayDuKyView.playBigWinEffect();
            return;
        };
        Linker.TayDuKyController.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
            if (Linker.TayDuKyController.isAutoSpin) {
                Linker.TayDuKyController.spinBtnClick();
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
        this.idHu = 401; //"10"+Linker.Hu.listHu[1][0].id;
        this.idMach = 0;
        this.lineChoiArray = [];
        this.lineChoiString = this.getLineChoiString(this.getListLineChoiFromToogle(Linker.TayDuKyView.listLine.children));
        this.typeChoi = data.typeChoi;
        this.moneyPerLine = data.moneyPerLine;
        this.typeHu = data.typeHu;
        Linker.TayDuKyView.updateUserMoneyIngame();
        Linker.TayDuKyView.updateMoneyWin(this.moneyWin);
        Linker.TayDuKyView.updateNumberLine(this.lineChoiArray.length);
        Linker.TayDuKyView.updateTypeMoney(this.typeHu)
        Linker.TayDuKyView.updateIdMatch(this.idMach);
        Linker.TayDuKyView.updateCurrentPotMoney(Linker.TayDuKyController.typeHu);
        Linker.TayDuKyView.updateTypeChoi(Linker.TayDuKyController.typeChoi);
        Linker.TayDuKyView.updateTextPreeSpin(this.numberPreeSpin);
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
        //cc.log("Linker.TayDuKyController.isFinish:",Linker.TayDuKyController.isFinish);
        if (Linker.TayDuKyController.isFinish) {
            if (Linker.TayDuKyController.isPreeSpin && Linker.TayDuKyController.isPreeSpin > 0) { //dung cho truong hop free spin
                var test = SlotSend.spin(Linker.TayDuKyController.typeChoi, Linker.TayDuKyController.idHu, Linker.TayDuKyController.moneyPerLine, Linker.TayDuKyController.lineChoiString, Linker.TayDuKyController.isPreeSpin);
            } else {
                var test = SlotSend.spin(Linker.TayDuKyController.typeChoi, Linker.TayDuKyController.idHu, Linker.TayDuKyController.moneyPerLine, Linker.TayDuKyController.lineChoiString, 0);
            }
            cc.log('SEND HU:', test);
            Linker.Socket.send(test);
            Linker.TayDuKyController.isFinish = false;
            Linker.TayDuKyView.resetUi();
            setTimeout(() => {
                Linker.TayDuKyController.isFinish = true;
            }, 6000);
        } else {
            //cc.log("Spin to fast");
        }
    },
    lixiBtnClick(event) {
        var aaa = SlotSend.lixi(Linker.TayDuKyController.idMach, SocketConstant.GAME.SLOT.GET_ONE_LIXI);
        //cc.log(aaa);
        Linker.Socket.send(aaa);
        this.tempEvent = event;
        //cc.log("SEND__");
    },
    lixiAutoBtnClick() {
        var aaa = SlotSend.lixi(Linker.TayDuKyController.idMach, SocketConstant.GAME.SLOT.GET_ALL_LIXI);
        //cc.log(aaa);
        Linker.Socket.send(aaa);
        this.tempEvent = null;
        //cc.log("SEND__");
    }




    // update (dt) {},
});