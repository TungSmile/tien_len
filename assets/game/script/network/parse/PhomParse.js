var CardUtils = require('CardUtils');
var SocketConstant = require('SocketConstant');
var Linker = require('Linker');
var Player = require('Player');
var PhomCard = require('PhomCard');
var PhomObj = require('PhomObj');
var PhomParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case 1126: {
                return this.parse_1126_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1125: {
                return this.parse_1125_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1128: {
                return this.parse_1128_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1127: {
                return this.parse_1127_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1242: {
                return this.parse_1242_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1104: {
                return this.parse_1104_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1105: {
                return this.parse_1105_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1106: {
                return this.parse_1106_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1114: {
                return this.parse_1114_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1112: {
                return this.parse_1112_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 3: {
                return this.parse_3_message(tempData.messageId, tempData.status, tempData.data);
            }

        }
    },
    parse_1112_message(messageId, status, data) {
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
    parse_3_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var value = tempData.split(SocketConstant.SEPERATOR.DIFF_ARRAY);
            var gameInfo = value[0].split(SocketConstant.SEPERATOR.ELEMENT);
            message.tableId = gameInfo[9];
            message.minMoney = gameInfo[0];
            message.isPlaying = gameInfo[2];
            message.maxCapacity = gameInfo[10];
            message.roomName = gameInfo[4];
            message.tableIndex = gameInfo[1];
            message.isAn = gameInfo[3];
            message.isTaiGui = gameInfo[4];
            message.dutyType = gameInfo[3];
            message.currentPlayerId = gameInfo[5];
            message.cardLeft = gameInfo[6];
            message.selfCardList = CardUtils.parsePhomCard(gameInfo[7]);
            message.selfTurnedList = CardUtils.parsePhomCard(gameInfo[8]);

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
                    //card danh
                    var turnedCardList = CardUtils.parsePhomCard(p[7]);
                    if (turnedCardList != null) {

                        player.turnedCardList = turnedCardList;
                    }
                }
                if (p.length > 8 && message.isPlaying == 1) {
                    //card an
                    var takenCardList = CardUtils.parsePhomCard(p[8]);
                    if (takenCardList != null) {

                        player.takenCardList = takenCardList;
                    }
                }
                if (p.length > 9 && message.isPlaying == 1) {
                    //list phom da ha
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
            message.winerId = data1[0];
            message.uType = data1[1];
            message.newOwner = data1[2];
            message.dutyType = data1[3];
            message.listPlayer = [];
            data2.forEach((element) => {
                var p = element.split(SocketConstant.SEPERATOR.ELEMENT);
                var player = {};
                player.userId = p[0];
                player.point = p[1];
                player.listCard = CardUtils.parsePhomCard(p[2]);
                player.money = p[3];
                player.cash = p[4];
                player.notEnoughMoney = p[5];
                player.isAutoPlay = p[6];
                player.level = p[7];
                player.levelUpMoney = p[8];
                message.listPlayer.push(player);
            });
            var compare = function (lhs, rhs) {
                if (Number(lhs.point) < Number(rhs.point)) {
                    return -1;
                } else if (Number(lhs.point) > Number(rhs.point)) {
                    return 1;
                } else {
                    return 0;

                }
            }
            if (message.uType == 0) {
                message.listPlayer.sort(compare);
            }
            //dung cho nohu
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
    parse_1126_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.anPlayerId = tempArray[0];
            message.isChot = tempArray[1];
            message.winMoney = tempArray[2];
            message.lostMoney = tempArray[3];

        } else {
            message.error = data;
        }


        return message;
    },
    parse_1125_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            var card = new PhomCard();
            card.setServerValue(tempArray[0]);
            message.card = card;
            message.isHaBai = tempArray[1];
            if (Number(tempArray[0]) > 0) {
                message.isBoc = true;
            } else {
                message.isBoc = false;
            }


        } else {
            message.error = data;
        }

        return message;
    },
    parse_1128_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.receivePlayerId = tempArray[0];
            var card = new PhomCard();
            card.setServerValue(tempArray[1]);
            message.card = card;
            message.phomId = tempArray[2];
            if (tempArray.length > 2) {
                message.uidNguoiGui = tempArray[3];
            }

        } else {
            message.error = data;
        }

        return message;
    },
    parse_1127_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.haPlayerId = tempArray[0];
            message.uType = tempArray[2];
            var card = new PhomCard();
            card.setServerValue(tempArray[3]);
            message.uCard = card;
            message.phomList = CardUtils.parsePhom(tempArray[1]);
            message.phomList.forEach(element => {
                element.setPlayerId(message.haPlayerId);
            });


        } else {
            message.error = data;
        }

        return message;
    },
    parse_1242_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.minMoney = tempArray[0];
            message.maxNumPlayer = tempArray[1];
            if (tempArray.length > 2) {

                message.isAn = tempArray[2]
            }
            if (tempArray.length > 3) {

                message.isTaiGui = tempArray[3];
            }
            if (tempArray.length > 4) {


            }

        } else {
            message.error = data;
        }

        return message;
    },
    parse_1104_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            cc.log(tempArray);
            message.nextTurnId = tempArray[1];
            var card = new PhomCard();
            card.setServerValue(tempArray[0]);
            message.card = card;

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
            message.isAn = gameInfo[6];
            message.isTaiGui = gameInfo[7];
            message.dutyType = gameInfo[8];
            message.currentPlayerId = gameInfo[9];
            message.cardLeft = gameInfo[10];
            message.listPlayer = [];
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
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
                if (p.length > 7 && message.isPlaying == 1) {
                    var turnedCardList = CardUtils.parsePhomCard(p[7]);
                    if (turnedCardList != null) {

                        player.turnedCardList = turnedCardList;
                    }
                }
                if (p.length > 8 && message.isPlaying) {
                    var takenCardList = CardUtils.parsePhomCard(p[8]);
                    if (takenCardList != null) {

                        player.takenCardList = takenCardList;
                    }
                }
                if (p.length > 9 && message.isPlaying) {
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
    }


}
module.exports = PhomParse;