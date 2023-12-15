var Linker = require('Linker');
var CommonParse = require('CommonParse');
var BiDaParse =  require('BiDaParse');
var FootBallParse = require("FootBallParse");
var XocDiaParse = require('XocDiaParse');
var soccerGalaxyParse = require('soccerGalaxyParse');
var HeadBallParse = require('HeadBallParse');
var MauBinhParse = require('MauBinhParse');
var ShootingParse = require('ShootingParse');
var PhiDaoParse = require("PhiDaoParse");
var PokerParse = require('PokerParse');
var GameManager1108 = {
    load: function (tempData) {
        cc.log("chay vao day", tempData);
        switch (Linker.ZONE) {
            case 4: {
                var response = CommonParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 37: {
                var response = CommonParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 10: {
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 8: {
                var response = BiDaParse.parse(tempData);
                //cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 84: {
                var response = BiDaParse.parse(tempData);
                //cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 44: {
                var response = FootBallParse.parse(tempData);
                //cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 86: {
                var response = BiDaParse.parse(tempData);
                //cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 45: {
                var response = soccerGalaxyParse.parse(tempData);
                cc.error(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 46: {
                var response = HeadBallParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 5: {
                var response = CommonParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 14: {
                var response = MauBinhParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 47: {
                var response = PhiDaoParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 48: {
                var response = ShootingParse.parse(tempData);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
            case 15: {
                var response = PokerParse.parse(tempData);
                Linker.Event.dispatchEvent(1108, response);
                break;
            }
        }
    }
}
module.exports = GameManager1108;