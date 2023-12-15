var Linker = require('Linker');
var soccerGalaxyParse = require('soccerGalaxyParse');
var FootBallParse = require("FootBallParse");
var BiDaParse =  require('BiDaParse');
var HeadBallParse = require('HeadBallParse');
var TLMNParse = require("TLMNParse");
var PhomParse = require('PhomParse');
var ShootingParse = require('ShootingParse');
var PhiDaoParse = require("PhiDaoParse");
var PokerParse =  require('PokerParse');
var GameManager1104 = {
    load: function (tempData) {

        switch (Linker.ZONE) {
            case 8: {
                var response = BiDaParse.parse(tempData);
                Linker.Event.dispatchEvent(1104, response);
                break;
            }
            case 84: {
                var response = BiDaParse.parse(tempData);
                Linker.Event.dispatchEvent(1104, response);
                break;
            }
            case 44: {
                cc.error(tempData);
                var response = FootBallParse.parse(tempData);
                Linker.Event.dispatchEvent(1104, response);
                break;
            }
            case 86: {
                var response = BiDaParse.parse(tempData);
                Linker.Event.dispatchEvent(1104, response);
                break;
            }
            case 45: {
                var response = soccerGalaxyParse.parse(tempData);
                Linker.Event.dispatchEvent(1104, response);
                cc.log(response);
                break
            }
            case 46: {
                var response = HeadBallParse.parse(tempData);
                Linker.Event.dispatchEvent(1104, response);
                break;
            }
            case 47: {
                var response = PhiDaoParse.parse(tempData);
                Linker.Event.dispatchEvent(1104, response);
                break;
            }
            case 48: {
                var response = ShootingParse.parse(tempData);
                Linker.Event.dispatchEvent(1104, response);
                break;
            }

            case 5: {
                var response = TLMNParse.parse(tempData);
                Linker.Event.dispatchEvent(1104, response);
                break;
            }
            case 4: {
                var response = PhomParse.parse(tempData);
                Linker.Event.dispatchEvent(1104, response);
                break;
            }
        }
    }
}
module.exports = GameManager1104;