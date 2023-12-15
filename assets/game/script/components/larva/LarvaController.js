var SlotSend = require('SlotSend');
var Linker = require('Linker');
var ItemColumnSlotLarva = require('itemColumnSlotLarva');
var Api = require('Api');
var Utils = require('Utils');
var Global = require('Global');
var TQUtil = require('TQUtil');
var GameConstant = require('GameConstant');
var DataAccess = require('DataAccess');

cc.Class({
    extends: cc.Component,

    properties: {
        columnLarvaList: {
            default: [],
            type: ItemColumnSlotLarva
        },
        // columnLarvaSmallList: {
        //     default: [],
        //     type : ItemColumnSlotLarva
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.LarvaController = this;
        // this.resetRotatePos = -257;
        // this.resetRotateSpacing = 6;
        //cc.log(Linker.MINI);
        //cc.director.getScene().getChildByName('Canvas').addChild(Linker.MINI);


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
        this.initGame({
            userMoney: Linker.userData.userMoney,
            moneyPerLine: 100,
            currentPotMoney: Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu1,
            typeChoi: 1,
            typeHu: 1
        });
        Linker.LarvaEventListener.btn10000.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
        Linker.LarvaEventListener.btn_choithu.getChildByName('Background').color = new cc.Color(255, 255, 255, 255);
        Linker.LarvaEventListener.btn1000.getChildByName('Background').color = new cc.Color(102, 102, 102, 255);
        Linker.LarvaEventListener.btn100.getChildByName('Background').color = new cc.Color(255, 255, 255, 255);
        // this.updateHistory();
        // this.updateRank();

    },

    updateHistory() {
        Api.get(Global.configPurchase.API_URL + "api-mini-slot-log/my-log?uid=" + Linker.userData.userId, (data) => {
            if (data) {
                Linker.LarvaView.updateHistoryJackpot(data.datas);
            }
        });

    },

    updateRank() {
        Api.get(Global.configPurchase.API_URL + "api-mini-slot-log", (data) => {
            if (data) {
                Linker.LarvaView.updateRankJackpot(data);
            }

        });
    },

    onEnable() {
        if (Linker.LarvaController.typeHu == 1) {
            this.animateValue(Linker.LarvaView.textCurrentPlotMoney, 0, Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu1, 2);
        } else if (Linker.LarvaController.typeHu == 2) {
            this.animateValue(Linker.LarvaView.textCurrentPlotMoney, 0, Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu2, 2);
        } else if (Linker.LarvaController.typeHu == 3) {
            this.animateValue(Linker.LarvaView.textCurrentPlotMoney, 0, Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu3, 2);
        } else if (!Linker.LarvaController.typeHu) {
            this.animateValue(Linker.LarvaView.textCurrentPlotMoney, 0, Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu1, 2);
        }

    },

    animateValue(label, start, end, duration) {
        label.value = end;
        duration = duration * 1000;
        var range = end - start;
        // no timer shorter than 50ms (not really visible any way)
        var minTimer = 50;
        // calc step time to show all interediate values
        var stepTime = Math.abs(Math.floor(duration / range));

        // never go below minTimer
        stepTime = Math.max(stepTime, minTimer);

        // get current time and calculate desired end time
        var startTime = new Date().getTime();
        var endTime = startTime + duration;
        var timer;

        function run() {
            var now = new Date().getTime();
            var remaining = Math.max((endTime - now) / duration, 0);
            var value = Math.round(end - (remaining * range));
            if(label && label.isValid){
                label.string = TQUtil.addDot(value);
                if (Number(value) == Number(end)) {
                    clearInterval(timer);
                }
            }else{
                clearInterval(timer);
            }
            
        }

        timer = setInterval(run, stepTime);
        run();
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
        colLength = Linker.LarvaController.columnLarvaList[0].itemList.length;
        if (Linker.LarvaController.ingnoreFirstTime !== undefined) {
            for (i = 0; i < Linker.LarvaController.columnLarvaList.length; i += 1) {
                for (var j = 0; j < 3; j += 1) {
                    swapIndex = (colLength - 1) + (j - 2);
                    type = Linker.LarvaController.columnLarvaList[i].itemList[j].type;
                    var id = Linker.LarvaController.columnLarvaList[i].itemList[swapIndex].id;
                    Linker.LarvaController.columnLarvaList[i].itemList[j].setType(type, id);
                }
            }
        }

        // Reset Pos
        if (!Linker.LarvaController.quickSpin) {
            for (i = 0; i < Linker.LarvaController.columnLarvaList.length; i += 1) {
                columnNode = Linker.LarvaController.columnLarvaList[i].node;
                columnNode.stopAllActions();
                columnNode.y = Linker.LarvaController.resetRotatePos;
                arrayDelayTime.push(i * 0.1);
            }
        } else {
            //quick spin nvm
            for (i = 0; i < Linker.LarvaController.columnLarvaList.length; i += 1) {
                columnNode = Linker.LarvaController.columnLarvaList[i].node;
                columnNode.stopAllActions();
                columnNode.y = Linker.LarvaController.resetRotatePos;
                arrayDelayTime.push(i * 0.02);
            }
            
            Linker.LarvaController.moneyWin = message.moneyWin;
            Linker.LarvaView.updateMoneyWin(Linker.LarvaController.moneyWin);
            Linker.LarvaView.updateCurrentPotMoney(Linker.LarvaController.typeHu);
            if (message.noHu == false && message.bigWin == false) {
                Linker.LarvaController.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(() => {
                    if (Linker.LarvaController.isAutoSpin) {
                        Linker.LarvaController.spinBtnClick();
                    }
                })));
            }
        }


        var resultObj = JSON.parse(result[0]);
        // Set Ket Qua
        var col = 0,
            row = 0;
        for (i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                swapIndex = (colLength - 1) - row;
                var itemRongVang = Linker.LarvaController.columnLarvaList[j].itemList[swapIndex];
                itemRongVang.setType(itemRongVang.type, resultObj[j][i]);
                itemRongVang.stopEffect();
                col++;
            }

            row += 1;


        }


        // rotate
        Linker.LarvaController.countRotate = 0;
        // arrayDelayTime = Linker.LarvaController.shuffle(arrayDelayTime);
        for (i = 0; i < Linker.LarvaController.columnLarvaList.length; i += 1) {
            columnNode = Linker.LarvaController.columnLarvaList[i].node;
            var subHeight = columnNode.getContentSize().height - 90 * 4 - 2 * Linker.LarvaController.resetRotateSpacing;
            if (Linker.LarvaController.lostForcus) {
                columnNode.y = columnNode.y - subHeight;
                Linker.LarvaController.countRotate += 1;
                if (Linker.LarvaController.countRotate >= 5) {
                    Linker.LarvaController.isFinish = true;
                    Linker.LarvaView.lineGroup.active = true;
                    Linker.LarvaController.showFinish(message);
                }
            } else {
                var seq = cc.sequence(cc.delayTime(arrayDelayTime[i]), cc.moveTo(1.2, cc.v2(columnNode.x, columnNode.y - subHeight)).easing(cc.easeQuinticActionOut()), cc.callFunc(function () {
                    Linker.LarvaController.countRotate += 1;
                    if (Linker.LarvaController.countRotate >= 5) {
                        Linker.LarvaController.isFinish = true;
                        Linker.LarvaView.lineGroup.active = true;
                        Linker.LarvaController.showFinish(message);
                    }
                }));
                seq.setTag(888);
                columnNode.runAction(seq);
            }
        }
        Linker.LarvaController.ingnoreFirstTime = true;

    },
    checkReelStatus: function () {
        var doneArr = [];
        for (var i = 0; i < Linker.LarvaController.columnLarvaList.length; i++) {
            var columnNode = Linker.LarvaController.columnLarvaList[i].node;
            var status = columnNode.getActionByTag(888);
            if (status) {
                doneArr.push(status.isDone());
            }
        }
        if (doneArr.length > 0) {
            if (doneArr.indexOf(false) != -1) {
                Linker.LarvaController.isFinish = false;
            } else {
                Linker.LarvaController.isFinish = true;
            }
        } else {
            Linker.LarvaController.isFinish = true;
        }
    },
    onSpinResponse(message) {
        if (message.status == 1 && !message.thongBao) {
            // Linker.LarvaController.moneyWin = 0;
            // Linker.LarvaView.updateMoneyWin(Linker.LarvaController.moneyWin);
            Linker.LarvaController.spin(message);
            //cc.log(name);
            if (Linker.LarvaController.isPreeSpin) {
                if (Linker.LarvaController.numberPreeSpin >= 1) {
                    Linker.LarvaController.numberPreeSpin--;
                } else {
                    Linker.LarvaController.isPreeSpin = false;
                    Linker.LarvaController.numberPreeSpin = 0;
                    Linker.LarvaController.typeChoi = 1;
                    //Linker.LarvaController.typeChoi = 2;
                    Linker.LarvaView.updateTypeChoi(Linker.LarvaController.typeChoi);
                }

                Linker.LarvaView.updateTextPreeSpin(Linker.LarvaController.numberPreeSpin);
            }

        } else {
            Linker.LarvaController.isFinish = true;
            if (message.thongBao) {
                cc.Global.showMessage(message.thongBao);
            } else {
                cc.Global.showMessage(message.error);
            }

        }
    },
    onUpdateSlotInfo() {
        if (Linker.Hu && Linker.LarvaView) {
        }
    },
    showFinish(message) {
        DataAccess.Instance.updateData();
        var lstObj = JSON.parse(message.line[0]);
        this.result = [];
        if (!Linker.LarvaController.isAutoSpin) {
            message.lineWin.forEach(element => {
                if (element != "") {
                    JSON.parse(element).forEach(item => {
                        var temp = '';
                        var lot0 = [],
                            lot1 = [],
                            lot2 = [];
                        for (var i = 0; i < 3; i++) {
                            for (var j = 0; j < 3; j++) {
                                if (item[0] == lstObj[i][j] || lstObj[i][j] == 'W') {
                                    var stt = j + 1;
                                    if (i == 0) {
                                        lot0.push(stt);
                                    }
                                    if (i == 1) {
                                        lot1.push(stt);
                                    }
                                    if (i == 2) {
                                        lot2.push(stt);
                                    }
                                }
                            }
                        }

                        for (var i = 0; i < lot0.length; i++) {
                            for (var j = 0; j < lot1.length; j++) {
                                for (var k = 0; k < lot2.length; k++) {
                                    temp = lot0[i] + '' + lot1[j] + '' + lot2[k];
                                    var line = Linker.LarvaView.line.getChildByName(temp);
                                    if (line) {
                                        this.result.push(line);
                                    }
                                }
                            }
                        }
                    });
                }
            });
            var delayTime = [];
            var tongtg = 0;
            for (var i = 0; i < this.result.length; i++) {
                delayTime.push(i * 1.7);
                tongtg = tongtg + (i * 1.7);
            }
            for (var i = 0; i < this.result.length; i++) {
                this.result[i].active = true;
                this.result[i].opacity = 0;
                this.result[i].runAction(cc.sequence(cc.delayTime(delayTime[i]), cc.sequence(cc.fadeIn(.7), cc.delayTime(0.3), cc.fadeOut(.7)), cc.delayTime(tongtg), cc.sequence(cc.fadeIn(.7), cc.delayTime(0.3), cc.fadeOut(.7))));
            }

        }else if(Linker.LarvaController.isAutoSpin && !Linker.LarvaController.quickSpin){
            message.lineWin.forEach(element => {
                if (element != "") {
                    JSON.parse(element).forEach(item => {
                        var temp = '';
                        var lot0 = [],
                            lot1 = [],
                            lot2 = [];
                        for (var i = 0; i < 3; i++) {
                            for (var j = 0; j < 3; j++) {
                                if (item[0] == lstObj[i][j] || lstObj[i][j] == 'W') {
                                    var stt = j + 1;
                                    if (i == 0) {
                                        lot0.push(stt);
                                    }
                                    if (i == 1) {
                                        lot1.push(stt);
                                    }
                                    if (i == 2) {
                                        lot2.push(stt);
                                    }
                                }
                            }
                        }

                        for (var i = 0; i < lot0.length; i++) {
                            for (var j = 0; j < lot1.length; j++) {
                                for (var k = 0; k < lot2.length; k++) {
                                    temp = lot0[i] + '' + lot1[j] + '' + lot2[k];
                                    var line = Linker.LarvaView.line.getChildByName(temp);
                                    if (line) {
                                        this.result.push(line);
                                    }
                                }
                            }
                        }
                    });
                }
            });
            var delayTime = [];
            for (var i = 0; i < this.result.length; i++) {
                delayTime.push(i * 0.5);
            }
            for (var i = 0; i < this.result.length; i++) {
                this.result[i].active = true;
                this.result[i].opacity = 0;
                this.result[i].runAction(cc.sequence(cc.delayTime(delayTime[i]), cc.sequence(cc.fadeIn(.15), cc.delayTime(0.2), cc.fadeOut(.15))));
            }
        }

        Linker.LarvaController.idMach = message.idSpin;
        Linker.LarvaController.moneyWin = message.moneyWin;
        Linker.LarvaView.updateMoneyWin(Linker.LarvaController.moneyWin);
        Linker.LarvaView.updateCurrentPotMoney(Linker.LarvaController.typeHu);
     
        if (message.noHu == true) {
            Linker.LarvaController.isNoHu = true;
            //Linker.LarvaController.isAutoSpin = false;
            //Linker.LarvaEventListener.btn_tuquay.getChildByName('glow2').active = false;
            Linker.LarvaView.playJackPotEffect();
                Linker.LarvaController.node.runAction(cc.sequence(cc.delayTime(4), cc.callFunc(() => {
                    if (Linker.LarvaController.isAutoSpin) {
                        Linker.LarvaView.noHuNode.active=false;
                        Linker.LarvaController.spinBtnClick();
                    }
                })));
            return;
        };
        if (message.bigWin == true) {
            Linker.LarvaController.isBigWin = true;
            //Linker.LarvaController.isAutoSpin = false;
           // Linker.LarvaEventListener.btn_tuquay.getChildByName('glow2').active = false;
            Linker.LarvaView.playBigWinEffect();
                Linker.LarvaController.node.runAction(cc.sequence(cc.delayTime(4), cc.callFunc(() => {
                    if (Linker.LarvaController.isAutoSpin) {
                        Linker.LarvaView.thangLonNode.active=false;
                        Linker.LarvaController.spinBtnClick();
                    }
                })));
            return;
        };
        if (!Linker.LarvaController.quickSpin) {
            Linker.LarvaController.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
                if (Linker.LarvaController.isAutoSpin) {
                    Linker.LarvaController.spinBtnClick();
                }
            })));
        }


    },


    initGame(data) {
        this.isAutoSpin = false;
        this.isNoHu = false;
        this.isBigWin = false;
        this.isPreeSpin = false;
        this.isLiXi = false;
        this.numberLiXi = 0;
        this.numberPreeSpin = 0;
        this.resetRotatePos = -257;
        this.resetRotateSpacing = 6;
        this.lostForcus = false;
        this.isFinish = true;
        this.moneyWin = 0;
        //cc.log("Linker.Hu.listHu:",Linker.Hu.listHu);
        //this.idHu = "10"+Linker.Hu.listHu[1][0].id;
        this.idHu = 101; //"10"+Linker.Hu.listHu[1][0].id;
        this.idMach = 0;
        this.lineChoiArray = [];
        //this.lineChoiString = this.getLineChoiString(this.getListLineChoiFromToogle(Linker.LarvaView.listLine.children));
        this.typeChoi = data.typeChoi;
        this.moneyPerLine = data.moneyPerLine;
        this.typeHu = data.typeHu;
        // Linker.LarvaView.updateUserMoneyIngame();
        // Linker.LarvaView.updateMoneyWin(this.moneyWin);
        // Linker.LarvaView.updateNumberLine(this.lineChoiArray.length);
        // Linker.LarvaView.updateTypeMoney(this.typeHu)
        // Linker.LarvaView.updateIdMatch(this.idMach);

        // Linker.LarvaView.updateTypeChoi(Linker.LarvaController.typeChoi);
        // Linker.LarvaView.updateTextPreeSpin(this.numberPreeSpin);
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
        // Linker.LarvaController.isFinish=true;
        if (Linker.LarvaController.isFinish) {
            Linker.LarvaView.lineGroup.active = false;
            Linker.LarvaView.lineGroup.getChildByName('line').getChildren().forEach(item => {
                item.active = false;
                item.stopAllActions();
            });

            if (Linker.LarvaController.isPreeSpin && Linker.LarvaController.isPreeSpin > 0) { //dung cho truong hop free spin
                var test = SlotSend.spinLarva(Linker.LarvaController.typeChoi, 301, Linker.LarvaController.moneyPerLine, Linker.LarvaController.lineChoiString, Linker.LarvaController.isPreeSpin);
            } else {
                var test = SlotSend.spinLarva(Linker.LarvaController.typeChoi, 301, Linker.LarvaController.moneyPerLine, '1#2#3', 0);
            }
            cc.log('SEND HU:', test);
            Linker.Socket.send(test);
            Linker.LarvaController.isFinish = false;
        } else {
            //check rotation of reels if reels is not runanimtion => auto to set true finish
            this.checkReelStatus();
        }
    },
});