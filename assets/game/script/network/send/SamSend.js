var Md5 = require('Md5');
var SocketConstant = require('SocketConstant');
var SamSend = {
    samSettingRequest(tableId , capacity , minMoney , isAn , isTai) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1242 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT + capacity
            + SocketConstant.SEPERATOR.ELEMENT + minMoney;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    DemLaTurnRequest(tableId,CardString){
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1104 + SocketConstant.SEPERATOR.N4 +'5'+SocketConstant.SEPERATOR.ELEMENT+ tableId;
        if(CardString){
            tempString=tempString + SocketConstant.SEPERATOR.ELEMENT + CardString;
        }
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    BaoSam(tableId,isBaoSam){
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1131 + SocketConstant.SEPERATOR.N4 + tableId +SocketConstant.SEPERATOR.ELEMENT+isBaoSam;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    }

}
module.exports = SamSend;