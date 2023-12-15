
var Linker = require('Linker');
var PhomConstant = require('PhomConstant');
var MauBinhPlayer = require('MauBinhPlayer');
var CommonSend = require('CommonSend');
var MauBinhSend = require('MauBinhSend');
var LobbySend = require('LobbySend');
var CardUtils = require('CardUtils');
var Utils = require('Utils');
var MauBinhEffect = require('MauBinhEffect');
var Constant = require('Constant');
var SceneManager = require('SceneManager');
var NodePoolManager = require('NodePoolManager');
var MauBinhLogic = require('MauBinhLogic');
var XocDiaSend = require('XocDiaSend');
var SocketConstant = require('SocketConstant');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,
    ctor() {
        this.tableId = null;
        this.myUserId = null;
        this.gameState = PhomConstant.GAME_STATE.WAIT;
        this.tableIndex = null;
        this.isMaster = false;
        this.listPlayerNode = [];
        this.listPlayer = [];
        this.myIndex = 0;
        this.currentCapacity = 0;
        this.minMoney = 50;
        this.maxCapacity = 0;
        this.listPlaying = [];
        //this.listTimer = [];
        this.myCard = "";
        this.countTime = 0;
        this.timer = 65;
        this.isPlayGame = true;
    },
    properties: {
        player0: MauBinhPlayer,
        player1: MauBinhPlayer,
        player2: MauBinhPlayer,
        player3: MauBinhPlayer,
        buttonGame: cc.Node,
        readyGameBtn: cc.Node,
        xepLaiBtn: cc.Node,
        textTableIndex: cc.Label,
        textMatchId: cc.Label,
        textMinBet: cc.Label,
        formXepBai: cc.Prefab,
        itemCard: cc.Prefab,
        //srcChat: cc.ScrollView,
        ChatDialog: cc.Prefab,
        DialogContent: cc.Prefab,
        timeCountLabel: cc.Node,
        pnChat: cc.Node,
        edbChat: cc.EditBox,
        txtChi: cc.Label,
        dongHo: cc.Node,
        nohuGameBaiEffectLayerPrefab: cc.Prefab,
        wififSignalSprite: cc.Sprite,
        wifiSignalImage: [cc.SpriteFrame],
        blockEventNode: cc.Node,
        maubinhContainer: cc.Node
    },
    blockAllEvent: function () {
        this.blockEventNode.active = true;
    },
    unBlockAllEvent: function () {
        this.blockEventNode.active = false;
    },
    isShowTime(isShow = false) {
        if (isShow) {
            this.timeCountLabel.parent.active = true;
            this.countTime = 5;
        } else {
            this.timeCountLabel.parent.active = false;
            this.countTime = 0;
        }
    },
    resetTable() {
        this.gameState = PhomConstant.GAME_STATE.WAIT;
        this.listPlayerNode = [];
        this.txtChi.node.active = false;
        this.hoaShow(0);
    },
    requestCreateGame: function (tableData) {
        var data = LobbySend.createTableRequest(0, 0, tableData.firstCashBet, 0);
        Linker.Socket.send(data);
    },
    requestJoinGame: function (tableData) {
        cc.log("vao roi", tableData)
        var data = LobbySend.joinTableRequest(tableData.matchId);
        Linker.Socket.send(data);
    },
    requestQuickPlay: function () {
        if (Linker.ZONE) {
            Linker.Socket.send(LobbySend.fastPlayRequest(Linker.ZONE));
        } else {
            cc.error("Không thể join game random, please try again...", Linker);
        }
    },
    initAudio: function () {
        NewAudioManager.initCommonSoundGame({
            gameName: "MAUBINH",
            bundleName: Constant.BUNDLE.MAUBINH.name
        });
    },
    onLoad() {
        this.initAudio();
        this.addCustomEventListener();
        NewAudioManager.playAudioSource("joinboard");
        var that = this;
        cc.find('Canvas').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            Linker.lastTimeManipulation = new Date().getTime();
        }, that.node);
        this.dongHo.active = false;
        this.myUserId = Linker.userData.userId;
        if (!this.reconnectDialog || (this.reconnectDialog && !cc.isValid(this.reconnectDialog))) {
            Utils.Malicious.removeNodeByNameFromParent("DialogLosConnect", cc.find('Canvas'));
            this.reconnectDialog = cc.instantiate(this.DialogContent);
            cc.find('Canvas').addChild(this.reconnectDialog);
        }
        if (this.reconnectDialog) {
            this.reconnectDialog.active = false;
        }
    },
    addCustomEventListener: function () {
        cc.Canvas.instance.node.on(1300, this.onChat, this);
    },
    addSocketEvent() {
        Linker.Event.addEventListener(Constant.CMD.CHAT, this.onChat, this);
        Linker.Event.addEventListener(1104, this.onTurnCardRespone, this);
        Linker.Event.addEventListener(1105, this.onJoinTableResponse, this);
        Linker.Event.addEventListener(1100, this.onCreateTableResponse, this);
        Linker.Event.addEventListener(1106, this.onPlayerJoinedResponse, this);
        Linker.Event.addEventListener(1103, this.onLeaveTableRespone, this);
        Linker.Event.addEventListener(1242, this.onTableSettingChangeResponse, this);
        Linker.Event.addEventListener(1116, this.onKickPlayerResponse, this);
        Linker.Event.addEventListener(1114, this.onGameEndResponse, this);
        Linker.Event.addEventListener(1108, this.onMatchStartResponse, this);
        Linker.Event.addEventListener(3, this.onReconnectionResponse, this);
        Linker.Event.addEventListener(1245, this.onSortRequest, this);
        Linker.Event.addEventListener(121005, this.onBaoMauBinhRequest, this);
        Linker.Event.addEventListener(121006, this.onSoChiResponse, this);
        Linker.Event.addEventListener(121009, this.onSoSapHamResponse, this);
        Linker.Event.addEventListener(1110, this.OnPlayerReadyResponse, this);
        Linker.Event.addEventListener(1246, this.onFastJoinTable, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
        Linker.Event.addEventListener(SocketConstant.COMMON.UPDATE_CRASH, this.onUpdateMoney, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(Constant.CMD.CHAT, this.onChat, this);
        Linker.Event.removeEventListener(1126, this.onAnBaiResponse, this);
        Linker.Event.removeEventListener(1125, this.onBocBaiResponse, this);
        Linker.Event.removeEventListener(1128, this.onGuiBaiResponse, this);
        Linker.Event.removeEventListener(1127, this.onHaBaiResponse, this);
        Linker.Event.removeEventListener(1104, this.onTurnCardRespone, this);
        Linker.Event.removeEventListener(1105, this.onJoinTableResponse, this);
        Linker.Event.removeEventListener(1100, this.onCreateTableResponse, this);
        Linker.Event.removeEventListener(1106, this.onPlayerJoinedResponse, this);
        Linker.Event.removeEventListener(1103, this.onLeaveTableRespone, this);
        Linker.Event.removeEventListener(1242, this.onTableSettingChangeResponse, this);
        Linker.Event.removeEventListener(1116, this.onKickPlayerResponse, this);
        Linker.Event.removeEventListener(1114, this.onGameEndResponse, this);
        Linker.Event.removeEventListener(1108, this.onMatchStartResponse, this);
        Linker.Event.removeEventListener(3, this.onReconnectionResponse, this);
        Linker.Event.removeEventListener(1245, this.onSortRequest, this);
        Linker.Event.removeEventListener(121005, this.onBaoMauBinhRequest, this);
        Linker.Event.removeEventListener(121006, this.onSoChiResponse, this);
        Linker.Event.removeEventListener(121009, this.onSoSapHamResponse, this);
        Linker.Event.removeEventListener(1110, this.OnPlayerReadyResponse, this);
        Linker.Event.removeEventListener(1246, this.onFastJoinTable, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
        Linker.Event.removeEventListener(SocketConstant.COMMON.UPDATE_CRASH, this.onUpdateMoney, this);
    },
    onFastJoinTable: function (message) {
        if (this && cc.isValid) {
            if (message) {
                if (Number(message.status) == 0) {
                    // cc.error(message);
                    cc.Global.showMessage(message.error);
                    this.lockTableEvent(false);
                    console.log('--8');
                    this.requestJoinZone();
                    this.clearGame();
                }
            }
        }
    },
    settingBtnClick() {
        var settingDialog = this.maubinhContainer.getChildByName("Setting");
        if (settingDialog) {
            settingDialog.active = true;
        }
    },
    onSoChiResponse(message) {
        if (message.status == 1) {
            if (message.listPlayer && message.cardIndex) {
                this.dongHo.active = false;
                this.isShowTime(false);
                this.xepLaiBtn.active = false;
                this.setTxtChi("Chi " + message.cardIndex);
                message.listPlayer.forEach(item => {
                    var index1 = this.findCurrentPlayerNode(item.userId);
                    var money = 0;
                    item.playerExtra.forEach(map => {
                        money += Number(map.money);
                    });
                    if (this.listPlayerNode[index1]) {
                        this.listPlayerNode[index1].showTime(false);
                        this.listPlayerNode[index1].isXepBai(false);
                        this.listPlayerNode[index1].isXepXong(false);
                        this.listPlayerNode[index1].soChiEffect(item, message.cardIndex);
                        this.listPlayerNode[index1].setMoney(money, Math.floor(money / this.minMoney));
                    }
                });
            }
        }
    },
    findPlayerExtra(extra, map) {
        var index = -1;
        for (let i = 0; i < extra.length; i++) {
            if (extra[i].userId == map.userId) {
                index = i;
                break;
            }
        }
        return index;
    },
    onSoSapHamResponse(message) {
        if (message.status == 1) {
            var indexSapLang = -1;
            message.listPlayer.forEach(item => {
                var index = this.findCurrentPlayerNode(item.userId);
                var anChi = 0;
                if (item.sapType == 1) {
                    indexSapLang = index;
                }
                item.sapResultMap.forEach(map => {
                    anChi += Number(map.chiSapHamCount);
                });
                if (this.listPlayerNode[index]) {
                    this.listPlayerNode[index].soSamHamEffect(anChi, 0);
                    this.listPlayerNode[index].setMoney(0, anChi);
                    if (anChi > 0) {
                        NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.THANG, 1, false, false);
                    }
                }
            });
            if (this.listPlayerNode[indexSapLang]) {
                setTimeout(() => {
                    message.listPlayer.forEach(item => {
                        var index = this.findCurrentPlayerNode(item.userId);
                        var anChiSapLang = 0;
                        item.sapResultMap.forEach(map => {
                            anChiSapLang += Number(map.chiSapLangCount);
                        });
                        if (this.listPlayerNode[index]) {
                            if (index == indexSapLang) {
                                this.listPlayerNode[index].soSamHamEffect(anChiSapLang, 1);
                                this.listPlayerNode[index].setMoney(0, anChiSapLang);
                                NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.THANG, 1, false, false);
                            } else {
                                this.listPlayerNode[index].soSamHamEffect(anChiSapLang, -1);
                                this.listPlayerNode[index].setMoney(0, anChiSapLang);
                            }
                        }
                    });
                }, 3000);
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
        this.pnChat.active = false;
    },
    btnChatClick() {
        if (!this.ChatPrivateNode) {
            var chatDialog = cc.instantiate(this.ChatDialog);
            this.maubinhContainer.addChild(chatDialog);
            chatDialog.active = true;
            this.ChatPrivateNode = chatDialog;
        } else {
            this.ChatPrivateNode.active = true;
        }
        this.ChatPrivateNode.setPosition(0, 0);
    },
    moiChoiBtnClick() {
        if (this.gameState == 0) {
            var inviteDialog = this.maubinhContainer.getChildByName("InviteSendDialog");
            if (inviteDialog) {
                inviteDialog.active = true;
            }
        } else {
            Linker.showMessage("Bạn không thể mời khi đang chơi");
        }
    },
    onXepLaiClick() {
        this.player0.cardOnHandList.active = false;
        this.xepLaiBtn.active = false;
        this.dongHo.active = false;

        this.player0.isXepXong(false);
        this.XepBai(false);
        var data = MauBinhSend.sortRequest(this.tableId, "");
        Linker.Socket.send(data);

    },
    onSortRequest(message) {
        if (message.status == 1) {
            NewAudioManager.playClick();
            if (message.userId == this.myUserId) {
                var that = this;
                this.player0.player.cardOwnerList = message.cardOwnerList;
                this.player0.updateCard(message.cardOwnerList, () => {
                    that.player0.cardOnHandList.active = true;
                    that.xepLaiBtn.active = true;
                    this.player0.isXepXong(true);
                });
            } else {
                var index = this.findCurrentPlayer(message.userId);
                if (this.listPlayerNode[index]) {
                    this.listPlayerNode[index].isXepBai(false);
                    this.listPlayerNode[index].isXepXong(true);
                }
                if (message.isXepBai == 0) {
                    this.listPlayerNode[index].isXepBai(true);
                    this.listPlayerNode[index].isXepXong(false);
                }
            }
        } else {
            Linker.showMessage(message.error);
        }
    },
    baoBinh(cardOwnerList) {
        this.player0.player.cardOwnerList = cardOwnerList;
        this.myCard = MauBinhLogic.getServerValueToString(cardOwnerList);
        var data = MauBinhSend.baoMauBinhRequest(this.tableId, 1, this.myCard);
        Linker.Socket.send(data);
    },
    onBaoMauBinhRequest(message) {
        if (message.status == 1) {
            var MauBinhXepBai = this.node.getChildByName("MauBinhXepBai");
            if (MauBinhXepBai) {
                MauBinhXepBai.destroy();
            }
            this.xepLaiBtn.active = false;
            this.listPlayerNode.forEach(item => {
                item.showTime(false);
                if (item.player.userId == message.userId) {
                    item.cardOnHandList.active = true;
                    item.showAnTrang(message.caseType);
                    NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.TOI_TRANG, 1, false, false);
                } else {
                    item.isXepBai(false);
                }
            });
        } else {
            Linker.showMessage(message.error);
        }
    },
    updateCard(cardOwnerList) {
        this.dongHo.active = true;
        this.player0.player.cardOwnerList = cardOwnerList;
        this.myCard = MauBinhLogic.getServerValueToString(cardOwnerList);
        var that = this;
        this.player0.updateCard(cardOwnerList, () => {
            that.player0.cardOnHandList.active = true;
            var data = MauBinhSend.sortRequest(that.tableId, that.myCard);
            Linker.Socket.send(data);
        });
    },
    sitClick() {
        if (this.listPlayer.length > this.maxCapacity - 1 || this.listPlayerNode.length > this.maxCapacity - 1) {
            Linker.showMessage("Bàn chơi đã hết chỗ!");
            //this.readyGameBtn.active = false;
            return;
        }
        var data = LobbySend.joinTableRequest(this.tableId);
        Linker.Socket.send(data);
    },
    backHandlerBtn: function (event) {
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.backspace) {
            this.backBtn();
        }
    },
    onMatchStartResponse(message) {
        if (message.status == 1) {
            this.stopAllGameEffect();
            this.timer = 65;
            this.isShowTime(false);
            this.gameState = PhomConstant.GAME_STATE.PLAYING;
            this.listPlaying = message.listPlaying;
            //cc.log("trung_listPlayerNode",this.listPlayerNode);
            this.listPlayerNode.forEach(item => {
                if (item.player.userId == this.myUserId) {
                    var that = this;
                    this.player0.player.cardOwnerList = message.cardOwnerList;
                    this.myCard = MauBinhLogic.getServerValueToString(message.cardOwnerList);
                    MauBinhEffect.chiaBaiEffect(item, () => {
                        that.player0.updateCard(message.cardOwnerList, () => {
                            item.showTime(true);
                            that.XepBai(true, message.binhType);
                            that.player0.cardOnHandList.active = false;
                            that.xepLaiBtn.active = false;
                        });
                    });
                } else {
                    MauBinhEffect.chiaBaiEffect(item, () => {
                        item.showTime(true);
                        item.isXepBai(true);
                    });
                }
            });

            if (!this.isPlayGame) {
                this.dongHo.active = true;
            }
        } else {
            Linker.showMessage(message.error);
        }
    },
    XepBai(isCheckBinh, binhType) {
        var formXepBai = cc.instantiate(this.formXepBai);
        var formXepBaiJS = formXepBai.getComponent("MauBinhXepBai");
        formXepBaiJS.updateCard(this.player0.player.cardOwnerList, this.timer, isCheckBinh);
        if (binhType && binhType > 0) {
            formXepBaiJS.btnBaobinh.active = true;
        }
        this.node.addChild(formXepBai);
    },
    onJoinTableResponse(message) {
        // console.log('*** linker',Linker);
        cc.log("MauBinh_onJoinTableRespone: ", message);
        cc.Global.hideLoading();
        if (message.status == 1) {
            NewAudioManager.playAudioSource("joinboard");
            this.gameState = Number(message.isPlaying);
            this.showMauBinhGame(message);
            this.setGameState(message);
            this.isReconnect = false;
            this.resetReconnectRoom();
            this.timer = message.timeCount;
            if (message.listPlaying.indexOf(this.myUserId) < 0) {
                this.onGuestJoinRequest(message);
                return;
            }
            this.isPlayGame = true;
            //this.readyGameBtn.active = false;
            this.buttonGame.active = true;
            this.isMaster = false;
            this.resetTable();
            this.tableId = message.tableId;
            Linker.CURRENT_TABLE.tableId = message.tableId;
            this.tableIndex = message.tableIndex;
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.setRoomInfo();
            this.dutyType = message.dutyType;
            if (this.maxCapacity) {
                this.player0.reset(this.isPlayGame);
                this.player1.reset(this.isPlayGame);
                this.player2.reset(this.isPlayGame);
                this.player3.reset(this.isPlayGame);
                if (this.maxCapacity == 2) {
                    this.player1.hideNode(true);
                    this.player3.hideNode(true);
                } else {
                    this.player1.hideNode(false);
                    this.player3.hideNode(false);
                }
            }
            this.currentCapacity = message.listPlayer.length;
            this.listPlayer = message.listPlayer;
            this.gameState = Number(message.isPlaying);
            this.listPlaying = message.listPlaying;

            switch (this.gameState) {
                case PhomConstant.GAME_STATE.WAIT: {
                    this.isShowTime(true);
                    switch (this.currentCapacity) {
                        case 2: {
                            this.player0.showProfile(true);
                            this.player2.showProfile(true);
                            this.player2.createPlayer(this.listPlayer[0]);
                            this.player0.createPlayer(this.listPlayer[1]);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player0);
                            this.myIndex = 1;
                            break
                        }
                        case 3: {
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player0.showProfile(true);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.player0.createPlayer(message.listPlayer[2]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player0);
                            this.myIndex = 2;

                            break
                        }
                        case 4: {
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player3.showProfile(true);
                            this.player0.showProfile(true);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.player3.createPlayer(message.listPlayer[2]);
                            this.player0.createPlayer(message.listPlayer[3]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player3);
                            this.listPlayerNode.push(this.player0);
                            this.myIndex = 3;
                            break
                        }
                    }
                    break;
                }
                case PhomConstant.GAME_STATE.PLAYING: {
                    this.isShowTime(false);
                    this.dongHo.active = true;
                    switch (this.currentCapacity) {
                        case 3: {
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player0.showProfile(true, true);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.player0.createPlayer(message.listPlayer[2]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player0);
                            this.myIndex = 2;

                            break
                        }
                        case 4: {
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player3.showProfile(true);
                            this.player0.showProfile(true, true);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.player3.createPlayer(message.listPlayer[2]);
                            this.player0.createPlayer(message.listPlayer[3]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player3);
                            this.listPlayerNode.push(this.player0);
                            this.myIndex = 3;

                            break
                        }
                    }
                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                        if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2) {
                            this.listPlayerNode[i].showCardOnHand(true);
                            this.listPlayerNode[i].isXepBai(true);
                        } else {
                            this.listPlayerNode[i].showCardOnHand(false);
                        }
                    }
                    break;
                }
            }
        } else {
            if (message.error) {
                cc.Global.showMessage(message.error);
                this.lockTableEvent(false);
                this.clearGame();
            }
        }
    },
    clearGame: function () {
        if (this && cc.isValid(this)) {
            this.node.destroy();
            this.node.removeFromParent(true);
        }
    },
    lockTableEvent: function (enable) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_ITEM_BAN_YEU_CAU_BLOCK_SU_KIEN_CLICK, true);
        customEvent.enableBlock = enable;
        this.node.dispatchEvent(customEvent);
    },
    onGuestJoinRequest(message) {
        if (message.status == 1) {
            this.isPlayGame = false;
            //this.readyGameBtn.active = true;
            this.buttonGame.active = true;
            this.resetTable();
            this.tableId = message.tableId;
            this.tableIndex = message.tableIndex;
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.setRoomInfo();
            this.dutyType = message.dutyType;
            if (this.maxCapacity) {
                this.player0.reset(this.isPlayGame);
                this.player1.reset(this.isPlayGame);
                this.player2.reset(this.isPlayGame);
                this.player3.reset(this.isPlayGame);
                if (this.maxCapacity == 2) {
                    this.player1.hideNode(true);
                    this.player3.hideNode(true);
                } else {
                    this.player1.hideNode(false);
                    this.player3.hideNode(false);
                }
            }
            this.currentCapacity = message.listPlayer.length;
            this.listPlayer = message.listPlayer;
            this.gameState = Number(message.isPlaying);
            this.listPlaying = message.listPlaying;
            this.isMaster = false;
            this.myIndex = -1;
            switch (this.gameState) {
                case PhomConstant.GAME_STATE.WAIT: {
                    switch (this.currentCapacity) {
                        case 1: {
                            this.isShowTime(false);
                            this.player2.showProfile(true);
                            this.player2.createPlayer(this.listPlayer[0]);
                            this.listPlayerNode.push(this.player2);
                            break
                        }
                        case 2: {
                            this.isShowTime(true);
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player1.createPlayer(this.listPlayer[0]);
                            this.player2.createPlayer(this.listPlayer[1]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            break
                        }
                        case 3: {
                            this.isShowTime(true);
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player3.showProfile(true);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.player3.createPlayer(message.listPlayer[2]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player3);
                            break
                        }
                        case 4: {
                            this.isShowTime(true);
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player3.showProfile(true);
                            this.player0.showProfile(true);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.player3.createPlayer(message.listPlayer[2]);
                            this.player0.createPlayer(message.listPlayer[3]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player3);
                            this.listPlayerNode.push(this.player0);
                            //this.readyGameBtn.active = false;
                            break
                        }
                    }
                    break;
                }
                case PhomConstant.GAME_STATE.PLAYING: {
                    this.isShowTime(false);
                    this.dongHo.active = true;
                    switch (this.currentCapacity) {
                        case 2: {
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            break
                        }
                        case 3: {
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player3.showProfile(true);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.player3.createPlayer(message.listPlayer[2]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player3);
                            break
                        }
                        case 4: {
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player3.showProfile(true);
                            this.player0.showProfile(true);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.player3.createPlayer(message.listPlayer[2]);
                            this.player0.createPlayer(message.listPlayer[3]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player3);
                            this.listPlayerNode.push(this.player0);
                            //this.readyGameBtn.active = false;
                            break
                        }
                    }
                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                        if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2) {
                            this.listPlayerNode[i].showCardOnHand(true);
                            this.listPlayerNode[i].isXepBai(true);
                        } else {
                            this.listPlayerNode[i].showCardOnHand(false);
                        }
                    }
                    break;
                }
            }
        }
    },
    onReconnectionResponse(message) {
        if (message.status == 1) {
            this.isReconnect = true;
            this.showMauBinhGame(message);
            this.setGameState(message);
            NewAudioManager.playAudioSource("joinboard");
            this.isShowTime(false);
            this.timer = message.timeCount;
            this.tableId = message.tableId;
            if (!Linker.CURRENT_TABLE) Linker.CURRENT_TABLE = {};
            Linker.CURRENT_TABLE.tableId = message.tableId;
            this.tableIndex = message.tableIndex;
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.setRoomInfo();
            if (this.maxCapacity) {
                this.player0.reset(this.isPlayGame);
                this.player1.reset(this.isPlayGame);
                this.player2.reset(this.isPlayGame);
                this.player3.reset(this.isPlayGame);
                if (this.maxCapacity == 2) {
                    this.player1.hideNode(true);
                    this.player3.hideNode(true);
                } else {
                    this.player1.hideNode(false);
                    this.player3.hideNode(false);
                }
            }
            this.currentCapacity = message.listPlayer.length;
            this.listPlayer = message.listPlayer;
            this.gameState = PhomConstant.GAME_STATE.PLAYING;
            this.myIndex = this.findCurrentPlayer(this.myUserId);
            this.listPlaying = [];
            this.listPlayer.forEach((element) => {
                this.listPlaying.push(element.userId);
            });
            if (this.listPlayer[this.myIndex].isMaster == 1) {
                this.isMaster = true;
            } else {
                this.isMaster = false;
            }
            //this.readyGameBtn.active = false;
            switch (this.myIndex) {
                case 0: {
                    switch (this.currentCapacity) {
                        case 2: {
                            this.player0.createPlayer(this.listPlayer[0]);
                            this.player2.createPlayer(this.listPlayer[1]);
                            this.player0.showProfile(true);
                            this.player2.showProfile(true);
                            this.listPlayerNode = [this.player0, this.player2];
                            break;
                        }
                        case 3: {
                            this.player0.createPlayer(this.listPlayer[0]);
                            this.player1.createPlayer(this.listPlayer[1]);
                            this.player2.createPlayer(this.listPlayer[2]);
                            this.player0.showProfile(true);
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.listPlayerNode = [this.player0, this.player1, this.player2];

                            break;
                        }
                        case 4: {

                            this.player0.createPlayer(this.listPlayer[0]);
                            this.player1.createPlayer(this.listPlayer[1]);
                            this.player2.createPlayer(this.listPlayer[2]);
                            this.player3.createPlayer(this.listPlayer[3]);
                            this.player0.showInvite(false);
                            this.player0.showProfile(true);
                            this.player1.showInvite(false);
                            this.player1.showProfile(true);
                            this.player2.showInvite(false);
                            this.player2.showProfile(true);
                            this.player3.showInvite(false);
                            this.player3.showProfile(true);
                            this.listPlayerNode = [this.player0, this.player1, this.player2, this.player3];
                            break;
                        }
                    }
                    break;
                }
                case 1: {
                    switch (this.currentCapacity) {
                        case 2: {

                            this.player0.createPlayer(this.listPlayer[1]);
                            this.player2.createPlayer(this.listPlayer[0]);
                            this.player0.showProfile(true);
                            this.player2.showProfile(true);
                            this.listPlayerNode = [this.player2, this.player0];

                            break;
                        }
                        case 3: {

                            this.player0.createPlayer(this.listPlayer[1]);
                            this.player1.createPlayer(this.listPlayer[2]);
                            this.player2.createPlayer(this.listPlayer[0]);
                            this.player0.showProfile(true);
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.listPlayerNode = [this.player2, this.player0, this.player1];

                            break;
                        }
                        case 4: {

                            this.player0.createPlayer(this.listPlayer[1]);
                            this.player1.createPlayer(this.listPlayer[2]);
                            this.player2.createPlayer(this.listPlayer[3]);
                            this.player3.createPlayer(this.listPlayer[0]);
                            this.player0.showProfile(true);
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player3.showProfile(true);
                            this.listPlayerNode = [this.player3, this.player0, this.player1, this.player2];

                            break;
                        }
                    }
                    break;
                }
                case 2: {
                    switch (this.currentCapacity) {
                        case 3: {
                            this.player0.createPlayer(this.listPlayer[2]);
                            this.player1.createPlayer(this.listPlayer[0]);
                            this.player2.createPlayer(this.listPlayer[1]);
                            this.player0.showProfile(true);
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.listPlayerNode = [this.player1, this.player2, this.player0];
                            break;
                        }
                        case 4: {

                            this.player0.createPlayer(this.listPlayer[2]);
                            this.player1.createPlayer(this.listPlayer[0]);
                            this.player2.createPlayer(this.listPlayer[1]);
                            this.player3.createPlayer(this.listPlayer[3]);
                            this.player0.showProfile(true);
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player3.showProfile(true);
                            this.listPlayerNode = [this.player1, this.player2, this.player0, this.player3];
                            break;
                        }
                    }
                    break;
                }
                case 3: {
                    switch (this.currentCapacity) {
                        case 4: {
                            this.player0.createPlayer(this.listPlayer[3]);
                            this.player1.createPlayer(this.listPlayer[0]);
                            this.player2.createPlayer(this.listPlayer[1]);
                            this.player3.createPlayer(this.listPlayer[2]);
                            this.player0.showProfile(true);
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player3.showProfile(true);
                            this.listPlayerNode = [this.player1, this.player2, this.player3, this.player0];
                            break;
                        }
                    }
                    break;
                }
            }
            this.player0.player.cardOwnerList = message.cardOwnerList;
            var that = this;
            this.listPlayer.forEach(player => {
                if (player.isReady == 1) {
                    if (player.userId == this.myUserId) {
                        this.player0.updateCard(message.cardOwnerList, () => {
                            that.player0.showTime(true);
                            that.XepBai(true);
                            that.player0.cardOnHandList.active = false;
                        });
                    } else {
                        var index = this.findCurrentPlayer(player.userId);
                        if (this.listPlayerNode[index]) {
                            this.listPlayerNode[index].cardOnHandList.active = true;
                            this.listPlayerNode[index].showTime(true);
                            this.listPlayerNode[index].isXepBai(true);
                        }
                    }
                }
            });
        }
    },
    onTurnCardRespone(message) {

    },
    onPlayerJoinedResponse2(message) {
        NewAudioManager.playAudioSource("joinboard");
        if (this.maxCapacity) {
            this.player0.reset(this.isPlayGame);
            this.player1.reset(this.isPlayGame);
            this.player2.reset(this.isPlayGame);
            this.player3.reset(this.isPlayGame);
            if (this.maxCapacity == 2) {
                this.player1.hideNode(true);
                this.player3.hideNode(true);
            } else {
                this.player1.hideNode(false);
                this.player3.hideNode(false);
            }
        }
        this.listPlayerNode = [];
        this.listPlayer.push(message.player);
        this.currentCapacity = this.listPlayer.length;
        switch (this.gameState) {
            case PhomConstant.GAME_STATE.WAIT: {
                switch (this.currentCapacity) {
                    case 1: {
                        this.player2.showProfile(true);
                        this.player2.createPlayer(this.listPlayer[0]);
                        this.listPlayerNode.push(this.player2);
                        break
                    }
                    case 2: {
                        this.player1.showProfile(true);
                        this.player2.showProfile(true);
                        this.player1.createPlayer(this.listPlayer[0]);
                        this.player2.createPlayer(this.listPlayer[1]);
                        this.listPlayerNode.push(this.player1);
                        this.listPlayerNode.push(this.player2);
                        break
                    }
                    case 3: {
                        this.player1.showProfile(true);
                        this.player2.showProfile(true);
                        this.player3.showProfile(true);
                        this.player1.createPlayer(message.listPlayer[0]);
                        this.player2.createPlayer(message.listPlayer[1]);
                        this.player3.createPlayer(message.listPlayer[2]);
                        this.listPlayerNode.push(this.player1);
                        this.listPlayerNode.push(this.player2);
                        this.listPlayerNode.push(this.player3);
                        break
                    }
                    case 4: {
                        this.player1.showProfile(true);
                        this.player2.showProfile(true);
                        this.player3.showProfile(true);
                        this.player0.showProfile(true);
                        this.player1.createPlayer(message.listPlayer[0]);
                        this.player2.createPlayer(message.listPlayer[1]);
                        this.player3.createPlayer(message.listPlayer[2]);
                        this.player0.createPlayer(message.listPlayer[3]);
                        this.listPlayerNode.push(this.player1);
                        this.listPlayerNode.push(this.player2);
                        this.listPlayerNode.push(this.player3);
                        this.listPlayerNode.push(this.player0);
                        //this.readyGameBtn.active = false;
                        break
                    }
                }
                break;
            }
            case PhomConstant.GAME_STATE.PLAYING: {
                switch (this.currentCapacity) {
                    case 2: {
                        this.player1.showProfile(true);
                        this.player2.showProfile(true);
                        this.player1.createPlayer(message.listPlayer[0]);
                        this.player2.createPlayer(message.listPlayer[1]);
                        this.listPlayerNode.push(this.player1);
                        this.listPlayerNode.push(this.player2);
                        break
                    }
                    case 3: {
                        this.player1.showProfile(true);
                        this.player2.showProfile(true);
                        this.player3.showProfile(true);
                        this.player1.createPlayer(message.listPlayer[0]);
                        this.player2.createPlayer(message.listPlayer[1]);
                        this.player3.createPlayer(message.listPlayer[2]);
                        this.listPlayerNode.push(this.player1);
                        this.listPlayerNode.push(this.player2);
                        this.listPlayerNode.push(this.player3);
                        break
                    }
                    case 4: {
                        this.player1.showProfile(true);
                        this.player2.showProfile(true);
                        this.player3.showProfile(true);
                        this.player0.showProfile(true);
                        this.player1.createPlayer(message.listPlayer[0]);
                        this.player2.createPlayer(message.listPlayer[1]);
                        this.player3.createPlayer(message.listPlayer[2]);
                        this.player0.createPlayer(message.listPlayer[3]);
                        this.listPlayerNode.push(this.player1);
                        this.listPlayerNode.push(this.player2);
                        this.listPlayerNode.push(this.player3);
                        this.listPlayerNode.push(this.player0);
                        //this.readyGameBtn.active = false;
                        break
                    }
                }
                for (var i = 0; i < this.listPlayerNode.length; i++) {
                    if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2) {
                        this.listPlayerNode[i].showCardOnHand(true);
                    } else {
                        this.listPlayerNode[i].showCardOnHand(false);
                    }
                }
                break;
            }
        }
    },
    onPlayerJoinedResponse(message) {
        if (message.status == 1) {
            NewAudioManager.playAudioSource("joinboard");
            if (this.myIndex < 0) {
                this.onPlayerJoinedResponse2(message);
                // đanh đứng
                return;
            }
            switch (this.gameState) {
                case PhomConstant.GAME_STATE.WAIT: {
                    this.isShowTime(true);
                    if (this.maxCapacity) {
                        this.player0.reset(this.isPlayGame);
                        this.player1.reset(this.isPlayGame);
                        this.player2.reset(this.isPlayGame);
                        this.player3.reset(this.isPlayGame);
                        if (this.maxCapacity == 2) {
                            this.player1.hideNode(true);
                            this.player3.hideNode(true);
                        } else {
                            this.player1.hideNode(false);
                            this.player3.hideNode(false);
                        }
                    }
                    this.listPlayerNode = [];
                    this.listPlayer.push(message.player);
                    this.currentCapacity = this.listPlayer.length;
                    switch (this.myIndex) {
                        case 0: {
                            switch (this.currentCapacity) {
                                case 2: {

                                    this.player0.createPlayer(this.listPlayer[0]);
                                    this.player2.createPlayer(this.listPlayer[1]);
                                    this.player0.showProfile(true);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player0, this.player2];

                                    break;
                                }
                                case 3: {

                                    this.player0.createPlayer(this.listPlayer[0]);
                                    this.player1.createPlayer(this.listPlayer[1]);
                                    this.player2.createPlayer(this.listPlayer[2]);
                                    this.player0.showProfile(true);
                                    this.player1.showProfile(true);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player0, this.player1, this.player2];
                                    break;
                                }
                                case 4: {

                                    this.player0.createPlayer(this.listPlayer[0]);
                                    this.player1.createPlayer(this.listPlayer[1]);
                                    this.player2.createPlayer(this.listPlayer[2]);
                                    this.player3.createPlayer(this.listPlayer[3]);
                                    this.player0.showProfile(true);
                                    this.player1.showProfile(true);
                                    this.player2.showProfile(true);
                                    this.player3.showProfile(true);
                                    this.listPlayerNode = [this.player0, this.player1, this.player2, this.player3];

                                    break;
                                }

                            }

                            break;
                        }
                        case 1: {
                            switch (this.currentCapacity) {
                                case 3: {

                                    this.player0.createPlayer(this.listPlayer[1]);
                                    this.player1.createPlayer(this.listPlayer[2]);
                                    this.player2.createPlayer(this.listPlayer[0]);
                                    this.player0.showProfile(true);
                                    this.player1.showProfile(true);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player2, this.player0, this.player1];

                                    break;
                                }
                                case 4: {

                                    this.player0.createPlayer(this.listPlayer[1]);
                                    this.player1.createPlayer(this.listPlayer[2]);
                                    this.player2.createPlayer(this.listPlayer[3]);
                                    this.player3.createPlayer(this.listPlayer[0]);
                                    this.player0.showProfile(true);
                                    this.player1.showProfile(true);
                                    this.player2.showProfile(true);
                                    this.player3.showProfile(true);
                                    this.listPlayerNode = [this.player3, this.player0, this.player1, this.player2];

                                    break;
                                }
                            }
                            break;
                        }
                        case 2: {
                            switch (this.currentCapacity) {
                                case 4: {

                                    this.player0.createPlayer(this.listPlayer[2]);
                                    this.player1.createPlayer(this.listPlayer[3]);
                                    this.player2.createPlayer(this.listPlayer[0]);
                                    this.player3.createPlayer(this.listPlayer[1]);
                                    this.player0.showProfile(true);
                                    this.player1.showProfile(true);
                                    this.player2.showProfile(true);
                                    this.player3.showProfile(true);
                                    this.listPlayerNode = [this.player2, this.player3, this.player0, this.player1];

                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
                case PhomConstant.GAME_STATE.PLAYING: {
                    this.isShowTime(false);
                    this.listPlayer.push(message.player);
                    this.currentCapacity = this.listPlayer.length;
                    switch (this.myIndex) {
                        case 0: {
                            switch (this.currentCapacity) {
                                case 3: {
                                    this.player1.createPlayer(this.listPlayer[2]);
                                    this.player1.showProfile(true, true);
                                    this.listPlayerNode.push(this.player1);

                                    break;
                                }
                                case 4: {
                                    //check player 3 co nguoi ngoi chua
                                    var check = false;
                                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                                        if (this.listPlayerNode[i].node.name == "player3") {
                                            check = true;
                                        }
                                    }
                                    if (!check) {
                                        this.player3.createPlayer(this.listPlayer[3]);
                                        this.player3.showProfile(true, true);
                                        this.listPlayerNode.push(this.player3);
                                    } else {
                                        this.player1.createPlayer(this.listPlayer[3]);
                                        this.player1.showProfile(true, true);
                                        this.listPlayerNode.push(this.player1);
                                    }

                                    break;
                                }

                            }

                            break;
                        }
                        case 1: {
                            switch (this.currentCapacity) {
                                case 3: {

                                    this.player1.createPlayer(this.listPlayer[2]);
                                    this.player1.showProfile(true, true);
                                    this.listPlayerNode.push(this.player1);

                                    break;
                                }
                                case 4: {
                                    //check player 3 co nguoi ngoi chua
                                    var check = false;
                                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                                        if (this.listPlayerNode[i].node.name == "player3") {
                                            check = true;
                                        }
                                    }

                                    if (!check) {
                                        this.player3.createPlayer(this.listPlayer[3]);
                                        this.player3.showProfile(true, true);
                                        this.listPlayerNode.push(this.player3);
                                    } else {
                                        this.player1.createPlayer(this.listPlayer[3]);
                                        this.player1.showProfile(true, true);
                                        this.listPlayerNode.push(this.player1);
                                    }

                                    break;
                                }
                            }
                            break;
                        }
                        case 2: {
                            switch (this.currentCapacity) {
                                case 4: {

                                    this.player3.createPlayer(this.listPlayer[3]);
                                    this.player3.showProfile(true, true);
                                    this.listPlayerNode.push(this.player3);
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
    },
    onTableSettingChangeResponse(message) {
        if (message.status == 1) {
            Linker.showMessage("Đã thay đổi cấu hình bàn chơi, số người chơi " + message.maxCapacity + " người");
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.setRoomInfo();
            if (this.maxCapacity == 2) {
                this.player1.hideNode(true);
                this.player3.hideNode(true);
            } else {
                this.player1.hideNode(false);
                this.player3.hideNode(false);
            }
            if (!this.isPlayGame && this.listPlayer.length == this.maxCapacity) {
                this.leaveTableRequest();
            }
        } else {
            Linker.showMessage(message.error);
        }
    },
    onKickPlayerResponse(message) {
        if (message.status == 1) {
            if (this.myUserId == message.userId) {
                SceneManager.loadScene('LobbyScene', function () { });

                // SceneManager.loadScene('LobbyScene',function(){
                //     var scene = cc.director.getScene();
                //     var canvas = scene.getChildByName("Canvas");
                //     canvas.opacity = 0;
                //     cc.tween(canvas)
                //     .to(0.5, { opacity: 255})
                //     .start()
                // });
                Linker.message = "Bạn bị mời ra ngoài";
            } else {
                var index = this.findCurrentPlayer(message.userId);
                if (this.listPlayerNode[index]) {
                    this.listPlayerNode[index].reset(this.isPlayGame);
                    this.listPlayer.splice(index, 1);
                    this.listPlayerNode.splice(index, 1);
                }
                Linker.showMessage(message.userName + " bị mời ra ngoài");
            }
            var dialog = cc.find('Canvas/PopupUserInfo');
            if (dialog) {
                dialog.active = false;
            }
        } else {

        }
    },
    onGameEndResponse(message) {
        if (message.status == 1) {
            this.xepLaiBtn.active = false;
            this.setTxtChi("Kết quả");
            var effect = cc.callFunc(this.endGameEffect, this, message);
            var logic = cc.callFunc(this.endGameLogic, this, message);
            var action = cc.sequence(effect, cc.delayTime(5), logic);
            this.node.runAction(action);
        }
    },
    setTxtChi(str) {
        this.txtChi.node.active = true;
        this.txtChi.string = str;
    },
    endGameEffect(target, message) {
        this.dongHo.active = false;
        var MauBinhXepBai = this.node.getChildByName("MauBinhXepBai");
        if (MauBinhXepBai) {
            MauBinhXepBai.destroy();
        }
        var count = 0;
        message.listPlayer.forEach(player => {
            if (Number(player.money) == 0) {
                count++;
            }
            var index = this.findCurrentPlayerNode(player.userId);
            var that = this;
            if (this.listPlayerNode[index]) {
                this.listPlayerNode[index].updateCard(player.cardOwnerList, () => {
                    that.listPlayerNode[index].cardOnHandList.active = true;
                    that.listPlayerNode[index].cardOnHandList.children.forEach(item => {
                        item.active = true;
                        //item.scaleX = 0;
                    });
                    //that.listPlayerNode[index].runActionShow(0,that.listPlayerNode[index].cardOnHandList.children);
                });
                this.listPlayerNode[index].isXepBai(false);
                this.listPlayerNode[index].isXepXong(false);
                if (player.caseType != 0) {
                    this.listPlayerNode[index].showAnTrang(player.caseType);
                }
                this.listPlayerNode[index].setMoney(player.money, player.anChi, () => {
                    var indexOut = that.findCurrentPlayer(player.userId);
                    if (that.listPlayer[indexOut]) {
                        if (player.isOut == 1) {
                            that.listPlayer.splice(indexOut, 1);
                        } else {
                            that.listPlayer[indexOut].userMoney = player.resultMoney;
                        }
                    }

                });
            }
            if (player.userId == this.myUserId) {
                if (player.caseType < 0) {
                    NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.BINH_LUNG, 1, false, false);
                } else if (Number(player.anChi) > 0) {
                    NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.CHESS_WIN, 1, false, false);
                } else if (Number(player.anChi) < 0) {
                    NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.CHESS_LOSE, 1, false, false);
                }
                Linker.userData.userMoney = player.resultMoney;
                if (player.isOut == 1) {
                    this.isLeaveTable = true;
                }
            }
        });
        if (count == message.listPlayer.length) {
            this.hoaShow(count);
        }
        this.setEffectLevelUp(message);
    },
    setEffectLevelUp(message) {
        var players = message.listPlayer;
        for (var i = 0; i < players.length; i++) {
            if (Number(players[i].level) > Number(Linker.userData.userLevel) && Linker.userData.userId == players[i].userId) {
                Linker.userData.userLevel = players[i].level;
                var money = players[i].levelUpMoney;
                if (Linker.levelUpPrefab && Linker.levelUpPrefab.isValid) {
                    var node = cc.instantiate(Linker.levelUpPrefab);
                    node.getComponent("LevelUp").setInfor(money);    
                    this.node.addChild(node);
                } else {
                    cc.resources.load("levelup/LevelUp", cc.Prefab, function (completedCount, totalCount, item) {
                    }, function (err, prefab) {
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
    hoaShow(count) {
        var hoa = this.node.getChildByName("hoa");
        var hoacalang = this.node.getChildByName("hoacalang");
        if (count == 0 && hoa && hoacalang) {
            hoa.active = false;
            hoacalang.active = false;
        } else if (count == 2 && hoa) {
            hoa.active = true;
        } else {
            if (hoacalang) {
                hoacalang.active = true;
            }
        }
    },
    requestJoinZone: function () {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_KHOI_TAO_LAI_LOBBY, true);
        customEvent.isLeaveTable = true;
        this.node.dispatchEvent(customEvent);
    },
    onLeaveRequest: function (event) {
        if (Linker && Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId) {
            var tableId = Number(Linker.CURRENT_TABLE.tableId);
            if (isNaN(tableId) == false && tableId != 0) {
                Linker.Socket.send(CommonSend.leaveTableRequest(tableId));
            }
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
        this.onLeaveRequest();
        this.node.destroy();
        this.node.removeFromParent(true);
        Linker.CURRENT_TABLE = null;
        NewAudioManager.stopSoundBackground();
        // NewAudioManager.playBackground(NewAudioManager.getPathMusicByZone().background, 0.4, true, true);
    },

    endGameLogic(target, message) {
        if (this.isLeaveTable) {
            cc.Global.showLoading();
            this.leaveRoom();
        } else {
            this.resetTable();
            if (message.newOwner != 0) {
                this.listPlayer.forEach(item => {
                    if (item.userId == message.newOwner) {
                        item.isMaster = 1;
                        item.state = 1;
                    } else {
                        item.isMaster = 0;
                        item.state = 0;
                    }
                });
                if (this.myUserId == message.newOwner) {
                    this.isMaster = true;
                }
            }
            this.myIndex = this.findCurrentPlayer(this.myUserId);
            this.currentCapacity = this.listPlayer.length;
            if (this.isMaster) {
                if (this.listPlayer[this.myIndex]) {
                    this.listPlayer[this.myIndex].state = 1;
                }
            }
            if (this.maxCapacity) {
                this.player0.reset(this.isPlayGame);
                this.player1.reset(this.isPlayGame);
                this.player2.reset(this.isPlayGame);
                this.player3.reset(this.isPlayGame);
                if (this.maxCapacity == 2) {
                    this.player1.hideNode(true);
                    this.player3.hideNode(true);
                } else {
                    this.player1.hideNode(false);
                    this.player3.hideNode(false);
                }
            }
            if (this.myIndex < 0) {
                // vẫn đang đứng
                switch (this.currentCapacity) {
                    case 1: {
                        this.player2.showProfile(true);
                        this.player2.createPlayer(this.listPlayer[0]);
                        this.listPlayerNode = [this.player2];
                        break
                    }
                    case 2: {
                        this.player1.showProfile(true);
                        this.player2.showProfile(true);
                        this.player1.createPlayer(this.listPlayer[0]);
                        this.player2.createPlayer(this.listPlayer[1]);
                        this.listPlayerNode = [this.player1, this.player2];
                        break
                    }
                    case 3: {
                        this.player1.showProfile(true);
                        this.player2.showProfile(true);
                        this.player3.showProfile(true);
                        this.player1.createPlayer(this.listPlayer[0]);
                        this.player2.createPlayer(this.listPlayer[1]);
                        this.player3.createPlayer(this.listPlayer[2]);
                        this.listPlayerNode = [this.player1, this.player2, this.player3];
                        break
                    }
                    case 4: {
                        this.player1.showProfile(true);
                        this.player2.showProfile(true);
                        this.player3.showProfile(true);
                        this.player0.showProfile(true);
                        this.player1.createPlayer(this.listPlayer[0]);
                        this.player2.createPlayer(this.listPlayer[1]);
                        this.player3.createPlayer(this.listPlayer[2]);
                        this.player0.createPlayer(this.listPlayer[3]);
                        //this.readyGameBtn.active = false;
                        this.listPlayerNode = [this.player1, this.player2, this.player3, this.player0];
                        break
                    }
                }
            } else {
                // đang tham gia chơi
                switch (this.myIndex) {
                    case 0: {
                        switch (this.currentCapacity) {
                            case 1: {
                                this.player0.createPlayer(this.listPlayer[0]);
                                this.player0.showProfile(true);
                                this.listPlayerNode = [this.player0];
                                break;
                            }
                            case 2: {
                                this.player0.createPlayer(this.listPlayer[0]);
                                this.player2.createPlayer(this.listPlayer[1]);
                                this.player0.showProfile(true);
                                this.player2.showProfile(true);
                                this.listPlayerNode = [this.player0, this.player2];
                                break;
                            }
                            case 3: {
                                this.player0.createPlayer(this.listPlayer[0]);
                                this.player1.createPlayer(this.listPlayer[1]);
                                this.player2.createPlayer(this.listPlayer[2]);
                                this.player0.showProfile(true);
                                this.player1.showProfile(true);
                                this.player2.showProfile(true);
                                this.listPlayerNode = [this.player0, this.player1, this.player2];
                                break;
                            }
                            case 4: {
                                this.player0.createPlayer(this.listPlayer[0]);
                                this.player1.createPlayer(this.listPlayer[1]);
                                this.player2.createPlayer(this.listPlayer[2]);
                                this.player3.createPlayer(this.listPlayer[3]);
                                this.player0.showProfile(true);
                                this.player1.showProfile(true);
                                this.player2.showProfile(true);
                                this.player3.showProfile(true);
                                this.listPlayerNode = [this.player0, this.player1, this.player2, this.player3];
                                break;
                            }
                        }
                        break;
                    }
                    case 1: {
                        switch (this.currentCapacity) {
                            case 2: {
                                this.player0.createPlayer(this.listPlayer[1]);
                                this.player2.createPlayer(this.listPlayer[0]);
                                this.player0.showProfile(true);
                                this.player2.showProfile(true);
                                this.listPlayerNode = [this.player2, this.player0];
                                break;
                            }
                            case 3: {
                                this.player0.createPlayer(this.listPlayer[1]);
                                this.player1.createPlayer(this.listPlayer[2]);
                                this.player2.createPlayer(this.listPlayer[0]);
                                this.player0.showProfile(true);
                                this.player1.showProfile(true);
                                this.player2.showProfile(true);
                                this.listPlayerNode = [this.player2, this.player0, this.player1];
                                break;
                            }
                            case 4: {
                                this.player0.createPlayer(this.listPlayer[1]);
                                this.player1.createPlayer(this.listPlayer[2]);
                                this.player2.createPlayer(this.listPlayer[0]);
                                this.player3.createPlayer(this.listPlayer[3]);
                                this.player0.showProfile(true);
                                this.player1.showProfile(true);
                                this.player2.showProfile(true);
                                this.player3.showProfile(true);
                                this.listPlayerNode = [this.player2, this.player0, this.player1, this.player3];
                                break;
                            }
                        }
                        break;
                    }
                    case 2: {
                        switch (this.currentCapacity) {
                            case 3: {
                                this.player0.createPlayer(this.listPlayer[2]);
                                this.player1.createPlayer(this.listPlayer[0]);
                                this.player2.createPlayer(this.listPlayer[1]);
                                this.player0.showProfile(true);
                                this.player1.showProfile(true);
                                this.player2.showProfile(true);
                                this.listPlayerNode = [this.player1, this.player2, this.player0];
                                break;
                            }
                            case 4: {
                                this.player0.createPlayer(this.listPlayer[2]);
                                this.player1.createPlayer(this.listPlayer[0]);
                                this.player2.createPlayer(this.listPlayer[1]);
                                this.player3.createPlayer(this.listPlayer[3]);
                                this.player0.showProfile(true);
                                this.player1.showProfile(true);
                                this.player2.showProfile(true);
                                this.player3.showProfile(true);
                                this.listPlayerNode = [this.player1, this.player2, this.player0, this.player3];
                                break;
                            }
                        }
                        break;
                    }
                    case 3: {
                        switch (this.currentCapacity) {
                            case 4: {
                                this.player0.createPlayer(this.listPlayer[3]);
                                this.player1.createPlayer(this.listPlayer[0]);
                                this.player2.createPlayer(this.listPlayer[1]);
                                this.player3.createPlayer(this.listPlayer[2]);
                                this.player0.showProfile(true);
                                this.player1.showProfile(true);
                                this.player2.showProfile(true);
                                this.player3.showProfile(true);
                                this.listPlayerNode = [this.player1, this.player2, this.player3, this.player0];
                                break;
                            }
                        }
                        break;
                    }
                }

            }
            if (this.currentCapacity < 2) {
                this.isShowTime(false);
            } else {
                this.isShowTime(true);
            }
            if (message.listPlayer.length > 0) {
                message.listPlayer.forEach((element) => {
                    var index = this.findCurrentPlayer(element.userId);
                    var player = this.listPlayer[index];
                    if (player) {
                        if (element.notEnoughMoney) {
                            if (Number(element.notEnoughMoney) == 1) {
                                if (Number(element.userId) == Number(Linker.userData.userId)) {
                                    // Check nguoi choi do la chinh minh thi roi khoi ban.
                                    Linker.message = "Bạn bị thoát ra do không đủ tiền chơi.";
                                    cc.Global.showLoading();
                                    cc.Global.showMessage(Linker.message);
                                    this.leaveRoom();
                                } else {
                                    var leavePlayerId = Number(element.userId);
                                    var leveaPlayerIndex = this.findCurrentPlayer(leavePlayerId);
                                    if (leveaPlayerIndex < 0) {
                                        return;
                                    }
                                    this.listPlayer.splice(leveaPlayerIndex, 1);
                                    this.currentCapacity = this.listPlayer.length;
                                    this.myIndex = this.findCurrentPlayer(this.myUserId);
                                    var playerNode = this.listPlayerNode.splice(leveaPlayerIndex, 1)[0];
                                    if (playerNode) {
                                        playerNode.reset(this.isPlayGame);
                                    }
                                }
                            }
                        }
                    }
                });
            }
            //xu ly khi co nguoi no hu
            if (message.idUserAnHu && message.moneyAnHu > 0) {
                var indexUserNoHu = this.findCurrentPlayer(message.idUserAnHu);
                if (indexUserNoHu >= 0) {
                    var player = this.listPlayer[indexUserNoHu];
                    // Linker.showMessage("Chúc mừng người chơi "+player.viewName+" Nổ Nũ với số tiền "+Utils.Number.format(message.moneyAnHu));
                    var nohuEffect = cc.find("Canvas/NoHuGameBaiEffectLayer");
                    if (!nohuEffect) {
                        nohuEffect = cc.instantiate(this.nohuGameBaiEffectLayerPrefab);
                        nohuEffect.position = cc.v2(0, 0);
                        nohuEffect.zIndex = cc.macro.MAX_ZINDEX - 1;
                        cc.find("Canvas").addChild(nohuEffect);
                    }
                    nohuEffect.active = false;
                    var nohueffects = nohuEffect.getComponent("NoHuGameBaiEffectLayer");
                    nohueffects.setUserName(player.viewName);
                    nohueffects.setMoneyBonus(message.moneyAnHu);
                    nohueffects.runAnimation();
                }
            }
            //end xu ly khi co nguoi no hu
        }

    },
    stopAllGameEffect: function () {
        //stop no hu game bai effect
        var nohuEffect = cc.find("Canvas/NoHuGameBaiEffectLayer");
        if (nohuEffect) {
            var nohueffects = nohuEffect.getComponent("NoHuGameBaiEffectLayer");
            nohueffects.hideAnimLayer();
        }
    },
    init: function (data) {
        if (data) {
            this.data = data;
        } else {
            this.data = null;
        }
    },
    start() {
        var data = this.data;
        if (data) {
            Linker.MauBinhController = this;
            // NodePoolManager.MiniGame.getNodePool();
            // var topHu = cc.find('Canvas/TopHu');
            // if (topHu) {
            //     topHu.active = false;
            //     var tophuContainer = topHu.getChildByName('TopHuContainer');
            //     tophuContainer.getChildByName('Container').active = false;
            // }
            this.addSocketEvent();
            if (Linker.joinInviteData) {
                cc.error("Request invite game...", data);
                var data = LobbySend.joinTableRequest(Number(Linker.joinInviteData.matchID));
                Linker.Socket.send(data);
            } else {
                if (data.tableData) {
                    if (data.isReconnect) {
                        this.isReconnect = true;
                        cc.error("Request reconnect game...", data);
                        this.requestJoinGame(data.tableData);
                        //thuc hien send reconnect signal
                    } else if (data.isCreate) {
                        cc.error("Request create game...", data);
                        //tao ban binh thuong bao gom ca create va join
                        this.requestCreateGame(data.tableData);
                    } else if (data.isJoin) {
                        cc.error("Request join game...", data);
                        this.requestJoinGame(data.tableData);
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

    update(dt) {
        if (this.countTime > 0) {
            if (Math.floor(this.countTime) != Math.floor(this.countTime - dt)) {
                this.timeCountLabel.getComponent(cc.Label).string = Math.floor(this.countTime) + "";
                NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.GAN_HET_THOI_GIAN, 1, false, false);
            }
            this.countTime -= dt;
            if (this.countTime < 0) {
                this.isShowTime(false);
            }
        }
        if (this.timer > 0) {
            if (Math.floor(this.timer) != Math.floor(this.timer - dt)) {
                this.dongHo.getChildByName("timecount").getComponent(cc.Label).string = Math.floor(this.timer) + "";
            }
            this.timer -= dt;
        }
    },
    onDestroy() {
        NewAudioManager.playAudioSource("leaveboard");
        this.removeSocketEvent();
    },
    onEnable: function () {
        this.schedule(this.setWifiStatus);
    },
    onDisable() {
        this.unschedule(this.setWifiStatus);
    },
    showMauBinhGame: function (message) {
        Linker._sceneTag = Constant.TAG.scenes.GAME
        this.node.opacity = 255;
        this.unBlockAllEvent();
        this.lockTableEvent(true);

        NewAudioManager.SOUND_GAME.MAUBINH.playAudioClip(NewAudioManager.SOUND_GAME.MAUBINH.COMMON.CHAO_CA_NHA, 1, false, false);
        NewAudioManager.playAudioSource("joinboard");
        var that = this;
        cc.find('Canvas').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            Linker.lastTimeManipulation = new Date().getTime();
        }, that.node);
    },
    resetReconnectRoom: function () {
        Linker.userData.lastRoom = null;
        Linker.redirectOnReconnect = null;
    },
    setGameState: function (message) {
        this.gameState = Number(this.gameState);
        switch (this.gameState) {
            case PhomConstant.GAME_STATE.WAIT: {
                //người chơi đang ở trạng thái chờ
                if (Linker.CURRENT_TABLE) {
                    Linker.CURRENT_TABLE.tableId = message.tableId;
                } else {
                    Linker.CURRENT_TABLE = {
                        tableId: message.tableId
                    };
                }
                break;
            }
            case PhomConstant.GAME_STATE.PLAYING: {
                // người chơi đang ở trạng thái chơi
                if (Linker.CURRENT_TABLE) {
                    Linker.CURRENT_TABLE.tableId = message.tableId;
                } else {
                    Linker.CURRENT_TABLE = {
                        tableId: message.tableId
                    };
                }
                break;
            }
        }
    },
    onCreateTableResponse(message) {
        cc.log("MauBinh_onCreateTableRespone: ", message);
        cc.Global.hideLoading();
        if (message.status == 1) {
            this.gameState = Number(message.isPlaying);
            this.showMauBinhGame(message);
            this.setGameState(message);
            this.isReconnect = false;
            this.resetReconnectRoom();
            this.resetTable();
            this.tableIndex = message.tableIndex;
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.tableId = message.tableId;
            Linker.CURRENT_TABLE.tableId = message.tableId;
            this.setRoomInfo();
            if (this.maxCapacity) {
                this.player0.reset(this.isPlayGame);
                this.player1.reset(this.isPlayGame);
                this.player2.reset(this.isPlayGame);
                this.player3.reset(this.isPlayGame);
                this.player0.showProfile(true);
            }
            this.currentCapacity = 1;
            this.gameState = Number(message.isPlaying);
            this.player0.createPlayer(message.player);
            this.myIndex = 0;
            this.listPlayer.push(message.player);
            this.listPlayerNode.push(this.player0);
            this.isMaster = true;
            //this.readyGameBtn.active = false;
        } else {
            if (message.error) {
                cc.Global.showMessage(message.error);
                this.lockTableEvent(false);
                this.clearGame();
            }
        }
    },
    onTrungCode() {
    },
    setRoomInfo() {
        this.textMinBet.string = "Cược: " + Utils.Malicious.moneyWithFormat(this.minMoney, ".");
        this.textTableIndex.string = "Bàn: " + this.tableIndex;
        this.textMatchId.string = "Trận: " + this.tableId;
    },
    findCurrentPlayerNode(playerID) {
        for (var i = 0; i < this.listPlayerNode.length; i++) {
            if (this.listPlayerNode[i].player.userId == playerID) {
                // this.currentPlayer = this.listPlayer[i];
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
    onChat(data) {
        if (data.error) {
            return;
        }
        if (data.userId == Linker.userData.userId) {
            this.player0.onChat(data);
        } else {
            var player = this.findPlayerByViewName(data.username);
            switch (player) {
                case "1": this.player1.onChat(data, true);
                    break;
                case "2": this.player2.onChat(data, true);
                    break;
                case "3": this.player3.onChat(data, true);
                    break;
                default: break;
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
        if (this.player0) {
            if (this.player0.getViewName() == username) {
                return "0";
            }
        }

    },
    backBtn() {
        this.leaveTableRequest();
    },
    leaveTableRequest() {
        Linker.Socket.send(CommonSend.leaveTableRequest(this.tableId));
    },
    onLeaveTableRespone(message) {
        if (message.status == 1) {
            if (this.myUserId == message.userId) {
                if (message.cancelStatus == 1) {
                    Linker.showMessage("Bạn vừa đăng ký rời phòng khi hết ván");
                    this.isLeaveTable = true;
                } else if (message.cancelStatus == 2) {
                    this.isLeaveTable = false;
                    Linker.showMessage("Bạn vừa hủy rời phòng khi hết ván");
                } else if (message.cancelStatus == 0) {
                    cc.Global.showLoading();
                    this.leaveRoom();
                }
            }
            else {
                if (message.cancelStatus == 0) {
                    NewAudioManager.playAudioSource("leaveboard");
                    var leavePlayerId = message.userId;
                    var leveaPlayerIndex = this.findCurrentPlayer(leavePlayerId);
                    if (leveaPlayerIndex < 0) {
                        return;
                    }
                    if (this.gameState == PhomConstant.GAME_STATE.WAIT) {
                        if (this.maxCapacity) {
                            this.player0.reset(this.isPlayGame);
                            this.player1.reset(this.isPlayGame);
                            this.player2.reset(this.isPlayGame);
                            this.player3.reset(this.isPlayGame);
                            if (this.maxCapacity == 2) {
                                this.player1.hideNode(true);
                                this.player3.hideNode(true);
                            } else {
                                this.player1.hideNode(false);
                                this.player3.hideNode(false);
                            }
                        }
                        this.listPlayerNode = [];
                        this.listPlayer.splice(leveaPlayerIndex, 1)[0];
                        this.currentCapacity = this.listPlayer.length;
                        this.myIndex = this.findCurrentPlayer(this.myUserId);
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
                        switch (this.myIndex) {
                            case 0: {
                                switch (this.currentCapacity) {
                                    case 1: {
                                        this.player0.createPlayer(this.listPlayer[0]);
                                        this.player0.showProfile(true);
                                        this.listPlayerNode = [this.player0];
                                        break;
                                    }
                                    case 2: {
                                        this.player0.createPlayer(this.listPlayer[0]);
                                        this.player2.createPlayer(this.listPlayer[1]);
                                        this.player0.showProfile(true);
                                        this.player2.showProfile(true);
                                        this.listPlayerNode = [this.player0, this.player2];
                                        break;
                                    }
                                    case 3: {
                                        this.player0.createPlayer(this.listPlayer[0]);
                                        this.player1.createPlayer(this.listPlayer[1]);
                                        this.player2.createPlayer(this.listPlayer[2]);
                                        this.player0.showProfile(true);
                                        this.player1.showProfile(true);
                                        this.player2.showProfile(true);
                                        this.listPlayerNode = [this.player0, this.player1, this.player2];
                                        break;
                                    }
                                }
                                break;
                            }
                            case 1: {
                                switch (this.currentCapacity) {
                                    case 2: {
                                        this.player0.createPlayer(this.listPlayer[1]);
                                        this.player2.createPlayer(this.listPlayer[0]);
                                        this.player0.showProfile(true);
                                        this.player2.showProfile(true);
                                        this.listPlayerNode = [this.player2, this.player0];

                                        break;
                                    }
                                    case 3: {
                                        this.player0.createPlayer(this.listPlayer[1]);
                                        this.player1.createPlayer(this.listPlayer[2]);
                                        this.player2.createPlayer(this.listPlayer[0]);
                                        this.player0.showProfile(true);
                                        this.player1.showProfile(true);
                                        this.player2.showProfile(true);
                                        this.listPlayerNode = [this.player2, this.player0, this.player1];
                                        break;
                                    }
                                }
                                break;
                            }
                            case 2: {
                                switch (this.currentCapacity) {
                                    case 3: {
                                        this.player0.createPlayer(this.listPlayer[2]);
                                        this.player1.createPlayer(this.listPlayer[0]);
                                        this.player2.createPlayer(this.listPlayer[1]);
                                        this.player0.showProfile(true);
                                        this.player1.showProfile(true);
                                        this.player2.showProfile(true);
                                        this.listPlayerNode = [this.player1, this.player2, this.player0];
                                        break;
                                    }
                                }
                            }
                        }
                        if (this.currentCapacity < 2) {
                            this.isShowTime(false);
                        } else {
                            this.isShowTime(true);
                        }
                    } else {
                        var leavePlayerId = message.userId;
                        var leveaPlayerIndex = this.findCurrentPlayer(leavePlayerId);
                        if (leveaPlayerIndex < 0) {
                            return;
                        }
                        this.listPlayer.splice(leveaPlayerIndex, 1);
                        this.currentCapacity = this.listPlayer.length;
                        this.myIndex = this.findCurrentPlayer(this.myUserId);
                        var playerNode = this.listPlayerNode.splice(leveaPlayerIndex, 1)[0];
                        if (playerNode) {
                            playerNode.reset(this.isPlayGame);
                        }
                    }
                }
            }
        }
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
    onUpdateMoney(response) {
        if (this.listPlayer) {
            if (response.userId == Linker.userData.userId) {
                var index = this.findCurrentPlayer(Linker.userData.userId);
                var playerNode = this.listPlayerNode[index];
                if (playerNode) {
                    playerNode.moneyPlayer.string = Utils.Number.format(response.money);
                }

            }
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