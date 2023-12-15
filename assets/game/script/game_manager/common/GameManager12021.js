var Linker = require('Linker');
var BiDaParse =  require('BiDaParse');
var FootBallParse = require("FootBallParse");
var XocDiaParse = require('XocDiaParse');
var soccerGalaxyParse = require('soccerGalaxyParse');
var HeadBallParse = require('HeadBallParse');
var TLMNParse = require('TLMNParse');
var PhomParse = require('PhomParse');
var MauBinhParse = require('MauBinhParse');
var ShootingParse = require('ShootingParse');
var PhiDaoParse = require("PhiDaoParse");
var PokerParse = require('PokerParse');
var LobbyParse = require("LobbyParse");


var GameManager12021 = {
    load: function (tempData) {
     
        switch (Linker.ZONE) {
            case 48: {
                var response = LobbyParse.parse(tempData);
                if (Number(response.messageId) == 12021)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 4: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 5: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 37: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 10: {
                var response = XocDiaParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 15: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 14: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 11: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 9: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 8: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 84: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 86: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 44: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 45: {
                //soccer galaxy
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }

                break;
            }

            case 46: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
            case 47: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                if (response.messageId)
                {
                    Linker.Event.dispatchEvent(12021, response);
                }
                else
                {
                    Linker.Event.dispatchEvent(1105, response);
                }
                break;
            }
        }
    }
}
module.exports = GameManager12021;