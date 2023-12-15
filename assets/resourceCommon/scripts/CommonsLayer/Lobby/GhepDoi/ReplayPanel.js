var Linker = require("Linker");
var Utils = require("Utils");
var PhiDaoConstant = require("PhiDaoConstant");
var Constant = require("Constant");
var NewAudioManager = require("NewAudioManager");
var LobbySend = require("LobbySend");
const CommonSend = require("CommonSend");
var i18n = require('i18n');
var TQUtil = require('TQUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        myUserName: cc.Label,
        myMoney: cc.Label,
        myAvatar: cc.Sprite,
        opponentName: cc.Label,
        opponentMoney: cc.Label,
        opponentAvatar: cc.Sprite,
        opponentNode: cc.Node,
        avatarSpriteSheet: cc.SpriteAtlas,
        findingAvatarNode: cc.Node,
        btnReplay: cc.Button,
        btnNewPlay: cc.Button,
        btnBack: cc.Button,
        btnCancleMatching: cc.Button,
        betMoneyLabel: cc.Label
    },
    onCancleMatching: function () {
        this.yeuCauHuyGhepDoi();
        this.timeOutNotification();
    },
    onReplayGame: function (event) {
        this.enableInteractable(false);
        this.showCancleFindNewPlayer(true);
        this.isNewMatch = true;
        if (this.findingAvatarNode) {
            var findingAvatarComponent = this.findingAvatarNode.getComponent("FindingPlayer");
            if (findingAvatarComponent) {
                findingAvatarComponent.runFindingAnimation();
                this.unschedule(this.timeOutNotification);
                this.scheduleOnce(this.timeOutNotification, 15);//15s tu dong huy
                if (Linker && Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId) {
                    this.CURRENT_TABLE = Linker.CURRENT_TABLE;
                    var userId = this.getUserId();
                    var zoneID = Linker.ZONE;
                    var money = this.CURRENT_TABLE.betMoney;
                    if (!money) {
                        money = this.CURRENT_TABLE.minMoney;
                    }
                    if (userId && zoneID && money) {
                        Linker.isGhepDoiInGame = true;
                        this.onLeaveRequest();
                        Linker.Socket.send(LobbySend.requestGhepDoi(userId, zoneID, money, false));
                        Linker.CURRENT_TABLE = null;
                    }
                } else if (this.CURRENT_TABLE) {
                    var userId = this.getUserId();
                    var zoneID = Linker.ZONE;
                    var money = this.CURRENT_TABLE.betMoney;
                    if (!money) {
                        money = this.CURRENT_TABLE.minMoney;
                    }
                    if (userId && zoneID && money) {
                        Linker.isGhepDoiInGame = true;
                        Linker.Socket.send(LobbySend.requestGhepDoi(userId, zoneID, money, false));
                    }
                }
            }
        }
    },
    timeOutNotification: function () {
        if (this && cc.isValid(this) && this.node && cc.isValid(this.node)) {
            if (this.findingAvatarNode) {
                var findingAvatarComponent = this.findingAvatarNode.getComponent("FindingPlayer");
                if (findingAvatarComponent) {
                    if (this.btnBack && this.btnNewPlay && this.btnReplay) {
                        this.btnBack.interactable = true;
                        this.btnBack.node.opacity = 255;
                        this.showFindNewPlayer(true);
                        if (this.isNewMatch) {
                            this.showReadyButton(false);
                        } else {
                            this.showReadyButton(true);
                        }
                    }
                    findingAvatarComponent.stopFindingAnimation();
                    if ((!Linker.CURRENT_TABLE) || (Linker.CURRENT_TABLE && isNaN(Number(Linker.CURRENT_TABLE.tableId)) == false && Number(Linker.CURRENT_TABLE.tableId) == 0)) {
                        cc.Global.showMessage(i18n.t("game_invite_busy"));
                    }
                }
            }
        }
    },
    onLeaveRequest: function () {
        if (Linker && Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId) {
            var tableId = Number(Linker.CURRENT_TABLE.tableId);
            if (isNaN(tableId) == false && tableId != 0) {
                cc.error("Yeu cau roi phong ngay bay gio");
                Linker.Socket.send(CommonSend.leaveTableRequest(tableId));
            }
        } else {
            Linker.isGhepDoiInGame = false;
            this.forceLeaveRoom();
        }
    },
    forceLeaveRoom: function () {
        this.yeuCauHuyGhepDoi();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_ROI_BAN_NGAY_LAP_TUC, true);
        this.node.dispatchEvent(customEvent);

    },
    leaveRoom: function (event) {
        Linker.isGhepDoiInGame = false;
        this.yeuCauHuyGhepDoi();
        this.onLeaveRequest();
    },
    yeuCauHuyGhepDoi(event) {
        if (this.CURRENT_TABLE) {
            var userId = Number(Linker.userData.userId);
            var zoneID = Number(Linker.ZONE);
            var money = Number(this.CURRENT_TABLE.betMoney);
            if (userId && zoneID && money) {
                var data = LobbySend.requestGhepDoi(userId, zoneID, money, true);
                if (data) {
                    Linker.Socket.send(data);
                }
            }
        }
    },
    enableInteractable: function (enable) {
        if (this.btnNewPlay && this.btnReplay && this.btnBack) {
            this.btnNewPlay.interactable = enable ? true : false;
            this.btnReplay.interactable = enable ? true : false;
            if (!enable) {
                this.btnNewPlay.node.active = false;
                this.btnNewPlay.node.opacity = 100;
                this.btnReplay.node.opacity = 100;
            } else {
                this.btnNewPlay.node.active = true;
                this.btnNewPlay.node.opacity = 255;
                this.btnReplay.node.opacity = 255;
            }
            // this.btnBack.interactable = enable ? true : false;
        }
    },
    onReady: function (event) {
        NewAudioManager.playClick();
        if (Linker && Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId) {
            var send = CommonSend.readyGameRequest(Linker.CURRENT_TABLE.tableId, 1);
            Linker.Socket.send(send);
        }
        this.enableInteractable(true);
    },
    onBtnReplayClick: function (event) {
        if (event) {
            var currentTarget = event.currentTarget;
            if (currentTarget) {
                var name = currentTarget.name;
                switch (name) {
                    case "btnMoreGame":
                        this.leaveRoom(event);
                        break;
                    case "btnBack":
                        this.leaveRoom(event);
                        break;
                    case "btnPlayOther":
                        this.onReplayGame(event);
                        break;
                    case "btnReplay":
                        this.onReady(event);
                        break;
                    case "btnCancle":
                        this.onCancleMatching(event);
                        break;
                    default:
                        break;
                }
            }
        }
    },
    setUserName: function () {
        if (Linker && Linker.userData) {
            this.myUserName.string = Linker.userData.displayName;
        }
    },
    setUserAvatar: function () {
        if (Linker && Linker.userData && this.avatarSpriteSheet) {
            var avatarId = Linker.userData.avatar;
            avatarId = parseInt(avatarId);
            avatarId = isNaN(avatarId) == false && avatarId != 0 ? avatarId : 1;
            var frame = this.avatarSpriteSheet.getSpriteFrame("avatar (" + avatarId + ")");
            if (frame) {
                this.myAvatar.spriteFrame = frame;
            }
        }
    },
    setUserMoney: function () {
        var moneyQuan = (Linker.userData.userRealMoney == 0) ? 0 : TQUtil.abbreviate(Linker.userData.userRealMoney);
        var moneyXu = (Linker.userData.userMoney == 0) ? 0 : TQUtil.abbreviate(Linker.userData.userMoney);
        this.myMoney.string = moneyQuan;
        // this.myMoney.string = moneyXu;
    },
    setInforOpponent: function (data) {

        if (this.opponentName && this.opponentMoney && this.opponentAvatar) {
            this.opponentMoney.string = TQUtil.abbreviate(data.userMoney);
            this.opponentName.string = data.userName;
            if (this.avatarSpriteSheet) {
                var avatarId = data.avatarId;
                avatarId = parseInt(avatarId);
                avatarId = isNaN(avatarId) == false && avatarId != 0 ? avatarId : 1;
                var frame = this.avatarSpriteSheet.getSpriteFrame("avatar (" + avatarId + ")");
                if (frame) {
                    this.opponentAvatar.spriteFrame = frame;
                }
            }
        }

    },
    getUserId: function () {
        if (Linker && Linker.userData) {
            return Number(Linker.userData.userId);
        }
        return 0;
    },
    onEnable: function () {

        if (Linker && Linker.userData) {
            // set infor my user
            this.setUserMoney();
            this.setUserName();
            // this.setUserId();
            // this.setMoneyTypeActive();
            this.setUserAvatar();
            this.showCancleFindNewPlayer(false);
            // this.configShowHideButton();
            // this.checkNotitication();
            // this.checkZoneShowHu();

            //set infor opponent
            if (this.listPlayer) {
                for (var i = 0; i < this.listPlayer.length; i++) {
                    if (Number(Linker.userData.userId) !== this.listPlayer[i].userId) {
                        this.setInforOpponent(this.listPlayer[i]);
                        break;
                    }
                }
            }
        }
        this.setMoneyBetGhepDoi();
    },

    setMoneyBetGhepDoi: function () {
        if (this.betMoneyLabel) {
            if (Linker && Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId) {
                this.CURRENT_TABLE = Linker.CURRENT_TABLE;
            }
            if (this.CURRENT_TABLE) {
                var money = this.CURRENT_TABLE.betMoney;
                if (!money) {
                    money = this.CURRENT_TABLE.minMoney;
                }
                money = Number(money);
                if (isNaN(money) == false && money > 0) {
                    var moneyDot = TQUtil.abbreviate(money);
                    this.betMoneyLabel.string = moneyDot;
                }
            }
        }
    },
    onLoad() {
        this.addSocketEvent();
    },
    updateReplayPopup: function (message) {
        if (message) {
            var messageId = Number(message.messageId);
            switch (messageId) {
                case 1103:
                    this.onLeaveTableRespone(message);
                    break;
                case 1114:
                    this.onGameEndResponse(message);
                    break;
                default:
                    break;
            }
        }
    },
    addSocketEvent() {
        Linker.Event.addEventListener(12021, this.onMatchMakingResponse, this);
        Linker.Event.addEventListener(1103, this.onLeaveTableRespone, this);

    },
    onGameEndResponse: function (message) {
        if (message) {
            this.listPlayer = message.listPlayer;
            this.checkReadyButton(message);
        }
    },
    checkReadyButton: function (message) {
        if (message) {
            var listIdOpponentOut = [];
            var listPlayerEndGame = message.listPlayer;
            if (listPlayerEndGame && Array.isArray(listPlayerEndGame) && listPlayerEndGame.length > 0) {
                for (let k = 0; k < listPlayerEndGame.length; k++) {
                    var player = listPlayerEndGame[k];
                    if (player.isOut) {
                        if (Number(player.userId) == Number(Linker.userData.userId)) {
                            this.isLeaveTable = true;
                        } else {
                            var dataLeave = {
                                cancelStatus: 0,
                                messageId: 1103,
                                newOwner: 0,
                                status: 1,
                                userId: Number(player.userId)
                            }
                            listIdOpponentOut.push(dataLeave);
                        }
                    }
                }
            }
            if (listIdOpponentOut.length > 0) {
                this.showReadyButton(false);
            } else {
                this.showReadyButton(true);
            }
        }
    },
    showReadyButton: function (enable) {
        enable = enable ? true : false;
        if (this.btnReplay) {
            if (enable) {
                this.btnReplay.interactable = true;
                this.btnReplay.node.opacity = 255;
            } else {
                this.btnReplay.interactable = false;
                this.btnReplay.node.opacity = 100;
            }

        }
    },
    showCancleFindNewPlayer: function (enable) {
        if (this.btnCancleMatching) {
            if (enable) {
                this.btnCancleMatching.node.active = true;
                this.btnCancleMatching.interactable = true;
                this.btnCancleMatching.node.opacity = 255;
                //

            } else {
                this.btnCancleMatching.node.active = false;
                this.btnCancleMatching.interactable = false;
                this.btnCancleMatching.node.opacity = 100;
            }
        }
    },
    getFindingAvatarNodeComponet: function () {
        if (this.findingAvatarNode) {
            var findingAvatarComponent = this.findingAvatarNode.getComponent("FindingPlayer");
            if (findingAvatarComponent && cc.isValid(findingAvatarComponent)) {
                return findingAvatarComponent;
            }
        }
        return null;
    },
    showAvataFinding: function () {
        var findingAvatarComponent = this.getFindingAvatarNodeComponet();
        if (findingAvatarComponent) {
            findingAvatarComponent.showRunningAvatar();
        }
    },
    showFindNewPlayer: function (enable) {
        if (this.btnNewPlay) {
            if (enable) {
                this.btnNewPlay.node.active = true;
                this.btnNewPlay.interactable = true;
                this.btnNewPlay.node.opacity = 255;
                this.showCancleFindNewPlayer(false);
            } else {
                this.btnNewPlay.node.active = false;
                this.btnNewPlay.interactable = false;
                this.btnNewPlay.node.opacity = 100;
                this.showCancleFindNewPlayer(true);
            }
        }
    },
    onLeaveTableRespone: function (message) {
        if (message) {
            if (message.status == 1) {
                if (Number(message.cancelStatus) == 1) {
                    // "Bạn vừa đăng ký rời phòng khi hết ván";
                    this.showReadyButton(false);
                } else if (Number(message.cancelStatus) == 2) {
                    // "Bạn vừa hủy rời phòng khi hết ván";
                    this.showReadyButton(true);
                } else if (Number(message.cancelStatus) == 0) {
                    // "Rời phòng khi hết ván";
                    this.showReadyButton(false);
                }
            }
        }
    },
    onMatchMakingResponse: function (message) {
        cc.log(message)
        if (message) {
            if (message.status) {
                cc.log("On matching match...", message);
            } else {
                // this.node.parent.destroy();
            }
        }
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(12021, this.onMatchMakingResponse, this);
        Linker.Event.removeEventListener(1103, this.onLeaveTableRespone, this);
    },
    start() {

    },
    onDestroy: function () {
        this.removeSocketEvent();
    }
    // update (dt) {},
});
