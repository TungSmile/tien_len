
var SocketConstant = require('SocketConstant');
var TLMNSend = {
    DemLaSettingRequest(tableId, capacity, minMoney, isHiddenCard){
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];

        var tempString = 1242 + SocketConstant.SEPERATOR.N4 + 5 + SocketConstant.SEPERATOR.ELEMENT + tableId + SocketConstant.SEPERATOR.ELEMENT + capacity
            + SocketConstant.SEPERATOR.ELEMENT + minMoney + SocketConstant.SEPERATOR.ELEMENT + isHiddenCard;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },

    DemLaTurnRequest(zoneId, tableId, cardstr){
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var cardString = '';
        if(cardstr){
            for(var i=0; i<cardstr.length; i++){
                if(i==cardstr.length-1) cardString += cardstr[i];
                else cardString += cardstr[i] + '#';
            }
        }
        else{}
        var tempString = 1104 + SocketConstant.SEPERATOR.N4 + zoneId + SocketConstant.SEPERATOR.ELEMENT + tableId +
            SocketConstant.SEPERATOR.ELEMENT + cardString
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
module.exports = TLMNSend;