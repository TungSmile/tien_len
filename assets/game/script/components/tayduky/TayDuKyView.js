var Linker = require('Linker');
var Utils = require('Utils');
var GameConstant = require('GameConstant');
var TQUtil = require('TQUtil');
var i18n = require('i18n');

cc.Class({
    extends: cc.Component,

    properties: {
        lobbyContainer: cc.Node,
        bonusDialog: cc.Node,
        lineDialog: cc.Node,
        historyDialog: cc.Node,
        lichsuchoiDialog: cc.Node,
        gameplay: cc.Node,
        textUserMoneyLobby: cc.Label,
        textUserMoneyInGame: cc.Label,
        textMoneyWin: cc.Label,
        textNumberLineInGame: cc.Label,
        textTypeMoney: cc.Label,
        textIdMatch: cc.Label,
        textCurrentPlotMoney: cc.Label,
        textMoneyHu1: cc.Label,
        textMoneyHu2: cc.Label,
        textMoneyHu3: cc.Label,
        textSystemMessage: cc.Label,
        textTypeChoi: cc.Label,
        listLine: cc.Node,
        historyContent: cc.Node,
        itemHistoryPrefab: cc.Prefab,
        thangLonNode: cc.Node,
        noHuNode: cc.Node,
        lixiNode: cc.Node,
        textFreeSpin: cc.Label,
        toogleFreeSpin: cc.Toggle,
        tien: cc.Node,
        animationContainer: cc.Node,
        notifyPrefab: cc.Prefab

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.TayDuKyView = this;
        this.interValMoneyHu = null;
        this.clock = 0;
        this.lstTien=[{x:50,y:70},
            {x:60,y:80},
            {x:70,y:90},
            {x:80,y:100},
            {x:90,y:110},
            {x:100,y:120},
            {x:110,y:130},
            {x:120,y:140},
            {x:130,y:150}]
        
        // var node = cc.find("Canvas/Tay_Du_Ky/lobbyContainer/notifyNode/thongbaoContainer");
        // if (!node) {
        //     var notifyPrefab = cc.instantiate(this.notifyPrefab);
        //     var textNotify = notifyPrefab.getChildByName('text_thongbao');
        //     textNotify.getComponent(cc.Label).string = Linker.notifyText;
        //     notifyPrefab.position = cc.v2(0,0);
        //     cc.find("Canvas/Tay_Du_Ky/lobbyContainer/notifyNode").addChild(notifyPrefab);
        // }
    },

    onEnable () {
        this.textCurrentPlotMoney.value = 0;
        this.textCurrentPlotMoney.string = 0;
    },

    start() {
        this.updateAllPotMoney();
        this.updateUserMoneyLobby();
        Linker.TayDuKyView.listLine.children.forEach(element => {
            element.getComponent(cc.Toggle).isChecked = false;
        });
    },
    updateAllPotMoney() {
        if (Linker.Hu) {
            this.textMoneyHu1.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu1);
            this.textMoneyHu2.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu2);
            this.textMoneyHu3.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu3);
        }

    },
    updateUserMoneyIngame() {
        this.textUserMoneyInGame.string = Utils.Number.abbreviate(Number(Linker.userData.userRealMoney));
    },
    updateUserMoneyLobby() {
        this.textUserMoneyLobby.string = Utils.Number.abbreviate(Number(Linker.userData.userRealMoney));

    },
    updateSystemMessage(message) {
        this.textSystemMessage.string = message;
    },
    updateMoneyWin(money) {
        if (money) {
            this.textMoneyWin.string = Utils.Number.format(money);
        }

    },
    updateNumberLine(number) {
        this.textNumberLineInGame.string = number;
    },
    updateTypeMoney(type) {
        if (type == 1) {
            this.textTypeMoney.string = 100;
        } else {
            if (type == 2) {
                this.textTypeMoney.string = 1000;
            } else {
                if (type == 3) {
                    this.textTypeMoney.string = 10000;
                } else {

                }
            }
        }

    },
    updateTypeChoi(type) {
        if (type == 0) {
            this.textTypeChoi.string = i18n.t("tdk_type_play_test");
        } else {
            if (type == 1) {
                this.textTypeChoi.string = i18n.t("tdk_type_play_money");;
            } else {
                this.textTypeChoi.string = i18n.t("tdk_type_play_free");;
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
                    this.runAnimMoneyHu(Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu1);
                    // this.textCurrentPlotMoney.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu1);
                }
                break;
            }
            case 2: {
                if (Linker.Hu) {
                    this.runAnimMoneyHu(Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu2);
                    // this.textCurrentPlotMoney.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu2);
                }
                break;
            }
            case 3: {
                if (Linker.Hu) {
                    this.runAnimMoneyHu(Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu3);
                    // this.textCurrentPlotMoney.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idThinhKinh][0].moneyHu3);
                }
                break;
            }
        }


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
    playJackPotEffect() {
        this.noHuNode.active = true;
        var NoHuDialog = this.noHuNode.getComponent(require('NoHuDialog'));
        if (true) {
            NoHuDialog.updateView(Linker.TayDuKyController.moneyWin);
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
        var ThangLonDialog = this.thangLonNode.getComponent(require('ThangLonDialog'));
        if (true) {
            ThangLonDialog.updateView(Linker.TayDuKyController.moneyWin);
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
    playLiXiEffect() {
        this.lixiNode.active = true;
        var LiXiDialog = this.lixiNode.getComponent(require('TayDuKyLiXiDialog'));
        if (true) {
            LiXiDialog.updateView(Linker.TayDuKyController.numberLiXi);
        }
    },
    playOpenLiXiEffect(node) {
        // this.thangLonNode.active = true;
    },
    showHistoryJackPotDialog(isShow) {
        if (isShow) {
            if (!this.historyDialog.active) {
                this.historyDialog.active = true;
            }
            this.historyDialog.emit('fade-in');
        } else {
            this.historyDialog.emit('fade-out');
        }
    },
    showHistoryGameDialog(isShow) {
        if (isShow) {
            if (!this.lichsuchoiDialog.active) {
                this.lichsuchoiDialog.active = true;
            }
            this.lichsuchoiDialog.emit('fade-in');
        } else {
            this.lichsuchoiDialog.emit('fade-out');
        }
    },
    showWinBonusDialog(isShow) {
        if (isShow) {
            if (!this.bonusDialog.active) {
                this.bonusDialog.active = true;
            }
            this.bonusDialog.emit('fade-in');
        } else {
            this.bonusDialog.emit('fade-out');
        }
    },
    showLineDialog(isShow) {
        if (isShow) {
            if (!this.lineDialog.active) {
                this.lineDialog.active = true;
            }
            this.lineDialog.emit('fade-in');
        } else {
            this.lineDialog.emit('fade-out');
        }
    },
    showGamePlay(isShow) {
        if (isShow) {
            if (!this.gameplay.active) {
                this.gameplay.active = true;
            }
            this.gameplay.emit('fade-in');
        } else {
            this.gameplay.emit('fade-out');
        }
        this.updateMoneyWin(0);
    },
    showLobby(isShow) {
        if (isShow) {
            if (!this.lobbyContainer.active) {
                this.lobbyContainer.active = true;
            }
            this.lobbyContainer.emit('fade-in');
        } else {
            this.lobbyContainer.emit('fade-out');
        }
    },
    updateHistoryJackpot(array) {
        //cc.log("updateHistoryJackpot",array);
        array.forEach((element, pos) => {
            var history = cc.instantiate(Linker.TayDuKyView.itemHistoryPrefab);
            var ItemHistory = history.getComponent(require('ItemHistory'));
            if (ItemHistory) {
                cc.log("ItemHistory element:", element);
                ItemHistory.init(element);
            }
            Linker.TayDuKyView.historyContent.addChild(history);
        });

    },
    resetUi() {
        // this.lixiNode.active = false;
        // this.noHuNode.active = false;
        // this.thangLonNode.active = false;
        Linker.TayDuKyLineCuaAn.resetAllLine();
    },


    update(dt) {
        // this.clock += dt;
        // if (this.clock > 1) {
        //     this.clock = 0;
        //     this.updateAllPotMoney();
        //     this.updateUserMoneyLobby();
        // }

    },
});
