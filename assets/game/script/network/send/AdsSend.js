var Md5 = require('Md5');
var SocketConstant = require('SocketConstant');
var Linker = require('Linker');
var Constant = require('Constant');
var AdsSend = {
   
    send: function (type, comeplete,currency,amount) {
        console.log("socket send ads");
        var arraySend = {};
        
        var sendData = {};
        
        arraySend.r = [];
        var tempString = Constant.CMD.ADMOB +
            Constant.SEPERATOR.N4 + type +
            Constant.SEPERATOR.ELEMENT + comeplete;
            Constant.SEPERATOR.ELEMENT + currency;
            Constant.SEPERATOR.ELEMENT + amount;
        sendData.v = tempString;
        arraySend.r.push(sendData);
        var strSend = JSON.stringify(arraySend);
        if(Linker.Socket){
            Linker.Socket.send(strSend);
        }else{
            console.log("ko co socket");
        }
       
    }
}
module.exports = AdsSend;