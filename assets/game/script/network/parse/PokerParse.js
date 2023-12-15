var CardUtils = require('CardUtils');
var SocketConstant = require('SocketConstant');
var SamCard = require('SamCard');
var Player = require('PlayerSam');
var Linker = require('Linker');
var Utils = require('Utils');
var Linker = require('Linker');
var PokerParse = {
    parse(message) {
        var tempData = message;
        switch (Number(tempData.messageId)) {
            case 1131: {
                return this.parse_1131_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1114: {
                return this.parse_1114_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1105: {
                return this.parse_1105_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1106: {
                return this.parse_1106_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 3: {
                return this.parse_3_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1112: {
                return this.parse_1112_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 2000: {
                return this.parse_2000_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1108: {
                return this.parse_1108_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 121010: {
                return this.parse_121010_message(tempData.messageId, tempData.status, tempData.data);
            }
            case 1242: {
                return this.parse_1242_message(tempData.messageId, tempData.status, tempData.data);
            }
        }
    },
    parse_2000_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.playerAction = tempArray[0];
            message.tothem = tempArray[1];
            message.tientheo = tempArray[2];
            message.luachon = tempArray[3];
            message.tongtien = tempArray[4];
            message.TonginVong = tempArray[5];
            message.tongtienall = tempArray[6];
            if (tempArray.length >= 8) {
                message.nextplayer = tempArray[7];
                message.tiendetheo = tempArray[8];
            }
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
        } else {
            message.error = data;
        }

        return message;
    },

    parse_121010_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status
        };
        if (status == 1) {
            var tempData = data;
            var tempArray = tempData.split(SocketConstant.SEPERATOR.ELEMENT);
            message.userId = tempArray[0];
            message.money = tempArray[1];
           
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
           
            if(data1.length>3){
                message.CardChung = CardUtils.parsePokerCard(data1[3]);
            }
			
			message.list = data1[4].split("#");
			// PlayerInfoL piL;
			// for(String str : list)
			// {
			// 	piL = new PlayerInfoL(1, Long.parseLong(str), -3);
			// 	if(piL.moneyatk>0)
			// 	result.heaplist.add(piL);
            // }
            
            message.SaveCard = [];
            message.Extra = [];
            message.listPlayer = [];
            data2.forEach((element) => {
                var p = element.split(SocketConstant.SEPERATOR.ELEMENT);
                var player = {};
                player.userId = p[0];
                player.resultMoney = p[1];
                player.money = p[2];
                // player.message = Utils.Decoder.decode(p[2]);
                // player.listCard = CardUtils.parseSamCard(p[3]);
                player.isOut = p[3];
                player.isBankrupt = p[4];
                if(p.length>5 && player.userId==Linker.userData.userId){
                    message.myMoney=p[5];
                }
                if(p.length>6){
                    player.heaplist=p[6].split('#');
                }
                player.level = p[7];
                player.levelUpMoney = p[8];
                if(p.length>10){
                    var extra={};
                    extra.point=p[9];
                    extra.cardDataList=CardUtils.parsePokerCard(p[10]);
                    extra.userId=player.userId;
                    message.Extra.push(extra);
                }
                if(p.length>11){
                    var SaveCard={};
                    SaveCard.listCard=CardUtils.parsePokerCard(p[11]);
                    SaveCard.userId=player.userId;
                    message.SaveCard.push(SaveCard);
                }
                message.listPlayer.push(player);

            });
            console.log('*** lst end game 1104', message);
        } else {
            message.error = data;
        }
        return message;
    },
    parse_1105_message(messageId, status, data) {
        var message = {
            messageId: messageId,
            status: status,
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

            message.idDeal = gameInfo[6];
            message.idSmall = gameInfo[7];
            message.idBig = gameInfo[8];
            message.idFirst = gameInfo[9];
            message.baichung = CardUtils.parsePokerCard(gameInfo[11]);
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
                if (player.userId == message.isDeal) {
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
            player.turnedCardList = [];
            message.player = player;

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
            message.index = gameInfo[2];
            message.maxCapacity = gameInfo[3];
            message.isPlaying = gameInfo[4];

            if(message.isPlaying){
                message.idXDeal = gameInfo[5];
                message.currentPlayerId = gameInfo[6];
                message.sum = gameInfo[7];
                message.selfCardList = CardUtils.parsePokerCard(gameInfo[8]);	
                
                message.biglist = CardUtils.parsePokerCard(gameInfo[10]);	
            }

         
            message.listPlayer = [];
            var playerStr = value[1].split(SocketConstant.SEPERATOR.ARRAY);
            for (var i = 0; i < playerStr.length; i++) {
                var p = playerStr[i].split(SocketConstant.SEPERATOR.ELEMENT);
                var player = new Player();
                player.userId = p[0];
                player.viewName = p[1];
                player.userMoney = p[2];
                player.isObserver=p[4];


                if (player.userId == message.idXDeal) {
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

            
				if(player.userId==message.idXDeal)
					player.isMaster=true;
				else
					player.isMaster=false;
				// if(message.isPlaying==true && player.state==2)
				// {
                    player.a = p[5];
                    player.b = p[6];
				// dd[k] = new PlayerInfoL(player.id, b, a);
				// r.johnlist.add(dd[k]);
				// k++;
				// }						
				if(p.length>7)
				{
				if(player.userId==Linker.userData.userId)
					message.tiendetheo =p[7];
				}
				


                message.listPlayer.push(player);
            }

console.log('*** reconnect',message);
        } else {
            message.error = data;
        }

        return message;
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
            console.log('*** 1112',tempArray);
            message.nextTurnId = tempArray[0];
            message.betWin = CardUtils.parseSamCard(tempArray[1]);
            message.listCard = CardUtils.parsePokerCard(tempArray[2]);
            message.myPoint = tempArray[3];
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
            message.idXDeal = tempArray[0];
            message.tableId = tempArray[1];
            message.idXSmall = tempArray[2];
            message.idXBig = tempArray[3];
            message.idXStart = tempArray[4];
            message.selfCardList = CardUtils.parsePokerCard(tempArray[5]);

        } else {
            message.error = data;
        }
        return message;
    },
}
module.exports = PokerParse;