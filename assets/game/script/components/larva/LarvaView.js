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
var GameConstant = require('GameConstant');
var NewAudioManager = require('NewAudioManager');

cc.Class({
    extends: cc.Component,

    properties: {
        bonusDialog: cc.Node,
        historyDialog: cc.Node,
        rankDialog: cc.Node,
        // gameplay: cc.Node,
        // textUserMoneyLobby: cc.Label,
        // textUserMoneyInGame: cc.Label,
        textMoneyWin: cc.Label,
        // textNumberLineInGame: cc.Label,
        // textTypeMoney: cc.Label,
        // textIdMatch: cc.Label,
        textCurrentPlotMoney: cc.Label,
        // textMoneyHu1: cc.Label,
        // textMoneyHu2: cc.Label,
        // textMoneyHu3: cc.Label,
        // textSystemMessage: cc.Label,
        // textTypeChoi: cc.Label,
        // listLine: cc.Node,
        historyContent: cc.Node,
        itemHistoryPrefab: cc.Prefab,
        rankContent: cc.Node,
        lineNgan: cc.Node,
        lineGroup: cc.Node,
        line: cc.Node,
        thangLonNode: cc.Node,
        noHuNode: cc.Node,
        // textFreeSpin: cc.Label,
        // toogleFreeSpin: cc.Toggle,


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.LarvaView = this;
        this.clock = 0;
        this.lineNgan.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(.7), cc.delayTime(0.3), cc.fadeIn(.7))));
        this.line.getChildren().forEach(item => {
            //item.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(.7), cc.delayTime(0.3), cc.fadeIn(.7))));
            item.active = false;
        });
        // this.line.getChildByName('131').active=true;
        // this.line.getChildByName('131').runAction(cc.repeatForever(cc.sequence(cc.fadeOut(.7), cc.delayTime(0.3), cc.fadeIn(.7))));
        this.initPopupDialog();
    },
    initPopupDialog: function () {
        var dialogs = [this.bonusDialog, this.rankDialog, this.historyDialog];
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
    onEnable() {
        this.textCurrentPlotMoney.value = 0;
        this.textCurrentPlotMoney.string = 0;

    },

    start() {
        // this.updateAllPotMoney();
        // this.updateUserMoneyLobby();
        // Linker.LarvaView.listLine.children.forEach(element => {
        //     element.getComponent(cc.Toggle).isChecked = false;
        // });
    },
    updateAllPotMoney() {
        if (Linker.Hu) {
            this.textMoneyHu1.string = Utils.Number.format(Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu1);
        }

    },
    updateUserMoneyIngame() {
        this.textUserMoneyInGame.string = Utils.Number.format(Linker.userData.userMoney);
    },
    updateUserMoneyLobby() {
        this.textUserMoneyLobby.string = Utils.Number.format(Linker.userData.userMoney);

    },
    updateSystemMessage(message) {
        this.textSystemMessage.string = message;
    },
    updateMoneyWin(money) {
        if (money && Number(money) > 0) {
            this.textMoneyWin.node.x = 0;
            this.textMoneyWin.node.y = -100;
            this.textMoneyWin.node.active = true;
            this.textMoneyWin.node.runAction(cc.moveTo(0.2, 0, 50));

            this.textMoneyWin.string = '+ ' + Utils.Number.format(money);
            setTimeout(() => {
                this.textMoneyWin.node.active = false;
            }, 1200);
        }

        if (Linker.ThuyCungView && Linker.ThuyCungView.isValid) {
            if (Linker.ThuyCungView.node.active) {
                Linker.ThuyCungView.updateUserMoneyIngame();
                Linker.ThuyCungView.updateUserMoneyLobby();
            }
        }
        if (Linker.TaThanView && Linker.TaThanView.isValid) {
            if (Linker.TaThanView.node.active) {
                Linker.TaThanView.updateUserMoneyIngame();
                Linker.TaThanView.updateUserMoneyLobby();
            }
        }
        if (Linker.TayDuKyView && Linker.TayDuKyView.isValid) {
            if (Linker.TayDuKyView.node.active) {
                Linker.TayDuKyView.updateUserMoneyIngame();
                Linker.TayDuKyView.updateUserMoneyLobby();
            }
        }
        if (Linker.LongThanView && Linker.LongThanView.isValid) {
            if (Linker.LongThanView.node.active) {
                Linker.LongThanView.updateUserMoneyIngame();
                Linker.LongThanView.updateUserMoneyLobby();
            }
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
            this.textTypeChoi.string = "Chơi thử";
        } else {
            if (type == 1) {
                this.textTypeChoi.string = "Chơi thật";
            } else {
                this.textTypeChoi.string = "Miễn phí";
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
                    Linker.LarvaController.animateValue(Linker.LarvaView.textCurrentPlotMoney, Linker.LarvaView.textCurrentPlotMoney.value, Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu1, 2);
                }
                break;
            }
            case 2: {
                if (Linker.Hu) {
                    Linker.LarvaController.animateValue(Linker.LarvaView.textCurrentPlotMoney, Linker.LarvaView.textCurrentPlotMoney.value, Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu2, 2);
                }
                break;
            }
            case 3: {
                if (Linker.Hu) {
                    Linker.LarvaController.animateValue(Linker.LarvaView.textCurrentPlotMoney, Linker.LarvaView.textCurrentPlotMoney.value, Linker.Hu.listHu[GameConstant.IDHUSLOT.idLarva][0].moneyHu3, 2);
                }
                break;
            }
        }


    },
    playJackPotEffect() {
        this.noHuNode.active = true;
        var NoHuDialog = this.noHuNode.getComponent(require('NoHuDialog'));
        if (NoHuDialog) {
            NoHuDialog.updateView(Linker.LarvaController.moneyWin);
            NewAudioManager.PlayUrl(Linker.gameLanguage=="vi"?NewAudioManager.SOUND_GAME.BIDA.VI.COFFER:NewAudioManager.SOUND_GAME.BIDA.EN.COFFER);
        }
    },
    playBigWinEffect() {
        this.thangLonNode.active = true;
        var ThangLonDialog = this.thangLonNode.getComponent(require('ThangLonDialog'));
        if (ThangLonDialog) {
            ThangLonDialog.updateView(Linker.LarvaController.moneyWin);
            NewAudioManager.PlayUrl(Linker.gameLanguage=="vi"?NewAudioManager.SOUND_GAME.BIDA.VI.COFFER:NewAudioManager.SOUND_GAME.BIDA.EN.COFFER);
        }
    },
    playLiXiEffect() {
        this.lixiNode.active = true;
        var LiXiDialog = this.lixiNode.getComponent(require('LarvaLiXiDialog'));
        if (true) {
            LiXiDialog.updateView(Linker.LarvaController.numberLiXi);
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
            // this.historyDialog.emit('fade-in');
        } else {
            this.historyDialog.active = false;
            // this.historyDialog.emit('fade-out');
        }
    },
    showRankJackPotDialog(isShow) {
        if (isShow) {
            if (!this.rankDialog.active) {
                this.rankDialog.active = true;
            }
            // this.rankDialog.emit('fade-in');
        } else {
            this.rankDialog.active = false;
            // this.rankDialog.emit('fade-out');
        }
    },
    showWinBonusDialog(isShow) {
        if (isShow) {
            if (!this.bonusDialog.active) {
                this.bonusDialog.active = true;
            }
            // this.bonusDialog.emit('fade-in');
        } else {
            this.bonusDialog.active = false;
            // this.bonusDialog.emit('fade-out');
        }
    },
    showLineDialog(isShow) {
        if (isShow) {
            if (!this.lineDialog.active) {
                this.lineDialog.active = true;
            }
            // this.lineDialog.emit('fade-in');
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
        Linker.LarvaView.historyContent.removeAllChildren();
        array.forEach((element, pos) => {
            var history = cc.instantiate(Linker.LarvaView.itemHistoryPrefab);
            var ItemHistory = history.getComponent(require('ItemHistory'));
            if (ItemHistory) {
                cc.log("ItemHistory element1:", element);
                ItemHistory.init(element);
            }
            Linker.LarvaView.historyContent.addChild(history);
        });

    },
    updateRankJackpot(array) {
        //cc.log("updateHistoryJackpot",array);
        Linker.LarvaView.rankContent.removeAllChildren();
        array.forEach((element, pos) => {
            var history = cc.instantiate(Linker.LarvaView.itemHistoryPrefab);
            var ItemHistory = history.getComponent(require('ItemHistory'));
            if (ItemHistory) {
                cc.log("ItemHistory element2:", element);
                ItemHistory.init(element);
            }
            Linker.LarvaView.rankContent.addChild(history);
        });

    },
    resetUi() {
        // this.lixiNode.active = false;
        // this.noHuNode.active = false;
        // this.thangLonNode.active = false;
        Linker.LineCuaAn.resetAllLine();
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