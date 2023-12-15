var Linker = require('Linker');
var PhomConstant = require('PhomConstant');
var PokerPlayer = require('PokerPlayer');
var CommonSend = require('CommonSend');
var PokerSend = require('PokerSend');
var Utils = require('Utils');
var PokerEffect = require('PokerEffect');
var Constant = require('Constant');
var XocDiaSend = require('XocDiaSend');
var NodePoolManager = require('NodePoolManager');
var SceneManager = require('SceneManager');
var LobbySend = require('LobbySend');
var SocketConstant = require('SocketConstant');
var NewAudioManager = require('NewAudioManager');
var i18n = require('i18n');

var PokerController = cc.Class({
    extends: cc.Component,
    ctor() {

    },
    properties: {
        player1: PokerPlayer,
        player2: PokerPlayer,
        player3: PokerPlayer,
        player4: PokerPlayer,
        player5: PokerPlayer,
        player6: PokerPlayer,
        player7: PokerPlayer,
        player8: PokerPlayer,
        player9: PokerPlayer,

        textTableIndex: cc.Label,
        textMatchId: cc.Label,
        textMinBet: cc.Label,
        theoBtn: cc.Node,
        toBtn: cc.Node,
        upBtn: cc.Node,
        xemBtn: cc.Node,
        btnGroup: cc.Node,
        timeCountLabel: cc.Node,
        cardContainer: cc.Node,
        bringMoney: cc.Label,
        toMoney: cc.Label,
        bringMoneyPopup: cc.Node,
        maxMoneyBring: cc.Label,
        minMoneyBring: cc.Label,
        tempCardAnimation: cc.Node,
        tempCard: cc.Prefab,
        totalMoneyTable: cc.Node,
        popupTo: cc.Node,
        // Chat feature
        pnChat: cc.Node,
        srcChat: cc.ScrollView,
        edbChat: cc.EditBox,
        ChatDialog: cc.Prefab,
        DialogContent: cc.Prefab,
        blockEventNode: cc.Node,
        animationNode: cc.Node,

        PokerNode: cc.Node,
        settingNode: cc.Node,
        wififSignalSprite: cc.Sprite,
        wifiSignalImage: [cc.SpriteFrame],
        progressPopupTo: cc.Node,
        btnShowTo: cc.Node
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        NewAudioManager.playAudioSource("joinboard");
        var that = this;
        cc.find('Canvas').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            Linker.lastTimeManipulation = new Date().getTime();
        }, that.node);
        Linker.PokerController = this;
        Linker.redirectOnReconnect = '';
        this.sortType = 0;
        // NodePoolManager.MiniGame.getNodePool();
        this.addCustomEventListener();
        // NodePoolManager.TopHu.getNodePool();
        // if(cc.find('Canvas/TopHu')){
        //     cc.find('Canvas/TopHu').getChildByName('Container').active=false;
        // }
    },

    start: function () {
        var data = this.data;
        if (data) {
            Linker.PokerController = this;
            this.isReconnect = true;
            this.makeCardLower = true;
            this.comingCard = [];
            this.previousTurnHaveCard = []; //turn trc đó có đánh bài ko bỏ lượt
            this.interval = null;
            this.endInterval = false;
            this.bringMoneyPopup.active = false;

            this.toMoney.getComponent(cc.Label).string = 0;
            this.popupTo.active = false;
            this.btnGroup.active = false;
            this.withDrawMoney = false;
            this.tiendetheo = null;

            this.minToVal = 0;

            this.autoWithDraw = true;
            //cc.find('Canvas/Poker/btn_chat').active = false;

            Linker.PokerController.reconnectDialog = cc.instantiate(this.DialogContent);
            if (cc.find('Canvas') && Linker.PokerController.reconnectDialog) {
                cc.find('Canvas').addChild(Linker.PokerController.reconnectDialog);
                cc.find('Canvas/DialogLosConnect').active = false;
                Linker.PokerController.reconnectDialog.active = false;
            }

            if (Linker.reconnectLostNetwork) {
                var data = LobbySend.guestJoinRequest(Linker.reconnectLostNetwork);
                Linker.Socket.send(data);
                Linker.reconnectLostNetwork = null;
            }
            this.addSocketEvent();
            this.ChatPrivateNode = null;
            this.sortType = 0;
            // NodePoolManager.MiniGame.getNodePool();
            // var topHu = cc.find('Canvas/TopHu');
            // if (topHu) {
            //     topHu.active = false;
            //     var tophuContainer = topHu.getChildByName('TopHuContainer');
            //     tophuContainer.getChildByName('Container').active = false;
            // }
            if (Linker.joinInviteData) {
                cc.error("Request invite game...", data);
                var data = LobbySend.joinTableRequest(Number(Linker.joinInviteData.matchID));
                Linker.Socket.send(data);
            } else {
                if (data.tableData) {
                    this.betMoney = this.data.tableData.firstCashBet;
                    this.minMoneyVal = Number(this.betMoney) * 10;
                    this.maxMoneyVal = Number(this.betMoney) * 50;
                    if (this.minMoneyVal) {
                        this.bringMoneyVal = this.minMoneyVal;
                    }

                    if (this.data.tableData.firstCashBet) {
                        if (!Linker.CURRENT_TABLE || !Linker.CURRENT_TABLE.isJoin) {
                            this.player1.resetShowSit();
                            this.player2.resetShowSit();
                            this.player3.resetShowSit();
                            this.player4.resetShowSit();
                            this.player5.resetShowSit();
                            this.player6.resetShowSit();
                            this.player7.resetShowSit();
                            this.player8.resetShowSit();
                            this.player9.resetShowSit();
                        }

                        this.textMinBet.string = i18n.t("game_title_bet", {
                            n: this.data.tableData.firstCashBet
                        });
                        this.textTableIndex.string = i18n.t("game_title_room", {
                            n: ""
                        });
                        this.textMatchId.string = i18n.t("game_title_match", {
                            n: ""
                        });
                        this.minMoneyBring.string = Utils.Number.format(Number(this.data.tableData.firstCashBet) * 10);
                        this.maxMoneyBring.string = Utils.Number.format(Number(this.data.tableData.firstCashBet) * 50);
                        this.bringMoney.getComponent(cc.Label).string = this.minMoneyVal;
                    }

                    if (this.betMoney) {
                        this.totalMoneyTable.getComponent(cc.Label).string = Utils.Number.format(Number(this.betMoney));
                    }

                    if (data.isReconnect) {
                        this.isReconnect = true;
                        cc.error("Request reconnect game...", data);
                        this.requestJoinGame(data.tableData);
                        //thuc hien send reconnect signal
                    } else if (data.isCreate) {
                        cc.error("Request create game...", data);
                        //tao ban binh thuong bao gom ca create va join
                        // this.requestCreateGame(data.tableData);
                        // đối với game liêng, hoặc poker, người chơi phải ngồi, và setting số tiền mang theo mới được request create game hix.
                        //do đó vẫn phải hiện bàn chơi lên hix
                        this.node.opacity = 255;
                        this.unBlockAllEvent();
                        this.lockTableEvent(true);
                    } else if (data.isJoin) {
                        cc.error("Request join game...", data);
                        this.requestJoinGame(data.tableData);
                        this.node.opacity = 255;
                        this.unBlockAllEvent();
                        this.lockTableEvent(true);
                        this.textMatchId.string = i18n.t("game_title_match", {
                            n: data.tableData.matchId
                        });
                        this.textTableIndex.string = i18n.t("game_title_room", {
                            n: data.tableData.pos
                        });
                    }
                } else {
                    if (data.isQuickPlayLobby) {
                        this.requestQuickPlay();
                    }
                }
            }



        } else {
            this.data = null;
        }
    },

    onEnable: function () {
        this.schedule(this.setWifiStatus);
    },
    onDisable() {
        this.unschedule(this.setWifiStatus);
    },

    onDestroy() {
        NewAudioManager.playAudioSource("leaveboard");
        this.removeSocketEvent();

        if (this.timeOutEndEffect) {
            clearTimeout(this.timeOutEndEffect);
        }
        if (this.timeOutEndLogic) {
            clearTimeout(this.timeOutEndLogic);
        }
        if (this.timeOutStart) {
            clearTimeout(this.timeOutStart);
        }
    },

    sliderBringMoney(slider) {
        this.bringMoney.getComponent(cc.Label).string = Math.round(((this.maxMoneyVal - this.minMoneyVal) * slider.progress) + this.minMoneyVal);
    },

    init: function (data) {
        if (data) {
            this.data = data;
            Linker.CURRENT_TABLE = {
                isCreate: data.isCreate,
                isJoin: data.isJoin,
                isReconnect: data.isReconnect,
                tableId: null,
                tableData: data.tableData ? data.tableData : {}
            }
        } else {
            this.data = null;
        }
    },

    requestCreateGame: function (tableData) {
        var data = LobbySend.guestJoinRequest(tableData.matchId);
        Linker.Socket.send(data);
    },
    requestJoinGame: function (tableData) {
        cc.log("vao roi", tableData)
        var data = LobbySend.guestJoinRequest(tableData.matchId);
        Linker.Socket.send(data);
    },

    requestQuickPlay: function () {
        if (Linker.ZONE) {
            Linker.Socket.send(LobbySend.fastPlayRequest(Linker.ZONE));
        } else {
            cc.error("Không thể join game random, please try again...", Linker);
        }
    },

    showPokerGame: function (message) {
        Linker._sceneTag = Constant.TAG.scenes.GAME
        this.node.opacity = 255;
        this.unBlockAllEvent();
        this.lockTableEvent(true);

        NewAudioManager.playAudioSource("joinboard");
        var that = this;
        cc.find('Canvas').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            Linker.lastTimeManipulation = new Date().getTime();
        }, that.node);
    },

    lockTableEvent: function (enable) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_ITEM_BAN_YEU_CAU_BLOCK_SU_KIEN_CLICK, true);
        customEvent.enableBlock = enable;
        this.node.dispatchEvent(customEvent);
    },

    blockAllEvent: function () {
        this.blockEventNode.active = true;
    },
    unBlockAllEvent: function () {
        this.blockEventNode.active = false;
    },

    sliderToMoney(slider) {
        this.toMoney.node.parent.y = slider.node.getChildByName('Handle').y + 60;
        this.toMoney.getComponent(cc.Label).string = Math.round(((Linker.PokerController.bringMoneyVal - this.minToVal) * slider.progress ) + this.minToVal);
        if (this.toMoney.getComponent(cc.Label).string == this.minToVal) {
            this.toBtn.getComponent(cc.Button).interactable = false;
            this.toBtn.opacity = 150;
        } else {
            this.toBtn.getComponent(cc.Button).interactable = true;
            this.toBtn.opacity = 255;
        }
    },

    showBringMoney() {
        this.bringMoneyPopup.active = !this.bringMoneyPopup.active;
        if (this.bringMoneyPopup.active) {
            this.bringMoneyPopup.getChildByName('slider').getComponent(cc.Slider).progress = 0.5;
            this.bringMoney.getComponent(cc.Label).string = Math.round(((this.maxMoneyVal - this.minMoneyVal) * 0.5) + this.minMoneyVal);
            this.withDrawMoney = true;
        } else {
            this.withDrawMoney = false;
        }
    },

    hideBringMoney() {
        this.bringMoneyPopup.active = false;
        this.withDrawMoney = false;
    },

    bringMoneyToTable() {
        var money = Number(this.bringMoney.string);
        if (money > Linker.userData.userRealMoney) {
            Linker.showMessage(i18n.t("Số tiền mang vào không thể lớn hơn số tiền hiện có!"));
            return;
        }
        if (this.withDrawMoney) {
            var data = PokerSend.WithdrawMoneyRequest(this.tableId, money);
            Linker.Socket.send(data);
            this.listPlayerNode[this.myIndex].player.userMoney = money;
            this.listPlayerNode[this.myIndex].moneyPlayer.string = Utils.Number.format(money.toString());
            this.withDrawMoney = false;
            this.bringMoneyPopup.active = false;
            return;
        }
        this.bringMoneyPopup.active = false;
        this.player1.showSit(false);
        this.player2.showSit(false);
        this.player3.showSit(false);
        this.player4.showSit(false);
        this.player5.showSit(false);
        this.player6.showSit(false);
        this.player7.showSit(false);
        this.player8.showSit(false);
        this.player9.showSit(false);
        this.bringMoneyVal = money;
        if (Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.isJoin) {
            var data = PokerSend.joinTableRequest(this.tableId, money);
            Linker.Socket.send(data);
            return;
        } else {
            var data = LobbySend.createTableRequest(0, 0, this.data.tableData.firstCashBet, 0);
            Linker.Socket.send(data);
            this.data.tableData.firstCashBet = null;
            return;
        }
    },

    autoWithDrawToggle(toggle) {
        this.autoWithDraw = toggle.isChecked;
    },

    sitClick() {
        this.bringMoneyPopup.active = true;
        this.bringMoneyPopup.getChildByName('slider').getComponent(cc.Slider).progress = 0.5;
        this.bringMoney.getComponent(cc.Label).string = Math.round(((this.maxMoneyVal - this.minMoneyVal) * 0.5) + this.minMoneyVal);
    },

    toClick() {
        if (this.popupTo.active) {
            var data = PokerSend.SendMoneyRequest(this.tableId, this.toMoney.getComponent(cc.Label).string);
            Linker.Socket.send(data);
            this.popupTo.active = false;
            this.toMoney.getComponent(cc.Label).string = 0;
        } else {
            this.resetToPopup();
        }
    },

    showToClick() {
        this.popupTo.active = !this.popupTo.active;
    },

    resetToPopup() {
        this.popupTo.getChildByName('sliderTo').getComponent(cc.Slider).progress = 0;
        this.toMoney.getComponent(cc.Label).string = 0;
        this.toBtn.getComponent(cc.Button).interactable = false;
        this.toBtn.opacity = 150;
        this.toMoney.node.parent.y = -75;
        this.popupTo.scale = 0;
        this.popupTo.active = true;
        this.popupTo.runAction(cc.sequence(cc.scaleTo(0.1, 1.5), cc.scaleTo(0.1, 1)));
        this.popupTo.getChildByName('sliderTo').getChildByName('Handle').x = 0;
        this.popupTo.getChildByName('sliderTo').getChildByName('Handle').y = -135;
        this.progressPopupTo.getComponent("SpriteExtend").fillRange = 0;
        this.minToVal = 0;
    },

    theoClick() {
        this.btnGroup.active = false;
        if (this.tiendetheo) {
            // if (Number(this.listPlayerNode[this.myIndex].player.userMoney) < Number(this.tiendetheo)) {
            //     Linker.showMessage('Bạn không đủ tiền để theo!');
            //     return;
            // }
        }
        var data = PokerSend.SendMoneyRequest(this.tableId, 0);
        Linker.Socket.send(data);
        this.popupTo.active = false;
    },

    xemClick() {
        this.btnGroup.active = false;
        var data = PokerSend.SendMoneyRequest(this.tableId, 0);
        Linker.Socket.send(data);
        this.popupTo.active = false;
    },

    upClick() {
        this.btnGroup.active = false;
        var data = PokerSend.SendMoneyRequest(this.tableId, -1);
        Linker.Socket.send(data);
        this.popupTo.active = false;
    },

    moneyUpClick() {
        // sliderToMoney
        var slider = this.popupTo.getChildByName('sliderTo').getComponent(cc.Slider);
        var proc = Math.round(slider.progress * 10);
        slider.progress = proc / 10;
        this.progressPopupTo.getComponent("SpriteExtend").fillRange = slider.progress;
        if (slider.progress == 1) {
            return;
        }
        slider.progress = slider.progress + 0.1;

        this.toMoney.node.parent.y = slider.node.getChildByName('Handle').y + 60;
        if (this.round_to_precision((Linker.PokerController.bringMoneyVal - this.minToVal) * slider.progress + this.minToVal, 100) > Linker.PokerController.bringMoneyVal) {
            this.toMoney.getComponent(cc.Label).string = Linker.PokerController.bringMoneyVal;
        } else {
            this.toMoney.getComponent(cc.Label).string = this.round_to_precision((Linker.PokerController.bringMoneyVal - this.minToVal) * slider.progress + this.minToVal, 100);
        }
        if (this.toMoney.getComponent(cc.Label).string == this.minToVal) {
            this.toBtn.getComponent(cc.Button).interactable = false;
            this.toBtn.opacity = 150;
        } else {
            this.toBtn.getComponent(cc.Button).interactable = true;
            this.toBtn.opacity = 255;
        }
    },

    moneyDownClick() {
        var slider = this.popupTo.getChildByName('sliderTo').getComponent(cc.Slider);
        var proc = Math.round(slider.progress * 10);
        slider.progress = proc / 10;
        this.progressPopupTo.getComponent("SpriteExtend").fillRange = slider.progress;
        if (slider.progress == 0) {
            return;
        }
        slider.progress = slider.progress - 0.1;

        this.toMoney.node.parent.y = slider.node.getChildByName('Handle').y + 60;
        this.toMoney.getComponent(cc.Label).string = this.round_to_precision((Linker.PokerController.bringMoneyVal - this.minToVal) * slider.progress + this.minToVal, 100);
        if (this.toMoney.getComponent(cc.Label).string == this.minToVal) {
            this.toBtn.getComponent(cc.Button).interactable = false;
            this.toBtn.opacity = 150;
        } else {
            this.toBtn.getComponent(cc.Button).interactable = true;
            this.toBtn.opacity = 255;
        }
    },

    round_to_precision(x, precision) {
        var y = +x + (precision === undefined ? 0.5 : precision / 2);
        return y - (y % (precision === undefined ? 1 : +precision));
    },

    settingBtnClick() {
        //cc.find("Canvas/Setting").active = true;
        this.settingNode.active = true;
    },
    backHandlerBtn: function (event) {
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.backspace) {
            this.backBtn();
        }
    },
    backBtn() {
        // if (!Linker.CURRENT_TABLE && !Linker.CURRENT_TABLE.isJoin) {
        //     SceneManager.loadScene('LobbyScene');
        // } else {
        this.leaveTableRequest();
        //}

    },




    leaveTableRequest() {
        Linker.ZONE = 15;
        if (!this.tableId) {
            cc.Global.showLoading();
            this.leaveRoom();
            //SceneManager.loadScene('LobbyScene',function(){});

            // SceneManager.loadScene('LobbyScene',function(){
            //     var scene = cc.director.getScene();
            //     var canvas = scene.getChildByName("Canvas");
            //     canvas.opacity = 0;
            //     cc.tween(canvas)
            //     .to(0.5, { opacity: 255})
            //     .start()
            // });
        } else {
            Linker.Socket.send(CommonSend.leaveTableRequest(this.tableId));
        }
    },
    moiChoiBtnClick() {
        if (this.gameState == 0) {
            var inviteDialog = this.node.parent.getChildByName("InviteSendDialog");
            if (inviteDialog) {
                inviteDialog.active = true;
            }
        } else {
            Linker.showMessage(i18n.t("Bạn không thể mời khi đang chơi"));
        }
    },
    addSocketEvent() {
        Linker.Event.addEventListener(Constant.CMD.CHAT, this.onChat, this);
        Linker.Event.addEventListener(1105, this.onJoinTableResponse, this);
        Linker.Event.addEventListener(1100, this.onCreateTableResponse, this);
        Linker.Event.addEventListener(1106, this.onPlayerJoinedResponse, this);
        Linker.Event.addEventListener(1103, this.onLeaveTableRespone, this);
        Linker.Event.addEventListener(1242, this.onTableSettingChangeResponse, this);
        Linker.Event.addEventListener(1116, this.onKickPlayerResponse, this);
        Linker.Event.addEventListener(1114, this.onGameEndResponse, this);
        Linker.Event.addEventListener(1110, this.onPlayerReadyResponse, this);
        Linker.Event.addEventListener(1108, this.onMatchStartResponse, this);
        Linker.Event.addEventListener(3, this.onReconnectionResponse, this);
        Linker.Event.addEventListener(1112, this.onGetPockerResponse, this);
        Linker.Event.addEventListener(2000, this.onReallyTurnResponse, this);
        Linker.Event.addEventListener(121010, this.onUpdateWithDraw, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
        Linker.Event.addEventListener(SocketConstant.COMMON.UPDATE_CRASH, this.onUpdateMoney, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(Constant.CMD.CHAT, this.onChat, this);
        Linker.Event.removeEventListener(1105, this.onJoinTableResponse, this);
        Linker.Event.removeEventListener(1100, this.onCreateTableResponse, this);
        Linker.Event.removeEventListener(1106, this.onPlayerJoinedResponse, this);
        Linker.Event.removeEventListener(1103, this.onLeaveTableRespone, this);
        Linker.Event.removeEventListener(1242, this.onTableSettingChangeResponse, this);
        Linker.Event.removeEventListener(1116, this.onKickPlayerResponse, this);
        Linker.Event.removeEventListener(1114, this.onGameEndResponse, this);
        Linker.Event.removeEventListener(1110, this.onPlayerReadyResponse, this);
        Linker.Event.removeEventListener(1108, this.onMatchStartResponse, this);
        Linker.Event.removeEventListener(3, this.onReconnectionResponse, this);
        Linker.Event.removeEventListener(1112, this.onGetPockerResponse, this);
        Linker.Event.removeEventListener(2000, this.onReallyTurnResponse, this);
        Linker.Event.removeEventListener(121010, this.onUpdateWithDraw, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
        Linker.Event.removeEventListener(SocketConstant.COMMON.UPDATE_CRASH, this.onUpdateMoney, this);

    },

    checkTurn(message) {
        // nếu tiền tố để theo lớn hơn số tiền hiện có thì k hiện thanh tố
        if (message.nextplayer == this.myUserId) {
            var myPlayerJs;
            for (var i = 0; i < this.listPlayer.length; i++) {
                if (this.listPlayer[i].userId == this.myUserId) {
                    myPlayerJs = this.listPlayer[i];
                    break;
                }
            }
            if (myPlayerJs) {
                //check tiền cần để đc tố
                var tienCanDeTo = Number(message.tientheo) + Number(message.tiendetheo);
                //check lượt đầu tiên k tính tiền theo
                if (Number(message.tientheo) == Number(this.betMoney)) tienCanDeTo = Number(message.tiendetheo);
                if (tienCanDeTo > Number(myPlayerJs.userMoney)) {
                    this.popupTo.active = false;
                    this.btnShowTo.getComponent(cc.Button).interactable = false;
                    this.btnShowTo.opacity = 150;
                } else {
                    this.popupTo.active = true;
                    this.btnShowTo.getComponent(cc.Button).interactable = true;
                    this.btnShowTo.opacity = 255;
                    this.toMoney.getComponent(cc.Label).string = tienCanDeTo;
                    this.minToVal = tienCanDeTo;
                }
            }
        }
    },

    onReallyTurnResponse(message) {
        if (message.status == 1) {
            console.log('*** 2000', message);
            this.node.parent.getChildByName("checkpoint").getComponent(cc.Label).string = 'vao 2000 ' + message.tongtienall;
            this.totalMoneyTable.parent.parent.active = true;
            this.tempCardAnimation.parent.active = false;
            this.totalMoneyTable.getComponent(cc.Label).string = Utils.Number.format(message.tongtienall);

            this.listPlayerNode.forEach(item => {
                //by Son
                if (message.nextplayer) {
                    if (item.player.userId == message.nextplayer) {
                        Linker.PokerController.bringMoneyVal = Number(item.player.userMoney);
                    }
                } else {
                    if (item.player.userId != message.playerAction) {
                        Linker.PokerController.bringMoneyVal = Number(item.player.userMoney);
                    }
                }
                // end by Son
                if (item.player.userId == message.playerAction) {
                    if (message.luachon == 1) {
                        item.banChip();
                        item.moneyPlayer.string = Utils.Number.format(Number(item.player.userMoney) - Number(message.tothem));
                        item.player.userMoney = Number(item.player.userMoney) - Number(message.tothem);
                        PokerEffect.showTheo(item, message.tothem, 1, message.tongtien);
                        if (message.playerAction == this.myUserId) {
                            //by Son
                            // Linker.PokerController.bringMoneyVal = Number(item.player.userMoney);
                        }
                    } else if (message.luachon == 3) {
                        item.banChip();
                        var tientru = 0;
                        if (Number(message.tientheo) > Number(message.tothem)) {
                            tientru = message.tientheo;
                        } else {
                            tientru = message.tothem;
                        }

                        if (Number(item.player.userMoney) < Number(tientru)) {
                            item.moneyPlayer.string = 0;
                            PokerEffect.showTheo(item, item.player.userMoney, 1, message.tongtien);
                            item.player.userMoney = 0;
                        } else {
                            // item.moneyPlayer.string = Utils.Number.format(Number(item.player.userMoney) - Number(tientru));
                            item.moneyPlayer.string = 0;
                            item.player.userMoney = Number(item.player.userMoney) - Number(tientru);
                            PokerEffect.showTheo(item, tientru, 1, message.tongtien);
                        }

                        PokerEffect.showXalang(item);
                        if (message.playerAction == this.myUserId) {
                            // by Son
                            // Linker.PokerController.bringMoneyVal = Number(item.player.userMoney);
                        }
                    } else if (message.luachon == 0) {
                        PokerEffect.showTheo(item, message.tientheo, 0, message.tongtien);
                        item.moneyPlayer.string = Utils.Number.format(Number(item.player.userMoney) - Number(message.tientheo));
                        item.player.userMoney = Number(item.player.userMoney) - Number(message.tientheo);
                        item.banChip();
                        if (message.playerAction == this.myUserId) {
                            // by Son
                            // Linker.PokerController.bringMoneyVal = Number(item.player.userMoney);
                        }
                    } else if (message.luachon == -1) {
                        PokerEffect.showUp(item);
                        item.player.isUp = true;
                    } else if (message.luachon == 2) {
                        PokerEffect.showXem(item);
                    }

                    // if(message.playerAction==this.myUserId && this.autoWithDraw && item.player.userMoney< this.minMoney){
                    //     this.showBringMoney();
                    // }
                }
            });

            console.log('*** lst node', this.listPlayerNode);

            if (message.nextplayer) {
                for (var i = 0; i < this.listPlayerNode.length; i++) {
                    if (i == this.findCurrentPlayerNode(message.nextplayer)) {
                        this.listPlayerNode[i].showTime(true);

                    } else {
                        this.listPlayerNode[i].showTime(false);

                    }
                }

                if (message.nextplayer == this.myUserId) {
                    this.btnGroup.active = true;
                    if (message.tiendetheo) {
                        this.tiendetheo = message.tiendetheo;
                    } else {
                        this.tiendetheo = null;
                    }
                    if (Number(message.tiendetheo) > 0) {
                        this.xemBtn.getComponent(cc.Button).interactable = false;
                        this.xemBtn.opacity = 150;
                        this.theoBtn.getComponent(cc.Button).interactable = true;
                        this.theoBtn.opacity = 255;
                    } else {
                        this.theoBtn.getComponent(cc.Button).interactable = false;
                        this.theoBtn.opacity = 150;
                        this.xemBtn.getComponent(cc.Button).interactable = true;
                        this.xemBtn.opacity = 255;
                    }

                    this.resetToPopup();


                } else {
                    this.btnGroup.active = false;
                }
            }

            this.checkTurn(message);
        } else {
            Linker.showMessage(message.error);
        }
    },

    onUpdateWithDraw(message) {
        if (message.status == 1) {
            this.listPlayer.forEach(item => {
                if (item.userId == message.userId) {
                    item.userMoney = message.money;
                }
            });

            this.listPlayerNode.forEach(item => {
                if (item.player.userId == message.userId) {
                    item.player.userMoney = message.money;
                    item.moneyPlayer.string = Utils.Number.format(message.money);
                }
            });

            if (message.userId == this.myUserId) {
                this.bringMoneyVal = message.money;
            }
        }

    },

    onGameEndResponse(message) {
        if (message.status == 1) {
            var effect = cc.callFunc(this.endGameEffect, this, message);
            var logic = cc.callFunc(this.endGameLogic, this, message);
            var action = cc.sequence(effect, cc.delayTime(5), logic);
            this.node.runAction(action);
        } else {

        }
    },
    endGameEffect(target, message) {
        this.btnGroup.active = false;
        this.gameState = 0;
        this.animationNode.removeAllChildren();
        this.cardContainer.removeAllChildren();
        PokerEffect.chiaBaiChungEffectSpeed(this.cardContainer, message.CardChung, this.tempCard, this.tempCardAnimation);
        this.theoBtn.getComponent(cc.Button).interactable = true;
        this.theoBtn.opacity = 255;
        this.xemBtn.getComponent(cc.Button).interactable = true;
        this.xemBtn.opacity = 255;
        this.listPlayerNode.forEach(item => {
            if(item){
                if (item.player.userId == this.myUserId) {
                    item.showCardOnHand(false);
                } else {
                    item.showHiddenCard(false);
                }
            }

        });
        for (var i = 0; i < this.listPlayerNode.length; i++) {
            this.listPlayerNode[i].showTime(false);
        }

        var checkOneNoUp = false;
        var countUp = 0;
        this.listPlayerNode.forEach(item => {
            if(item){
                if (item.player.isUp == true) {
                    countUp++;
                }
            }

        });
        if (countUp == this.listPlayerNode.length - 1) {
            checkOneNoUp = true;
        }
        console.log('*** noone up', checkOneNoUp, countUp, message.CardChung);
        if (!checkOneNoUp) {
            if (message.Extra.length > 0) {
                message.Extra.forEach(item => {
                    if(item){
                        if (this.listPlayerNode[this.findCurrentPlayerNode(item.userId)]) {
                            PokerEffect.showPoint(item.point, this.listPlayerNode[this.findCurrentPlayerNode(item.userId)]);
                            this.listPlayerNode[this.findCurrentPlayerNode(item.userId)].player.cardOwnerList = item.cardDataList;
                            this.listPlayerNode[this.findCurrentPlayerNode(item.userId)].addCardPlayerOwner();
                            this.listPlayerNode[this.findCurrentPlayerNode(item.userId)].showCardOnHand(true);
                        }
                    }

                });
            }
        } else {
            message.Extra.forEach(item => {
                if(item){
                    if (this.listPlayerNode[this.findCurrentPlayerNode(item.userId)] && item.userId == this.myUserId) {
                        PokerEffect.showPoint(item.point, this.listPlayerNode[this.findCurrentPlayerNode(item.userId)]);
                        this.listPlayerNode[this.findCurrentPlayerNode(item.userId)].player.cardOwnerList = item.cardDataList;
                        this.listPlayerNode[this.findCurrentPlayerNode(item.userId)].addCardPlayerOwner();
                        this.listPlayerNode[this.findCurrentPlayerNode(item.userId)].showCardOnHand(true);
                    }
                }

            });
        }



        this.timeOutEndEffect = setTimeout(() => {
            if (message.SaveCard && message.SaveCard.length > 0 && this.listPlayerNode && this.listPlayerNode[this.myIndex]) {
                if (this.cardContainer) {
                    var lst = this.cardContainer.getChildren();
                    lst.forEach(item => {
                        item.getChildByName('background').color = new cc.Color(102, 102, 102, 255);
                    });
                    var mySaveCard = [];
                    message.SaveCard.forEach(item => {
                        if (item.userId == this.myUserId) {
                            mySaveCard = item.listCard;
                        }
                    });

                    var lstMyCard = [];
                    for (var i = 0; i < mySaveCard.length; i++) {
                        for (var j = 0; j < 2; j++) {
                            if (this.listPlayerNode[this.myIndex].player.cardOwnerList[j].serverValue == mySaveCard[i].serverValue) {
                                lstMyCard.push(mySaveCard[i]);
                                break;
                            }
                        }
                    }

                    var delayTime = [];
                    for (var i = 0; i < mySaveCard.length * 2; i++) {
                        delayTime.push(i * 0.3);
                    }
                    var stt = 0;
                    for (var i = 0; i < lst.length; i++) {
                        for (var j = 0; j < mySaveCard.length; j++) {
                            if (lst[i].getComponent('PokerCard').serverValue == mySaveCard[j].serverValue) {
                                lst[i].getChildByName('background').color = new cc.Color(255, 255, 255, 255);
                                lst[i].getChildByName('selectedCard').active = true;
                                lst[i].getChildByName('normalCard').active = false;
                                lst[i].runAction(cc.sequence(cc.delayTime(delayTime[stt]), cc.scaleTo(0.1, 1.3), cc.scaleTo(0.1, 1)));
                                stt++;
                                break;
                            }
                        }
                    }

                    var mycard = this.listPlayerNode[this.myIndex].cardOnHandList.getChildren();
                    mycard.forEach(item => {
                        item.getChildByName('background').color = new cc.Color(102, 102, 102, 255);
                    });
                    for (var i = 0; i < 2; i++) {
                        for (var j = 0; j < lstMyCard.length; j++) {
                            if (mycard[i] && mycard[i].getComponent('PokerCard').serverValue == lstMyCard[j].serverValue) {
                                mycard[i].getChildByName('background').color = new cc.Color(255, 255, 255, 255);
                            }
                        }
                    }
                }
            }
        }, 1500);


        if (message.listPlayer.length > 0) {
            message.listPlayer.forEach(item => {
                var index = this.findCurrentPlayerNode(item.userId);
                if (this.listPlayerNode[index]) {
                    this.listPlayerNode[index].setMoney(item.resultMoney);
                }
            });
        }
        this.setEffectLevelUp(message);
    },
    setEffectLevelUp(message) {
        var players = message.listPlayer;
        for (var i = 0; i < players.length; i++) {
            if (Number(players[i].level) > Number(Linker.userData.userLevel) && Linker.userData.userId == players[i].userId && Number(players[i].levelUpMoney) > 0) {
                Linker.userData.userLevel = players[i].level;
                var money = players[i].levelUpMoney;
                if (Linker.levelUpPrefab && Linker.levelUpPrefab.isValid) {
                    var node = cc.instantiate(Linker.levelUpPrefab);
                    node.getComponent("LevelUp").setInfor(money);
                    this.node.addChild(node);
                } else {
                    cc.resources.load("levelup/LevelUp", cc.Prefab, function (completedCount, totalCount, item) { }, function (err, prefab) {
                        if (!err) {
                            Linker.levelUpPrefab = prefab;
                            var node = cc.instantiate(Linker.levelUpPrefab);
                            node.getComponent("LevelUp").setInfor(money);
                            this.node.addChild(node);
                        }
                    }.bind(this));
                }
            }
        }
    },
    endGameLogic(target, message) {
        this.cardContainer.active = false;
        this.cardContainer.removeAllChildren();
        this.totalMoneyTable.getComponent(cc.Label).string = Utils.Number.format(Number(this.betMoney));
        this.totalMoneyTable.parent.parent.active = false;
        this.listPlayerNode.forEach(item => {
            item.player.isUp = false;
        });
        cc.log("END_GAME", message);
        if (this.isLeaveTable) {
            //SceneManager.loadScene('LobbyScene',function(){});

            // SceneManager.loadScene('LobbyScene',function(){
            //     var scene = cc.director.getScene();
            //     var canvas = scene.getChildByName("Canvas");
            //     canvas.opacity = 0;
            //     cc.tween(canvas)
            //     .to(0.5, { opacity: 255})
            //     .start()
            // });
            Linker.message = i18n.t("Bạn vừa rời phòng");
        }

        if (message.listPlayer.length >= 2) {
            this.timeOutEndLogic = setTimeout(() => {
                if (this.listPlayerNode && this.listPlayerNode.length >= 2 && this._updateTimeStart()) {
                    this._updateTimeStart();
                }
            }, 1000);
        }


        // this.gameState = 0;
        if (message.newOwner != 0) {
            for (var i = 0; i < this.listPlayer.length; i++) {

                if (this.listPlayer[i].userId == message.newOwner) {
                    this.listPlayer[i].isMaster = 1;
                    if(this.listPlayerNode[i].player.isMaster){
                        this.listPlayerNode[i].player.isMaster = 1;
                    }

                } else {
                    this.listPlayer[i].isMaster = 0;
                    if(this.listPlayerNode[i].player.isMaster){
                        this.listPlayerNode[i].player.isMaster = 0;
                    }
                }


            }
            if (this.myUserId == message.newOwner) {
                this.isMaster = true;

            } else {
                this.isMaster = false;

            }
        }
        if (message.listPlayer.length > 0) {
            message.listPlayer.forEach((element) => {
                var index = this.findCurrentPlayer(element.userId);
                var player = this.listPlayer[index];
                if (player) {
                    player.userMoney = element.money.toString();
                    player.userId = element.userId;
                    if (Number(element.isOut) == 1 || Number(element.isBankrupt) == 1) {
                        this.listPlayer.splice(index, 1);
                        var index2 = this.findCurrentPlayerNode(element.userId);
                        this.listPlayerNode.splice(index2, 1);
                        if (Number(player.userId) === Number(Linker.userData.userId)) {
                            // Check nguoi choi do la chinh minh thi roi khoi ban.
                            if (player.userMoney <= 0 || Number(element.isBankrupt == 1)) {
                                Linker.message = i18n.t("Bạn bị thoát do không đủ tiền chơi.");
                            }
                            this.leaveTableRequest();
                        }
                    }

                    if (Number(player.userId) === Number(Linker.userData.userId)) {
                        if (Number(element.money) < (Number(this.minMoney))) {
                            if (this.autoWithDraw) {
                                this.showBringMoney();
                            } else {
                                var data = PokerSend.GuestStand(this.tableId);
                                Linker.Socket.send(data);
                                Linker.CURRENT_TABLE = {
                                    isJoin: true
                                };
                            }
                        } else {
                            Linker.PokerController.bringMoneyVal = element.money;
                        }
                    }
                }
            });
        }

        this.myIndex = this.findCurrentPlayerNode(this.myUserId);
        this.currentCapacity = this.listPlayer.length;

        for (var i = 0; i < this.listPlayer.length; i++) {
            this.listPlayer[i].cardOwnerList = [];

        }

        var indexOfLstPlayer = null;
        for (var i = 0; i < this.listPlayer.length; i++) {
            if (this.listPlayer[i].userId == this.myUserId) {
                indexOfLstPlayer = i;
            }
        }

        this.listPlayerNode = [];
        this.player1.reset();
        this.player2.reset();
        this.player3.reset();
        this.player4.reset();
        this.player5.reset();
        this.player6.reset();
        this.player7.reset();
        this.player8.reset();
        this.player9.reset();
        if (indexOfLstPlayer || indexOfLstPlayer == 0) {
            var lstPlayerNodeTemp = this.getListPlayerNode(indexOfLstPlayer, this.listPlayer.length);
            if (this.maxCapacity == 5) {
                this.player1.show(false);
                this.player3.show(false);
                this.player6.show(false);
                this.player8.show(false);
            }
            for (var i = 0; i < this.listPlayer.length; i++) {
                lstPlayerNodeTemp[i].createPlayer(this.listPlayer[i]);
                lstPlayerNodeTemp[i].showInvite(false);
                lstPlayerNodeTemp[i].showProfile(true);
                if (lstPlayerNodeTemp[i].playerNumber == 9) {
                    lstPlayerNodeTemp[i].node.getChildByName('btn_naptien').active = true;
                }
                this.listPlayerNode.push(lstPlayerNodeTemp[i]);
            }
        } else {
            this.player9.node.getChildByName('btn_naptien').active = false;
            var lstPlayerNodeTemp = [this.player4, this.player3, this.player2, this.player1, this.player9, this.player8, this.player7, this.player6, this.player5];
            if (this.maxCapacity == 5) {
                this.player1.show(false);
                this.player3.show(false);
                this.player6.show(false);
                this.player8.show(false);
                lstPlayerNodeTemp = [this.player4, this.player2, this.player9, this.player7, this.player5];
            }
            for (var i = 0; i < this.listPlayer.length; i++) {
                lstPlayerNodeTemp[i].createPlayer(this.listPlayer[i]);
                lstPlayerNodeTemp[i].showInvite(false);
                lstPlayerNodeTemp[i].showProfile(true);
                this.listPlayerNode.push(lstPlayerNodeTemp[i]);
            }
        }

        this.myIndex = this.findCurrentPlayerNode(this.myUserId);

        var stt = [4, 3, 2, 1, 9, 8, 7, 6, 5];
        var meHaveInGame = false;
        this.listPlayerNode.forEach(item => {
            if (item.player.userId == this.myUserId) {
                meHaveInGame = true;
            }
            var index = stt.indexOf(item.playerNumber);
            if (index > -1) {
                stt.splice(index, 1);
            }
        });

        if (!meHaveInGame) {
            var lst = [this.player1, this.player2, this.player3, this.player4, this.player5, this.player6, this.player7, this.player8, this.player9];
            for (var i = 0; i < lst.length; i++) {
                for (var j = 0; j < stt.length; j++) {
                    if (lst[i].playerNumber == stt[j]) {
                        lst[i].resetShowSit();
                        break;
                    }
                }
            }
        }
    },
    onGetPockerResponse(message) {
        if (message.status == 1) {
            PokerEffect.chiaBaiChungEffect(this.cardContainer, message.listCard, this.tempCard, this.tempCardAnimation);

            for (var i = 0; i < this.listPlayerNode.length; i++) {
                if (i == this.findCurrentPlayerNode(message.nextTurnId)) {
                    this.listPlayerNode[i].showTime(true);
                } else {
                    this.listPlayerNode[i].showTime(false);
                }
            }

            if (this.myUserId == message.nextTurnId) {
                this.btnGroup.active = true;
                this.theoBtn.getComponent(cc.Button).interactable = false;
                this.theoBtn.opacity = 150;
                this.xemBtn.getComponent(cc.Button).interactable = true;
                this.xemBtn.opacity = 255;
                this.resetToPopup();
            } else {
                this.btnGroup.active = false;
                this.theoBtn.getComponent(cc.Button).interactable = true;
                this.theoBtn.opacity = 255;
                this.popupTo.getChildByName('sliderTo').getComponent(cc.Slider).progress = 0;
                this.toBtn.getComponent(cc.Button).interactable = true;
                this.toBtn.opacity = 255;
                this.popupTo.active = false;
            }

            if (message.myPoint) {
                if (Number(message.myPoint) > 0) {
                    PokerEffect.showPoint(parseInt(Number(message.myPoint) / 100), this.listPlayerNode[this.myIndex], true);
                }
            }
            cc.log("MY_INDEX", this.myIndex);
            if (message.beginPlayerId) {
                this.currentTurnId = message.beginPlayerId;
            }

        } else {
            Linker.showMessage(message.error);
        }
    },

    onPlayerJoinedResponse(message) {
        if (message.status == 1) {
            NewAudioManager.playAudioSource("joinboard");
            switch (this.gameState) {
                case PhomConstant.GAME_STATE.WAIT: {
                    if (message.player) {
                        this.listPlayer.push(message.player);
                    }
                    this.currentCapacity = this.listPlayer.length;

                    var indexOfLstPlayer = null;
                    for (var i = 0; i < this.listPlayer.length; i++) {
                        if (this.listPlayer[i].userId == this.myUserId) {
                            indexOfLstPlayer = i;
                        }
                    }

                    this.listPlayerNode = [];
                    this.player1.resetShowSit();
                    this.player2.resetShowSit();
                    this.player3.resetShowSit();
                    this.player4.resetShowSit();
                    this.player5.resetShowSit();
                    this.player6.resetShowSit();
                    this.player7.resetShowSit();
                    this.player8.resetShowSit();
                    this.player9.resetShowSit();
                    if (indexOfLstPlayer || indexOfLstPlayer == 0) {
                        this.player1.reset();
                        this.player2.reset();
                        this.player3.reset();
                        this.player4.reset();
                        this.player5.reset();
                        this.player6.reset();
                        this.player7.reset();
                        this.player8.reset();
                        this.player9.reset();
                        var lstPlayerNodeTemp = this.getListPlayerNode(indexOfLstPlayer, this.listPlayer.length);
                        if (this.maxCapacity == 5) {
                            this.player1.show(false);
                            this.player3.show(false);
                            this.player6.show(false);
                            this.player8.show(false);
                        }
                        for (var i = 0; i < this.listPlayer.length; i++) {
                            lstPlayerNodeTemp[i].createPlayer(this.listPlayer[i]);
                            lstPlayerNodeTemp[i].showInvite(false);
                            lstPlayerNodeTemp[i].showProfile(true);
                            if (lstPlayerNodeTemp[i].playerNumber == 9) {
                                lstPlayerNodeTemp[i].node.getChildByName('btn_naptien').active = true;
                            }
                            this.listPlayerNode.push(lstPlayerNodeTemp[i]);
                        }
                    } else {
                        this.player9.node.getChildByName('btn_naptien').active = false;
                        var lstPlayerNodeTemp = [this.player4, this.player3, this.player2, this.player1, this.player9, this.player8, this.player7, this.player6, this.player5];
                        if (this.maxCapacity == 5) {
                            this.player1.show(false);
                            this.player3.show(false);
                            this.player6.show(false);
                            this.player8.show(false);
                            lstPlayerNodeTemp = [this.player4, this.player2, this.player9, this.player7, this.player5];
                        }
                        for (var i = 0; i < this.listPlayer.length; i++) {
                            lstPlayerNodeTemp[i].reset();
                            lstPlayerNodeTemp[i].createPlayer(this.listPlayer[i]);
                            lstPlayerNodeTemp[i].showInvite(false);
                            lstPlayerNodeTemp[i].showProfile(true);
                            this.listPlayerNode.push(lstPlayerNodeTemp[i]);
                        }
                    }

                    break;
                }

            }
            this.myIndex = this.findCurrentPlayerNode(this.myUserId);
            clearInterval(cc.Global.intervalStartPoker);
            cc.Global.intervalStartPoker = null;
            if (this.gameState == PhomConstant.GAME_STATE.WAIT && this.listPlayerNode.length >= 2) {
                this._updateTimeStart();
            }
        } else {

        }
    },
    onReconnectionResponse(message) {
        if (message.status == 1) {
            NewAudioManager.playAudioSource("joinboard");
            this.showPokerGame(message);
            this.resetTable();
            Linker.userData.lastRoom = null;
            Linker.CURRENT_TABLE.tableId = message.tableId;
            Linker.CURRENT_TABLE.tableData.tableIndex = message.tableIndex;
            Linker.CURRENT_TABLE.tableData.tableId = message.tableId;
            Linker.CURRENT_TABLE.tableData.maxNumberPlayer = message.maxCapacity;
            this.tableId = message.tableId;
            this.tableIndex = message.index;
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.currentPlayerId = message.currentPlayerId;
            this.setRoomInfo();
            if (this.maxCapacity) {
                this.player1.reset();
                this.player2.reset();
                this.player3.reset();
                this.player4.reset();
                this.player5.reset();
                this.player6.reset();
                this.player7.reset();
                this.player8.reset();
                this.player9.reset();
            }
            this.currentCapacity = message.listPlayer.length;
            this.listPlayer = message.listPlayer;
            this.gameState = Number(message.isPlaying);
            this.myIndex = this.findCurrentPlayer(this.myUserId);


            this.currentTurnId = message.currentPlayerId;

            this.listPlaying = [];

            if (this.listPlayer[this.myIndex].isMaster == 1) {
                this.isMaster = true;
            } else {
                this.isMaster = false;
            }

            this.betMoney = message.minMoney;
            this.minMoneyVal = Number(this.betMoney) * 10;
            this.maxMoneyVal = Number(this.betMoney) * 50;
            if (this.minMoneyVal) {
                this.bringMoneyVal = this.minMoneyVal;
            }

            if (message.minMoney) {
                this.minMoneyBring.string = Utils.Number.format(Number(message.minMoney) * 10);
                this.maxMoneyBring.string = Utils.Number.format(Number(message.minMoney) * 50);
                this.bringMoney.getComponent(cc.Label).string = this.minMoneyVal;
            }

            if (this.betMoney) {
                this.totalMoneyTable.getComponent(cc.Label).string = Utils.Number.format(Number(this.betMoney));
            }

            PokerEffect.chiaBaiChungEffect(this.cardContainer, message.biglist, this.tempCard, this.tempCardAnimation);
            switch (this.gameState) {
                case PhomConstant.GAME_STATE.PLAYING: {

                    var indexOfLstPlayer = null;
                    for (var i = 0; i < this.listPlayer.length; i++) {
                        if (this.listPlayer[i].userId == this.myUserId) {
                            indexOfLstPlayer = i;
                        }
                    }
                    this.listPlayerNode = [];
                    if (indexOfLstPlayer || indexOfLstPlayer == 0) {
                        //cc.find('Canvas/Poker/btn_chat').active = true;
                        this.player1.reset();
                        this.player2.reset();
                        this.player3.reset();
                        this.player4.reset();
                        this.player5.reset();
                        this.player6.reset();
                        this.player7.reset();
                        this.player8.reset();
                        this.player9.reset();
                        var lstPlayerNodeTemp = this.getListPlayerNode(indexOfLstPlayer, this.listPlayer.length);
                        if (this.maxCapacity == 5) {
                            this.player1.show(false);
                            this.player3.show(false);
                            this.player6.show(false);
                            this.player8.show(false);
                        }
                        for (var i = 0; i < this.listPlayer.length; i++) {
                            lstPlayerNodeTemp[i].createPlayer(this.listPlayer[i]);
                            lstPlayerNodeTemp[i].showInvite(false);
                            lstPlayerNodeTemp[i].showProfile(true);
                            PokerEffect.showTheo(lstPlayerNodeTemp[i], this.listPlayer[i].a, 1, this.listPlayer[i].b);
                            this.listPlayerNode.push(lstPlayerNodeTemp[i]);
                        }
                        this.myIndex = this.findCurrentPlayerNode(this.myUserId);
                    }


                    this.listPlayerNode[this.myIndex].player.cardOwnerList = message.selfCardList;
                    this.totalMoneyTable.parent.parent.active = true;
                    this.totalMoneyTable.getComponent(cc.Label).string = Utils.Number.format(message.sum);
                    this.listPlayerNode[this.myIndex].addCardPlayerOwner();
                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                        if (this.listPlayerNode[i].player.userId != this.myUserId) {
                            this.listPlayerNode[i].showHiddenCard(true);
                        } else {
                            this.listPlayerNode[i].showHiddenCard(false);
                        }


                        if (i == this.findCurrentPlayerNode(this.currentTurnId)) {
                            this.listPlayerNode[i].showTime(true);
                            if (this.currentPlayerId == this.myUserId) {
                                this.btnGroup.active = true;
                            }
                        } else {
                            this.listPlayerNode[i].showTime(false);
                        }
                        if (this.listPlayerNode[i].player.isMaster == 1 && this.listPlayerNode[i].player.userId == this.myUserId) {
                            this.isMaster = true;
                        } else {
                            this.isMaster = false;
                        }
                    }

                    this.listPlayer.forEach(item => {
                        if (item.userId == this.myUserId) {
                            Linker.PokerController.bringMoneyVal = Number(item.userMoney);
                        }
                    });


                    break;
                }

            }


            this.myIndex = this.findCurrentPlayerNode(this.myUserId);
        } else {

        }
    },

    danhbai() {
        // var id = '115';
        // this.listPlayerNode.forEach(item => {
        //     if (item.player.userId == id) {
        //         item.banChip();

        //     }
        // });

        // console.log('*** card', this.cardContainer.getChildren());
        // var data = PokerSend.GuestStand(this.tableId);
        // Linker.Socket.send(data);
        // Linker.CURRENT_TABLE = {
        //     isJoin: true
        // };
        // this.btnGroup.active=true;
        Linker.PokerController.reconnectDialog.active = true;


    },



    onLeaveTableRespone(message) {
        if (message.status == 1) {
            cc.log("GAME_STATE", this.gameState)
            if (this.myUserId == message.userId) {
                switch (this.gameState) {
                    case 0: {
                        if (message.cancelStatus == 0) {
                            this.endInterval = true;
                            clearInterval(cc.Global.intervalStartPoker);
                            cc.Global.intervalStartPoker = null;
                            //SceneManager.loadScene('LobbyScene',function(){});

                            // SceneManager.loadScene('LobbyScene',function(){
                            //     var scene = cc.director.getScene();
                            //     var canvas = scene.getChildByName("Canvas");
                            //     canvas.opacity = 0;
                            //     cc.tween(canvas)
                            //     .to(0.5, { opacity: 255})
                            //     .start()
                            // });
                            this.leaveRoom();
                        }
                        break;
                    }
                    case 1: {
                        if (message.cancelStatus == 1) {
                            Linker.showMessage(i18n.t("Bạn vừa đăng ký rời phòng khi hết ván"));
                            this.isLeaveTable = true;
                        } else {
                            if (message.cancelStatus == 2) {
                                this.isLeaveTable = false;
                                Linker.showMessage(i18n.t("Bạn vừa hủy rời phòng khi hết ván"));
                            } else {
                                if (message.cancelStatus == 0) {
                                    this.endInterval = true;
                                    cc.Global.intervalStartPoker = null;
                                    clearInterval(cc.Global.intervalStartPoker);
                                    //SceneManager.loadScene('LobbyScene',function(){});

                                    // SceneManager.loadScene('LobbyScene',function(){
                                    //     var scene = cc.director.getScene();
                                    //     var canvas = scene.getChildByName("Canvas");
                                    //     canvas.opacity = 0;
                                    //     cc.tween(canvas)
                                    //     .to(0.5, { opacity: 255})
                                    //     .start()
                                    // });
                                    this.leaveRoom();
                                }
                            }

                        }
                        break;
                    }
                }


            } else {
                NewAudioManager.playAudioSource("leaveboard");
                switch (this.gameState) {
                    case PhomConstant.GAME_STATE.WAIT: {
                        var leavePlayerId = message.userId;
                        var leveaPlayerIndex = this.findCurrentPlayer(leavePlayerId);
                        if (leveaPlayerIndex < 0) {
                            break;
                        }
                        this.listPlayer.splice(leveaPlayerIndex, 1)[0];
                        for (var i = 0; i < this.listPlayer.length; i++) {
                            if (message.newOwner != 0) {
                                if (this.listPlayer[i].userId == message.newOwner) {
                                    this.listPlayer[i].isMaster = 1;
                                    this.listPlayer[i].state = 1;

                                } else {
                                    this.listPlayer[i].isMaster = 0;
                                }
                            }

                        }
                        if (this.myUserId == message.newOwner) {
                            this.isMaster = true;

                        }

                        var indexOfLstPlayer = null;
                        for (var i = 0; i < this.listPlayer.length; i++) {
                            if (this.listPlayer[i].userId == this.myUserId) {
                                indexOfLstPlayer = i;
                            }
                        }

                        this.listPlayerNode = [];
                        this.player1.resetShowSit();
                        this.player2.resetShowSit();
                        this.player3.resetShowSit();
                        this.player4.resetShowSit();
                        this.player5.resetShowSit();
                        this.player6.resetShowSit();
                        this.player7.resetShowSit();
                        this.player8.resetShowSit();
                        this.player9.resetShowSit();
                        if (indexOfLstPlayer || indexOfLstPlayer == 0) {
                            this.player1.reset();
                            this.player2.reset();
                            this.player3.reset();
                            this.player4.reset();
                            this.player5.reset();
                            this.player6.reset();
                            this.player7.reset();
                            this.player8.reset();
                            this.player9.reset();
                            if (this.maxCapacity == 5) {
                                this.player1.show(false);
                                this.player3.show(false);
                                this.player6.show(false);
                                this.player8.show(false);
                            }
                            var lstPlayerNodeTemp = this.getListPlayerNode(indexOfLstPlayer, this.listPlayer.length);
                            for (var i = 0; i < this.listPlayer.length; i++) {
                                lstPlayerNodeTemp[i].createPlayer(this.listPlayer[i]);
                                lstPlayerNodeTemp[i].showInvite(false);
                                lstPlayerNodeTemp[i].showProfile(true);
                                if (lstPlayerNodeTemp[i].playerNumber == 9) {
                                    lstPlayerNodeTemp[i].node.getChildByName('btn_naptien').active = true;
                                }
                                this.listPlayerNode.push(lstPlayerNodeTemp[i]);
                            }
                            this.myIndex = this.findCurrentPlayerNode(this.myUserId);
                        } else {
                            this.player9.node.getChildByName('btn_naptien').active = false;
                            var lstPlayerNodeTemp = [this.player4, this.player3, this.player2, this.player1, this.player9, this.player8, this.player7, this.player6, this.player5];
                            if (this.maxCapacity == 5) {
                                this.player1.show(false);
                                this.player3.show(false);
                                this.player6.show(false);
                                this.player8.show(false);
                                lstPlayerNodeTemp = [this.player4, this.player2, this.player9, this.player7, this.player5];
                            }
                            for (var i = 0; i < lstPlayerNodeTemp.length; i++) {
                                lstPlayerNodeTemp[i].reset();
                                lstPlayerNodeTemp[i].createPlayer(lstPlayerNodeTemp[i]);
                                lstPlayerNodeTemp[i].showInvite(false);
                                lstPlayerNodeTemp[i].showProfile(true);
                                this.listPlayerNode.push(lstPlayerNodeTemp[i]);
                            }
                            this.myIndex = null;
                        }
                        break;
                    }
                    case PhomConstant.GAME_STATE.PLAYING: {
                        var leavePlayerId = message.userId;
                        var leveaPlayerIndex = this.findCurrentPlayer(leavePlayerId);
                        if (leveaPlayerIndex < 0) {
                            break;
                        }
                        this.listPlayer.splice(leveaPlayerIndex, 1);
                        this.currentCapacity = this.listPlayer.length;
                        this.myIndex = this.findCurrentPlayer(this.myUserId);
                        this.listPlayerNode.splice(leveaPlayerIndex, 1)[0].reset();

                        break;
                    }
                }

                for (var i = 0; i < this.listPlayerNode.length; i++) {
                    if (this.listPlayerNode[i].player.userId == this.myUserId) {
                        this.myIndex = i;
                    }
                }

                if (this.gameState == 0 && this.listPlayerNode.length < 2) {
                    this.endInterval = true;
                    this.timeCountLabel.parent.active = false;
                }



            }
        } else {

        }
    },

    leaveRoom: function (isBankGroup) {
        isBankGroup = isBankGroup ? true : false;
        this.isRunningEndGame = false;
        this.isEndGame = false;
        this.gameState = PhomConstant.GAME_STATE.WAIT;
        this.requestJoinZone();
        if (!isBankGroup) {
            cc.Global.showMessage(i18n.t("Bạn vừa rời phòng"));
        }
        cc.Global.hideLoading();
        // this.onLeaveRequest();
        // this.node.destroy();
        // this.node.removeFromParent(true);
        this.PokerNode.destroy();
        Linker.CURRENT_TABLE = null;
        NewAudioManager.stopSoundBackground();
        // NewAudioManager.playBackground(NewAudioManager.getPathMusicByZone().background, 0.4, true, true);
    },

    onLeaveRequest: function (event) {
        if (Linker && Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId) {
            var tableId = Number(Linker.CURRENT_TABLE.tableId);
            if (isNaN(tableId) == false && tableId != 0) {
                Linker.Socket.send(CommonSend.leaveTableRequest(tableId));
            }
        }
    },

    requestJoinZone: function () {
        console.log('--6');
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_KHOI_TAO_LAI_LOBBY, true);
        customEvent.isLeaveTable = true;
        this.node.dispatchEvent(customEvent);
    },

    onCreateTableResponse(message) {
        if (message.status == 1) {
            // by Son
            this.betMoney = message.minMoney;
            this.minMoneyVal = Number(this.betMoney) * 10;
            this.maxMoneyVal = Number(this.betMoney) * 50;
            if (message.minMoney) {
                this.minMoneyBring.string = Utils.Number.format(Number(message.minMoney) * 10);
                this.maxMoneyBring.string = Utils.Number.format(Number(message.minMoney) * 50);
            }
            // end by Son
            //cc.find('Canvas/Poker/btn_chat').active = true;
            var data = PokerSend.WithdrawMoneyRequest(message.tableId, this.bringMoneyVal ? this.bringMoneyVal : message.selfMoney);
            Linker.Socket.send(data);
            // message.player.userMoney = this.bringMoneyVal;
            this.resetTable();
            this.showPokerGame(message);
            Linker.CURRENT_TABLE.tableId = message.tableId;
            Linker.CURRENT_TABLE.tableData.tableIndex = message.tableIndex;
            Linker.CURRENT_TABLE.tableData.tableId = message.tableId;
            Linker.CURRENT_TABLE.tableData.maxNumberPlayer = message.maxCapacity;
            this.tableId = message.tableId;
            this.tableIndex = message.tableIndex;
            this.minMoney = message.minMoney;
            this.betMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.setRoomInfo();
            if (this.maxCapacity) {
                this.player1.reset();
                this.player2.reset();
                this.player3.reset();
                this.player4.reset();
                this.player5.reset();
                this.player6.reset();
                this.player7.reset();
                this.player8.reset();
                this.player9.reset();
                this.player9.showProfile(false);
                this.player9.showInvite(false);
                this.player9.showSit(false);
                this.player9.showWin(false);
            }
            this.currentCapacity = 1;
            this.gameState = Number(message.isPlaying);
            this.player9.showProfile(true);
            this.player9.showInvite(false);
            //this.player9.node.getChildByName('btn_naptien').active = true;

            this.player9.createPlayer(message.player);
            Linker.PokerBetMoney = Number(message.selfMoney);
            this.myIndex = 0;
            if (message.player) {
                this.listPlayer.push(message.player);
            }
            this.listPlayerNode.push(this.player9);
            this.isMaster = true;

            if (this.betMoney) {
                this.totalMoneyTable.getComponent(cc.Label).string = Utils.Number.format(Number(this.betMoney));
            }
        } else {
            if (message.error) {
                cc.Global.showMessage(message.error);
                this.lockTableEvent(false);
                this.requestJoinZone();
                this.clearGame();
            }
        }


    },
    onJoinTableResponse(message) {
        if (message.status == 1) {
            NewAudioManager.playAudioSource("joinboard");
            this.showPokerGame(message);
            this.resetTable();
            this.btnGroup.active = false;
            PokerEffect.chiaBaiChungEffect(this.cardContainer, message.baichung, this.tempCard, this.tempCardAnimation);
            Linker.CURRENT_TABLE.tableId = message.tableId;
            Linker.CURRENT_TABLE.tableData.tableIndex = message.tableIndex;
            Linker.CURRENT_TABLE.tableData.tableId = message.tableId;
            Linker.CURRENT_TABLE.tableData.maxNumberPlayer = message.maxCapacity;
            this.tableId = message.tableId;
            this.tableIndex = message.tableIndex;
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.setRoomInfo();
            this.dutyType = message.dutyType;
            if (this.maxCapacity) {
                this.player1.resetShowSit();
                this.player2.resetShowSit();
                this.player3.resetShowSit();
                this.player4.resetShowSit();
                this.player5.resetShowSit();
                this.player6.resetShowSit();
                this.player7.resetShowSit();
                this.player8.resetShowSit();
                this.player9.resetShowSit();
            }
            this.currentCapacity = message.listPlayer.length;
            this.listPlayer = message.listPlayer;

            //update tiền cược khi fast join
            if (this.data) {
                this.betMoney = message.minMoney;
                this.minMoneyVal = Number(this.betMoney) * 10;
                this.maxMoneyVal = Number(this.betMoney) * 50;
                if (this.minMoneyVal) {
                    this.bringMoneyVal = this.minMoneyVal;
                }

                if (message.minMoney) {
                    this.minMoneyBring.string = Utils.Number.format(Number(message.minMoney) * 10);
                    this.maxMoneyBring.string = Utils.Number.format(Number(message.minMoney) * 50);
                    this.bringMoney.getComponent(cc.Label).string = this.minMoneyVal;
                }

                if (this.betMoney) {
                    this.totalMoneyTable.getComponent(cc.Label).string = Utils.Number.format(Number(this.betMoney));
                }
            }

            //hiển thị đếm ngược đến ván mới
            this.gameState = Number(message.isPlaying);
            console.log('*** is playing', this.gameState);
            clearInterval(cc.Global.intervalStartPoker);
            cc.Global.intervalStartPoker = null;
            if (this.gameState == PhomConstant.GAME_STATE.WAIT && message.listPlayer.length >= 2) {
                this._updateTimeStart();
            } else if (this.gameState == PhomConstant.GAME_STATE.WAIT && message.listPlayer.length < 2) {
                this.endInterval = true;
                this.timeCountLabel.parent.active = false;
            }


            this.currentTurnId = message.currentPlayerId;
            this.listPlaying = [];
            switch (this.gameState) {
                case PhomConstant.GAME_STATE.WAIT: {

                    var indexOfLstPlayer = null;
                    for (var i = 0; i < this.listPlayer.length; i++) {
                        if (this.listPlayer[i].userId == this.myUserId) {
                            indexOfLstPlayer = i;
                        }
                    }

                    this.listPlayerNode = [];

                    if (indexOfLstPlayer || indexOfLstPlayer == 0) {
                        //cc.find('Canvas/Poker/btn_chat').active = true;
                        this.player1.reset();
                        this.player2.reset();
                        this.player3.reset();
                        this.player4.reset();
                        this.player5.reset();
                        this.player6.reset();
                        this.player7.reset();
                        this.player8.reset();
                        this.player9.reset();
                        var lstPlayerNodeTemp = this.getListPlayerNode(indexOfLstPlayer, this.listPlayer.length);
                        if (this.maxCapacity == 5) {
                            this.player1.show(false);
                            this.player3.show(false);
                            this.player6.show(false);
                            this.player8.show(false);
                        }
                        for (var i = 0; i < this.listPlayer.length; i++) {
                            lstPlayerNodeTemp[i].createPlayer(this.listPlayer[i]);
                            lstPlayerNodeTemp[i].showInvite(false);
                            lstPlayerNodeTemp[i].showProfile(true);
                            if (lstPlayerNodeTemp[i].playerNumber == 9) {
                                lstPlayerNodeTemp[i].node.getChildByName('btn_naptien').active = true;
                                Linker.PokerBetMoney = Number(message.listPlayer[i].userMoney);
                            }
                            this.listPlayerNode.push(lstPlayerNodeTemp[i]);
                        }
                        this.myIndex = this.findCurrentPlayerNode(this.myUserId);
                    } else {
                        //cc.find('Canvas/Poker/btn_chat').active = false;
                        this.player9.node.getChildByName('btn_naptien').active = false;
                        var lstPlayerNodeTemp = [this.player4, this.player3, this.player2, this.player1, this.player9, this.player8, this.player7, this.player6, this.player5];
                        if (this.maxCapacity == 5) {
                            this.player1.show(false);
                            this.player3.show(false);
                            this.player6.show(false);
                            this.player8.show(false);
                            lstPlayerNodeTemp = [this.player4, this.player2, this.player9, this.player7, this.player5];
                        }
                        for (var i = 0; i < this.listPlayer.length; i++) {
                            lstPlayerNodeTemp[i].reset();
                            lstPlayerNodeTemp[i].createPlayer(this.listPlayer[i]);
                            lstPlayerNodeTemp[i].showInvite(false);
                            lstPlayerNodeTemp[i].showProfile(true);
                            this.listPlayerNode.push(lstPlayerNodeTemp[i]);
                        }
                        this.myIndex = null;
                    }

                    this.isMaster = false;
                    break;
                }
                case PhomConstant.GAME_STATE.PLAYING: {

                    this.listPlayerNode = [];
                    this.player1.reset();
                    this.player2.reset();
                    this.player3.reset();
                    this.player4.reset();
                    this.player5.reset();
                    this.player6.reset();
                    this.player7.reset();
                    this.player8.reset();
                    this.player9.reset();
                    this.player9.node.getChildByName('btn_naptien').active = false;
                    var lstPlayerNodeTemp = [this.player4, this.player3, this.player2, this.player1, this.player9, this.player8, this.player7, this.player6, this.player5];
                    for (var i = 0; i < this.listPlayer.length; i++) {
                        lstPlayerNodeTemp[i].createPlayer(this.listPlayer[i]);
                        lstPlayerNodeTemp[i].showInvite(false);
                        lstPlayerNodeTemp[i].showProfile(true);
                        this.listPlayerNode.push(lstPlayerNodeTemp[i]);
                    }

                    this.myIndex = null;
                    this.isMaster = false;



                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                        this.listPlayerNode[i].showHiddenCard(true);
                        if (i == this.findCurrentPlayerNode(message.currentPlayerId)) {
                            this.listPlayerNode[i].showTime(true);

                        } else {
                            this.listPlayerNode[i].showTime(false);
                        }
                    }
                    break;
                }
            }

            this.myIndex = null;
            for (var i = 0; i < this.listPlayerNode.length; i++) {
                if (this.listPlayerNode[i].player.userId == this.myUserId) {
                    this.myIndex = i;
                }
            }
        } else {
            if (message.error) {
                cc.Global.showMessage(message.error);
                this.lockTableEvent(false);
                console.log('--9');
                this.requestJoinZone();
                this.clearGame();
            }
        }
    },
    clearGame: function () {
        if (this && cc.isValid(this)) {
            this.PokerNode.destroy();
            this.PokerNode.removeFromParent(true);
        }
    },
    onKickPlayerResponse(message) {
        cc.log(Linker.userData.userId);
        if (message.status == 1) {
            cc.log(this.myUserId);
            if (this.myUserId == message.userId) {
                //Utils.Director.loadScene('LobbyScene');
                //SceneManager.loadScene('LobbyScene',function(){});

                // SceneManager.loadScene('LobbyScene',function(){
                //     var scene = cc.director.getScene();
                //     var canvas = scene.getChildByName("Canvas");
                //     canvas.opacity = 0;
                //     cc.tween(canvas)
                //     .to(0.5, { opacity: 255})
                //     .start()
                // });
                Linker.message = i18n.t("Bạn bị mời ra ngoài");
            } else {
                var index = this.findCurrentPlayer(message.userId);
                if (this.listPlayerNode[index]) {
                    this.listPlayerNode[index].reset();
                    this.listPlayer.splice(index, 1);
                    this.listPlayerNode.splice(index, 1);
                }
                Linker.showMessage(message.userName + i18n.t(" bị mời ra ngoài"));
            }
        } else {

        }
    },
    onTableSettingChangeResponse(message) {
        if (message.status == 1) {
            this.minMoney = message.minMoney;
            this.isAn = message.isAn;
            this.maxCapacity = Number(message.maxNumPlayer);
            this.isTaiGui = message.isTaiGui;
            if (this.maxCapacity == 5) {
                this.player1.show(false);
                this.player3.show(false);
                this.player6.show(false);
                this.player8.show(false);
            } else {
                this.player1.show(true);
                this.player2.show(true);
                this.player3.show(true);
                this.player4.show(true);
                this.player5.show(true);
                this.player6.show(true);
                this.player7.show(true);
                this.player8.show(true);
                this.player9.show(true);
            }
            var info = "";
            if (this.isMaster) {

                info = info + (i18n.t(TextContent.BASE_GAME_CHANGE_CONFIG));
            } else {

                info = info + (i18n.t(TextContent.BASE_GAME_MASTER_CHANGE_CONFIG));
                this.listPlayer.forEach(element => {
                    if (element.isMaster != 1) {
                        element.state = 0;
                    }
                });
                this.listPlayerNode.forEach(element => {
                    if (element.player.isMaster != 1) {
                        element.player.state = 0;
                    }
                });
            }
            info = info + (i18n.t(TextContent.BASE_GAME_NUMBER_PLAYERS) + this.maxCapacity + i18n.t(" người"));
            Linker.showMessage(info);

        } else {

        }
    },

    onMatchStartResponse(message) {
        if (message.status == 1) {
            var meHaveInGame = false;
            var stt = [4, 3, 2, 1, 9, 8, 7, 6, 5];
            this.listPlayerNode.forEach(item => {
                var index = stt.indexOf(item.playerNumber);
                if (item.player.userId == this.myUserId) {
                    meHaveInGame = true;
                }
                if (index > -1) {
                    stt.splice(index, 1);
                }
            });

            var lst = [this.player1, this.player2, this.player3, this.player4, this.player5, this.player6, this.player7, this.player8, this.player9];
            for (var i = 0; i < lst.length; i++) {
                for (var j = 0; j < stt.length; j++) {
                    if (lst[i].playerNumber == stt[j]) {
                        lst[i].reset();
                        break;
                    }
                }
            }

            this.endInterval = true;

            this.bringMoneyPopup.active = false;
            this.timeCountLabel.parent.active = false;
            this.gameState = PhomConstant.GAME_STATE.PLAYING;
            this.tempCardAnimation.parent.active = true;
            this.totalMoneyTable.parent.parent.active = false;
            if (message.idXSmall != '0') {
                this.totalMoneyTable.getComponent(cc.Label).string = Utils.Number.format(Number(this.betMoney) + Number(this.betMoney) / 2);
            }
            if (this.myIndex != null && this.listPlayerNode[this.myIndex]) {
                this.listPlayerNode[this.myIndex].player.cardOwnerList = message.selfCardList;
            }

            if (this.player9.player && this.myUserId == this.player9.player.userId) {
                this.player9.node.getChildByName('btn_naptien').active = false;
            }
            PokerEffect.chiaBaiEffect(this.listPlayerNode, this.tempCardAnimation);

            for (var i = 0; i < this.listPlayerNode.length; i++) {
                this.listPlayerNode[i].masterNode.active = true;
                if (i == this.findCurrentPlayerNode(message.idXDeal)) {
                    this.listPlayerNode[i].masterNode.active = true;
                } else {
                    this.listPlayerNode[i].masterNode.active = false;
                }
                if (i == this.findCurrentPlayerNode(message.idXSmall)) {
                    PokerEffect.showMoneyAtStart(this.listPlayerNode[i], (Number(this.minMoney)) / 2);
                } else if (i == this.findCurrentPlayerNode(message.idXBig)) {
                    PokerEffect.showMoneyAtStart(this.listPlayerNode[i], this.minMoney);
                } else {
                    PokerEffect.showMoneyAtStart(this.listPlayerNode[i], 0);
                }
            }


            this.timeOutStart = setTimeout(() => {
                this.totalMoneyTable.parent.parent.active = true;
                this.tempCardAnimation.parent.active = false;
                this.animationNode.removeAllChildren();
                this.listPlayerNode.forEach(item => {
                    if (item.player.userId != this.myUserId) {
                        item.showHiddenCard(true);
                    } else {
                        item.addCardPlayerOwner();
                        item.showCardOnHand(true);
                    }
                });
                for (var i = 0; i < this.listPlayerNode.length; i++) {
                    if (i == this.findCurrentPlayerNode(message.idXStart)) {
                        this.listPlayerNode[i].showTime(true);
                        if (meHaveInGame && this.myUserId == message.idXStart) {
                            this.btnGroup.active = true;
                        } else {
                            this.btnGroup.active = false;
                        }
                    } else {
                        this.listPlayerNode[i].showTime(false);
                    }
                }

                if (this.myUserId == message.idXStart) {
                    this.resetToPopup();

                } else {
                    this.toBtn.getComponent(cc.Button).interactable = true;
                    this.toBtn.opacity = 255;
                    this.popupTo.active = false;
                }

                if (message.selfCardList.length > 0 && message.selfCardList[0].rank == message.selfCardList[1].rank) {
                    PokerEffect.showPoint(2, this.listPlayerNode[this.myIndex], true);
                }
            }, 600 * this.listPlayerNode.length);

            if (message.idXStart == this.myUserId) {
                this.xemBtn.getComponent(cc.Button).interactable = false;
                this.xemBtn.opacity = 150;
            }
        }
    },
    resetTable() {
        this.listPlayer = [];
        this.listPlayerNode = [];
        this.currentTurnId;
        this.nextTurnId;
        this.nextTurn;
        this.currentTurn;
        this.tableId = 0;
        this.tableIndex = 0;
        this.cardLeft = 0;
        this.maxCapacity = 4;
        this.currentCapacity = 0;
        this.minMoney = 50;
        this.myUserId = Linker.userData.userId;
        this.myIndex = 0;
        this.turnIndex = 0;
        this.takenIndex = 0;
        this.readyPeople = 0;
        this.gameState = PhomConstant.GAME_STATE.WAIT;
        this.myTurnCard = null;
        this.maxCapacity = 9;
    },
    setRoomInfo() {
        this.textMinBet.string = i18n.t("game_title_bet", {
            n: this.minMoney
        });
        this.textTableIndex.string = i18n.t("game_title_room", {
            n: this.tableIndex
        });
        this.textMatchId.string = i18n.t("game_title_match", {
            n: this.tableId
        });
    },
    findCurrentPlayerNode(playerID) {
        for (var i = 0; i < this.listPlayerNode.length; i++) {
            if (this.listPlayerNode[i].player.userId == playerID) {
                return i;
            }
        }
        return -1;
    },

    findCurrentPlayer(playerID) {
        for (var i = 0; i < this.listPlayer.length; i++) {
            if (this.listPlayer[i].userId == playerID) {
                // this.currentPlayer = this.listPlayer[i];
                return i;
            }
        }
        return -1;
    },



    btnChatClick() {
        if (!this.ChatPrivateNode) {
            var chatDialog = cc.instantiate(this.ChatDialog);
            this.node.parent.addChild(chatDialog);
            chatDialog.active = true;
            this.ChatPrivateNode = chatDialog;
        } else {
            this.ChatPrivateNode.active = true;
        }
        // this.ChatPrivateNode.setPosition(0, 0);
        // this.pnChat.active = !this.pnChat.active;
    },
    addCustomEventListener: function () {
        cc.Canvas.instance.node.on(1300, this.onChat, this);
    },
    onChat(data) {
        if (data.error) {
            console.log(data.error);
            return;
        }

        if (data.userId == Linker.userData.userId) {
            this.player9.onChat(data);
        } else {
            var player = this.findPlayerByViewName(data.username);
            switch (player) {
                case "1":
                    this.player1.onChat(data, true);
                    break;
                case "2":
                    this.player2.onChat(data, true);
                    break;
                case "3":
                    this.player3.onChat(data, true);
                    break;
                case "4":
                    this.player4.onChat(data, true);
                    break;
                case "5":
                    this.player5.onChat(data, true);
                    break;
                case "6":
                    this.player6.onChat(data, true);
                    break;
                case "7":
                    this.player7.onChat(data, true);
                    break;
                case "8":
                    this.player8.onChat(data, true);
                    break;
                default:
                    break;
            }
        }
    },
    findPlayerByViewName(username) {
        if (this.player1) {
            if (this.player1.getViewName() == username) {
                return "1";
            }
        }
        if (this.player2) {
            if (this.player2.getViewName() == username) {
                return "2";
            }
        }
        if (this.player3) {
            if (this.player3.getViewName() == username) {
                return "3";
            }
        }
        if (this.player4) {
            if (this.player4.getViewName() == username) {
                return "4";
            }
        }
        if (this.player5) {
            if (this.player5.getViewName() == username) {
                return "5";
            }
        }
        if (this.player6) {
            if (this.player6.getViewName() == username) {
                return "6";
            }
        }
        if (this.player7) {
            if (this.player7.getViewName() == username) {
                return "7";
            }
        }
        if (this.player8) {
            if (this.player8.getViewName() == username) {
                return "8";
            }
        }
        if (this.player9) {
            if (this.player9.getViewName() == username) {
                return "9";
            }
        }

    },
    onBtnSendChatClick() {
        var msg = this.edbChat.string;
        if (msg.length <= 0) {
            return;
        }

        var str = Constant.CMD.CHAT +
            Constant.SEPERATOR.N4 + this.tableId +
            Constant.SEPERATOR.ELEMENT + msg +
            Constant.SEPERATOR.ELEMENT + 0;

        var data = {
            message: msg,
            username: Linker.userData.displayName,
            userId: Linker.userData.userId
        };
        this.onChat(data);

        this.edbChat.string = '';
        XocDiaSend.sendRequest(str);
    },

    _updateTimeStart: function () {
        this.endInterval = false;
        this.timeCountLabel.parent.active = true;
        var countDownDate = new Date().getTime() + 5000;

        var that = this;
        cc.Global.intervalStartPoker = setInterval(function () {
            var now = new Date().getTime();
            var distance = countDownDate - now;
            var seconds = Math.round((distance % (1000 * 60)) / 1000);
            // Display the result in the element with id="demo"
            if (that.timeCountLabel && that.timeCountLabel.getComponent(cc.Label)) {
                if (Number(seconds) >= 0) {
                    that.timeCountLabel.getComponent(cc.Label).string = seconds + "s ";
                } else {
                    that.timeCountLabel.parent.active = false;
                }
            } else {
                clearInterval(cc.Global.intervalStartPoker);
            }
            // If the count down is finished, write some text 
            if (seconds < -1 || that.endInterval) {
                clearInterval(cc.Global.intervalStartPoker);
                cc.Global.intervalStartPoker = null;
                if (that.timeCountLabel) {
                    that.timeCountLabel.parent.active = false;
                    that.timeCountLabel.getComponent(cc.Label).string = "5s";
                }

            }
        }, 1000);
    },

    kickPlayer() {
        if (!this.KickID) {
            return;
        }
        var index = this.findCurrentPlayer(this.KickID);
        if (this.listPlayerNode[index]) {
            var mes = CommonSend.kickPlayer(this.tableId, this.KickID);
            Linker.Socket.send(mes);
        }

    },

    getListPlayerNode(myIndex, lstLength) {
        var lst = [];
        switch (Number(this.maxCapacity)) {
            case 9: {
                switch (myIndex) {
                    case 0: {
                        switch (lstLength) {
                            case 1: {
                                lst = [this.player9];
                                break;
                            }
                            case 2: {
                                lst = [this.player9, this.player5];
                                break;
                            }
                            case 3: {
                                lst = [this.player9, this.player7, this.player5];
                                break;
                            }
                            case 4: {
                                lst = [this.player9, this.player8, this.player7, this.player5];
                                break;
                            }
                            case 5: {
                                lst = [this.player9, this.player8, this.player7, this.player6, this.player5];
                                break;
                            }
                            case 6: {
                                lst = [this.player9, this.player8, this.player7, this.player6, this.player5, this.player4];
                                break;
                            }
                            case 7: {
                                lst = [this.player9, this.player8, this.player7, this.player6, this.player5, this.player4, this.player3];
                                break;
                            }
                            case 8: {
                                lst = [this.player9, this.player8, this.player7, this.player6, this.player5, this.player4, this.player3, this.player2];
                                break;
                            }
                            case 9: {
                                lst = [this.player9, this.player8, this.player7, this.player6, this.player5, this.player4, this.player3, this.player2, this.player1];
                                break;
                            }
                        }
                        break;
                    }
                    case 1: {
                        switch (lstLength) {
                            case 2: {
                                lst = [this.player4, this.player9];
                                break;
                            }
                            case 3: {
                                lst = [this.player4, this.player9, this.player5];
                                break;
                            }
                            case 4: {
                                lst = [this.player4, this.player9, this.player7, this.player5];
                                break;
                            }
                            case 5: {
                                lst = [this.player4, this.player9, this.player7, this.player6, this.player5];
                                break;
                            }
                            case 6: {
                                lst = [this.player4, this.player9, this.player8, this.player7, this.player6, this.player5];
                                break;
                            }
                            case 7: {
                                lst = [this.player1, this.player9, this.player8, this.player7, this.player6, this.player5, this.player4];
                                break;
                            }
                            case 8: {
                                lst = [this.player1, this.player9, this.player8, this.player7, this.player6, this.player5, this.player4, this.player3];
                                break;
                            }
                            case 9: {
                                lst = [this.player1, this.player9, this.player8, this.player7, this.player6, this.player5, this.player4, this.player3, this.player2];
                                break;
                            }
                        }
                        break;
                    }
                    case 2: {
                        switch (lstLength) {
                            case 3: {
                                lst = [this.player4, this.player2, this.player9];
                                break;
                            }
                            case 4: {
                                lst = [this.player4, this.player2, this.player9, this.player7];
                                break;
                            }
                            case 5: {
                                lst = [this.player4, this.player2, this.player9, this.player7, this.player5];
                                break;
                            }
                            case 6: {
                                lst = [this.player4, this.player2, this.player9, this.player7, this.player6, this.player5];
                                break;
                            }
                            case 7: {
                                lst = [this.player4, this.player2, this.player9, this.player8, this.player7, this.player6, this.player5];
                                break;
                            }
                            case 8: {
                                lst = [this.player3, this.player2, this.player9, this.player8, this.player7, this.player6, this.player5, this.player4];
                                break;
                            }
                            case 9: {
                                lst = [this.player2, this.player1, this.player9, this.player8, this.player7, this.player6, this.player5, this.player4, this.player3];
                                break;
                            }
                        }
                        break;
                    }
                    case 3: {
                        switch (lstLength) {
                            case 4: {
                                lst = [this.player4, this.player3, this.player2, this.player9];
                                break;
                            }
                            case 5: {
                                lst = [this.player4, this.player3, this.player2, this.player9, this.player5];
                                break;
                            }
                            case 6: {
                                lst = [this.player4, this.player3, this.player2, this.player9, this.player6, this.player5];
                                break;
                            }
                            case 7: {
                                lst = [this.player4, this.player3, this.player2, this.player9, this.player7, this.player6, this.player5];
                                break;
                            }
                            case 8: {
                                lst = [this.player4, this.player3, this.player2, this.player9, this.player8, this.player7, this.player6, this.player5];
                                break;
                            }
                            case 9: {
                                lst = [this.player3, this.player2, this.player1, this.player9, this.player8, this.player7, this.player6, this.player5, this.player4];
                                break;
                            }
                        }
                        break;
                    }
                    case 4: {
                        switch (lstLength) {
                            case 5: {
                                lst = [this.player4, this.player3, this.player2, this.player1, this.player9];
                                break;
                            }
                            case 6: {
                                lst = [this.player4, this.player3, this.player2, this.player1, this.player9, this.player5];
                                break;
                            }
                            case 7: {
                                lst = [this.player4, this.player3, this.player2, this.player1, this.player9, this.player6, this.player5];
                                break;
                            }
                            case 8: {
                                lst = [this.player4, this.player3, this.player2, this.player1, this.player9, this.player7, this.player6, this.player5];
                                break;
                            }
                            case 9: {
                                lst = [this.player4, this.player3, this.player2, this.player1, this.player9, this.player8, this.player7, this.player6, this.player5];
                                break;
                            }
                        }
                        break;
                    }
                    case 5: {
                        switch (lstLength) {
                            case 6: {
                                lst = [this.player5, this.player4, this.player3, this.player2, this.player1, this.player9];
                                break;
                            }
                            case 7: {
                                lst = [this.player5, this.player4, this.player3, this.player2, this.player1, this.player9, this.player6];
                                break;
                            }
                            case 8: {
                                lst = [this.player5, this.player4, this.player3, this.player2, this.player1, this.player9, this.player7, this.player6];
                                break;
                            }
                            case 9: {
                                lst = [this.player5, this.player4, this.player3, this.player2, this.player1, this.player9, this.player8, this.player7, this.player6];
                                break;
                            }
                        }
                        break;
                    }
                    case 6: {
                        switch (lstLength) {
                            case 7: {
                                lst = [this.player6, this.player5, this.player4, this.player3, this.player2, this.player1, this.player9];
                                break;
                            }
                            case 8: {
                                lst = [this.player6, this.player5, this.player4, this.player3, this.player2, this.player1, this.player9, this.player7];
                                break;
                            }
                            case 9: {
                                lst = [this.player6, this.player5, this.player4, this.player3, this.player2, this.player1, this.player9, this.player8, this.player7];
                                break;
                            }
                        }
                        break;
                    }
                    case 7: {
                        switch (lstLength) {
                            case 8: {
                                lst = [this.player7, this.player6, this.player5, this.player4, this.player3, this.player2, this.player1, this.player9];
                                break;
                            }
                            case 9: {
                                lst = [this.player7, this.player6, this.player5, this.player4, this.player3, this.player2, this.player1, this.player9, this.player8];
                                break;
                            }
                        }
                        break;
                    }
                    case 8: {
                        switch (lstLength) {
                            case 9: {
                                lst = [this.player8, this.player7, this.player6, this.player5, this.player4, this.player3, this.player2, this.player1, this.player9];
                                break;
                            }
                        }
                        break;
                    }
                }
                break;
            }

            case 5: {
                switch (myIndex) {
                    case 0: {
                        switch (lstLength) {
                            case 1: {
                                lst = [this.player9];
                                break;
                            }
                            case 2: {
                                lst = [this.player9, this.player5];
                                break;
                            }
                            case 3: {
                                lst = [this.player9, this.player5, this.player4];
                                break;
                            }
                            case 4: {
                                lst = [this.player9, this.player7, this.player5, this.player4];
                                break;
                            }
                            case 5: {
                                lst = [this.player9, this.player7, this.player5, this.player4, this.player2];
                                break;
                            }
                        }
                        break;
                    }
                    case 1: {
                        switch (lstLength) {
                            case 2: {
                                lst = [this.player4, this.player9];
                                break;
                            }
                            case 3: {
                                lst = [this.player4, this.player9, this.player5];
                                break;
                            }
                            case 4: {
                                lst = [this.player4, this.player9, this.player7, this.player5];
                                break;
                            }
                            case 5: {
                                lst = [this.player2, this.player9, this.player7, this.player5, this.player4];
                                break;
                            }
                        }
                        break;
                    }
                    case 2: {
                        switch (lstLength) {
                            case 3: {
                                lst = [this.player5, this.player4, this.player9];
                                break;
                            }
                            case 4: {
                                lst = [this.player5, this.player4, this.player9, this.player7];
                                break;
                            }
                            case 5: {
                                lst = [this.player4, this.player2, this.player9, this.player7, this.player5];
                                break;
                            }
                        }
                        break;
                    }
                    case 3: {
                        switch (lstLength) {
                            case 4: {
                                lst = [this.player5, this.player4, this.player2, this.player9];
                                break;
                            }
                            case 5: {
                                lst = [this.player5, this.player4, this.player2, this.player9, this.player7];
                                break;
                            }
                        }
                        break;
                    }
                    case 4: {
                        switch (lstLength) {
                            case 5: {
                                lst = [this.player7, this.player5, this.player4, this.player2, this.player9];
                                break;
                            }
                        }
                        break;
                    }
                }
                break;
            }

        }


        return lst;
    },
    onUpdateMoney(response) {
        if (response.userId == Linker.userData.userId) {
            // var index = this.findCurrentPlayer(Linker.userData.userId);
            // var playerNode = this.listPlayerNode[index];
            // if(playerNode){
            //     playerNode.moneyPlayer.string = Utils.Number.format(response.userMoney);
            // }
            //Linker.showMessage("Fcoin Hiện tại: " + Utils.Number.format(response.userMoney));

        }
    },
    setWifiStatus: function () {
        var now = new Date().getTime();
        var level = now - cc.Global.PINGTIME;
        var frame = null;
        if (level > 3000 && level <= 4000) {
            frame = this.wifiSignalImage[1];
        } else if (level > 4000 && level <= 5000) {
            frame = this.wifiSignalImage[2];
        } else if (level > 5000) {
            frame = this.wifiSignalImage[0];
        } else {
            frame = this.wifiSignalImage[3];
        }
        this.wififSignalSprite.spriteFrame = frame;
    },
});