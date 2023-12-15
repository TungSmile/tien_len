var Linker = require('Linker');
var LobbyParse = require('LobbyParse');
var GameManager1246 = {
    load: function (tempData) {

        switch (Linker.ZONE) {
            case 5: {
                //tlmn
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 14: {
                //mậu binh
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 4: {
                //phỏm
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 37: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 15: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 9: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 10: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 22: {
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 8: {
                //bida 11
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 84: {
                //bida 14
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 86: {
                //bida phỏm
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 44: {
                //football
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 45: {
                //soccer
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
            case 46: {
                //head ball
                var response = LobbyParse.parse(tempData);
                cc.log(response);
                Linker.Event.dispatchEvent(1246, response);
                break;
            }
        }
    }
}
module.exports = GameManager1246;