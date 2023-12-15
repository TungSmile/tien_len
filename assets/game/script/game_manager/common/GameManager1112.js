var Linker = require('Linker');
var BiDaParse =  require('BiDaParse');
var TLMNParse = require("TLMNParse");
var PhomParse = require('PhomParse');
var PokerParse =  require('PokerParse');
var GameManager1112 = {
    load: function (tempData) {

        switch (Linker.ZONE) {
            case 8: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1112, response);
                break;
            }
            case 84: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1112, response);
                break;
            }
            case 86: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1112, response);
                break;
            }
            case 5: {
                var response = TLMNParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1112, response);
                break;
            }
            case 4: {
                var response = PhomParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1112, response);
                break;
            }
            case 15: {
                var response = PokerParse.parse(tempData);
                Linker.Event.dispatchEvent(1112, response);
                break;
            }
        }
    }
}
module.exports = GameManager1112;