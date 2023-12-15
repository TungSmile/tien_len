var HeadBallConstant = require("HeadBallConstant");
var SocketConstant = require("SocketConstant");
var Linker = require("Linker");
var Player = require('Player');
var Utils = require('Utils');
var HeadBallParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case 1104: {
                if (Linker.ZONE == HeadBallConstant.ZONE_ID.LOBBY) {
                    return this.onTurnActionResponse(tempData.messageId, tempData.status, tempData.data);
                }
            }
            case 1105: {
                if (Linker.ZONE == HeadBallConstant.ZONE_ID.LOBBY) {
                    return this.JoinTableResponseHeadBall(tempData.messageId, tempData.status, tempData.data);
                }
            }
            case 1108: {
                return this.parse_1108_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1114: {
                return this.onEndGameResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1106: {
                return this.parse_1106_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 3: {
                return this.onReconnectParse(tempData.messageId, tempData.status, tempData.data);
            }
        }
    },

    onEndGameResponse(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            data: {}
        };
        cc.log(data);
        if (status == 1) {
            message.data.listPlayer = [];
            message.data.listPlayerID = [];
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var info = value[0].split(SocketConstant.SEPERATOR.ELEMENT);

            cc.log("value, info: ", value, info);
            message.data.winPlayerId = Number(info[0]);
            message.data.userIdNohu = info[1];
            message.data.moneyNohu = info[2];
            message.data.newOwnerId = info[3];
            // return this.getFakeEndGameData(message);
            var listPlayer = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            cc.log("ROOM PARAM: ", listPlayer);
            message.data.listPlayer = [];
            message.data.listPlayerID = [];

            for (var i = 0; i < listPlayer.length; i++) {
                var playerResult = listPlayer[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = {
                    userId: Number(playerResult[0]),
                    userName: playerResult[1],
                    userMoney: Number(playerResult[2]),
                    resultMoney: Number(playerResult[3]),
                    countGoal: Number(playerResult[4]),
                    // countWin: Number(playerResult[5]),
                    // countOwnGoal: Number(playerResult[5]),//phan luoi
                    isOut: Number(playerResult[5]),
                    isNotEnoughMoney: Number(playerResult[6]),
                    avatarId: playerResult[7],
                    level: playerResult[8],
                    levelUpMoney: playerResult[9]
                };

                message.data.listPlayerID.push(player.userId);
                if (Number(player.userId) == Number(message.winPlayerId)) {
                    message.data.winMoney = player.userMoney;
                } else {
                    message.data.loseMoney = player.userMoney;
                }
                message.data.listPlayer.push(player);
            }

        } else {
            message.data.error = data;
        }
        return message;
    },

    parse_1108_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            // cc.log("bat dau tran dau 1108", data);
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var tempArray1 = tempArray[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.turnId = tempArray1[0];
            message.time = tempArray1[1];
            var listPlayerIdInGame = [];
            message.listPlayer = [];
            if (Linker.ZONE == HeadBallConstant.ZONE_ID.LOBBY) {
                const tempArrayPlayer = tempArray[1].split(SocketConstant.SEPERATOR.ARRAY);
                cc.log(tempArrayPlayer);
                for (let i = 0; i < tempArrayPlayer.length; i++) {
                    const playerArray = tempArrayPlayer[i].split(SocketConstant.SEPERATOR.ELEMENT);
                    // cc.log("player", playerArray);
                    if (playerArray.length >= 3) {
                        const playerId = Number(playerArray[0]);
                        const side = playerArray[1];
                        const point = playerArray[2];
                        const position = playerArray[3];
                        const playerType = playerArray[4];
                        var playerInfo = {};
                        playerInfo.side = side == "true" ? true : false;
                        playerInfo.point = Number(point);
                        playerInfo.position = JSON.parse(position);
                        playerInfo.userId = Number(playerId);
                        playerInfo.userName = "Player " + i;
                        playerInfo.playerType = Number(playerType);
                        message.listPlayer.push(playerInfo);
                        playerInfo.isBot = playerType != 0 ? true : false;
                        if (listPlayerIdInGame.indexOf(playerId) == -1) {
                            listPlayerIdInGame.push(playerId);
                        }
                    }
                }
            }
            message.listPlayerIdInGame = listPlayerIdInGame;
            // cc.log('*** bai cua ai thi ng day choi', tempData, message);
        } else {
            message.error = data;
        }
        return message;
    },

    parse_1106_message(messageId, status, obj) {
        var data = {};

        if (!status) {
            data.error = obj;
            return data;
        }
        var info = obj.split(SocketConstant.SEPERATOR.ELEMENT);

        var user = {};
        user.userId = Number(info[0]);
        user.viewName = info[1];
        user.avatarId = info[2];
        user.userMoney = Number(info[3]);

        data.listUsers = [];
        data.listUsers.push(user);

        return data;
    },

    onReconnectParse(messageId, status, data) {
        cc.log("reconnect headball", data);
        var message = {
            messageId: messageId,
            status: status
        };
        if (Number(status) == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var gameInfo = value[0].split(SocketConstant.SEPERATOR.ELEMENT);

            message.minMoney = gameInfo[0];
            message.tableIndex = gameInfo[1];
            message.tableId = gameInfo[2];
            message.isPlaying = gameInfo[3];
            message.maxCapacity = gameInfo[4];
            message.mType = gameInfo[5];
            message.ownerId = gameInfo[6];

            const objHeadBallPosition = !!gameInfo[7] ? JSON.parse(gameInfo[7]) : { x: 0, y: 510 };

            message.headBallPosition = { x: objHeadBallPosition.x, y: objHeadBallPosition.y };
            message.remainTime = gameInfo[8];
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY).filter(Boolean);
            var listPlayer = [];

            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = new Player();
                player.userId = Number(p[0]);
                player.viewName = p[1];
                player.side = p[2] == "true" ? true : false;
                player.avatarId = p[3];
                player.userMoney = p[4];
                player.level = Number(p[5]);
                player.exp = Number(p[6]);
                player.isObserver = p[7];
                player.countryId = !!p[8] ? p[8] : "w";
                player.playerType = p[9];
                const objPlayerPosition = !!p[10] ? JSON.parse(p[10]) : { x: 410, y: 113 };
                player.position = { x: objPlayerPosition.x, y: objPlayerPosition.y };
                player.countGoal = p[11];
                player.isBot = player.playerType != 0 ? true : false;
                player.isPlaying = true;
                if (i == 0) {
                    player.isMaster = 1;
                    // player.isReady = 1;
                } else {
                    player.isMaster = 0;
                }
                listPlayer.push(player);

            }
            message.listPlayer = listPlayer;
        } else {
            message.error = data;
        }

        return message;
    },
    onTurnActionResponse(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            action: 0,
            rotation: 0,
            force: 0,
            ballPosition: cc.v2(0, 0),
            ballAngularVelocity: 0,
            ballLinearVelocity: cc.v2(0, 0),
            hitGoal: false,
            hitGoalLeft: false,
            playerInTable: []
        };
        if (message.status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var tempArray1 = tempArray[0];
            var tempArray2 = tempArray[1];

            var turnData = tempArray1.split(SocketConstant.SEPERATOR.ELEMENT);
            var result = (tempArray2) ? tempArray2.split(SocketConstant.SEPERATOR.ARRAY) : null;
            message.status = Number(status);
            message.action = isNaN(parseInt(turnData[1])) == false ? parseInt(turnData[1]) : 0;
            var _actionStatus = message.action;
            switch (_actionStatus) {
                case HeadBallConstant.SEND_STATUS.SEND_POSITION:
                    //TRUONG HOP NHAP VA GIU CHUOT
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho state
                    message.spineState = isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0;
                    var _isKeepMoving = isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0;
                    message.isKeepMoving = _isKeepMoving == 1 ? true : false;
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.PLAYER_MOVING_UPDATE_OTHER:
                    //TRUONG HOP NHAP VA GIU CHUOT
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho state
                    message.spineState = isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0;
                    var _isKeepMoving = isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0;
                    message.isKeepMoving = _isKeepMoving == 1 ? true : false;
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.PLAYER_PUSHING_OTHER:
                    //TRUONG HOP NHAP VA GIU CHUOT
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho state
                    var forceVector = cc.v2(0, 0);
                    forceVector.x = isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0;
                    forceVector.y = isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0;
                    message.stepPushing = cc.v2(forceVector.x, forceVector.y);
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.SET_POSITION:
                    //TRUONG HOP NHA CHUOT
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho state
                    message.spineState = isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0;
                    var _isKeepMoving = isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0;
                    message.isKeepMoving = _isKeepMoving == 1 ? true : false;
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.SET_JUMP_ANIMATION:
                    //TRUONG HOP NHA CHUOT
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho state
                    message.spineState = isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0;
                    var _isKeepMoving = isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0;
                    message.isKeepMoving = _isKeepMoving == 1 ? true : false;
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.SET_HEADER_SHOT_ANIMATION:
                    //TRUONG HOP NHA CHUOT
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho state
                    message.spineState = isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0;
                    var _isKeepMoving = isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0;
                    message.isKeepMoving = _isKeepMoving == 1 ? true : false;
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.SET_STRAIGHT_SHOT_ANIMATION:
                    //TRUONG HOP NHA CHUOT
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho state
                    message.spineState = isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0;
                    var _isKeepMoving = isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0;
                    message.isKeepMoving = _isKeepMoving == 1 ? true : false;
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.SET_DIPPING_SHOT_ANIMATION:
                    //TRUONG HOP NHA CHUOT
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho state
                    message.spineState = isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0;
                    var _isKeepMoving = isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0;
                    message.isKeepMoving = _isKeepMoving == 1 ? true : false;
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.ON_UPDATE_POSITION_PLAYER_ON_MOVE:
                    //TRUONG HOP NHA CHUOT
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho state
                    message.spineState = isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0;
                    var _isKeepMoving = isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0;
                    message.isKeepMoving = _isKeepMoving == 1 ? true : false;
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.BONG_VA_CHAM_VOI_MOT_PHAN_CUA_MOT_PLAYER_IDLE:
                    //TRUONG HOP VA CHAM HIC
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho điểm va chạm quả bóng
                    var pointContactX = Number((isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0).toFixed(20));
                    var pointContactY = Number((isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0).toFixed(20));
                    message.pointContact = cc.v2(pointContactX, pointContactY);
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.ON_UPDATE_BALL_AND_POSITION_PLAYER:
                    //TRUONG HOP VA CHAM HIC
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho điểm va chạm quả bóng
                    var pointContactX = Number((isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0).toFixed(20));
                    var pointContactY = Number((isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0).toFixed(20));
                    message.pointContact = cc.v2(pointContactX, pointContactY);
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.PLAYER_SHOT_GOAL:
                    //TRUONG HOP VA CHAM HIC
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho điểm va chạm quả bóng
                    var _forceVectorX = Number((isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0).toFixed(20));
                    var _forceVectorY = Number((isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0).toFixed(20));
                    message.forceVector = cc.v2(_forceVectorX, _forceVectorY);
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.PLAYER_USER_ID_SHOT_GOAL:
                    //TRUONG HOP VA CHAM HIC
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho điểm va chạm quả bóng
                    var _forceVectorX = Number((isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0).toFixed(20));
                    var _forceVectorY = Number((isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0).toFixed(20));
                    message.forceVector = cc.v2(_forceVectorX, _forceVectorY);
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                case HeadBallConstant.SEND_STATUS.PLAYER_ON_COLISION_FAST:
                    //TRUONG HOP VA CHAM HIC
                    message.userId = isNaN(parseInt(turnData[0])) == false ? parseInt(turnData[0]) : 0;
                    var _forceVector = JSON.parse(turnData[5]);
                    //trong truong hop nay vector luc duoc su dung cho điểm va chạm quả bóng
                    var _forceVectorX = Number((isNaN(parseInt(_forceVector.x)) == false ? parseInt(_forceVector.x) : 0).toFixed(20));
                    var _forceVectorY = Number((isNaN(parseInt(_forceVector.y)) == false ? parseInt(_forceVector.y) : 0).toFixed(20));
                    message.forceVector = cc.v2(_forceVectorX, _forceVectorY);
                    var _ballPosition = JSON.parse(turnData[6]);
                    message.ballPosition.x = Number(_ballPosition.x);
                    message.ballPosition.y = Number(_ballPosition.y);
                    var _ballLinearVelocity = JSON.parse(turnData[7]);
                    message.ballLinearVelocity.x = Number(_ballLinearVelocity.x);
                    message.ballLinearVelocity.y = Number(_ballLinearVelocity.y);
                    message.ballAngularVelocity = Number(turnData[2]);
                    message.hitGoal = turnData[8] == "true" ? true : false;
                    message.hitGoalLeft = turnData[9] == "true" ? true : false;
                    message.playerInTable = this.getPlayersSetting(result);
                    break;
                default:
                    break;

            }

        } else {
            message.error = data;
        }
        return message;
    },
    // onTurnActionResponse(messageId, status, data) {
    //     var message = {
    //         messageId: messageId,
    //         status: status,
    //         idPlayerAction: 0,
    //         action: [],
    //         rotation: 0,
    //         force: 0,
    //         forceVector: cc.v2(0, 0),
    //         collisionPosition: cc.v2(0, 0),
    //         headBallPosition: cc.v2(0, 0),
    //         ballVelocity: cc.v2(0, 0),
    //         hitGoal: false,
    //         hitGoalLeft: false,
    //         playerInTable: []
    //     };
    //     if (status == 1) {
    //         var tempData = data;
    //         var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
    //         var tempArray1 = tempArray[0];
    //         var tempArray2 = tempArray[1];

    //         var actionPlayerCurrent = tempArray1.split(SocketConstant.SEPERATOR.ELEMENT);
    //         var result = (tempArray2) ? tempArray2.split(SocketConstant.SEPERATOR.ARRAY) : null;

    //         const objForceVector = JSON.parse(actionPlayerCurrent[5]);
    //         const objCollisionPosition = JSON.parse(actionPlayerCurrent[6]);
    //         const objHeadBallPosition = JSON.parse(actionPlayerCurrent[7]);
    //         const objBallVelocity = JSON.parse(actionPlayerCurrent[8]);

    //         message.status = Number(status);
    //         message.idPlayerAction = Number(actionPlayerCurrent[0]);
    //         message.action = JSON.parse(actionPlayerCurrent[1]);
    //         message.rotation = actionPlayerCurrent[2];
    //         message.isTouchBall = actionPlayerCurrent[3] == "true" ? true : false;
    //         message.force = actionPlayerCurrent[4];
    //         message.forceVector = { x: objForceVector.x, y: objForceVector.y };
    //         message.collisionPosition = { x: objCollisionPosition.x, y: objCollisionPosition.y };
    //         message.headBallPosition = { x: objHeadBallPosition.x, y: objHeadBallPosition.y };
    //         message.ballVelocity = {x:objBallVelocity.x, y:objBallVelocity.y};
    //         message.hitGoal = actionPlayerCurrent[9] == "true" ? true : false;
    //         message.hitGoalLeft = actionPlayerCurrent[10] == "true" ? true : false;
    //         message.playerInTable = this.getPlayersSetting(result);
    //     } else {
    //         message.error = data;
    //     }
    //     return message;
    // },
    JoinTableResponseHeadBall: function (messageId, status, data) {
        // cc.log("BIDA_JoinTableResponse", data);
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
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            var listPlayerId = [];
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
                if (i == 0) {
                    player.isMaster = 1;
                    // player.isReady = 1;
                } else {
                    player.isMaster = 0;
                }
                if (Number(message.isPlaying) == 1) {
                    if (player.userId == Linker.userData.userId || player.isObserver == 1) {
                        //chức năng dành cho người xem, list bi trên bàn chơi
                        if (Utils.Malicious.isJsonString(p[10])) {
                            var dataBallNum = [];
                            var dataBallPos = [];
                            var _tmpDataBall = JSON.parse(p[10]);
                            for (let k = 0; k < _tmpDataBall.length; k++) {
                                dataBallNum.push(parseInt(_tmpDataBall[k].num));
                                dataBallPos.push(parseFloat(_tmpDataBall[k].x), parseFloat(_tmpDataBall[k].y));
                            }
                            if (!Utils.Malicious.isAllElementArrSame(0.0, dataBallPos)) {
                                //vị trí các bi đang chơi dở
                                message.ballPos = _tmpDataBall;
                            } else {
                                // cc.log(dataBallPos, _tmpDataBall);
                            }
                            message.dataBall = JSON.stringify(dataBallNum);//data ball 
                        }
                        if (Utils.Malicious.isJsonString(p[11])) {
                            message.ballEat = p[11];
                        }
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
                if (listPlayerId.indexOf(Number(player.userId)) == -1) {
                    listPlayerId.push(Number(player.userId));
                    message.listPlayer.push(player);
                }
            }
        } else {
            message.error = data;
        }
        // cc.log(message.listPlayer, 'message.listPlayer join');
        return message;
    },
    getPlayersSetting: function (result) {
        if (!result || (result && result.length <= 0)) {
            return [];
        }
        var players = [];

        for (var i = 0; i < result.length; i++) {
            var player_data = result[i].split(SocketConstant.SEPERATOR.ELEMENT);
            var pos = JSON.parse(player_data[2]);
            var player = {
                id: Number(player_data[0]),
                point: Number(player_data[1]),
                position: cc.v2(pos.x, pos.y),
                userId: Number(player_data[0]),
                state: pos.z
            }
            players.push(player)
        }
        return players;
    }
}

module.exports = HeadBallParse;