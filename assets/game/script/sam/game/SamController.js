var Linker = require('Linker');
var SamCard = require('SamCard');
var PhomConstant = require('PhomConstant');
var SamPlayer = require('SamPlayer');
var CommonSend = require('CommonSend');
var SamSend = require('SamSend');
var CardUtils = require('CardUtils');
var SamLogic = require('SamLogic');
var Utils = require('Utils');
var SamEffect = require('SamEffect');
var Constant = require('Constant');
var XocDiaSend = require('XocDiaSend');
var NodePoolManager = require('NodePoolManager');
var SceneManager = require('SceneManager');
var SocketConstant = require('SocketConstant');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,
    ctor() {

    },
    properties: {
        player0: SamPlayer,
        player1: SamPlayer,
        player2: SamPlayer,
        player3: SamPlayer,
        player4: SamPlayer,
        startGameBtn: cc.Node,
        readyGameBtn: cc.Node,
        textTableIndex: cc.Label,
        textMatchId: cc.Label,
        textMinBet: cc.Label,
        danhBtn: cc.Node,
        BaoSambtn: cc.Node,
        BoSambtn: cc.Node,
        boLuotBtn: cc.Node,
        timeCountLabel: cc.Node,
        // Chat feature
        pnChat: cc.Node,
        srcChat: cc.ScrollView,
        edbChat: cc.EditBox,
        ChatDialog: cc.Prefab,
        DialogContent: cc.Prefab,
        nohuGameBaiEffectLayerPrefab: cc.Prefab
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var that = this;
        NewAudioManager.playAudioSource("joinboard");
        cc.find('Canvas').on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            Linker.lastTimeManipulation = new Date().getTime();
        }, that.node);
        Linker.SamController = this;
        Linker.redirectOnReconnect = '';
        SceneManager.preloadScene("LobbyScene");
        this.sortType = 0;
        // NodePoolManager.MiniGame.getNodePool();
        // NodePoolManager.NoHu.getNodePool();
        // NodePoolManager.TopHu.getNodePool();
        // var topHu = cc.find('Canvas/TopHu');
        // if(topHu){
        //     topHu.active = false;
        //     var tophuContainer = topHu.getChildByName('TopHuContainer');
        //     tophuContainer.getChildByName('Container').active=false;
        // }
        this.addSocketEvent();
        if (Linker.CURRENT_TABLE) {
            cc.log(Linker.CURRENT_TABLE);
            if (Linker.CURRENT_TABLE.isCreate) {
                this.onCreateTableResponse(Linker.CURRENT_TABLE);
            } else {
                if (Linker.CURRENT_TABLE.isJoin) {
                    this.onJoinTableResponse(Linker.CURRENT_TABLE);
                } else {
                    if (Linker.CURRENT_TABLE.isReconnect) {
                        this.onReconnectionResponse(Linker.CURRENT_TABLE);
                    }
                }
            }
        }

        this.makeCardLower = true;
        this.comingCard = [];
        this.previousTurnHaveCard = [];   //turn trc đó có đánh bài ko bỏ lượt
        this.interval = null;
        this.endInterval = false;
        Linker.SamController.reconnectDialog = cc.instantiate(this.DialogContent);
        if (cc.find('Canvas') && Linker.SamController.reconnectDialog) {
            cc.find('Canvas').addChild(Linker.SamController.reconnectDialog);
            cc.find('Canvas/DialogLosConnect').active = false;
        }
    },
    onDestroy() {
        NewAudioManager.playAudioSource("leaveboard");
        this.removeSocketEvent();
    },

    start() {


    },
    settingBtnClick() {
        cc.find("Canvas/Setting").active = true;

    },
    backHandlerBtn: function(event){
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.backspace) {
            this.backBtn();         
        }
    },
    backBtn() {

        this.leaveTableRequest();
    },
    samCardTouchEvent(card, allCard) {
        if (card.node.y == 20) {

            card.node.y = 0;
            if (!this.myTurnCard) {
                return;
            }
            var n = this.myTurnCard.indexOf(card.serverValue.toString());
            if (n == 0) {

                var temp = this.myTurnCard.indexOf(card.serverValue.toString() + '#');
                if (temp >= 0) {
                    this.myTurnCard = this.myTurnCard.replace(card.serverValue.toString() + '#', '');
                } else {
                    this.myTurnCard = this.myTurnCard.replace(card.serverValue.toString(), '');
                }
            } else if (n > 0) {
                this.myTurnCard = this.myTurnCard.replace('#' + card.serverValue.toString(), '');
            }
            if (this.makeCardLower) {
                allCard.forEach(item => {
                    item.node.y = 0;
                });
                this.myTurnCard = null;
                this.makeCardLower = false;
            }

        } else {
            card.node.y = 20;
            card.node.getChildByName('background').color = new cc.Color(255, 255, 255, 255);
            var temp = SamLogic.showMeYourLoveOnTouch(card, allCard, this.myTurnCard);
            if (temp) {
                this.myTurnCard = temp;
            } else {
                if (this.myTurnCard) {
                    this.myTurnCard = this.myTurnCard + '#' + card.serverValue;
                } else {
                    this.myTurnCard = card.serverValue;
                }
            }


        }
    },

    btnDanhClick(event) {
        switch (event.target.name) {
            case "btn_danh": {

                if (this.currentTurnId == this.myUserId) {
                    if (this.myTurnCard) {
                        var checkBai = SamLogic.checkLogic(this.myTurnCard, this.comingCard);
                        if (checkBai) {
                            var send = SamSend.DemLaTurnRequest(this.tableId, this.myTurnCard);
                            cc.find('Canvas/checkpoint').getComponent(cc.Label).string = this.myTurnCard;
                            Linker.Socket.send(send);
                            this.myTurnCard = '';
                            this.player0.cardOnHandList.getChildren().forEach(item => {
                                item.getComponent(SamCard).node.getChildByName('background').color = new cc.Color(255, 255, 255, 255);
                                item.getComponent(SamCard).node.y = 0;
                            });
                        } else {
                            SamEffect.showKhongHopLe(this.player0);
                            this.player0.cardOnHandList.getChildren().forEach(item => {
                                //item.getComponent(SamCard).node.getChildByName('background').color= new cc.Color(255,255,255,255);
                                item.getComponent(SamCard).node.y = 0;
                            });
                            this.myTurnCard = '';
                        }
                    }
                    else {
                        Linker.showMessage("Chưa chọn bài");
                    }
                }
                break;
            }
            case "btn_boluot": {
                if (this.currentTurnId == this.myUserId) {
                    var send = SamSend.DemLaTurnRequest(this.tableId);
                    Linker.Socket.send(send);
                    this.player0.cardOnHandList.getChildren().forEach(item => {
                        item.getComponent(SamCard).node.getChildByName('background').color = new cc.Color(255, 255, 255, 255);
                        item.getComponent(SamCard).node.y = 0;
                    });
                }
                break;
            }
        }



    },

    readyBtnClick() {
        var send = CommonSend.readyGameRequest(this.tableId, 1);
        Linker.Socket.send(send);

    },

    startGameBtnClick() {
        var send = CommonSend.startGameRequest(this.tableId, 1);
        Linker.Socket.send(send);
    },
    leaveTableRequest() {
        Linker.Socket.send(CommonSend.leaveTableRequest(Linker.CURRENT_TABLE.tableId));
    },
    moiChoiBtnClick() {
        if (this.gameState == 0) {
            cc.find("Canvas/InviteSendDialog").active = true;
        } else {
            Linker.showMessage("Bạn không thể mời khi đang chơi");
        }

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
        Linker.Event.addEventListener(1110, this.onPlayerReadyResponse, this);
        Linker.Event.addEventListener(1108, this.onMatchStartResponse, this);
        Linker.Event.addEventListener(3, this.onReconnectionResponse, this);
        Linker.Event.addEventListener(1112, this.onGetPockerResponse, this);
        Linker.Event.addEventListener(1131, this.onBaoSam, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
        Linker.Event.addEventListener(SocketConstant.COMMON.UPDATE_CRASH, this.onUpdateMoney, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(Constant.CMD.CHAT, this.onChat, this);
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
        Linker.Event.removeEventListener(1131, this.onBaoSam, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
        Linker.Event.removeEventListener(SocketConstant.COMMON.UPDATE_CRASH, this.onUpdateMoney, this);
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

        this.BaoSambtn.active = false;
        this.BoSambtn.active = false;
        this.timeCountLabel.parent.active = false;
        if (message.listEndCard) {
            var winIndex = this.findCurrentPlayer(message.winerId);
            var indexNum = this.listPlayerNode[winIndex].playerNumber;
            this.listPlayerNode[winIndex].addTurnedCard(message.listEndCard, indexNum);
        }

        this.myTurnCard = null;
        var self = this;
        this.player4.show(true);
        this.player0.show(false);
        this.player4.showProfile(true);
        this.player4.showInvite(false);
        this.player4.createPlayer(this.listPlayer[this.myIndex]);
        if (message.winerId != this.myUserId) {
            this.player4.addCardPlayerOwner();
            this.player4.showCardOnHand(true);
        }

        this.danhBtn.active = false;
        this.boLuotBtn.active = false;
        cc.log('onEndRound:', message);
        message.listPlayer.forEach((element, pos) => {
            var index = this.findCurrentPlayer(element.userId);
            var player = this.listPlayerNode[index];
            if (player != undefined) {
                cc.log('nodePlayer:', this.listPlayer);
                var tien = (Number(player.player.userMoney) + Number(element.point)).toString();
                player.moneyPlayer.string = Utils.Number.format(tien);
                cc.log('tien:', player.moneyPlayer.string);
                player.player.cardOwnerList = element.listCard;
                if (player.player.userId != this.myUserId) {
                    player.addCardPlayerOwner();
                    player.hiddenCard.getChildByName('light').getChildByName('socay').getComponent(cc.Label).string = 10;
                    player.hiddenCard.getChildByName('light').active = false;
                    player.onWinMessage(element.message);
                } else {
                    Linker.userData.userMoney = tien;
                    this.player4.onWinMessage(element.message);
                }

                if (Number(element.userId) == Number(message.winerId)) {
                    if (element.userId == this.myUserId) {
                        SamEffect.showWin(self.player4, message.winType);
                    } else {
                        SamEffect.showWin(player, message.winType);
                    }
                } else {
                    if (element.userId == this.myUserId) {
                        SamEffect.showLose(self.player4);
                    } else {
                        SamEffect.showLose(player);
                    }

                }

                if (element.userId == this.myUserId) {
                    SamEffect.showPoint(self.player4, element.point);
                } else {
                    SamEffect.showPoint(player, element.point);
                }
                player.showHiddenCard(false);



                //player.moneyPlayer.string = Utils.Number.abbreviate(element.cash);;

                //player.playWinEffect();
                // if (uType == 0) {
                //     if (message.winerId == element.userId) {
                //         if (element.point == 1000) {
                //             player.playWinEffect(0, 0, 0, element.money, true);
                //         } else {
                //             if (element.point == 0) {
                //                 player.playWinEffect(0, 0, element.point, element.money, false);
                //             } else {
                //                 player.playWinEffect(0, 0, element.point, element.money, false);
                //             }

                //         }

                //     } else {
                //         if (element.point == 1000) {
                //             if (true) {
                //                 player.playWinEffect(3, 0, 0, element.money, true);
                //             }

                //         } else {
                //             if (element.point == 0) {
                //                 player.playWinEffect(3, 0, element.point, element.money, false);
                //             } else {
                //                 player.playWinEffect(pos, 0, element.point, element.money, false);
                //             }
                //         }
                //     }

                // } else {
                // if (message.winerId == this.myUserId) {
                //     player.cardOnHandList.removeAllChildren();
                //     player.showCardOnHand(false);
                // }
                // if (message.winerId == element.userId) {
                //     player.cardOnHandList.removeAllChildren();
                //     player.showCardOnHand(false);
                //     //player.playWinEffect(0, uType, 0, element.money, false);
                // } else {
                //     //player.playWinEffect(3, uType, 0, element.money, false);
                // }
                //}
            }

        });

    },
    endGameLogic(target, message) {
        cc.log("END_GAME", message);
        this.comingCard = [];
        this.previousTurnHaveCard = [];
        if (this.isLeaveTable) {
            SceneManager.loadScene('LobbyScene',function(){});

            // SceneManager.loadScene('LobbyScene',function(){
            //     var scene = cc.director.getScene();
            //     var canvas = scene.getChildByName("Canvas");
            //     canvas.opacity = 0;
            //     cc.tween(canvas)
            //     .to(0.5, { opacity: 255})
            //     .start()
            // });
            Linker.message = "Bạn vừa rời phòng";
        }
        this.danhBtn.active = false;
        this.boLuotBtn.active = false;
        this.gameState = 0;
        if (message.newOwner != 0) {
            for (var i = 0; i < this.listPlayer.length; i++) {

                if (this.listPlayer[i].userId == message.newOwner) {
                    this.listPlayer[i].isMaster = 1;
                    this.listPlayerNode[i].player.isMaster = 1;
                } else {
                    this.listPlayer[i].isMaster = 0;
                    this.listPlayerNode[i].player.isMaster = 0;
                }


            }
            if (this.myUserId == message.newOwner) {
                this.isMaster = true;
                this.startGameBtn.active = true;
                this.readyGameBtn.active = false;
            } else {
                this.isMaster = false;
                this.startGameBtn.active = false;
                this.readyGameBtn.active = true;
            }
        }
        if (message.listPlayer.length > 0) {
            message.listPlayer.forEach((element) => {
                var index = this.findCurrentPlayer(element.userId);
                var player = this.listPlayer[index];
                if (player) {
                    player.userMoney = (Number(player.userMoney) + Number(element.point)).toString();
                    player.userId = element.userId;
                    if (Number(element.isOut) == 1 || Number(element.isBankrupt) >= 1 || player.userMoney <= 0) {
                        if (Number(element.userId) === Number(Linker.userData.userId)) {
                            // Check nguoi choi do la chinh minh thi roi khoi ban.
                            if (player.userMoney <= 0 || Number(element.isBankrupt == 1)) {
                                Linker.message = "Bạn bị thoát do không đủ tiền chơi.";
                            }
                            this.leaveTableRequest();
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

        for (var i = 0; i < this.listPlayer.length; i++) {
            if (this.listPlayer[i] != undefined) {
                if (this.listPlayer[i].isMaster == 1) {
                    this.listPlayer[i].state = 1;
                    this.listPlayerNode[i].player.state = 1;

                } else {
                    this.listPlayer[i].state = 0;
                    this.listPlayerNode[i].player.state = 0;
                }
            }

            this.listPlayer[i].turnedCardList = [];
            this.listPlayer[i].cardOwnerList = [];

            this.listPlayerNode[i].player.turnedCardList = [];
            this.listPlayerNode[i].player.cardOwnerList = [];
            this.listPlayerNode[i].showTien(false);
        }
        if (this.isMaster) {
            //FIXME:
            if (this.listPlayer[this.myIndex]) {
                this.listPlayer[this.myIndex].state = 1;
            }

        }

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
        }
        //xu ly khi co nguoi no hu
        if(message.idUserAnHu && message.moneyAnHu > 0 ){
            var indexUserNoHu = this.findCurrentPlayer(message.idUserAnHu);
            if(indexUserNoHu >=0){
                var player = this.listPlayer[indexUserNoHu];
                // Linker.showMessage("Chúc mừng người chơi "+player.viewName+" Nổ Nũ SAM với số tiền "+Utils.Number.format(message.moneyAnHu));
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
                nohueffects.setMoneyBonus(Utils.Number.format(message.moneyAnHu));
                nohueffects.runAnimation();
            }
           

        }
        //end xu ly khi co nguoi no hu
    },
    stopAllGameEffect: function(){
        //stop no hu game bai effect
        var nohuEffect = cc.find("Canvas/NoHuGameBaiEffectLayer");
        if(nohuEffect){
            var nohueffects = nohuEffect.getComponent("NoHuGameBaiEffectLayer");
            nohueffects.hideAnimLayer();
        }
    },
    onGetPockerResponse(message) {
        if (message.status == 1) {
            this._updateTimeBaoSam();
            this.gameState = PhomConstant.GAME_STATE.PLAYING;
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
                this.player0.createPlayer(this.listPlayer[this.myIndex]);
                this.listPlayerNode[this.myIndex] = this.player0;
                cc.log("MY_USER");

            } else {
                cc.log("NULLL", this.listPlayer[this.myIndex].state);
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





            // this.listPlayerNode[this.myIndex].setPlayer(this.listPlayer[this.myIndex]);
            this.listPlayerNode[this.myIndex].player.cardOwnerList = message.cardOwnerList;
            this.listPlayerNode[this.myIndex].cardOnHandList.active = false;
            this.listPlayerNode[this.myIndex].addCardPlayerOwner();


            if (this.listPlayer[this.myIndex].state == 2) {
                this.listPlayerNode[this.myIndex].cardOnHandList.active = false;
                //  this.listCardEffect.position = cc.v2(0, 0);
                SamEffect.chiaBaiEffect(this.listPlayerNode[this.myIndex], 10);
            }
            for (var i = 0; i < this.listPlayerNode.length; i++) {
                if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2) {
                    this.listPlayerNode[i].showHiddenCard(true);
                    SamEffect.otherPlayerChiaBaiEffect(this.listPlayerNode[i], 10);
                } else {
                    // this.listPlayer[this.myIndex].cardOwnerList = message.cardOwnerList;
                    // this.listPlayerNode[this.myIndex].setPlayer(this.listPlayer[this.myIndex]);
                    // this.listPlayerNode[this.myIndex].addCardPlayerOwner();
                    // this.listPlayerNode[i].showHiddenCard(false);
                    // // this.listCardEffect.position = cc.v2(0, 0);
                    // SamEffect.chiaBaiEffect(this.listPlayerNode[i], this.listPlayerNode[i].player.cardOwnerList.length);
                }
            }

            // for (var i = 0; i < this.listPlayerNode.length; i++) {
            //     if (i == this.findCurrentPlayer(this.currentTurnId)) {
            //         this.listPlayerNode[i].showTime(true);
            //     } else {
            //         this.listPlayerNode[i].showTime(false);
            //     }
            // }


            this.startGameBtn.active = false;
            this.readyGameBtn.active = false;
            this.setBlurProfile();
        } else {
            Linker.showMessage(message.error);
        }
    },


    onBaoSam(message) {
        if (message.status == 1) {
            clearInterval(cc.Global.intervalSam);
            this.endInterval = true;
            var temp = this.findCurrentPlayer(message.playerId);
            if (temp < 0) {
                return;
            }
            if (Number(message.isBaoSam) == 1) {

                //Linker.showMessage('Người chơi ' + this.listPlayer[temp].viewName + ' đã chọn báo sâm!!!');
                SamEffect.showBaoSam(this.listPlayerNode[temp]);
            } else {
                // this.listPlayerNode[temp].win.active=true;
                // this.listPlayerNode[temp].win.getChildByName('bosam').active=true;
                // setTimeout(() => {
                //     this.listPlayerNode[temp].win.active=false;
                //     this.listPlayerNode[temp].win.getChildByName('bosam').active=false;

                // }, 2000);

                //TODO: nếu báo sâm thì sẽ trả về người đc đánh báo sâm
                // nếu không báo sâm thì trả về ng đc đánh đầu tiên 

            }
            for (var i = 0; i < this.listPlayerNode.length; i++) {
                if (i == temp) {
                    this.listPlayerNode[i].showTime(true);
                } else {
                    this.listPlayerNode[i].showTime(false);
                }
            }
            if (Number(message.playerId) == Number(this.myUserId)) {
                this.danhBtn.active = true;
                this.boLuotBtn.active = false;
            } else {
                this.danhBtn.active = false;
                this.boLuotBtn.active = false;
            }
            this.BaoSambtn.active = false;
            this.BoSambtn.active = false;
            this.currentTurnId = message.playerId;
            this.timeCountLabel.parent.active = false;
        }
    },

    _updateTimeBaoSam: function (remainTime) {
        this.endInterval = false;
        this.listPlayerNode.forEach((item) => {
            if (item.hiddenCard.getChildByName('light')) {
                item.hiddenCard.getChildByName('light').active = false;
                item.hiddenCard.getChildByName('light').getChildByName('socay').getComponent(cc.Label).string = '10';
            }
        });


        setTimeout(() => {
            if (!this.listPlayerNode || !this.timeCountLabel) {
                return;
            }
            var i = this.findCurrentPlayer(this.myUserId);
            if (this.listPlayerNode[i].player.state == 2) {
                this.BaoSambtn.active = true;
                this.BoSambtn.active = true;
            }
            this.timeCountLabel.parent.active = true;
            this.listPlayerNode.forEach((item) => {
                if (item.hiddenCard.getChildByName('light')) {
                    item.hiddenCard.getChildByName('light').active = true;
                }

            });
        }, 1200);
        var countDownDate = new Date().getTime() + 16000;
        if (remainTime) {
            countDownDate = new Date().getTime() + remainTime;
        }

        var that = this;
        cc.Global.intervalSam = setInterval(function () {

            var now = new Date().getTime();

            var distance = countDownDate - now;
            var seconds = Math.round((distance % (1000 * 60)) / 1000);
            // Display the result in the element with id="demo"
            if (!that.timeCountLabel) {
                return;
            }
            that.timeCountLabel.getComponent(cc.Label).string = seconds + "s ";
            // If the count down is finished, write some text 
            if (seconds < -1 || that.endInterval) {
                clearInterval(cc.Global.intervalSam);
                cc.Global.intervalSam = null;
                that.BaoSambtn.active = false;
                that.BoSambtn.active = false;
                that.timeCountLabel.parent.active = false;
            }
        }, 1000);
    },


    onBaoSamClick(event) {
        switch (event.target.name) {
            case "btn_baosam": {
                var send = SamSend.BaoSam(this.tableId, 1);
                Linker.Socket.send(send);
                this.BaoSambtn.active = false;
                this.BoSambtn.active = false;
                break;
            }
            case "btn_bosam": {
                var send = SamSend.BaoSam(this.tableId, 0);
                Linker.Socket.send(send);
                this.BaoSambtn.active = false;
                this.BoSambtn.active = false;
                break;
            }
        }
    },

    onPlayerJoinedResponse(message) {
        if (message.status == 1) {
            NewAudioManager.playAudioSource("joinboard");
            switch (this.gameState) {
                case PhomConstant.GAME_STATE.WAIT: {

                    // if (this.player1.player) {
                    //     if (this.player1.player.userId === message.player.userId) {
                    //         this.player1.reset();
                    //     }
                    // }
                    // if (this.player2.player) {
                    //     if (this.player2.player.userId === message.player.userId) {
                    //         this.player2.reset();
                    //     }
                    // }
                    // if (this.player3.player) {
                    //     if (this.player3.player.userId === message.player.userId) {
                    //         this.player3.reset();
                    //     }
                    // }
                    // if (this.player4.player) {
                    //     if (this.player4.player.userId === message.player.userId) {
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

                    }

                    this.listPlayerNode = [];
                    if (message.player) {
                        this.listPlayer.push(message.player);
                    }
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
                        // if (this.listPlayerNode[this.myIndex].player.phomList.length > 0) {
                        //     if (this.listPlayerNode[this.myIndex].player.turnedCardList.length < 3) {
                        //         this.isHaBai = 0;
                        //         this.haBaiBtn.active = false;
                        //     } else {
                        //         // this.haBaiBtn.active = true;
                        //     }
                        //     if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length == 0) {
                        //         this.isU = true;
                        //         this.guiUBtn.active = true;
                        //         this.danhBtn.active = false;
                        //     } else {
                        //         // this.bocBtn.active = true;
                        //         // this.danhBtn.active = true;
                        //     }
                        // } else {
                        //     if (this.listPlayerNode[this.myIndex].player.turnedCardList.length < 3) {
                        //         this.isHaBai = 0;
                        //         this.haBaiBtn.active = false;
                        //     } else {
                        //         this.haBaiBtn.active = true;
                        //     }
                        //     if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length == 10) {
                        //         this.danhBtn.active = true;
                        //         this.bocBaiBtn.action = false;
                        //     } else {
                        //         if (this.listPlayerNode[this.myIndex].player.cardOwnerList.length == 9) {
                        //             this.danhBtn.active = false;
                        //             this.bocBaiBtn.action = true;
                        //         }
                        //     }
                        // }




                    } else {

                        // this.danhBtn.active = false;
                    }
                    this.readyGameBtn.active = false;
                    this.startGameBtn.active = false;
                    if (message.player) {
                        this.listPlayer.push(message.player);
                    }
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


                                    this.player3.createPlayer(this.listPlayer[3]);
                                    this.player3.showInvite(false);
                                    this.player3.showProfile(true, true);
                                    this.listPlayerNode.push(this.player3);

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


                                    this.player3.createPlayer(this.listPlayer[3]);
                                    this.player3.showInvite(false);
                                    this.player3.showProfile(true, true);
                                    this.listPlayerNode.push(this.player3);

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
    onReconnectionResponse(message) {
        if (message.status == 1) {
            NewAudioManager.playAudioSource("joinboard");

            this.resetTable();
            this.tableId = message.tableId;
            this.tableIndex = message.index;
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.currentPlayerId = message.currentPlayerId;
            this.setRoomInfo();
            if (this.maxCapacity) {
                this.player0.reset();
                this.player1.reset();
                this.player2.reset();
                this.player3.reset();
                this.player4.reset();
                this.player4.show(false);
            }
            this.currentCapacity = message.listPlayer.length;
            this.listPlayer = message.listPlayer;
            this.gameState = Number(message.isPlaying);
            this.myIndex = this.findCurrentPlayer(this.myUserId);
            if (message.remainTime) {
                this._updateTimeBaoSam(message.remainTime);
            }

            this.currentTurnId = message.currentPlayerId;

            this.listPlaying = [];

            if (this.listPlayer[this.myIndex].isMaster == 1) {
                this.isMaster = true;
            } else {
                this.isMaster = false;
            }
            switch (this.gameState) {
                case PhomConstant.GAME_STATE.WAIT: {
                    break;
                }
                case PhomConstant.GAME_STATE.PLAYING: {
                    this.readyGameBtn.active = false;
                    this.startGameBtn.active = false;
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
                    this.listPlayerNode[this.myIndex].player.cardOwnerList = message.selfCardList;
                    // if (message.selfTurnedList.length > 0) {
                    //     for (var i = 0; i < message.selfTurnedList.length; i++) {
                    //         this.listPlayerNode[this.myIndex].player.turnedCardList.push(message.selfTurnedList[i]);
                    //     }
                    // }
                    // cc.log(this.listPlayer[this.myIndex].turnedCardList);
                    // this.listPlayerNode[this.myIndex].setPlayer(this.listPlayer[this.myIndex]);
                    if (this.currentTurnId == this.myUserId) {
                        this.danhBtn.active = true;
                        this.boLuotBtn.active = true;
                    } else {
                        this.danhBtn.active = false;
                        this.boLuotBtn.active = false;
                    }
                    this.listPlayerNode[this.myIndex].addCardPlayerOwner();
                    this.listPlayerNode[this.myIndex].addTurnedCardList();
                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                        if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2) {
                            this.listPlayerNode[i].showHiddenCard(true);
                            this.listPlayerNode[i].addTurnedCardList();

                        } else {
                            this.listPlayerNode[i].showHiddenCard(false);
                        }


                        if (i == this.findCurrentPlayer(this.currentTurnId) && message.isEndBaoSamState == '1') {
                            this.listPlayerNode[i].showTime(true);
                        } else {
                            this.listPlayerNode[i].showTime(false);
                        }
                        if (this.listPlayerNode[i].player.isMaster == 1 && this.listPlayerNode[i].player.userId == this.myUserId) {
                            this.isMaster = true;
                        } else {
                            this.isMaster = false;
                        }

                    }


                    break;
                }

            }

        } else {

        }
    },

    danhbai() {
        // var mes=this.parse_1104_message("1104","1","1151147#21#"+Math.floor(Math.random() * 50)+"#48000");
        // this.onTurnCardRespone(mes);
        //this._updateTimeBaoSam();
        // var mes = this.parse_1114_message("1114", "1", "115006114114-200Còn 4 cây5#31#33#4600115190Thắng,Phat do khong danh cay cao nhat!00");
        // this.onGameEndResponse(mes);
        // this.listPlayerNode[0].showTime(true);
        // this.listPlayerNode[1].showTime(true);
        // this.listPlayerNode[2].showTime(true);
        var message = this.parse_1112_message('1112', '1');
        // message.cardOwnerList.forEach(item=>{
        //     if(item.rank==1){
        //         item.rank=14;
        //     }else if( item.rank==2){
        //         item.rank=15;
        //     }
        // });
        this.danhBtn.active = true;
        this.currentTurnId = this.myUserId;
        setTimeout(() => {
            message.cardOwnerList = SamLogic.sortCardByRankIncrease(message.cardOwnerList);
            // this.listPlayerNode[this.myIndex].player.cardOwnerList = message.cardOwnerList;
            // // this.listPlayerNode[this.myIndex].setPlayer(this.listPlayer[this.myIndex]);
            // this.listPlayerNode[this.myIndex].cardOnHandList.active = false;
            // this.listPlayerNode[this.myIndex].addCardPlayerOwner();

            //     this.listPlayerNode[this.myIndex].cardOnHandList.active = false;
            //     //  this.listCardEffect.position = cc.v2(0, 0);
            //     SamEffect.chiaBaiEffect(this.listPlayerNode[this.myIndex],10);
            this.player0.createPlayer(this.listPlayer[0]);
            this.player0.showInvite(false);
            this.player0.showProfile(true);
            this.player4.showProfile(false);
            this.player4.showInvite(false);
            this.player0.player.cardOwnerList = message.cardOwnerList;
            // this.listPlayerNode[this.myIndex].setPlayer(this.listPlayer[this.myIndex]);
            this.player0.cardOnHandList.active = false;
            this.player0.addCardPlayerOwner();

            this.player0.cardOnHandList.active = false;
            //  this.listCardEffect.position = cc.v2(0, 0);
            SamEffect.chiaBaiEffect(this.player0, 10);
        }, 100);
    },

    parse_1112_message(messageId, status) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            //var tempData = "11542#19#45#21#23#37#12#52#4#17#30#1#215000115#114";
            var tempData = "1153#16#4#17#5#18#6#19#13#1#215000115#114";
            var tempArray = tempData.split('');
            message.beginPlayerId = tempArray[0];
            message.cardOwnerList = CardUtils.parseSamCard(tempArray[1]);
            message.dutyType = tempArray[2];
            message.listPlayer = tempArray[3].split("#");


        } else {
            message.error = data;
        }


        return message;
    },

    danhbai2() {
        var mes = this.parse_1104_message();
        this.listPlayerNode[this.myIndex].addTurnedCard(mes.listCard, 0);

        this.onTurnCardRespone(mes);
    },

    parse_1104_message() {
        var message = {
            messageId: '1104',
            status: 1
        };
        if (message.status == 1) {
            //var tempData = '1141153#16000';
            var tempData = '1141153#4#5000';
            var tempArray = tempData.split("\u0001");
            cc.log(tempArray);
            message.currentId = tempArray[0];
            message.nextTurnId = tempArray[1];
            message.listCard = [];
            if (tempArray[2]) {
                var soquan = tempArray[2].split("#").length;
                if (soquan == 1) {
                    var card = new SamCard();
                    card.setServerValue(tempArray[2]);
                    message.listCard.push(card);
                } else if (soquan > 1) {
                    var cardData = tempArray[2].split("#");
                    for (var i = 0; i < soquan; i++) {
                        var card = new SamCard();
                        card.setServerValue(cardData[i]);
                        message.listCard.push(card);
                    }
                }
            }
            message.isDuty = tempArray[3];
            message.isGiveup = tempArray[4];
            message.isNewRound = tempArray[5];

            // message.card = card;

        } else {
        }

        return message;
    },

    onTurnCardRespone(message) {
        if (message.status == 1) {
            this.makeCardLower = true;
            message.listCard = SamLogic.sortCardByRankIncrease(message.listCard);

            this.nextTurnId = message.nextTurnId;
            var currentPlayerIndex = this.findCurrentPlayer(message.currentId);
            if (Number(message.isGiveup) == 1) {
                SamEffect.showBoLuot(this.listPlayerNode[currentPlayerIndex]);
            }
            if (Number(message.isNewRound) == 1) {
                this.previousTurnHaveCard = [];
                this.listPlayerNode[currentPlayerIndex].newRound();
            } else if (message.listCard.length > 0) {
                this.previousTurnHaveCard = message.listCard;
            }

            if (message.currentId == this.myUserId) {
                message.listCard.forEach((item) => {
                    var turnCardIndex = SamLogic.findCard(item, this.listPlayerNode[currentPlayerIndex].player.cardOwnerList);
                    this.listPlayerNode[this.myIndex].player.turnedCardList.push(item);
                    this.listPlayerNode[this.myIndex].player.cardOwnerList.splice(turnCardIndex, 1);
                });

                this.listPlayerNode[currentPlayerIndex].setPlayer(this.listPlayer[currentPlayerIndex]);
                this.listPlayerNode[this.myIndex].removeOwnerCard(message.listCard);
                setTimeout(() => {
                    if (this.listPlayerNode[this.myIndex]) {
                        this.listPlayerNode[this.myIndex].addTurnedCard(message.listCard, 0);
                    }
                }, 70);

                this.myTurnCard = null;
                this.danhBtn.active = false;
                this.boLuotBtn.active = false;

            } else {
                this.listPlayerNode[currentPlayerIndex].player.turnedCardList.push(message.listCard);
                var soCay = this.listPlayerNode[currentPlayerIndex].hiddenCard.getChildByName('light').getChildByName('socay').getComponent(cc.Label);
                soCay.string = Number(soCay.string) - message.listCard.length;
                this.listPlayerNode[currentPlayerIndex].setPlayer(this.listPlayer[currentPlayerIndex]);

                var indexNum = this.listPlayerNode[currentPlayerIndex].playerNumber;
                setTimeout(() => {
                    if (this.listPlayerNode[currentPlayerIndex]) {
                        this.listPlayerNode[currentPlayerIndex].addTurnedCard(message.listCard, indexNum);
                    }
                }, 70);

            }



            this.currentTurnId = message.nextTurnId;
            if (message.nextTurnId == this.myUserId) {
                this.comingCard = message.listCard;
                this.danhBtn.active = true;


                if (Number(message.isNewRound) == 1) {
                    this.boLuotBtn.active = false;
                } else {
                    this.boLuotBtn.active = true;
                }

                if (message.nextTurnId == message.currentId) {
                    this.comingCard = [];
                    var ownerList = [];
                    this.player0.cardOnHandList.getChildren().forEach(item => {
                        var card = item.getComponent(SamCard);
                        card.node.y = 0;
                        if (card.rank == 1) {
                            card.rank = 14;
                        } else if (card.rank == 2) {
                            card.rank = 15;
                        }
                        ownerList.push(card);
                        item.getComponent(SamCard).node.getChildByName('background').color = new cc.Color(255, 255, 255, 255);
                    });
                    setTimeout(() => {
                        this.myTurnCard = SamLogic.showMeYourLove([], ownerList);
                        console.log('*** my turn card', this.myTurnCard);
                    }, 50);
                }
                else if (Number(message.isNewRound) == 0 && Number(message.isGiveup) == 1) {
                    this.comingCard = this.previousTurnHaveCard;
                    var ownerList = [];
                    this.player0.cardOnHandList.getChildren().forEach(item => {
                        var card = item.getComponent(SamCard);
                        card.node.y = 0;
                        if (card.rank == 1) {
                            card.rank = 14;
                        } else if (card.rank == 2) {
                            card.rank = 15;
                        }
                        ownerList.push(card);
                        item.getComponent(SamCard).node.getChildByName('background').color = new cc.Color(140, 140, 140, 255);
                        item.getComponent(SamCard).node.y = 0;
                    });

                    this.previousTurnHaveCard.forEach(item => {
                        if (item.rank == 1) {
                            item.rank = 14;
                        } else if (item.rank == 2) {
                            item.rank = 15;
                        }
                    });

                    setTimeout(() => {
                        this.myTurnCard = SamLogic.showMeYourLove(this.previousTurnHaveCard, ownerList);
                    }, 50);

                } else if (message.listCard.length > 0) {
                    var ownerList = [];
                    this.player0.cardOnHandList.getChildren().forEach(item => {
                        var card = item.getComponent(SamCard);
                        card.node.y = 0;
                        if (card.rank == 1) {
                            card.rank = 14;
                        } else if (card.rank == 2) {
                            card.rank = 15;
                        }
                        ownerList.push(card);
                        item.getComponent(SamCard).node.getChildByName('background').color = new cc.Color(140, 140, 140, 255);
                        item.getComponent(SamCard).node.y = 0;
                    });

                    message.listCard.forEach(item => {
                        if (item.rank == 1) {
                            item.rank = 14;
                        } else if (item.rank == 2) {
                            item.rank = 15;
                        }
                    });

                    setTimeout(() => {
                        this.myTurnCard = SamLogic.showMeYourLove(message.listCard, ownerList);
                    }, 50);
                } else {
                    var ownerList = [];
                    this.player0.cardOnHandList.getChildren().forEach(item => {
                        var card = item.getComponent(SamCard);
                        card.node.y = 0;
                        if (card.rank == 1) {
                            card.rank = 14;
                        } else if (card.rank == 2) {
                            card.rank = 15;
                        }
                        ownerList.push(card);
                        item.getComponent(SamCard).node.getChildByName('background').color = new cc.Color(255, 255, 255, 255);
                    });
                    setTimeout(() => {
                        this.myTurnCard = SamLogic.showMeYourLove(message.listCard, ownerList);
                        console.log('*** my turn card', this.myTurnCard);
                    }, 50);
                }

            }

            // this.cardLeft--;
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
    onLeaveTableRespone(message) {
        if (message.status == 1) {
            cc.log("GAME_STATE", this.gameState)
            if (this.myUserId == message.userId) {
                switch (this.gameState) {
                    case 0: {

                        if (message.cancelStatus == 0) {
                            SceneManager.loadScene('LobbyScene',function(){});

                            // SceneManager.loadScene('LobbyScene',function(){
                            //     var scene = cc.director.getScene();
                            //     var canvas = scene.getChildByName("Canvas");
                            //     canvas.opacity = 0;
                            //     cc.tween(canvas)
                            //     .to(0.5, { opacity: 255})
                            //     .start()
                            // });
                            // Linker.showMessage("Bạn vừa rời phòng");
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
                                    SceneManager.loadScene('LobbyScene', function () { });

                                    // SceneManager.loadScene('LobbyScene', function () {
                                    //     var scene = cc.director.getScene();
                                    //     var canvas = scene.getChildByName("Canvas");
                                    //     canvas.opacity = 0;
                                    //     cc.tween(canvas)
                                    //         .to(0.5, { opacity: 255 })
                                    //         .start()
                                    // });
                                    //SceneManager.loadScene('LobbyScene');
                                    // Linker.showMessage("Bạn vừa rời phòng");
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

                        }

                        // if (this.player1.player) {
                        //     if (this.player1.player.userId === message.userId) {
                        //         this.player1.reset();
                        //     }
                        // }
                        // if (this.player2.player) {
                        //     if (this.player2.player.userId === message.userId) {
                        //         this.player2.reset();
                        //     }
                        // }
                        // if (this.player3.player) {
                        //     if (this.player3.player.userId === message.userId) {
                        //         this.player3.reset();
                        //     }
                        // }
                        // if (this.player4.player) {
                        //     if (this.player4.player.userId === message.userId) {
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
                        this.listPlayerNode.splice(leveaPlayerIndex, 1)[0].reset();

                        break;
                    }
                }




            }






        } else {

        }
    },
    onCreateTableResponse(message) {
        if (message.status == 1) {
            this.resetTable();
            this.tableId = message.tableId;
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
            }
            this.currentCapacity = 1;
            this.gameState = Number(message.isPlaying);
            this.player4.showProfile(true);
            this.player4.showInvite(false);
            this.startGameBtn.active = true;
            this.readyGameBtn.active = true;
            this.player4.createPlayer(message.player);
            // this.player0.createPlayer(message.player);
            this.myIndex = 0;
            if (message.player) {
                this.listPlayer.push(message.player);
            }
            this.listPlayerNode.push(this.player4);
            this.isMaster = true;


        } else {

        }


    },
    onJoinTableResponse(message) {
        if (message.status == 1) {
            NewAudioManager.playAudioSource("joinboard");
            this.resetTable();
            this.tableId = message.tableId;
            this.tableIndex = message.tableIndex;
            this.minMoney = message.minMoney;
            this.maxCapacity = message.maxCapacity;
            this.setRoomInfo();
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
            }
            this.currentCapacity = message.listPlayer.length;
            this.listPlayer = message.listPlayer;
            this.gameState = Number(message.isPlaying);
            this.currentTurnId = message.currentPlayerId;
            this.listPlaying = [];
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
                    this.isMaster = false;





                    break;
                }
                case PhomConstant.GAME_STATE.PLAYING: {
                    this.readyGameBtn.active = false;
                    this.startGameBtn.active = false;
                    this.isMaster = false;
                    switch (this.currentCapacity) {
                        case 3: {
                            this.player1.showProfile(true);
                            this.player2.showProfile(true);
                            this.player4.showProfile(true,true);

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
                            this.player4.showProfile(true,true);

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
                    for (var i = 0; i < this.listPlayerNode.length; i++) {
                        if (this.listPlayerNode[i].player.userId != this.myUserId && this.listPlayerNode[i].player.state == 2) {
                            this.listPlayerNode[i].showHiddenCard(true);
                            // this.listPlayerNode[i].addTurnedCardList();
                        } else {
                            this.listPlayerNode[i].showHiddenCard(false);
                        }

                        if (i == this.findCurrentPlayer(message.currentPlayerId)) {
                            this.listPlayerNode[i].showTime(true);

                        } else {
                            this.listPlayerNode[i].showTime(false);

                        }
                    }
                    break;
                }
            }
            this.setBlurProfile(parseInt(message.isPlaying));
        } else {

        }
    },
    onKickPlayerResponse(message) {
        cc.log(Linker.userData.userId);
        if (message.status == 1) {
            cc.log(this.myUserId);
            if (this.myUserId == message.userId) {
                //Utils.Director.loadScene('LobbyScene');
                SceneManager.loadScene('LobbyScene',function(){});

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


            Linker.showMessage(info);

        } else {

        }
    },
    onPlayerReadyResponse(message) {
        if (message.status == 1) {
            this.stopAllGameEffect();
            switch (this.gameState) {

                case 0: {
                    var userId = message.userId;
                    var readyState = message.isReady;
                    var readyPlayerIndex = this.findCurrentPlayer(userId);
                    if (readyState == 1) {
                        this.listPlayer[readyPlayerIndex].state = 1;
                    } else {
                        this.listPlayer[readyPlayerIndex].state = 0;
                    }
                    this.listPlayerNode[readyPlayerIndex].createPlayer(this.listPlayer[readyPlayerIndex]);
                    if (readyState == 1 && Linker.userData.userId == userId) {
                        this.readyGameBtn.active = false;
                    }
                    break;
                }
                case 1: {
                    break;
                }
            }
        } else {
            Linker.showMessage(message.error);
            this.leaveTableRequest();
        }
    },
    onMatchStartResponse(message) {
        if (message.status == 1) {

        }
    },
    resetTable() {
        this.isAutoReady = 0;
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
        this.mySamCard = null;
        this.maxCapacity = 4;
    },
    setRoomInfo() {
        this.textMinBet.string = "Cược: " + this.minMoney;
        this.textTableIndex.string = "Bàn: " + this.tableIndex;
        this.textMatchId.string = "Trận: " + this.tableId;
    },
    setBlurProfile: function(status){
        //set blur profile neu khong san sang
        var _this = this;
        var isPlaying = true;
        if (!isNaN(status)) {
            switch (status) {
                case 2:
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



    btnChatClick() {
        var chatDialog = cc.instantiate(this.ChatDialog);
        Linker.SamTableId = this.tableId;
        this.node.addChild(chatDialog);
        chatDialog.setPosition(0, 0);
        // this.pnChat.active = !this.pnChat.active;
    },
    onChat(data) {
        if (data.error) {
            console.log(data.error);
            return;
        }

        if (data.userId == Linker.userData.userId) {
            this.player4.onChat(data);
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
            userId: Linker.userData.userId
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

    // update (dt) {
    //    // this._updateTimeBaoSam();
    // },
    onUpdateMoney(response){
        if(response.userId == Linker.userData.userId){
            var index = this.findCurrentPlayer(Linker.userData.userId);
            var playerNode = this.listPlayerNode[index];
            if(playerNode){
                playerNode.moneyPlayer.string = Utils.Number.format(response.userMoney);
            }
            
        }
    }
});