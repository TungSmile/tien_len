var Linker = require('Linker');
var PhomCard = require('PhomCard');
var PhomConstant = require('PhomConstant');
var PhomPlayer = require('PhomPlayer');
var CommonSend = require('CommonSend');
var PhomSend = require('PhomSend');
var LobbySend = require('LobbySend');
var CardUtils = require('CardUtils');
var PhomLogic = require('PhomLogic');
var Utils = require('Utils');
var PhomEffect = require('PhomEffect');
var PhomObj = require('PhomObj');
var Constant = require('Constant');
var XocDiaSend = require('XocDiaSend');
var SceneManager = require('SceneManager');
var NodePoolManager = require('NodePoolManager');
var SocketConstant = require('SocketConstant');
var NewAudioManager = require('NewAudioManager');
var TQUtils = require('TQUtil');
cc.Class({
    extends: cc.Component,
    ctor() {
        this.sortType = 0;
        this.newFirstTurn = false;
        this.preCard = null;
        this.isbocBai = false;
        this.guiCardList = [];
        this.isGuiBai = false;
        this.isReconnect = false;
    },
    properties: {
        player0: PhomPlayer,
        player1: PhomPlayer,
        player2: PhomPlayer,
        player3: PhomPlayer,
        player4: PhomPlayer,
        buttonGame: cc.Node,
        startGameBtn: cc.Node,
        readyGameBtn: cc.Node,
        bocBaiBtn: cc.Node,
        textTableIndex: cc.Label,
        textMatchId: cc.Label,
        textMinBet: cc.Label,
        textCardLeft: cc.Label,
        haBaiBtn: cc.Node,
        anBaiBtn: cc.Node,
        bocBtn: cc.Node,
        danhBtn: cc.Node,
        sortBtn: cc.Node,
        guiUBtn: cc.Node,
        uBtn: cc.Node,
        uDenBtn: cc.Node,
        uKhanBtn: cc.Node,
        uTronBtn: cc.Node,
        guiBaiBtn: cc.Node,
        // Chat feature
        pnChat: cc.Node,
        srcChat: cc.ScrollView,
        edbChat: cc.EditBox,
        ChatDialog: cc.Prefab,
        DialogContent: cc.Prefab,
        nohuGameBaiEffectLayerPrefab: cc.Prefab,
        wififSignalSprite: cc.Sprite,
        wifiSignalImage: [cc.SpriteFrame],
        blockEventNode: cc.Node,
        phomContainer: cc.Node
    },
    blockAllEvent: function () {
        this.blockEventNode.active = true;
    },
    unBlockAllEvent: function () {
        this.blockEventNode.active = false;
    },
    init: function (data) {
        if (data) {
            this.data = data;
        } else {
            this.data = null;
        }
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
            gameName: "PHOM",
            bundleName: Constant.BUNDLE.PHOM.name
        });
    },
    onLoad() {
        this.initAudio();
        this.addCustomEventListener();
        cc.find('Canvas').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            Linker.lastTimeManipulation = new Date().getTime();
        }, this.node);
        if (!this.reconnectDialog || (this.reconnectDialog && !cc.isValid(this.reconnectDialog))) {
            Utils.Malicious.removeNodeByNameFromParent("DialogLosConnect", cc.find('Canvas'));
            this.reconnectDialog = cc.instantiate(this.DialogContent);
            cc.find('Canvas').addChild(this.reconnectDialog);
        }
        if (this.reconnectDialog) {
            this.reconnectDialog.active = false;
        }
    },
    onDestroy() {
        NewAudioManager.playAudioSource("leaveboard");
        this.removeSocketEvent();
    },

    start() {
        var data = this.data;
        if (data) {
            Linker.PhomController = this;
            //cc.Global.hideLoadingDialog();
            // NewAudioManager.playAudioSource("joinboard");
            this.isReconnect = true;
            // NodePoolManager.MiniGame.getNodePool();
            // var topHu = cc.find('Canvas/TopHu');
            // var miniGame = cc.find('Canvas/MiniGame');
            // if (topHu) {
            //     topHu.active = false;
            //     var tophuContainer = topHu.getChildByName('TopHuContainer');
            //     if (tophuContainer && tophuContainer.isValid) {
            //         tophuContainer.getChildByName('Container').active = false;
            //     }
            // }
            // if (miniGame) {
            //     miniGame.active = true;
            // }
            this.pnItemMsg = this.srcChat.content.getChildByName("txt_msg");
            this.srcChat.content.removeAllChildren();
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

    onEnable: function () {
        this.schedule(this.setWifiStatus);
    },
    onDisable() {
        this.unschedule(this.setWifiStatus);
    },

    onTrungCode() {

    },
    settingBtnClick() {
        // this.listPlayerNode[this.myIndex].playMomEffect();
        var settingDialog = this.phomContainer.getChildByName("Setting");
        if (settingDialog) {
            settingDialog.active = true;
        }

    },
    backHandlerBtn: function (event) {
        console.log("backHandlerBtn");
        console.log("event.keyCode:" + event.keyCode);
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.backspace) {
            this.backBtn();
        }
    },
    backBtn() {

        this.leaveTableRequest();
    },
    phomCardTouchEvent(card) {
        if (this.isHaBai == 1 || this.isGuiBai) {
            return;
        }
        if (this.preCard) {
            if (this.preCard.serverValue == card.serverValue) {
                card.node.y = 0;
                this.preCard = null;
                this.myTurnCard = null;
                return;
            }
            this.preCard.node.y = 0;
        }
        var check = PhomLogic.checkDanhBai(this.listPlayerNode[this.myIndex].player.cardOwnerList, this.listPlayerNode[this.myIndex].player.takenCardList, card);
        if (check) {
            card.node.y = 20;
            this.myTurnCard = card.serverValue;
            this.preCard = card;
        } else {
            Linker.showMessage("Lá bài không hợp lệ");
            card.node.y = 0;
            this.myTurnCard = null;
            this.preCard = null;
        }
    },
    btnGuiBaiClick() {
        if (this.currentTurnId == this.myUserId) {
            if (this.guiCardList.length > 0) {
                if (this.isGuiBai) {
                    this.guiCardList.forEach((element) => {
                        var send = PhomSend.guiBaiRequest(this.tableId, element.biGuiPlayer, element.phomId, element.card.serverValue, this.myUserId);
                        Linker.Socket.send(send);
                    })
                    this.danhBtn.active = true;
                } else {
                    Linker.showMessage("Quân bài không đúng");
                }
            } else {
                Linker.showMessage("Vui lòng thử gửi lại bài");
            }
        }
    },
    btnDanhClick() {
        if (this.currentTurnId == this.myUserId) {
            if (this.myTurnCard) {
                var send = PhomSend.turnCardRequest(4, this.tableId, this.myTurnCard);
                Linker.Socket.send(send);
            } else {
                Linker.showMessage("Chưa chọn bài");
            }
        }


    },
    btnAnClick() {
        if (this.currentTurnId == this.myUserId) {
            var send = PhomSend.anBaiRequest(this.tableId);
            Linker.Socket.send(send);
        }

    },
    btnHaPhomClick() {
        if (this.currentTurnId == this.myUserId) {
            if (this.haPhomList) {
                this.myPhomCard = CardUtils.buildPhom(this.haPhomList);
                cc.log("SEND_PHOM", this.myPhomCard);
                if (this.myPhomCard) {
                    this.uType = 0;
                    this.uCard = 0;
                    var send = PhomSend.haPhomRequest(this.tableId, this.myPhomCard, 0, 0);
                    Linker.Socket.send(send);
                } else {
                    Linker.showMessage("Phỏm chưa chính xác");
                }
            } else {
                Linker.showMessage("Phỏm chưa chính xác");
            }

        }


    },
    btnBocClick() {
        if (this.currentTurnId == this.myUserId && this.isHaBai == 0) {
            var send = PhomSend.bocBaiRequest(this.tableId);
            Linker.Socket.send(send);
        }

    },
    guiUBtnClick() {
        cc.log("SEND_PHOM", this.myPhomCard);
        if (this.myPhomCard) {
            var send = PhomSend.haPhomRequest(this.tableId, this.myPhomCard, this.uCard, this.uType);
            Linker.Socket.send(send);
        }
    },
    readyBtnClick() {
        var send = CommonSend.readyGameRequest(this.tableId, 1);
        Linker.Socket.send(send);
    },
    onXepBai() {
        if (!this.isbocBai) {
            this.preCard = null;
            this.listPlayerNode[this.myIndex].player.cardOwnerList = PhomLogic.sort(this.listPlayerNode[this.myIndex].player.cardOwnerList, this.listPlayerNode[this.myIndex].player.takenCardList, this.sortType);
            this.listPlayerNode[this.myIndex].sortMyCard(this.sortType);
            this.listPlayerNode[this.myIndex].printData();
            if (this.isHaBai == 1) {
                this.haPhomList = PhomLogic.findHaPhomCard(this.listPlayerNode[this.myIndex].player.takenCardList, this.listPlayerNode[this.myIndex].player.cardOwnerList, 0);
                if (this.haPhomList.length == 0) {
                    cc.log("MOM_MOM");
                } else {
                    this.listPlayerNode[this.myIndex].haPhom(this.haPhomList);
                }
            }
            //this.checkUFirstTurn();
        }
    },
    sortBtnClick() {
        this.playSound("xepbai");
        this.onXepBai();

        if (this.sortType == 0) {
            this.sortType = 1;
        } else {
            this.sortType = 0;
        }
    },
    startGameBtnClick() {
        // var checkStart = 0;
        // this.listPlayerNode.forEach(item=>{
        //     if(item.player.state == 1){
        //         checkStart += 1;
        //     }
        // });
        // if(checkStart > 1){
        var send = CommonSend.startGameRequest(this.tableId, 1);
        Linker.Socket.send(send);
        //     // Tranh loi TH quan bai ko hop le
        //     this.startGameBtn.active = false;
        //     this.readyGameBtn.active = false;
        // }else{
        //     Linker.showMessage("Người chơi chưa sẵn sàng");
        // }
    },
    moiChoiBtnClick() {
        if (this.gameState == 0) {
            var inviteDialog = this.phomContainer.getChildByName("InviteSendDialog");
            if (inviteDialog) {
                inviteDialog.active = true;
            }
        } else {
            Linker.showMessage("Bạn không thể mời khi đang chơi");
        }

    },
    addCustomEventListener() {
        cc.Canvas.instance.node.on(1300, this.onChat, this);
        this.node.on("time-out", this.OnPlayerTimeOut, this);
    },
    addSocketEvent() {
        Linker.Event.addEventListener(Constant.CMD.CHAT, this.onChat, this);
        Linker.Event.addEventListener(1126, this.onAnBaiResponse, this);
        Linker.Event.addEventListener(1125, this.onBocBaiResponse, this);
        Linker.Event.addEventListener(1128, this.onGuiBaiResponse, this);
        Linker.Event.addEventListener(1127, this.onHaBaiResponse, this);
        Linker.Event.addEventListener(1104, this.onTurnCardRespone, this);
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
        Linker.Event.addEventListener(1246, this.onFastJoinTable, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
        Linker.Event.addEventListener(SocketConstant.COMMON.UPDATE_CRASH, this.onUpdateMoney, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(1246, this.onFastJoinTable, this);
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
        Linker.Event.removeEventListener(1110, this.onPlayerReadyResponse, this);
        Linker.Event.removeEventListener(1108, this.onMatchStartResponse, this);
        Linker.Event.removeEventListener(3, this.onReconnectionResponse, this);
        Linker.Event.removeEventListener(1112, this.onGetPockerResponse, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
        Linker.Event.removeEventListener(SocketConstant.COMMON.UPDATE_CRASH, this.onUpdateMoney, this);

    },
    onAnBaiResponse(message) {
        if (message.status == 1) {
            this.playSound("anbai");
            var anPlayerId = message.anPlayerId;
            var isChot = message.isChot;
            var currentPlayerIndex = this.findCurrentPlayer(anPlayerId);
            var anIndex = this.findEatIndexPlayer(anPlayerId);

            if (anPlayerId == this.myUserId) {
                this.bocBaiBtn.getChildByName('bocCard').active = false; // Bo nut boc khi an

                var anCard = this.listPlayerNode[anIndex].player.turnedCardList.pop();
                if (anCard) {
                    this.listPlayerNode[currentPlayerIndex].player.takenCardList.push(anCard);
                    this.listPlayerNode[currentPlayerIndex].player.cardOwnerList.push(anCard);
                }
                var index = this.nextIndex(anIndex);

                while (index != anIndex) {
                    if (this.listPlayerNode[anIndex].player.turnedCardList.length < this.listPlayerNode[index].player.turnedCardList.length) {
                        break;
                    }
                    index = this.nextIndex(index);
                }
                if (index != anIndex) {
                    var moveCard = this.listPlayerNode[index].player.turnedCardList.pop();
                    this.listPlayerNode[anIndex].player.turnedCardList.push(moveCard);
                    this.listPlayerNode[index].addTurnedCardList();
                }
                // this.listPlayerNode[anIndex].addTurnedCardList(moveCard);
                this.listPlayerNode[anIndex].addTurnedCardList();
                if (this.listPlayerNode[currentPlayerIndex].player.takenCardList.length == 2 && isChot !== 1) {
                    this.playSound("ancay2");
                }
                this.listPlayerNode[currentPlayerIndex].addTakenCardList();
                var self = this;
                var cardOwnerList = this.listPlayer[this.myIndex].cardOwnerList;
                var takenCardList = this.listPlayerNode[currentPlayerIndex].player.takenCardList;
                this.listPlayerNode[currentPlayerIndex].addMyTakenCard(anCard, () => {
                    self.checkUFirstTurn(cardOwnerList, takenCardList);
                });
                this.bocBtn.active = false;
                this.anBaiBtn.active = false;
                this.isCanEat = false;
                this.anCard = null;
                this.anCardIndex = null;
                if (this.preCard) {
                    this.preCard.node.y = 0;
                    this.preCard = null;
                    this.myTurnCard = null;
                }
                if (isChot == 1) {
                    this.listPlayerNode[currentPlayerIndex].setMoney(message.winMoney, true, true);
                    this.playSound("anchot");
                } else {
                    this.listPlayerNode[currentPlayerIndex].setMoney(message.winMoney);
                }
                this.listPlayerNode[anIndex].setMoney(-(Number(message.lostMoney)));


                if (this.listPlayerNode[this.myIndex].player.turnedCardList.length >= 3) {
                    this.isHaBai = 1;
                    this.haBaiBtn.active = true;
                    this.danhBtn.active = false;
                    this.haPhomList = PhomLogic.findHaPhomCard(this.listPlayerNode[this.myIndex].player.takenCardList, this.listPlayerNode[this.myIndex].player.cardOwnerList, 0);
                    this.listPlayerNode[this.myIndex].haPhom(this.haPhomList);
                } else {
                    this.haBaiBtn.active = false;
                    this.danhBtn.active = true;
                }
            } else {
                cc.log("AN_BAI_OTHER", anPlayerId, anIndex, currentPlayerIndex, this.listPlayerNode, this.listPlayer, this.listPlaying,
                    this.listPlayerNode[anIndex]);
                if (anIndex >= 0) {
                    var anCard = this.listPlayerNode[anIndex].player.turnedCardList.pop();
                    if (anCard) {
                        this.listPlayerNode[currentPlayerIndex].player.takenCardList.push(anCard);
                    }
                    var index = this.nextIndex(anIndex);
                    while (index != anIndex) {
                        if (this.listPlayerNode[anIndex].player.turnedCardList.length < this.listPlayerNode[index].player.turnedCardList.length) {
                            break;
                        }
                        index = this.nextIndex(index);
                    }
                    if (index != anIndex) {
                        var moveCard = this.listPlayerNode[index].player.turnedCardList.pop();

                        this.listPlayerNode[anIndex].player.turnedCardList.push(moveCard);
                        this.listPlayerNode[index].addTurnedCardList();
                    }
                    this.listPlayerNode[anIndex].addTurnedCardList();
                    if (this.listPlayerNode[currentPlayerIndex].player.takenCardList.length == 2 && isChot !== 1) {
                        this.playSound("ancay2");
                    }
                    this.listPlayerNode[currentPlayerIndex].addTakenCardList();

                    this.listPlayerNode[anIndex].setMoney(-(Number(message.lostMoney)));
                    if (isChot == 1) {
                        this.playSound("anchot");
                        this.listPlayerNode[currentPlayerIndex].setMoney(message.winMoney, true, true);
                    } else {
                        this.listPlayerNode[currentPlayerIndex].setMoney(message.winMoney);
                    }
                } else {
                    // người xem
                    anIndex = this.findAnIndex(currentPlayerIndex);
                    var anCard = this.listPlayerNode[anIndex].player.turnedCardList.pop();
                    if (anCard) {
                        this.listPlayerNode[currentPlayerIndex].player.takenCardList.push(anCard);
                    }
                    if (anIndex >= 0) {
                        var index = this.nextIndex(anIndex);
                        while (index != anIndex) {
                            if (this.listPlayerNode[anIndex].player.turnedCardList.length < this.listPlayerNode[index].player.turnedCardList.length) {
                                break;
                            }
                            index = this.nextIndex(index);
                        }
                        if (index != anIndex) {
                            var moveCard = this.listPlayerNode[index].player.turnedCardList.pop();

                            this.listPlayerNode[anIndex].player.turnedCardList.push(moveCard);
                            this.listPlayerNode[index].addTurnedCardList();
                        }
                    }
                    this.listPlayerNode[anIndex].addTurnedCardList();
                    if (this.listPlayerNode[currentPlayerIndex].player.takenCardList.length == 2 && isChot !== 1) {
                        this.playSound("ancay2");
                    }
                    this.listPlayerNode[currentPlayerIndex].addTakenCardList();

                    this.listPlayerNode[anIndex].setMoney(-(Number(message.lostMoney)));
                    if (isChot == 1) {
                        this.playSound("anchot");
                        this.listPlayerNode[currentPlayerIndex].setMoney(message.winMoney, true, true);
                    } else {
                        this.listPlayerNode[currentPlayerIndex].setMoney(message.winMoney);
                    }

                }
            }
            // this.cardLeft +=1;
            this.textCardLeft.string = this.cardLeft;
        } else {

        }
    },
    findAnIndex(index) {
        var newIndex = index - 1;
        if (newIndex < 0) {
            newIndex = this.listPlayerNode.length - 1;
        }
        while (this.listPlayerNode[newIndex].player.state !== 2) {
            newIndex -= 1;
            if (newIndex < 0) {
                newIndex = this.listPlayerNode.length - 1;
            }
        }
        return newIndex;
    },
    nextIndex(index) {
        var newIndex = index + 1;
        if (newIndex > this.listPlayerNode.length - 1) {
            newIndex = 0;
        }
        while (this.listPlayerNode[newIndex].player.state == 0) {
            newIndex += 1;
            if (newIndex > this.listPlayerNode.length - 1) {
                newIndex = 0;
            }
        }
        return newIndex;
    },
    onBocBaiResponse(message) {
        if (message.status == 1) {
            this.playSound("bocbai");
            var currentPlayerIndex = this.findCurrentPlayer(this.currentTurnId);
            var currentPlayer = this.listPlayerNode[currentPlayerIndex];
            if (message.isBoc) {
                this.isCanEat = false;
                this.isbocBai = true;
                this.listPlayer[this.myIndex].cardOwnerList.push(message.card);
                this.listPlayerNode[this.myIndex].setPlayer(this.listPlayer[this.myIndex]);
                this.bocBtn.active = false;
                this.anBaiBtn.active = false;
                this.guiUBtn.active = false;
                if (message.isHaBai == 1) {
                    this.isHaBai = 1;
                }
                var self = this;
                var cardOwnerList = this.listPlayer[this.myIndex].cardOwnerList;
                PhomEffect.bocCardEffect(this.player0, message.card, () => {
                    self.callBackHaPhom();
                    self.checkUFirstTurn(cardOwnerList);
                    self.isbocBai = false;
                });
            } else {
                var indexOrther = this.findCurrentPlayer(this.nextTurnId);
                var orther = this.listPlayerNode[indexOrther];
                if (!orther && currentPlayer) {
                    orther = currentPlayer;
                }
                if (orther) {
                    orther.otherBocCardEffect();
                }
                // if(currentPlayer){
                //     //PhomEffect.otherBocCardEffect(currentPlayer);
                //     currentPlayer.otherBocCardEffect();
                // }
            }
            this.cardLeft--;
            this.textCardLeft.string = this.cardLeft + "";
            cc.log("HA_BAI", message.isHaBai);
        } else {
            cc.Global.showMessage(message.error);
        }
    },
    callBackHaPhom() {
        if (this.isCanEat && this.anCardIndex) {
            this.anBaiBtn.active = false;
            this.listPlayerNode[this.myEatIndex].turnedCardList.children[this.anCardIndex].getComponent(PhomCard).setTakenCard(false);
            this.isCanEat = false;
            this.anCard = null;
            this.anCardIndex = -1;
        }
        if (this.preCard) {
            this.preCard.node.y = 0;
            this.preCard = null;
            this.myTurnCard = null;
        }
        if (this.isHaBai == 1) {
            this.haPhomList = PhomLogic.findHaPhomCard(this.listPlayerNode[this.myIndex].player.takenCardList, this.listPlayerNode[this.myIndex].player.cardOwnerList, 0);
            if (this.haPhomList.length == 0) {
                cc.log("MOM_MOM");
                if (this.listPlayerNode[this.myIndex].player.phomList.length == 0) {
                    this.listPlayerNode[this.myIndex].playMomEffect();
                    this.playSound("mom");
                    var send = PhomSend.haPhomRequest(this.tableId, "", 0, 0);
                    Linker.Socket.send(send);
                    this.haBaiBtn.active = false;
                    this.danhBtn.active = true;
                } else {
                    // var send = PhomSend.haPhomRequest(this.tableId, "", 0, 0);
                    // Linker.Socket.send(send);
                    // không có thêm phỏm nào lên ko gửi phỏm lên nữa
                    var result = PhomLogic.findGuiBai(this.listPlayerNode[this.myIndex].player.cardOwnerList, this.listHaPhom);
                    if (result.length > 0) {
                        this.danhBtn.active = false;
                        this.guiBaiBtn.active = true;
                        this.isGuiBai = true;
                        this.guiCardList = result.slice(0);
                        result.forEach((element) => {
                            this.listPlayerNode[this.myIndex].guiBai(element.card);
                        })
                    } else {
                        this.danhBtn.active = true;
                        this.guiBaiBtn.active = false;
                        this.isGuiBai = false;
                    }
                    this.isHaBai = 0;
                }
            } else {
                this.danhBtn.active = false;
                this.haBaiBtn.active = true;
                this.listPlayerNode[this.myIndex].haPhom(this.haPhomList);
            }
        } else {
            this.danhBtn.active = true;
            this.isHaBai = 0;
        }
        this.bocBaiBtn.getChildByName('bocCard').active = false;
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
        this.bocBaiBtn.getChildByName('bocCard').active = false;
        this.readyGameBtn.active = false;
        this.guiBaiBtn.active = false;
        this.sortBtn.active = false;
        this.danhBtn.active = false;
        var uType = message.uType;
        var self = this;
        this.sortBtn.active = false;
        this.haBaiBtn.active = false;
        this.bocBtn.active = false;
        this.guiUBtn.active = false;
        this.CheckTypeU(0);
        this.anBaiBtn.active = false;
        var compare = function (lhs, rhs) {
            if (Number(lhs.point) < Number(rhs.point)) {
                return -1;
            } else if (Number(lhs.point) > Number(rhs.point)) {
                return 1;
            } else {
                if (Number(lhs.point) == Number(rhs.point)) {
                    if (self.haList.lastIndexOf(lhs.userId) > self.haList.lastIndexOf(rhs.userId)) {
                        return 1;
                    } else {
                        return -1;
                    }
                }

            }
        }
        if (message.uType == 0) {
            message.listPlayer.sort(compare);
        }
        message.listPlayer.forEach((element, pos, array) => {
            if (element.userId == Linker.userData.userId) {
                if (element.userId == message.winerId) {
                    this.playSound("thang");
                } else {
                    this.playSound("thua");
                }
            }
            var index = this.findCurrentPlayer(element.userId);
            var player = this.listPlayerNode[index];
            if (player != undefined) {

                // player.moneyPlayer.string = Utils.Number.format(element.cash);
                player.moneyPlayer.string = TQUtils.abbreviate(element.cash);
                player.player.cardOwnerList = element.listCard;
                if (player.player.userId != this.myUserId) {
                    player.addCardPlayerOwner();
                    cc.log("OTHER_CARD___");
                } else {
                    cc.log("MY_CARD___");
                }
                player.takenCardList.removeAllChildren();
                player.showHiddenCard(false);
                if (uType == 0) {
                    if (message.winerId == element.userId) {
                        if (element.point == 1000) {
                            player.playWinEffect(0, 0, 0, element.money, true);
                        } else {
                            if (element.point == 0) {
                                player.playWinEffect(0, 0, element.point, element.money, false);
                            } else {
                                player.playWinEffect(0, 0, element.point, element.money, false);
                            }

                        }

                    } else {
                        if (element.point == 1000) {
                            if (true) {
                                player.playWinEffect(3, 0, 0, element.money, true);
                            }

                        } else {
                            if (element.point == 0) {
                                player.playWinEffect(3, 0, element.point, element.money, false);
                            } else {
                                if (pos == array.length - 1) {
                                    player.playWinEffect(3, 0, element.point, element.money, false);
                                } else {
                                    player.playWinEffect(pos, 0, element.point, element.money, false);
                                }
                            }
                        }
                    }

                } else {
                    if (message.winerId == this.myUserId) {
                        player.cardOnHandList.removeAllChildren();
                        player.showCardOnHand(false);
                    }
                    if (message.winerId == element.userId) {
                        player.cardOnHandList.removeAllChildren();
                        player.showCardOnHand(false);
                        player.playWinEffect(0, uType, 0, element.money, false);
                    } else {
                        player.playWinEffect(3, uType, 0, element.money, false);
                    }
                }
                if (element.userId == this.myUserId) {
                    Linker.userData.userMoney = element.cash;
                }
            }

        });
        cc.log("message.", message);
        //xu ly khi co nguoi no hu
        if (message.idUserAnHu && message.moneyAnHu > 0) {
            var indexUserNoHu = this.findCurrentPlayer(message.idUserAnHu);
            if (indexUserNoHu >= 0) {
                var player = this.listPlayer[indexUserNoHu];
                // Linker.showMessage("Chúc mừng người chơi "+player.viewName+" Nổ Nũ Phỏm với số tiền "+Utils.Number.format(message.moneyAnHu));
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
        this.setEffectLevelUp(message);
        //end xu ly khi co nguoi no hu
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
    stopAllGameEffect: function () {
        //stop no hu game bai effect
        var nohuEffect = cc.find("Canvas/NoHuGameBaiEffectLayer");
        if (nohuEffect) {
            var nohueffects = nohuEffect.getComponent("NoHuGameBaiEffectLayer");
            nohueffects.hideAnimLayer();
        }
    },
    endGameLogic(target, message) {
        cc.log("END_GAME", message);
        if (this.isLeaveTable) {
            cc.Global.showLoading();
            this.leaveRoom();
        } else {
            this.haList = [];
            this.listHaPhom = [];
            this.bocBaiBtn.getChildByName('bocCard').active = false;
            this.guiUBtn.active = false;
            this.CheckTypeU(0);
            this.danhBtn.active = false;
            this.haBaiBtn.active = false;
            this.sortBtn.active = false;
            this.anBaiBtn.active = false;
            this.bocBtn.active = false;
            this.isCanEat = false;
            this.gameState = 0;
            if (message.newOwner != 0) {
                for (var i = 0; i < this.listPlayer.length; i++) {

                    if (this.listPlayer[i]) {
                        if (this.listPlayer[i].userId == message.newOwner) {
                            this.listPlayer[i].isMaster = 1;
                            this.listPlayerNode[i].player.isMaster = 1;
                        } else {
                            this.listPlayer[i].isMaster = 0;
                            this.listPlayerNode[i].player.isMaster = 0;
                        }
                    }


                }
                if (this.myUserId == message.newOwner) {
                    this.isMaster = true;
                    this.startGameBtn.active = true;
                    this.readyGameBtn.active = false;
                    this.bocBaiBtn.active = false;
                }
            }
            if (message.listPlayer.length > 0) {
                message.listPlayer.forEach((element) => {
                    var index = this.findCurrentPlayer(element.userId);
                    var player = this.listPlayer[index];
                    if (player) {
                        player.userMoney = element.cash;
                        player.isAutoPlay = element.isAutoPlay;
                        // kyun: Clear player notEnough Money
                        player.userId = element.userId;
                        if (element.notEnoughMoney) {
                            player.notEnoughMoney = element.notEnoughMoney;
                            // kyun: Clear player notEnough Money
                            if (Number(player.notEnoughMoney) == 1) {
                                this.listPlayer.splice(index, 1);
                                this.listPlayerNode.splice(index, 1);
                                if (Number(player.userId) == Number(Linker.userData.userId)) {
                                    // Check nguoi choi do la chinh minh thi roi khoi ban.
                                    Linker.message = "Bạn bị thoát ra do không đủ tiền chơi.";
                                    cc.Global.showLoading();
                                    cc.Global.showMessage(Linker.message);
                                    this.leaveRoom();
                                }
                            }
                        }
                    }
                });
            }
            if (message.listPlayer.length > 0) {
                message.listPlayer.forEach((element) => {
                    var index = this.findCurrentPlayer(element.userId);
                    var player = this.listPlayer[index];
                    if (player) {
                        if (player.isAutoPlay == 1) {
                            this.listPlayer.splice(index, 1);
                            this.listPlayerNode.splice(index, 1);
                        }
                    }

                });
            }
            this.myIndex = this.findCurrentPlayer(this.myUserId);
            this.currentCapacity = this.listPlayer.length;
            // if (this.isMaster) {
            //     //:__: Chu ban thi hien nut bat dau hien thi nut san sang
            //     this.startGameBtn.active = true;
            //     this.readyGameBtn.active = false;
            // } else {
            //     this.startGameBtn.active = false;
            //     this.readyGameBtn.active = true;
            // }
            //:__: Check if the master of this table is you 
            // Default set
            this.startGameBtn.active = false;
            this.readyGameBtn.active = true;
            this.buttonGame.active = true;
            for (var i = 0; i < this.listPlayer.length; i++) {
                if (typeof (this.listPlayer[i]) !== undefined) {
                    var userId = Number(this.listPlayer[i].userId);
                    if (userId == Number(Linker.userData.userId)) {
                        if (this.listPlayer[i].isMaster == 1) {
                            this.isMaster = true;
                            this.startGameBtn.active = true;
                            this.readyGameBtn.active = false;
                            break;
                        }
                    }
                }
            }
            //:__:EOF Check if the master of this table is you 

            // for(var i=0;i<this.listPlayer.length;i++){
            //     if(Utils.Type.isString(this.listPlayer[i])){
            //         this.listPlayer.splice(i,1);
            //         continue;
            //     }
            // }
            for (var i = 0; i < this.listPlayer.length; i++) {
                if (this.listPlayer[i] != undefined && this.listPlayerNode[i]) {
                    if (this.listPlayer[i].isMaster == 1) {
                        this.listPlayer[i].state = 1;
                        if (Utils.Type.isObject(this.listPlayerNode[i].player)) {
                            this.listPlayerNode[i].player.state = 1;
                        }

                    } else {
                        if (!Utils.Type.isString(this.listPlayer[i])) {
                            this.listPlayer[i].state = 0;
                            //if(this.listPlayerNode[i].player != undefined){
                            if (Utils.Type.isObject(this.listPlayerNode[i].player)) {
                                this.listPlayerNode[i].player.state = 0;
                            }
                        }
                    }

                    this.listPlayer[i].takenCardList = [];
                    this.listPlayer[i].turnedCardList = [];
                    this.listPlayer[i].cardOwnerList = [];
                    this.listPlayer[i].phomList = [];

                    this.listPlayerNode[i].player.takenCardList = [];
                    this.listPlayerNode[i].player.turnedCardList = [];
                    this.listPlayerNode[i].player.cardOwnerList = [];
                    this.listPlayerNode[i].player.phomList = [];
                    this.listPlayerNode[i].showTien(false);
                    this.listPlayerNode[i].takenCardList.removeAllChildren();
                }
            }
            if (this.isMaster) {
                if (this.listPlayer[this.myIndex] != undefined) {
                    this.listPlayer[this.myIndex].state = 1;
                }

            }

            this.bocBaiBtn.active = false;
            this.myIndex = this.findCurrentPlayer(this.myUserId);
            switch (this.gameState) {
                case PhomConstant.GAME_STATE.WAIT: {
                    if (this.maxCapacity) {
                        this.player0.reset();
                        this.player0.show(false);
                        this.player1.reset();
                        this.player2.reset();
                        this.player3.reset();
                        this.player4.reset();
                        this.player0.show(false);
                        this.checkCapacityShowPlayer();
                    }
                    this.currentCapacity = this.listPlayer.length;
                    switch (this.myIndex) {
                        case 0: {
                            switch (this.currentCapacity) {
                                case 1: {
                                    this.player4.createPlayer(this.listPlayer[0]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.listPlayerNode = [this.player4];
                                    break;
                                }
                                case 2: {

                                    this.player4.createPlayer(this.listPlayer[0]);
                                    this.player2.createPlayer(this.listPlayer[1]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player4, this.player2];

                                    break;
                                }
                                case 3: {

                                    this.player4.createPlayer(this.listPlayer[0]);
                                    this.player1.createPlayer(this.listPlayer[1]);
                                    this.player2.createPlayer(this.listPlayer[2]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player4, this.player1, this.player2];

                                    break;
                                }
                                case 4: {

                                    this.player4.createPlayer(this.listPlayer[0]);
                                    this.player1.createPlayer(this.listPlayer[1]);
                                    this.player2.createPlayer(this.listPlayer[2]);
                                    this.player3.createPlayer(this.listPlayer[3]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.player3.showInvite(false);
                                    this.player3.showProfile(true);
                                    this.listPlayerNode = [this.player4, this.player1, this.player2, this.player3];

                                    break;
                                }

                            }

                            break;
                        }
                        case 1: {
                            switch (this.currentCapacity) {
                                case 2: {

                                    this.player4.createPlayer(this.listPlayer[1]);
                                    this.player2.createPlayer(this.listPlayer[0]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player2, this.player4];

                                    break;
                                }
                                case 3: {

                                    this.player4.createPlayer(this.listPlayer[1]);
                                    this.player1.createPlayer(this.listPlayer[2]);
                                    this.player2.createPlayer(this.listPlayer[0]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player2, this.player4, this.player1];

                                    break;
                                }
                                case 4: {

                                    this.player4.createPlayer(this.listPlayer[1]);
                                    this.player1.createPlayer(this.listPlayer[2]);
                                    this.player2.createPlayer(this.listPlayer[3]);
                                    this.player3.createPlayer(this.listPlayer[0]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.player3.showInvite(false);
                                    this.player3.showProfile(true);
                                    this.listPlayerNode = [this.player3, this.player4, this.player1, this.player2];

                                    break;
                                }
                            }
                            break;
                        }
                        case 2: {
                            switch (this.currentCapacity) {
                                case 3: {
                                    this.player4.createPlayer(this.listPlayer[2]);
                                    this.player1.createPlayer(this.listPlayer[0]);
                                    this.player2.createPlayer(this.listPlayer[1]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player1, this.player2, this.player4];
                                    break;
                                }
                                case 4: {

                                    this.player4.createPlayer(this.listPlayer[2]);
                                    this.player1.createPlayer(this.listPlayer[3]);
                                    this.player2.createPlayer(this.listPlayer[0]);
                                    this.player3.createPlayer(this.listPlayer[1]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.player3.showInvite(false);
                                    this.player3.showProfile(true);
                                    this.listPlayerNode = [this.player2, this.player3, this.player4, this.player1];

                                    break;
                                }
                            }
                            break;
                        }
                        case 3: {
                            switch (this.currentCapacity) {
                                case 4: {
                                    this.player4.createPlayer(this.listPlayer[3]);
                                    this.player1.createPlayer(this.listPlayer[0]);
                                    this.player2.createPlayer(this.listPlayer[1]);
                                    this.player3.createPlayer(this.listPlayer[2]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.player3.showInvite(false);
                                    this.player3.showProfile(true);
                                    this.listPlayerNode = [this.player1, this.player2, this.player3, this.player4];
                                    break
                                }
                            }


                            break;
                        }
                        default:
                            this.leaveRoom();
                            break;
                    }
                    if (this.isAutoReady == 1) {
                        this.readyBtnClick();
                    }

                    break;
                }
                case PhomConstant.GAME_STATE.PLAYING: {

                    break;
                }
            }
        }

    },
    onGetPockerResponse(message) {
        if (message.status == 1) {
            this.playSound("batdau");
            this.newFirstTurn = true;
            this.guiCardList = [];
            this.isGuiBai = false;
            this.gameState = PhomConstant.GAME_STATE.PLAYING;
            this.isHaBai = 0;
            var count = 0;
            this.listPlaying = message.listPlayer;
            for (var i = 0; i < this.listPlayer.length; i++) {
                if (this.listPlayer[i].state == 1) {
                    this.listPlayer[i].state = 2;
                    this.listPlayerNode[i].player.state = 2;
                    count++;
                } else {
                    this.listPlayer[i].state = 0;
                    this.listPlayerNode[i].player.state = 0;
                }

            }
            if (this.listPlayer[this.myIndex].state == 2) {
                this.player4.reset();
                this.player4.show(false);
                this.player0.show(true);
                this.player0.reset();
                this.player0.showInvite(false);
                this.player0.showProfile(true);
                this.player0.showTakenCard(false);
                this.player0.createPlayer(this.listPlayer[this.myIndex]);
                this.listPlayerNode[this.myIndex] = this.player0;
                cc.log("MY_USER");
                this.sortBtn.active = true;

            } else {
                cc.log("NULLL", this.listPlayer[this.myIndex].state);
                this.sortBtn.active = false;
            }

            for (var i = 0; i < this.listPlayerNode.length; i++) {
                this.listPlayerNode[i].isReady(false);
            }

            cc.log("MY_INDEX", this.myIndex);
            // cc.log("PLAYER_LIST", this.listPlayer);
            // cc.log("PLAYER_LIST_NODE", this.listPlayerNode);
            if (message.beginPlayerId) {
                this.currentTurnId = message.beginPlayerId;
            }


            this.bocBaiBtn.active = true;
            this.cardLeft = this.listPlaying.length * 4;
            this.textCardLeft.string = this.cardLeft;
            this.listPlayerNode[this.myIndex].player.cardOwnerList = message.cardOwnerList;
            // this.listPlayerNode[this.myIndex].setPlayer(this.listPlayer[this.myIndex]);
            this.listPlayerNode[this.myIndex].cardOnHandList.active = false;
            this.listPlayerNode[this.myIndex].addCardPlayerOwner();

            if (this.listPlayer[this.myIndex].state == 2) {
                this.listPlayerNode[this.myIndex].cardOnHandList.active = false;
                //  this.listCardEffect.position = cc.v2(0, 0);
                PhomEffect.chiaBaiEffect(this.listPlayerNode[this.myIndex], 10);
            }
            for (var i = 0; i < this.listPlayerNode.length; i++) {
                if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2) {
                    this.listPlayerNode[i].showHiddenCard(true);
                    PhomEffect.otherPlayerChiaBaiEffect(this.listPlayerNode[i], 10);
                } else {
                    // this.listPlayer[this.myIndex].cardOwnerList = message.cardOwnerList;
                    // this.listPlayerNode[this.myIndex].setPlayer(this.listPlayer[this.myIndex]);
                    // this.listPlayerNode[this.myIndex].addCardPlayerOwner();
                    // this.listPlayerNode[i].showHiddenCard(false);
                    // // this.listCardEffect.position = cc.v2(0, 0);
                    // PhomEffect.chiaBaiEffect(this.listPlayerNode[i], this.listPlayerNode[i].player.cardOwnerList.length);
                }
            }
            this.myEatIndex = this.findEatIndexPlayer(this.myUserId);
            cc.log("this.myEatIndex", this.myEatIndex);
            for (var i = 0; i < this.listPlayerNode.length; i++) {
                if (i == this.findCurrentPlayer(this.currentTurnId)) {
                    this.listPlayerNode[i].showTime(true);
                } else {
                    this.listPlayerNode[i].showTime(false);
                }
            }

            if (this.currentTurnId == this.myUserId) {
                this.buttonGame.active = true;
                this.startGameBtn.active = false;
                this.readyGameBtn.active = false;
                this.danhBtn.active = true;
                this.bocBtn.active = false;
                this.haBaiBtn.active = false;
                this.anBaiBtn.active = false;
                this.checkUFirstTurn();
            } else {
                this.buttonGame.active = true;
                this.startGameBtn.active = false;
                this.readyGameBtn.active = false;
                this.anBaiBtn.active = false;
                this.haBaiBtn.active = false;
                this.bocBtn.active = false;
            }
            this.setBlurProfile();

        } else {
            Linker.showMessage(message.error);
            this.readyGameBtn.active = true;
            this.startGameBtn.active = true;
        }
    },

    onGuiBaiResponse(message) {
        if (message.status == 1) {
            // var guiBaiPlayerIndex = this.findCurrentPlayer(message.receivePlayerId);
            // var guiBaiPlayer = this.listPlayerNode[guiBaiPlayerIndex];
            var phomId = message.phomId;
            var card = message.card;
            var uidNguoiGui = message.uidNguoiGui;
            var biGuiPlayerIndex = this.findCurrentPlayer(message.receivePlayerId);
            var biGuiPlayer = this.listPlayerNode[biGuiPlayerIndex];
            // var phomBiGuiIndex = this.findPhomById(card, biGuiPlayer.player.phomList);
            var phomBiGuiIndex = Number(phomId);
            cc.log("BI_GUI", biGuiPlayer, biGuiPlayerIndex, biGuiPlayer.player.phomList.slice(0));
            if (phomBiGuiIndex >= 0) {
                var phomBiGui = biGuiPlayer.player.phomList[phomBiGuiIndex];
                phomBiGui.cardList.push(card);
                PhomLogic.sortCardByRankIncrease(phomBiGui.cardList);
                var phomScript = biGuiPlayer.phomList.children[phomBiGuiIndex].getComponent(PhomObj);
                if (phomScript) {
                    var type;
                    switch (biGuiPlayer.name) {
                        case "Player1":
                            type = cc.v2(1, 0.5);
                            break;
                        case "Player4":
                            type = cc.v2(0, 0.5);
                            break;

                        default:
                            //type = cc.v2(0.5, 0.5);
                            type = null;
                            break;
                    }
                    phomScript.fromCardListType(phomBiGui.cardList, type);
                };
                if (uidNguoiGui == this.myUserId) {
                    var turnCardIndex = PhomLogic.findCard(card, this.listPlayerNode[this.myIndex].player.cardOwnerList);
                    this.listPlayerNode[this.myIndex].player.cardOwnerList.splice(turnCardIndex, 1);
                    this.listPlayerNode[this.myIndex].removeOwnerCard(message.card);
                    this.guiBaiBtn.active = false;
                    this.isGuiBai = false;
                    if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length == 0) {
                        var send = PhomSend.haPhomRequest(this.tableId, "", 0, PhomConstant.U_GUI);
                        Linker.Socket.send(send);
                    }
                }
            } else {
                cc.log("GUI_BAI_FALSE", biGuiPlayer, biGuiPlayerIndex, phomBiGuiIndex);
            }



        } else {

        }
    },
    onHaBaiResponse(message) {
        if (message.status == 1) {
            this.isHaBai = 0;
            message.haPlayerId;
            message.uType;
            message.uCard;
            message.phomList;

            if (message.haPlayerId == this.myUserId && this.uType == 0) {
                this.danhBtn.active = true;
            }
            var haPlayerId = message.haPlayerId;
            this.currentHaPlayer = haPlayerId;
            var index = this.haList.lastIndexOf(haPlayerId);
            if (index > -1) {
                this.haList.splice(index, 1);
                this.haList.push(haPlayerId);
            } else {
                this.haList.push(haPlayerId);
            }
            var haIndex = this.findCurrentPlayer(haPlayerId);
            var haPlayerNode = this.listPlayerNode[haIndex];
            message.phomList.forEach((element, pos) => {
                element.setId(pos);
                element.setPlayerId(haPlayerId);
                this.listHaPhom.push(element);
            });
            if (haIndex == this.myIndex) {
                // haPlayerNode.player.phomList.push(...message.phomList);
                haPlayerNode.player.phomList = message.phomList;
                // haPlayerNode.setPlayer(haPlayer);

                haPlayerNode.addPhomList();
                for (var i = 0; i < haPlayerNode.player.phomList.length; i++) {
                    for (var j = 0; j < haPlayerNode.player.phomList[i].cardList.length; j++) {
                        var cardIndex = PhomLogic.findCard(haPlayerNode.player.phomList[i].cardList[j], haPlayerNode.player.cardOwnerList);
                        haPlayerNode.player.cardOwnerList.splice(cardIndex, 1);
                        this.listPlayerNode[this.myIndex].removeOwnerCard(haPlayerNode.player.phomList[i].cardList[j]);
                    }
                }
                this.haBaiBtn.active = false;

                haPlayerNode.showTakenCard(false);
                if (message.phomList.length == 0) {
                    // haPlayerNode.playMomEffect();
                    this.haBaiBtn.active = false;
                }
                var result = PhomLogic.findGuiBai(haPlayerNode.player.cardOwnerList, this.listHaPhom);
                cc.log("GUI_BAI", result, this.listHaPhom, haPlayerNode.player.cardOwnerList);
                if (result.length > 0 && message.phomList.length > 0) {
                    this.danhBtn.active = false;
                    this.guiBaiBtn.active = true;
                    this.isGuiBai = true;
                    this.guiCardList = result.slice(0);
                    result.forEach((element) => {
                        haPlayerNode.guiBai(element.card);
                    })


                } else {
                    this.guiBaiBtn.active = false;
                    this.isGuiBai = false;
                }
                this.isCanEat = false;
                this.myPhomCard = "";
                this.haPhomList = [];

            } else {
                // haPlayerNode.player.phomList.push(...message.phomList);
                haPlayerNode.player.phomList = message.phomList;
                // haPlayerNode.setPlayer(haPlayer);
                // haPlayerNode.player.phomList.forEach((element, pos) => {
                //     element.setId(this.listHaPhom.length + pos);
                //     element.setPlayerId(haPlayerId);
                //     this.listHaPhom.push(element);
                // });
                haPlayerNode.addPhomList();
                haPlayerNode.showTakenCard(false);
                if (message.phomList.length == 0 && haPlayerNode.phomList.length == 0) {
                    haPlayerNode.playMomEffect();
                    // this.haBaiBtn.active = false;
                }
            }
            cc.log("LIST_HA", this.listHaPhom.length);

            // var haPlayer = this.listPlayer[haIndex];

        } else if (!this.checkHaPhomDisconnect && message.status == 1) {
            //nvm thực hiện im lặng, nếu hạ rồi thì không thông báo, nếu chưa hạ thì nó cũng đã được hạ rồi
            Linker.showMessage(message.error);
        }
        this.checkHaPhomDisconnect = false;
    },
    onPlayerJoinedResponse(message) {
        if (message.status == 1) {
            NewAudioManager.playAudioSource("joinboard");
            switch (this.gameState) {
                case PhomConstant.GAME_STATE.WAIT: {

                    // if (this.player1.player) {
                    //     if (this.player1.player.userId == message.player.userId) {
                    //         this.player1.reset();
                    //     }
                    // }
                    // if (this.player2.player) {
                    //     if (this.player2.player.userId == message.player.userId) {
                    //         this.player2.reset();
                    //     }
                    // }
                    // if (this.player3.player) {
                    //     if (this.player3.player.userId == message.player.userId) {
                    //         this.player3.reset();
                    //     }
                    // }
                    // if (this.player4.player) {
                    //     if (this.player4.player.userId == message.player.userId) {
                    //         this.player4.reset();
                    //     }
                    // }
                    if (this.maxCapacity) {
                        this.player0.reset();
                        this.player1.reset();
                        this.player2.reset();
                        this.player3.reset();
                        this.player4.reset();
                        this.player0.show(false);
                        this.checkCapacityShowPlayer();
                    }

                    this.listPlayerNode = [];
                    this.listPlayer.push(message.player);
                    this.currentCapacity = this.listPlayer.length;
                    switch (this.myIndex) {
                        case 0: {
                            switch (this.currentCapacity) {
                                case 2: {

                                    this.player4.createPlayer(this.listPlayer[0]);
                                    this.player2.createPlayer(this.listPlayer[1]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player4, this.player2];

                                    break;
                                }
                                case 3: {

                                    this.player4.createPlayer(this.listPlayer[0]);
                                    this.player1.createPlayer(this.listPlayer[1]);
                                    this.player2.createPlayer(this.listPlayer[2]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player4, this.player1, this.player2];

                                    break;
                                }
                                case 4: {

                                    this.player4.createPlayer(this.listPlayer[0]);
                                    this.player1.createPlayer(this.listPlayer[1]);
                                    this.player2.createPlayer(this.listPlayer[2]);
                                    this.player3.createPlayer(this.listPlayer[3]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.player3.showInvite(false);
                                    this.player3.showProfile(true);
                                    this.listPlayerNode = [this.player4, this.player1, this.player2, this.player3];

                                    break;
                                }

                            }

                            break;
                        }
                        case 1: {
                            switch (this.currentCapacity) {
                                case 3: {

                                    this.player4.createPlayer(this.listPlayer[1]);
                                    this.player1.createPlayer(this.listPlayer[2]);
                                    this.player2.createPlayer(this.listPlayer[0]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player2, this.player4, this.player1];

                                    break;
                                }
                                case 4: {

                                    this.player4.createPlayer(this.listPlayer[1]);
                                    this.player1.createPlayer(this.listPlayer[2]);
                                    this.player2.createPlayer(this.listPlayer[3]);
                                    this.player3.createPlayer(this.listPlayer[0]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.player3.showInvite(false);
                                    this.player3.showProfile(true);
                                    this.listPlayerNode = [this.player3, this.player4, this.player1, this.player2];

                                    break;
                                }
                            }
                            break;
                        }
                        case 2: {
                            switch (this.currentCapacity) {
                                case 4: {

                                    this.player4.createPlayer(this.listPlayer[2]);
                                    this.player1.createPlayer(this.listPlayer[3]);
                                    this.player2.createPlayer(this.listPlayer[0]);
                                    this.player3.createPlayer(this.listPlayer[1]);
                                    this.player4.showInvite(false);
                                    this.player4.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.player3.showInvite(false);
                                    this.player3.showProfile(true);
                                    this.listPlayerNode = [this.player2, this.player3, this.player4, this.player1];

                                    break;
                                }
                            }
                            break;
                        }
                        case 3: {

                        }
                    }





                    break;
                }
                case PhomConstant.GAME_STATE.PLAYING: {

                    if (this.currentTurnId == this.myUserId) {
                        this.sortBtn.active = true;
                        if (this.listPlayerNode[this.myIndex].player.phomList.length > 0) {
                            if (this.listPlayerNode[this.myIndex].player.turnedCardList.length < 3) {
                                this.isHaBai = 0;
                                this.haBaiBtn.active = false;
                            } else {
                                // this.haBaiBtn.active = true;
                            }
                            if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length == 0) {
                                this.guiUBtn.active = true;
                                this.danhBtn.active = false;
                            } else {
                                // this.bocBtn.active = true;
                                // this.danhBtn.active = true;
                            }
                        } else {
                            if (this.listPlayerNode[this.myIndex].player.turnedCardList.length >= 3) {
                                this.haBaiBtn.active = true;
                            } else {
                                this.isHaBai = 0;
                                this.haBaiBtn.active = false;
                            }
                            if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length == 10) {
                                this.danhBtn.active = true;
                                this.bocBaiBtn.action = false;
                            } else {
                                if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length == 9) {
                                    this.danhBtn.active = false;
                                    this.bocBaiBtn.action = true;
                                }
                            }
                        }
                    } else {

                        this.sortBtn.active = false;
                        this.danhBtn.active = false;
                        this.haBaiBtn.active = false;
                        this.bocBtn.active = false;
                        this.anBaiBtn.active = false;
                    }
                    this.readyGameBtn.active = false;
                    this.startGameBtn.active = false;
                    this.buttonGame.active = true;
                    this.listPlayer.push(message.player);
                    this.currentCapacity = this.listPlayer.length;
                    switch (this.myIndex) {
                        case 0: {
                            switch (this.currentCapacity) {

                                case 3: {

                                    this.player1.createPlayer(this.listPlayer[2]);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true, true);
                                    this.listPlayerNode.push(this.player1);

                                    break;
                                }
                                case 4: {
                                    //check player 3 co nguoi ngoi chua
                                    var check = false;
                                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                                        if (this.listPlayerNode[i].node.name == "Player3") {
                                            check = true;
                                        }
                                    }
                                    if (!check) {
                                        this.player3.createPlayer(this.listPlayer[3]);
                                        this.player3.showInvite(false);
                                        this.player3.showProfile(true, true);
                                        this.listPlayerNode.push(this.player3);
                                    } else {
                                        this.player1.createPlayer(this.listPlayer[3]);
                                        this.player1.showInvite(false);
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
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true, true);
                                    this.listPlayerNode.push(this.player1);

                                    break;
                                }
                                case 4: {
                                    //check player 3 co nguoi ngoi chua
                                    var check = false;
                                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                                        if (this.listPlayerNode[i].node.name == "Player3") {
                                            check = true;
                                        }
                                    }
                                    if (!check) {
                                        this.player3.createPlayer(this.listPlayer[3]);
                                        this.player3.showInvite(false);
                                        this.player3.showProfile(true, true);
                                        this.listPlayerNode.push(this.player3);
                                    } else {
                                        this.player1.createPlayer(this.listPlayer[3]);
                                        this.player1.showInvite(false);
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
                                    this.player3.showInvite(false);
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
        } else {

        }
    },
    onReconnectionResponse: function (message) {
        //check trang thai game bai
        cc.log("Phom_onReconnectionResponse: ", message);
        cc.Global.hideLoading();
        if (message.status != 1) return;
        this.isReconnect = true;
        this.showPhomGame(message);
        // this.setGameState(message);
        NewAudioManager.playAudioSource("joinboard");
        // this.isCanEat = false;
        this.tableId = message.tableId;
        //cau hinh lai trang thai cua van bai dang choi do
        //reset table
        this.resetTable();
        this.tableId = message.tableId;
        if (!Linker.CURRENT_TABLE) Linker.CURRENT_TABLE = {};
        Linker.CURRENT_TABLE.tableId = this.tableId;
        this.tableIndex = message.tableIndex;
        this.minMoney = message.minMoney;
        this.maxCapacity = message.maxCapacity;
        this.isAn = message.isAn;
        this.isTaiGui = message.isTaiGui;
        this.dutyType = message.dutyType;
        this.setRoomInfo();

        this.currentCapacity = message.listPlayer.length;
        this.listPlayer = message.listPlayer;
        this.gameState = Number(message.isPlaying);
        this.currentTurnId = message.currentPlayerId;
        this.cardLeft = message.cardLeft;
        this.textCardLeft.string = this.cardLeft + "";
        this.setPlayersPlaying(message);
        this.setMasterRoomPlayer(message);
        this.setGameState(message);
        this.showTimeCounter(message);
        this.isReconnect = false;
        Linker.userData.lastRoom = null;
        Linker.redirectOnReconnect = null;
        for (var i = 0; i < this.listPlayerNode.length; i++) {
            if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2 && Number(this.listPlayerNode[i].player.isObserver) == 0) {
                this.listPlayerNode[i].showHiddenCard(true);
            } else {
                this.listPlayerNode[i].showHiddenCard(false);
            }

            if (Number(this.listPlayerNode[i].player.isObserver) == 1) { // neu la nguoi dang xem thi an profile
                this.listPlayerNode[i].showProfile(true, true);
            }
        }
        this.setBlurProfile(parseInt(message.isPlaying));
    },
    setPlayersPlaying: function (message) {
        this.listPlaying = [];
        for (var i = 0; i < this.listPlayer.length; i++) {
            //push id của player đang chơi
            var id = this.listPlayer[i].userId;
            if (this.listPlayer[i].state == 2) {
                this.listPlaying.push(id);
            }
        }
    },
    setMasterRoomPlayer: function (message) {
        this.myIndex = this.findCurrentPlayer(this.myUserId);
        if (this.listPlayer[this.myIndex].isMaster == 1) {
            this.isMaster = true;
        } else {
            this.isMaster = false;
        }
    },
    setGameState: function (message) {
        switch (this.gameState) {
            case PhomConstant.GAME_STATE.WAIT: {
                //người chơi đang ở trạng thái chờ
                if (Linker.CURRENT_TABLE) {
                    Linker.CURRENT_TABLE.tableId = this.tableId;
                } else {
                    Linker.CURRENT_TABLE = {
                        tableId: this.tableId
                    };
                }
                break;
            }
            case PhomConstant.GAME_STATE.PLAYING: {
                // người chơi đang ở trạng thái chơi
                if (this.maxCapacity) {
                    this.player0.reset();
                    this.player1.reset();
                    this.player2.reset();
                    this.player3.reset();
                    this.player4.reset();
                    this.player4.show(false); //avatar choi o giua
                    this.player0.showProfile(false); //avatar choi ben trai
                    this.player0.showInvite(false);
                    this.player0.showWin(false);
                    this.checkCapacityShowPlayer();
                }
                // kich hoat button
                // button game chua button gui u, gui phom, ha phom, an, boc, danh, sap xep
                this.buttonGame.active = true;
                var uiButtonsGame = this.buttonGame.getChildren();
                for (var i = 0; i < uiButtonsGame.length; i++) {
                    uiButtonsGame[i].active = false;
                }
                // button main game button start, button ready
                this.readyGameBtn.active = false;
                this.startGameBtn.active = false;
                // luon luon hien button xep bai cho tat ca cac nguoi choi
                this.sortBtn.active = true;
                // config nut danh button, neu la turn cua minh thi minh boc -> danh, neu da boc roi -> hien button danh
                var isPlaying = false;
                for (var i = 0; i < message.listPlayer.length; i++) {
                    if (message.listPlayer[i].userId == this.myUserId && message.listPlayer[i].state == 2) {
                        isPlaying = true;
                        break;
                    }
                }
                if (message.currentPlayerId == this.myUserId && isPlaying) {
                    //layout lai cai ban nao =)
                    this.configLayoutTable(message);
                    //nap data card tu server
                    this.setMyCardData(message);
                    this.setOthersCardPlayer(message);
                    //config button boc, danh
                    this.configButtonBocDanh(message);
                    //show những người chơi đã hạ phỏm nếu có
                    this.showPlayerDaHaPhom(message);
                    this.configHaPhomButton(message);
                    this.configMyAnButton(message);
                    this.showMyMom(message);
                    this.showPlayerMom(message);
                } else {
                    //không phải đến lượt mình đánh
                    cc.log("#PhomReconnect: Đang không đến lượt mình đánh ...");
                    this.configLayoutTable(message);
                    this.setMyCardData(message);
                    this.setOthersCardPlayer(message);
                    this.showPlayerDaHaPhom(message);
                    this.checkHaPhomDisconnect = true; //chưa check phỏm
                    this.showMyMom(message);
                    this.showPlayerMom(message);
                    this.hideAllButtonExceptXepBai(message);
                }
                break;
            }
            default:
                if (Linker.CURRENT_TABLE) {
                    Linker.CURRENT_TABLE.tableId = this.tableId;
                } else {
                    Linker.CURRENT_TABLE = {
                        tableId: this.tableId
                    };
                }
                break;
        }
    },
    showMyMom: function (message) {
        for (var i = 0; i < this.listPlayerNode.length; i++) {
            if (this.listPlayerNode[i].player.userId == this.myUserId && this.listPlayerNode[i].player.state == 2) {
                if (this.listPlayerNode[i].player.turnedCardList.length == 3 && this.listPlayerNode[i].player.phomList.length == 0 && this.bocBtn.active == false && this.checkHaPhomDisconnect == false) {
                    //tất cả trường hợp không có lượt bốc sẽ bị show móm
                    this.listPlayerNode[i].playMomEffect();
                } else if (this.listPlayerNode[i].player.turnedCardList.length > 3 && this.listPlayerNode[i].player.phomList.length == 0 && this.checkHaPhomDisconnect == false) {
                    //tất cả các trường hợp có số card đã đánh lớn hơn 3 mà số phỏm không có đều show móm hết
                    this.listPlayerNode[i].playMomEffect();
                }
                break;
            }
        }
    },
    showPlayerMom: function (message) {
        for (var i = 0; i < this.listPlayerNode.length; i++) {
            if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2) {
                if (this.listPlayerNode[i].player.turnedCardList.length > 3 && this.listPlayerNode[i].player.phomList.length == 0) {
                    //tất cả trường hợp có số card đã đánh ra đối với tất cả các người chơi phải lớn hơn 3 mới được show móm
                    this.listPlayerNode[i].playMomEffect();
                } else {
                    //kích hoạt nút chọn bài để mà còn chọn bài để đánh
                }
            }
        }
    },
    configMyAnButton: function (message) {
        //đầu tiên off button ăn cái đã
        this.anBaiBtn.active = false;
        this.myEatIndex = this.findEatIndexPlayer(this.myUserId);
        //reset biến có thể ăn hay không =)
        this.isCanEat = false;
        this.anBaiBtn.active = false;
        this.anCard = null;
        var cardCanCheck = message.selfTurnedList[message.selfTurnedList.length - 1];
        var previousPlayer = this.findPreviousPlayer(cardCanCheck);

        if (!this.isCanEat && cardCanCheck && previousPlayer) {
            if (PhomLogic.checkEatCard(cardCanCheck, this.listPlayerNode[this.myIndex].player.cardOwnerList, this.listPlayerNode[this.myIndex].player.takenCardList, 0)) {
                this.anBaiBtn.active = true;
                this.anCard = cardCanCheck;
                this.isCanEat = true;

            } else {
                this.anBaiBtn.active = false;
                cc.log("#PhomReconnect: Có card, nhưng không có bộ bài nào trùng khớp để ghép vào ...");
            }
        } else {
            //check lại một lần nữa nếu móm
            cc.log("#PhomReconnect: Card hiện tại không thể xác đinh, lỗi hiển thị có thể xảy ra ...");
        }
    },
    hideAllButtonExceptXepBai: function (message) {
        //vẫn hiện bộ bài bốc nhưng không cho bốc bài nếu lá bài trên tay không hợp lệ, hình bộ bài ở giữa bàn chơi
        this.bocBaiBtn.active = true;
        //ẩn button đánh, button bốc, và hint bốc bài
        this.haBaiBtn.active = false;
        this.anBaiBtn.active = false;
        this.bocBtn.active = false;
        this.danhBtn.active = false;
        this.sortBtn.active = true;
        this.guiUBtn.active = false;
        this.CheckTypeU(0);
        this.guiBaiBtn.active = false;
        this.bocBaiBtn.getChildByName('bocCard').active = false;
    },
    setOthersCardPlayer: function (message) {
        for (var i = 0; i < this.listPlayerNode.length; i++) {
            //state 2: đang chơi
            //nếu không phải là người chơi hiện tại thì hiện card ẩn, còn nếu là người chơi hiện tại thì ẩn nó đi
            if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2) {
                this.listPlayerNode[i].takenCardList.removeAllChildren();
                this.listPlayerNode[i].cardOnHandList.removeAllChildren();
                this.listPlayerNode[i].addTurnedCardList();
                this.listPlayerNode[i].addTakenCardList();
                this.listPlayerNode[i].showHiddenCard(true);
            }

        }
    },
    configLayoutTable: function (message) {
        if (this.myIndex == 0) {
            if (this.currentCapacity == 2) {
                this.player0.createPlayer(this.listPlayer[0]);
                this.player2.createPlayer(this.listPlayer[1]);
                this.player0.showInvite(false);
                this.player0.showProfile(true);
                this.player2.showInvite(false);
                this.player2.showProfile(true);
                this.listPlayerNode.push(this.player0, this.player2);
            } else if (this.currentCapacity == 3) {
                this.player0.createPlayer(this.listPlayer[0]);
                this.player1.createPlayer(this.listPlayer[1]);
                this.player2.createPlayer(this.listPlayer[2]);
                this.player0.showInvite(false);
                this.player0.showProfile(true);
                this.player1.showInvite(false);
                this.player1.showProfile(true);
                this.player2.showInvite(false);
                this.player2.showProfile(true);
                this.listPlayerNode.push(this.player0, this.player1, this.player2);

            } else if (this.currentCapacity == 4) {
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
                this.listPlayerNode.push(this.player0, this.player1, this.player2, this.player3);
            }
        } else if (this.myIndex == 1) {
            if (this.currentCapacity == 2) {
                this.player0.createPlayer(this.listPlayer[1]);
                this.player2.createPlayer(this.listPlayer[0]);
                this.player0.showInvite(false);
                this.player0.showProfile(true);
                this.player2.showInvite(false);
                this.player2.showProfile(true);
                this.listPlayerNode.push(this.player2, this.player0);
            } else if (this.currentCapacity == 3) {
                this.player0.createPlayer(this.listPlayer[1]);
                this.player1.createPlayer(this.listPlayer[2]);
                this.player2.createPlayer(this.listPlayer[0]);
                this.player0.showInvite(false);
                this.player0.showProfile(true);
                this.player1.showInvite(false);
                this.player1.showProfile(true);
                this.player2.showInvite(false);
                this.player2.showProfile(true);
                this.listPlayerNode.push(this.player2, this.player0, this.player1);

            } else if (this.currentCapacity == 4) {
                this.player0.createPlayer(this.listPlayer[1]);
                this.player1.createPlayer(this.listPlayer[2]);
                this.player2.createPlayer(this.listPlayer[3]);
                this.player3.createPlayer(this.listPlayer[0]);
                this.player0.showInvite(false);
                this.player0.showProfile(true);
                this.player1.showInvite(false);
                this.player1.showProfile(true);
                this.player2.showInvite(false);
                this.player2.showProfile(true);
                this.player3.showInvite(false);
                this.player3.showProfile(true);
                this.listPlayerNode.push(this.player3, this.player0, this.player1, this.player2);
            }

        } else if (this.myIndex == 2) {
            if (this.currentCapacity == 3) {
                this.player0.createPlayer(this.listPlayer[2]);
                this.player1.createPlayer(this.listPlayer[0]);
                this.player2.createPlayer(this.listPlayer[1]);
                this.player0.showInvite(false);
                this.player0.showProfile(true);
                this.player1.showInvite(false);
                this.player1.showProfile(true);
                this.player2.showInvite(false);
                this.player2.showProfile(true);
                this.listPlayerNode.push(this.player1, this.player2, this.player0);
            } else if (this.currentCapacity == 4) {
                this.player0.createPlayer(this.listPlayer[2]);
                this.player1.createPlayer(this.listPlayer[0]);
                this.player2.createPlayer(this.listPlayer[1]);
                this.player3.createPlayer(this.listPlayer[3]);
                this.player0.showInvite(false);
                this.player0.showProfile(true);
                this.player1.showInvite(false);
                this.player1.showProfile(true);
                this.player2.showInvite(false);
                this.player2.showProfile(true);
                this.player3.showInvite(false);
                this.player3.showProfile(true);
                this.listPlayerNode.push(this.player1, this.player2, this.player0, this.player3);
            }

        } else if (this.myIndex == 3) {
            if (this.currentCapacity == 4) {
                this.player0.createPlayer(this.listPlayer[3]);
                this.player1.createPlayer(this.listPlayer[0]);
                this.player2.createPlayer(this.listPlayer[1]);
                this.player3.createPlayer(this.listPlayer[2]);
                this.player0.showInvite(false);
                this.player0.showProfile(true);
                this.player1.showInvite(false);
                this.player1.showProfile(true);
                this.player2.showInvite(false);
                this.player2.showProfile(true);
                this.player3.showInvite(false);
                this.player3.showProfile(true);
                this.listPlayerNode.push(this.player1, this.player2, this.player3, this.player0);
            }
        }
    },
    showTimeCounter: function (message) {
        //cho dù là đang ở trạng thái nào, người chơi kết nối vào sẽ nhìn thấy time running
        this.currentTurnId = message.currentPlayerId;
        for (var i = 0; i < this.listPlayer.length; i++) {
            var id = this.listPlayer[i].userId;
            if (this.listPlayer[i].state == 2) {
                if (id == this.currentTurnId) {
                    this.listPlayerNode[i].showTime(true);
                } else {
                    this.listPlayerNode[i].showTime(false);
                }
            }
        }
    },
    setMyCardData: function (message) {
        //selfTurnedList: card đã đánh
        //selfCardList: card trên tay
        //lỗi người chơi biến mất khi có người rời phòng không set lại, phải check
        //thêm card trên tay
        this.listPlayerNode[this.myIndex].takenCardList.removeAllChildren();
        this.listPlayerNode[this.myIndex].cardOnHandList.removeAllChildren();

        this.listPlayerNode[this.myIndex].player.cardOwnerList = message.selfCardList;

        //thêm card đã đánh
        this.listPlayerNode[this.myIndex].player.turnedCardList = message.listPlayer[this.myIndex].turnedCardList;

        this.listPlayerNode[this.myIndex].setPlayer(this.listPlayer[this.myIndex]);
        this.listPlayerNode[this.myIndex].addCardPlayerOwner();
        this.listPlayerNode[this.myIndex].addTurnedCardList();
        this.listPlayerNode[this.myIndex].addTakenCardList();
        this.listPlayerNode[this.myIndex].takenCardList.active = false;

        this.xepBaiKhongDieuKien();

    },
    xepBaiKhongDieuKien: function () {
        this.preCard = null;
        this.sortType = (this.sortType == 0) ? 1 : 0;
        this.listPlayerNode[this.myIndex].player.cardOwnerList = PhomLogic.sort(this.listPlayerNode[this.myIndex].player.cardOwnerList, this.listPlayerNode[this.myIndex].player.takenCardList, this.sortType);
        this.listPlayerNode[this.myIndex].sortMyCard(this.sortType);
        this.listPlayerNode[this.myIndex].printData();
    },
    configButtonBocDanh: function (message) {
        //vẫn hiện bộ bài bốc nhưng không cho bốc bài nếu lá bài trên tay không hợp lệ
        this.bocBaiBtn.active = true;
        //trạng thái đã bốc bái rồi card trên tay sẽ là 10 nên ẩn button bốc đi chỉ hiện button đánh
        if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length == 10) {
            cc.log("#PhomReconnect: Trường hợp này sẽ không cho người chơi bốc bài");
            cc.log("#PhomReconnect: Number card trên tay:", this.listPlayerNode[this.myIndex].player.cardOwnerList.length);
            this.danhBtn.active = true;
            this.bocBtn.active = false;
            //sprite text bốc bài
            this.bocBaiBtn.getChildByName('bocCard').active = false;
            //ngược lại
        } else if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length == 9) {
            cc.log("#PhomReconnect: Trường hợp này sẽ cho người chơi bốc bài");
            cc.log("#PhomReconnect: Number card trên tay:", this.listPlayerNode[this.myIndex].player.cardOwnerList.length);
            this.danhBtn.active = false;
            this.bocBtn.active = true;
            this.bocBaiBtn.getChildByName('bocCard').active = true;
            //dành cho đã hạ phỏm
        } else if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length < 9) {
            //Trường hợp này do người chơi đã hạ phỏm nên sẽ không còn số lượng 9, 10 nữa
            cc.log("#PhomReconnect: Trường hợp này do người chơi đã hạ phỏm nên sẽ không còn số lượng 9, 10 nữa");
            cc.log("#PhomReconnect: Number card trên tay:", this.listPlayerNode[this.myIndex].player.cardOwnerList.length);
            this.danhBtn.active = true;
            this.bocBtn.active = false;
            this.bocBaiBtn.getChildByName('bocCard').active = false;

            //try catch không xác định ẩn hết
        } else {
            cc.log("#PhomReconnect: Lỗi, số lượng card bài trên tay không cho phép bốc hoặc đánh");
            cc.log("#PhomReconnect: Number card trên tay:", this.listPlayerNode[this.myIndex].player.cardOwnerList.length);
            this.danhBtn.active = false;
            this.bocBtn.active = false;
            this.bocBaiBtn.getChildByName('bocCard').active = false;
        }
    },
    showPlayerDaHaPhom: function (message) {
        this.haList = [];
        for (var i = 0; i < this.listPlayerNode.length; i++) {
            if (this.listPlayerNode[i].player.phomList.length > 0) {
                this.listPlayerNode[i].addPhomList();
                this.listPlayerNode[i].showTakenCard(false);
                var index = this.haList.lastIndexOf(this.listPlayerNode[i].player.userId);
                if (index) {
                    this.haList.splice(index, 1);
                    this.haList.push(this.listPlayerNode[i].player.userId);
                } else {
                    this.haList.push(this.listPlayerNode[i].player.userId);
                }
                this.listPlayerNode[i].player.phomList.forEach((element, pos) => {
                    element.setId(pos);
                    element.setPlayerId(this.listPlayerNode[i].player.userId);
                    this.listHaPhom.push(element);
                });
            }
        }
    },
    configHaPhomButton: function (message) {
        //xem xem co ha bai khong, đã config bốc đánh phía trên
        //kiểm tra xem nếu số card trên tay < 9 chứng tỏ có phỏm vậy phải
        var maxTurnedCard = [];
        for (var i = 0; i < message.listPlayer.length; i++) {
            maxTurnedCard.push(message.listPlayer[i].turnedCardList);
        };
        var max = 0;
        for (var j = 0; j < maxTurnedCard.length; j++) {
            if (maxTurnedCard[j].length >= max) {
                max = maxTurnedCard[j].length;
            }
        }
        //solved by #nvm
        if (this.listPlayerNode[this.myIndex].player.turnedCardList.length >= 3 || max > 3) {
            //trước tiên cứ kích hoạt nút hạ bài đã, đã hạ thì không có bốc lại nhé
            this.configButtonBocDanh(message);
            if (this.bocBtn.active == true) {
                //để bốc bài sau hạ hợp lý hơn
                this.haBaiBtn.active = false;
                this.isHaBai = 0;
            } else {
                //load check phom list
                this.haPhomList = PhomLogic.findHaPhomCard(this.listPlayerNode[this.myIndex].player.takenCardList, this.listPlayerNode[this.myIndex].player.cardOwnerList, 0);
                //nếu bốc bài rồi thì nên cho hạ bài nhưng phải kiểm tra đã hạ phỏm trước đấy chưa đã, làm thế nào?
                //danh phai gui phom nay len thoi, biet sao gio hix
                //nvm step 1 check phom valid or not
                this.checkHaPhomDisconnect = true;
                //custom gửi phỏm này lên đã
                if (this.haPhomList) {
                    this.myPhomCard = CardUtils.buildPhom(this.haPhomList);
                    if (this.myPhomCard) {
                        //Tự động gửi phỏm lên nếu có phỏm
                        this.uType = 0;
                        this.uCard = 0;
                        var send = PhomSend.haPhomRequest(this.tableId, this.myPhomCard, 0, 0);
                        Linker.Socket.send(send);
                    } else {
                        //Phỏm đã được hạ rồi nên không cần hiện message
                        this.checkHaPhomDisconnect = false;
                    }
                } else {
                    //Kiểm tra móm
                    cc.log("#PhomReconnect: Kiểm tra móm sau ...");
                    this.checkHaPhomDisconnect = false;
                }
                this.haBaiBtn.active = false;
                //hàm tự động hạ bài khi tìm thấy phỏm và nếu lỗi(trường hợp phỏm đã được hạ thì không cần thiết show message lên)
                this.isHaBai = 0;
            }
        } else {
            this.haBaiBtn.active = false;
            this.isHaBai = 0;
        }
    },
    checkTurnCard() {
        var maxIndex = -1;
        var minIndex = -1;
        var max = 0;
        var min = 10;
        for (let i = 0; i < this.listPlayerNode.length; i++) {
            if (this.listPlayerNode[i].player.turnedCardList.length > max && this.listPlayerNode[i].player.state == 2) {
                max = this.listPlayerNode[i].player.turnedCardList.length;
                maxIndex = i;
            }
            if (this.listPlayerNode[i].player.turnedCardList.length < min && this.listPlayerNode[i].player.state == 2) {
                min = this.listPlayerNode[i].player.turnedCardList.length;
                minIndex = i;
            }
        }
        if (minIndex >= 0 && maxIndex >= 0 && minIndex !== maxIndex && max - min >= 2) {
            cc.log("checkTurnCard");
            var moveCard = this.listPlayerNode[maxIndex].player.turnedCardList[0];
            this.listPlayerNode[maxIndex].player.turnedCardList.splice(0, 1);
            this.listPlayerNode[minIndex].player.turnedCardList.splice(0, 0, moveCard);
            this.listPlayerNode[maxIndex].addTurnedCardList();
            this.listPlayerNode[minIndex].addTurnedCardList();
        }
    },
    onTurnCardRespone(message) {
        //this.checkTurnCard();
        //:__: Tranh loi truong hop an 2 quan bai lien tiep nhung co lien quan den nhau do chua reset.
        this.playSound("danhbai");

        if (this.isCanEat && this.anCardIndex) {
            this.anBaiBtn.active = false;
            this.listPlayerNode[this.myEatIndex].turnedCardList.children[this.anCardIndex].getComponent(PhomCard).setTakenCard(false);
            this.isCanEat = false;
            this.anCard = null;
            this.anCardIndex = -1;
        }
        //:__:EOF Tranh loi truong hop an 2 quan bai lien tiep nhung co lien quan den nhau do chua reset.
        if (message.status == 1) {
            this.isHaBai = 0;
            this.isGuiBai = false;
            this.nextTurnId = message.nextTurnId;
            var isMom = false;
            // Chinh minh danh bai, danh xong server tra lai de cap nhat
            if (this.currentTurnId == this.myUserId) {
                var currentPlayerIndex = this.findCurrentPlayer(this.currentTurnId);
                var turnCardIndex = PhomLogic.findCard(message.card, this.listPlayerNode[this.myIndex].player.cardOwnerList);
                //cc.log(turnCardIndex);
                this.listPlayerNode[this.myIndex].player.turnedCardList.push(message.card);
                this.listPlayerNode[this.myIndex].player.cardOwnerList.splice(turnCardIndex, 1);
                // this.listPlayerNode[currentPlayerIndex].setPlayer(this.listPlayer[currentPlayerIndex]);
                this.listPlayerNode[this.myIndex].removeOwnerCard(message.card);
                this.listPlayerNode[this.myIndex].addTurnedCard(message.card);
                this.myTurnCard = null;
                this.guiUBtn.active = false;
                this.newFirstTurn = false; // ko còn là turn đánh đầu nữa
            } else {
                var currentPlayerIndex = this.findCurrentPlayer(this.currentTurnId);
                if (currentPlayerIndex < 0 || !this.listPlayerNode[currentPlayerIndex]) {
                    return;
                }
                this.listPlayerNode[currentPlayerIndex].player.turnedCardList.push(message.card);
                // this.listPlayerNode[currentPlayerIndex].setPlayer(this.listPlayer[currentPlayerIndex]);
                if (currentPlayerIndex == this.myEatIndex) {
                    cc.log('Dang check an');
                    // check U first turn --> in-case: Get perfect poker but not the 1st turn player
                    if (this.newFirstTurn) {
                        this.checkUFirstTurn();
                    }
                    cc.log("ISCAN_EAT", this.isCanEat);
                    if (!this.isCanEat) {
                        if (PhomLogic.checkEatCard(message.card, this.listPlayerNode[this.myIndex].player.cardOwnerList, this.listPlayerNode[this.myIndex].player.takenCardList, this.sortType)) {
                            // this.listPlayerNode[currentPlayerIndex].addTurnedCard(message.card, true);
                            PhomEffect.otherTurnCardEffect(this.listPlayerNode[currentPlayerIndex], message.card, true);
                            this.anBaiBtn.active = true;
                            this.anCard = message.card;
                            this.isCanEat = true;
                            this.anCardIndex = PhomLogic.findCard(message.card, this.listPlayerNode[currentPlayerIndex].player.turnedCardList);

                        } else {
                            // this.listPlayerNode[currentPlayerIndex].addTurnedCard(message.card, false);
                            PhomEffect.otherTurnCardEffect(this.listPlayerNode[currentPlayerIndex], message.card, false);
                            this.anBaiBtn.active = false;
                            //cc.tween(itemChiDan).stop();
                        }
                    } else {
                        PhomEffect.otherTurnCardEffect(this.listPlayerNode[currentPlayerIndex], message.card, false);
                    }

                } else {
                    this.listPlayerNode[currentPlayerIndex].addTurnedCard(message.card);
                    this.anBaiBtn.active = false;
                }
                cc.log(this.listPlayerNode[currentPlayerIndex].player.turnedCardList.length);
                if (this.listPlayerNode[currentPlayerIndex].player.turnedCardList.length > 3 && this.listPlayerNode[currentPlayerIndex].player.phomList.length == 0) {
                    this.listPlayerNode[currentPlayerIndex].playMomEffect();
                    isMom = true;
                    this.playSound("mom");
                }
            }

            var currentPlayerIndex = this.findCurrentPlayer(this.currentTurnId);
            this.playSoundDanhCayChot(currentPlayerIndex, isMom);

            //play effect

            // Minh nhan bai xong boc bai.
            this.currentTurnId = this.nextTurnId;
            if (this.currentTurnId == this.myUserId) {
                this.buttonGame.active = true;
                if (this.listPlayerNode[this.myIndex].player.turnedCardList.length < 4) {
                    this.isHaBai = 0;
                }
                if (this.isHaBai == 1) {
                    this.bocBtn.active = false;
                } else {
                    this.bocBtn.active = true;
                }

                this.bocBaiBtn.active = true;
                this.sortBtn.active = true;
                this.bocBaiBtn.getChildByName('bocCard').active = true;
            } else {
                this.buttonGame.active = true;
                if (this.listPlayer[this.myIndex].state == 0) {
                    this.sortBtn.active = false;
                } else {
                    this.sortBtn.active = true;
                }

                this.bocBtn.active = false;
                this.haBaiBtn.active = false;
                this.anBaiBtn.active = false;
                this.danhBtn.active = false;
                this.bocBaiBtn.getChildByName('bocCard').active = false;
            }
            // this.cardLeft--;
            this.textCardLeft.string = this.cardLeft + "";
            for (var i = 0; i < this.listPlayerNode.length; i++) {
                if (i == this.findCurrentPlayer(this.currentTurnId)) {
                    this.listPlayerNode[i].showTime(true);
                } else {
                    this.listPlayerNode[i].showTime(false);
                }
            }

        } else {
            Linker.showMessage(message.error);
        }
    },
    playSoundDanhCayChot: function (currentPlayerIndex, isMom) {
        //check danh cay chot de play sound
        if (isMom) {
            return;
        }
        var check1 = true; //nguoi dau tien danh cay chot
        var check2 = true; // nguoi cuoi cung danh bai
        for (var i = 0; i < this.listPlayerNode.length; i++) {
            if (this.listPlayerNode[i].player.turnedCardList.length !== 3) {
                check1 = false;
                break;
            }
        }
        for (var i = 0; i < this.listPlayerNode.length; i++) {
            if (this.listPlayerNode[i].player.turnedCardList.length !== 4) {
                check2 = false;
                break;
            }
        }
        if (check1) {
            this.playSound("danhcaychot");
            return;
        }
        if (!check2 && this.listPlayerNode[currentPlayerIndex].player.turnedCardList.length == 4) {
            this.playSound("danhcaychot");
            return;
        }
    },
    requestJoinZone: function () {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_KHOI_TAO_LAI_LOBBY, true);
        customEvent.isLeaveTable = true;
        this.node.dispatchEvent(customEvent);
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
    onLeaveRequest: function (event) {
        if (Linker && Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId) {
            var tableId = Number(Linker.CURRENT_TABLE.tableId);
            if (isNaN(tableId) == false && tableId != 0) {
                Linker.Socket.send(CommonSend.leaveTableRequest(tableId));
            }
        }
    },
    onLeaveTableRespone(message) {
        if (message.status == 1) {
            cc.log("GAME_STATE", this.gameState)
            if (this.myUserId == message.userId) {
                switch (this.gameState) {
                    case 0: {
                        if (message.cancelStatus == 0) {
                            cc.Global.showLoading();
                            this.leaveRoom();
                        }
                        break;
                    }
                    case 1: {
                        if (message.cancelStatus == 1) {
                            Linker.showMessage("Bạn vừa đăng ký rời phòng khi hết ván");
                            this.isLeaveTable = true;
                        } else {
                            if (message.cancelStatus == 2) {
                                this.isLeaveTable = false;
                                Linker.showMessage("Bạn vừa hủy rời phòng khi hết ván");
                            } else {
                                if (message.cancelStatus == 0) {
                                    cc.Global.showLoading();
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

                        if (this.maxCapacity) {
                            this.player0.reset();
                            this.player1.reset();
                            this.player2.reset();
                            this.player3.reset();
                            this.player4.reset();
                            this.player0.show(false);
                            this.checkCapacityShowPlayer();
                        }

                        // if (this.player1.player) {
                        //     if (this.player1.player.userId == message.userId) {
                        //         this.player1.reset();
                        //     }
                        // }
                        // if (this.player2.player) {
                        //     if (this.player2.player.userId == message.userId) {
                        //         this.player2.reset();
                        //     }
                        // }
                        // if (this.player3.player) {
                        //     if (this.player3.player.userId == message.userId) {
                        //         this.player3.reset();
                        //     }
                        // }
                        // if (this.player4.player) {
                        //     if (this.player4.player.userId == message.userId) {
                        //         this.player4.reset();
                        //     }
                        // }
                        // this.player0.reset();
                        // this.player0.show(false);


                        this.listPlayerNode = [];
                        // Linker.showMessage(message.userId + " vừa rời phòng");

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
                            this.startGameBtn.active = true;
                            this.readyGameBtn.active = false;
                            this.bocBaiBtn.active = false;
                        }
                        switch (this.myIndex) {
                            case 0: {
                                switch (this.currentCapacity) {
                                    case 1: {
                                        this.player4.createPlayer(this.listPlayer[0]);
                                        this.player4.showInvite(false);
                                        this.player4.showProfile(true);
                                        this.listPlayerNode = [this.player4];
                                        break;
                                    }
                                    case 2: {

                                        this.player4.createPlayer(this.listPlayer[0]);
                                        this.player2.createPlayer(this.listPlayer[1]);
                                        this.player4.showInvite(false);
                                        this.player4.showProfile(true);
                                        this.player2.showInvite(false);
                                        this.player2.showProfile(true);
                                        this.listPlayerNode = [this.player4, this.player2];

                                        break;
                                    }
                                    case 3: {

                                        this.player4.createPlayer(this.listPlayer[0]);
                                        this.player1.createPlayer(this.listPlayer[1]);
                                        this.player2.createPlayer(this.listPlayer[2]);
                                        this.player4.showInvite(false);
                                        this.player4.showProfile(true);
                                        this.player1.showInvite(false);
                                        this.player1.showProfile(true);
                                        this.player2.showInvite(false);
                                        this.player2.showProfile(true);
                                        this.listPlayerNode = [this.player4, this.player1, this.player2];

                                        break;
                                    }


                                }

                                break;
                            }
                            case 1: {
                                switch (this.currentCapacity) {

                                    case 2: {

                                        this.player4.createPlayer(this.listPlayer[1]);
                                        this.player2.createPlayer(this.listPlayer[0]);
                                        this.player4.showInvite(false);
                                        this.player4.showProfile(true);
                                        this.player2.showInvite(false);
                                        this.player2.showProfile(true);
                                        this.listPlayerNode = [this.player2, this.player4];

                                        break;
                                    }
                                    case 3: {

                                        this.player4.createPlayer(this.listPlayer[1]);
                                        this.player1.createPlayer(this.listPlayer[2]);
                                        this.player2.createPlayer(this.listPlayer[0]);
                                        this.player4.showInvite(false);
                                        this.player4.showProfile(true);
                                        this.player1.showInvite(false);
                                        this.player1.showProfile(true);
                                        this.player2.showInvite(false);
                                        this.player2.showProfile(true);
                                        this.listPlayerNode = [this.player2, this.player4, this.player1];

                                        break;
                                    }


                                }
                                break;
                            }
                            case 2: {
                                switch (this.currentCapacity) {
                                    case 3: {

                                        this.player4.createPlayer(this.listPlayer[2]);
                                        this.player1.createPlayer(this.listPlayer[0]);
                                        this.player2.createPlayer(this.listPlayer[1]);
                                        this.player4.showInvite(false);
                                        this.player4.showProfile(true);
                                        this.player1.showInvite(false);
                                        this.player1.showProfile(true);
                                        this.player2.showInvite(false);
                                        this.player2.showProfile(true);
                                        this.listPlayerNode = [this.player1, this.player2, this.player4];

                                        break;
                                    }
                                }
                            }

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
                        var playerNode = this.listPlayerNode.splice(leveaPlayerIndex, 1)[0];
                        if (playerNode) {
                            playerNode.reset();
                        }

                        break;
                    }
                }
            }
        }
    },
    showPhomGame: function (message) {
        Linker._sceneTag = Constant.TAG.scenes.GAME
        this.node.opacity = 255;
        this.unBlockAllEvent();
        this.lockTableEvent(true);

        this.countDanhBai = 1;
        this.playSound("vaoban");
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
    onCreateTableResponse(message) {
        cc.log("Phom_onCreateTableRespone: ", message);
        cc.Global.hideLoading();
        if (message.status == 1) {
            this.gameState = Number(message.isPlaying);
            this.showPhomGame(message);
            // this.setGameState(message);
            this.isReconnect = false;
            this.resetReconnectRoom();
            this.resetTable();
            this.tableId = message.tableId;
            if (!Linker.CURRENT_TABLE) Linker.CURRENT_TABLE = {};
            Linker.CURRENT_TABLE.tableId = this.tableId;
            this.tableIndex = message.tableIndex;
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.setRoomInfo();
            if (this.maxCapacity) {
                this.player0.reset();
                this.player1.reset();
                this.player2.reset();
                this.player3.reset();
                this.player4.reset();
                this.player0.showProfile(false);
                this.player0.showInvite(false);
                this.player0.showWin(false);
                this.checkCapacityShowPlayer();
            }
            this.currentCapacity = 1;
            this.gameState = Number(message.isPlaying);
            this.player4.showProfile(true);
            this.player4.showInvite(false);
            this.buttonGame.active = true;
            this.startGameBtn.active = true;
            //:__: dang la chu ban thi ko can nut san sang
            this.readyGameBtn.active = false;
            this.player4.createPlayer(message.player);
            // this.player0.createPlayer(message.player);
            this.myIndex = 0;
            this.listPlayer.push(message.player);
            this.listPlayerNode.push(this.player4);
            this.isMaster = true;
        } else {
            if (message.error) {
                cc.Global.showMessage(message.error);
                this.lockTableEvent(false);
                this.clearGame();
            }
        }

    },
    onJoinTableResponse(message) {
        // console.log('*** linker',Linker);
        cc.log("Phom_onJoinTableRespone: ", message);
        cc.Global.hideLoading();
        if (message.status == 1) {

            this.gameState = Number(message.isPlaying);
            this.showPhomGame(message);
            // this.setGameState(message);
            this.isReconnect = false;
            this.resetReconnectRoom();
            this.resetTable();
            this.tableId = message.tableId;
            if (!Linker.CURRENT_TABLE) Linker.CURRENT_TABLE = {};
            Linker.CURRENT_TABLE.tableId = message.tableId;
            this.tableIndex = message.tableIndex;
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.setRoomInfo();
            // this.isAnBai = message.isAn;
            this.isTaiGui = message.isTaiGui;
            this.dutyType = message.dutyType;
            if (this.maxCapacity) {
                this.player0.reset();
                this.player1.reset();
                this.player2.reset();
                this.player3.reset();
                this.player4.reset();
                this.player0.showProfile(false);
                this.player0.showInvite(false);
                this.player0.showWin(false);
                this.checkCapacityShowPlayer();
            }
            this.currentCapacity = message.listPlayer.length;
            this.listPlayer = message.listPlayer;
            this.gameState = Number(message.isPlaying);
            this.currentTurnId = message.currentPlayerId;
            this.cardLeft = message.cardLeft;
            this.textCardLeft.string = this.cardLeft + "";
            this.listPlaying = [];
            // this.listPlayer.forEach((element) => {
            //     if (element.state == 2) {
            //         this.listPlayer.push(element.userId);
            //     }
            // });
            switch (this.gameState) {
                case PhomConstant.GAME_STATE.WAIT: {
                    switch (this.currentCapacity) {
                        case 2: {
                            this.player4.showProfile(true);
                            this.player2.showProfile(true);
                            this.player4.showInvite(false);
                            this.player2.showInvite(false);
                            this.player2.createPlayer(this.listPlayer[0]);
                            this.player4.createPlayer(this.listPlayer[1]);
                            // this.player0.createPlayer(this.listPlayer[1]);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player4);
                            this.myIndex = 1;
                            break
                        }
                        case 3: {
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player4.showProfile(true);
                            this.player1.showInvite(false);
                            this.player2.showInvite(false);
                            this.player4.showInvite(false);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.player4.createPlayer(message.listPlayer[2]);
                            // this.player0.createPlayer(message.listPlayer[2]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player4);
                            this.myIndex = 2;

                            break
                        }
                        case 4: {
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player3.showProfile(true);
                            this.player4.showProfile(true);
                            this.player1.showInvite(false);
                            this.player2.showInvite(false);
                            this.player3.showInvite(false);
                            this.player4.showInvite(false);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.player3.createPlayer(message.listPlayer[2]);
                            this.player4.createPlayer(message.listPlayer[3]);
                            // this.player0.createPlayer(message.listPlayer[3]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player3);
                            this.listPlayerNode.push(this.player4);
                            this.myIndex = 3;

                            break
                        }
                    }
                    this.readyGameBtn.active = true;
                    this.startGameBtn.active = false;
                    this.buttonGame.active = true;
                    this.isMaster = false;
                    break;
                }
                case PhomConstant.GAME_STATE.PLAYING: {
                    this.readyGameBtn.active = false;
                    this.startGameBtn.active = false;
                    this.buttonGame.active = true;
                    this.isMaster = false;
                    switch (this.currentCapacity) {
                        case 3: {
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player4.showProfile(true, true);

                            this.player1.showInvite(false);
                            this.player2.showInvite(false);
                            this.player4.showInvite(false);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.player4.createPlayer(message.listPlayer[2]);
                            // this.player0.createPlayer(message.listPlayer[2]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player4);
                            this.myIndex = 2;

                            break
                        }
                        case 4: {
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player3.showProfile(true);
                            this.player4.showProfile(true, true);

                            this.player1.showInvite(false);
                            this.player2.showInvite(false);
                            this.player3.showInvite(false);
                            this.player4.showInvite(false);
                            this.player1.createPlayer(message.listPlayer[0]);
                            this.player2.createPlayer(message.listPlayer[1]);
                            this.player3.createPlayer(message.listPlayer[2]);
                            this.player4.createPlayer(message.listPlayer[3]);
                            // this.player0.createPlayer(message.listPlayer[3]);
                            this.listPlayerNode.push(this.player1);
                            this.listPlayerNode.push(this.player2);
                            this.listPlayerNode.push(this.player3);
                            this.listPlayerNode.push(this.player4);
                            this.myIndex = 3;

                            break
                        }
                    }
                    this.bocBaiBtn.active = true;
                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                        if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2) {
                            this.listPlayerNode[i].showHiddenCard(true);
                            this.listPlayerNode[i].addTurnedCardList();
                            this.listPlayerNode[i].addTakenCardList();
                            if (this.listPlayerNode[i].player.phomList.length > 0) { //ha phom roi // add by zep
                                this.listPlayerNode[i].showTakenCard(false);
                            }
                        } else {
                            this.listPlayerNode[i].showHiddenCard(false);
                        }
                        this.listPlayerNode[i].addPhomList();
                    }
                    break;
                }
            }
            this.setBlurProfile(parseInt(message.isPlaying));
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
    onFastJoinTable: function (message) {
        if (this && cc.isValid) {
            if (message) {
                if (Number(message.status) == 0) {
                    // cc.error(message);
                    cc.Global.showMessage(message.error);
                    this.lockTableEvent(false);
                    this.requestJoinZone();
                    this.clearGame();
                }
            }
        }
    },
    lockTableEvent: function (enable) {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_ITEM_BAN_YEU_CAU_BLOCK_SU_KIEN_CLICK, true);
        customEvent.enableBlock = enable;
        this.node.dispatchEvent(customEvent);
    },
    onKickPlayerResponse(message) {
        cc.log(Linker.userData.userId);
        if (message.status == 1) {
            cc.log(this.myUserId);
            if (this.myUserId == message.userId) {
                cc.Global.showLoading();
                this.leaveRoom();
            } else {
                var index = this.findCurrentPlayer(message.userId);
                if (this.listPlayerNode[index]) {
                    this.listPlayerNode[index].reset();
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
    onTableSettingChangeResponse(message) {
        if (message.status == 1) {
            this.minMoney = message.minMoney;
            this.isAn = message.isAn;
            this.maxCapacity = Number(message.maxNumPlayer);
            this.isTaiGui = message.isTaiGui;
            if (this.maxCapacity == 2) {
                this.player1.show(false);
                this.player3.show(false);
            } else {
                this.player1.show(true);
                this.player2.show(true);
                this.player3.show(true);
                this.player4.show(true);
            }
            var info = "";
            if (this.isMaster) {

                info = info + (TextContent.BASE_GAME_CHANGE_CONFIG);
                this.startGameBtn.active = true;
            } else {

                info = info + (TextContent.BASE_GAME_MASTER_CHANGE_CONFIG);
                this.listPlayer.forEach(element => {
                    if (element.isMaster != 1) {
                        element.state = 0;
                    }
                });
                this.listPlayerNode.forEach(element => {
                    if (element.player.isMaster != 1) {
                        element.player.state = 0;
                        element.isReady(false);

                    }
                });
                this.readyGameBtn.active = true;
            }
            info = info + (TextContent.BASE_GAME_NUMBER_PLAYERS + this.maxCapacity + " người");

            if (this.isTaiGui == 1) {

                info = info + (TextContent.PHOM_CONTROLLER_RULE_SELECT_U);
            } else {

                info = info + (TextContent.PHOM_CONTROLLER_RULE_UNSELECT_U);
            }
            Linker.showMessage(info);

        } else {
            if (message.error) {
                cc.Global.showMessage(message.error);
            }
        }
    },
    onPlayerReadyResponse(message) {
        cc.error(message);
        if (message.status == 1) {
            this.stopAllGameEffect();
            switch (this.gameState) {

                case 0: {
                    var userId = message.userId;
                    var readyState = message.isReady;
                    var readyPlayerIndex = this.findCurrentPlayer(userId);
                    if (this.listPlayer[readyPlayerIndex] && this.listPlayer[readyPlayerIndex].state != undefined && this.listPlayer[readyPlayerIndex].state != null) {
                        if (readyState == 1) {
                            this.listPlayer[readyPlayerIndex].state = 1;
                        } else {
                            this.listPlayer[readyPlayerIndex].state = 0;
                        }
                        this.listPlayerNode[readyPlayerIndex].createPlayer(this.listPlayer[readyPlayerIndex]);
                        if (readyState == 1 && Linker.userData.userId == userId) {
                            this.readyGameBtn.active = false;
                        }
                    }
                    break;
                }
                case 1: {
                    break;
                }
            }
        } else {
            cc.Global.showMessage(message.error);
            this.leaveTableRequest();
        }
    },
    leaveTableRequest() {
        Linker.Socket.send(CommonSend.leaveTableRequest(this.tableId));
    },
    onMatchStartResponse(message) {
        if (message.status == 1) {

        }
    },
    resetTable() {
        this.isAutoReady = 0;
        this.haList = [];
        this.listHaPhom = [];
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
        this.myIndex = this.findCurrentPlayer(this.myUserId);
        this.turnIndex = 0;
        this.takenIndex = 0;
        this.readyPeople = 0;
        this.gameState = PhomConstant.GAME_STATE.WAIT;
        this.myTurnCard = null;
        this.myPhomCard = null;
        this.isAn = 1;
        this.isTaiGui = 1;
        this.maxCapacity = 4;
        this.isHaBai = 0;
        this.bocBaiBtn.active = false;
        this.sortBtn.active = false;
        this.bocBaiBtn.getChildByName('bocCard').active = false;
        this.checkHaPhomDisconnect = false;
    },
    setRoomInfo() {
        this.textMinBet.string = "Cược: " + Utils.Malicious.moneyWithFormat(this.minMoney, ".");
        this.textTableIndex.string = "Bàn: " + this.tableIndex;
        this.textMatchId.string = "Trận: " + this.tableId;
    },
    setBlurProfile: function (status) {
        //set blur profile neu khong san sang
        var _this = this;
        var isPlaying = true;
        if (!isNaN(status)) {
            switch (status) {
                case 1:
                    isPlaying = true;
                    break;
                default:
                    isPlaying = false;
                    break;
            }
        }
        this.listPlayer.forEach(function (player, index) {
            if (player.state == 0 && isPlaying) {
                var playerNode = _this.getPlayerNodeWithUserId(player.userId);
                playerNode.showProfile(true, true);
            }
        });
    },
    getPlayerNodeWithUserId(playerID) {
        for (var i = 0; i < this.listPlayerNode.length; i++) {
            if (this.listPlayerNode[i].player.userId == playerID) {
                return this.listPlayerNode[i];
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
    findPreviousPlayer(card) {
        var player = null;
        var playerNode = null;

        if (card) {
            for (var i = 0; i < this.listPlayer.length; i++) {
                if (this.listPlayer[i].turnedCardList.length > 0) {
                    if (card.serverValue == this.listPlayer[i].turnedCardList[this.listPlayer[i].turnedCardList.length - 1].serverValue) {
                        player = this.listPlayer[i];
                        break;
                    }
                }
            };
            for (var j = 0; j < this.listPlayerNode.length; j++) {
                if (this.listPlayerNode[j].player.userId == player.userId) {
                    playerNode = this.listPlayerNode[j];
                    break;
                }
            }
        }

        return playerNode;
    },
    findEatIndexPlayer(playerId) {
        var eatIndex = -1;
        // switch (myIndex) {
        //     case 0:
        //         {
        //             switch (this.currentCapacity) {
        //                 case 2:
        //                     {
        //                         eatIndex = 1;
        //                         break
        //                     }
        //                 case 3:
        //                     {
        //                         eatIndex = 2;
        //                         break
        //                     }
        //                 case 4:
        //                     {
        //                         eatIndex = 3;
        //                         break
        //                     }
        //             }
        //             break;
        //         }
        //     case 1:
        //         {
        //             switch (this.currentCapacity) {
        //                 case 2:
        //                     {
        //                         eatIndex = 0;
        //                         break
        //                     }
        //                 case 3:
        //                     {
        //                         eatIndex = 0;
        //                         break
        //                     }
        //                 case 4:
        //                     {
        //                         eatIndex = 0;
        //                         break
        //                     }
        //             }
        //             break;
        //         }
        //     case 2:
        //         {
        //             switch (this.currentCapacity) {
        //                 case 3:
        //                     {
        //                         eatIndex = 1;
        //                         break
        //                     }
        //                 case 4:
        //                     {
        //                         eatIndex = 1;
        //                         break
        //                     }
        //             }
        //             break;
        //         }
        //     case 3:
        //         {
        //             switch (this.currentCapacity) {
        //                 case 4:
        //                     {
        //                         eatIndex = 2;
        //                         break
        //                     }
        //             }
        //             break;
        //         }
        // }
        var eatPlayerId = this.findEatePlayerId(playerId);
        cc.log("EAT_PLAYER_ID", eatPlayerId);
        eatIndex = this.findCurrentPlayer(eatPlayerId);
        return eatIndex;
    },
    findEatePlayerId(playerId) {
        if (playerId) {
            playerId = playerId.toString();
        }
        var playerIndex = this.listPlaying.lastIndexOf(playerId);
        var eatPlayerId = null;
        if (playerIndex != -1) {
            if (playerIndex == 0) {
                eatPlayerId = this.listPlaying[this.listPlaying.length - 1];
            } else {
                eatPlayerId = this.listPlaying[playerIndex - 1];
            }

        }
        return eatPlayerId;
    },
    checkUFirstTurn(cardOwnerList, takenCardList) {
        if (this.currentTurnId !== this.myUserId) return;
        // var list = PhomLogic.findHaPhomCard(this.listPlayerNode[this.myIndex].player.takenCardList, this.listPlayerNode[this.myIndex].player.cardOwnerList, 0);
        // var uData = null;
        // if (list != null && list.length > 0) {
        //     uData = PhomLogic.checkU(list, this.listPlayerNode[this.myIndex].player.cardOwnerList, this.listPlayerNode[this.myIndex].player.phomList, this.listPlayerNode[this.myIndex].player.takenCardList.length);
        // }
        //TrungCode
        if (!cardOwnerList) {
            cardOwnerList = this.listPlayerNode[this.myIndex].player.cardOwnerList;
        }
        if (!takenCardList) {
            takenCardList = this.listPlayerNode[this.myIndex].player.takenCardList;
        }
        var uData = PhomLogic.checkU2(takenCardList, cardOwnerList, this.newFirstTurn);
        cc.log("CHECK_U", uData);
        if (uData != null) {
            this.haPhomList = PhomLogic.findHaPhomCard(takenCardList, cardOwnerList, 0);
            this.uType = uData.uType;
            if (uData.card) {
                this.uCard = uData.card.serverValue;
            } else {
                this.uCard = 0;
            }
            this.myPhomCard = CardUtils.buildPhom(this.haPhomList);
            this.CheckTypeU(uData.uType);
            cc.log("U Card gì gì đó không biết: ", uData);
            this.danhBtn.active = false;
            this.haBaiBtn.active = false;
            this.listPlayerNode[this.myIndex].haPhom(this.haPhomList);
        } else {
            this.guiUBtn.active = false;
        }
    },

    findBiGuiBaiPlayerIndex(phomId) {
        // this.listHaPhom.forEach((element, pos) => {
        //     if (element.getId() == phomId) {
        //         var biGuiPlayerId = element.getPlayerId();
        //         return this.findCurrentPlayer(biGuiPlayerId);
        //     }
        // });
        // return -1;
    },
    findPhomById(phomId, player) {
        // var index = -1;
        // listPhom.forEach((element, pos) => {
        //     cc.log("ID", element.getId(), card,pos);
        //     if (PhomLogic.findCard(card,element.cardList) >=0) {
        //         index =  pos;
        //     }
        // });
        // return index;


    },
    btnChatClick() {
        if (!this.ChatPrivateNode) {
            var chatDialog = cc.instantiate(this.ChatDialog);
            this.phomContainer.addChild(chatDialog);
            chatDialog.active = true;
            this.ChatPrivateNode = chatDialog;
        } else {
            this.ChatPrivateNode.active = true;
        }
        this.ChatPrivateNode.setPosition(0, 0);
    },
    onChat(data) {
        cc.log('messagedata:', data);
        if (data.error) {
            console.log(data.error);
            return;
        }
        if (data.id == Linker.userData.userId) {
            if (this.player4.profileNode.active) {
                this.player4.onChat(data);
            } else this.player0.onChat(data);
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
            id: Linker.userData.userId
        };
        this.onChat(data);

        this.edbChat.string = '';
        XocDiaSend.sendRequest(str);
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
    // update (dt) {},
    onUpdateMoney(response) {
        if (this.listPlayer) {
            if (response.userId == Linker.userData.userId) {
                var index = this.findCurrentPlayer(Linker.userData.userId);
                var playerNode = this.listPlayerNode[index];
                if (playerNode) {
                    // playerNode.moneyPlayer.string = Utils.Number.format(response.userMoney);
                    playerNode.moneyPlayer.string = TQUtils.abbreviate(response.money);
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

    CheckTypeU(uType) {
        this.uBtn.active = false;
        this.guiUBtn.active = false;
        this.uDenBtn.active = false;
        this.uTronBtn.active = false;
        this.uKhanBtn.active = false;
        switch (uType) {
            case 1: {
                this.uBtn.active = true;
                this.haBaiBtn.active = false;
                break;
            }
            case 2: {
                this.uKhanBtn.active = true;
                this.haBaiBtn.active = false;
                break;
            }
            case 3: {
                this.uBtn.active = true;
                this.haBaiBtn.active = false;
                break;
            }
            case 11: {
                this.uDenBtn.active = true;
                this.haBaiBtn.active = false;
                break;
            }
            case 12: {
                this.uBtn.active = true;
                this.haBaiBtn.active = false;
                break;
            }
            default:
                break;
        }
    },

    OnPlayerTimeOut(data) {
        if (this.isHaBai == 1) {
            if (this.currentTurnId == this.myUserId) {
                this.btnHaPhomClick();
            }
        }
    },

    playSound: function (type) {
        switch (type) {
            case "xepbai":
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON.MO_BAI, 1, false, false);
                break;
            case "anbai":
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON.AN_BAI, 1, false, false);
                break;
            case "ancay2":
                var number = Math.floor((Math.random() * 5)) + 1;
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON["AN_CAY_THU_2_" + number], 1, false, false);
                break;
            case "bocbai":
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON.BOC_BAI, 1, false, false);
                break;
            case "mom":
                NewAudioManager.stopAllSoundEffect();
                var number = Math.floor((Math.random() * 3)) + 1;
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON["MOM_" + number], 1, false, false);
                break;
            case "thang":
                NewAudioManager.stopAllSoundEffect();
                var number = Math.floor((Math.random() * 2)) + 1;
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON.THANG, 1, false, false);
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON["NHAT_" + number], 1, false, false);
                break;
            case "thua":
                NewAudioManager.stopAllSoundEffect();
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON.THUA, 1, false, false);
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON.BET, 1, false, false);
                break;
            case "batdau":
                NewAudioManager.stopAllSoundEffect();
                var number = Math.floor((Math.random() * 5)) + 1;
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON["BAT_DAU_" + number], 1, false, false);
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON.CHIA_BAI, 1, false, false);
                break;
            case "danhbai":
                this.countDanhBai = (this.countDanhBai < 7) ? this.countDanhBai + 1 : 1;
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON["DANH_BAI_" + this.countDanhBai], 1, false, false);
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON.DANH_BAI, 1, false, false);
                break;
            case "danhcaychot":
                NewAudioManager.stopAllSoundEffect();
                var number = Math.floor((Math.random() * 4)) + 1;
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON["DANH_CAY_CHOT_" + number], 1, false, false);
                break;
            case "vaoban":
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON.VAO_BAN, 1, false, false);
                break;
            case "anchot":
                var number = Math.floor((Math.random() * 2)) + 1;
                NewAudioManager.SOUND_GAME.PHOM.playAudioClip(NewAudioManager.SOUND_GAME.PHOM.COMMON["AN_CHOT_" + number], 1, false, false);
                break;
            default:
                break;
        }
    },
    checkCapacityShowPlayer() {
        if (Number(this.maxCapacity) == 2) {
            this.player1.show(false);
            this.player3.show(false);
        }
    }
});