var Linker = require('Linker');
var BiDaParse =  require('BiDaParse');
var soccerGalaxyParse = require('soccerGalaxyParse');
var TLMNParse =  require('TLMNParse');
var MauBinhParse =  require('MauBinhParse');
var PhomParse =  require('PhomParse');
var PhiDaoParse = require("PhiDaoParse");
var PokerParse = require('PokerParse');
var GameManager1242 = {
    load: function (tempData) {


        switch (Linker.ZONE) {
            case 8: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1242, response);
                break;
            }
            case 84: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1242, response);
                break;
            }
            case 86: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1242, response);
                break;
            }
            case 45: {
                var response = soccerGalaxyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1242, response);
                break;
            }
            case 5: {
                var response = TLMNParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1242, response);
                break;
            }
            case 14: {
                var response = MauBinhParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1242, response);
                break;
            }
            case 4: {
                var response = PhomParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1242, response);
                break;
            }
            case 47: {
                var response = PhiDaoParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1242, response);
                break;
            }
            case 15: {
                var response = PokerParse.parse(tempData);
                Linker.Event.dispatchEvent(1242, response);
                break;
            }
        }
    }
}
module.exports = GameManager1242;
