const SocketConstant = require("SocketConstant");
var PhiDaoSend = {
    sendBetSettingRequest(data) {
        if (data) {
            var arraySend = {}
            var sendData = {}
            arraySend.r = [];
            var tempString = 1242 + SocketConstant.SEPERATOR.N4 + data.zoneID +
                SocketConstant.SEPERATOR.ELEMENT + data.matchID +
                SocketConstant.SEPERATOR.ELEMENT + data.isFastPlay +
                SocketConstant.SEPERATOR.ELEMENT + data.ballErrorId +
                SocketConstant.SEPERATOR.ELEMENT + data.userId +
                SocketConstant.SEPERATOR.ELEMENT + data.status +
                SocketConstant.SEPERATOR.ELEMENT + data.money
            sendData.v = tempString;
            arraySend.r.push(sendData);
            return JSON.stringify(arraySend);
        }
        return null;
    },
    onTurnRequest(zoneId, tableId, data) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        data.hitTarget = data.hitTarget ? true : false;
        var tempString = 1104 +
            SocketConstant.SEPERATOR.N4 + zoneId +
            SocketConstant.SEPERATOR.ELEMENT + tableId +
            SocketConstant.SEPERATOR.ELEMENT + data.hitTarget +
            SocketConstant.SEPERATOR.ELEMENT + data.isGift +
            SocketConstant.SEPERATOR.ELEMENT + data.iconId
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
}
module.exports = PhiDaoSend;