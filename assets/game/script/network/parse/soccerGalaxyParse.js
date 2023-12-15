var Linker = require('Linker');
var SocketConstant = require('SocketConstant');
var soccerConstant = require('soccerConstant');
var Player = require('Player');
var Utils = require('Utils');

var soccerGalaxyParse = {
    parse(message) {
        var tempData = message;
        tempData.status = Number(tempData.status);
        tempData.messageId = Number(tempData.messageId);
        switch (Number(tempData.messageId)) {
            case 1114: {
                cc.log("SG: GameEndResponse", tempData);
                if (Linker.ZONE == soccerConstant.ZONE_ID.ZONE_1VS1) {
                    return this.GameEndResponse(tempData.messageId, tempData.status, tempData.data);
                }
                break;
            }
            case 1105: {
                cc.log("SG: JoinTableResponse1vs1", tempData);
                if (Linker.ZONE == soccerConstant.ZONE_ID.ZONE_1VS1) {
                    return this.JoinTableResponse1vs1(tempData.messageId, tempData.status, tempData.data);
                }
                break;
            }
            case 1106: {
                cc.log("SG: PlayerJoinedResponse", tempData);
                return this.PlayerJoinedResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 3: {
                cc.log("SG: ReconnectionResponse", tempData);
                return this.ReconnectionResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1104: {
                cc.log("SG: TurnCardResponse1vs1", tempData);
                if (Linker.ZONE == soccerConstant.ZONE_ID.ZONE_1VS1) {
                    return this.TurnCardResponse1vs1(tempData.messageId, tempData.status, tempData.data);
                }
                break;
            }
            case 1242: {
                cc.log("SG: SettingResponse", tempData);
                return this.SettingResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1108: {
                cc.log("SG: MatchStartResponse", tempData);
                return this.MatchStartResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1303: {
                cc.log("SG: ChatZoneResponse", tempData);
                return this.ChatZoneResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 73: {
                cc.log("SG: CheckFriendResponse", tempData);
                return this.CheckFriendResponse(tempData.messageId, tempData.status, tempData.data);
            }
            default: {
                break;
            }
        }
    },
    CheckFriendResponse(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        }
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.userId = Number(tempArray[0]);
            message.isFriend = (Number(tempArray[1]) == 1) ? true : false;
        }
        return message;
    },
    ChatZoneResponse(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        }
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.type = tempArray[0];
            message.listChat = [];
            var length = tempArray.length;
            for (let index = 1; index < length; index += 2) {
                message.listChat.push({
                    username: tempArray[index],
                    chat: Utils.Decoder.decode(tempArray[index + 1]),
                })
            }
        }
        return message;
    },
    MatchStartResponse(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            cc.error("Soccer Galaxy bat dau tran dau 1108", data);
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var tempArray1 = tempArray[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.turnId = tempArray1[0];

            message.leftTime = Number(tempArray1[1]);
            message.playTime = message.leftTime;


            var listPlayerIdInGame = [];
            message.listPlayer = [];
            message.isPlaying = 1;
            if (Linker.ZONE == soccerConstant.ZONE_ID.ZONE_1VS1) {
                var tempArrayPlayer = tempArray[1].split(SocketConstant.SEPERATOR.ARRAY);
                for (let i = 0; i < tempArrayPlayer.length; i++) {
                    var player = tempArrayPlayer[i].split(SocketConstant.SEPERATOR.ELEMENT);
                    if (player.length >= 2) {
                        var playerId = Number(player[0])

                        var isLeft = player[1] == 'true' ? true : false;
                        var currentPositions = player[2];
                        if (listPlayerIdInGame.indexOf(playerId) == -1) {
                            listPlayerIdInGame.push(playerId);
                        }
                        var playerType = player[3];
                        player.isBot = playerType != 0 ? true : false;
                        player.playerId = playerId;
                        player.userId = playerId;
                        player.score = 0;
                        player.countGoal = 0;
                        player.playerType = playerType;
                        player.isLeft = isLeft;
                        player.currentPositions = currentPositions;
                        message.listPlayer.push(player);
                    }
                }
            }
            message.listPlayerIdInGame = listPlayerIdInGame;
            cc.log('*** bai cua ai thi ng day choi', tempData, message);
        } else {
            message.error = data;
        }
        return message;
    },
    GameEndResponse(messageId, status, data) {
        cc.log("Soccer Galaxy _GameEndResponse 11", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            message.listPlayer = [];
            message.listPlayerID = [];
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var info = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log("value, info: ", value, info);
            message.winPlayerId = info[0];
            message.userIdNohu = info[1];
            message.moneyNohu = info[2];
            message.newOwnerId = info[3];
            var listPlayer = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            cc.log("ROOM PARAM: ", listPlayer);
            message.listPlayer = [];
            message.listPlayerID = [];
            for (var i = 0; i < listPlayer.length; i++) {
                var playerResult = listPlayer[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = {
                    userId: Number(playerResult[0]),
                    userMoney: Number(playerResult[1]),
                    resultMoney: Number(playerResult[2]),
                    countWin: Number(playerResult[3]),
                    countGoal: Number(playerResult[4]),//so ban thang
                    score: Number(playerResult[4]),//so ban thang
                    countOwnGoal: Number(playerResult[5]),//phan luoi
                    isOut: Number(playerResult[6]),
                    isNotEnoughMoney: Number(playerResult[7]),
                    level: playerResult[8],
                    levelUpMoney: playerResult[9]
                };
                message.listPlayerID.push(player.userId);
                if (Number(player.userId) == Number(message.winPlayerId)) {
                    message.winMoney = player.userMoney;
                } else {
                    message.loseMoney = player.userMoney;
                }
                message.listPlayer.push(player);
            }
        } else {
            message.error = data;
        }
        return message;
    },
    JoinTableResponse1vs1: function (messageId, status, data) {
        cc.log("Soccer_JoinTableResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (Number(status) == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var gameInfo = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.tableId = gameInfo[0];
            message.minMoney = gameInfo[1];
            message.isPlaying = gameInfo[2];
            message.maxCapacity = gameInfo[3];
            message.roomName = gameInfo[4];
            message.tableIndex = gameInfo[5];
            // message.isAn = gameInfo[6];
            // message.isTaiGui = gameInfo[7];
            // message.dutyType = gameInfo[8];

            // message.cardLeft = gameInfo[10];
            message.listPlayer = [];
            message.dataBall = [];
            message.ballEat = [];
            message.playTime = 0;
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            var listPlayerId = [];
            var listPlayerIdInGame = [];
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = new Player();
                player.userId = p[0];
                player.viewName = p[1];
                player.avatarId = p[2]
                player.userMoney = p[3];
                player.isReady = Number(p[4]);
                player.isObserver = p[5];
                player.level = p[6];
                message.currentPlayerId = Number(p[7]);
                player.countryId = !!p[8] ? p[8] : "w";
                player.playerType = p[9];
                player.isBot = player.playerType != 0 ? true : false;
                player.utype = p[9];
                player.styleId = p[10];
                player.currentPositions = p[11];
                player.formationPlayer = p[12];
                player.isLeft = (p[13] == "true") ? true : false;
                player.score = Number(p[14]);
                player.isPlaying = (Number(player.isObserver) == 1) ? false : true;
                player.isPlaying = (Number(message.isPlaying) == 1) ? player.isPlaying : false;
                var playerId = Number(player.userId);
                if (player.isPlaying) {
                    var ballPositionData = cc.v2(0, 0);
                    if (Utils.Malicious.isJsonString(p[15])) {
                        ballPositionData = JSON.parse(p[15]);
                    }
                    message.ballX = Number(ballPositionData.x);
                    message.ballY = Number(ballPositionData.y);
                    if (listPlayerIdInGame.indexOf(playerId) == -1) {
                        listPlayerIdInGame.push(playerId);
                    }

                }
                if (p[16]) {
                    message.playTime = Number(p[16]);
                }
                if (i == 0) {
                    player.isMaster = 1;

                    // player.isReady = 1;
                } else {
                    player.isMaster = 0;
                }
                if (Number(message.isPlaying) == 1) {
                    //nếu trận đấu bắt đầu rồi thì phải gửi về người chơi nào bên trái, người chơi nào bên phải,
                    //sau đấy sẽ sắp xếp đội hình chính, còn những player khác sẽ được push vào đang xem.
                    cc.error("Warning.. xu ly gap cho nay, tran dau da choi co nguoi vao ban de xem");
                    message.turnId = Number(p[17]);
                    player.state = 0;
                    player.userReady = false;
                    //dang xem mode
                } else {
                    player.score = "";
                    if (player.isReady == 1) {
                        player.userReady = true;
                        player.state = 1;
                    } else {
                        player.state = 0;
                        player.userReady = false;
                    }
                }
                if (listPlayerId.indexOf(Number(player.userId)) == -1) {
                    listPlayerId.push(Number(player.userId));
                    message.listPlayer.push(player);
                }
            }
            message.listPlayerIdInGame = listPlayerIdInGame;
            if (Linker && Linker.Lobby && Linker.Lobby.CurrentBetting) {
                Linker.Lobby.CurrentBetting = Number(message.minMoney);
            }
        } else {
            message.error = data;
        }
        // cc.log(message.listPlayer, 'message.listPlayer join');
        return message;
    },
    PlayerJoinedResponse(messageId, status, data) {
        cc.log("SG_PlayerJoinedResponse", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            cc.log(tempArray, 'player joined');
            var player = new Player();
            player.userId = tempArray[0];
            player.viewName = tempArray[1];
            player.avatarId = tempArray[2];
            player.userMoney = tempArray[3];
            player.state = 0;
            player.userReady = false;
            player.isMaster = 0;
            player.countryId = tempArray[4];
            if (tempArray.length > 5) {
                player.level = tempArray[5];
            }
            player.score = "";
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
            message.minMoney = Number(gameInfo[0]);
            message.tableIndex = Number(gameInfo[1]);
            message.tableId = Number(gameInfo[2]);
            message.isPlaying = gameInfo[3] == "true" ? true : false;
            message.gameState = (message.isPlaying) ? 1 : 0;
            message.turnId = Number(gameInfo[4]);
            message.maxCapacity = Number(gameInfo[5]);
            if (gameInfo.length > 6) {
                message.isBotInTable = Number(gameInfo[6]) != 0 ? true : false;
            } else {
                message.isBotInTable = false;
            }
            message.ownerId = Number(gameInfo[7]);
            message.remainTime = Number(gameInfo[8]);//progress turn time
            message.leftTime = Number(gameInfo[9]);//time table left
            message.timeInTable = Number(gameInfo[10]);//time table left
            var ballPositionData = cc.v2(0, 0);
            if (Utils.Malicious.isJsonString(gameInfo[11])) {
                ballPositionData = JSON.parse(gameInfo[11]);
            }
            message.isShootBall = gameInfo[12] == "true" ? true : false;
            cc.log("Đã bắn: " + message.isShootBall);
            cc.log("gameInfo: ", gameInfo);

            message.ballX = Number(ballPositionData.x);
            message.ballY = Number(ballPositionData.y);
            message.listPlayer = [];
            message.listPlayerIdInGame = [];
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = new Player();
                player.userId = Number(p[0]);
                if (isNaN(player.userId) == false && player.userId != 0) {
                    player.viewName = p[1];
                    player.avatarId = Number(p[2]);
                    player.userMoney = Number(p[3]);
                    player.level = Number(p[4]);
                    player.exp = Number(p[5]);
                    player.isObserver = Number(p[6]);
                    player.countryId = p[7];
                    player.playerType = Number(p[8]);
                    player.isBot = player.playerType != 0 ? true : false;
                    player.currentPositions = p[9];
                    player.countGoal = Number(p[10]);
                    player.score = player.countGoal;
                    player.countOwnGoal = Number(p[11]);
                    player.isPlaying = (Number(player.isObserver) == 1) ? false : true;
                    player.isLeft = p[12] == 'true' ? true : false;

                    player.state = 0;
                    player.userReady = false;

                    if (player.userId == message.ownerId) {
                        player.isMaster = 1;
                    } else {
                        player.isMaster = 0;
                    }
                    if (message.listPlayerIdInGame.indexOf(player.userId) == -1) {
                        message.listPlayerIdInGame.push(player.userId);
                    }
                    message.listPlayer.push(player);
                }
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
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var tempArray1 = tempArray[0];
            var setting = tempArray1.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(setting);
            message.minMoney = Number(setting[0]);
            message.capacity = Number(setting[1]);
            message.isFastPlay = Number(setting[2]);
            message.totalError = Number(setting[3]);
            message.playTime = Number(setting[4]);
            message.leftTime = Number(setting[5]);
            message.uidChange = Number(setting[6]);
            message.formationId = Number(setting[7]);
            message.style = Number(setting[8]);
            message.maxAutoNextTurn = Number(setting[9]);
            message.goalNumber = Number(setting[10]);
            message.isFormation = setting[11] == "true" ? true : false;

        } else {
            message.error = data;
        }
        Linker.settingTable = message;
        return message;
    },
    TurnCardResponse1vs1: function (messageId, status, data) {
        cc.log("TLMN_TurnCardResponse Mode Play 1vs1", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var tempArray1 = tempArray[0];
            var tempArray2 = tempArray[1];
            var tempArray3 = tempArray[2];

            var turnInfo = tempArray1.split(SocketConstant.SEPERATOR.ELEMENT);
            var tmpResult = (tempArray2) ? tempArray2.split(SocketConstant.SEPERATOR.ELEMENT) : null;//isGoal, isGoldLeft
            var tmpListPlayerInfo = (tempArray3) ? tempArray3.split(SocketConstant.SEPERATOR.ARRAY) : null;
            //cc.log(tempArray);
            //khi status = 3 thì sẽ ball ăn
            message.shootStatus = Number(turnInfo[0]);
            message.status = Number(status);
            switch (message.shootStatus) {
                case soccerConstant.TABLE_STATUS.XOAY_GAY:
                    message.turnId = Number(turnInfo[5]);
                    var positionData = JSON.parse(turnInfo[1]);
                    message.playerPosX = Number(positionData.x);
                    message.playerPosY = Number(positionData.y);
                    message.playerId = parseInt(Number(positionData.id));
                    message.playerForce = Number(turnInfo[2]);
                    var velocityData = Utils.Malicious.isJsonString(turnInfo[3]) ? JSON.parse(turnInfo[3]) : cc.v2(0, 0);
                    message.playerVelocityX = Number(velocityData.x);
                    message.playerVelocityY = Number(velocityData.y);
                    var _playerRotation = Number(turnInfo[4]);
                    message.playerRotation = isNaN(_playerRotation) == false ? _playerRotation : 0;
                    break;
                case soccerConstant.TABLE_STATUS.SHOOT_BONG:
                    message.turnId = Number(turnInfo[5]);
                    var positionData = JSON.parse(turnInfo[1]);
                    message.playerPosX = Number(positionData.x);
                    message.playerPosY = Number(positionData.y);

                    message.playerId = parseInt(Number(positionData.id));
                    message.playerForce = Number(turnInfo[2]);
                    var velocityData = Utils.Malicious.isJsonString(turnInfo[3]) ? JSON.parse(turnInfo[3]) : cc.v2(0, 0);
                    message.playerVelocityX = Number(velocityData.x);
                    message.playerVelocityY = Number(velocityData.y);
                    message.fVelocity = cc.v2(message.playerVelocityX, message.playerVelocityY);
                    var _playerRotation = Number(turnInfo[4]);
                    message.playerRotation = isNaN(_playerRotation) == false ? _playerRotation : 0;
                    var ballPositionData = cc.v2(0, 0);
                    if (Utils.Malicious.isJsonString(turnInfo[5])) {
                        ballPositionData = JSON.parse(turnInfo[5]);
                    }
                    message.ballX = Number(ballPositionData.x);
                    message.ballX = Number(ballPositionData.y);
                    break;
                case soccerConstant.TABLE_STATUS.GUI_KET_QUA:
                    message.turnId = Number(turnInfo[6]);
                    cc.error(message);
                    cc.error("Next ID: " + message.turnId);
                    message.leftTime = Number(turnInfo[7]);
                    var positionData = JSON.parse(turnInfo[1]);
                    message.playerPosX = Number(positionData.x);
                    message.playerPosY = Number(positionData.y);
                    message.playerId = parseInt(Number(positionData.id));
                    message.playerForce = Number(turnInfo[2]);
                    var velocityData = Utils.Malicious.isJsonString(turnInfo[3]) ? JSON.parse(turnInfo[3]) : cc.v2(0, 0);
                    message.playerVelocityX = Number(velocityData.x);
                    message.playerVelocityY = Number(velocityData.y);
                    message.fVelocity = cc.v2(message.playerVelocityX, message.playerVelocityY);
                    var _playerRotation = Number(turnInfo[4]);
                    message.playerRotation = isNaN(_playerRotation) == false ? _playerRotation : 0;
                    var ballPositionData = cc.v2(0, 0);
                    if (Utils.Malicious.isJsonString(turnInfo[5])) {
                        ballPositionData = JSON.parse(turnInfo[5]);
                    }
                    message.ballX = Number(ballPositionData.x);
                    message.ballY = Number(ballPositionData.y);
                    message.hitGoal = (tmpResult[0] == "true") ? true : false;
                    message.hitGoalLeft = (tmpResult[1] == "true") ? true : false;
                    message.listPlayer = this.getPlayers(tmpListPlayerInfo);
                    break;
                case soccerConstant.TABLE_STATUS.TU_DONG_GUI_KET_QUA:
                    message.turnId = Number(turnInfo[6]);
                    message.leftTime = Number(turnInfo[7]);
                    message.playerPosX = 0;
                    message.playerPosY = 0;
                    message.playerId = 0;
                    message.playerForce = 0;
                    message.playerVelocityX = 0;
                    message.playerVelocityY = 0;
                    message.fVelocity = cc.v2(0, 0);
                    message.playerRotation = 0;
                    message.ballX = 0;
                    message.ballY = 0;
                    message.hitGoal = false;
                    message.hitGoalLeft = false;
                    message.listPlayer = [];
                    break;
                default:
                    break;
            }
        } else {
            message.error = data;
        }
        return message;
    },
    convertTextNumToNum: function (arr) {
        var _arr = [];
        for (let i = 0; i < arr.length; i++) {
            var id = parseInt(arr[i]);
            if (isNaN(id) == false) {
                _arr.push(id);
            }
        }
        return _arr;
    },
    getPlayers: function (tmpPlayer) {
        if (!tmpPlayer || (tmpPlayer && tmpPlayer.length <= 0)) {
            return [];
        }
        var players = [];

        for (var i = 0; i < tmpPlayer.length; i++) {
            var player_data = tmpPlayer[i].split(SocketConstant.SEPERATOR.ELEMENT);
            var player = {
                userId: Number(player_data[0]),
                score: Number(player_data[1]),
                countGoal: Number(player_data[1]),
                nSkipTurn: Number(player_data[2]),
                currentPositions: player_data[3],
                changePositions: player_data[4]
            }
            players.push(player)
        }
        return players;
    },
    getPlayersSetting: function (result) {
        if (!result || (result && result.length <= 0)) {
            return [];
        }
        var players = [];

        for (var i = 0; i < result.length; i++) {
            var player_data = result[i].split(SocketConstant.SEPERATOR.ELEMENT);
            var player = {
                id: player_data[0],
                totalSeo: Number(player_data[1])
            }
            if (Linker.ZONE == soccerConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                player.isStop = Number(player_data[2]);
            }
            players.push(player)
        }
        return players;
    }
}
module.exports = soccerGalaxyParse;