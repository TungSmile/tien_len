var Md5 = require('Md5');
var SocketConstant = require('SocketConstant');
var PhomSend = {
    anBaiRequest(tableId) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1126 + SocketConstant.SEPERATOR.N4 + tableId
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
        var tempString = 1125 + SocketConstant.SEPERATOR.N4 + tableId
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    guiBaiRequest(tableId , guiPlayerId , guiPhomId , cardServer,uidNguoiGui) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1128 + SocketConstant.SEPERATOR.N4 + tableId + SocketConstant.SEPERATOR.ELEMENT +
            guiPlayerId + SocketConstant.SEPERATOR.ELEMENT + cardServer + SocketConstant.SEPERATOR.ELEMENT+ guiPhomId+ SocketConstant.SEPERATOR.ELEMENT+ uidNguoiGui;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    haPhomRequest(tableId , phomList= "", card = 0 , uType= 0) {
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
    phomSettingRequest(tableId , capacity , minMoney , isAn , isTai) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1242 + SocketConstant.SEPERATOR.N4 + 4 + SocketConstant.SEPERATOR.ELEMENT + tableId + SocketConstant.SEPERATOR.ELEMENT + capacity
            + SocketConstant.SEPERATOR.ELEMENT + minMoney + SocketConstant.SEPERATOR.ELEMENT + isAn + SocketConstant.SEPERATOR.ELEMENT
            +1+SocketConstant.SEPERATOR.ELEMENT +isTai;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    turnCardRequest(zoneId, tableId , card) {
        var arraySend = {
        }
        var sendData = {
        }
        arraySend.r = [];
        var tempString = 1104 + SocketConstant.SEPERATOR.N4 + zoneId + SocketConstant.SEPERATOR.ELEMENT + tableId +
            SocketConstant.SEPERATOR.ELEMENT +card
        sendData.v = tempString;
        arraySend.r.push(sendData);
        return JSON.stringify(arraySend);
    },
    uKhanRequest(tableId , phomList) {
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
    }
}
module.exports = PhomSend;