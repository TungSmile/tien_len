var Md5 = require('Md5');
var SocketConstant = require('SocketConstant');
var SamSend = {
    pokerSettingRequest(tableId, capacity, minMoney, isAn, isTai) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1242 + SocketConstant.SEPERATOR.N4 + 15 + SocketConstant.SEPERATOR.ELEMENT + tableId + SocketConstant.SEPERATOR.ELEMENT + capacity +
            SocketConstant.SEPERATOR.ELEMENT + minMoney;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    DemLaTurnRequest(tableId, CardString) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1104 + SocketConstant.SEPERATOR.N4 + '5' + SocketConstant.SEPERATOR.ELEMENT + tableId;
        if (CardString) {
            tempString = tempString + SocketConstant.SEPERATOR.ELEMENT + CardString;
        }
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    joinTableRequest(tableId,mMoney) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1105 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT + mMoney;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    WithdrawMoneyRequest(tableId,mMoney) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 121010 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT + mMoney;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    SendMoneyRequest(tableId,mMoney) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 2000 + SocketConstant.SEPERATOR.N4 +'15'+SocketConstant.SEPERATOR.ELEMENT+ tableId + SocketConstant.SEPERATOR.ELEMENT + mMoney;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    GuestStand(tableId) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 121008 + SocketConstant.SEPERATOR.N4 +tableId;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },

}
module.exports = SamSend;