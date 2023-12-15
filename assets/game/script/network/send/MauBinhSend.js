var SocketConstant = require('SocketConstant');
var MauBinhSend = {
    baoMauBinhRequest(tableId,isBao,dataList) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 121005 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT
            + isBao + SocketConstant.SEPERATOR.ELEMENT + dataList;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    sortRequest(tableId,cardList) {
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1245 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT +
           cardList;
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
    mbSettingRequest(tableId, capacity, minMoney, isAn, isTai){
        var arraySend = {}
        var sendData = {}
        arraySend.r = [];
        var tempString = 1242 + SocketConstant.SEPERATOR.N4 + 14 + SocketConstant.SEPERATOR.ELEMENT + tableId + SocketConstant.SEPERATOR.ELEMENT + capacity +
            SocketConstant.SEPERATOR.ELEMENT + minMoney;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
}
module.exports = MauBinhSend;