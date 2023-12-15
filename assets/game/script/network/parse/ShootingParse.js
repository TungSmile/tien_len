var SocketConstant = require('SocketConstant');
var Player = require('Player');
var Linker = require('Linker');
var ShootingParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case 1104: {
                return this.onTurnActionResponse(tempData.messageId, tempData.status, tempData.data);
            }
            case 1105: {
                return this.JoinTableResponseHeadBall(tempData.messageId, tempData.status, tempData.data);
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
            case 1242: {
                return this.parse_1242_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 12021: {
                return this.parse_12021_message(tempData.messageId, tempData.status, tempData.data);
            }
        }
    },

    onTurnActionResponse(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            listPlayer: []
        };
        if (status == 1) {
            var tempData = data.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var dataAction = tempData[0].split(SocketConstant.SEPERATOR.ELEMENT);
            if (tempData[1]) var dataPlayer = tempData[1].split(SocketConstant.SEPERATOR.ARRAY);

            message.actionId = dataAction[0];
            message.listAction = JSON.parse(dataAction[1]);
            message.isHitByBullet = JSON.parse(dataAction[2]);
            message.damage = dataAction[3];
            message.eatItem = dataAction[4];
            if (dataPlayer) {
                for (let i = 0; i < dataPlayer.length; i++) {
                    var player = {};
                    var tempDataPlayer = dataPlayer[i].split(SocketConstant.SEPERATOR.ELEMENT);
                    player.userId = tempDataPlayer[0];
                    player.health = tempDataPlayer[1];
                    player.position = JSON.parse(tempDataPlayer[2]);
                    message.listPlayer.push(player);
                }
            }
            
        } else {
            message.error = data;
        }
        return message;
    },

    JoinTableResponseHeadBall: function (messageId, status, data) {
        cc.log("ckcb_JoinTableResponse", data);
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
                // message.currentPlayerId = Number(p[7]);
                // player.countryId = !!p[8] ? p[8] : "w";
                // player.playerType = p[9];
                // player.isBot = player.playerType != 0 ? true : false;
                if (i == 0) {
                    player.isMaster = 1;
                    // player.isReady = 1;
                } else {
                    player.isMaster = 0;
                }
                // if (Number(message.isPlaying) == 1) {
                //     if (player.userId == Linker.userData.userId || player.isObserver == 1) {
                //         //chức năng dành cho người xem, list bi trên bàn chơi
                //         if (Utils.Malicious.isJsonString(p[10])) {
                //             var dataBallNum = [];
                //             var dataBallPos = [];
                //             var _tmpDataBall = JSON.parse(p[10]);
                //             for (let k = 0; k < _tmpDataBall.length; k++) {
                //                 dataBallNum.push(parseInt(_tmpDataBall[k].num));
                //                 dataBallPos.push(parseFloat(_tmpDataBall[k].x), parseFloat(_tmpDataBall[k].y));
                //             }
                //             if (!Utils.Malicious.isAllElementArrSame(0.0, dataBallPos)) {
                //                 //vị trí các bi đang chơi dở
                //                 message.ballPos = _tmpDataBall;
                //             } else {
                //                 // cc.log(dataBallPos, _tmpDataBall);
                //             }
                //             message.dataBall = JSON.stringify(dataBallNum);//data ball 
                //         }
                //         if (Utils.Malicious.isJsonString(p[11])) {
                //             message.ballEat = p[11];
                //         }
                //         player.state = 0;
                //     } else {
                //         player.state = 2;
                //     }
                // } else {
                //     if (player.isReady == 1) {
                //         player.state = 1;
                //     } else {
                //         player.state = 0;
                //     }
                // }
                // player.socay = p[7];
                if (listPlayerId.indexOf(Number(player.userId)) == -1) {
                    listPlayerId.push(Number(player.userId));
                    message.listPlayer.push(player);
                }
            }
            if (Linker && Linker.Lobby && Linker.Lobby.CurrentBetting) {
                Linker.Lobby.CurrentBetting = Number(message.minMoney);
            }
        } else {
            message.error = data;
        }
        // cc.log(message.listPlayer, 'message.listPlayer join');
        return message;
    },

    parse_1106_message(messageId, status, obj) {
        var data = {
            messageId: messageId,
            status: status
        };

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

        data.player = user;

        return data;
    },

    parse_1108_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            listPlayer: []
        };
        if (status == 1) {
            // cc.log("bat dau tran dau 1108", data);
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var tempArray1 = tempArray[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.startId = Number(tempArray1[0]);
            message.time = Number(tempArray1[1]);

            const tempArrayPlayer = tempArray[1].split(SocketConstant.SEPERATOR.ARRAY);
            
            for (let i = 0; i < tempArrayPlayer.length; i++) {
                const playerArray = !!tempArrayPlayer[i] && tempArrayPlayer[i].split(SocketConstant.SEPERATOR.ELEMENT);
                if (playerArray.length > 0) {
                    let player = {};
                    player.userId = Number(playerArray[0]);
                    player.health = Number(playerArray[1]);
                    player.currentPos = JSON.parse(playerArray[2]);
                    // player.level = Number(playerArray[1]);
                    // player.objLevel = JSON.parse(playerArray[2]);
                    // player.utype = Number(playerArray[3]);
                    message.listPlayer.push(player);
                    // var playerInfo = {};
                    // playerInfo.side = side === "true" ? true : false;
                    // playerInfo.point = Number(point);
                    // playerInfo.position = JSON.parse(position);
                    // playerInfo.userId = Number(playerId);
                    // playerInfo.playerType = Number(playerType);
                    // message.listPlayer.push(playerInfo);
                    // playerInfo.isBot = playerType != 0 ? true : false;
                    // if (listPlayerIdInGame.indexOf(playerId) == -1) {
                    //     listPlayerIdInGame.push(playerId);
                    // }
                }
            }
        
            // cc.log('*** bai cua ai thi ng day choi', tempData, message);
        } else {
            message.error = data;
        }
        return message;
    },

    onEndGameResponse(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
        };
        cc.log(data);
        if (status == 1) {
            message.listPlayer = [];
            message.listPlayerID = [];
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var info = value[0].split(SocketConstant.SEPERATOR.ELEMENT);

            cc.log("value, info: ", value, info);
            message.winPlayerId = Number(info[0]);
            message.userIdNohu = Number(info[1]);
            message.moneyNohu = Number(info[2]);
            message.newOwnerId = Number(info[3]);
            // return this.getFakeEndGameData(message);
            var listPlayer = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            cc.log("ROOM PARAM: ", listPlayer);
            
            for (var i = 0; i < listPlayer.length; i++) {
                var playerResult = listPlayer[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = {
                    userId: Number(playerResult[0]),
                    userName: playerResult[1],
                    userMoney: Number(playerResult[3]),
                    resultMoney: Number(playerResult[2]),
                    isOut: Boolean(Number(playerResult[4])),
                    isNotEnoughMoney: Boolean(Number(playerResult[5])),
                    //isNotEnoughMoney: Number(playerResult[6]),
                    avatarId: playerResult[6],
                    health: playerResult[7],
                    level: playerResult[8],
                    levelUpMoney: playerResult[9],
                };
                
                message.listPlayerID.push(player.userId);
                if (Number(player.userId) == Number(message.winPlayerId)) {
                    message.winMoney = player.resultMoney;
                } else {
                    message.loseMoney = player.resultMoney;
                }
                message.listPlayer.push(player);
            }

        } else {
            message.error = data;
        }
        return message;
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
            
            message.minMoney = Number(gameInfo[0]);
            message.tableIndex = Number(gameInfo[1]);
            message.tableId = Number(gameInfo[2]);
            message.isPlaying = JSON.parse(gameInfo[3]);
            message.maxCapacity = Number(gameInfo[4]);
            message.mType = Number(gameInfo[5]);
            message.ownerId = Number(gameInfo[6]);
            
            message.time = parseInt(Number(gameInfo[7]) / 1000);
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY).filter(Boolean);
            var listPlayer = [];
            
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = {};
                player.userId = Number(p[0]);
                player.viewName = p[1];
                player.avatarId = p[2];
                player.userMoney = p[3];
                player.levelPlayer = Number(p[4]);
                player.exp = Number(p[5]);
                player.isObserver = p[6];
                player.countryId = !!p[7] ? p[8] : "w";
                player.playerType = p[8];
                player.isBot = player.playerType != 0 ? true : false;
                player.health = Number(p[9]);
                player.position = JSON.parse(p[10]);

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

    parse_12021_message: function (messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
            data: data
        };
        return message;
    }
}

module.exports = ShootingParse;