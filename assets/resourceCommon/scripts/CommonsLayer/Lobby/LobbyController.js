var CommonSend = require('CommonSend');
var soccerConstant = require('soccerConstant');
var Utils = require('Utils');
var Linker = require('Linker');
var Constant = require('Constant');
var NewAudioManager = require('NewAudioManager');
var LobbySend = require('LobbySend');
var i18n = require('i18n');
export var LobbyController = cc.Class({
    extends: cc.Component,

    properties: {
        lobbyView: cc.Node
    },
    init: function (data) {
        if (data) {
            this.data = data;
        }
        if (this.data && this.isStarted) {
            this.firstConfigLobby(this.data);
        }
    },
    addCustomEvent: function () {
        // cc.error("Add Lobby Customevent...");
        this.node.on(Constant.GAME_LOBBY_EVENT.LOBBY_YEU_CAU_LOC_BAN_THEO_MENH_GIA, this.onSortTableAsBetMoney, this);
        this.node.on(Constant.GAME_LOBBY_EVENT.LOBBY_ITEM_BAN_YEU_CAU_BLOCK_SU_KIEN_CLICK, this.activeBlockLobby, this);
        this.node.on(Constant.GAME_COMMONS_EVENT.UPDATE_MONEY_TYPE, this.onUpdateMoneyType, this);
    },

    addEventListener: function () {
        Linker.Event.addEventListener(110701, this.onGetListTable, this);
        Linker.Event.addEventListener(1241, this.onGetTableData, this);
        // Linker.Event.addEventListener(12021, this.onGhepDoiResponse, this);

        //test
        Linker.Event.addEventListener(1100, this.OnCreateTableResponse, this);
        Linker.Event.addEventListener(1105, this.OnJoinTableResponse, this);
        Linker.Event.addEventListener(1106, this.OnPlayerJoinResponse, this);
    },
    OnCreateTableResponse(message) {
        cc.error("TEST CREATE", message);
    },
    OnJoinTableResponse(message) {
        cc.error("TEST JOIN", message);
    },
    OnPlayerJoinResponse(message) {
        cc.error("TEST JOINED", message);
    },
    removeEventListener() {
        Linker.Event.removeEventListener(1100, this.OnCreateTableResponse, this);
        Linker.Event.removeEventListener(1105, this.OnJoinTableResponse, this);
        Linker.Event.removeEventListener(1106, this.OnPlayerJoinResponse, this);
        Linker.Event.removeEventListener(110701, this.onGetListTable, this);
        Linker.Event.removeEventListener(1241, this.onGetTableData, this);
        // Linker.Event.removeEventListener(12021, this.onGhepDoiResponse, this);
    },
    onDestroy: function () {
        this.removeEventListener();
    },
    firstConfigLobby: function (data) {
        var lobbyViewScript = this.getLobbyViewComponent();
        if (lobbyViewScript) {
            this.addCustomEvent();
            this.addEventListener();
            //xem linker nhu nao da =)
            var dataReconnection = this.getDataReconnection();
            var isReconnect = dataReconnection.isReconnect;
            var dataJoinInvite = this.getDataJoinInvite();
            var isJoinInvite = dataJoinInvite.isJoinInvite;
            var dataLobby = {
                isReconnect: isReconnect ? true : false,
                isJoin: isJoinInvite ? true : false
            }
            if (isReconnect) {
                dataLobby.matchId = dataReconnection.matchId;
            } else if (isJoinInvite) {
                dataLobby.matchId = dataJoinInvite.matchId;
                dataLobby.zoneId = dataJoinInvite.zoneId;
                dataLobby.data = dataJoinInvite.data;
                dataLobby.userInviteId = dataJoinInvite.userInviteId;
            }
            lobbyViewScript.init(dataLobby);
        }
    },
    start() {
        this.isStarted = true;
        if (Linker && Linker.userData) {
            var data = this.data;
            if (data) {
                this.firstConfigLobby(data);
            }
        } else {
            // cc.error("Gam loi....")
        }

        //nếu k có list bàn sẽ gửi lại
        var lobbyViewScript = this.getLobbyViewComponent();
        this.scheduleOnce(() => {
            if (Linker.ZONE && lobbyViewScript) {
                var data = CommonSend.joinZone(Linker.ZONE, 0);
                Linker.Socket.send(data);
            }
        }, 0.5);
    },
    onEnable () {
        if (Linker.requestQuickPlayGame == true) {
            this.requestQuickPlay();
            Linker.requestQuickPlayGame = false;
        }

    },
    // onGhepDoiResponse(message) {
    //     cc.error("GHEP DOI", message);
    //     var lobbyViewScript = this.getLobbyViewComponent();
    //     lobbyViewScript.showMatchMaking(true);
    //     var matchMakingScript = lobbyViewScript.commonContainerTopBottom.getChildByName("matchMaking").getComponent("matchMaking");
    //     Linker.MatchMakingScript = matchMakingScript;
    //     matchMakingScript.setContentNotification(message.content);
    // },
    activeBlockLobby: function (event) {
        var lobbyViewScript = this.getLobbyViewComponent();
        if (lobbyViewScript) {
            lobbyViewScript.activeBlockLobby(event);
            // if (event.enableBlock) {
            //     this.removeEventListener();
            // }
        }
    },
    onUpdateMoneyType: function (event) {
        var lobbyViewScript = this.getLobbyViewComponent();
        if (lobbyViewScript) {
            lobbyViewScript.onUpdateMoneyType(event);
        }
    },
    resetConfig: function () {
        Linker.Lobby.CurrentBetting = null;
    },
    getDataReconnection: function () {
        var reconnectData = {};
        if (Linker && Linker.userData) {
            if (Linker.userData.lastRoom) {
                var currenZoneId = Number(Linker.userData.zoneId);
                var matchId = Number(Linker.userData.lastRoom);
                if (currenZoneId && matchId) {
                    Linker.ZONE = currenZoneId;
                    reconnectData = {
                        isReconnect: true,
                        matchId: Number(Linker.userData.lastRoom)
                    }
                }
            } else if (Linker && Linker.ZONE && Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.tableId) {
                reconnectData = {
                    isReconnect: true,
                    matchId: Number(Linker.CURRENT_TABLE.tableId)
                }
                // cc.error("Yeu cau reconnect game...", Linker.CURRENT_TABLE);
                cc.Global.showMessage(i18n.t("error_match_started"));
            }
        }
        return reconnectData;
    },
    getDataJoinInvite: function () {
        var joinInviteData = {};
        if (Linker.joinInviteData) {
            var _joinInviteData = Linker.joinInviteData;
            Linker.joinInviteData = null;
            joinInviteData.isJoinInvite = true;
            joinInviteData.matchId = Number(_joinInviteData.matchID);
            joinInviteData.zoneId = Number(_joinInviteData.zoneID);
            joinInviteData.data = _joinInviteData;
            // matchID: "88214"
            // minBetCash: "500"
            // playerInviteId: "95395"
            // playerNameInvite: "manhuni1s"
            // tableID: ""
            // zoneID: "8"
            joinInviteData.userInviteId = Number(_joinInviteData.playerInviteId);
            return joinInviteData;
        }
        return joinInviteData;
    },
    getLobbyViewComponent: function () {
        if (this.lobbyView.getComponent("LobbyViewGhepDoi"))
            return this.lobbyView.getComponent("LobbyViewGhepDoi");
        else
            return this.lobbyView.getComponent("LobbyView");
    },

    getActiveBet: function (dataRooms, listBet) {
        // tổng hợp bàn đang chơi
        var playingRoomList = [];
        var betAccessList = [];
        var activeBet = null;
        var index = 0;
        if (Linker.ZONE != 4 && Linker.ZONE != 14) {
            for (var i = 0; i < listBet.length; i++) {
                if (listBet[i].canAccess) {
                    betAccessList.push(listBet[i]);
                }
            }
            if (betAccessList.length > 0) {
                index = Utils.Malicious.randomMinMax(0, betAccessList.length - 1, true);
                activeBet = betAccessList[index].minBet;
            }
        } else {
            for (var i = 0; i < dataRooms.length; i++) {
                if (Number(dataRooms[i].tableSize) > 0) {
                    playingRoomList.push(dataRooms[i]);
                }
            }
            //lọc mức cược đc chơi nhiều nhất, k có bàn nào thì random
            if (playingRoomList.length > 0) {
                index = Utils.Malicious.randomMinMax(0, playingRoomList.length - 1, true);
                activeBet = playingRoomList[index].firstCashBet;
            } else {
                index = Utils.Malicious.randomMinMax(0, dataRooms.length - 1, true);
                activeBet = dataRooms[index].firstCashBet;
            }
        }
        return activeBet;
    },

    onGetListTable: function (message) {
        cc.Global.hideLoading();
        if (message.status == 1) {
            cc.log(message);
            var dataRooms = this.createListTable(message.rooms);
            if (dataRooms && Array.isArray(dataRooms) && dataRooms.length > 0) {
                var lobbyViewScript = this.getLobbyViewComponent();
                if (lobbyViewScript) {
                    //var betMoney = Number(dataRooms[0].firstCashBet);
                    Linker.Lobby.minBet = Number(dataRooms[0].firstCashBet);
                    var listBet = this.getListBetMoney(message.rooms);
                    // var betMoney = -1;
                    var betMoney = this.getActiveBet(dataRooms, listBet);
                    if (Linker.Lobby.CurrentBetting) {
                        if (this.checkBetMoneyExistIn(Linker.Lobby.CurrentBetting, dataRooms)) {
                            betMoney = Linker.Lobby.CurrentBetting;
                        }
                    }
                    Linker.Lobby.CurrentBetting = betMoney;
                    if (Linker.ZONE != 4 && Linker.ZONE != 14) {
                        lobbyViewScript.filterBets(dataRooms, listBet);
                        // lobbyViewScript.filterRooms(Linker.Lobby.CurrentBetting);
                    } else {
                        lobbyViewScript.InitGameBaiRooms(dataRooms);
                    }
                }
            }
        } else {
            // cc.error(message);
            cc.Global.showMessage(i18n.t("Vui lòng thử lại sau"));
            var customEvent = new cc.Event.EventCustom(Constant.GAME_COMMONS_EVENT.YEU_CAU_BACK_TO_HOME, true);
            this.node.dispatchEvent(customEvent);
        }
    },
    getListBetMoney(listRoom) {
        var listBet = [];
        for (var room of listRoom) {
            listBet.push({
                minBet: Number(room.minCash),
                canAccess: room.canAccess,
                levelAccess: room.levelAccess,
                online: room.online
            })
        }
        return listBet.sort((a, b) => a.minBet - b.minBet);
    },
    onSortTableAsBetMoney: function (event) {
        var lobbyViewScript = this.getLobbyViewComponent();
        if (lobbyViewScript) {
            if (event && event.betMoney) {
                event.betMoney = Number(event.betMoney);
                Linker.Lobby.CurrentBetting = event.betMoney;
                if (Linker.tableData /*&& this.checkBetMoneyExistIn(event.betMoney, Linker.tableData)*/) {
                    lobbyViewScript.filterRooms(event.betMoney,event.data);
                } else {
                    lobbyViewScript.requestDataJoinZone();
                }
            } else {
                lobbyViewScript.requestDataJoinZone();
            }
        }
    },
    requestDataJoinZone: function () {
        var lobbyViewScript = this.getLobbyViewComponent();
        if (lobbyViewScript) {
            console.log('--4');
            lobbyViewScript.requestDataJoinZone();
        }
    },
    checkBetMoneyExistIn: function (betMoney, dataRooms) {
        if (betMoney && dataRooms) {
            if (Array.isArray(dataRooms) && dataRooms.length > 0) {
                for (let i = 0; i < dataRooms.length; i++) {
                    var currentBetMoney = Number(dataRooms[i].firstCashBet);
                    if (currentBetMoney == Number(betMoney)) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    createListTable: function (rooms) {
        var tempData = [];
        for (var i = 0; i < rooms.length; i++) {
            for (var j = 0; j < rooms[i].tables.length; j++) {
                if (rooms[i].tables[j].tableIndex == -1) {
                    rooms[i].tables[j].maxNumberPlayer = 4;
                }
                var firstCashBet = Number(rooms[i].tables[j].firstCashBet);
                if (isNaN(firstCashBet) == false && firstCashBet > 0) {
                    tempData.push(rooms[i].tables[j]);
                }
            }
        }

        tempData.sort(function (a, b) {
            var keyA = Number(a.firstCashBet),
                keyB = Number(b.firstCashBet);
            if (keyA < keyB) return -1;
            if (keyA > keyB) {
                return 1;
            } else if (keyA == keyB) {
                if (Number(a.tableIndex) > 0) {
                    return -1;
                } else {
                    return 1;
                }
            }
            return 0;
        });

        for (var j = 0; j < tempData.length; j++) {
            tempData[j].pos = j + 1;
        }
        cc.log(tempData);
        Linker.tableData = tempData;
        return tempData;
        // this.addRooms(tempData);
    },
    onGetTableData: function (message) {
        if (message.status == 1) {
            cc.log(message);
        } else {
            // cc.error(message);
            cc.Global.showMessage(i18n.t("Vui lòng thử lại sau"));
        }
    },

    CreateRoomClick() {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.CREATE_TABLE_ADD_ROOM, true);
        this.node.dispatchEvent(customEvent);
    },
    requestQuickPlay: function () {
        //chưa có bàn phải tạo bàn trước rồi điền data sau, không gửi xong rồi mới chờ để điền data vào
        var customEvent = new cc.Event.EventCustom(Constant.GAME_LOBBY_EVENT.LOBBY_YEU_CAU_TAO_BAN_CHOI, true);
        customEvent.isQuickPlayLobby = true;
        this.node.dispatchEvent(customEvent);
    },
});
