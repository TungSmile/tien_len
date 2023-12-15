var Md5 = require('Md5');
var SocketConstant = require('SocketConstant');
var Linker = require('Linker');
var SoccerGalaxySend = {
    anBaiRequest(tableId) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1126 + SocketConstant.SEPERATOR.N4 + tableId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    bocBaiRequest(tableId) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1125 + SocketConstant.SEPERATOR.N4 + tableId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    guiBaiRequest(tableId, guiPlayerId, guiPhomId, cardServer, uidNguoiGui) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1128 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT +
            guiPlayerId + SocketConstant.SEPERATOR.ELEMENT + cardServer + SocketConstant.SEPERATOR.ELEMENT + guiPhomId + SocketConstant.SEPERATOR.ELEMENT + uidNguoiGui;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    haPhomRequest(tableId, phomList = "", card = 0, uType = 0) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1127 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT +
            + uType + SocketConstant.SEPERATOR.ELEMENT + phomList + SocketConstant.SEPERATOR.ELEMENT + card;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    sendGocXoayLuc: function (zoneId, tableId, datas) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1104 +
            SocketConstant.SEPERATOR.N4 + zoneId +
            SocketConstant.SEPERATOR.ELEMENT + tableId +
            SocketConstant.SEPERATOR.ELEMENT + datas.shootStatus +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerPosX +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerPosY +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerId +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerForce +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerVelocityX +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerVelocityY +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerRotation +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballX +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballY;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    sendLucShoot: function (zoneId, tableId, datas) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1104 +
            SocketConstant.SEPERATOR.N4 + zoneId +
            SocketConstant.SEPERATOR.ELEMENT + tableId +
            SocketConstant.SEPERATOR.ELEMENT + datas.shootStatus +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerPosX +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerPosY +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerId +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerForce +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerVelocityX +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerVelocityY +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerRotation +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballX +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballY;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    sendKetquaLuotDanh: function (zoneId, tableId, datas) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1104 +
            SocketConstant.SEPERATOR.N4 + zoneId +
            SocketConstant.SEPERATOR.ELEMENT + tableId +
            SocketConstant.SEPERATOR.ELEMENT + datas.shootStatus +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerPosX +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerPosY +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerId +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerForce +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerVelocityX +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerVelocityY +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerRotation +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballX +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballY +
            SocketConstant.SEPERATOR.ELEMENT + datas.hitGoal +
            SocketConstant.SEPERATOR.ELEMENT + datas.hitGoalLeft +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerPositions +
            SocketConstant.SEPERATOR.ELEMENT + datas.playerChangePositions +
            SocketConstant.SEPERATOR.ELEMENT + datas.otp;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    turnCardRequest(zoneId, tableId, datas) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var clientErrorID = (datas.ballHit && datas.ballHit != undefined) ? datas.ballHit : 1;
        var ballTargetRotation = (datas.ballTargetRotation && datas.ballTargetRotation != undefined) ? datas.ballTargetRotation : null;
        var tempString = 1104 +
            SocketConstant.SEPERATOR.N4 + zoneId +
            SocketConstant.SEPERATOR.ELEMENT + tableId +
            SocketConstant.SEPERATOR.ELEMENT + datas.cueStatus +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballX +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballY +
            SocketConstant.SEPERATOR.ELEMENT + datas.cueR +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballEat +
            SocketConstant.SEPERATOR.ELEMENT + datas.ballList +
            SocketConstant.SEPERATOR.ELEMENT + clientErrorID;//nvm -1 la co loi
        if (isNaN(parseFloat(ballTargetRotation)) == false) {
            tempString = tempString + SocketConstant.SEPERATOR.ELEMENT + ballTargetRotation;
        }
        if (datas.otp) {
            tempString = tempString + SocketConstant.SEPERATOR.ELEMENT + datas.otp;
        }
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    uKhanRequest(tableId, phomList) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1127 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT +
            + 2 + SocketConstant.SEPERATOR.ELEMENT + phomList + SocketConstant.SEPERATOR.ELEMENT + 0;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    
    
    sendChatPrivate(str) {
        var data = { r: [] };
        data.r.push({ v: str });
        return JSON.stringify(data);
    },

    sendChangeMoneyType(money) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1243 + SocketConstant.SEPERATOR.N4 + money
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },

    sendRequestLuckyShot(typePlay, mucCuoc, lines, idSpin) {
        var arraySend = {};
        var sendData = {};
        arraySend.r = [];
        var tempString = 1005 + SocketConstant.SEPERATOR.N4 + typePlay + SocketConstant.SEPERATOR.ELEMENT + 901 + SocketConstant.SEPERATOR.ELEMENT + mucCuoc
            + SocketConstant.SEPERATOR.ELEMENT + lines + SocketConstant.SEPERATOR.ELEMENT + idSpin;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    sendSettingRequest(data) {
        if (data) {
            var arraySend = {}
            var sendData = {}
            arraySend.r = [];
            var tempString = 1242 + SocketConstant.SEPERATOR.N4 + data.zoneID +
                SocketConstant.SEPERATOR.ELEMENT + data.matchID +
                SocketConstant.SEPERATOR.ELEMENT + data.isFastPlay +
                SocketConstant.SEPERATOR.ELEMENT + data.ballErrorId +
                SocketConstant.SEPERATOR.ELEMENT + data.uidChange +
                SocketConstant.SEPERATOR.ELEMENT + data.formationId +
                SocketConstant.SEPERATOR.ELEMENT + data.style +
                SocketConstant.SEPERATOR.ELEMENT + data.maxAutoNextTurn +
                SocketConstant.SEPERATOR.ELEMENT + data.goalNumber +
                SocketConstant.SEPERATOR.ELEMENT + data.isFormation;
            sendData.v = tempString;
            arraySend.r.push(sendData);
            return JSON.stringify(arraySend);
        }
        return null;
    },
}
module.exports = SoccerGalaxySend;