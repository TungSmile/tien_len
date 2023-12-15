var CardUtils = require('CardUtils');
var SocketConstant = require('SocketConstant');
var Player = require('MauBinhPlayerExtra');
var Linker = require('Linker');
var MauBinhParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case 1002: {
                return this.parse_1005_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1006: {
                return this.parse_1006_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1105: {
                return this.parse_1105_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1106: {
                return this.parse_1106_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1108: {
                return this.parse_1108_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1114: {
                return this.parse_1114_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 121005: {
                return this.parse_121005_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1245: {
                return this.parse_1245_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1242: {
                return this.parse_1242_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 3: {
                return this.parse_3_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 121006: {
                return this.parse_121006_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 121009: {
                return this.parse_121009_message(tempData.messageId, tempData.status, tempData.data);
            }
        }
    },
    parse_1242_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.minMoney = value[0];
            message.maxCapacity = value[1];
        } else {
            message.error = data;
        }
        return message;
    },
    parse_1114_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var data1 = tempArray[0].split(SocketConstant.SEPERATOR.ELEMENT);
            var data2 = tempArray[1].split(SocketConstant.SEPERATOR.ARRAY);
            cc.log(data1, data2);
            message.newOwner = data1[0];
            message.listPlayer = [];
            data2.forEach((element) => {
                var p = element.split(SocketConstant.SEPERATOR.ELEMENT);
                var player = {};
                player.userId = p[0];
                player.resultMoney = p[1];
                player.anChi = p[2];
                player.money = p[3];

                player.notEnoughMoney = p[4];
                player.isOut = p[5];
                player.isAutoPlay = p[6];
                player.caseType = p[7];
                player.cardOwnerList = CardUtils.parseMauBinhCard(p[8]);
                player.level = p[9];
                player.levelUpMoney = p[10];
                message.listPlayer.push(player);
            });

            if (tempArray.length > 2) {
                var data3 = tempArray[2].split(SocketConstant.SEPERATOR.ELEMENT);
                message.idUserAnHu = data3[0];
                message.moneyAnHu = data3[1];
            }

        } else {
            message.error = data;
        }
        return message;
    },
    parse_1108_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.cardOwnerList = CardUtils.parseMauBinhCard(tempArray[0]);
            message.message1 = tempArray[1];
            message.message2 = tempArray[2];
            message.listPlaying = tempArray[3].split("#");
            if (tempArray.length > 3) {
                message.binhType = parseInt(tempArray[4]);
            } else {
                message.binhType = null;
            }
        } else {
            message.error = data;
        }


        return message;
    },
    parse_1005_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            //cc.log(tempArray);
            if (tempArray.length == 9) {


            } else {
                message.thongBao = tempArray[0];
            }

        } else {
            message.error = data;
        }


        return message;
    },
    parse_1006_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);


        } else {
            message.error = data;
        }

        return message;
    },
    parse_1105_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var gameInfo = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.tableId = gameInfo[0];
            message.minMoney = gameInfo[1];
            message.isPlaying = gameInfo[2];
            message.maxCapacity = gameInfo[3];
            message.roomName = gameInfo[4];
            message.tableIndex = gameInfo[5];
            message.timeCount = Number(gameInfo[7]) / 1000 - 5;
            message.listPlayer = [];
            message.listPlaying = [];
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = new Player();
                player.userId = p[0];
                message.listPlaying.push(p[0]);
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

                // if (p.length > 7 && message.isPlaying == 1) {
                //     var turnedCardList = CardUtils.parsePhomCard(p[7]);
                //     if (turnedCardList != null) {

                //         player.turnedCardList = turnedCardList;
                //     }
                // }
                // if (p.length > 8 && message.isPlaying) {
                //     var takenCardList = CardUtils.parsePhomCard(p[8]);
                //     if (takenCardList != null) {

                //         player.takenCardList = takenCardList;
                //     }
                // }
                // if (p.length > 9 && message.isPlaying) {
                //     var listPhom = CardUtils.parsePhom(p[9]);
                //     if (listPhom != null) {

                //         player.phomList = listPhom;
                //     }
                // }
                message.cardOwnerList = [];
                message.mauBinhList = [];
                message.listPlayer.push(player);
            }

        } else {
            message.error = data;
        }

        return message;
    },
    parse_1106_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,

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
    parse_121005_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.userId = tempArray[0];
            message.caseType = tempArray[1];
        } else {
            message.error = data;
        }
        return message;
    },
    parse_121006_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var values = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.listPlayer = [];
            message.cardIndex = values[values.length - 1];
            tempArray.forEach(v => {
                var playerInfos = v.split(SocketConstant.SEPERATOR.ARRAY);
                var info0 = playerInfos[0].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = {};
                player.userId = info0[0];
                player.caseType = info0[1];
                player.chiType = info0[2];
                player.cardDataList = CardUtils.parseMauBinhCard(info0[3]);
                player.playerExtra = [];
                for (let i = 1; i < playerInfos.length; i++) {
                    var infoI = playerInfos[i].split(SocketConstant.SEPERATOR.ELEMENT);
                    var map = {};
                    map.userId = infoI[0];
                    map.money = infoI[1];
                    player.playerExtra.push(map);
                }
                message.listPlayer.push(player);
            });
        } else {
            message.error = data;
        }
        return message;
    },
    parse_121009_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            message.listPlayer = [];
            tempArray.forEach(v => {
                var playerInfos = v.split(SocketConstant.SEPERATOR.ARRAY);
                var info0 = playerInfos[0].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = {};
                player.userId = info0[0];
                player.sapType = info0[1];
                player.sapResultMap = [];
                for (let i = 1; i < playerInfos.length; i++) {
                    var infoI = playerInfos[i].split(SocketConstant.SEPERATOR.ELEMENT);
                    var map = {};
                    map.userId = infoI[0];
                    map.chiSapHamCount = infoI[2];
                    map.chiSapLangCount = infoI[4];
                    player.sapResultMap.push(map);
                }
                message.listPlayer.push(player);
            });
        } else {
            message.error = data;
        }
        return message;
    },
    parse_1245_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.userId = tempArray[0];
            message.isXepBai = tempArray[1];
            message.cardOwnerList = [];
            if (tempArray[2]) {
                message.cardOwnerList = CardUtils.parseMauBinhCard(tempArray[2]);
            }
        } else {
            message.error = data;
        }

        return message;
    },
    parse_3_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var gameInfo = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.minMoney = gameInfo[0];
            message.tableId = gameInfo[1];
            message.tableIndex = gameInfo[2];
            message.timeCount = Number(gameInfo[4]) / 1000 - 5;
            message.cardOwnerList = CardUtils.parseMauBinhCard(gameInfo[5]);
            message.maxCapacity = gameInfo[6];
            message.listPlayer = [];
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                cc.log("trung333", p);
                var player = new Player();
                player.userId = p[0];
                player.viewName = p[1];
                player.avatarId = p[2]
                player.userMoney = p[3];
                player.isReady = p[4];
                if (i == 0) {
                    player.isMaster = 1;
                } else {
                    player.isMaster = 0;
                }
                message.listPlayer.push(player);
            }


        } else {
            message.error = data;
        }

        return message;
    },
};
module.exports = MauBinhParse;