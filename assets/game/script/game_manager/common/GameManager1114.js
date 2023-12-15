var Linker = require('Linker');
var BiDaParse =  require('BiDaParse');
var XocDiaParse = require('XocDiaParse');
var soccerGalaxyParse = require('soccerGalaxyParse');
var HeadBallParse = require("HeadBallParse");
var TLMNParse = require('TLMNParse');
var PhomParse = require('PhomParse');
var MauBinhParse = require('MauBinhParse');
var ShootingParse = require('ShootingParse');
var PhiDaoParse = require("PhiDaoParse");
var FootBallparse = require("FootBallParse");
var PokerParse = require('PokerParse');
var GameManager1114 = {
    load: function (tempData) {
        switch (Linker.ZONE) {
            case 8: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
            case 84: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
            case 86: {
                var response = BiDaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
            case 10: {
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
            case 22: {
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
            case 44:
                {
                    var response = FootBallparse.parse(tempData);
                    cc.log(response);
                    Linker.Event.dispatchEvent(1114, response);
                    break;
                }
            case 45: {
                var response = soccerGalaxyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
            case 46: {
                cc.log(tempData);
                var response = HeadBallParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
            case 5: {
                var response = TLMNParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
            case 4: {
                var response = PhomParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
            case 14: {
                var response = MauBinhParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
            case 47: {
                var response = PhiDaoParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
            case 48: {
                var response = ShootingParse.parse(tempData);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
            case 15: {
                var response = PokerParse.parse(tempData);
                Linker.Event.dispatchEvent(1114, response);
                break;
            }
        }
    }
}
module.exports = GameManager1114;