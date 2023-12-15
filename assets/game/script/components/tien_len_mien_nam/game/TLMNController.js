// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Linker = require('Linker');
var TLMNPlayer = require('TLMNPlayer');
var TLMNConstant = require('TLMNConstant');
var CommonSend = require('CommonSend');
var TLMNEffect = require('TLMNEffect');
var TLMNLogic2 = require('TLMNLogic2');
var TLMNSend = require('TLMNSend');
var Utils = require('Utils');
var Constant = require('Constant');
var SceneManager = require('SceneManager');
var NodePoolManager = require('NodePoolManager');
var XocDiaSend = require('XocDiaSend');
var CommonParse = require('CommonParse');
var SocketConstant = require('SocketConstant');
var NewAudioManager = require('NewAudioManager');
var BiDaSend = require('BiDaSend');
var TLMNLogic = require('TLMNLogic');
var LobbySend = require('LobbySend');
var Global = require('Global');
var i18n = require('i18n');
var TQUtils = require('TQUtil');
cc.Class({
    extends: cc.Component,
    ctor() {
        this.isSuggest = false;
        this.lastCard = [];
        this.lstSuggest = [];
        this.countDanh = 0;
        this.countBoLuot = 0;
    },
    properties: {
        player0: TLMNPlayer,
        player1: TLMNPlayer,
        player2: TLMNPlayer,
        player3: TLMNPlayer,
        player4: TLMNPlayer,
        buttonGame: cc.Node,
        startGameBtn: cc.Node,
        readyGameBtn: cc.Node,
        textTableIndex: cc.Label,
        textMatchId: cc.Label,
        textMinBet: cc.Label,
        // textCardLeft: cc.Label,
        danhBtn: cc.Node,
        boluotBtn: cc.Node,
        xepBaiButton: cc.Node,
        cardOnTable: cc.Node,
        containerCard: cc.Prefab,
        hang: cc.Node,
        // Chat feature
        DialogContent: cc.Prefab,
        ChatDialog: cc.Prefab,
        nohuGameBaiEffectLayerPrefab: cc.Prefab,
        contentEmojiPage: cc.Node,
        emojiPage: cc.Node,
        itemEmoji: cc.Prefab,
        giftPrefab: [cc.Prefab],
        wififSignalSprite: cc.Sprite,
        wifiSignalImage: [cc.SpriteFrame],
        canhbaoNode: cc.Node,

        cardTierEffectNode: cc.Node,
        blockEventNode: cc.Node,
        tlmnContainer: cc.Node
    },
    blockAllEvent: function () {
        this.blockEventNode.active = true;
    },
    unBlockAllEvent: function () {
        this.blockEventNode.active = false;
    },
    // LIFE-CYCLE CALLBACKS:
    initAudio: function () {
        NewAudioManager.initCommonSoundGame({
            gameName: "TLMN",
            bundleName: Constant.BUNDLE.TLMN.name
        });
    },
    onLoad() {
        this.initAudio();
        this.initializeEmojiPage();
        this.ListGift = [];
        for (let i = 0; i < this.giftPrefab.length; i++) {
            var gift = cc.instantiate(this.giftPrefab[i]);
            gift.active = false;
            this.ListGift.push(gift.getComponent("Gift"));
        }
        this.addCustomEventListener();
        if (!this.reconnectDialog || (this.reconnectDialog && !cc.isValid(this.reconnectDialog))) {
            Utils.Malicious.removeNodeByNameFromParent("DialogLosConnect", cc.find('Canvas'));
            this.reconnectDialog = cc.instantiate(this.DialogContent);
            cc.find('Canvas').addChild(this.reconnectDialog);
        }
        if (this.reconnectDialog) {
            this.reconnectDialog.active = false;
        }
        this.node.on('content-emoji', this.onReceiveEmojiChat, this);
    },


    onDestroy() {
        NewAudioManager.playAudioSource("leaveboard");
        this.removeSocketEvent();
    },
    setGameState: function (message) {
        this.gameState = Number(this.gameState);
        switch (this.gameState) {
            case TLMNConstant.GAME_STATE.WAIT: {
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
            case TLMNConstant.GAME_STATE.PLAYING: {
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
    onEnable: function () {
        this.schedule(this.setWifiStatus);
        var toX = -1 * this.canhbaoNode.parent.width / 2 + this.canhbaoNode.width / 2;
        var returnX = -1 * this.canhbaoNode.parent.width / 2 - this.canhbaoNode.width / 2;
        cc.tween(this.canhbaoNode).to(1, {
            x: toX
        }, {
            easing: "backOut"
        }).start();
    },

    onDisable: function () {
        this.unschedule(this.setWifiStatus);
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
    start: function () {
        var data = this.data;
        if (data) {
            Linker.TLMNController = this;
            this.isReconnect = true;
            this.addSocketEvent();
            this.ChatPrivateNode = null;
            this.cardTierEffect = this.cardTierEffectNode.getComponent("CardTierEffect");
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

    update(dt) { },

    settingBtnClick() {
        // this.listPlayerNode[this.myIndex].playMomEffect();
        var settingDialog = this.tlmnContainer.getChildByName("Setting");
        if (settingDialog) {
            settingDialog.active = true;
        }

    },
    backHandlerBtn: function (event) {
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.backspace) {
            this.backBtn();
        }
    },
    backBtn(event) {
        // if (event) {
        //     event.target.getChildByName("New Sprite").active = true;
        // }
        this.leaveTableRequest();
    },

    tlmnCardTouchEvent(card) {
        if (this.nextTurnId == this.myUserId) {
            if (this.myTurnCard.length > 0) {
                this.isSuggest = true;
            }
            if (!this.isSuggest) {
                var lst = TLMNLogic2.parse_1104_message2(this.player0.cardOnHandList.children);
                var rank = Number(card.rank);
                if (rank == 1) rank = 14;
                else if (rank == 2) rank = 15;
                var value = rank * 4 + (Number(card.type) - 1);
                this.lstSuggest = TLMNLogic2.suggest(lst, this.lastCard, value);
                if (this.lstSuggest.length > 0) {
                    this.myTurnCard = [];
                    var convert_1104 = TLMNLogic2.convert_1104(this.lstSuggest);
                    this.player0.cardOnHandList.children.forEach(node => {
                        var serverValue = Number(node.getComponent("PhomCard").serverValue);
                        if (convert_1104.indexOf(serverValue) < 0) {
                            node.y = 0;
                        } else {
                            node.y = 20;
                            this.myTurnCard.push(node.getComponent("PhomCard").serverValue);
                        }
                    });
                } else {
                    //Linker.showMessage("Không thể tìm ra gợi ý với lá bài này");
                }
                this.isSuggest = true;
            } else {
                var rank = Number(card.rank);
                if (rank == 1) rank = 14;
                else if (rank == 2) rank = 15;
                var value = rank * 4 + (Number(card.type) - 1);
                if (this.lstSuggest.indexOf(value) >= 0) {
                    // hạ hết xuống
                    var convert_1104 = TLMNLogic2.convert_1104(this.lstSuggest);
                    this.lstSuggest = [];
                    this.player0.cardOnHandList.children.forEach(node => {
                        var serverValue = Number(node.getComponent("PhomCard").serverValue);
                        if (convert_1104.indexOf(serverValue) >= 0) {
                            node.y = 0;
                            this.myTurnCard.splice(this.myTurnCard.indexOf(node.getComponent("PhomCard").serverValue), 1);
                        }
                    });
                } else {
                    cc.log("DATA CARD: ", card);
                    if (card.node.y == 20) {
                        card.node.y = 0;
                        this.myTurnCard.splice(this.myTurnCard.indexOf(card.serverValue), 1);
                        cc.log("MY TURN CARD_remove: ", this.myTurnCard);
                    } else if (card.node.y == 0) {
                        this.myTurnCard.push(card.serverValue);
                        card.node.y = 20;
                        cc.log("MY TURN CARD_add: ", this.myTurnCard);
                    }
                }
            }
        } else {
            cc.log("DATA CARD: ", card);
            if (card.node.y == 20) {
                card.node.y = 0;
                this.myTurnCard.splice(this.myTurnCard.indexOf(card.serverValue), 1);
                cc.log("MY TURN CARD_remove: ", this.myTurnCard);
            } else if (card.node.y == 0) {
                this.myTurnCard.push(card.serverValue);
                card.node.y = 20;
                cc.log("MY TURN CARD_add: ", this.myTurnCard);
            }
        }
    },

    readyBtnClick() {
        if (this.tableId) {
            var send = CommonSend.readyGameRequest(this.tableId, 1);
            Linker.Socket.send(send);
        } else {
            cc.error("Không thể sẵn sàng trận đấu vui lòng thử lại....", this.tableId);
        }

    },

    startGameBtnClick() {
        if (this.tableId) {
            var send = CommonSend.startGameRequest(this.tableId, 1);
            Linker.Socket.send(send);
        } else {
            cc.error("Không thể bắt đầu trận đấu vui lòng thử lại....", this.tableId);
        }

    },

    btnDanhClick() {
        if (this.currentTurnId == this.myUserId) {
            if (this.myTurnCard.length > 0) {
                cc.log("my turn card: ", this.myTurnCard);
                var send = TLMNSend.DemLaTurnRequest(5, this.tableId, this.myTurnCard);
                Linker.Socket.send(send);
            } else {
                Linker.showMessage(i18n.t("Chưa chọn bài"));
            }
            this.countDanh += 1;
            if (this.countDanh > 10) {
                this.danhBtn.active = false;
                this.countDanh = 0;
            }
        }
    },

    btnBoLuotClick() {
        if (this.currentTurnId == this.myUserId) {
            if (this.myTurnCard) {
                NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.BO_LUOT, 1, false, false);
                var send = TLMNSend.DemLaTurnRequest(5, this.tableId, null);
                Linker.Socket.send(send);
                //
                // this.listPlayerNode[this.findCurrentPlayer(this.currentTurnId)].showTime(false);
            } else {
                Linker.showMessage(i18n.t("Chưa chọn bài"));
            }
            this.countBoLuot += 1;
            if (this.countBoLuot > 10) {
                this.boluotBtn.active = false;
                this.countBoLuot = 0;
            }
        }
    },



    leaveTableRequest() {
        var data = TLMNSend.GuestStand(this.tableId);
        Linker.Socket.send(data);
        Linker.Socket.send(CommonSend.leaveTableRequest(this.tableId));
    },
    moiChoiBtnClick() {
        if (this.gameState == 0) {
            var inviteDialog = this.tlmnContainer.getChildByName("InviteSendDialog");
            if (inviteDialog) {
                inviteDialog.active = true;
            }
        } else {
            Linker.showMessage(i18n.t("Bạn không thể mời khi đang chơi"));
        }
    },

    addCustomEventListener: function () {
        cc.Canvas.instance.node.on(1300, this.onChat, this);
    },

    addSocketEvent() {
        Linker.Event.addEventListener(Constant.CMD.CHAT, this.onChat, this);
        Linker.Event.addEventListener(1104, this.onTurnCardResponse, this);
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
        Linker.Event.addEventListener(SocketConstant.COMMON.UPDATE_CRASH, this.onUpdateMoney, this);
        Linker.Event.addEventListener(12018, this.onMissionResponse, this);
        Linker.Event.addEventListener(1246, this.onFastJoinTable, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(Constant.CMD.CHAT, this.onChat, this);
        Linker.Event.removeEventListener(1104, this.onTurnCardResponse, this);
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
        Linker.Event.removeEventListener(SocketConstant.COMMON.UPDATE_CRASH, this.onUpdateMoney, this);
        Linker.Event.removeEventListener(12018, this.onMissionResponse, this);
        Linker.Event.removeEventListener(1246, this.onFastJoinTable, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);

    },

    showHang(hang, tuquy, doithong3, doithong4, doithong5, doithong6, doi2) {
        hang.active = true;
        for (var i = 0; i < hang.children.length; i++) {
            hang.children[i].active = false;
        }
        if (tuquy) {
            hang.getChildByName('tuquy').active = true;
            this.tmp = hang.getChildByName('tuquy');
        } else if (doithong3) {
            hang.getChildByName('3doithong').active = true;
            this.tmp = hang.getChildByName('3doithong');
        } else if (doithong4) {
            hang.getChildByName('4doithong').active = true;
            this.tmp = hang.getChildByName('4doithong');
        } else if (doithong5) {
            hang.getChildByName('5doithong').active = true;
            this.tmp = hang.getChildByName('5doithong');
        } else if (doithong6) {
            hang.getChildByName('6doithong').active = true;
            this.tmp = hang.getChildByName('6doithong');
        } else if (doi2) {
            hang.getChildByName('doi2').active = true;
            this.tpm = hang.getChildByName("doi2");
        }
        var seq = cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.3, 0.6),
                cc.scaleTo(0.3, 1)
            )
        )
        this.tmp.runAction(seq);

        var hidden = function () {
            for (var j = 0; j < hang.children.length; j++) {
                hang.children[j].active = false;
            }
        }
        this.hang.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(hidden)));
    },
    HaBai: function () {
        this.player0.cardOnHandList.children.forEach(node => {
            node.y = 0;          
        });
        this.myTurnCard = [];
    },
    onTurnCardResponse(message) {
        this.HaBai();
        this.startGameBtn.active = false;
        this.readyGameBtn.active = false;
        var lastCard = TLMNLogic2.parse_1104_message(message);
        cc.log('TLMN_onTurnCardResponse: ', message);
        if (message.status == 0) {
            cc.log("BLLLLLLLLLLLLLLLLLLLLLLL: ", message);
            // this.listPlayerNode[this.findCurrentPlayer(this.myUserId)].showTime(true);
            Linker.showMessage(message.error);
        } else if (message.status == 1) {
            this.countDanh = 0;
            this.countBoLuot = 0;
            this.nextTurnId = message.nextTurnId;
            this.turnId = message.turnId;
            if (message.isNewRound) {
                this.lastCard = [];
                this.cardOnTable.removeAllChildren();
                this.listPlayerNode.forEach(player => {
                    player.showBoLuot(false);
                })
            } else if (!message.isSkip) {
                this.lastCard = lastCard;
            } else if (lastCard.length == 0) {
                lastCard = this.lastCard;
            }
            cc.log("LIST CARD DANH: ", message.card);
            if (message.card && message.isHang) {
                var beFightenPlayerId = message.beFightenPlayerId;
                var fightenPlayerId = message.fightenPlayerId;
                var fightenMoney = message.fightenMoney;
                var beFightenPlayerIndex = this.findCurrentPlayer(beFightenPlayerId);
                var fightenPlayerIndex = this.findCurrentPlayer(fightenPlayerId);
                if (this.listPlayerNode[beFightenPlayerIndex]) {
                    this.listPlayerNode[beFightenPlayerIndex].showMoneyBeFighten(fightenMoney);
                }
                if (this.listPlayerNode[fightenPlayerIndex]) {
                    this.listPlayerNode[fightenPlayerIndex].showMoneyFighten(fightenMoney);
                }

                if (TLMNLogic.checkTuQuy(message.card)) {
                    this.showHang(this.hang, true, false, false, false, false, false);
                } else if (TLMNLogic.check3DoiThong(message.card)) {
                    this.showHang(this.hang, false, true, false, false, false, false);
                } else if (TLMNLogic.check4DoiThong(message.card)) {
                    this.showHang(this.hang, false, false, true, false, false, false);
                } else if (TLMNLogic.check5DoiThong(message.card)) {
                    this.showHang(this.hang, false, false, false, true, false, false);
                } else if (TLMNLogic.check6DoiThong(message.card)) {
                    this.showHang(this.hang, false, false, false, false, true, false);
                } else if (TLMNLogic.checkDoiHeo(message.card)) {
                    this.showHang(this.hang, false, false, false, false, false, true);
                }
            }
            if (this.turnId == this.myUserId) {
                if (this.listPlayerNode[this.myIndex].cardOnHandList) {
                    for (var i = 0; i < this.listPlayerNode[this.myIndex].cardOnHandList.children.length; i++) {
                        var background = this.listPlayerNode[this.myIndex].cardOnHandList.children[i].getChildByName("background");
                        if (background && background.getChildByName("bg_black")) {
                            background.getChildByName("bg_black").active = false;
                        }
                    }
                }
                if (message.card.length == 0 && !message.isNewRound) {
                    this.player0.showBoLuot();
                }
                if (this.listPlayerNode[this.myIndex]) {
                    var turnCardIndex = TLMNLogic.removeOwnerCard(message.card, this.listPlayerNode[this.myIndex].player.cardOwnerList);
                    this.listPlayerNode[this.myIndex].player.turnedCardList.push(message.card);
                    if (message.card.length > 0) {
                        var containerCard = cc.instantiate(this.containerCard);
                        this.listPlayerNode[this.myIndex].addTurnedCardMe(message.card, containerCard, turnCardIndex[0]);
                        this.listPlayerNode[this.myIndex].removeOwnerCard(message.card);
                        this.CheckBaiDanhEffect(message.card);
                        this.playSoundCard(message.card);
                    }
                    this.myTurnCard = [];
                }
            } else {
                var currentPlayerIndex = this.findCurrentPlayer(this.turnId);
                if (this.listPlayerNode[currentPlayerIndex]) {
                    if (message.isSkip && !message.isNewRound) {
                        this.listPlayerNode[currentPlayerIndex].showBoLuot();
                    }
                    this.listPlayerNode[currentPlayerIndex].setTotalCard(Number(this.listPlayerNode[currentPlayerIndex].totalCard.string) - message.card.length);

                    this.listPlayerNode[currentPlayerIndex].player.turnedCardList.push(message.card);
                    var containerCard = cc.instantiate(this.containerCard);
                    if (message.card.length > 0) {
                        TLMNEffect.otherTurnCardEffect(this.listPlayerNode[currentPlayerIndex], message.card, containerCard);
                        this.CheckBaiDanhEffect(message.card);
                        this.playSoundCard(message.card);
                    }
                }
            }

            if (this.nextTurnId == this.myUserId) {
                this.listPlayerNode[this.myIndex].showCardOnHand(true);
                this.danhBtn.active = true;
                this.boluotBtn.active = true;
                // this.xepBaiButton.active = true;
                this.player0.RunTurnEffect();
                // if(message.card.length > 0){
                //     cc.log(this.listPlayerNode[this.myIndex].player.cardOwnerList);
                //     // cc.log("GGGGGGGGGGGGG: ", this.listPlayerNode[this.myIndex].cardOnHandList.children[0].getComponent("PhomCard"));
                //     // cc.log("GOI Y DANH BAI:", TLMNLogic.onCheckTurnSuggestion(message.card, this.listPlayerNode[this.myIndex].player.cardOwnerList));
                //     var cardOnHand = this.listPlayerNode[this.myIndex].cardOnHandList.children;
                //     var type = TLMNLogic.onCheckTurnSuggestion(message.card, this.listPlayerNode[this.myIndex].player.cardOwnerList);
                //     var cardSuggestion = TLMNLogic.onTurnSuggestion(type, message.card, this.listPlayerNode[this.myIndex].player.cardOwnerList);

                //     cc.log("TYPE: ", type);
                //     cc.log("CARD SUGGESTION: ", cardSuggestion);

                //     switch(type){
                //         case 1:{
                //             TLMNLogic.checkOneTurnCard(cardOnHand, cardSuggestion);
                //             break;
                //         }
                //         case 2:{
                //             TLMNLogic.checkDoubleTurnCard(cardOnHand, cardSuggestion, message.card);
                //             break;
                //         }
                //         case 3:{
                //             TLMNLogic.checkThreeTurnCard(cardOnHand, cardSuggestion, message.card);
                //             break;
                //         }
                //         case 8:{
                //             TLMNLogic.checkSanhTurnCard(cardOnHand, cardSuggestion, message.card);
                //             break;
                //         }
                //     }
                // }
                this.isSuggest = false;
                if (this.player0) {
                    var lst = TLMNLogic2.parse_1104_message2(this.player0.cardOnHandList.children);
                    var lstSuggest = TLMNLogic2.checkDanhBai(lst, lastCard);
                    var itemChiDan = this.boluotBtn.getChildByName("item_chidan");
                    if (lstSuggest.length == 0) {
                        itemChiDan.active = true;
                        var rotate = cc.tween().by(1, { eulerAngles: cc.v3(-360, 0, 0) }, { easing: "smooth" });
                        cc.tween(itemChiDan).repeatForever(rotate).start();
                    } else {
                        itemChiDan.active = false;
                        cc.tween(itemChiDan).stop();
                    }
                    var convert_1104 = TLMNLogic2.convert_1104(lstSuggest);
                    TLMNLogic2.checkTurnCard(convert_1104, this.player0.cardOnHandList.children);
                }
            } else {
                var currentPlayerIndex = this.findCurrentPlayer(this.nextTurnId);
                this.listPlayerNode[currentPlayerIndex].RunTurnEffect();
                this.danhBtn.active = false;
                this.boluotBtn.active = false;
                this.boluotBtn.getChildByName("item_chidan").active = false;
            }

            // //play effect
            this.currentTurnId = this.nextTurnId;
            for (var i = 0; i < this.listPlayerNode.length; i++) {
                if (i == this.findCurrentPlayer(this.nextTurnId)) {
                    this.listPlayerNode[i].showTime(true);
                } else {
                    this.listPlayerNode[i].showTime(false);
                }
            }
        }
    },
    onJoinTableResponse(message) {
        cc.log("TLMN_onJoinTableResponse: ", message);
        cc.Global.hideLoading();
        if (message.status == 1) {
            NewAudioManager.playAudioSource("joinboard");
            this.gameState = Number(message.isPlaying);
            this.showTLMNGame(message);
            this.setGameState(message);
            this.isReconnect = false;
            this.resetReconnectRoom();
            this.resetTable();
            this.tableId = message.tableId;
            Linker.CURRENT_TABLE.tableId = this.tableId;
            this.tableIndex = message.tableIndex;
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.setRoomInfo();
            // this.isAnBai = message.isAn;
            // this.isTaiGui = message.isTaiGui;
            // this.dutyType = message.dutyType;
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
            // this.cardLeft = message.cardLeft;
            // this.textCardLeft.string = this.cardLeft + "";
            this.listPlaying = [];
            // this.listPlayer.forEach((element) => {
            //     if (element.state == 2) {
            //         this.listPlayer.push(element.userId);
            //     }
            // });
            switch (this.gameState) {
                case TLMNConstant.GAME_STATE.WAIT: {
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
                            break;
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

                            break;
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

                            break;
                        }
                    }
                    this.readyGameBtn.active = true;
                    this.startGameBtn.active = false;
                    //this.buttonGame.active = true;
                    this.isMaster = false;





                    break;
                }
                case TLMNConstant.GAME_STATE.PLAYING: {
                    this.readyGameBtn.active = false;
                    this.startGameBtn.active = false;
                    //this.buttonGame.active = true;
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

                            break;
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

                            break;
                        }
                    }
                    // this.bocBaiBtn.active = true;
                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                        if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2) {
                            this.listPlayerNode[i].showHiddenCard(true);
                            // this.listPlayerNode[i].addTurnedCardList();
                            // this.listPlayerNode[i].addTakenCardList();
                        } else {
                            this.listPlayerNode[i].showHiddenCard(false);
                        }

                        if (i == this.findCurrentPlayer(message.currentPlayerId)) {
                            this.listPlayerNode[i].showTime(true);

                        } else {
                            this.listPlayerNode[i].showTime(false);

                        }
                        // this.listPlayerNode[i].addPhomList();
                    }
                    break;
                }
            }
            this.setBlurProfile(parseInt(message.isPlaying));
            this.isReconnect = false;
        } else {
            if (message.error) {
                cc.Global.showMessage(message.error);
                this.lockTableEvent(false);
                this.clearGame();
            }
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
    showTLMNGame: function (message) {
        Linker._sceneTag = Constant.TAG.scenes.GAME
        this.node.opacity = 255;
        this.unBlockAllEvent();
        this.lockTableEvent(true);

        NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.CHAO_CA_NHA, 1, false, false);
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
        cc.log("TLMN_onCreateTableRespone: ", message);
        cc.Global.hideLoading();
        if (message.status == 1) {
            this.gameState = Number(message.isPlaying);
            this.showTLMNGame(message);
            this.setGameState(message);
            this.isReconnect = false;
            this.resetReconnectRoom();
            this.resetTable();
            this.tableId = message.tableId;
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
            //this.buttonGame.active = true;
            this.startGameBtn.active = true;
            this.readyGameBtn.active = true;
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
    onPlayerJoinedResponse(message) {
        cc.log("TLMN_onPlayerJoinedResponse: ", message);
        cc.log("GAME STATE: ", this.gameState, message.status);
        cc.Global.hideLoading();
        this.resetReconnectRoom();
        if (message.status == 1) {
            NewAudioManager.playAudioSource("joinboard");
            cc.log("GAME STATE: ", this.gameState);
            switch (this.gameState) {
                case TLMNConstant.GAME_STATE.WAIT: {
                    cc.log("STATE GAME WAIT");
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
                            cc.log("CASE INDEX 0");
                            switch (this.currentCapacity) {
                                case 2: {
                                    cc.log("CASE CURRENTCAPACITY");
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
                case TLMNConstant.GAME_STATE.PLAYING: {

                    if (this.currentTurnId == this.myUserId) {
                        // this.sortBtn.active = true;
                        if (this.listPlayerNode[this.myIndex].player.phomList.length > 0) {
                            if (this.listPlayerNode[this.myIndex].player.turnedCardList.length < 3) {
                                // this.isHaBai = 0;
                                // this.haBaiBtn.active = false;
                            } else {
                                // this.haBaiBtn.active = true;
                            }
                            if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length == 0) {
                                // this.isU = true;
                                // this.guiUBtn.active = true;
                                this.danhBtn.active = false;
                            } else {
                                // this.bocBtn.active = true;
                                // this.danhBtn.active = true;
                            }
                        } else {
                            if (this.listPlayerNode[this.myIndex].player.turnedCardList.length < 3) {
                                // this.isHaBai = 0;
                                // this.haBaiBtn.active = false;
                            } else {
                                // this.haBaiBtn.active = true;
                            }
                            if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length == 10) {
                                this.danhBtn.active = true;
                                // this.bocBaiBtn.action = false;
                            } else {
                                if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length == 9) {
                                    this.danhBtn.active = false;
                                    // this.bocBaiBtn.action = true;
                                }
                            }
                        }
                    } else {

                        // this.sortBtn.active = true;
                        this.danhBtn.active = false;
                        this.boluotBtn.active = false;
                        // this.bocBtn.active = false;
                        // this.anBaiBtn.active = false;
                    }
                    this.readyGameBtn.active = false;
                    this.startGameBtn.active = false;
                    //this.buttonGame.active = true;
                    this.listPlayer.push(message.player);
                    this.currentCapacity = this.listPlayer.length;
                    switch (this.myIndex) {
                        case 0: {
                            switch (this.currentCapacity) {

                                case 3: {
                                    this.setPlayerJoined(2);
                                    break;
                                }
                                case 4: {
                                    this.setPlayerJoined(3);
                                    break;
                                }

                            }

                            break;
                        }
                        case 1: {
                            switch (this.currentCapacity) {
                                case 3: {
                                    this.setPlayerJoined(2);
                                    break;
                                }
                                case 4: {
                                    this.setPlayerJoined(3);
                                    break;
                                }
                            }
                            break;
                        }
                        case 2: {
                            switch (this.currentCapacity) {
                                case 4: {
                                    this.setPlayerJoined(3);
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
    setPlayerJoined (indexPlayer) {
        var checkPlayerList = ["Player1", "Player2", "Player3"];
        for (var i = 0; i < checkPlayerList.length; i++) {
            //check player 3 co nguoi ngoi chua
            var check = false;
            for (var j = 0; j < this.listPlayerNode.length; j++) {
                if (this.listPlayerNode[j].node.name == checkPlayerList[i]) {
                    check = true;
                }
            }
            if (!check) {
                if (checkPlayerList[i] == "Player1") {
                    this.player1.createPlayer(this.listPlayer[indexPlayer]);
                    this.player1.showInvite(false);
                    this.player1.showProfile(true, true);
                    this.listPlayerNode.push(this.player1);
                } else if (checkPlayerList[i] == "Player2") {
                    this.player2.createPlayer(this.listPlayer[indexPlayer]);
                    this.player2.showInvite(false);
                    this.player2.showProfile(true, true);
                    this.listPlayerNode.push(this.player2);
                } else if (checkPlayerList[i] == "Player3") {
                    this.player3.createPlayer(this.listPlayer[indexPlayer]);
                    this.player3.showInvite(false);
                    this.player3.showProfile(true, true);
                    this.listPlayerNode.push(this.player3);
                }
                break;
            }  
        }
    },
    onLeaveTableRespone(message) {
        // console.log("onLeaveTableRespone----");
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
                            Linker.showMessage(i18n.t("Bạn vừa đăng ký rời phòng khi hết ván"));
                            this.isLeaveTable = true;
                        } else {
                            if (message.cancelStatus == 2) {
                                this.isLeaveTable = false;
                                Linker.showMessage(i18n.t("Bạn vừa hủy rời phòng khi hết ván"));
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
                    case TLMNConstant.GAME_STATE.WAIT: {


                        this.listPlayerNode = [];
                        // Linker.showMessage(message.userId + " vừa rời phòng");
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
                            this.startGameBtn.active = true;
                            this.readyGameBtn.active = false;
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
                    case TLMNConstant.GAME_STATE.PLAYING: {
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
        } else {

        }
    },
    onTableSettingChangeResponse(message) {
        cc.log("TLMN_onTableSettingChangeResponse: ", message);
        if (message.status == 1) {
            this.minMoney = message.minMoney;
            this.maxCapacity = Number(message.capacity);
            this.hiddenCard = Number(message.isHiddenCard);
            this.isHiddenCard = Number(message.isHiddenCard);
            if (this.maxCapacity == 2) {
                this.player1.show(false);
                this.player3.show(false);
            } else {
                this.player1.show(true);
                this.player2.show(true);
                this.player3.show(true);
                this.player4.show(true);
            }

            for (var i = 0; i < this.listPlayerNode.length; i++) {
                if (this.hiddenCard == 0) {
                    this.listPlayerNode[i].showNodeTotalCard(false);
                } else {
                    this.listPlayerNode[i].showNodeTotalCard(true);
                }
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
                        element.isReady(false);

                    }
                });
                this.readyGameBtn.active = true;
            }
            info = info + (i18n.t(TextContent.BASE_GAME_NUMBER_PLAYERS) + this.maxCapacity + i18n.t(" người"));

            Linker.showMessage(info);

        } else {
            var isAutoReady;
            var isHiddenCard;
            if (this.isAutoReady == 0) isAutoReady = false;
            if (this.isHiddenCard == 0) isHiddenCard = false;
            Linker.SettingDialogTLMN.setToggleSetting(isAutoReady, isHiddenCard);
            if (message.error) {
                cc.Global.showMessage(message.error);
            }
        }
    },
    onKickPlayerResponse(message) {
        cc.log(Linker.userData.userId);
        if (message.status == 1) {
            cc.log(this.myUserId);
            if (this.myUserId == message.userId) {
                //Utils.Director.loadScene('LobbyScene');
                SceneManager.loadScene('LobbyScene', function () { });

                // SceneManager.loadScene('LobbyScene', function () {
                //     var scene = cc.director.getScene();
                //     var canvas = scene.getChildByName("Canvas");
                //     canvas.opacity = 0;
                //     cc.tween(canvas)
                //         .to(0.5, { opacity: 255 })
                //         .start()
                // });
                Linker.message = "Bạn bị mời ra ngoài";
            } else {
                var index = this.findCurrentPlayer(message.userId);
                if (this.listPlayerNode[index]) {
                    this.listPlayerNode[index].reset();
                    this.listPlayer.splice(index, 1);
                    this.listPlayerNode.splice(index, 1);
                }
                Linker.showMessage(message.userName + i18n.t(" bị mời ra ngoài"));
            }
            var dialog = this.node.getChildByName("PopupUserInfo");
            if (dialog) {
                dialog.active = false;
            }
        } else {

        }
    },
    onGameEndResponse(message) {
        cc.log("TLMN_onGameEndResponse: ", message);
        if (message.status == 1) {

            var effect = cc.callFunc(this.endGameEffect, this, message);
            var logic = cc.callFunc(this.endGameLogic, this, message);
            var action = cc.sequence(effect, cc.delayTime(5), logic);
            this.node.runAction(action);
        } else {

        }
    },
    endGameEffect(target, message) {
        var winPlayer = this.findCurrentPlayer(message.winPlayerId);
        var winType = message.winType;
        cc.log("WIN TYPE: " + winType);
        var self = this;

        var containerCard = cc.instantiate(this.containerCard);
        if (message.turnedCardList && message.turnedCardList.length > 0) {
            if (message.winPlayerId == this.myUserId) {
                var turnCardIndex = TLMNLogic.removeOwnerCard(message.turnedCardList, this.listPlayerNode[this.myIndex].player.cardOwnerList);
                this.listPlayerNode[this.myIndex].addTurnedCardMe(message.turnedCardList, containerCard, turnCardIndex[0]);
                NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.THANG, 1, false, false);
            } else {
                TLMNEffect.otherTurnCardEffect(this.listPlayerNode[winPlayer], message.turnedCardList, containerCard);
                NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.THUA, 1, false, false);
            }
        }


        this.danhBtn.active = false;
        this.boluotBtn.active = false;
        this.startGameBtn.active = false;
        this.readyGameBtn.active = false;
        this.gameState = 0;
        var playerWin = null;

        // message.playerList.forEach((element, pos) =>
        for (var i = 0; i < message.playerList.length; i++) {
            var element = message.playerList[i];
            var index = this.findCurrentPlayer(element.userId);
            var player = this.listPlayerNode[index];
            if (index < 0 || !player) {
                return;
            }
            cc.log("TEST PLAYER: ", player);
            // player.moneyPlayer.string = Utils.Number.abbreviate(element.cash);;
            player.showHiddenCard(false);
            // if (winType == 0) {
            cc.log("TEST WIN TYPE NORMAL");
            if (message.winPlayerId == element.userId) {
                player.playWinEffect(player, element.winType, element.resultMoney);
                playerWin = element;
            } else {
                cc.log("PLAYER THUA");
                if (element.cardList.length == 13) {
                    this.listPlayerNode[index].showEffectCong(element.resultMoney);
                } else {
                    player.playLoseEffect(player, element.winType, element.resultMoney);
                }
            }

            // } 

            if (element.userId == this.myUserId) {
                // Linker.userData.userMoney = element.cash;
            }
            this.listPlayerNode[index].player.cardList = element.cardList;
            this.listPlayerNode[index].setPlayer(this.listPlayer[index]);
            this.listPlayerNode[index].showListCardEnd();

            for (var k = 0; k < this.listPlayerNode.length; k++) {
                this.listPlayerNode[k].resetTotalCard();
            }

        }
        this.setEffectLevelUp(message);
        this.EffectWinType(winType, playerWin.cardList);
    },
    setEffectLevelUp(message) {
        var players = message.playerList;
        for (var i = 0; i < players.length; i++) {
            if (Number(players[i].level) > Number(Linker.userData.userLevel) && Linker.userData.userId == players[i].userId && Number(players[i].levelUpMoney) > 0) {
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
    onLeaveRequest: function (event) {
        if (Linker && Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId) {
            var tableId = Number(Linker.CURRENT_TABLE.tableId);
            if (isNaN(tableId) == false && tableId != 0) {
                Linker.Socket.send(CommonSend.leaveTableRequest(tableId));
            }
        }
    },
    requestJoinZone: function () {
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_KHOI_TAO_LAI_LOBBY, true);
        customEvent.isLeaveTable = true;
        this.node.dispatchEvent(customEvent);
    },
    leaveRoom: function (isBankGroup) {
        Linker.HomeManager.hideGamePlay();
        Linker.requestQuickPlayGame = false;
        isBankGroup = isBankGroup ? true : false;
        this.isRunningEndGame = false;
        this.isEndGame = false;
        this.gameState = TLMNConstant.GAME_STATE.WAIT;
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
        cc.log("TEST END GAME LOGIC", message);
        if (this.isLeaveTable) {
            this.leaveRoom();
        } else {
            this.danhBtn.active = false;
            this.boluotBtn.active = false;
            this.xepBaiButton.active = false;
            //this.gameState = 0;
            this.myTurnCard = [];

            if (message.newMasterId != 0) {
                for (var i = 0; i < this.listPlayer.length; i++) {
                    if (this.listPlayer[i]) {
                        if (this.listPlayer[i].userId == message.newMasterId) {
                            this.listPlayer[i].isMaster = 1;
                            this.listPlayerNode[i].player.isMaster = 1;
                        } else {
                            this.listPlayer[i].isMaster = 0;
                            this.listPlayerNode[i].player.isMaster = 0;
                        }
                    }
                }

                if (this.myUserId == message.newMasterId) {
                    this.isMaster = true;
                    this.startGameBtn.active = true;
                    this.readyGameBtn.active = false;
                } else {
                    this.startGameBtn.active = false;
                    this.readyGameBtn.active = true;
                }
            }

            if (message.playerList.length > 0) {
                message.playerList.forEach((element) => {
                    var index = this.findCurrentPlayer(element.userId);
                    var player = this.listPlayer[index];
                    if (player) {

                        // cc.log("MONEY END GAME: ", player.userMoney, element.resultMoney);
                        // cc.log("MONEY START GAME: ", player.userMoney - element.resultMoney);
                        player.userMoney = Number(player.userMoney) + Number(element.resultMoney) + (Number(element.levelUpMoney) > 0 ? Number(element.levelUpMoney) : 0);
                        cc.log("GAME END MONEY PLAYER: ", player.userMoney);
                        if (player.userMoney <= 0 || Number(element.isOut) == 1 || Number(element.isBankrupt) == 1) {
                            this.listPlayer.splice(index, 1);
                            this.listPlayerNode.splice(index, 1);
                            if (Number(player.userId) == Number(Linker.userData.userId)) {
                                // Check nguoi choi do la chinh minh thi roi khoi ban.
                                if (player.userMoney <= 0 || Number(element.isBankrupt == 1)) {
                                    Linker.message = "Bạn bị thoát do không đủ tiền chơi.";
                                }
                                this.leaveTableRequest();
                            }
                        }
                    }
                });
            }

            if (message.playerList.length > 0) {
                message.playerList.forEach((element) => {
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

            // if(message.playerList.length>0){
            //     message.playerList.forEach((element)=>{
            //         var index = this.findCurrentPlayer(element.userId);
            //         var player = this.listPlayer[index];
            //         if(player){
            //             if(player.is){

            //             }
            //         }
            //     });
            // }

            this.myIndex = this.findCurrentPlayer(this.myUserId);
            this.currentCapacity = this.listPlayer.length;
            if (this.isMaster) {
                this.startGameBtn.active = true;
                this.readyGameBtn.active = false;
            } else {
                this.readyGameBtn.active = true;
                this.startGameBtn.active = false;
            }


            // for (var i = 0; i < this.listPlayer.length; i++){
            //     if ( this.listPlayer[i] !== undefined) {
            //         if (this.listPlayer[i].userId == Linker.userData.userId) {
            //             if (this.listPlayer[i].isMaster == 1) {
            //                 this.isMaster = true;
            //                 this.startGameBtn.active = true;
            //                 this.readyGameBtn.active = false;
            //                 break;
            //             }
            //         }
            //     }
            // }



            for (var i = 0; i < this.listPlayer.length; i++) {
                if (this.listPlayer[i] != undefined) {
                    // if(this.listPlayer[i].isMaster == 1){
                    //     this.listPlayer[i].state = 1;
                    //     this.listPlayerNode[i].player.state = 1;
                    // } else {
                    //     this.listPlayer[i].state = 0;
                    //     this.listPlayerNode[i].player.state = 0;
                    // }
                    if (this.listPlayer[i].isMaster == 1) {
                        this.listPlayer[i].state = 1;
                        if (this.listPlayerNode[i] && Utils.Type.isObject(this.listPlayerNode[i].player)) {
                            this.listPlayerNode[i].player.state = 1;
                        }

                    } else {
                        if (!Utils.Type.isString(this.listPlayer[i])) {
                            this.listPlayer[i].state = 0;
                            //if(this.listPlayerNode[i].player != undefined){
                            if (this.listPlayerNode[i] && Utils.Type.isObject(this.listPlayerNode[i].player)) {
                                this.listPlayerNode[i].player.state = 0;
                            }
                        }
                    }

                    this.listPlayer[i].turnedCardList = [];
                    this.listPlayer[i].cardOwnerList = [];

                    cc.log("THIS PLAYER NODE: ", this.listPlayerNode);
                    if (this.listPlayerNode[i]) {
                        this.listPlayerNode[i].player.turnedCardList = [];
                        this.listPlayerNode[i].player.cardOwnerList = [];
                        this.listPlayerNode[i].showTien(false);
                    }
                }
            }
            if (this.isMaster) {
                // this.listPlayer[this.myIndex].state = 1;
                if (this.listPlayer[this.myIndex] != undefined) {
                    this.listPlayer[this.myIndex].state = 1;
                }
            }

            this.cardOnTable.removeAllChildren();

            this.myIndex = this.findCurrentPlayer(this.myUserId);
            switch (this.gameState) {
                case TLMNConstant.GAME_STATE.WAIT: {
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
                    }
                    if (this.isAutoReady == 1) {
                        this.readyBtnClick();
                    }

                    break;
                }
                case TLMNConstant.GAME_STATE.PLAYING: {

                    break;
                }
            }
            //xu ly khi co nguoi no hu
            // if (message.idUserAnHu && message.moneyAnHu > 0) {
            //     var indexUserNoHu = this.findCurrentPlayer(message.idUserAnHu);
            //     if (indexUserNoHu >= 0) {
            //         var player = this.listPlayer[indexUserNoHu];
            //         // Linker.showMessage("Chúc mừng người chơi "+player.viewName+" Nổ Nũ TLMN với số tiền "+Utils.Number.format(message.moneyAnHu));
            //         var nohuEffect = cc.find("Canvas/NoHuGameBaiEffectLayer");
            //         if (!nohuEffect) {
            //             nohuEffect = cc.instantiate(this.nohuGameBaiEffectLayerPrefab);
            //             nohuEffect.position = cc.v2(0, 0);
            //             nohuEffect.zIndex = cc.macro.MAX_ZINDEX - 1;
            //             cc.find("Canvas").addChild(nohuEffect);
            //         }
            //         nohuEffect.active = false;
            //         var nohueffects = nohuEffect.getComponent("NoHuGameBaiEffectLayer");
            //         nohueffects.setUserName(player.viewName);
            //         nohueffects.setMoneyBonus(message.moneyAnHu);
            //         nohueffects.runAnimation();
            //     }
            // }
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
    onPlayerReadyResponse: function (message) {
        cc.error(message);
        if (message.status == 1) {
            cc.log("TLMN_onPlayerReadyResponse: ", message);
            cc.log("userID: ", message.userId);
            cc.log("myUserId: ", this.myUserId);
            this.stopAllGameEffect();
            switch (this.gameState) {
                case 0: {
                    var userId = message.userId;
                    var readyState = message.isReady;
                    var readyPlayerIndex = this.findCurrentPlayer(userId);
                    if (this.listPlayerNode[readyPlayerIndex]) {
                        if (readyState == 1) {
                            cc.log(this.listPlayer[readyPlayerIndex]);
                            this.listPlayer[readyPlayerIndex].state = 1;
                        } else {
                            this.listPlayer[readyPlayerIndex].state = 0;
                        }
                        this.listPlayerNode[readyPlayerIndex].createPlayer(this.listPlayer[readyPlayerIndex]);
                        if (readyState == 1 && userId == this.myUserId) {
                            this.readyGameBtn.active = false;
                        }
                    }
                    break
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
    onMatchStartResponse(message) {
        if (message.status == 1) {
            NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.CHIA_BAI, 1, false, false);

            var toX = -1 * this.canhbaoNode.parent.width / 2 + this.canhbaoNode.width / 2;
            var returnX = -1 * this.canhbaoNode.parent.width / 2 - this.canhbaoNode.width / 2;
            this.boluotBtn.getChildByName("item_chidan").active = false;
            cc.tween(this.canhbaoNode).to(1, {
                x: toX
            }, {
                easing: "backOut"
            }).delay(2).to(1, {
                x: returnX
            }, {
                easing: "backIn"
            }).start();
        }
    },

    onReconnectionResponse(message) {
        cc.log("TLMN_onReconnectionResponse: ", message);
        cc.Global.hideLoading();
        if (message.status == 1) {
            this.isReconnect = true;
            this.showTLMNGame(message);
            this.setGameState(message);

            NewAudioManager.playAudioSource("joinboard");
            this.resetTable();
            // this.isCanEat = false;
            this.tableId = message.tableId;
            if (!Linker.CURRENT_TABLE) Linker.CURRENT_TABLE = {};
            Linker.CURRENT_TABLE.tableId = this.tableId;
            this.tableIndex = message.tableIndex;
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.dutyType = message.dutyType;
            this.setRoomInfo();
            if (this.maxCapacity) {
                this.player0.reset();
                this.player1.reset();
                this.player2.reset();
                this.player3.reset();
                this.player4.reset();
                this.player4.show(false);
                this.checkCapacityShowPlayer();
            }
            this.currentCapacity = message.listPlayer.length;
            this.listPlayer = message.listPlayer;
            this.gameState = Number(message.isPlaying);
            cc.log("TEST11: ", this.myUserId);
            this.myIndex = this.findCurrentPlayer(this.myUserId);
            // this.cardLeft = message.cardLeft;
            // this.textCardLeft.string = this.cardLeft + "";
            this.currentTurnId = message.currentPlayerId;
            this.listPlaying = [];
            // this.listPlayer.forEach((element) => {
            //     if (element.state == 2|| element.isMaster == 1) {
            //         this.listPlaying.push(element.userId);
            //     }
            // });

            cc.log("TEST1: ", this.listPlayer[this.myIndex], this.myIndex);
            if (this.listPlayer[this.myIndex].isMaster == 1) {
                this.isMaster = true;
            } else {
                this.isMaster = false;
            }

            switch (this.gameState) {
                case TLMNConstant.GAME_STATE.WAIT: {
                    break;
                }
                case TLMNConstant.GAME_STATE.PLAYING: {
                    this.readyGameBtn.active = false;
                    this.startGameBtn.active = false;
                    this.buttonGame.active = true;
                    // this.isMaster = false;
                    switch (this.myIndex) {
                        case 0: {
                            switch (this.currentCapacity) {
                                case 2: {

                                    this.player0.createPlayer(this.listPlayer[0]);
                                    this.player2.createPlayer(this.listPlayer[1]);
                                    this.player0.showInvite(false);
                                    this.player0.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player0, this.player2];

                                    break;
                                }
                                case 3: {

                                    this.player0.createPlayer(this.listPlayer[0]);
                                    this.player1.createPlayer(this.listPlayer[1]);
                                    this.player2.createPlayer(this.listPlayer[2]);
                                    this.player0.showInvite(false);
                                    this.player0.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
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
                                    this.player0.showInvite(false);
                                    this.player0.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player2, this.player0];

                                    break;
                                }
                                case 3: {

                                    this.player0.createPlayer(this.listPlayer[1]);
                                    this.player1.createPlayer(this.listPlayer[2]);
                                    this.player2.createPlayer(this.listPlayer[0]);
                                    this.player0.showInvite(false);
                                    this.player0.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player2, this.player0, this.player1];

                                    break;
                                }
                                case 4: {

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
                                    this.player0.showInvite(false);
                                    this.player0.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.listPlayerNode = [this.player1, this.player2, this.player0];
                                    break;
                                }
                                case 4: {

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
                                    this.player0.showInvite(false);
                                    this.player0.showProfile(true);
                                    this.player1.showInvite(false);
                                    this.player1.showProfile(true);
                                    this.player2.showInvite(false);
                                    this.player2.showProfile(true);
                                    this.player3.showInvite(false);
                                    this.player3.showProfile(true);
                                    this.listPlayerNode = [this.player1, this.player2, this.player3, this.player0];

                                    break;
                                }
                            }
                            break;
                        }
                    }
                    this.setBlurProfile(parseInt(message.isPlaying));
                    // // this.bocBaiBtn.active = true;
                    this.listPlayerNode[this.myIndex].player.cardOwnerList = message.selfCardList;
                    // if (message.selfTurnedList.length > 0) {
                    //     for (var i = 0; i < message.selfTurnedList.length; i++) {
                    //         this.listPlayerNode[this.myIndex].player.turnedCardList.push(message.selfTurnedList[i]);
                    //     }
                    // }
                    // // cc.log(this.listPlayer[this.myIndex].turnedCardList);
                    // this.listPlayerNode[this.myIndex].setPlayer(this.listPlayer[this.myIndex]);
                    this.listPlayerNode[this.myIndex].addCardPlayerOwner();
                    // this.listPlayerNode[this.myIndex].addTurnedCardList();

                    if (message.lastTurnedCardList) {
                        this.lastTurnedCardList = message.lastTurnedCardList;
                        var containerCard = cc.instantiate(this.containerCard);
                        this.listPlayerNode[0].addLastTurnCard(this.lastTurnedCardList, containerCard, false, false, false);
                    }

                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                        if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2 && Number(this.listPlayerNode[i].player.isObserver) == 0) {
                            this.listPlayerNode[i].showHiddenCard(true);
                            // this.listPlayerNode[i].addTurnedCardList();
                            // this.listPlayerNode[i].addTakenCardList();

                        } else {
                            this.listPlayerNode[i].showHiddenCard(false);
                        }
                        if (Number(this.listPlayerNode[i].player.isObserver) == 1) { // neu la nguoi dang xem thi an profile
                            this.listPlayerNode[i].showProfile(true, true);
                        }
                        cc.log("TLMN", this.listPlayerNode[i].player.phomList);

                        if (i == this.findCurrentPlayer(this.currentTurnId)) {
                            this.listPlayerNode[i].showTime(true);
                        } else {
                            this.listPlayerNode[i].showTime(false);
                        }

                    }
                    break;
                }

            }
            // this.player0.showTakenCard(false);
            // this.myEatIndex = this.findEatIndexPlayer(this.myUserId);
            if (this.currentTurnId == this.myUserId) {
                this.buttonGame.active = true;
                this.danhBtn.active = true;
                this.boluotBtn.active = true;
                // this.xepBaiButton.active = true;
            }
            this.isReconnect = false;
            Linker.userData.lastRoom = null;
            Linker.redirectOnReconnect = null;
        } else {

        }
    },
    onGetPockerResponse(message) {
        this.listTotalCardPlayer = [13, 13, 13, 13];
        cc.log("TLMN_onGetPockerResponse: ", message);
        if (message.status == 1) {
            NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.CHIA_BAI, 1, false, false);
            this.gameState = TLMNConstant.GAME_STATE.PLAYING;
            // this.isHaBai = 0;
            this.listPlaying = message.listPlayer;
            if (!this.listPlayer && this.listPlaying) {
                this.listPlayer = this.listPlaying;
            }

            // for (var i = 0; i < this.listPlayer.length; i++) {
            //     if (this.listPlaying.indexOf(this.listPlayer[i].userId) < 0) {
            //         this.listPlayer[i].state = 0;
            //         this.listPlayerNode[i].player.state = 0;
            //     } else {
            //         this.listPlayer[i].state = 2;
            //         this.listPlayerNode[i].player.state = 2;
            //     }
            // }
            for (var i = 0; i < this.listPlayer.length; i++) {
                if (this.listPlayer[i].state == 1) {
                    this.listPlayer[i].state = 2;
                    this.listPlayerNode[i].player.state = 2;
                } else {
                    this.listPlayer[i].state = 0;
                    this.listPlayerNode[i].player.state = 0;
                }

            }
            this.listPlaying.forEach(item => {
                if (item == this.myUserId) {
                    if (this.listPlayer[this.myIndex] && this.listPlayerNode[this.myIndex]) {
                        this.listPlayer[this.myIndex].state = 2;
                        this.listPlayerNode[this.myIndex].player.state = 2;
                    }
                    this.player4.reset();
                    this.player4.show(false);
                    this.player0.show(true);
                    this.player0.reset();
                    this.player0.showInvite(false);
                    this.player0.showProfile(true);
                    // this.player0.showTakenCard(false);
                    this.player0.createPlayer(this.listPlayer[this.myIndex]);
                    this.listPlayerNode[this.myIndex] = this.player0;
                    this.player0.cardOnHandList.active = false;
                    TLMNEffect.chiaBaiEffect(this.player0, 13);

                    this.player0.addCardPlayerOwner2(message.cardOwnerList, this.listPlayer[this.myIndex]);
                }
            });
            // if (this.listPlayer[this.myIndex].state == 2) {
            //     this.player4.reset();
            //     this.player4.show(false);
            //     this.player0.show(true);
            //     this.player0.reset();
            //     this.player0.showInvite(false);
            //     this.player0.showProfile(true);
            //     // this.player0.showTakenCard(false);
            //     this.player0.createPlayer(this.listPlayer[this.myIndex]);
            //     this.listPlayerNode[this.myIndex] = this.player0;
            //     cc.log("MY_USER");
            //     // this.sortBtn.active = true;

            // } else {
            //     cc.log("NULLL", this.listPlayer[this.myIndex].state);
            //     // this.sortBtn.active = false;
            // }

            for (var i = 0; i < this.listPlayerNode.length; i++) {
                this.listPlayerNode[i].isReady(false);
            }

            cc.log("MY_INDEX", this.myIndex);
            // cc.log("PLAYER_LIST", this.listPlayer);
            // cc.log("PLAYER_LIST_NODE", this.listPlayerNode);
            if (message.beginPlayerId) {
                this.currentTurnId = message.beginPlayerId;
            }


            // this.bocBaiBtn.active = true;
            // this.cardLeft = this.listPlaying.length * 4;
            // this.textCardLeft.string = this.cardLeft;
            // if(this.player0.player){
            //     this.player0.player.cardOwnerList = message.cardOwnerList;
            // }
            // this.player0.setPlayer(this.listPlayer[this.myIndex]);
            // this.player0.cardOnHandList.active = false;
            // this.player0.addCardPlayerOwner();

            // if (this.listPlayer[this.myIndex].state == 2) {
            //     TLMNEffect.chiaBaiEffect(this.player0,13);
            // }
            for (var i = 0; i < this.listPlayerNode.length; i++) {
                if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2) {
                    this.listPlayerNode[i].showHiddenCard(true);
                    TLMNEffect.otherPlayerChiaBaiEffect(this.listPlayerNode[i], 13);
                } else {
                    // this.listPlayer[this.myIndex].cardOwnerList = message.cardOwnerList;
                    // this.listPlayerNode[this.myIndex].setPlayer(this.listPlayer[this.myIndex]);
                    // this.listPlayerNode[this.myIndex].addCardPlayerOwner();
                    // this.listPlayerNode[i].showHiddenCard(false);
                    // // this.listCardEffect.position = cc.v2(0, 0);
                    // PhomEffect.chiaBaiEffect(this.listPlayerNode[i], this.listPlayerNode[i].player.cardOwnerList.length);
                }
            }
            // this.myEatIndex = this.findEatIndexPlayer(this.myUserId);
            // cc.log("this.myEatIndex", this.myEatIndex);
            this.setBlurProfile();
            setTimeout(() => {
                if (this.listPlayerNode && this.listPlayerNode.length) {
                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                        if (i == this.findCurrentPlayer(this.currentTurnId)) {
                            this.listPlayerNode[i].showTime(true);
                        } else {
                            this.listPlayerNode[i].showTime(false);
                        }
                    }
                }
            }, 1300);

            if (this.currentTurnId == this.myUserId) {
                this.buttonGame.active = true;
                this.startGameBtn.active = false;
                this.readyGameBtn.active = false;
                this.danhBtn.active = true;
                this.boluotBtn.active = true;
                // this.xepBaiButton.active = true;

            } else {
                this.buttonGame.active = true;
                this.startGameBtn.active = false;
                this.readyGameBtn.active = false;
                this.danhBtn.active = false;
                this.boluotBtn.active = false;
                // this.xepBaiButton.active = true;
            }

            // for(var i=0; i<this.listPlayerNode.length; i++){
            //     cc.log("show total card: ", this.listPlayerNode[i].getChildByName('totalCard'));
            //     // if(this.listPlayerNode[i].getChildByName('totalCard')){
            //     //     cc.log('total lbl: ', this.listPlayerNode[i].getChildByName('totalCard'));
            //     //     this.listPlayerNode[i].showTotalCard(true);
            //     // }
            // }

            cc.log("LIST PLAYING: ", this.listPlaying);
            cc.log("LIST PLAYER NODE: ", this.listPlayerNode);
            for (var i = 0; i < this.listPlayerNode.length; i++) {
                // var currentPlayer = this.findCurrentPlayer(this.listPlaying[i]);
                this.listPlayerNode[i].showTotalCard(true);
                // cc.log("PLAYER: ", this.listPlayerNode[currentPlayer], currentPlayer);
            }

            this.listPlayerNode.forEach(item => {
                item.setTotalCard(13);
            });

        } else {
            Linker.showMessage(message.error);
        }
    },


    resetTable() {
        this.isAutoReady = 0;
        this.isHiddenCard = 0;
        // this.haList = [];
        // this.listHaPhom = [];
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
        this.gameState = TLMNConstant.GAME_STATE.WAIT;
        this.myTurnCard = [];
        // this.myPhomCard = null;
        // this.isAn = 1;
        // this.isTaiGui = 1;
        this.maxCapacity = 4;
        this.listTotalCardPlayer = [13, 13, 13, 13];

    },
    setRoomInfo() {
        //this.textMinBet.string = i18n.t("game_title_bet", { n: Utils.Malicious.moneyWithFormat(this.minMoney, ".") });
        this.textMinBet.string = Utils.Malicious.moneyWithFormat(this.minMoney, ".");
        this.textTableIndex.string = i18n.t("game_title_room", { n: this.tableIndex });
        this.textMatchId.string = i18n.t("game_title_match", { n: this.tableId });
    },
    setBlurProfile: function (status) {
        //set blur profile neu khong san sang
        var _this = this;
        var isPlaying = true;
        if (!isNaN(status)) {
            switch (status) {
                case 1:
                    isPlaying = true;
                    break
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
        if (this.listPlayer) {
            for (var i = 0; i < this.listPlayer.length; i++) {
                if (this.listPlayer[i].userId == playerID) {
                    // this.currentPlayer = this.listPlayer[i];
                    return i;
                }
            }
        }
        return -1;
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
        if (msg.length <= 0) {
            return;
        }

        this.ChatDialog.active = false;

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

        XocDiaSend.sendRequest(str);
    },

    btnChatClick() {
        if (!this.ChatPrivateNode) {
            var chatDialog = cc.instantiate(this.ChatDialog);
            this.tlmnContainer.addChild(chatDialog);
            chatDialog.active = true;
            this.ChatPrivateNode = chatDialog;
        } else {
            this.ChatPrivateNode.active = true;
        }
        this.ChatPrivateNode.setPosition(0, 0);
    },

    btnEmojiClick(event) {
        this.emojiPage.active = !this.emojiPage.active;
    },

    initializeEmojiPage() {
        this.contentEmojiPage.destroyAllChildren();
        var length = cc.Global.EmojiClip.length;
        for (let i = 1; i <= length; ++i) {
            var itemEmoji = cc.instantiate(this.itemEmoji);
            itemEmoji.getComponent("itemEmoji").setClip(i);
            this.contentEmojiPage.addChild(itemEmoji);
        }
    },

    onReceiveEmojiChat(event) {
        var chatString = event.chat;
        if (!!chatString) {
            var str = Constant.CMD.CHAT +
                Constant.SEPERATOR.N4 + this.tableId +
                Constant.SEPERATOR.ELEMENT + chatString +
                Constant.SEPERATOR.ELEMENT + 0;
            var data = {
                status: 1,
                message: chatString,
                username: Linker.userData.displayName,
                id: Linker.userData.userId,
            };
            this.onChat(data);
            cc.Canvas.instance.node.emit(1300, data);
            // var data = BiDaSend.sendChatPrivate(str);
            // Linker.Socket.send(data);
        }
        this.emojiPage.active = false;
    },
    onChat(data) {
        if (data.error) {
            console.log(data.error);
            return;
        }
        if (data.message.includes("13001, ") == false) {
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
        } else {
            var listPlayer = [this.player0, this.player1, this.player2, this.player3, this.player4];
            var splitMsg = data.message.split(",");
            var senderId = Number(splitMsg[1].trim());
            var receiverId = Number(splitMsg[2].trim());
            var idGift = Number(splitMsg[3].trim());
            var sender = null;
            var receiver = null;
            for (let i = 0; i < this.listPlayerNode.length; ++i) {
                if (this.listPlayerNode[i].player && Number(this.listPlayerNode[i].player.userId) == senderId) {
                    sender = this.listPlayerNode[i];
                }
                if (this.listPlayerNode[i].player && Number(this.listPlayerNode[i].player.userId) == receiverId) {
                    receiver = this.listPlayerNode[i];
                }
            }

            if (receiverId == Number(Linker.userData.userId)) {
                if (this.gameState == 0) {
                    receiver = listPlayer[4];
                } else receiver = listPlayer[0];
            }

            sender.SendGiftTo(receiver, idGift);
        }

    },

    kickPlayer() {
        if (!this.KickID) {
            return;
        }
        if (this.listPlayer) {
            var index = this.findCurrentPlayer(this.KickID);
            if (this.listPlayerNode[index]) {
                var mes = CommonSend.kickPlayer(this.tableId, this.KickID);
                Linker.Socket.send(mes);
            }
        }
    },
    onUpdateMoney(response) {
        if (this.listPlayer) {
            if (response.userId == Linker.userData.userId) {
                var index = this.findCurrentPlayer(Linker.userData.userId);
                var playerNode = this.listPlayerNode[index];
                if (playerNode) {
                    // playerNode.moneyPlayer.string = Utils.Number.format(response.money);
                    
                    playerNode.moneyPlayer.string = TQUtils.abbreviate(response.money);
                }

            }
        }

    },

    GetGiftById(idGift) {
        return this.ListGift.find(item => Number(item.ID) == idGift);
    },

    onMissionResponse(message) {
        if (message.error == "0") {
            var data = message.body;
            for (var i = 0; i < data.length; i++) {
                if (data[i].current >= data[i].condition && !data[i].received) {
                    Linker.showMessage("Mission Complete !")
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

    CheckBaiDanhEffect(cardData) {
        if (TLMNLogic.checkTuQuy(cardData)) {
            this.cardTierEffect.Init(cardData);
        } else if (TLMNLogic.check3DoiThong(cardData)) {
            this.cardTierEffect.Init(cardData);
        } else if (TLMNLogic.checkDoiHeo(cardData)) {
            this.cardTierEffect.Init(cardData);
        } else if (TLMNLogic.check4DoiThong(cardData)) {
            this.cardTierEffect.Init(cardData);
        } else if (TLMNLogic.checkBaConHeo(cardData)) {
            this.cardTierEffect.Init(cardData);
        }
    },

    playSoundCard(cardData) {
        NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.DANH_BAI, 1, false, false);
        if (cardData.length == 1) {
            var number = cardData[0].rank;
            NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON["MOT_" + number], 1, false, false);
        } else if (TLMNLogic.checkTuQuy(cardData)) {
            var number = cardData[0].rank;
            NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON["BON_" + number], 1, false, false);
        } else if (TLMNLogic.check3DoiThong(cardData)) {
            NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.BA_DOI_THONG, 1, false, false);
        } else if (TLMNLogic.checkDoi(cardData)) {
            var number = cardData[0].rank;
            NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON["DOI_" + number], 1, false, false);
        } else if (TLMNLogic.checkBaCon(cardData)) {
            var number = cardData[0].rank;
            NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON["BA_" + number], 1, false, false);
        } else if (TLMNLogic.check4DoiThong(cardData)) {
            NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.BON_DOI_THONG, 1, false, false);
        } else if (TLMNLogic.checkSanh(cardData)) {
            NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.SANH, 1, false, false);
        }
    },

    EffectWinType(winType, cardList) {
        var newCardList = TLMNLogic.sort(cardList);
        var finalCardList = [];
        // if (Number(winType) == 9) { // còn trường hợp type = 10 chưa check được
        //     for (let i = 0; i < newCardList.length; i += 2) {
        //         if (newCardList[i].rank == newCardList[i + 1].rank) {
        //             finalCardList.push(newCardList[i], newCardList[i + 1]);
        //         }
        //     }
        // } else if (Number(winType) == 7 || Number(winType) == 8 || Number(winType) == 10 || Number(winType) == 11) {
        var winTypeArray = [7, 8, 9, 10, 11];
        if (winTypeArray.indexOf(Number(winType)) !== -1) {
            finalCardList = cc.js.array.copy(cardList);
        }
        this.cardTierEffect.toiTrangLabel.active = false;
        if (finalCardList.length > 0) {
            this.cardTierEffect.InitToiTrang(finalCardList, Number(winType));
            NewAudioManager.SOUND_GAME.TLMN.playAudioClip(NewAudioManager.SOUND_GAME.TLMN.COMMON.TOI_TRANG, 1, false, false);
        }
    },

    checkCapacityShowPlayer() {
        if (Number(this.maxCapacity) == 2) {
            this.player1.show(false);
            this.player3.show(false);
        }
    }
});