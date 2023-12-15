// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var SlotSend = require('SlotSend');
var Linker = require('Linker');
var MiniSlotItemColumnSlot = require('MiniSlotItemColumnSlot');
var Utils = require('Utils');
var NewAudioManager = require('NewAudioManager');
var GameConstant = require('GameConstant');
var SocketConstant = require('SocketConstant');
var DataAccess = require('DataAccess');
cc.Class({
    extends: cc.Component,

    properties: {
        columnMiniSlotList: {
            default: [],
            type: MiniSlotItemColumnSlot
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var that = this;
        Linker.MiniSlotController = this;
        // cc.find('Canvas/MiniGame/Container/MiniSlot/gameContainer/gameContent').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
        //     Linker.lastTimeManipulation = new Date().getTime();
        // }, that);


        this.resetRotatePos = -186;
        this.resetRotateSpacing = 6;
        //cc.log(Linker.MINI);
        //cc.director.getScene().getChildByName('Canvas').addChild(Linker.MINI);
    },

    onEnable() {
        // this.musicData = Linker.Local.readUserData();
        // var self = this;
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
        Linker.MiniSlotController.initGame({
            userMoney: Linker.userData.userMoney,
            moneyPerLine: 100,
            currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idMiniSlot777][0].moneyHu1,
            typeChoi: 1,
            typeHu: 1
        });



    },
    spin(message) {
        cc.log("sppppppppp");
        var result = message.line;
        var i, columnNode, arrayDelayTime = [],
            type = 0,
            colLength = 0,
            swapIndex = 0,
            self = this;
        //message.noHu=true;

        // Reset 3 Dong Dau => 3 Dong Cuoi
        colLength = Linker.MiniSlotController.columnMiniSlotList[0].itemList.length;
        if (Linker.MiniSlotController.ingnoreFirstTime !== undefined) {
            for (i = 0; i < Linker.MiniSlotController.columnMiniSlotList.length; i += 1) {
                for (var j = 0; j < 3; j += 1) {
                    swapIndex = (colLength - 2) + (j - 2);
                    type = Linker.MiniSlotController.columnMiniSlotList[i].itemList[j].type;
                    var id = Linker.MiniSlotController.columnMiniSlotList[i].itemList[swapIndex].id;
                    Linker.MiniSlotController.columnMiniSlotList[i].itemList[j + 1].setType(type, id);
                }
            }
        }

        // Reset Pos
        for (i = 0; i < Linker.MiniSlotController.columnMiniSlotList.length; i += 1) {
            columnNode = Linker.MiniSlotController.columnMiniSlotList[i].node;
            columnNode.stopAllActions();
            columnNode.y = Linker.MiniSlotController.resetRotatePos;
            arrayDelayTime.push(i * 0.5 + 0.5);
        }
        // return;
        // Set Ket Qua
        var col = 0,
            row = 1;
        for (i = 0; i < result.length; i += 1) {
            swapIndex = (colLength - 1) - row;
            // cc.log('col ' + col + ' row ' + row + '=> swapIndex ' + swapIndex + ' id ' + result[i]);
            var itemMiniSlot = Linker.MiniSlotController.columnMiniSlotList[col].itemList[swapIndex];
            itemMiniSlot.setType(itemMiniSlot.type, Number(result[i]) - 1);
            itemMiniSlot.stopEffect();
            col += 1;
            if (col >= 3) {
                row += 1;
                col = 0;
            }
        }

        // rotate
        Linker.MiniSlotController.countRotate = 0;
        // arrayDelayTime = Linker.MiniSlotController.shuffle(arrayDelayTime);

        for (i = 0; i < Linker.MiniSlotController.columnMiniSlotList.length; i += 1) {
            columnNode = Linker.MiniSlotController.columnMiniSlotList[i].node;
            var subHeight = columnNode.getContentSize().height - 125 * 3 - 2 * Linker.MiniSlotController.resetRotateSpacing;
            if (Linker.MiniSlotController.lostForcus) {
                columnNode.y = columnNode.y - subHeight;
                Linker.MiniSlotController.countRotate += 1;
                if (Linker.MiniSlotController.countRotate >= 2) {
                    Linker.MiniSlotController.isFinish = true;
                    Linker.MiniSlotController.showFinish(message);


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
                    cc.moveTo(0.2, cc.v2(columnNode.x, columnNode.y - subHeight - 10))
                );

                var seq3 = cc.sequence(seq4, seq5, seq, seq2, cc.callFunc(function () {
                    Linker.MiniSlotController.countRotate += 1;
                    if (Linker.MiniSlotController.countRotate > 2) {
                        Linker.MiniSlotController.isFinish = true;
                        Linker.MiniSlotController.showFinish(message);
                    }
                }));
                columnNode.runAction(seq3);
                // columnNode.runAction(cc.sequence(cc.delayTime(arrayDelayTime[i]), cc.moveTo(1.2, cc.v2(columnNode.x, columnNode.y - subHeight)).easing(cc.easeQuinticActionOut()), cc.callFunc(function () {
                //     Linker.MiniSlotController.countRotate += 1;
                //     if (Linker.MiniSlotController.countRotate >= 5) {
                //         Linker.MiniSlotController.isFinish = true;
                //         Linker.MiniSlotController.showFinish(message);


                //     }
                // })));
            }
        }
        Linker.MiniSlotController.ingnoreFirstTime = true;

    },
    onSpinResponse(message) {
        if (message.id && Number(message.id) !== 701) {
            return;
        }
        if (Number(message.messageId) == 1005 && Number(message.status) == 0) {
            cc.Global.showMessage(message.error);
        } else if (message.status == 1 && !message.thongBao) {
            Linker.MiniSlotController.updateMoneyUser(Linker.MiniSlotController.moneyPerLine, Linker.MiniSlotController.lineChoiString);
            Linker.MiniSlotController.moneyWin = 0;
            Linker.MiniSlotView.updateMoneyWin(Linker.MiniSlotController.moneyWin);
            Linker.MiniSlotController.spin(message);
            //cc.log(name);
        } else {
            Linker.MiniSlotController.isFinish = true;
            if (message.thongBao) {
                cc.Global.showMessage(message.thongBao);
            } else {
                cc.Global.showMessage(message.error);
            }
        }
    },
    onUpdateSlotInfo() {
        if (Linker.Hu && Linker.MiniSlotView) {
            if (Linker.MiniSlotController.moneyPerLine == 100) {
                Linker.MiniSlotView.updateCurrentPotMoney(1);
            } else if (Linker.MiniSlotController.moneyPerLine == 1000) {
                Linker.MiniSlotView.updateCurrentPotMoney(2);
            } else if (Linker.MiniSlotController.moneyPerLine == 10000) {
                Linker.MiniSlotView.updateCurrentPotMoney(3);
            }

        }
    },
    showFinish(message) {
        if (!Linker.MiniSlotController.isAutoSpin) {
            var i = 0;
            var seq = cc.callFunc(() => {
                if (message.lineWin[i] != "") {
                    let index = Number(message.lineWin[i]);
                    var indexLine = index > 0 ? index - 1 : index;

                    Linker.MiniSlotLineCuaAn.activeLine(indexLine, Linker.MiniSlotController.columnMiniSlotList, message.lineWin, () => {
                        if (i < message.lineWin.length - 1) {
                            i++;
                            Linker.MiniSlotController.node.runAction(seq);
                        } else {
                            i = 0;
                            Linker.MiniSlotController.node.runAction(seq);
                        }
                    });

                }
            });
            Linker.MiniSlotController.node.runAction(seq);
        } else {
            var i = 0;
            var seq = cc.callFunc(() => {
                if (message.lineWin[i] != "") {
                    let index = Number(message.lineWin[i]);
                    var indexLine = index > 0 ? index - 1 : index;

                    Linker.MiniSlotLineCuaAn.activeLineQuick(indexLine, Linker.MiniSlotController.columnMiniSlotList, message.lineWin, () => {
                        if (i < message.lineWin.length - 1) {
                            i++;
                            Linker.MiniSlotController.node.runAction(seq);
                        } else {
                            i = 0;
                            Linker.MiniSlotController.node.runAction(seq);
                        }
                    });

                }
            });
            Linker.MiniSlotController.node.runAction(seq);
        }

        Linker.MiniSlotController.idMach = message.idSpin;
        Linker.MiniSlotView.updateIdMatch(Linker.MiniSlotController.idMach);
        Linker.MiniSlotController.moneyWin = message.moneyWin;
        Linker.MiniSlotView.updateMoneyWin(Linker.MiniSlotController.moneyWin);
        // Linker.MiniSlotView.updateUserMoneyIngame();
        Linker.MiniSlotView.updateCurrentPotMoney(Linker.MiniSlotController.typeHu);
        DataAccess.Instance.updateData();
        // message.noHu=true;
        if (message.noHu == true) {
            // NewAudioManager.playEffect(NewAudioManager.sound.tdkNoHu);
            Linker.MiniSlotController.isNoHu = true;
            // Linker.MiniSlotController.isAutoSpin = false;
            if (Linker.MiniSlotController.isAutoSpin) {
                Linker.MiniSlotController.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(() => {
                    if (Linker.MiniSlotController.isAutoSpin) {
                        Linker.MiniSlotView.noHuNode.active = false;
                        Linker.MiniSlotController.spinBtnClick();
                    }
                })));
            }
            Linker.MiniSlotView.playJackPotEffect();
            return;
        };
        // message.bigWin=true;
        if (message.bigWin == true) {
            // NewAudioManager.playEffect(NewAudioManager.sound.tdkBigWin);
            Linker.MiniSlotController.isBigWin = true;
            // Linker.MiniSlotController.isAutoSpin = false;
            if (Linker.MiniSlotController.isAutoSpin) {
                Linker.MiniSlotController.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(() => {
                    if (Linker.MiniSlotController.isAutoSpin) {
                        Linker.MiniSlotView.thangLonNode.active = false;
                        Linker.MiniSlotController.spinBtnClick();
                    }
                })));
            }
            Linker.MiniSlotView.playBigWinEffect();
            return;
        };
        Linker.MiniSlotController.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
            if (Linker.MiniSlotController.isAutoSpin) {
                Linker.MiniSlotController.spinBtnClick();
            }
        })));

    },
    initGame(data) {
        this.isAutoSpin = false;
        this.isNoHu = false;
        this.isBigWin = false;
        this.isPreeSpin = false;
        this.numberPreeSpin = 0;
        this.resetRotatePos = -186;
        this.resetRotateSpacing = 6;
        this.lostForcus = false;
        this.isFinish = true;
        this.moneyWin = 0;
        //cc.log("Linker.Hu.listHu:",Linker.Hu.listHu);
        //this.idHu = "10"+Linker.Hu.listHu[1][0].id;
        this.idHu = 701; //"10"+Linker.Hu.listHu[1][0].id;
        this.idMach = 0;
        this.lineChoiArray = [];
        this.lineChoiString = this.getLineChoiString(this.getListLineChoiFromToogle(Linker.MiniSlotView.listLine.children));
        this.typeChoi = data.typeChoi;
        this.moneyPerLine = data.moneyPerLine;
        this.typeHu = data.typeHu;
        Linker.MiniSlotView.updateUserMoneyIngame();
        Linker.MiniSlotView.updateMoneyWin(this.moneyWin);
        Linker.MiniSlotView.updateNumberLine(this.lineChoiArray.length);
        Linker.MiniSlotView.updateTypeBtnCuoc(this.typeHu);
        Linker.MiniSlotView.updateIdMatch(this.idMach);
        Linker.MiniSlotView.updateCurrentPotMoney(Linker.MiniSlotController.typeHu);
        Linker.MiniSlotView.updateTypeChoi(Linker.MiniSlotController.typeChoi);
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
        cc.log("Linker.MiniSlotController:", Linker.MiniSlotController);
        cc.log("Linker.MiniSlotController.isFinish:", Linker.MiniSlotController.isFinish);
        if (Linker.MiniSlotController.isFinish) {
            // if (Linker.MiniSlotController.isPreeSpin && Linker.MiniSlotController.isPreeSpin > 0) { //dung cho truong hop free spin
            //     var test = SlotSend.spin(Linker.MiniSlotController.typeChoi, Linker.MiniSlotController.idHu, Linker.MiniSlotController.moneyPerLine, Linker.MiniSlotController.lineChoiString, Linker.MiniSlotController.isPreeSpin);
            // } else {
            var test = SlotSend.spin(Linker.MiniSlotController.typeChoi, Linker.MiniSlotController.idHu, Linker.MiniSlotController.moneyPerLine, Linker.MiniSlotController.lineChoiString, 0);
            //}
            cc.log('SEND HU:', test);
            Linker.Socket.send(test);
            Linker.MiniSlotController.isFinish = false;
            Linker.MiniSlotView.resetUi();
            setTimeout(() => {
                Linker.MiniSlotController.isFinish = true;
            }, 4000);
        } else {
            //cc.log("Spin to fast");
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
                DataAccess.Instance.node.emit("update-user-data", Linker.userData);
            }
        }
    }
    // update (dt) {},
});