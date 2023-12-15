// Quan ly user leave, cac user co id khac voi minh roi ban, chi thay doi thong tin nguoi choi, khong thuc hien thao tac roi ban
var Linker = require('Linker');
var Utils = require('Utils');
var soccerConstant = require('soccerConstant');
var Constant = require('Constant');
var i18n = require('i18n');
var userInfoObj = cc.Class({
    name: "_userInfo",
    properties: {
        isMaster: 0,
        level: 0,
        exp: 0,
        score: "",
        userId: 0,
        userMoney: 0,
        userReady: false,
        isPlaying: false,
        viewName: "",
        countryId: "",
        isLeaving: false,
        details: {
            type: Object,
            default: {}
        }
    }
});
cc.Class({
    extends: cc.Component,
    createNewNodePlayer: function () {
        this.listPlayer = this.node.getChildByName("_listPlayer");
        if (!this.listPlayer || (this.listPlayer && !cc.isValid(this.listPlayer))) {
            this.listPlayer = new cc.Node();
            this.node.addChild(this.listPlayer);
            this.listPlayer.name = "_listPlayer";
        }
    },
    init: function () {
        this.createNodePlayer();
        this.addSocketEvent();
    },
    createNodePlayer: function (userInfoObj) {
        if (userInfoObj) {
            if (!this.listPlayer || (this.listPlayer && !cc.isValid(this.listPlayer))) {
                this.createNewNodePlayer();
            };
            if (this.listPlayer && cc.isValid(this.listPlayer)) {
                var player = new cc.Node();
                player.name = "userId_" + userInfoObj.userId;
                player.userInfoObj = userInfoObj;
                this.listPlayer.addChild(player);
            };
        } else {
            if (!this.listPlayer || (this.listPlayer && !cc.isValid(this.listPlayer))) {
                this.createNewNodePlayer();
            };
        }
    },
    onLoad: function () {
        this.node.on(Constant.GAME_COMMONS_EVENT.NGUOI_CHOI_HUY_ROI_BAN_DO_DA_KET_NOI_LAI, this.onCancleLeaveTable, this);
    },
    onCancleLeaveTable: function (message) {
        if (message.turnId) {
            this.setPlayerIsLeavingRoomById(message.turnId, false);
        }
    },
    addSocketEvent: function () {
        Linker.Event.addEventListener(1105, this.onJoinTableResponse, this);
        Linker.Event.addEventListener(1100, this.onCreateTableResponse, this);
        Linker.Event.addEventListener(1106, this.onPlayerJoinedResponse, this);
        Linker.Event.addEventListener(1103, this.onLeaveTableRespone, this);
        Linker.Event.addEventListener(1110, this.onPlayerReadyRespone, this);
        Linker.Event.addEventListener(1108, this.onMatchStartResponse, this);
        Linker.Event.addEventListener(1104, this.onTurnCardRespone, this);
        Linker.Event.addEventListener(3, this.onReconnectionResponse, this);
        Linker.Event.addEventListener(1114, this.onGameEndResponse, this);
    },
    removeSocketEvent: function () {
        Linker.Event.removeEventListener(1105, this.onJoinTableResponse, this);
        Linker.Event.removeEventListener(1100, this.onCreateTableResponse, this);
        Linker.Event.removeEventListener(1106, this.onPlayerJoinedResponse, this);
        Linker.Event.removeEventListener(1103, this.onLeaveTableRespone, this);
        Linker.Event.removeEventListener(1110, this.onPlayerReadyRespone, this);
        Linker.Event.removeEventListener(1108, this.onMatchStartResponse, this);
        Linker.Event.removeEventListener(1104, this.onTurnCardRespone, this);
        Linker.Event.removeEventListener(3, this.onReconnectionResponse, this);
        Linker.Event.removeEventListener(1114, this.onGameEndResponse, this);
    },
    onDestroy: function () {
        this.removeSocketEvent();
    },
    onJoinTableResponse: function (message) {
        if (this && cc.isValid(this)) {
            if (message) {
                if (message.status == 1) {
                    this.gameState = Number(message.isPlaying);
                    cc.warn("Add join to join room ...", message);
                    if (message.listPlayer && Array.isArray(message.listPlayer) && message.listPlayer.length > 0) {
                        var listPlayer = message.listPlayer;
                        for (var i = 0; i < listPlayer.length; i++) {
                            var player = listPlayer[i];
                            var userId = Number(player.userId);
                            var userInfo = this.getUserExistByUserId(userId);
                            var isCreate = false;
                            if (!userInfo) {
                                isCreate = true;
                                userInfo = new userInfoObj();
                            }
                            userInfo.details = player;
                            userInfo.isMaster = (Number(player.isMaster) == 1) ? true : false;
                            userInfo.level = Number(player.level);
                            userInfo.exp = Number(player.exp);
                            userInfo.userId = Number(player.userId);
                            userInfo.userMoney = Number(player.userMoney);
                            userInfo.viewName = player.viewName;
                            userInfo.countryId = player.countryId;
                            userInfo.avatarId = Number(player.avatarId);
                            userInfo.isPlaying = (Number(player.isPlaying) == 1) ? true : false;
                            userInfo.userReady = player.userReady;
                            if (isCreate) {
                                this.pushToListUser(userInfo);
                            }

                        }
                    }
                } else {
                    if (message.error) {
                        cc.Global.showMessage(message.error);
                    }
                }
            }
        }

    },
    onReconnectionResponse: function (message) {
        if (this && cc.isValid(this)) {
            if (message) {
                if (message.status == 1) {
                    this.gameState = Number(message.gameState);
                    cc.warn("Add join to reconnect ...", message);
                    if (message.listPlayer && Array.isArray(message.listPlayer) && message.listPlayer.length > 0) {
                        var listPlayer = message.listPlayer;
                        for (var i = 0; i < listPlayer.length; i++) {
                            var player = listPlayer[i];
                            var userId = Number(player.userId);
                            var userInfo = this.getUserExistByUserId(userId);
                            var isCreate = false;
                            if (!userInfo) {
                                isCreate = true;
                                userInfo = new userInfoObj();
                            }
                            userInfo.details = player;
                            userInfo.isMaster = (Number(player.isMaster) == 1) ? true : false;
                            userInfo.level = Number(player.level);
                            userInfo.exp = Number(player.exp);
                            userInfo.userId = Number(player.userId);
                            userInfo.userMoney = Number(player.userMoney);
                            userInfo.viewName = player.viewName;
                            userInfo.countryId = player.countryId;
                            userInfo.avatarId = Number(player.avatarId);
                            userInfo.isPlaying = player.isPlaying;
                            userInfo.userReady = false;
                            userInfo.score = player.score;
                            userInfo.isLeaving = false;
                            if (isCreate) {
                                this.pushToListUser(userInfo);
                            }
                        }
                    }
                }
            }
        }

    },

    onCreateTableResponse: function (message) {
        if (this && cc.isValid(this)) {
            if (message) {
                if (message.status == 1) {
                    this.gameState = Number(message.isPlaying);
                    cc.warn("Add join to create room ...", message);
                    if (message.player) {
                        var player = message.player;
                        var userId = Number(player.userId);
                        var userInfo = this.getUserExistByUserId(userId);
                        var isCreate = false;
                        if (!userInfo) {
                            isCreate = true;
                            userInfo = new userInfoObj();
                        }
                        userInfo.details = message.player;
                        userInfo.isMaster = true;
                        userInfo.level = Number(player.level);
                        userInfo.exp = Number(player.exp);
                        userInfo.userId = Number(player.userId);
                        userInfo.userMoney = Number(player.userMoney);
                        userInfo.viewName = player.viewName;
                        userInfo.countryId = player.countryId;
                        userInfo.avatarId = Number(player.avatarId);
                        if (isCreate) {
                            this.pushToListUser(userInfo);
                        }
                    }
                }
            }
        }

    },
    getUserExistByUserId: function (id) {
        if (this.listPlayer && cc.isValid(this.listPlayer)) {
            for (var i = 0; i < this.listPlayer.children.length; i++) {
                var player = this.listPlayer.children[i];
                if (player && cc.isValid(player) && player.userInfoObj) {
                    var userId = Number(player.userInfoObj.userId);
                    if (id == userId) {
                        return player.userInfoObj;
                    }
                }
            }
        }

        return null;
    },
    pushToListUser: function (userInfo) {
        if (userInfo) {
            this.createNodePlayer(userInfo);
        }
    },
    onPlayerJoinedResponse: function (message) {
        if (this && cc.isValid(this)) {
            if (message) {
                if (message.status == 1) {
                    cc.warn("Add join to sit room ...", message);
                    if (message.player) {
                        var player = message.player;
                        var userId = Number(player.userId);
                        var userInfo = this.getUserExistByUserId(userId);
                        var isCreate = false;
                        if (!userInfo) {
                            isCreate = true;
                            userInfo = new userInfoObj();
                        }
                        userInfo.details = message.player;
                        userInfo.isMaster = Number(player.isMaster) == 1 ? true : false;
                        userInfo.level = Number(player.level);
                        userInfo.exp = Number(player.exp);
                        userInfo.userId = Number(player.userId);
                        userInfo.userMoney = Number(player.userMoney);
                        userInfo.viewName = player.viewName;
                        userInfo.countryId = player.countryId;
                        userInfo.userReady = (player.userReady) ? true : false;
                        userInfo.avatarId = Number(player.avatarId);

                        if (isCreate) {
                            this.pushToListUser(userInfo);
                        }

                    }
                }
            }
        }

    },
    setScorePlayerById: function (userId, score) {
        if (this.listPlayer && cc.isValid(this.listPlayer)) {
            for (var i = 0; i < this.listPlayer.children.length; i++) {
                var player = this.listPlayer.children[i];
                if (player && cc.isValid(player) && player.userInfoObj) {
                    var _userId = Number(player.userInfoObj.userId);
                    if (userId == _userId) {
                        cc.warn("Một người chơi có id: " + userId + " được đánh set tỷ số là: " + score);
                        player.userInfoObj.score = score;
                    }
                }
            }
        }

    },
    onResetScoreResult: function () {
        if (this.listPlayer && cc.isValid(this.listPlayer)) {
            for (var i = 0; i < this.listPlayer.children.length; i++) {
                var player = this.listPlayer.children[i];
                if (player && cc.isValid(player) && player.userInfoObj) {
                    player.userInfoObj.score = 0;
                }
            }
        }
    },
    setAllPlayerIsLeavingRoomWithoutMe: function () {
        if (this.listPlayer && cc.isValid(this.listPlayer)) {
            for (var i = 0; i < this.listPlayer.children.length; i++) {
                var player = this.listPlayer.children[i];
                if (player && cc.isValid(player) && player.userInfoObj) {
                    var _userId = Number(player.userInfoObj.userId);
                    if (_userId != Number(Linker.userData.userId)) {
                        cc.warn("Một người chơi có id: " + _userId + " được đánh dấu như là người sẽ rời bàn ");
                        player.userInfoObj.isLeaving = true;
                    } else {
                        player.userInfoObj.isLeaving = false;
                    }
                }
            }
        }
    },
    setPlayerIsLeavingRoomById: function (userId, status) {
        if (this.listPlayer && cc.isValid(this.listPlayer)) {
            for (var i = 0; i < this.listPlayer.children.length; i++) {
                var player = this.listPlayer.children[i];
                if (player && cc.isValid(player) && player.userInfoObj) {
                    var _userId = Number(player.userInfoObj.userId);
                    if (userId == _userId) {
                        cc.warn("Một người chơi có id: " + userId + " được đánh dấu như là người sẽ rời bàn " + status);
                        player.userInfoObj.isLeaving = status;
                        return true;
                    }
                }
            }
        }
        cc.error("Không thể set status cho người chơi rời bàn có id: " + userId);
        return false;
    },
    setPlayerIsMasterRoomById: function (userId, status) {
        if (this.listPlayer && cc.isValid(this.listPlayer)) {
            for (var i = 0; i < this.listPlayer.children.length; i++) {
                var player = this.listPlayer.children[i];
                if (player && cc.isValid(player) && player.userInfoObj) {
                    var _userId = Number(player.userInfoObj.userId);
                    if (userId == _userId) {
                        cc.warn("Một người chơi có id: " + userId + " được đánh dấu như là chủ phòng");
                        player.userInfoObj.isMaster = true;
                    } else {
                        cc.warn("Một người chơi có id: " + userId + " được bỏ đánh dấu như là chủ phòng");
                        player.userInfoObj.isMaster = false;
                    }
                }
            }
        }
    },

    resetReadyStatus: function () {
        if (this.listPlayer && cc.isValid(this.listPlayer)) {
            for (var i = 0; i < this.listPlayer.children.length; i++) {
                var player = this.listPlayer.children[i];
                if (player && cc.isValid(player) && player.userInfoObj) {
                    var userId = Number(player.userInfoObj.userId);
                    if (userId) {
                        cc.warn("Một người chơi có id: " + userId + " được đánh dấu như là người hủy sẵn sàng");
                        player.userInfoObj.userReady = false;
                    }
                }
            }
        }
    },

    setPlayerIsReadyRoomById: function (userId, status) {
        if (this.listPlayer && cc.isValid(this.listPlayer)) {
            for (var i = 0; i < this.listPlayer.children.length; i++) {
                var player = this.listPlayer.children[i];
                if (player && cc.isValid(player) && player.userInfoObj) {
                    var _userId = Number(player.userInfoObj.userId);
                    if (userId == _userId) {
                        cc.warn("Một người chơi có id: " + userId + " được đánh dấu như là người đã sẵn sàng");
                        player.userInfoObj.userReady = status;
                    }
                }
            }
        }
    },

    setAllPlayerIsReadyRoom: function (status) {
        if (this.listPlayer && cc.isValid(this.listPlayer)) {
            for (var i = 0; i < this.listPlayer.children.length; i++) {
                var player = this.listPlayer.children[i];
                if (player && cc.isValid(player) && player.userInfoObj) {
                    player.userInfoObj.userReady = status;
                }
            }
        }
    },

    onLeaveTableRespone: function (message) {
        if (this && cc.isValid(this)) {
            if (message) {
                if (message.status == 1) {
                    var userId = Number(message.userId);
                    var newOwnerId = Number(message.newOwner);
                    if (isNaN(newOwnerId) == false && newOwnerId != 0) {
                        this.setPlayerIsMasterRoomById(newOwnerId, true);
                    }
                    //chi quan tam nguoi khac roi ban ma thoi
                    if (Number(Linker.userData.userId) != userId) {
                        this.setPlayerIsLeavingRoomById(userId, true);
                    } else if (Number(Linker.userData.userId) == userId) {
                        var soccerGalaxyController = this.getController();
                        if (soccerGalaxyController) {
                            if (Number(message.cancelStatus) == 0) {
                                if (Linker.isGhepDoiInGame) {
                                    this.setPlayerIsLeavingRoomById(userId, false);
                                } else {
                                    this.setPlayerIsLeavingRoomById(userId, true);
                                }
                            }
                        }
                    }
                } else {
                    // cc.error(message);
                    cc.Global.showMessage(i18n.t("Vui lòng thử lại sau"));
                }
            }
        }

    },
    onPlayerReadyRespone: function (message) {
        if (this && cc.isValid(this)) {
            if (message) {
                cc.error(message);
                if (message.status == 1) {
                    var userId = Number(message.userId);
                    if (isNaN(userId) == false && userId > 0) {
                        this.setPlayerIsReadyRoomById(userId, Number(message.isReady) == 1 ? true : false)
                    }
                } else {
                    // cc.error(message);
                    cc.Global.showMessage(i18n.t("Vui lòng thử lại sau"));

                }
            }
        }


    },
    onMatchStartResponse: function (message) {
        if (this && cc.isValid(this)) {
            if (message) {
                if (message.status == 1) {
                    this.gameState = Number(message.isPlaying);
                    this.setPlayersIsPlayingById(message.listPlayer);
                    this.setPlayersIsLeavingRoomById(message.listPlayer);
                    this.setScorePlayers(message.listPlayer);

                } else {
                    // cc.error(message);
                    cc.Global.showMessage(i18n.t("Vui lòng thử lại sau"));
                }
            }
        }

    },
    setScorePlayers: function (listPlayer) {
        if (listPlayer && Array.isArray(listPlayer)) {
            for (var i = 0; i < listPlayer.length; i++) {
                var player = listPlayer[i];
                var userId = Number(player.userId);
                if (isNaN(userId) == false && userId != 0) {
                    this.setScorePlayerById(userId, player.score);
                }
            }
        }
    },
    setPlayersIsPlayingById: function (listPlayer) {
        if (listPlayer && Array.isArray(listPlayer)) {
            for (var i = 0; i < listPlayer.length; i++) {
                var player = listPlayer[i];
                var userId = Number(player.userId);
                if (isNaN(userId) == false && userId != 0) {
                    this.setPlayerIsPlayingById(userId, true);
                }
            }
        }
    },
    setPlayersIsLeavingRoomById: function (listPlayer) {
        if (listPlayer && Array.isArray(listPlayer)) {
            for (var i = 0; i < listPlayer.length; i++) {
                var player = listPlayer[i];
                var userId = Number(player.userId);
                if (isNaN(userId) == false && userId != 0) {
                    this.setPlayerIsLeavingRoomById(userId, false);
                }
            }
        }
    },
    setPlayerIsPlayingById: function (userId, status) {
        for (var i = 0; i < this.listPlayer.children.length; i++) {
            var player = this.listPlayer.children[i];
            if (player && cc.isValid(player) && player.userInfoObj) {
                var _userId = Number(player.userInfoObj.userId);
                if (userId == _userId) {
                    cc.warn("Một người chơi có id: " + userId + " được đánh dấu như là người đã sẵn sàng");
                    player.userInfoObj.isPlaying = status;
                }
            }
        }
    },
    getPlayerInfoIsNotLeaveById: function (userId) {
        for (var i = 0; i < this.listPlayer.children.length; i++) {
            var player = this.listPlayer.children[i];
            if (player && cc.isValid(player) && player.userInfoObj) {
                var _userId = Number(player.userInfoObj.userId);
                if (userId == _userId) {
                    if (!player.userInfoObj.isLeaving) {
                        return player.userInfoObj;
                    }
                }
            }
        }
        return null;
    },
    onTurnCardRespone: function (message) {
        if (this && cc.isValid(this)) {
            if (message) {
                if (message.status == 1) {
                    var shootStatus = Number(message.shootStatus);
                    switch (shootStatus) {
                        case soccerConstant.TABLE_STATUS.XOAY_GAY:
                            break;
                        case soccerConstant.TABLE_STATUS.SHOOT_BONG:
                            break;
                        case soccerConstant.TABLE_STATUS.GUI_KET_QUA:
                            this.setScorePlayers(message.listPlayer);
                            break;
                        default:
                            break;
                    }

                } else {
                    // cc.error(message);
                    cc.Global.showMessage(i18n.t("Vui lòng thử lại sau"));
                }
            }
        }

    },
    onGameEndResponse: function (message) {
        if (this && cc.isValid(this)) {
            if (message) {
                if (message.status == 1) {
                    if (message.listPlayer && Array.isArray(message.listPlayer) && message.listPlayer.length > 0) {
                        var listPlayer = message.listPlayer;
                        for (var i = 0; i < listPlayer.length; i++) {
                            var player = listPlayer[i];
                            if (player) {
                                var isOut = Number(player.isOut) == 1 ? true : false;
                                var userId = Number(player.userId);
                                if (isOut) {
                                    this.setPlayerIsLeavingRoomById(userId, true);
                                } else {
                                    this.setPlayerIsLeavingRoomById(userId, false);
                                }
                            }
                        }
                    }
                    this.setAllPlayerIsReadyRoom(false);
                    var newOwnerId = Number(message.newOwner);
                    if (isNaN(newOwnerId) == false && newOwnerId != 0) {
                        this.setPlayerIsMasterRoomById(newOwnerId, true);
                    }
                } else {
                    // cc.error(message);
                    cc.Global.showMessage(i18n.t("Vui lòng thử lại sau"));
                }
            }
        }

    },
    getListUser: function () {
        return this.listPlayer;
    },
    removeListUserBeforeLeave: function () {
        this.listPlayer.removeAllChildren(true);
    },
    getPlayerById: function (userId) {
        for (var i = 0; i < this.listPlayer.children.length; i++) {
            var player = this.listPlayer.children[i];
            if (player && cc.isValid(player) && player.userInfoObj) {
                var _userId = Number(player.userInfoObj.userId);
                if (userId == _userId) {
                    return player;
                }
            }
        }
        return null;
    },
    getController: function () {
        return this.node.getComponent("soccerGalaxyGameController");
    },
    removePlayerLeaving: function (lisPlayerLeaving) {
        cc.error("remove now now now", lisPlayerLeaving);
        if (lisPlayerLeaving && Array.isArray(lisPlayerLeaving) && lisPlayerLeaving.length > 0) {
            for (var i = 0; i < lisPlayerLeaving.length; i++) {
                var player = this.getPlayerById(Number(lisPlayerLeaving[i]));
                if (player) {
                    player.destroy();
                    player.removeFromParent(true);
                }
            }
        } else if (lisPlayerLeaving) {
            var player = this.getPlayerById(Number(lisPlayerLeaving.userId));
            if (player) {
                player.destroy();
                player.removeFromParent(true);
            }
        }
        var soccerGalaxyController = this.getController();
        if (soccerGalaxyController) {
            soccerGalaxyController.updatePlayerWatching();
        }
    }
});
