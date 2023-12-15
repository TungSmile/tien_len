var Linker = require('Linker');
var SocketConstant = require('SocketConstant');
var TLMNConstant = require('TLMNConstant');
var Player = require('Player');
var CardUtils = require('CardUtils');
var PhomCard = require('PhomCard');
var TLMNParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            // case 1100:{
            //     return this.CreateTableResponse(tempData.messageId, tempData.status, tempData.data);
            // }
            case 1114: {
                return this.GameEndResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1112: {
                return this.GetPockerResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1105: {
                return this.JoinTableResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1106: {
                return this.PlayerJoinedResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 3: {
                return this.ReconnectionResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1104: {
                return this.TurnCardResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1242: {
                return this.SettingResponse(tempData.messageId, tempData.status, tempData.data);
            }
        }
    },

    // CreateTableResponse(messageId, status, data){
    //     cc.log("TLMN_CreateTableResponse", data);
    //     var message = {
    //         messageId: messageId,
    //         status: status
    //     };
    //     if(status){

    //     }
    //     return message;
    // },

    GameEndResponse(messageId, status, data) {
        cc.log("TLMN_GameEndResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var info = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log("value, info: ", value, info);
            message.winPlayerId = info[0];
            var pt = info[1];
            if (pt > 0) {
                message.winType = pt;
            }
            else if (pt < 0) {
                message.winType = TLMNConstant.TYPE_WIN.CHAT_TU_QUY_WIN;
                var isFight = value.length == 3;
                if (isFight) {
                    var fightParam = value[2].split(SocketConstant.SEPERATOR.ELEMENT);
                    message.beFightenId = fightParam[0];
                    message.fightenId = fightParam[1];
                    message.fightenMoney = fightParam[2];
                    if (fightParam[3] == 1) {
                        message.preFightenId = fightParam[4];
                        message.preFightenMoney = fightParam[5];
                    }
                }
            }
            else {
                message.winType = TLMNConstant.TYPE_WIN.NORMAL_WIN;
            }

            if (info.length == 3) {
                message.newMasterId = info[2];
            }

            if (info.length == 4) {
                message.newMasterId = info[2];
            }


            if (info.length == 5) {
                if (info[3].length > 0) {
                    message.turnedCardList = [];
                    // message.lastTurnedCardList = [];
                    var arrCard = info[3].split('#');
                    for (var i = 0; i < arrCard.length; i++) {
                        var card = new PhomCard();
                        card.setServerValue(arrCard[i]);
                        // cc.log("i: ", card);
                        message.turnedCardList.push(card);
                    }
                }
                message.newMasterId = info[4];
            }

            if (info.length > 5) {
                if (info[3] == 1) {
                    message.isDutyComplete = 1;
                }
                if (info[4].length > 0) {
                    // message.turnedCardList = info[4];
                    message.turnedCardList = [];
                    // message.lastTurnedCardList = [];
                    var arrCard = info[4].split('#');
                    for (var i = 0; i < arrCard.length; i++) {
                        var card = new PhomCard();
                        card.setServerValue(arrCard[i]);
                        // cc.log("i: ", card);
                        message.turnedCardList.push(card);
                    }
                }
                message.newMasterId = info[5];
            }

            var roomParam = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            cc.log("ROOM PARAM: ", roomParam);
            message.playerList = [];
            for (var i = 0; i < roomParam.length; i++) {
                var playerResult = roomParam[i].split(SocketConstant.SEPERATOR.ELEMENT);
                cc.log("PLAYER RESULT: ", playerResult);
                var player = new Player();
                player.userId = playerResult[0];
                player.resultMoney = playerResult[1];
                player.cardList = [];
                var arrCard = playerResult[3].split("#");
                for (var j = 0; j < arrCard.length; j++) {
                    var card = new PhomCard();
                    card.setServerValue(arrCard[j]);
                    player.cardList.push(card);
                }
                if (playerResult[4] == 1) {
                    player.isOut = 1;
                }
                if (playerResult[5] == 1) {
                    player.isBankrupt = 1;
                }
                if (!isNaN(playerResult[6])) {
                    player.level = playerResult[6];
                }
                player.levelUpMoney = playerResult[7];
                message.playerList.push(player);
            }
            if (value.length > 2) {
                var nohuData = value[2].split(SocketConstant.SEPERATOR.ELEMENT);
                if (nohuData.length > 0) {
                    message.idUserAnHu = nohuData[1];
                    message.moneyAnHu = nohuData[2];
                }
            }
        }
        else {
            message.error = data;
        }
        return message;
    },

    GetPockerResponse(messageId, status, data) {
        cc.log("TLMN_GetPockerResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.beginPlayerId = tempArray[0];
            message.cardOwnerList = CardUtils.parsePhomCard(tempArray[1]);
            message.dutyType = tempArray[2];
            message.listPlayer = tempArray[3].split("#");


        } else {
            message.error = data;
        }
        return message;
    },

    JoinTableResponse(messageId, status, data) {
        cc.log("TLMN_JoinTableResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var gameInfo = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log("value: ", value);
            cc.log("gameInfo: ", gameInfo);
            message.tableId = gameInfo[0];
            message.minMoney = gameInfo[1];
            message.isPlaying = gameInfo[2];
            message.maxCapacity = gameInfo[3];
            message.roomName = gameInfo[4];
            message.tableIndex = gameInfo[5];
            // message.isAn = gameInfo[6];
            // message.isTaiGui = gameInfo[7];
            // message.dutyType = gameInfo[8];
            message.currentPlayerId = gameInfo[8];
            // message.cardLeft = gameInfo[10];
            message.listPlayer = [];
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            cc.log('playerStr: ', playerStr);
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                cc.log("p: ", p);
                var player = new Player();
                player.userId = p[0];
                player.viewName = p[1];
                player.avatarId = p[2]
                player.userMoney = p[3];
                player.isReady = p[4];
                player.isObserver = p[5];
                if (i == 0) {
                    player.isMaster = 1;
                    player.isReady = 1
                } else {
                    player.isMaster = 0;
                }
                if (message.isPlaying == 1) {
                    if (player.userId == Linker.userData.userId || player.isObserver == 1) {
                        player.state = 0;
                    } else {
                        player.state = 2;
                    }
                } else {
                    if (player.isReady == 1) {
                        player.state = 1;
                    } else {
                        player.state = 0;
                    }
                }
                player.socay = p[7];
                message.listPlayer.push(player);
            }
            if (Linker && Linker.Lobby && Linker.Lobby.CurrentBetting) {
                Linker.Lobby.CurrentBetting = Number(message.minMoney);
            }
        } else {
            message.error = data;
        }

        return message;
    },

    PlayerJoinedResponse(messageId, status, data) {
        cc.log("TLMN_PlayerJoinedResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            var player = new Player();
            player.userId = tempArray[0];
            player.viewName = tempArray[1];
            player.avatarId = tempArray[2];
            player.userMoney = tempArray[3];
            player.state = 0;
            player.isMaster = 0;
            message.player = player;

        } else {
            message.error = data;
        }
        return message;
    },

    ReconnectionResponse(messageId, status, data) {
        cc.log("TLMN_ReconnectionResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };

        if (status == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var gameInfo = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log("value, gameInfo: ", value, gameInfo);
            message.minMoney = gameInfo[0];
            message.tableIndex = gameInfo[1];
            message.isPlaying = gameInfo[2];
            message.tableId = gameInfo[8];
            if (gameInfo[6] == 0) {
                message.isNewRound = true;
            } else {
                message.lastTurnedCardList = [];
                var arrCard = gameInfo[6].split('#');
                for (var i = 0; i < arrCard.length; i++) {
                    var card = new PhomCard();
                    card.setServerValue(arrCard[i]);
                    // cc.log("i: ", card);
                    message.lastTurnedCardList.push(card);
                }
                // message.lastTurnedCardList = gameInfo[6];
                message.isNewRound = false;
            }
            message.isNewRound = gameInfo[6];
            message.maxCapacity = gameInfo[10];
            // message.roomName = gameInfo[4];
            message.dutyType = gameInfo[4];
            message.currentPlayerId = gameInfo[5];
            message.selfCardList = CardUtils.parsePhomCard(gameInfo[7]);

            message.listPlayer = [];
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                cc.log(p);
                var player = new Player();
                player.userId = p[0];
                player.viewName = p[1];
                player.avatarId = p[2]
                player.userMoney = p[3];
                player.isReady = p[4];
                player.isObserver = p[5];
                player.socay = p[7];
                if (i == 0) {
                    player.isMaster = 1;
                } else {
                    player.isMaster = 0;
                }
                if (message.isPlaying == 1) {
                    if (player.userId == Linker.userData.userId || player.isObserver == 1) {
                        player.state = 2;
                    } else {
                        player.state = 2;
                    }
                } else {
                    if (player.isReady == 1) {
                        player.state = 1;
                    } else {
                        player.state = 0;
                    }
                }
                if (p.length > 7 && message.isPlaying == 1) {
                    var turnedCardList = CardUtils.parsePhomCard(p[7]);
                    if (turnedCardList != null) {

                        player.turnedCardList = turnedCardList;
                    }
                }
                if (p.length > 8 && message.isPlaying == 1) {
                    var takenCardList = CardUtils.parsePhomCard(p[8]);
                    if (takenCardList != null) {

                        player.takenCardList = takenCardList;
                    }
                }
                if (p.length > 9 && message.isPlaying == 1) {
                    var listPhom = CardUtils.parsePhom(p[9]);
                    if (listPhom != null) {

                        player.phomList = listPhom;
                    }
                }
                message.listPlayer.push(player);
            }


        } else {
            message.error = data;
        }

        return message;
    },

    SettingResponse(messageId, status, data) {
        cc.log("TLMN_SettingResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.minMoney = tempArray[0];
            message.capacity = tempArray[1];
            message.isHiddenCard = tempArray[2];
        } else {
            message.error = data;
        }
        return message;
    },

    TurnCardResponse(messageId, status, data) {
        cc.log("TLMN_TurnCardResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.turnId = tempArray[0];
            message.nextTurnId = tempArray[1];

            message.card = [];

            if (tempArray[2]) {
                var listCard = tempArray[2].split("#");
                listCard.forEach(item => {
                    var card = new PhomCard();
                    card.setServerValue(item);
                    message.card.push(card);
                });
            }



            cc.log("LIST CARD: ", message.card);
            // var card = new PhomCard();
            // card.setServerValue(tempArray[2]);
            // message.card = card;
            if (tempArray[3] == 1) message.isDoneDuty = true;
            else message.isDoneDuty = false;
            if (tempArray[4] == 1) message.isSkip = true;
            else message.isSkip = false;
            if (tempArray[5] == 1) message.isNewRound = true;
            else message.isNewRound = false;

            if (tempArray.length > 6) {
                message.isHang = true;

                message.beFightenPlayerId = tempArray[6];
                message.fightenPlayerId = tempArray[7];
                message.fightenMoney = tempArray[8];
                if (tempArray[9] == 1) {
                    message.preBeFightenPlayerId = tempArray[10];
                    message.preFightenMoney = tempArray[11];
                }
            }
        } else {
            message.error = data;
        }
        return message;
    }
}
module.exports = TLMNParse;