var Linker = require('Linker');
var Utils = require('Utils');
var GameConstant = require('GameConstant');
var i18n = require('i18n');
var TQUtil = require('TQUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        bonusDialog: cc.Node,
        lineDialog: cc.Node,
        honoredDialog: cc.Node,
        lichsuchoiDialog: cc.Node,
        gameplay: cc.Node,
        textUserMoneyInGame: cc.Label,
        textMoneyWin: cc.Label,
        textNumberLineInGame: cc.Label,
        textIdMatch: cc.Label,
        textCurrentPlotMoney: cc.Label,
        textSystemMessage: cc.Label,
        textTypeChoi: cc.Label,
        listLine: cc.Node,
        historyContent: cc.Node,
        itemHistoryPrefab: cc.Prefab,
        thangLonNode: cc.Node,
        noHuNode: cc.Node,
        toogleFreeSpin: cc.Toggle,
        tien: cc.Node,
        animationContainer: cc.Node,
        btn100: cc.Node,
        btn1k: cc.Node,
        btn10k: cc.Node,
        btnNext: cc.Node,
        btnBack: cc.Node,
        contentHuongDan: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.MiniSlotView = this;
        this.clock = 0;
        this.lstTien = [{ x: 50, y: 70 },
        { x: 60, y: 80 },
        { x: 70, y: 90 },
        { x: 80, y: 100 },
        { x: 90, y: 110 },
        { x: 100, y: 120 },
        { x: 110, y: 130 },
        { x: 120, y: 140 },
        { x: 130, y: 150 }];
        // this.initPopupDialog();
        this.interValMoneyHu = null;
    },

    onEnable() {
        // this.textCurrentPlotMoney.value = 0;
        // this.textCurrentPlotMoney.string = 0;

        if (Linker.MiniSlotController.typeHu == 1) {
            this.animateValue(Linker.MiniSlotView.textCurrentPlotMoney, 0, Linker.Hu.listHu[GameConstant.IDHUSLOT.idMiniSlot777][0].moneyHu1, 2);
        } else if (Linker.MiniSlotController.typeHu == 2) {
            this.animateValue(Linker.MiniSlotView.textCurrentPlotMoney, 0, Linker.Hu.listHu[GameConstant.IDHUSLOT.idMiniSlot777][0].moneyHu2, 2);
        } else if (Linker.MiniSlotController.typeHu == 3) {
            this.animateValue(Linker.MiniSlotView.textCurrentPlotMoney, 0, Linker.Hu.listHu[GameConstant.IDHUSLOT.idMiniSlot777][0].moneyHu3, 2);
        } else if (!Linker.MiniSlotController.typeHu) {
            this.animateValue(Linker.MiniSlotView.textCurrentPlotMoney, 0, Linker.Hu.listHu[GameConstant.IDHUSLOT.idMiniSlot777][0].moneyHu1, 2);
        }
    },

    initPopupDialog: function () {
        var dialogs = [this.bonusDialog, this.lineDialog, this.honoredDialog, this.lichsuchoiDialog];
        for (let i = 0; i < dialogs.length; i++) {
            if (dialogs[i] && cc.isValid(dialogs[i])) {
                dialogs[i].active = false;
                var c = dialogs[i].getComponent("PopupCenter");
                if (!c) {
                    dialogs[i].addComponent("PopupCenter");
                }
            }
        }
    },
    start() {
        Linker.MiniSlotView.listLine.children.forEach(element => {
            element.getComponent(cc.Toggle).isChecked = false;
        });
    },

    runAnimMoneyHu(money) {
        if(this.interValMoneyHu){
            clearInterval(this.interValMoneyHu);
        }
        this.animateValue(this.textCurrentPlotMoney, this.textCurrentPlotMoney.value, money, 3);
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
        var that = this;
        
        function run() {
            var now = new Date().getTime();
            var remaining = Math.max((endTime - now) / duration, 0);
            var value = Math.round(end - (remaining * range));
            if (label && label.isValid) {
                label.string = TQUtil.addDot(value);
                if (value == end) {
                    if(that.interValMoneyHu){
                        clearInterval(that.interValMoneyHu);
                    }
                }
            } else {
                if(that.interValMoneyHu){
                    clearInterval(that.interValMoneyHu);
                }
            }

        }

        this.interValMoneyHu = setInterval(run, stepTime);
        run();
    },

    updateUserMoneyIngame() {
        this.textUserMoneyInGame.string = Utils.Number.format(Linker.userData.userRealMoney);
        if (Linker.HallView && Linker.HallView.isValid) {
            Linker.HallView.updateUserMoney();
        }
    },
    updateSystemMessage(message) {
        this.textSystemMessage.string = message;
    },
    updateMoneyWin(money) {
        if (money && Number(money) > 0) {
            this.textMoneyWin.node.active = true;
            this.textMoneyWin.node.x = 40.91;
            this.textMoneyWin.node.y = 147.673;
            this.textMoneyWin.getComponent(cc.Label).string = "+" + Utils.Number.format(money);
            this.textMoneyWin.node.runAction(cc.moveBy(0.8, 0, 150));
            setTimeout(() => {
                this.textMoneyWin.node.active = false;
            }, 1200);
        }

    },
    updateNumberLine(number) {
        this.textNumberLineInGame.string = number;
    },
    updateTypeBtnCuoc(type) {
        if (type == 1) {
            this.btn100.getChildByName("on").active = true;
            this.btn1k.getChildByName("on").active = false;
            this.btn10k.getChildByName("on").active = false;
        } else if (type == 2) {
            this.btn100.getChildByName("on").active = false;
            this.btn1k.getChildByName("on").active = true;
            this.btn10k.getChildByName("on").active = false;
        } else if (type == 3) {
            this.btn100.getChildByName("on").active = false;
            this.btn1k.getChildByName("on").active = false;
            this.btn10k.getChildByName("on").active = true;
        } else {

        }



    },
    updateTypeChoi(type) {
        if (type == 0) {
            this.textTypeChoi.string = "Chơi \nthử";
        } else {
            if (type == 1) {
                this.textTypeChoi.string = "Chơi \nthật";
            } else {
                this.textTypeChoi.string = "Miễn \nphí";
            }

        }
    },
    updateTextPreeSpin(number) {
        this.textFreeSpin.string = number;
    },
    updateIdMatch(number) {
        this.textIdMatch.string = "#" + number;
    },
    updateCurrentPotMoney(typePot) {
        switch (typePot) {
            case 1: {
                if (Linker.Hu) {
                    this.runAnimMoneyHu(Linker.Hu.listHu[GameConstant.IDHUSLOT.idMiniSlot777][0].moneyHu1);
                    // this.textCurrentPlotMoney.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idMiniSlot777][0].moneyHu1);
                }
                break;
            }
            case 2: {
                if (Linker.Hu) {
                    this.runAnimMoneyHu(Linker.Hu.listHu[GameConstant.IDHUSLOT.idMiniSlot777][0].moneyHu2);
                    // this.textCurrentPlotMoney.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idMiniSlot777][0].moneyHu2);
                }
                break;
            }
            case 3: {
                if (Linker.Hu) {
                    this.runAnimMoneyHu(Linker.Hu.listHu[GameConstant.IDHUSLOT.idMiniSlot777][0].moneyHu3);
                    // this.textCurrentPlotMoney.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idMiniSlot777][0].moneyHu3);
                }
                break;
            }
        }


    },
    playJackPotEffect() {
        this.noHuNode.active = true;
        var NoHuDialog = this.noHuNode.getComponent(require('MiniSlotNoHuDialog'));
        if (true) {
            NoHuDialog.updateView(Linker.MiniSlotController.moneyWin);
        }

        var winSize = cc.winSize;
        this.animationContainer.removeAllChildren();
        var tempX = (winSize.width / 2) * (-1);
        for (var i = 0; i < 150; i++) {
            var temp = cc.instantiate(this.tien);
            var index = Math.floor(Math.random() * 9);
            temp.width = this.lstTien[index].x;
            temp.height = this.lstTien[index].y;
            temp.rotation = Math.floor(Math.random() * 360);
            temp.active = true;
            var y = Math.floor(winSize.height / 2) - 40;
            // var x=Math.floor(Math.random() * Math.floor(winSize.width/2)) * (Math.round(Math.random()) * 2 - 1);
            var x = tempX;
            tempX = tempX + Math.floor(winSize.width / 140);

            temp.x = 0;
            temp.y = 90;
            temp.scale = 0;
            this.animationContainer.addChild(temp);

            temp.runAction(cc.sequence(cc.delayTime(i * 0.01), cc.moveTo((Math.random() * (2.5200 - 1.120) + 1.0200).toFixed(4), x, -y), cc.moveTo((Math.random() * (2.5200 - 1.120) + 1.0200).toFixed(4), x, -550), cc.callFunc((temp) => {
                temp.destroy();
            })))
            temp.runAction(cc.sequence(cc.delayTime(i * 0.01), cc.scaleTo(2, 1)));
        }
        setTimeout(() => {
            if (this.animationContainer) {
                this.animationContainer.removeAllChildren();
            }
        }, 3500);
    },
    playBigWinEffect() {
        this.thangLonNode.active = true;
        var ThangLonDialog = this.thangLonNode.getComponent(require('MiniSlotThangLonDialog'));
        if (true) {
            ThangLonDialog.updateView(Linker.MiniSlotController.moneyWin);
        }

        var winSize = cc.winSize;
        this.animationContainer.removeAllChildren();
        for (var i = 0; i < 150; i++) {
            var temp = cc.instantiate(this.tien);
            var index = Math.floor(Math.random() * 9);
            temp.width = this.lstTien[index].x;
            temp.height = this.lstTien[index].y;
            temp.rotation = Math.floor(Math.random() * 360);
            temp.active = true;
            temp.y = Math.floor(winSize.height / 2) + 200;
            temp.x = Math.floor(Math.random() * Math.floor(winSize.width / 2)) * (Math.round(Math.random()) * 2 - 1);
            this.animationContainer.addChild(temp);

            temp.runAction(cc.sequence(cc.delayTime((Math.random() * (1.5000 - 0.120) + 0.120).toFixed(4)), cc.moveTo((Math.random() * (2.5200 - 1.120) + 1.0200).toFixed(4), temp.x, -550), cc.callFunc((temp) => {
                temp.destroy();
            })))
        }
        setTimeout(() => {
            if (this.animationContainer) {
                this.animationContainer.removeAllChildren();
            }
        }, 3500);
    },
    showHistoryJackPotDialog(isShow) {
        if (isShow) {
            if (!this.honoredDialog.active) {
                this.honoredDialog.active = true;
            }
            // this.honoredDialog.emit('fade-in', true);
        } else {
            // this.honoredDialog.emit('fade-out');
            this.honoredDialog.active = false;
        }
    },
    showHistoryGameDialog(isShow) {
        if (isShow) {
            if (!this.lichsuchoiDialog.active) {
                this.lichsuchoiDialog.active = true;
            }
            // this.lichsuchoiDialog.emit('fade-in', true);
        } else {
            // this.lichsuchoiDialog.emit('fade-out');
            this.lichsuchoiDialog.active = false;
        }
    },
    showWinBonusDialog(isShow) {
        if (isShow) {
            if (!this.bonusDialog.active) {
                this.bonusDialog.active = true;
            }
            // this.bonusDialog.emit('fade-in', true);
        } else {
            // this.bonusDialog.emit('fade-out');
            this.bonusDialog.active = false;
        }
    },
    showLineDialog(isShow) {
        if (isShow) {
            if (!this.lineDialog.active) {
                this.lineDialog.active = true;
            }
            // this.lineDialog.emit('fade-in', true);
        } else {
            this.lineDialog.active = false;
            // this.lineDialog.emit('fade-out');
        }
    },
    showGamePlay(isShow) {
        if (isShow) {
            if (!this.gameplay.active) {
                this.gameplay.active = true;
            }
            this.gameplay.emit('fade-in', true);
        } else {
            this.gameplay.emit('fade-out');
        }
        this.updateMoneyWin(0);
    },
    updateHistoryJackpot(array) {
        //cc.log("updateHistoryJackpot",array);
        this.historyContent.destroyAllChildren();
        array.forEach((element, pos) => {
            var history = cc.instantiate(Linker.MiniSlotView.itemHistoryPrefab);
            var ItemHistory = history.getComponent(require('ItemHistory'));
            if (ItemHistory) {
                cc.log("ItemHistory element:", element);
                ItemHistory.init(element);
            }
            Linker.MiniSlotView.historyContent.addChild(history);
        });

    },
    resetUi() {
        // this.noHuNode.active = false;
        // this.thangLonNode.active = false;
        Linker.MiniSlotLineCuaAn.resetAllLine();
    },


    update(dt) {
        // this.clock += dt;
        // if (this.clock > 1) {
        //     this.clock = 0;
        //     this.updateUserMoneyLobby();
        // }

    },
});
